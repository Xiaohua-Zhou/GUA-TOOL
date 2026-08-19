import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { db, uploadsDir } from '@/lib/db';

interface TransferRow {
  id: string;
  pair_id: string;
}

// 提供上传文件的直接访问（用于 <img src> 预览）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pairId = searchParams.get('pairId');
    const name = searchParams.get('name');

    if (!pairId || !name) {
      return NextResponse.json({ error: 'pairId and name are required' }, { status: 400 });
    }

    // 验证文件名合法性，防止路径穿越
    const safeName = path.basename(name);
    if (safeName !== name) {
      return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
    }

    // 验证传输记录存在
    const transfer = db
      .prepare('SELECT id, pair_id FROM transfers WHERE pair_id = ?')
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
    headers.set('Cache-Control', 'public, max-age=3600');

    return new NextResponse(blob as unknown as BodyInit, { headers });
  } catch (error) {
    console.error('Error in GET /api/transfer/file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
