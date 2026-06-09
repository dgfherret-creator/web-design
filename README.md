# 石书源个人作品集

React + Vite 搭建的个人作品集基础版本，内容根据简历提炼，定位为视觉设计师 / AI设计师 / 品牌设计师 / UI设计师。

## 运行

```bash
npm install
npm run dev
```

默认本地地址为 `http://127.0.0.1:5173/`。如果端口被占用，可以指定端口：

```bash
npm run dev -- --port 5174 --strictPort
```

## 构建

```bash
npm run build
```

## 内容入口

- 页面结构：[src/App.jsx](./src/App.jsx)
- 简历内容数据：[src/portfolioData.js](./src/portfolioData.js)
- 视觉样式：[src/styles.css](./src/styles.css)
- 图片与视频资产：`public/assets/`
- 临时资产生成脚本：`scripts/generate-assets.py`、`scripts/generate-video.cjs`
