# 摆摊小助手

![React](https://img.shields.io/badge/React-18.2-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)
![PWA](https://img.shields.io/badge/PWA-enabled-5A0FC8.svg)

专为摆摊人打造的实用工具集 PWA 应用。

🌐 **在线访问**: [https://www.uetookit.icu](https://www.uetookit.icu)

## 功能

- 🗓️ 赶集日历 - 基于农历的赶集日提醒
- 📒 记账本 - 进货、销售、库存、利润管理
- 📝 促销文案 - 一键生成群发文案
- 🤖 AI 助手 - 智能问答

## 📱 功能展示

### 赶集日历

![赶集日历](screenshots/screenshot-calendar.jpg)

### 记账本

![记账本](screenshots/screenshot-accounting.jpg)

### 促销文案生成

![促销文案](screenshots/screenshot-promotion.jpg)

### AI 助手

![AI 助手](screenshots/screenshot-ai.jpg)

## 技术栈

React 18 + Vite + Tailwind CSS + PWA

## 开发

```bash
npm install
npm run dev       # 开发服务器
npm run build     # 构建
npm run release   # 发布新版本（交互式）
```

## 部署

推送到 main 分支后 Vercel 自动部署。

## 数据

所有数据保存在浏览器本地 localStorage，不上传服务器。
