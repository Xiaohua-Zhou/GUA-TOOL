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

export async function POST(request: NextRequest) {
  try {
    const { pairCode, deviceId, deviceName } = await request.json();

    if (!pairCode || !deviceId || !deviceName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 查找配对码
    const pair = db
      .prepare("SELECT * FROM device_pairs WHERE pair_code = ? AND status = 'pending'")
      .get(pairCode) as PairRow | undefined;

    if (!pair) {
      return NextResponse.json({ error: 'Invalid or expired pair code' }, { status: 404 });
    }

    // 不能与自己配对
    if (pair.device_1_id === deviceId) {
      return NextResponse.json({ error: 'Cannot pair with yourself' }, { status: 400 });
    }

    // 检查是否过期
    if (new Date(pair.expires_at) < new Date()) {
      db.prepare("UPDATE device_pairs SET status = 'expired' WHERE id = ?").run(pair.id);
      return NextResponse.json({ error: 'Pair code expired' }, { status: 400 });
    }

    // 更新配对信息
    db.prepare(
      "UPDATE device_pairs SET device_2_id = ?, device_2_name = ?, status = 'paired' WHERE id = ?"
    ).run(deviceId, deviceName, pair.id);

    const updatedPair = db.prepare('SELECT * FROM device_pairs WHERE id = ?').get(pair.id) as unknown as PairRow;

    return NextResponse.json({
      pairId: updatedPair.id,
      device1Name: updatedPair.device_1_name,
      device2Name: updatedPair.device_2_name,
      status: updatedPair.status,
    });
  } catch (error) {
    console.error('Error in POST /api/transfer/pair/verify:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
