import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';

// 数据目录：项目根目录下的 .data
const dataDir = path.join(process.cwd(), '.data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 上传文件目录
export const uploadsDir = path.join(dataDir, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 全局单例，避免开发模式下重复连接
const globalForDb = globalThis as unknown as { __guatoolsDb?: DatabaseSync };

function createDb(): DatabaseSync {
  // 使用 Node.js 内置的 node:sqlite，无需原生编译、零外部依赖
  const db = new DatabaseSync(path.join(dataDir, 'guatools.db'));

  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA busy_timeout = 5000');

  db.exec(`
    CREATE TABLE IF NOT EXISTS device_pairs (
      id TEXT PRIMARY KEY,
      pair_code TEXT NOT NULL UNIQUE,
      device_1_id TEXT NOT NULL,
      device_1_name TEXT NOT NULL,
      device_2_id TEXT,
      device_2_name TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_device_pairs_pair_code ON device_pairs(pair_code);
    CREATE INDEX IF NOT EXISTS idx_device_pairs_status ON device_pairs(status);
    CREATE INDEX IF NOT EXISTS idx_device_pairs_expires_at ON device_pairs(expires_at);

    CREATE TABLE IF NOT EXISTS transfers (
      id TEXT PRIMARY KEY,
      pair_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      type TEXT NOT NULL,
      content TEXT,
      file_url TEXT,
      file_name TEXT,
      file_size INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_transfers_pair_id ON transfers(pair_id);
    CREATE INDEX IF NOT EXISTS idx_transfers_receiver_id ON transfers(receiver_id);
    CREATE INDEX IF NOT EXISTS idx_transfers_created_at ON transfers(created_at);
  `);

  return db;
}

export const db = globalForDb.__guatoolsDb ?? createDb();

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__guatoolsDb = db;
}
