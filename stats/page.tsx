'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import TodoItem, { type Todo } from '@/components/TodoItem';

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

export default function StatsPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const handleToggle = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`/api/todos?userId=${userId}`);
        if (!response.ok) {
          throw new Error('获取待办列表失败');
        }
        const data = await response.json();
        setTodos(data);
      } catch (err) {
        alert('获取待办数据失败，请检查后端服务是否启动');
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const recentTodos = todos.slice(0, 5);

  const getSummaryText = () => {
    if (completionRate === 0) return '还没有完成任何任务，开始行动吧！';
    if (completionRate < 30) return `当前任务完成率${completionRate}%，加油，你可以的！`;
    if (completionRate < 60) return `当前任务完成率${completionRate}%，继续保持进度！`;
    if (completionRate < 90) return `当前任务完成率${completionRate}%，即将完成所有任务！`;
    return `当前任务完成率${completionRate}%，太棒了，全部任务已完成！`;
  };

  const dateStr = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12 sm:py-16">
      <header
        className="mb-8"
        style={{ animation: 'fade-in-up 0.6s ease-out' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">
              Stats · 统计分析
            </p>
            <h1 className="font-display text-5xl font-semibold text-ink sm:text-6xl">
              待办统计
            </h1>
            <div className="mt-4 flex items-center gap-3">
              <span className="h-px w-12 bg-sand" />
              <p className="text-sm text-ink-soft">{dateStr}</p>
            </div>
          </div>
          <Link
            href="/"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-terracotta text-white transition-all hover:bg-terracotta/90 hover:shadow-lg"
            aria-label="返回首页"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
        </div>
      ) : (
        <>
          <section
            className="mb-8 grid grid-cols-3 gap-4"
            style={{ animation: 'fade-in-up 0.6s ease-out 0.1s backwards' }}
          >
            <StatCard label="全部任务" value={total} />
            <StatCard label="已完成任务" value={completed} accent />
            <StatCard label="待完成任务" value={pending} />
          </section>

          <section className="mb-6 rounded-2xl border border-sand bg-paper px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink-soft">完成进度</span>
              <span className="font-display text-2xl font-semibold text-terracotta">
                {completionRate}%
              </span>
            </div>
            <div className="mt-3 overflow-hidden rounded-full bg-sand">
              <div
                className="h-2 rounded-full bg-terracotta transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-ink-muted">
              共 {total} 项待办，已完成 {completed} 项
            </p>
          </section>

          <section className="mb-8">
            <p className="text-sm text-ink-soft">{getSummaryText()}</p>
          </section>

          <section>
            <p className="mb-4 text-sm font-medium text-ink-soft">最近待办</p>
            <ul className="space-y-3">
              {recentTodos.map((todo, index) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  index={index}
                />
              ))}
            </ul>
          </section>
        </>
      )}
    </main>
  );
}
