'use client';

import { useState } from 'react';
import TodoItem, { type Todo } from '@/components/TodoItem';

// 初始模拟数据（本期仅前端 UI，不对接后端）
const initialTodos: Todo[] = [
  { id: 1, title: '阅读《深度工作》第三章', completed: true },
  { id: 2, title: '完成季度复盘报告', completed: false },
  { id: 3, title: '回复客户邮件', completed: false },
  { id: 4, title: '准备明日晨会议程', completed: false },
  { id: 5, title: '健身：跑步 5 公里', completed: true },
];

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
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  // 切换待办完成状态
  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;

  // 当前日期（中文格式）
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

      {/* 待办列表 */}
      <section>
        <ul className="space-y-3">
          {todos.map((todo, index) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              index={index}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}
