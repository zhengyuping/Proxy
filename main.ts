export {};

// 打开 Deno KV（全局只需打开一次）
const kv = await Deno.openKv();
// 使用一个固定的 key 来存储目标 URL
const TARGET_KEY = ["targetUrl"];

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // 如果请求带有 setUrl 参数，则更新目标 URL
  if (url.searchParams.has("setUrl")) {
    const newTargetUrl = url.searchParams.get("setUrl")!;
    // 基本校验一下 URL 格式
    try {
      new URL(newTargetUrl);
    } catch {
      return new Response("无效的 URL，请检查格式。", { status: 400 });
    }
    await kv.set(TARGET_KEY, newTargetUrl);
    console.log(`代理目标 URL 已更新为：${newTargetUrl}`); // 添加日志
    return new Response(`代理目标 URL 已更新为：${newTargetUrl}`);
  }

  // 从 KV 中获取目标 URL
  const result = await kv.get(TARGET_KEY);
  if (!result.value) {
    return new Response(
        "未设置代理目标 URL，请使用 ?setUrl=你的目标URL 进行设置。",
        { status: 400 }
    );
  }
  const baseUrl = result.value as string;

  // 去掉 /proxy 前缀，剩余部分作为相对路径
  let proxyPath = url.pathname;
  // 确保 proxyPath 不以 / 开头
  if (proxyPath.startsWith("/")) {
    proxyPath = proxyPath.slice(1);
  }
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
    console.log(`代理请求 URL：${finalUrl}`); // 添加日志
    const targetResponse = await fetch(proxyRequest, {
      redirect: 'manual',
    });
    // 使用 arrayBuffer 来支持二进制数据（比如图片等）
    const body = await targetResponse.arrayBuffer();

    // 复制目标响应的 headers
    const responseHeaders = new Headers();
    for (const [key, value] of targetResponse.headers.entries()) {
      responseHeaders.set(key, value);
    }

    responseHeaders.set('Host', new URL(finalUrl).hostname); // 设置 Host header

    const contentType = targetResponse.headers.get('content-type');
    if (contentType) {
      responseHeaders.set('Content-Type', contentType);
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

  // 返回设置 URL 的 HTML 表单
  return new Response(
    `<!DOCTYPE html>
    <html>
    <head>
      <title>设置代理URL</title>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
        form { background: #f5f5f5; padding: 2rem; border-radius: 8px; }
        input[type="url"] { width: 100%; padding: 0.5rem; margin: 0.5rem 0; }
        button { background: #007bff; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; }
      </style>
    </head>
    <body>
      <h1>设置代理目标 URL</h1>
      <form method="GET">
        <label for="url">请输入目标 URL：</label>
        <input type="url" id="url" name="setUrl" required 
               placeholder="https://example.com" 
               pattern="https?://.+">
        <button type="submit">保存设置</button>
      </form>
    </body>
    </html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      }
    }
  );
export {};

// 打开 Deno KV（全局只需打开一次）
const kv = await Deno.openKv();
// 使用一个固定的 key 来存储目标 URL
const TARGET_KEY = ["targetUrl"];

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // 如果请求带有 setUrl 参数，则更新目标 URL
  if (url.searchParams.has("setUrl")) {
    const newTargetUrl = url.searchParams.get("setUrl")!;
    // 基本校验一下 URL 格式
    try {
      new URL(newTargetUrl);
    } catch {
      return new Response("无效的 URL，请检查格式。", { status: 400 });
    }
    await kv.set(TARGET_KEY, newTargetUrl);
    console.log(`代理目标 URL 已更新为：${newTargetUrl}`); // 添加日志
    return new Response(`代理目标 URL 已更新为：${newTargetUrl}`);
  }

  // 从 KV 中获取目标 URL
  const result = await kv.get(TARGET_KEY);
  if (!result.value) {
    return new Response(
        "未设置代理目标 URL，请使用 ?setUrl=你的目标URL 进行设置。",
        { status: 400 }
    );
  }
  const baseUrl = result.value as string;

  // 去掉 /proxy 前缀，剩余部分作为相对路径
  let proxyPath = url.pathname;
  // 确保 proxyPath 不以 / 开头
  if (proxyPath.startsWith("/")) {
    proxyPath = proxyPath.slice(1);
  }
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
    console.log(`代理请求 URL：${finalUrl}`); // 添加日志
    const targetResponse = await fetch(proxyRequest, {
      redirect: 'manual',
    });
    // 使用 arrayBuffer 来支持二进制数据（比如图片等）
    const body = await targetResponse.arrayBuffer();

    // 复制目标响应的 headers
    const responseHeaders = new Headers();
    for (const [key, value] of targetResponse.headers.entries()) {
      responseHeaders.set(key, value);
    }

    responseHeaders.set('Host', new URL(finalUrl).hostname); // 设置 Host header

    const contentType = targetResponse.headers.get('content-type');
    if (contentType) {
      responseHeaders.set('Content-Type', contentType);
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

  // 其他请求返回提示信息
  return new Response(
    `<!DOCTYPE html>
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
          <input type="url" id="setUrl" name="setUrl" placeholder="https://example.com" required>
          <button type="submit">提交</button>
        </form>
        <p>请使用此页面设置代理目标 URL。</p>
      </div>
    </body>
    </html>
    `,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    }
  );
});
export {};

// 打开 Deno KV（全局只需打开一次）
const kv = await Deno.openKv();
// 使用一个固定的 key 来存储目标 URL
const TARGET_KEY = ["targetUrl"];

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // 如果请求带有 setUrl 参数，则更新目标 URL
  if (url.searchParams.has("setUrl")) {
    const newTargetUrl = url.searchParams.get("setUrl")!;
    // 基本校验一下 URL 格式
    try {
      new URL(newTargetUrl);
    } catch {
      return new Response("无效的 URL，请检查格式。", { status: 400 });
    }
    await kv.set(TARGET_KEY, newTargetUrl);
    console.log(`代理目标 URL 已更新为：${newTargetUrl}`); // 添加日志
    return new Response(`代理目标 URL 已更新为：${newTargetUrl}`);
  }

  // 从 KV 中获取目标 URL
  const result = await kv.get(TARGET_KEY);
  if (!result.value) {
    return new Response(
        "未设置代理目标 URL，请使用 ?setUrl=你的目标URL 进行设置。",
        { status: 400 }
    );
  }
  const baseUrl = result.value as string;

  // 去掉 /proxy 前缀，剩余部分作为相对路径
  let proxyPath = url.pathname;
  // 确保 proxyPath 不以 / 开头
  if (proxyPath.startsWith("/")) {
    proxyPath = proxyPath.slice(1);
  }
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
    console.log(`代理请求 URL：${finalUrl}`); // 添加日志
    const targetResponse = await fetch(proxyRequest, {
      redirect: 'manual',
    });
    // 使用 arrayBuffer 来支持二进制数据（比如图片等）
    const body = await targetResponse.arrayBuffer();

    // 复制目标响应的 headers
    const responseHeaders = new Headers();
    for (const [key, value] of targetResponse.headers.entries()) {
      responseHeaders.set(key, value);
    }

    responseHeaders.set('Host', new URL(finalUrl).hostname); // 设置 Host header

    const contentType = targetResponse.headers.get('content-type');
    if (contentType) {
      responseHeaders.set('Content-Type', contentType);
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

  // 返回设置 URL 的 HTML 表单
  return new Response(
    `<!DOCTYPE html>
    <html>
    <head>
      <title>设置代理URL</title>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
        form { background: #f5f5f5; padding: 2rem; border-radius: 8px; }
        input[type="url"] { width: 100%; padding: 0.5rem; margin: 0.5rem 0; }
        button { background: #007bff; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; }
      </style>
    </head>
    <body>
      <h1>设置代理目标 URL</h1>
      <form method="GET">
        <label for="url">请输入目标 URL：</label>
        <input type="url" id="url" name="setUrl" required 
               placeholder="https://example.com" 
               pattern="https?://.+">
        <button type="submit">保存设置</button>
      </form>
    </body>
    </html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      }
    }
  );
export {};

// 打开 Deno KV（全局只需打开一次）
const kv = await Deno.openKv();
// 使用一个固定的 key 来存储目标 URL
const TARGET_KEY = ["targetUrl"];

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // 如果请求带有 setUrl 参数，则更新目标 URL
  if (url.searchParams.has("setUrl")) {
    const newTargetUrl = url.searchParams.get("setUrl")!;
    // 基本校验一下 URL 格式
    try {
      new URL(newTargetUrl);
    } catch {
      return new Response("无效的 URL，请检查格式。", { status: 400 });
    }
    await kv.set(TARGET_KEY, newTargetUrl);
    console.log(`代理目标 URL 已更新为：${newTargetUrl}`); // 添加日志
    return new Response(`代理目标 URL 已更新为：${newTargetUrl}`);
  }

  // 从 KV 中获取目标 URL
  const result = await kv.get(TARGET_KEY);
  if (!result.value) {
    return new Response(
        "未设置代理目标 URL，请使用 ?setUrl=你的目标URL 进行设置。",
        { status: 400 }
    );
  }
  const baseUrl = result.value as string;

  // 去掉 /proxy 前缀，剩余部分作为相对路径
  let proxyPath = url.pathname;
  // 确保 proxyPath 不以 / 开头
  if (proxyPath.startsWith("/")) {
    proxyPath = proxyPath.slice(1);
  }
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
    console.log(`代理请求 URL：${finalUrl}`); // 添加日志
    const targetResponse = await fetch(proxyRequest, {
      redirect: 'manual',
    });
    // 使用 arrayBuffer 来支持二进制数据（比如图片等）
    const body = await targetResponse.arrayBuffer();

    // 复制目标响应的 headers
    const responseHeaders = new Headers();
    for (const [key, value] of targetResponse.headers.entries()) {
      responseHeaders.set(key, value);
    }

    responseHeaders.set('Host', new URL(finalUrl).hostname); // 设置 Host header

    const contentType = targetResponse.headers.get('content-type');
    if (contentType) {
      responseHeaders.set('Content-Type', contentType);
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

// 其他请求返回提示信息
  return new Response(
    `<!DOCTYPE html>
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
        </form>
        <p>请使用此页面设置代理目标 URL。</p>
      </div>
    </body>
    </html>`
  );
});
