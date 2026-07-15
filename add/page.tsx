'use client';

import { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AddTodoPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('请输入待办标题');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('创建待办失败');
      }

      router.push('/');
    } catch (err) {
      alert('创建失败，请重试');
    } finally {
      setLoading(false);
    }
  };

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
          Add · 新增待办
        </p>
        <h1 className="font-display text-4xl font-semibold text-ink">
          新建待办
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        {/* 错误提示 */}
        {error && (
          <p className="text-sm text-terracotta">{error}</p>
        )}

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta px-6 py-4 text-white font-medium transition-all hover:bg-terracotta/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <>
              <Plus className="h-5 w-5" />
              <span>创建待办</span>
            </>
          )}
        </button>
      </form>
    </main>
  );
}
