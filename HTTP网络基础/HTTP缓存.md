## 缓存头 `cache-control`
- `Cache-Control: no-store`: 没有缓存
- `Cache-Control: no-cache`: 有缓存但是每次请求必须先去服务器验证缓存是否过期，过期返回 304，然后使用本地缓存
- `Cache-Control: max-age=31536000`: 缓存过期时间

## 新鲜度校验
1. `Last-Modified`: 精度低， If-Modified-Since 请求校验
2. `ETag`: 精度高， If-None-Match 请求校验
3. 缓存未失效返回响应 304，失效则获取新的资源并重新缓存

