# YAL Hardware 前端系统

YAL Hardware Frontend 是一个基于 **Vue 3 + TypeScript** 构建的前端项目，与后端完全解耦，适用于五金 / 工业产品展示场景，支持产品展示、购物车、订单管理、用户评论、后台内容管理。

---

## 🔗 项目演示

- 前台展示  
  https://xgshing.github.io/yalhardware-frontend/#/

（普通用户登录账号：test@github.com 登录密码：123456）
（管理员登录账号：admin@github.com 登录密码：admin）

---

## 🚀 项目简介

前端项目专注于**用户体验与场景化功能**，  
通过调用后端 API 获取产品数据、订单数据，  
并提供界面交互与状态管理。

核心目标：

清晰可维护的项目结构

- 与后端 API 完全解耦
- 高度可扩展的组件化 UI
- 快速响应的前端性能优化

---

## 📌 项目亮点

- 基于 Vue.js 3 + Composition API 构建组件化架构
- 使用 Pinia 实现模块化状态管理
- Axios 二次封装，请求层与业务层解耦
- 前端路由鉴权 + 后台权限隔离设计
- 组件可复用结构（ProductCard / OrderList / AdminLayout 等）
- 多环境配置（Dev / Prod）支持 CI/CD 部署
- 支持 GitHub Pages 静态部署

---

## 🧰 技术栈

- Vue 3 + Composition API
- TypeScript
- Pinia 状态管理
- Vue Router 路由管理
- Axios 封装 API
- CSS / Flex / Grid
- Vite 构建工具

---

## ✨ 核心功能

- 产品列表展示 / 分类筛选
- 产品详情页
- 与后端 API 解耦的数据获取与状态管理
- 基础后台管理页面结构（可扩展）
- 购物车功能
- 前端路由鉴权与权限控制
- 用户认证
- 商品管理
- 评论系统
- 订单管理

---

## 📁 项目结构说明

```text
frontend/
├─ public/              # 静态资源（favicon、静态图片等，不经过打包处理）
├─ src/
│  ├─ api/              # API 接口定义（按模块拆分接口路径）
│  ├─ assets/           # 图片、字体等静态资源（参与构建）
│  ├─ components/       # 全局可复用组件（Button、ProductCard 等）
│  ├─ composables/      # 可复用组合式函数（useXxx 逻辑抽离）
│  ├─ configs/          # 全局配置（环境配置、系统配置）
│  ├─ constants/        # 常量定义（枚举、状态码、固定字段等）
│  ├─ layouts/          # 页面布局结构（主布局、后台布局等）
│  ├─ router/           # Vue Router 路由配置
│  ├─ services/         # 业务层逻辑封装（对 api 进一步抽象）
│  ├─ stores/           # Pinia 状态管理
│  ├─ styles/           # 全局样式、变量、主题样式
│  ├─ types/            # TypeScript 类型定义
│  ├─ utils/            # 工具函数（格式化、校验、通用方法）
│  └─ views/            # 页面级组件（Home、Product、Order 等）
├─ package.json         # 项目依赖与脚本
├─ vite.config.ts       # Vite 构建配置
└─ README.md            # 项目说明文件

```

---

## ▶️ 本地运行

```bash
git clone https://github.com/xgshing/yalhardware-frontend.git
cd yalhardware-frontend
npm install
npm run dev
```

```md
浏览器访问：

http://localhost:5173
```

---

🔗 生产环境

生产环境 API 配置：

VITE_API_BASE_URL=https://yalhardware-backend.onrender.com

---

## 🧠 未来优化方向

- 完善评论系统（回复、评分、点赞等）
- 优化前端项目结构
- 优化界面布局与交互
- 支持国际化（i18n），预留多语言扩展能力
- 扩展订单状态及后台操作功能

---

📄 说明

- 与后端完全解耦，API 调用与状态管理分离
- 支持 Cloudinary 或外部图片存储
- 订单操作严格遵循状态机规则，保证数据一致性
- 适合企业展示、工业产品电商和多用户场景

---

## 📄 License

MIT
