from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

DATABASE = os.path.join(os.path.dirname(__file__), 'todo.db')

def init_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT DEFAULT '',
            completed INTEGER DEFAULT 0,
            user_id INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    cursor.execute("PRAGMA table_info(todos)")
    columns = [col[1] for col in cursor.fetchall()]
    
    if 'user_id' not in columns:
        cursor.execute('ALTER TABLE todos ADD COLUMN user_id INTEGER DEFAULT 0')
    
    cursor.execute('SELECT COUNT(*) FROM users WHERE username = ?', ('admin',))
    admin_exists = cursor.fetchone()[0]
    
    if admin_exists == 0:
        cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', ('admin', '123456'))
        conn.commit()
    
    cursor.execute('SELECT id FROM users WHERE username = ?', ('admin',))
    admin_id = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) FROM todos WHERE user_id = ?', (admin_id,))
    admin_todo_count = cursor.fetchone()[0]
    
    if admin_todo_count == 0:
        cursor.execute('''
            INSERT INTO todos (title, description, completed, user_id) VALUES
            ('阅读《深度工作》第三章', '专注工作方法论学习', 1, ?),
            ('完成季度复盘报告', '总结本季度工作成果与不足', 0, ?),
            ('回复客户邮件', '处理客户咨询的产品问题', 0, ?),
            ('准备明日晨会议程', '整理会议要点与资料', 0, ?),
            ('健身：跑步 5 公里', '保持身体健康', 1, ?)
        ''', (admin_id, admin_id, admin_id, admin_id, admin_id))
    
    conn.commit()
    conn.close()

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def get_user_id_from_request():
    data = request.get_json()
    if not data or 'userId' not in data:
        return None
    return data.get('userId')

@app.route('/api/todos', methods=['GET'])
def get_todos():
    user_id = request.args.get('userId')
    
    if not user_id:
        return jsonify({'error': '用户ID不能为空'}), 400
    
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            'SELECT id, title, description, completed FROM todos WHERE user_id = ?',
            (user_id,)
        )
        todos = cursor.fetchall()

        return jsonify([{
            'id': todo['id'],
            'title': todo['title'],
            'description': todo['description'],
            'completed': bool(todo['completed'])
        } for todo in todos])
    except sqlite3.Error as e:
        return jsonify({'error': f'数据库查询失败: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'服务器内部错误: {str(e)}'}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/todo', methods=['POST'])
def create_todo():
    data = request.get_json()
    
    if not data or 'title' not in data or 'userId' not in data:
        return jsonify({'error': '标题和用户ID不能为空'}), 400
    
    title = data['title'].strip()
    description = data.get('description', '').strip()
    user_id = data['userId']
    
    if not title:
        return jsonify({'error': '标题不能为空'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT id FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    
    if not user:
        conn.close()
        return jsonify({'error': '用户不存在'}), 404
    
    cursor.execute(
        'INSERT INTO todos (title, description, completed, user_id) VALUES (?, ?, ?, ?)',
        (title, description, 0, user_id)
    )
    conn.commit()
    
    todo_id = cursor.lastrowid
    
    cursor.execute('SELECT id, title, description, completed FROM todos WHERE id = ?', (todo_id,))
    todo = cursor.fetchone()
    conn.close()
    
    return jsonify({
        'id': todo['id'],
        'title': todo['title'],
        'description': todo['description'],
        'completed': bool(todo['completed'])
    }), 201

@app.route('/api/todo/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    data = request.get_json()
    
    if not data or 'userId' not in data:
        return jsonify({'error': '用户ID不能为空'}), 400
    
    user_id = data['userId']
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT id, user_id FROM todos WHERE id = ?', (todo_id,))
    todo = cursor.fetchone()
    
    if not todo:
        conn.close()
        return jsonify({'error': '待办不存在'}), 404
    
    if todo['user_id'] != user_id:
        conn.close()
        return jsonify({'error': '无权操作此待办'}), 403
    
    updates = []
    params = []
    
    if 'title' in data:
        updates.append('title = ?')
        params.append(data['title'].strip())
    
    if 'description' in data:
        updates.append('description = ?')
        params.append(data.get('description', '').strip())
    
    if 'completed' in data:
        updates.append('completed = ?')
        params.append(1 if data['completed'] else 0)
    
    if not updates:
        conn.close()
        return jsonify({'error': '没有需要更新的字段'}), 400
    
    params.append(todo_id)
    cursor.execute(f'UPDATE todos SET {", ".join(updates)} WHERE id = ?', params)
    conn.commit()
    
    cursor.execute('SELECT id, title, description, completed FROM todos WHERE id = ?', (todo_id,))
    updated_todo = cursor.fetchone()
    conn.close()
    
    return jsonify({
        'id': updated_todo['id'],
        'title': updated_todo['title'],
        'description': updated_todo['description'],
        'completed': bool(updated_todo['completed'])
    })

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'success': False, 'msg': '账号或密码不能为空'}), 400
    
    username = data['username'].strip()
    password = data['password'].strip()
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT id, password FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    conn.close()
    
    if user and user['password'] == password:
        return jsonify({'success': True, 'userId': user['id']})
    
    return jsonify({'success': False, 'msg': '账号或密码错误'})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'success': False, 'msg': '用户名或密码不能为空'}), 400
    
    username = data['username'].strip()
    password = data['password'].strip()
    
    if not username:
        return jsonify({'success': False, 'msg': '用户名不能为空'}), 400
    
    if len(password) < 6:
        return jsonify({'success': False, 'msg': '密码长度不少于6位'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT id FROM users WHERE username = ?', (username,))
    existing_user = cursor.fetchone()
    
    if existing_user:
        conn.close()
        return jsonify({'success': False, 'msg': '该用户名已被占用'})
    
    cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, password))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'msg': '注册成功，请前往登录'})

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000)
