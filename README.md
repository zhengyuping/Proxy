# 🌐 Deno Proxy

欢迎使用 **Deno Proxy**！🚀  
这是一个轻量级的代理服务应用，使用 **Deno** 构建，旨在将请求转发到指定的目标 URL。无论您需要通过代理访问网站，还是转发 API 请求，**Deno Proxy** 都能满足您的需求！

## 📦 特性

- **代理请求**: 将以 `/proxy` 开头的请求转发到指定的目标 URL。
- **设置代理 URL**: 使用简单的 `?setUrl=TARGET_URL` 查询参数轻松设置或更改代理目标 URL。
- **动态代理目标**: 使用 `/proxy` 端点设置活动的代理目标。

## 🚀 快速开始

### 1. 克隆项目

通过以下命令克隆仓库并进入项目目录：

```bash
git clone https://github.com/pwh-pwh/DenoProxy.git
cd deno-proxy
```

### 2. 运行代理服务器

确保已安装 **Deno**。如果没有安装，可以从 [deno.land](https://deno.land/) 获取并安装。  
然后，使用以下命令运行代理服务器：

```bash
deno run --allow-net --unstable proxy.ts
```

此命令会启动代理服务器并监听 `8000` 端口。

### 3. 部署应用

有两种方式实现部署

1. 安装deno部署工具 deployctl `deno install -A jsr:@deno/deployctl --global` 项目目录执行 `deployctl deploy
`
2. fork本项目，进入deno控制台 https://dash.deno.com/ 进行部署操作

### 4. 使用代理服务器

#### 🌍 设置代理 URL

要设置代理目标，您需要将有效的 URL 传递给 `setUrl` 参数：

```bash
http://localhost:8000/?setUrl=https://example.com
```

#### 🔄 使用代理

设置代理后，只需访问任何以 `/proxy` 开头的路径，请求将会转发到指定的目标 URL。

例如：

```bash
http://localhost:8000/proxy/some/path
```

此请求将会被转发到 `https://example.com/some/path`，并返回目标网站的响应！

## 📚 API 参考

### 1. `?setUrl=TARGET_URL`

使用此端点来设置或更改代理目标 URL。所有访问 `/proxy` 的请求都会转发到此 URL。

**示例**：
```bash
http://localhost:8000/?setUrl=https://example.com
```

### 2. `/proxy` 路径

访问以 `/proxy` 开头的路径的请求将会转发到设置的目标 URL。

**示例**：
```bash
http://localhost:8000/proxy/some/path
```

这将会把请求转发到目标 URL，并返回响应。

## 📁 项目结构

```
deno-proxy/
├── main.ts          # 代理服务器代码
├── README.md         # 这份超棒的文档！
└── ...
```

## 🛠️ 使用的技术

- **Deno**: 一个用于 JavaScript 和 TypeScript 的安全运行时。
- **HTTP 服务器**: Deno 的原生 HTTP 服务器处理请求。

## 🔑 权限

服务器需要以下权限：

- **`--allow-net`**: 允许网络访问（用于转发请求）。
- **`--unstable`**: 启用不稳定的 Deno API（用于使用 `Deno.openKv()`）。

## 🤝 贡献

欢迎随时 fork 本仓库、提交问题或 Pull Request。您的贡献是我们不断改进的动力！

## 📜 许可证

本项目使用 [MIT 许可证](LICENSE) 进行授权。

---

### 🖼️ 预览

一旦您运行了服务器，下面是如何操作的预览：

1. **设置代理 URL**：

   在浏览器中输入以下 URL 来设置目标 URL：

   ![Set Proxy URL](https://img.shields.io/badge/Set_Proxy_URL-https%3A%2F%2Fexample.com-brightgreen?style=for-the-badge)

2. **使用代理**：

   然后，简单地调用 `/proxy` 端点：

   ![Proxy Request](https://img.shields.io/badge/Use_Proxy-%2Fproxy%2Fsome%2Fpath-blue?style=for-the-badge)
