\# Todo‑Next‑Flask 待办事项管理系统

\## 项目简介

本项目采用前后端分离架构：前端基于 Next.js14(App Router) + TypeScript + Tailwind‑CSS + lucide‑react 开发，后端后续使用 Python Flask 框架开发。

本次迭代完成全部功能开发：首页移除前端模拟数据，前后端对接；新增`/add`添加待办页面、`/edit/\[id]`编辑页面；后端实现GET、POST、PUT接口，完成参数校验与异常捕获；前端接口请求失败弹出alert提示，原有页面布局和UI样式完全保持不变。

项目代码由Trae AI辅助生成，严格遵循Next.js工程规范，拆分独立组件，配置完善TypeScript类型约束。



\## 目录结构

```

todo-next-flask-project

├── frontend                 # Next.js 前端项目目录

│   ├── src

│   │   ├── app

│   │   │   ├── page.tsx     # 首页页面 /

│   │   │   ├── add

│   │   │   │   └── page.tsx # 新增待办页面 /add

│   │   │   └── edit

│   │   │       └── \[id]

│   │   │           └── page.tsx # 编辑待办页面 /edit/\[id]

│   │   └── components       # 公共组件 TodoItem.tsx

│   ├── package.json

│   ├── tsconfig.json

│   ├── next.config.js

│   └── tailwind.config.ts

├── backend                  # Flask 后端代码目录

│   ├── app.py

│   └── requirements.txt

├── docs

│   └── screenshots          # AI对话截图、页面预览截图、接口测试截图存放文件夹

│      └── 1.docx

&#x20;│     └──2.docx

├── prompt\_log.md            # AI提示词日志，存放本次和Trae完整对话记录

└── README.md                # 项目介绍文档

```

\## 本地项目启动方式

访问预览地址：http://localhost:3000

\### 1.前端启动

```bash

cd frontend

npm install

npm run dev

```

\#### 2.后端启动（Flask‑SQLite）后端接口地址：http://localhost:5000

```bash

cd backend

pip install -r requirements.txt

python app.py

```

\#####后端接口文档

| 请求方式 | 接口地址 | 功能说明 | 参数 | 异常情况 |

|:---:|:---:|:---:|:---|:---|

| GET | /api/todos | 获取全部待办 | 无参数 | 数据库查询失败返回错误信息 |

| POST | /api/todo | 新增待办 | title(必填)，description(可选) | title为空返回{"error":"标题不能为空"} |

| PUT | /api/todo/<id> | 修改待办 | title、description、completed | id不存在返回{"error":"待办不存在"} |



\###### 健壮性说明

1.GET接口捕获SQLite数据库读取异常；

2.POST接口校验标题非空，防止空数据入库；

3.PUT接口校验id是否存在，避免修改不存在的数据；

4.前端页面接口请求失败给出alert弹窗提示，提升用户体验。

\## 功能清单

\### 前端页面（3个独立路由）

1\. `/`：首页页面，展示全部待办，统计任务数量；

2\. `/add`：新增待办页面，填写标题和描述提交新增；

3\. `/edit/\[id]`：编辑待办页面，回显原有数据，完成修改操作。



\### 后端接口（3个API）

1\. `GET /api/todos`：查询全部待办；

2\. `POST /api/todo`：新增待办；

3\. `PUT /api/todo/<id>`：修改待办。



