# YAL Hardware 前端系统

这是一个面向五金 / 工业产品展示的前端网站，支持产品分类、产品详情展示与后台内容联动，  
适用于真实业务场景下的企业官网或轻量级电商展示系统。

---

## 🔗 Demo 演示

- 前台展示  
  https://xgshing.github.io/yalhardware-frontend/#/

- 后台管理  
  https://xgshing.github.io/yalhardware-frontend/#/admin/products

---

## 🚀 项目简介

YAL Hardware Frontend 是一个基于 **Vue 3 + TypeScript** 构建的前端项目，  
面向五金 / 工业产品展示场景，并通过 API 与后端系统进行数据交互。

项目重点不在“页面堆砌”，而在于：

- 清晰、可维护的项目结构设计  
- 可扩展的组件与页面拆分方式  
- 面向真实业务的数据建模与接口对接思路  

---

## 📌 项目亮点

- 使用 **TypeScript** 明确定义核心业务数据结构，提升代码可读性与长期可维护性  
- 对 API 请求进行统一封装（services 层），组件仅关注数据使用，降低组件复杂度与耦合度  
- 组件（components）与页面（views）分层清晰，结构设计可支持中大型项目持续扩展  
- 基于真实业务场景设计，而非简单 Demo 或功能拼接型项目  

---

## 🧰 技术栈

- Vue 3 + Composition API  
- TypeScript  
- Vue Router  
- Pinia  
- Vite  
- Axios  
- CSS / Flex / Grid  

---

## ✨ 核心功能

- 首页产品推荐与分类展示  
- 产品列表页 / 产品详情页  
- 与后端 API 解耦的数据获取与状态管理  
- 基础后台管理页面结构（支持功能扩展）  
- 前端路由鉴权与基础权限控制  

---

## 📁 项目结构说明

```text
src/
├── assets/        # 静态资源
├── components/    # 通用组件
├── views/         # 页面级组件
├── router/        # 路由配置
├── stores/        # Pinia 状态管理
├── services/      # API 请求封装
└── types/         # TypeScript 类型定义

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

## 🧠 未来优化方向

- 引入 SSR / SEO 优化方案，提升搜索引擎友好度与首屏性能  
- 增加后台权限管理模块（基于角色 / 权限点控制）  
- 引入单元测试（Vitest），保障核心业务逻辑稳定性  
- 支持国际化（i18n），为多语言场景预留扩展能力

---

## 📄 License

MIT 

