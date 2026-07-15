'use client';

import { useState } from 'react';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      alert('用户名不能为空');
      return;
    }

    if (password.length < 6) {
      alert('密码长度不少于6位');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.msg || '注册成功');
        router.push('/login');
      } else {
        alert(data.msg || '注册失败');
      }
    } catch (err) {
      alert('注册请求失败，请检查后端服务是否启动');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div
        className="w-full max-w-md animate-[fade-in-up_0.6s_ease-out]"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-terracotta/10">
            <UserPlus className="h-8 w-8 text-terracotta" />
          </div>
          <h1 className="font-display text-4xl font-semibold text-ink">创建账号</h1>
          <p className="mt-2 text-sm text-ink-soft">注册后即可使用待办清单</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-sand bg-white p-8 shadow-sm">
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-ink">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              className="w-full rounded-xl border border-sand bg-paper px-4 py-3 text-base text-ink placeholder:text-ink-muted transition-colors focus:border-terracotta focus:outline-none"
            />
          </div>

          <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-ink">密码</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码（不少于6位）"
                className="w-full rounded-xl border border-sand bg-paper px-4 py-3 pr-12 text-base text-ink placeholder:text-ink-muted transition-colors focus:border-terracotta focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-soft transition-colors hover:text-terracotta"
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta px-6 py-4 text-base font-medium text-white transition-all hover:bg-terracotta/90 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                <circle className="h-full w-full animate-spin rounded-full border-2 border-white border-t-transparent" />
              </svg>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                <span>注册</span>
              </>
            )}
          </button>

          <p className="mt-4 text-center text-sm text-ink-soft">
            已有账号？
            <Link href="/login" className="ml-1 text-terracotta font-medium transition-colors hover:text-terracotta/80">
              去登录
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
