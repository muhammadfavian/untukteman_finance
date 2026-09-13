'use client';

import { useEffect, useState } from 'react';
import { getUserProfile, UserProfileData } from '@/lib/supabase/services';
import AdminProfileDropdown from '@/components/common/AdminProfileDropdown';
import styles from './TopHeader.module.css';

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

interface TopHeaderProps {
  onMenuClick?: () => void;
}

export default function TopHeader({ onMenuClick }: TopHeaderProps) {
  const [profile, setProfile] = useState<UserProfileData>({
    id: '',
    email: '',
    nama: '',
    role: 'Admin',
    avatarUrl: '',
  });

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await getUserProfile();
        if (isMounted) setProfile(data);
      } catch (err) {
        console.error(err);
      }
    };
    load();

    const handleUpdate = () => load();
    window.addEventListener('user-profile-updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('user-profile-updated', handleUpdate);
    };
  }, []);

  return (
    <header className={styles.header}>
      {/* Left side: Greeting */}
      <div className={styles.greetingWrap}>
        <button className={styles.hamburger} onClick={onMenuClick} aria-label="Menu">
          <HamburgerIcon />
        </button>
        <div className={styles.greetingText}>
          <span className={styles.tag}>DASHBOARD</span>
          <h1 className={styles.title}>Selamat datang, {profile.nama || 'User'}!</h1>
          <p className={styles.subtitle}>Mari terus memberikan dampak positif bersama.</p>
        </div>
      </div>

      {/* Right side: Profile */}
      <div className={styles.rightSide}>
        <AdminProfileDropdown profile={profile} />
      </div>
    </header>
  );
}

