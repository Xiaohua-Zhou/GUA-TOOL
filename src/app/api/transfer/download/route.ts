import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { db, uploadsDir } from '@/lib/db';

interface TransferRow {
  id: string;
  pair_id: string;
  file_name: string | null;
}

// 从本地磁盘读取上传的文件并返回
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fileUrl = searchParams.get('fileUrl');
    const filename = searchParams.get('filename');

    if (!fileUrl) {
      return NextResponse.json({ error: 'fileUrl is required' }, { status: 400 });
    }

    // 解析 fileUrl 中的 pairId 和存储文件名
    // 期望格式: /api/transfer/file?pairId=<pairId>&name=<storedName>
    const fileUrlObj = new URL(fileUrl, request.nextUrl.origin);
    const pairId = fileUrlObj.searchParams.get('pairId');
    const storedName = fileUrlObj.searchParams.get('name');

    if (!pairId || !storedName) {
      return NextResponse.json({ error: 'Invalid fileUrl format' }, { status: 400 });
    }

    // 验证文件名合法性，防止路径穿越
    const safeName = path.basename(storedName);
    if (safeName !== storedName) {
      return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
    }

    // 验证传输记录存在
    const transfer = db
      .prepare('SELECT id, pair_id, file_name FROM transfers WHERE pair_id = ?')
      .get(pairId) as unknown as TransferRow | undefined;

    if (!transfer) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const filePath = path.join(uploadsDir, pairId, safeName);

    let blob: Buffer;
    try {
      blob = await fs.readFile(filePath);
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // 解析 MIME 类型
    const ext = path.extname(safeName).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    };
    const mimeType = mimeMap[ext] || 'application/octet-stream';

    const headers = new Headers();
    headers.set('Content-Type', mimeType);
    headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename || transfer.file_name || 'download')}"`);

    return new NextResponse(blob as unknown as BodyInit, { headers });
  } catch (error) {
    console.error('Error in GET /api/transfer/download:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
