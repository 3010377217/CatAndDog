# CatAndDog - 宠物服务小程序

一个基于uni-app开发的宠物服务微信小程序，提供宠物相关的各种服务功能。

## 功能特性

- 🏠 **首页展示** - 宠物服务首页，展示主要功能入口
- 🛒 **商城购物** - 宠物用品商城，支持商品搜索和购买
- 💬 **论坛交流** - 宠物爱好者交流论坛，支持发帖、评论、点赞
- 👤 **个人中心** - 用户信息管理、订单查看、地址管理等
- 📝 **评价系统** - 商品和服务评价功能
- 🎯 **分销推广** - 分销员申请和推广功能

## 技术栈

- **框架**: uni-app
- **UI组件**: uview-plus
- **状态管理**: Pinia
- **构建工具**: Vite
- **云服务**: uniCloud

## 项目结构

```
CatAndDog/
├── api/                 # API接口
├── components/          # 公共组件
├── pages/              # 页面文件
│   ├── Index/          # 首页
│   ├── Shops/          # 商城
│   ├── Forum/          # 论坛
│   ├── My/             # 个人中心
│   └── ...
├── stores/             # 状态管理
├── static/             # 静态资源
├── utils/              # 工具函数
└── uniCloud-aliyun/    # 云函数
```

## 开发环境

- Node.js >= 14.0.0
- HBuilderX 或 VS Code
- 微信开发者工具

## 安装和运行

1. 克隆项目
```bash
git clone https://github.com/your-username/CatAndDog.git
cd CatAndDog
```

2. 安装依赖
```bash
npm install
```

3. 运行项目
- 使用HBuilderX打开项目
- 选择运行到微信小程序
- 或使用命令行：`npm run dev:mp-weixin`

## 部署

1. 构建项目
```bash
npm run build:mp-weixin
```

2. 使用微信开发者工具打开 `unpackage/dist/dev/mp-weixin` 目录
3. 上传代码到微信小程序后台

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 许可证

ISC License 