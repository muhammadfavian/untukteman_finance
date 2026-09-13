import styles from './DashboardFooter.module.css';

export default function DashboardFooter() {
  return (
    <footer className={styles.footer}>
      <p className={styles.quote}>&ldquo;Data hari ini, untuk masa depan yang lebih baik.&rdquo;</p>
      <p className={styles.brand}>UNTUK TEMAN &bull; Membantu lebih banyak, bersama.</p>
    </footer>
  );
}
