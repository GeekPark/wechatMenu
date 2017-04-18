微信自定义菜单更新工具
------
LICENSE: [MIT](http://opensource.org/licenses/MIT)

### 安装：
`$ git clone git@github.com:GeekPark/wechatMenu.git`
`$ cd wechatMenu && npm install`

### 使用：
0. `$ cp ./token.js.example ./token.js` 并修改成自己的 `access_token`
1. `$ npm start` 选择下载 JSON
2. 编辑下载下来的menu.json
3. `$ npm start` 并选择上传

(token can be fetched using `Rails.cache.fetch('wechat_access_token')`)

