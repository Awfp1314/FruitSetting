# 部署指南

## 🚀 Vercel 部署（推荐）

### 方式一：通过 Vercel Dashboard

1. 访问 [vercel.com](https://vercel.com)
2. 登录并点击「New Project」
3. 导入你的 Git 仓库
4. Vercel 会自动检测到 Vite 项目
5. 点击「Deploy」
6. 等待部署完成，获得线上地址

### 方式二：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 部署到生产环境
vercel --prod
```

### 自动部署

配置完成后，每次推送到 Git 仓库都会自动触发部署：

- `main` 分支 → 生产环境
- 其他分支 → 预览环境

## 🌐 其他部署平台

### Netlify

1. 访问 [netlify.com](https://netlify.com)
2. 连接 Git 仓库
3. 构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
4. 点击部署

### GitHub Pages

```bash
# 安装 gh-pages
npm install -D gh-pages

# 添加部署脚本到 package.json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}

# 部署
npm run deploy
```

注意：需要在 `vite.config.js` 设置 `base: '/仓库名/'`

### 自己的服务器

```bash
# 构建
npm run build

# 上传 dist 目录到服务器
scp -r dist/* user@server:/var/www/html/

# 或使用 FTP 工具上传
```

Nginx 配置示例：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🔧 环境变量

如果需要环境变量，创建 `.env` 文件：

```env
VITE_APP_TITLE=老王工具箱
VITE_API_URL=https://api.example.com
```

在代码中使用：

```javascript
const title = import.meta.env.VITE_APP_TITLE;
```

在 Vercel 中设置：

1. 项目设置 → Environment Variables
2. 添加变量名和值
3. 重新部署

## 📱 PWA 部署注意事项

### HTTPS 必需

PWA 必须在 HTTPS 环境下运行（localhost 除外）

### Service Worker 更新

修改代码后，Service Worker 需要时间更新：

1. 用户访问网站
2. 检测到新版本
3. 后台下载新资源
4. 下次访问时使用新版本

强制更新：

```javascript
// 在 sw.js 中修改版本号
const CACHE_VERSION = 'v2';
```

### 测试 PWA

使用 Chrome DevTools：

1. F12 打开开发者工具
2. Application → Manifest 检查配置
3. Application → Service Workers 检查状态
4. Lighthouse → PWA 检查评分

## 🔍 部署检查清单

- [ ] 构建成功无错误
- [ ] 所有页面可访问
- [ ] 图片和资源加载正常
- [ ] PWA 可以安装
- [ ] Service Worker 注册成功
- [ ] 离线功能正常
- [ ] 移动端显示正常
- [ ] 性能优化（Lighthouse 评分 > 90）

## 🐛 常见部署问题

### 404 错误

**原因**：SPA 路由问题
**解决**：配置服务器重定向所有请求到 `index.html`

### 资源加载失败

**原因**：路径配置错误
**解决**：检查 `vite.config.js` 中的 `base` 配置

### Service Worker 不更新

**原因**：缓存问题
**解决**：

1. 修改 `sw.js` 版本号
2. 清除浏览器缓存
3. 在 DevTools 中点击「Update on reload」

### 样式丢失

**原因**：Tailwind 未正确构建
**解决**：

1. 检查 `tailwind.config.js` 的 `content` 配置
2. 确保 `postcss.config.js` 存在
3. 重新构建

## 📊 性能优化

### 代码分割

Vite 自动进行代码分割，无需额外配置

### 图片优化

使用 WebP 格式，或使用 CDN

### 缓存策略

在 `sw.js` 中配置缓存策略：

- 静态资源：Cache First
- API 请求：Network First

### CDN 加速

将静态资源上传到 CDN：

- 图片
- 字体
- 第三方库

## 🔐 安全建议

- 使用 HTTPS
- 设置 CSP（Content Security Policy）
- 定期更新依赖
- 不要在前端存储敏感信息

## 📈 监控和分析

### Google Analytics

```html
<!-- 在 index.html 中添加 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Vercel Analytics

在 Vercel Dashboard 中启用 Analytics

---

部署成功后，记得测试所有功能！🎉
