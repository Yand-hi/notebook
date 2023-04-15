执行 GET 请求
```js
    axios.get('url')
        .then(response=>{
            console.log(response)
        }).catch(error=>{
            console.error(error)
        })
```
执行 POST 请求
```js
    axios.post('url',{
        username: 'Yandhi',
        password: 12345
    })
        .then(response=>{
            console.log(response)
        }).catch(error=>{
            console.error(error)
        })
```
执行多个请求
```js
function getUserAccount() {
  return axios.get('/user/12345');
}

function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}
axios.all([getUserAccount(), getUserPermissions()])
    .then(axios.spread())
```