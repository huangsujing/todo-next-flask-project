# 个人待办清单管理系统

## 项目简介

基于 Next.js 14 App Router + Flask + SQLite 构建的全栈待办清单应用，支持多用户注册登录、数据隔离、待办增删改查及统计分析功能。

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 前端框架 | Next.js | 14.2.x |
| 前端语言 | TypeScript | - |
| CSS框架 | Tailwind CSS | 3.x |
| 后端框架 | Flask | 3.x |
| 数据库 | SQLite | - |
| 图标库 | Lucide React | - |

## 项目目录结构

```
todo-next-flask-project/
├── frontend/                    # 前端项目
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # 首页 - 待办列表
│   │   │   ├── add/
│   │   │   │   └── page.tsx    # 新增待办页面
│   │   │   ├── edit/[id]/
│   │   │   │   └── page.tsx    # 编辑待办页面（动态路由）
│   │   │   ├── stats/
│   │   │   │   └── page.tsx    # 统计分析页面
│   │   │   ├── login/
│   │   │   │   └── page.tsx    # 登录页面
│   │   │   ├── register/
│   │   │   │   └── page.tsx    # 注册页面
│   │   │   ├── auth-guard.tsx  # 路由鉴权守卫
│   │   │   ├── layout.tsx      # 全局布局
│   │   │   └── globals.css     # 全局样式
│   │   └── components/
│   │       └── TodoItem.tsx    # 待办条目组件
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── tailwind.config.ts
├── backend/                     # 后端项目
│   ├── app.py                  # Flask 应用主文件
│   ├── requirements.txt        # Python 依赖
│   ├── .flaskenv               # Flask 环境配置
│   └── todo.db                 # SQLite 数据库文件
├── README.md                   # 项目说明文档
└── API.md                      # API 接口文档
```

## 本地启动步骤

### 1. 启动后端服务

```bash
cd backend
pip install -r requirements.txt
python app.py
```

后端服务运行在 `http://127.0.0.1:5000`

### 2. 启动前端服务

```bash
cd frontend
npm install
npm run dev
```

前端服务运行在 `http://localhost:3000`

### 3. 访问应用

打开浏览器访问 `http://localhost:3000`

## 页面与接口功能清单

### 前端页面

| 路由 | 页面 | 功能说明 |
|------|------|----------|
| `/` | 首页 | 展示待办列表、完成状态切换、统计卡片、新增/编辑入口 |
| `/add` | 新增待办 | 输入标题和描述，创建新待办 |
| `/edit/[id]` | 编辑待办 | 回显待办内容，支持修改标题、描述、完成状态 |
| `/stats` | 统计分析 | 展示任务完成率、数量统计、进度条、最近待办列表 |
| `/login` | 登录 | 账号密码登录，验证通过后跳转首页 |
| `/register` | 注册 | 新用户注册，用户名唯一校验 |

### 后端接口

| 方法 | 路径 | 功能说明 |
|------|------|----------|
| POST | `/api/register` | 用户注册 |
| POST | `/api/login` | 用户登录，返回 userId |
| GET | `/api/todos?userId=xxx` | 获取指定用户的待办列表 |
| POST | `/api/todo` | 新增待办 |
| PUT | `/api/todo/<id>` | 修改待办（标题、描述、完成状态） |

## 多用户数据隔离业务说明

### 核心逻辑

1. **用户表与待办表关联**：`todos` 表通过 `user_id` 字段关联 `users` 表，每条待办记录归属特定用户

2. **登录时获取 userId**：登录接口返回当前用户的 `userId`，前端存储到 `localStorage`

3. **待办接口强制过滤**：所有待办 CRUD 操作必须携带 `userId`，后端按 `user_id` 过滤数据，确保用户只能操作自己的任务

4. **权限校验**：修改待办时，后端校验请求中的 `userId` 与待办归属的 `user_id` 是否一致，不一致返回 403 权限错误

### 数据流向

```
用户注册 → 写入 users 表 → 注册成功
用户登录 → 返回 userId → 前端存储到 localStorage
获取待办 → 携带 userId → 后端按 user_id 筛选 → 返回该用户的待办
创建待办 → 携带 userId → 后端写入 todos 表并关联 user_id
修改待办 → 携带 userId → 后端校验权限 → 更新指定待办
```

## AI 代码审查优化内容

### 前端优化

| 文件 | 优化项 | 说明 |
|------|--------|------|
| `page.tsx` | 清理无用导入 | 移除未使用的 `TodoItem` 导入 |
| `page.tsx` | 命名规范 | `accent` → `isAccent`，语义更清晰 |
| 全页面 | userId 空值校验 | 所有接口调用前检查 `localStorage.getItem('userId')`，为空则跳转登录 |
| `login/page.tsx` | 表单校验 | 用户名/密码去空格处理，空值校验 |
| `login/page.tsx` | 类型安全 | 校验 `data.userId` 为数字类型 |
| `add/page.tsx` | 前置校验 | 提交前检查 userId，缺失则跳转登录 |
| `edit/[id]/page.tsx` | ID 类型校验 | `parseInt(params.id, 10)` 添加基数参数，NaN 判断 |
| `stats/page.tsx` | 修复数据同步 Bug | `handleToggle` 调用后端 API 更新数据，刷新后不丢失 |
| `stats/page.tsx` | 清理无用导入 | 移除未使用的 `TodoItem` 导入 |

### 后端优化

| 文件 | 优化项 | 说明 |
|------|--------|------|
| `app.py` | 删除冗余函数 | 移除未使用的 `get_user_id_from_request()` |
| `app.py` | 类型转换 | `userId` 参数强制转换为 `int`，添加格式错误提示 |
| `app.py` | 修复权限判断 | `int(todo['user_id'])` 转为整数后比较，修复类型不匹配问题 |
| `app.py` | 参数校验增强 | 新增用户 ID 格式错误、缺少必填字段等异常返回 |

## 默认测试账号

| 用户名 | 密码 | 说明 |
|--------|------|------|
| admin | 123456 | 预置测试账号，含初始待办数据 |

## 线上部署地址

- 前端：`[待部署]`
- 后端：`[待部署]`
