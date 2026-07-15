'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { type Todo } from '@/components/TodoItem';

export default function EditTodoPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const todoId = parseInt(params.id);

  const [todo, setTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`/api/todos?userId=${userId}`);
        const todos: Todo[] = await response.json();
        const found = todos.find((t) => t.id === todoId);
        
        if (found) {
          setTodo(found);
          setTitle(found.title);
          setDescription(found.description);
          setCompleted(found.completed);
        } else {
          setError('待办不存在');
        }
      } catch (err) {
        setError('获取待办失败');
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [todoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('请输入待办标题');
      return;
    }

    setError('');
    setSaving(true);

    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`/api/todo/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          completed,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('更新待办失败');
      }

      router.push('/');
    } catch (err) {
      alert('更新失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto min-h-screen max-w-xl px-6 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
      </main>
    );
  }

  if (error && !todo) {
    return (
      <main className="mx-auto min-h-screen max-w-xl px-6 py-16">
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-ink-soft transition-colors hover:text-terracotta"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">返回列表</span>
        </button>
        <p className="text-terracotta">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl px-6 py-16 sm:py-24">
      {/* 返回按钮 */}
      <button
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-ink-soft transition-colors hover:text-terracotta"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="text-sm font-medium">返回列表</span>
      </button>

      {/* 标题区 */}
      <header className="mb-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">
          Edit · 编辑待办
        </p>
        <h1 className="font-display text-4xl font-semibold text-ink">
          编辑待办
        </h1>
      </header>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 标题输入 */}
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-ink"
          >
            标题 <span className="text-terracotta">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="请输入待办标题"
            className="w-full rounded-xl border border-sand bg-paper px-4 py-3 text-ink placeholder-ink-muted outline-none transition-all focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/20"
            disabled={saving}
          />
        </div>

        {/* 描述输入 */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-ink"
          >
            描述
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="请输入待办描述（可选）"
            rows={4}
            className="w-full resize-none rounded-xl border border-sand bg-paper px-4 py-3 text-ink placeholder-ink-muted outline-none transition-all focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/20"
            disabled={saving}
          />
        </div>

        {/* 完成状态切换 */}
        <div className="flex items-center justify-between rounded-xl border border-sand bg-paper px-4 py-3">
          <span className="text-sm font-medium text-ink">完成状态</span>
          <button
            type="button"
            onClick={() => setCompleted(!completed)}
            disabled={saving}
            className={`relative flex h-6 w-11 items-center rounded-full transition-colors ${
              completed ? 'bg-terracotta' : 'bg-sand'
            }`}
          >
            <span
              className={`absolute h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                completed ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* 错误提示 */}
        {error && (
          <p className="text-sm text-terracotta">{error}</p>
        )}

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta px-6 py-4 text-white font-medium transition-all hover:bg-terracotta/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span>保存修改</span>
            </>
          )}
        </button>
      </form>
    </main>
  );
}
