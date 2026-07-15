'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Loader2, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import TodoItem, { type Todo } from '@/components/TodoItem';

/** 统计卡片 */
function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-sand bg-paper px-4 py-5 text-center">
      <p
        className={`font-display text-2xl font-semibold sm:text-3xl ${
          accent ? 'text-terracotta' : 'text-ink'
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-ink-soft">{label}</p>
    </div>
  );
}

/** 待办清单首页（路由 /） */
export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('/api/todos');
        if (!response.ok) {
          throw new Error('获取待办列表失败');
        }
        const data = await response.json();
        setTodos(data);
      } catch (err) {
        alert('获取待办列表失败，请检查后端服务是否启动');
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const toggleTodo = async (id: number) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const response = await fetch(`/api/todo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (!response.ok) {
        throw new Error('更新失败');
      }

      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      );
    } catch (err) {
      setError('更新失败，请重试');
      setTimeout(() => setError(''), 3000);
    }
  };

  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;

  const dateStr = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-16 sm:py-24">
      {/* 标题区 */}
      <header
        className="mb-12"
        style={{ animation: 'fade-in-up 0.6s ease-out' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">
              Daily · 每日待办
            </p>
            <h1 className="font-display text-5xl font-semibold text-ink sm:text-6xl">
              今日待办
            </h1>
            <div className="mt-4 flex items-center gap-3">
              <span className="h-px w-12 bg-sand" />
              <p className="text-sm text-ink-soft">{dateStr}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/stats"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-terracotta text-white transition-all hover:bg-terracotta/90 hover:shadow-lg"
              aria-label="查看统计"
            >
              <BarChart3 className="h-6 w-6" />
            </Link>
            <Link
              href="/add"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-terracotta text-white transition-all hover:bg-terracotta/90 hover:shadow-lg"
              aria-label="新增待办"
            >
              <Plus className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </header>

      {/* 统计区 */}
      <section
        className="mb-10 grid grid-cols-3 gap-4"
        style={{ animation: 'fade-in-up 0.6s ease-out 0.1s backwards' }}
      >
        <StatCard label="全部" value={total} />
        <StatCard label="已完成" value={completed} accent />
        <StatCard label="待完成" value={pending} />
      </section>

      {/* 错误提示 */}
      {error && (
        <div className="mb-6 rounded-xl border border-terracotta/30 bg-terracotta/5 px-4 py-3 text-sm text-terracotta">
          {error}
        </div>
      )}

      {/* 待办列表 */}
      <section>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-ink-soft">暂无待办</p>
            <Link
              href="/add"
              className="mt-4 inline-flex items-center gap-2 text-terracotta font-medium transition-colors hover:text-terracotta/80"
            >
              <Plus className="h-5 w-5" />
              <span>创建第一条待办</span>
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo, index) => (
              <div
                key={todo.id}
                className="group flex items-center gap-4 rounded-2xl border border-sand bg-paper px-5 py-4 shadow-sm transition-all duration-300 hover:border-terracotta/30 hover:shadow-md"
                style={{
                  animation: 'fade-in-up 0.5s ease-out backwards',
                  animationDelay: `${index * 60}ms`,
                }}
              >
                {/* 圆形勾选框 */}
                <button
                  type="button"
                  onClick={() => toggleTodo(todo.id)}
                  aria-label={todo.completed ? '标记为未完成' : '标记为已完成'}
                  aria-pressed={todo.completed}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-terracotta/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40"
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      todo.completed
                        ? 'border-terracotta bg-terracotta text-white'
                        : 'border-sand bg-transparent group-hover:border-terracotta/50'
                    }`}
                  >
                    {todo.completed && (
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                </button>

                {/* 待办内容 */}
                <span
                  className={`flex-1 text-base transition-colors duration-300 ${
                    todo.completed ? 'text-ink-muted line-through' : 'text-ink'
                  }`}
                >
                  {todo.title}
                </span>

                {/* 编辑按钮 */}
                <Link
                  href={`/edit/${todo.id}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft transition-all hover:bg-terracotta/5 hover:text-terracotta"
                  aria-label="编辑待办"
                >
                  <Edit2 className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
