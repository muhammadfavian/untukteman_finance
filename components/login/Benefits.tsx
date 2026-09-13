import styles from './Benefits.module.css';

const benefits = [
  {
    id: 'data-aman',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2L4 6v6c0 5.25 3.4 10.15 8 11.5C16.6 22.15 20 17.25 20 12V6L12 2z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 12l2 2 4-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Data Aman',
    subtitle: 'dan Terlindungi',
  },
  {
    id: 'berdampak',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="5" cy="14" r="2.5" stroke="currentColor" strokeWidth="2" />
        <circle cx="19" cy="14" r="2.5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 11c-3 0-6 1.5-6 4v1h12v-1c0-2.5-3-4-6-4z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Berdampak',
    subtitle: 'Lebih Luas',
  },
  {
    id: 'bersama',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Bersama',
    subtitle: 'untuk Sesama',
  },
];

export default function Benefits() {
  return (
    <div className={styles.benefitsContainer}>
      {benefits.map((benefit) => (
        <div key={benefit.id} className={styles.benefitItem}>
          <div className={styles.icon}>{benefit.icon}</div>
          <p className={styles.title}>{benefit.title}</p>
          <p className={styles.subtitle}>{benefit.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
