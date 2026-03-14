# AI 新闻聚合网站

自动收集全球 AI 相关新闻，每小时更新。

## 技术栈

- **前端**: Astro (静态生成)
- **后端**: Node.js + RSS parser
- **数据库**: SQLite
- **部署**: Vercel
- **定时任务**: GitHub Actions

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 初始化数据库

```bash
npm run init
```

### 3. 本地开发

```bash
npm run dev
```

### 4. 手动抓取新闻

```bash
npm run fetch
```

### 5. 构建

```bash
npm run build
```

## 部署到 Vercel

1. 在 GitHub 创建仓库并推送代码
2. 在 Vercel 导入仓库
3. 自动部署完成

## 配置数据源

编辑 `scripts/fetch-news.js` 中的 `RSS_FEEDS` 数组，添加或删除 RSS 源。

## 目录结构

```
ai-news-aggregator/
├── scripts/
│   ├── init-db.js      # 数据库初始化
│   └── fetch-news.js   # 新闻抓取脚本
├── src/
│   └── pages/
│       └── index.astro # 主页
├── data/
│   └── news.db         # SQLite 数据库 (自动生成)
├── .github/
│   └── workflows/
│       └── fetch-news.yml  # GitHub Actions
├── astro.config.mjs
├── package.json
└── README.md
```

## 许可证

MIT
