# chat-room
一个基于`Angular`、`express`、`socket.io`、`MongoDB`的在线聊天室

## 下载项目
```
git clone https://github.com/YangyuhaoBit/chat-room.git
```
## 安装依赖
前端的依赖通过`bower`管理，后端的依赖通过`npm`管理，安装依赖前请先确认已安装`bower`和`npm`
```
npm install
bower install
```
## 运行项目
本项目需要`MongoDB`数据库支持，`MongoDB`下载及使用请点[这里](https://www.mongodb.org/)

启动`MongoDB`数据库，如果数据库地址不为`localhost:27017`请进入项目目录下的`config`目录中的`index.js`

`config/index.js`
```
module.exports = {
    dbUrl: 'mongodb://localhost/chat'
};
```
修改`dbUrl`为当前数据库地址即可

在当前项目的目录下通过`npm`运行项目即可
```
npm start
```
