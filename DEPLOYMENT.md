# Private chat 部署指南

## 架构说明

NodeCrypt 是一个**零存储**的端到端加密聊天应用：

- ✅ **不使用任何数据库或存储服务**
- ✅ 所有消息/图片通过 WebSocket 实时转发
- ✅ 使用 Cloudflare Workers Durable Object 做中转
- ✅ 数据仅在内存中转，断开连接即消失
- ✅ 完全端到端加密，服务器看不到明文

---

## 访问密码配置

### 方式一：在 Cloudflare Dashboard 设置（推荐）✅

现在密码验证通过 Cloudflare Workers API 进行，可以**随时修改，无需重新部署**！

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入您的 Worker → **设置** → **变量和密钥**
3. 添加环境变量：

| 变量名 | 值类型 | 示例值 | 说明 |
|--------|--------|--------|------|
| `VITE_ACCESS_PASSWORD` | 密钥 (Secret) | `5201314` | 访问密码 |
| `VITE_ENABLE_ACCESS_PROTECTION` | 文本 (Text) | `true` | 是否启用保护 |

4. 保存后立即生效！

---

### 方式二：本地开发时使用 .env 文件

本地开发时：

1. 复制环境变量示例文件：
   ```bash
   cp .env.example .env
   ```

2. 编辑 `.env` 文件，修改密码：
   ```env
   VITE_ACCESS_PASSWORD=your_secure_password
   VITE_ENABLE_ACCESS_PROTECTION=true
   ```

---

## 功能说明

### ✅ 支持的功能

1. **文本消息**：加密发送
2. **图片发送**：
   - 📋 粘贴图片（从剪贴板）
   - 📎 选择本地图片
   - 🗜️ 自动压缩（WebP 格式，质量 70%，最大 1024px）
3. **私聊/群聊**：房间隔离
4. **Emoji 选择**

### ❌ 已移除的功能

1. **文件上传**：为了节省资源，已移除大文件发送功能

---

## 部署到 Cloudflare Workers

### 步骤 1：构建项目

```powershell
npm run build
```

### 步骤 2：部署

```powershell
npm run deploy
```

### 步骤 3：设置密码（重要！）

部署成功后，按上面"方式一"在 Cloudflare Dashboard 设置环境变量。

---

## 禁用密码保护

如果需要禁用密码保护：

在 Cloudflare Dashboard 设置：
```
VITE_ENABLE_ACCESS_PROTECTION = false
```

---

## 安全建议

### 🔒 密码安全

1. 使用强密码（至少 12 位，包含字母、数字和符号）
2. 定期更换访问密码
3. 在 Cloudflare 中使用 **密钥 (Secret)** 类型存储密码

### 🛡️ 额外安全措施

为了更高的安全性：

1. 配合 **Cloudflare Access** 使用
2. 部署到私有网络
3. 启用 HTTPS（Cloudflare 自动提供）

---

## 故障排除

### ❌ 常见错误：assets.directory 不存在

**错误信息**：
```
ERROR The directory specified by the "assets.directory" field in your configuration file does not exist
```

**原因**：部署前没有先构建。

**解决**：
```powershell
# 1. 先构建
npm run build

# 2. 再部署
npm run deploy
```

### 图片太大无法发送

图片会自动压缩到：
- 最大尺寸：1024×1024px
- 最大文件：3MB
- 格式：WebP，质量 70%

如果还是太大，请先手动压缩图片。

---

## 更新日志

### v2.0 - 图片优化
- ✅ 移除文件上传功能，节省资源
- ✅ 优化图片压缩参数（1024px，70% 质量，WebP）
- ✅ 密码验证改为 Cloudflare Workers API（可随时修改）

### v1.0 - 访问密码保护
- ✅ 添加页面访问密码保护
- ✅ 美观的密码输入界面
- ✅ 记住访问状态（localStorage）
