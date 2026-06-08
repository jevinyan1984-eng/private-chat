# Private chat 部署

一个**零存储**的端到端加密聊天应用，基于 Cloudflare Workers。

## 🏗️ 架构说明

Private chat 不使用任何数据库或存储服务：

- ✅ 所有消息/图片通过 WebSocket 实时转发
- ✅ 使用 Cloudflare Workers Durable Object 做中转
- ✅ 数据仅在内存中转，断开连接即消失
- ✅ 完全端到端加密，服务器看不到明文

## ✨ 功能特点

- ✅ 端到端加密聊天
- ✅ 图片发送（支持粘贴/选择，自动压缩）
- ✅ 私聊/群聊（房间隔离）
- ✅ 访问密码保护（可在 Cloudflare Dashboard 随时修改）
- ❌ 已移除文件上传（节省资源）

## 📋 目录
- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [访问密码配置](#访问密码配置)
- [部署方式](#部署方式)
  - [部署到 Cloudflare Workers](#部署到-cloudflare-workers)
  - [Docker 部署](#docker-部署)
  - [本地开发](#本地开发)
- [安全建议](#安全建议)

---

## 环境要求

- Node.js 18 或更高版本
- npm 或 yarn 包管理器
- （可选）Cloudflare 账户（用于部署到 Workers）
- （可选）Docker（用于容器化部署）

---

## 快速开始

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd nodecrypt-main
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置访问密码

复制环境变量模板：
```bash
cp .env.example .env
```

编辑 `.env` 文件，设置您的密码：
```env
VITE_ACCESS_PASSWORD=your_secure_password
VITE_ENABLE_ACCESS_PROTECTION=true
```

### 4. 本地测试
```bash
npx vite
```

访问 http://localhost:5173/ 测试密码保护功能。

---

## 访问密码配置

### ⭐ 推荐方式：Cloudflare Dashboard 设置环境变量

现在密码验证通过 Cloudflare Workers API 进行，您可以随时在 Cloudflare Dashboard 修改密码，**无需重新构建和部署**！

#### 步骤：

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入您的 Worker → **设置** → **变量和密钥**
3. 添加以下环境变量：

| 变量名 | 值类型 | 说明 | 示例值 |
|--------|--------|------|--------|
| `VITE_ACCESS_PASSWORD` | 密钥 (Secret) | 访问密码 | `5201314` |
| `VITE_ENABLE_ACCESS_PROTECTION` | 文本 (Text) | 是否启用保护 | `true` |

4. 保存后立即生效！

---

### 方式二：本地开发预览时使用环境变量

本地开发时，可以创建 `.env` 文件（已提供 `.env.example` 模板）：

```bash
cp .env.example .env
```

编辑 `.env` 文件：
```env
VITE_ACCESS_PASSWORD=本地测试密码
VITE_ENABLE_ACCESS_PROTECTION=true
```

---

### 禁用密码保护

在 Cloudflare Dashboard 设置环境变量：
```
VITE_ENABLE_ACCESS_PROTECTION=false
```

或者本地开发时修改 `.env` 文件：
```env
VITE_ENABLE_ACCESS_PROTECTION=false
```

---

## 部署方式

### 部署到 Cloudflare Workers

#### 前置准备
1. 注册 Cloudflare 账户：https://dash.cloudflare.com/
2. 安装 wrangler CLI：
```bash
npm install -g wrangler
```

#### 登录 Cloudflare
```bash
wrangler login
```

#### 配置 wrangler.toml
编辑 `wrangler.toml`，修改项目名称：
```toml
name = "your-nodecrypt-project"
main = "worker/index.js"
```

#### 构建项目
```powershell
npm run build
```

#### 部署
```powershell
npm run deploy
```

#### 在 Cloudflare Dashboard 设置密码
部署成功后：
1. 进入 Cloudflare Dashboard → 您的 Worker → **设置** → **变量和密钥**
2. 添加环境变量：
   - `VITE_ACCESS_PASSWORD` = `您的密码`
   - `VITE_ENABLE_ACCESS_PROTECTION` = `true`
3. 保存后立即生效！

部署成功后，您会得到一个类似 `https://your-nodecrypt-project.your-subdomain.workers.dev` 的地址。

---

### Docker 部署

#### 构建镜像
```bash
# 使用项目中的 Dockerfile
docker build -t nodecrypt .
```

#### 运行容器
```bash
docker run -d \
  -p 8080:80 \
  -e VITE_ACCESS_PASSWORD=your_password \
  -e VITE_ENABLE_ACCESS_PROTECTION=true \
  nodecrypt
```

#### 使用 Docker Compose
创建 `docker-compose.yml`：
```yaml
version: '3'
services:
  nodecrypt:
    build: .
    ports:
      - "8080:80"
    environment:
      - VITE_ACCESS_PASSWORD=your_secure_password
      - VITE_ENABLE_ACCESS_PROTECTION=true
```

运行：
```bash
docker-compose up -d
```

---

### 本地开发

#### 启动开发服务器
```bash
npx vite
```

#### 构建生产版本
```bash
npm run build
```

构建产物在 `dist/` 目录，可以部署到任何静态托管服务。

---

## 安全建议

### 🔒 密码安全
1. **使用强密码**：至少 12 位，包含字母、数字和符号
2. **定期更换**：建议每 90 天更换一次访问密码
3. **不要提交 .env 文件**：已在 .gitignore 中配置
4. **环境变量优先**：生产环境使用环境变量而非硬编码

### 🛡️ 额外安全措施

#### 使用 Cloudflare Access
为了更高的安全性，建议配合 Cloudflare Access 使用：

1. 在 Cloudflare Dashboard 启用 Access
2. 创建应用策略，限制可访问的用户
3. 这样即使密码泄露，没有 Access 权限也无法访问

#### 部署到私有网络
- 将应用部署在内部网络
- 使用 VPN 或内网访问控制

#### 使用 HTTPS
确保部署环境使用 HTTPS，防止网络嗅探

---

## 故障排除

### ❌ 常见错误：assets.directory 不存在

**错误信息**：
```
ERROR The directory specified by the "assets.directory" field in your configuration file does not exist: /opt/buildhome/repo/dist
```

**原因**：部署前没有先运行构建命令，dist 目录不存在。

**解决方案**：

#### 手动部署

**Windows (PowerShell)**
```powershell
# 1. 先构建项目
npm run build

# 2. 确认 dist 目录生成
Get-ChildItem dist

# 3. 再部署
npm run deploy
```

**Linux / macOS (Bash/Zsh)**
```bash
# 1. 先构建项目
npm run build

# 2. 确认 dist 目录生成
ls -la dist/

# 3. 再部署
npm run deploy
```

#### CI/CD 自动部署（推荐）

我已经为您创建了 GitHub Actions 工作流：`.github/workflows/deploy.yml`

**使用步骤**：

1. 在 GitHub 仓库设置 Secrets：
   - `CLOUDFLARE_API_TOKEN`：您的 Cloudflare API Token
   - `ACCESS_PASSWORD`（可选）：访问密码

2. 推送到 main/master 分支，自动触发部署。

---

### 密码不生效
1. 检查是否正确设置了环境变量
2. 重新构建项目：`npm run build`
3. 清除浏览器缓存和 localStorage

### 构建失败
1. 确保 Node.js 版本 >= 18
2. 删除 node_modules 重新安装：
```bash
rm -rf node_modules package-lock.json
npm install
```

### 部署后访问 404
1. 检查 wrangler.toml 中的 assets 配置
2. 确认 dist 目录正确生成
3. 检查 Cloudflare Workers 日志

---

## 更新日志

### v2.0 - 图片优化 & 架构改进
- ✅ 移除文件上传功能，节省资源
- ✅ 优化图片压缩（1024px，70% 质量，WebP 格式）
- ✅ 密码验证改为 Cloudflare Workers API（可在 Dashboard 随时修改）

### v1.0 - 访问密码保护
- ✅ 添加页面访问密码保护
- ✅ 支持环境变量配置
- ✅ 美观的密码输入界面
- ✅ 记住访问状态（localStorage）

---

## 技术支持

如有问题，请：
1. 查看项目 README
2. 检查 Cloudflare Workers 日志
3. 提交 Issue 到项目仓库

---

## 许可证

ISC License
