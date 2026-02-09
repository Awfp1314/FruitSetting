# 快速开始指南

## 🚀 5 分钟上手

### 1️⃣ 克隆项目

```bash
git clone <your-repo-url>
cd laowang-toolbox
```

### 2️⃣ 安装依赖

```bash
npm install
```

### 3️⃣ 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 查看应用

### 4️⃣ 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录

## 📱 功能使用

### 水果促销文案生成器

1. 在主页点击「水果促销群文案」卡片
2. 在「编辑」标签页填写信息：
   - 赶集地点
   - 位置描述
   - 今日主打水果
   - 价格信息
   - 福利信息
3. 切换到「预览」标签页查看效果
4. 点击「复制文案」按钮一键复制
5. 粘贴到微信群即可

### PWA 安装

**手机端：**

1. 用浏览器打开应用
2. 点击右上角「安装APP」或「添加至桌面」
3. 确认安装
4. 在桌面找到图标，像原生 APP 一样使用

**电脑端：**

1. Chrome/Edge 浏览器会在地址栏显示安装图标
2. 点击安装
3. 应用会在独立窗口打开

## 🔧 开发技巧

### 热更新

修改代码后自动刷新，无需手动重启

### 查看构建产物

```bash
npm run preview
```

### 清理缓存

```bash
# Windows
rmdir /s /q node_modules dist
npm install

# Mac/Linux
rm -rf node_modules dist
npm install
```

## 🐛 常见问题

### Q: 端口被占用？

A: 修改 `vite.config.js` 中的端口号

### Q: 样式不生效？

A: 检查 Tailwind 配置，确保 `content` 路径正确

### Q: 构建失败？

A: 删除 `node_modules` 和 `package-lock.json`，重新安装

### Q: PWA 不能离线？

A: 检查 Service Worker 是否注册成功（F12 -> Application -> Service Workers）

## 📚 下一步

- 阅读 [README.md](./README.md) 了解项目详情
- 查看 [STRUCTURE.md](./STRUCTURE.md) 了解项目结构
- 查看 [CHANGELOG.md](./CHANGELOG.md) 了解更新历史

## 💡 提示

- 所有数据保存在浏览器本地，不会上传服务器
- 支持离线使用，没网也能用
- 可以安装到手机桌面，像 APP 一样使用
- 修改后自动保存，下次打开还在

---

遇到问题？欢迎提 Issue！
