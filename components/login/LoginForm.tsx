'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import styles from './LoginForm.module.css';

// Icons
function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={styles.spinner}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 019.49 6.83" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (
          signInError.message.toLowerCase().includes('invalid login credentials') ||
          signInError.message.toLowerCase().includes('invalid email or password')
        ) {
          setError('Email atau password salah. Silakan coba lagi.');
        } else if (signInError.message.toLowerCase().includes('email not confirmed')) {
          setError('Email belum dikonfirmasi. Periksa kotak masuk Anda.');
        } else {
          setError(signInError.message);
        }
        return;
      }

      window.location.href = '/dashboard';
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <section className={styles.rightPanel}>
      {/* Decorative circles — bottom right */}
      <div className={styles.decoBottomRight} aria-hidden="true">
        <div className={styles.decoBR1} />
        <div className={styles.decoBR2} />
        <div className={styles.decoYellowArc} />
      </div>

      {/* Center: login card */}
      <div className={styles.cardWrapper}>
        <div className={styles.card}>
          {/* Welcome label */}
          <p className={styles.welcomeLabel}>SELAMAT DATANG</p>

          {/* Yellow short line */}
          <div className={styles.cardAccentLine} />

          {/* Heading */}
          <h2 className={styles.cardHeading}>Masuk ke akun Anda</h2>

          {/* Subtext */}
          <p className={styles.cardSubtext}>
            Untuk melanjutkan mengelola data dan<br />
            memberikan dampak lebih besar bersama.
          </p>

          {/* Error banner */}
          {error && (
            <div className={styles.errorBanner} role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{flexShrink: 0}}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {/* Email field */}
            <div className={styles.fieldGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}><EmailIcon /></span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email Anda"
                  className={styles.input}
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password field */}
            <div className={styles.fieldGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}><LockIcon /></span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className={styles.input}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Remember me + forgot password */}
            <div className={styles.rememberRow}>
              <label className={styles.checkboxLabel} htmlFor="remember-me">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>Ingat saya</span>
              </label>
              <a href="#" className={styles.forgotLink}>Lupa password?</a>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              id="login-submit-btn"
              className={`${styles.submitButton} ${loading ? styles.submitButtonLoading : ''}`}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span>Memproses...</span>
                  <SpinnerIcon />
                </>
              ) : (
                <>
                  <span>Masuk</span>
                  <ArrowIcon />
                </>
              )}
            </button>
          </form>


        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <p className={styles.footerQuote}>&ldquo;Data hari ini, untuk masa depan yang lebih baik.&rdquo;</p>
          <p className={styles.footerBrand}>UNTUK TEMAN &bull; Membantu lebih banyak, bersama.</p>
        </footer>
      </div>
    </section>
  );
}
