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

│   │   │   └──stats

│   │   │       └── page.tsx       待办统计页面 

│   │   │   ├── login

│   │   │   │   └── page.tsx       # 登录页面 /login

│   │   │   ├── register

│   │   │   │   └── page.tsx       # 注册页面 /register

│   │   │   ├── auth‑guard.tsx      # 登录鉴权组件

│   │   │   └── layout.tsx         # 全局布局、鉴权入口

│   │   └── components       # 公共组件 TodoItem.tsx

│   ├── package.json

│   ├── tsconfig.json

│   ├── next.config.js

│   └── tailwind.config.ts

├── backend                  # Flask 后端代码目录

│   ├── app.py

│   ├── todo.db               # SQLite数据库，存放用户账号和待办数据

│   └── requirements.txt

├── docs

│   └── screenshots          # AI对话截图、页面预览截图、接口测试截图存放文件夹

│     └──1.docx

│     └──2.docx

│     └──3.docx

│     └──4.docx

│     └──5.docx

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
5.增加用户权限校验：仅允许操作当前登录用户自己创建的待办，跨用户操作拦截。

\## 功能清单

\### 前端页面（6个独立路由）

1\. `/`：首页页面，展示全部待办，统计任务数量；

2\. `/add`：新增待办页面，填写标题和描述提交新增；

3\. `/edit/\[id]`：编辑待办页面，回显原有数据，完成修改操作。

4\. `/stats`：待办统计页面，布局风格和首页保持一致，展示任务数量、完成进度、最近5条待办。

5\. `/login`：登录页面，输入账号密码；只有登录成功之后，才可以访问系统全部页面；未登录强制跳转登录页。

6\. `/register`：注册页面，UI样式和登录页面保持统一；前端校验用户名非空、密码长度≥6；注册成功自动跳转登录页面。
\###多用户数据隔离（本次新增功能）
1.每条待办任务绑定创建用户 user_id，不同账号数据完全隔离；
2.新注册空白账号登录首页无任何待办，仅能查看、修改自己创建的任务；
3.访问、编辑他人待办会返回无权限错误；
4.登录接口返回 userId，前端本地存储，所有待办请求自动携带用户标识鉴权。

\### 后端接口（5个API）

| 请求方式 | 接口地址 | 功能 | 请求参数 | 返回结果说明 |

|:---:|:---:|:---|:---|:---|

| GET | `/api/todos` | 查询全部待办 | 无 | 返回全部待办列表 |

| POST | `/api/todo` | 新增待办 | title，completed | 添加一条待办数据 |

| PUT | `/api/todo/<id>` | 修改待办 | completed | 更新待办完成状态 |

| POST | `/api/login` | 用户登录 | username，password | 账号正确返回{"success": true, "userId": 数字id}，错误返回{"success":false,"msg":"账号或密码错误"} |

| POST | `/api/register` | 用户注册 | username，password | 用户名唯一，重复提示占用；注册成功返回成功提示；后端自动创建user数据表。

\## 项目业务流程

1\. 用户访问系统，未登录状态会被鉴权组件拦截强制跳转到登录页面；

2\. 新用户先进入`/register`页面注册账号，账号存入SQLite数据库；

3\. 注册完成跳转到登录页面，输入账号密码登录；登录成功后前端localStorage保存登录标识；

4\. 登录成功后正常使用首页查看待办、新增待办、编辑待办、查看统计页面；

5\. 用户点击退出登录按钮，清除本地登录缓存，重新回到登录页面。
6\.登录成功后，本地 localStorage 同时存储 login-token 和 userId；所有待办相关接口自动带上 userId，系统根据用户 ID 过滤专属任务，实现多账号数据分离。


\### 测试账号

默认内置账号：用户名：`admin`，密码：`123456`。

