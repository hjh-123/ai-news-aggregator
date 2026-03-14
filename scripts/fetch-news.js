import Database from 'better-sqlite3';
import Parser from 'rss-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 确保 data 目录存在
mkdirSync(join(__dirname, '..', 'data'), { recursive: true });

const dbPath = join(__dirname, '..', 'data', 'news.db');
const db = new Database(dbPath);

const parser = new Parser({
  customFields: {
    item: ['dc:creator', 'category']
  },
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; AI-News-Aggregator/1.0)'
  }
});

// AI 新闻源配置
const RSS_FEEDS = [
  // AI 公司官方博客
  { url: 'https://openai.com/news/rss/', source: 'OpenAI', category: 'company' },
  { url: 'https://www.anthropic.com/rss/latest', source: 'Anthropic', category: 'company' },
  
  // AI 媒体/博客
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', source: 'TechCrunch AI', category: 'media' },
  { url: 'https://arstechnica.com/ai/feed/', source: 'Ars Technica AI', category: 'media' },
  { url: 'https://www.zdnet.com/topic/artificial-intelligence/rss/', source: 'ZDNet AI', category: 'media' },
  
  // 技术社区
  { url: 'https://hnrss.org/frontpage?q=ai', source: 'Hacker News AI', category: 'community' },
  { url: 'https://www.reddit.com/r/MachineLearning/hot.rss', source: 'Reddit ML', category: 'community' },
  
  // 研究论文
  { url: 'https://arxiv.org/rss/cs.AI', source: 'arXiv AI', category: 'research' },
  { url: 'https://arxiv.org/rss/cs.LG', source: 'arXiv ML', category: 'research' },
];

async function fetchFeed(feed) {
  try {
    console.log(`📡 抓取：${feed.source} (${feed.url})`);
    const data = await parser.parseURL(feed.url);
    
    const items = data.items.map(item => ({
      title: item.title,
      link: item.link,
      summary: item.contentSnippet || item.summary || '',
      source: feed.source,
      category: feed.category,
      published_at: item.pubDate || new Date().toISOString(),
    }));
    
    return items;
  } catch (error) {
    console.error(`❌ ${feed.source} 失败:`, error.message);
    return [];
  }
}

function saveNews(items) {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO news (title, link, summary, source, category, published_at)
    VALUES (@title, @link, @summary, @source, @category, @published_at)
  `);
  
  let newCount = 0;
  for (const item of items) {
    const result = insert.run(item);
    if (result.changes > 0) newCount++;
  }
  
  return newCount;
}

async function main() {
  console.log('🚀 开始收集 AI 新闻...\n');
  
  const allItems = [];
  for (const feed of RSS_FEEDS) {
    const items = await fetchFeed(feed);
    allItems.push(...items);
    // 避免请求过快
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log(`\n📦 共获取 ${allItems.length} 条新闻`);
  
  const newCount = saveNews(allItems);
  console.log(`✅ 新增 ${newCount} 条新闻`);
  
  // 显示最新新闻
  const latest = db.prepare('SELECT title, source, published_at FROM news ORDER BY published_at DESC LIMIT 5').all();
  console.log('\n📰 最新新闻:');
  latest.forEach((n, i) => {
    console.log(`  ${i + 1}. [${n.source}] ${n.title}`);
  });
  
  db.close();
  console.log('\n✅ 完成!');
}

main().catch(console.error);
