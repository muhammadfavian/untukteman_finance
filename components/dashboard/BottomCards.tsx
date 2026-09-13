'use client';

import { useEffect, useState } from 'react';
import { getDashboardStats, subscribeToDatabaseChanges, DashboardStats } from '@/lib/supabase/services';
import styles from './BottomCards.module.css';

/* ── Icons ── */
function ArrowUpRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function ArrowDownRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="7" x2="17" y2="17" />
      <polyline points="17 7 17 17 7 17" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function formatRp(num: number): string {
  return 'Rp ' + num.toLocaleString('id-ID');
}

export default function BottomCards() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPasien: 0,
    totalDataNonMedis: 0,
    totalPerputaranUang: 0,
    duitMasuk: 0,
    duitKeluar: 0,
    banyakPengeluaranKategori: 'Data Non Medis',
    chartData: [],
    loading: true,
  });

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        const data = await getDashboardStats();
        if (isMounted) setStats(data);
      } catch (e) {
        console.error('Error loading bottom cards stats:', e);
      }
    };

    run();

    const unsubscribe = subscribeToDatabaseChanges(() => {
      run();
    });

    const handleFocus = () => {
      run();
    };
    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', handleFocus);

    return () => {
      isMounted = false;
      unsubscribe();
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleFocus);
    };
  }, []);

  const currentMonthName = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <div className={styles.grid}>
      {/* Duit Masuk */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={`${styles.iconWrap} ${styles.iconBlue}`}>
            <ArrowUpRight />
          </div>
          <p className={styles.cardLabel}>Duit Masuk</p>
        </div>
        <p className={styles.cardAmount}>{stats.loading ? '...' : formatRp(stats.duitMasuk)}</p>
        <p className={styles.cardDesc}>Total pemasukan pada bulan {currentMonthName}.</p>
      </div>

      {/* Duit Keluar */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={`${styles.iconWrap} ${styles.iconYellow}`}>
            <ArrowDownRight />
          </div>
          <p className={styles.cardLabel}>Duit Keluar</p>
        </div>
        <p className={styles.cardAmount}>{stats.loading ? '...' : formatRp(stats.duitKeluar)}</p>
        <p className={styles.cardDesc}>Total pengeluaran pada bulan {currentMonthName}.</p>
      </div>

      {/* Banyak Pengeluaran */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={`${styles.iconWrap} ${styles.iconRed}`}>
            <AlertIcon />
          </div>
          <p className={styles.cardLabel}>Banyak Pengeluaran</p>
        </div>
        <p className={styles.cardAmountAlt}>{stats.loading ? '...' : stats.banyakPengeluaranKategori}</p>
        <p className={styles.cardDesc}>Kategori dengan pengeluaran terbesar dari data aman.</p>
      </div>
    </div>
  );
}
