服务器发送到用户浏览器并保存在本地的一些数据，下次请求同意服务器时会带上

- 会话状态管理（保存 session id）
- 个性化设置（保存 token）
- 浏览器行为追踪

## 创建 Cookie
### Set-Cookie 响应头
服务器使用 Set-Cookie 向用户发送 Cookie 信息，新的一次请求将 Cookie 信息通过 Cookie 头部发送给服务器

## Cookie 生命周期
- 会话期：浏览器关闭就自动删除；
- 生命周期取决于过期时间 `Expires` 与有效期 `Max-Age`

## HttpOnly 
限制访问 Cookie 信息，浏览器的 `document.cookie` 无法访问 