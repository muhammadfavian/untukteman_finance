'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDashboardStats, subscribeToDatabaseChanges, DashboardStats } from '@/lib/supabase/services';
import styles from './StatCards.module.css';

/* ── Icons ── */
function PasienCardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6m3-3h-6" />
    </svg>
  );
}

function KategoriNonMedisCardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function UangCardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <circle cx="12" cy="14.5" r="2" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
      <circle cx="5" cy="12" r="1.5" />
    </svg>
  );
}

function formatRp(num: number): string {
  return 'Rp ' + num.toLocaleString('id-ID');
}

export default function StatCards() {
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
        console.error('Error loading dashboard stats:', e);
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

  const cards = [
    {
      href: '/data-pasien',
      icon: <PasienCardIcon />,
      iconBg: 'rgba(14, 163, 214, 0.12)',
      iconColor: '#0EA3D6',
      title: 'Data Pasien',
      value: stats.loading ? '...' : stats.totalPasien.toLocaleString('id-ID'),
      desc: 'Total data pasien',
      growth: '12,73%',
      growthLabel: 'dibanding bulan lalu',
      hasDots: true,
    },
    {
      href: '/data-nonmedis',
      icon: <KategoriNonMedisCardIcon />,
      iconBg: '#FFF59C',
      iconColor: '#b45309',
      title: 'Data Non Medis',
      value: stats.loading ? '...' : stats.totalDataNonMedis.toLocaleString('id-ID'),
      desc: 'Total data non medis',
      growth: '8,24%',
      growthLabel: 'dibanding bulan lalu',
      hasDots: true,
    },
    {
      href: '/transaksi-yayasan',
      icon: <UangCardIcon />,
      iconBg: 'rgba(34, 197, 94, 0.12)',
      iconColor: '#16a34a',
      title: 'Rekapan Keseluruhan Uang',
      value: stats.loading ? '...' : formatRp(stats.totalPerputaranUang),
      desc: 'Total perputaran uang',
      growth: '11,94%',
      growthLabel: 'dibanding bulan lalu',
      hasDots: false,
    },
  ];

  return (
    <div className={styles.grid}>
      {cards.map((card, i) => (
        <Link key={i} href={card.href} className={styles.card}>
          <div className={styles.iconWrap} style={{ background: card.iconBg, color: card.iconColor }}>
            {card.icon}
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardTop}>
              <p className={styles.cardTitle}>{card.title}</p>
              {card.hasDots && (
                <button
                  className={styles.dotsBtn}
                  aria-label="Options"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <DotsIcon />
                </button>
              )}
            </div>
            <p className={styles.cardValue}>{card.value}</p>
            <p className={styles.cardDesc}>{card.desc}</p>

          </div>
        </Link>
      ))}
    </div>
  );
}
