import type { Metadata } from 'next';
import LoginPage from '@/components/login/LoginPage';

export const metadata: Metadata = {
  title: 'Masuk — Untuk Teman',
  description: 'Masuk ke akun Anda untuk melanjutkan mengelola data dan memberikan dampak lebih besar bersama.',
};

export default function LoginRoute() {
  return <LoginPage />;
}
