import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface TransferRow {
  id: string;
  pair_id: string;
  sender_id: string;
  receiver_id: string;
  type: string;
  content: string | null;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  created_at: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pairId = searchParams.get('pairId');
    const deviceId = searchParams.get('deviceId');

    if (!pairId || !deviceId) {
      return NextResponse.json({ error: 'pairId and deviceId are required' }, { status: 400 });
    }

    // 查询发送给当前设备的传输记录
    const rows = db
      .prepare(
        `SELECT * FROM transfers
         WHERE pair_id = ? AND receiver_id = ?
         ORDER BY created_at ASC
         LIMIT 100`
      )
      .all(pairId, deviceId) as unknown as TransferRow[];

    return NextResponse.json({ transfers: rows });
  } catch (error) {
    console.error('Error in GET /api/transfer/receive:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
