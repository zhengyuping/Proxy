
// 打开 Deno KV（全局只需打开一次）
const kv = await Deno.openKv();
// 使用一个固定的 key 来存储目标 URL
const TARGET_KEY = ["targetUrl"];

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // 如果请求带有 setUrl 参数，则更新目标 URL
  if (url.searchParams.has("setUrl")) {
    const newTargetUrl = url.searchParams.get("setUrl")!;
    if (newTargetUrl === '') {
      await kv.delete(TARGET_KEY);
      console.log('代理目标 URL 已清除');
      return new Response('代理目标 URL 已清除');
    }
    // 基本校验一下 URL 格式
    try {
      new URL(newTargetUrl);
    } catch {
      return new Response("无效的 URL，请检查格式。", { status: 400 });
    }
    await kv.set(TARGET_KEY, newTargetUrl);
    return new Response(`代理目标 URL 已更新为：${newTargetUrl}`);
  }

  // 仅处理路径以 /proxy 开头的请求
  if (url.pathname.startsWith("/")) {
    // 从 KV 中获取目标 URL
    const result = await kv.get(TARGET_KEY);
    if (!result.value) {
      return new Response(
   " <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>设置代理 URL</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f2f5;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          padding: 0;
        }
        .container {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          width: 90%;
          max-width: 600px;
          text-align: center;
        }
        h1 {
          color: #28a745;
          margin-bottom: 1.5rem;
        }
        form {
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        label {
          font-weight: bold;
          margin-bottom: 0.5rem;
          text-align: left;
        }
        input[type="url"] {
          padding: 0.75rem;
          margin-bottom: 1rem;
          border: 1px solid #ced4da;
          border-radius: 4px;
        }
        button {
          background-color: #28a745;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        button:hover {
          background-color: #218838;
        }
        p {
          margin-top: 1rem;
          color: #6c757d;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>设置代理 URL</h1>
        <form method="GET">
          <label for="setUrl">目标 URL:</label>
          <input type="url" id="setUrl" name="setUrl" placeholder="https://www.google.com" required>
          <button type="submit">提交</button>
export {};
        </form>
        <p>请使用此页面设置代理目标 URL。</p>
      </div>
    </body>
    </html>"
      );
    }
    const baseUrl = result.value as string;

    // 去掉 /proxy 前缀，剩余部分作为相对路径
    const proxyPath = url.pathname.slice("/".length);
    // 构造最终的请求 URL：以存储的 baseUrl 为基准，加上剩余路径和原有查询参数（注意：此处不包括 setUrl 参数，因为已单独处理）
    let finalUrl: string;
    try {
      finalUrl = new URL(proxyPath + url.search, baseUrl).toString();
    } catch {
      return new Response("构造目标 URL 出错。", { status: 500 });
    }

    // 构造一个新的请求，将客户端的 method、headers 和 body 传递过去
    const proxyRequest = new Request(finalUrl, {
      method: req.method,
      headers: req.headers,
      body: req.body,
    });

    try {
      const targetResponse = await fetch(proxyRequest);
      // 使用 arrayBuffer 来支持二进制数据（比如图片等）
      const body = await targetResponse.arrayBuffer();

      // 复制目标响应的 headers
      const responseHeaders = new Headers();
      for (const [key, value] of targetResponse.headers.entries()) {
        responseHeaders.set(key, value);
      }

      return new Response(body, {
        status: targetResponse.status,
        headers: responseHeaders,
      });
    } catch (err) {
      return new Response(`请求目标 URL 时发生错误：${err}`, {
        status: 500,
      });
    }
  }

  // 其他请求返回提示信息
  return new Response(
    "<!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>设置代理 URL</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f2f5;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          padding: 0;
        }
        .container {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          width: 90%;
          max-width: 600px;
          text-align: center;
        }
        h1 {
          color: #28a745;
          margin-bottom: 1.5rem;
        }
        form {
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        label {
          font-weight: bold;
          margin-bottom: 0.5rem;
          text-align: left;
        }
        input[type="url"] {
          padding: 0.75rem;
          margin-bottom: 1rem;
          border: 1px solid #ced4da;
          border-radius: 4px;
        }
        button {
          background-color: #28a745;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        button:hover {
          background-color: #218838;
        }
        p {
          margin-top: 1rem;
          color: #6c757d;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>设置代理 URL</h1>
        <form method="GET">
          <label for="setUrl">目标 URL:</label>
          <input type="url" id="setUrl" name="setUrl" placeholder="https://www.google.com" required>
          <button type="submit">提交</button>
export {};
        </form>
        <p>请使用此页面设置代理目标 URL。</p>
      </div>
    </body>
    </html>"
  );
});
