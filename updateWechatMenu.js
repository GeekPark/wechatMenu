var fs       = require('fs');
var https    = require('https');
var jf       = require('jsonfile')
var inquirer = require("inquirer");

// access_token get :
// 1. ssh to server
// 2. rails c -e production
// 3. Rails.cache.fetch('wechat_access_token')
// 4. if is nil , you should trigger get access_token on the backend
var access_token = '';
var url;
var menuJSON = 'menu.json';

var question = {
  type: 'list',
  name: 'type',
  message: '请选择操作',
  default: 0,
  choices: [
    '1. 从服务器上更新最新版菜单到menu.json',
    '2. 上传menu.json到服务器'
  ]
};

inquirer.prompt([question], function( answers ) {
  if(answers.type == question.choices[0]) {
    // get menu
    url = 'https://api.weixin.qq.com/cgi-bin/menu/get?access_token=' + access_token;

    https.get(url, function(res) {
      res.on('data', function(data) {
        var result = JSON.parse(data);

        jf.writeFile(menuJSON, result, function(err) {
          if(result.errcode) {
            console.log('看起来像是access_token错误，检查一下代码里设置的access_token吧');
            console.log(result.errmsg);
          } else {
            console.log('已同步至menu.json');
            console.log('编辑完成后再次运行选择上传即可');
          }
        })

      });
    });
  } else if(answers.type == question.choices[1]) {

    fs.readFile(menuJSON, function(err, data) {
      if(err) {
        console.log(err.message);
        return;
      } else {
        createMenu(JSON.parse(data));
      }
    });

    function createMenu (menuData) {
      console.log('正在发送数据...');
      var jsonData = menuData.menu;
      // Hack: 剔除空菜单放置微信报错

      jsonData = JSON.stringify(jsonData).replace(/,"sub_button":\[\]/g, '');
      var options = {
        hostname: 'api.weixin.qq.com',
        path: '/cgi-bin/menu/create?access_token=' + access_token,
        port: 443,
        method: 'POST'
      };

      var req = https.request(options, function(res) {
        res.on('data', function(d) {
          var result = JSON.parse(d);
          if(result.errcode == '0') {
            console.log('更新成功，你可以重新关注查看效果');
          } else {
            console.log('Error:',result.errcode,result.errmsg);
          }
        });
      });

      req.write(jsonData);

      req.end();

      req.on('error', function(e) {
        console.error(e);
      });
    }
  }

});
