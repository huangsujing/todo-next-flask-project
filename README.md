\# Todo‑Next‑Flask 待办事项管理系统

\## 项目简介

本项目采用前后端分离架构：前端基于 Next.js14(App Router) + TypeScript + Tailwind‑CSS + lucide‑react 开发，后端后续使用 Python Flask 框架开发。

本次迭代完成待办清单首页页面开发，实现待办条目展示，勾选任务后文字自动划线置灰；页面包含待办统计区域，区分全部、已完成、待完成数量；现阶段使用前端模拟数据，暂未对接后端接口。

项目代码由Trae AI辅助生成，严格遵循Next.js工程规范，拆分独立组件，配置完善TypeScript类型约束。



\## 目录结构

```

todo-next-flask-project

├── frontend # Next.js 前端项目目录

│ ├── src

│ │ ├── app # Next.js App‑Router 页面入口

│ │ └── components # 公共组件 TodoItem.tsx

│ ├── package.json

│ ├── tsconfig.json

│ ├── next.config.js

│ └── tailwind.config.ts

├── backend # Flask 后端代码目录（第 2 次提交实现接口）

├── docs

│ └── screenshots # AI 对话截图、页面预览截图、接口测试截图存放文件夹

├── prompt\_log.md # AI 提示词日志，存放本次和 Trae 完整对话记录

└── README.md # 项目介绍文档

```

\## 本地项目启动方式

访问预览地址：http://localhost:3000

\### 1.前端启动

```bash

cd frontend

npm install

npm run dev

```



