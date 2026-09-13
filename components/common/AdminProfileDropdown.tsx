'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { UserProfileData } from '@/lib/supabase/services';
import styles from './AdminProfileDropdown.module.css';

interface AdminProfileDropdownProps {
  profile: UserProfileData;
  align?: 'right' | 'left';
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease',
        color: '#64748b',
        flexShrink: 0,
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

export default function AdminProfileDropdown({ profile, align = 'right' }: AdminProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const getInitials = (nama?: string, email?: string) => {
    const str = (nama || email?.split('@')[0] || 'User').trim();
    const parts = str.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return str.slice(0, 2).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };

  const displayName = profile.nama || (profile.email ? profile.email.split('@')[0] : 'Admin');
  const displayEmail = profile.email || 'admin@yayasan.org';

  return (
    <div className={styles.container} ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        type="button"
        className={`${styles.triggerBtn} ${isOpen ? styles.triggerBtnActive : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Menu Profil Admin"
      >
        <div className={styles.avatarWrap}>
          {profile.avatarUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={profile.avatarUrl} alt={displayName} className={styles.avatarImg} />
          ) : (
            <span className={styles.avatarFallback}>{getInitials(profile.nama, profile.email)}</span>
          )}
        </div>
        <div className={styles.metaWrap}>
          <span className={styles.metaName}>{displayName}</span>
          <span className={styles.metaEmail}>{displayEmail}</span>
        </div>
        <ChevronDownIcon open={isOpen} />
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div className={`${styles.dropdownMenu} ${align === 'left' ? styles.dropdownLeft : styles.dropdownRight}`}>
          {/* Header Popover with details */}
          <div className={styles.popoverHeader}>
            <div className={styles.popoverBigAvatar}>
              {profile.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={profile.avatarUrl} alt={displayName} className={styles.avatarImg} />
              ) : (
                <span className={styles.bigAvatarFallback}>{getInitials(profile.nama, profile.email)}</span>
              )}
            </div>
            <div className={styles.popoverInfo}>
              <h4 className={styles.popoverName}>{displayName}</h4>
              <p className={styles.popoverEmail}>{displayEmail}</p>
              <span className={styles.roleBadge}>
                <ShieldCheckIcon /> Administrator
              </span>
            </div>
          </div>

          {/* Account Details Box */}
          <div className={styles.detailsBox}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Status Akun</span>
              <span className={styles.detailValue}>
                <span className={styles.statusDot} /> Aktif &amp; Terverifikasi
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Hak Akses</span>
              <span className={styles.detailValue}>Kelola Penuh Yayasan</span>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Action Links */}
          <div className={styles.actionsList}>
            <button
              type="button"
              className={styles.actionItem}
              onClick={() => handleNavigate('/pengaturan')}
            >
              <SettingsIcon />
              <span>Pengaturan Akun &amp; Profil</span>
            </button>

            <button
              type="button"
              className={`${styles.actionItem} ${styles.actionItemDanger}`}
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogoutIcon />
              <span>{isLoggingOut ? 'Sedang Keluar...' : 'Keluar (Sign Out)'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
