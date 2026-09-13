'use client';

import Image from 'next/image';
import logoImg from '@/public/images/logo_clean.png';
import Benefits from './Benefits';
import styles from './BrandPanel.module.css';

export default function BrandPanel() {
  return (
    <aside className={styles.brandPanel}>

      {/* Decorative circles — top right corner */}
      <div className={styles.decoTopRight} aria-hidden="true">
        <div className={styles.decoCircle1} />
        <div className={styles.decoCircle2} />
      </div>

      <div className={styles.inner}>

        {/* ── Teks di tengah atas logo ── */}
        <div className={styles.textBlock}>
          <h1 className={`${styles.headline} ${styles.desktopOnly}`}>
            Kebaikan hari ini,<br />
            untuk lebih banyak<br />
            <span className={styles.accentText}>teman esok nanti.</span>
          </h1>
          <div className={`${styles.accentLine} ${styles.desktopOnly}`} />
          <p className={`${styles.description} ${styles.desktopOnly}`}>
            Menghubungkan bantuan,<br />
            membangun harapan, untuk<br />
            mereka yang membutuhkan.
          </p>
        </div>

        {/* ── Logo + Brand — tepat di bawah teks ── */}
        <div className={styles.logoBrandWrap}>
          <div className={styles.logoWrap}>
            <Image
              src={logoImg}
              alt="Untuk Teman Logo"
              width={80}
              height={80}
              className={styles.logo}
              priority
            />
          </div>
          <p className={styles.brandLabel}>Finance</p>
          <p className={styles.brandName}>UNTUK TEMAN</p>
          <p className={styles.brandSubtitle}>
            Data untuk dampak<br />lebih besar
          </p>
        </div>

        {/* Spacer mendorong benefits ke bawah */}
        <div className={styles.spacer} />

        {/* ── Benefits strip ── */}
        <div className={`${styles.benefitsWrap} ${styles.desktopOnly}`}>
          <Benefits />
        </div>

      </div>

      {/* Wave — bawah panel */}
      <div className={styles.waveWrap} aria-hidden="true">
        <svg
          className={styles.wave}
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0 C360,80 1080,80 1440,0 L1440,80 L0,80 Z"
            fill="var(--butter-yellow)"
          />
        </svg>
      </div>
    </aside>
  );
}
