'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Pengaturan from './Pengaturan';
import styles from './PengaturanPage.module.css';

export default function PengaturanPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      {/* Shared Sidebar navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <main className={styles.mainContent}>
        <Pengaturan />
      </main>
    </div>
  );
}
