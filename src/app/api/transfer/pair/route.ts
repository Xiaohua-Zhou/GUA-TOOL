import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

// 创建配对
export async function POST(request: NextRequest) {
  try {
    const { deviceId, deviceName } = await request.json();

    if (!deviceId || !deviceName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 生成6位数字配对码（确保唯一）
    let pairCode = '';
    do {
      pairCode = Math.floor(100000 + Math.random() * 900000).toString();
    } while (db.prepare('SELECT 1 FROM device_pairs WHERE pair_code = ?').get(pairCode) !== undefined);

    const pairId = crypto.randomUUID();
    // 配对码5分钟后过期
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    db.prepare(
      `INSERT INTO device_pairs (id, pair_code, device_1_id, device_1_name, status, expires_at)
       VALUES (?, ?, ?, ?, 'pending', ?)`
    ).run(pairId, pairCode, deviceId, deviceName, expiresAt);

    return NextResponse.json({
      pairId,
      pairCode,
      expiresAt,
    });
  } catch (error) {
    console.error('Error in POST /api/transfer/pair:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 获取配对状态
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pairId = searchParams.get('pairId');

    if (!pairId) {
      return NextResponse.json({ error: 'pairId is required' }, { status: 400 });
    }

    const row = db.prepare('SELECT * FROM device_pairs WHERE id = ?').get(pairId) as unknown as PairRow | undefined;

    if (!row) {
      return NextResponse.json({ error: 'Pair not found' }, { status: 404 });
    }

    // 检查是否过期
    if (new Date(row.expires_at) < new Date()) {
      db.prepare("UPDATE device_pairs SET status = 'expired' WHERE id = ?").run(pairId);
      return NextResponse.json({ ...row, status: 'expired' });
    }

    return NextResponse.json(row);
  } catch (error) {
    console.error('Error in GET /api/transfer/pair:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
