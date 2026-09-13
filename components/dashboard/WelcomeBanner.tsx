import styles from './WelcomeBanner.module.css';

export default function WelcomeBanner() {
  return (
    <div className={styles.banner}>
      <span className={styles.tag}>DASHBOARD</span>
      <h1 className={styles.title}>Selamat datang, Daniel!</h1>
      <p className={styles.subtitle}>Mari terus memberikan dampak positif bersama.</p>
    </div>
  );
}
