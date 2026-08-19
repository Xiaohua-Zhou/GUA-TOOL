import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { db, uploadsDir } from '@/lib/db';

interface PairRow {
  id: string;
  pair_code: string;
  device_1_id: string;
  device_1_name: string;
  device_2_id: string | null;
  device_2_name: string | null;
  status: 'pending' | 'paired' | 'expired';
  expires_at: string;
  created_at: string;
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const pairId = formData.get('pairId') as string;
    const senderId = formData.get('senderId') as string;
    const type = formData.get('type') as string; // 'text' | 'image' | 'file'

    if (!pairId || !senderId || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 获取配对信息
    const pair = db
      .prepare("SELECT * FROM device_pairs WHERE id = ? AND status = 'paired'")
      .get(pairId) as unknown as PairRow | undefined;

    if (!pair) {
      return NextResponse.json({ error: 'Pair not found or not paired' }, { status: 404 });
    }

    // 确定接收方设备ID
    const receiverId = pair.device_1_id === senderId ? pair.device_2_id : pair.device_1_id;
    if (!receiverId) {
      return NextResponse.json({ error: 'Pair is not fully connected' }, { status: 400 });
    }

    let content: string | null = null;
    let fileUrl: string | null = null;
    let fileName: string | null = null;
    let fileSize: number | null = null;

    if (type === 'text') {
      content = formData.get('content') as string;
    } else if (type === 'image' || type === 'file') {
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      // 验证文件大小（10MB 限制）
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return NextResponse.json(
          {
            error: '文件大小超过限制',
            details: `文件大小为 ${formatFileSize(file.size)}，最大允许 10MB`,
          },
          { status: 400 }
        );
      }

      // 将文件保存到本地磁盘
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      // 使用 UUID 作为文件名，避免路径注入和冲突
      const storedName = crypto.randomUUID() + path.extname(file.name || '');
      const pairDir = path.join(uploadsDir, pairId);
      const filePath = path.join(pairDir, storedName);

      await fs.mkdir(pairDir, { recursive: true });
      await fs.writeFile(filePath, fileBuffer);

      // 通过 /api/transfer/file 提供文件访问
      fileUrl = `/api/transfer/file?pairId=${pairId}&name=${storedName}`;
      fileName = file.name;
      fileSize = file.size;
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    // 保存传输记录
    const transferId = crypto.randomUUID();
    db.prepare(
      `INSERT INTO transfers (id, pair_id, sender_id, receiver_id, type, content, file_url, file_name, file_size)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(transferId, pairId, senderId, receiverId, type, content, fileUrl, fileName, fileSize);

    const transfer = db.prepare('SELECT * FROM transfers WHERE id = ?').get(transferId) as unknown as {
      id: string;
      type: string;
      content: string | null;
      file_url: string | null;
      file_name: string | null;
      file_size: number | null;
      created_at: string;
    };

    return NextResponse.json({
      transferId: transfer.id,
      type: transfer.type,
      content: transfer.content,
      fileUrl: transfer.file_url,
      fileName: transfer.file_name,
      fileSize: transfer.file_size,
      createdAt: transfer.created_at,
    });
  } catch (error) {
    console.error('Error in POST /api/transfer/send:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
