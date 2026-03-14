import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '..', 'data', 'news.db');

// 确保 data 目录存在
import { mkdirSync } from 'fs';
mkdirSync(join(__dirname, '..', 'data'), { recursive: true });

const db = new Database(dbPath);

// 创建新闻表
db.exec(`
  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    link TEXT UNIQUE NOT NULL,
    summary TEXT,
    source TEXT NOT NULL,
    category TEXT,
    published_at TEXT NOT NULL,
    fetched_at TEXT DEFAULT CURRENT_TIMESTAMP,
    ai_summary TEXT,
    tags TEXT
  )
`);

// 创建索引
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_published_at ON news(published_at DESC);
  CREATE INDEX IF NOT EXISTS idx_source ON news(source);
  CREATE INDEX IF NOT EXISTS idx_category ON news(category);
`);

console.log('✅ 数据库初始化完成:', dbPath);
db.close();
