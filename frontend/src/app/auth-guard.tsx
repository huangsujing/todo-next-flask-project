'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('login-token') === 'ok';
    const isLoginPage = pathname === '/login';
    const isRegisterPage = pathname === '/register';

    if (!isLoggedIn && !isLoginPage && !isRegisterPage) {
      router.push('/login');
    }
  }, [pathname, router]);

  return null;
}
