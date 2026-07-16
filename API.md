# 个人待办清单管理系统 API 文档

## 基础信息

### 服务地址

- 开发环境：`http://127.0.0.1:5000`
- 生产环境：`[待部署]`

### 通用规则

- 所有接口返回 JSON 格式
- 待办相关接口（查询/新增/修改）必须携带 `userId` 参数
- `userId` 传递方式：
  - GET 请求：通过查询参数 `?userId=xxx` 传递
  - POST/PUT 请求：通过 JSON 请求体 `{"userId": xxx}` 传递
- 接口异常时返回 `{"error": "错误信息"}`，HTTP 状态码为 4xx 或 5xx

## 用户模块

### 1. 用户注册

**请求**

- 方法：`POST`
- 路径：`/api/register`
- Content-Type：`application/json`

**请求体**

```json
{
  "username": "string (必填，用户名)",
  "password": "string (必填，密码，不少于6位)"
}
```

**成功返回**（HTTP 200）

```json
{
  "success": true,
  "msg": "注册成功，请前往登录"
}
```

**失败返回**

- 用户名已被占用（HTTP 200）：

```json
{
  "success": false,
  "msg": "该用户名已被占用"
}
```

- 用户名不能为空（HTTP 200）：

```json
{
  "success": false,
  "msg": "用户名不能为空"
}
```

- 密码长度不足（HTTP 200）：

```json
{
  "success": false,
  "msg": "密码长度不少于6位"
}
```

### 2. 用户登录

**请求**

- 方法：`POST`
- 路径：`/api/login`
- Content-Type：`application/json`

**请求体**

```json
{
  "username": "string (必填)",
  "password": "string (必填)"
}
```

**成功返回**（HTTP 200）

```json
{
  "success": true,
  "userId": 1
}
```

**失败返回**（HTTP 200）

```json
{
  "success": false,
  "msg": "账号或密码错误"
}
```

## 待办模块

### 3. 获取待办列表

**请求**

- 方法：`GET`
- 路径：`/api/todos?userId={userId}`

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | int | 是 | 用户 ID |

**成功返回**（HTTP 200）

```json
[
  {
    "id": 1,
    "title": "阅读《深度工作》第三章",
    "description": "专注工作方法论学习",
    "completed": true
  },
  {
    "id": 2,
    "title": "完成季度复盘报告",
    "description": "",
    "completed": false
  }
]
```

**失败返回**

- 用户 ID 为空（HTTP 400）：

```json
{
  "error": "用户ID不能为空"
}
```

- 用户 ID 格式错误（HTTP 400）：

```json
{
  "error": "用户ID格式错误"
}
```

- 数据库查询失败（HTTP 500）：

```json
{
  "error": "数据库查询失败: [具体错误]"
}
```

### 4. 新增待办

**请求**

- 方法：`POST`
- 路径：`/api/todo`
- Content-Type：`application/json`

**请求体**

```json
{
  "title": "string (必填，待办标题)",
  "description": "string (可选，待办描述)",
  "userId": "int (必填，用户 ID)"
}
```

**成功返回**（HTTP 201）

```json
{
  "id": 3,
  "title": "新待办任务",
  "description": "任务描述",
  "completed": false
}
```

**失败返回**

- 缺少必填字段（HTTP 400）：

```json
{
  "error": "标题和用户ID不能为空"
}
```

- 标题为空（HTTP 400）：

```json
{
  "error": "标题不能为空"
}
```

- 用户 ID 格式错误（HTTP 400）：

```json
{
  "error": "用户ID格式错误"
}
```

### 5. 修改待办

**请求**

- 方法：`PUT`
- 路径：`/api/todo/{id}`
- Content-Type：`application/json`

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | int | 是 | 待办 ID |

**请求体**

```json
{
  "title": "string (可选，新标题)",
  "description": "string (可选，新描述)",
  "completed": "boolean (可选，完成状态)",
  "userId": "int (必填，用户 ID)"
}
```

**成功返回**（HTTP 200）

```json
{
  "id": 1,
  "title": "修改后的标题",
  "description": "修改后的描述",
  "completed": true
}
```

**失败返回**

- 用户 ID 为空（HTTP 400）：

```json
{
  "error": "用户ID不能为空"
}
```

- 用户 ID 格式错误（HTTP 400）：

```json
{
  "error": "用户ID格式错误"
}
```

- 待办不存在（HTTP 404）：

```json
{
  "error": "待办不存在"
}
```

- 无权操作（HTTP 403）：

```json
{
  "error": "无权操作此待办"
}
```

- 没有需要更新的字段（HTTP 400）：

```json
{
  "error": "没有需要更新的字段"
}
```

## 数据库表结构

### users 表

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 用户主键 ID |
| username | TEXT | NOT NULL UNIQUE | 用户名，唯一 |
| password | TEXT | NOT NULL | 密码（明文存储） |

### todos 表

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 待办主键 ID |
| title | TEXT | NOT NULL | 待办标题 |
| description | TEXT | DEFAULT '' | 待办描述 |
| completed | INTEGER | DEFAULT 0 | 完成状态（0=未完成，1=已完成） |
| user_id | INTEGER | DEFAULT 0, FOREIGN KEY | 所属用户 ID，关联 users(id) |

### 表关系

```
users.id ──(1:N)──> todos.user_id
```

每个用户可拥有多条待办，每条待办仅属于一个用户。

## 接口权限说明

| 接口 | 是否需要登录 | 是否需要 userId |
|------|-------------|----------------|
| `/api/register` | 否 | 否 |
| `/api/login` | 否 | 否 |
| `/api/todos` | 是 | 是 |
| `/api/todo` (POST) | 是 | 是 |
| `/api/todo/{id}` (PUT) | 是 | 是 |

> **注意**：前端路由通过 `auth-guard.tsx` 组件实现登录校验，未登录用户访问受限页面会自动跳转至 `/login`。后端接口不做 session 校验，仅通过 `userId` 参数进行数据隔离和权限判断。
