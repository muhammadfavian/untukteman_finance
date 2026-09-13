'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import styles from './Sidebar.module.css';

/* ── Icon components ── */
function DashboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function PasienIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function KategoriIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function TransaksiIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}



function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function GreenDot() {
  return <span className={styles.greenDot} />;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    if (path === '#') return false;
    return pathname === path;
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/login');
    router.refresh();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className={styles.overlay} onClick={onClose} />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <img
            src="/images/logo_clean.png"
            alt="Untuk Teman Logo"
            width={56}
            height={56}
            className={styles.logo}
          />
          <p className={styles.brandName}>UNTUK TEMAN</p>
          <p className={styles.brandSub}>Data untuk dampak<br />lebih besar</p>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {/* DASHBOARD section */}
          <p className={styles.sectionLabel}>DASHBOARD</p>
          <Link
            href="/dashboard"
            className={`${styles.navItem} ${isActive('/dashboard') ? styles.active : ''}`}
          >
            <DashboardIcon />
            <span>Dashboard</span>
          </Link>

          {/* DATA section */}
          <p className={styles.sectionLabel}>DATA</p>
          <Link
            href="/data-pasien"
            className={`${styles.navItem} ${isActive('/data-pasien') ? styles.active : ''}`}
          >
            <PasienIcon />
            <span>Data Pasien</span>
          </Link>
          <Link
            href="/data-nonmedis"
            className={`${styles.navItem} ${isActive('/data-nonmedis') || isActive('/kategori') ? styles.active : ''}`}
          >
            <KategoriIcon />
            <span>Data Non Medis</span>
          </Link>

          {/* TRANSAKSI section */}
          <p className={styles.sectionLabel}>TRANSAKSI</p>
          <Link
            href="/transaksi-yayasan"
            className={`${styles.navItem} ${isActive('/transaksi-yayasan') ? styles.active : ''}`}
          >
            <TransaksiIcon />
            <span>Transaksi Yayasan</span>
          </Link>

          {/* LAINNYA section */}
          <p className={styles.sectionLabel}>LAINNYA</p>
          <Link
            href="/pengaturan"
            className={`${styles.navItem} ${isActive('/pengaturan') ? styles.active : ''}`}
          >
            <SettingsIcon />
            <span>Pengaturan</span>
          </Link>

          {/* Bottom — pushed down by margin-top: auto */}
          <div className={styles.bottomArea}>
            {/* System Online */}
            <div className={styles.systemCard}>
              <div className={styles.systemHeader}>
                <GreenDot />
                <span className={styles.systemTitle}>System Online</span>
              </div>
              <p className={styles.systemDesc}>Semua sistem berjalan normal</p>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className={styles.logoutBtn}
              aria-label="Log out"
            >
              <LogoutIcon />
              <span>{loggingOut ? 'Keluar...' : 'Log Out'}</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
