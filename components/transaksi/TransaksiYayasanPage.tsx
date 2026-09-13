'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TransaksiYayasan from './TransaksiYayasan';
import styles from './TransaksiYayasanPage.module.css';

export default function TransaksiYayasanPage() {
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
        <TransaksiYayasan />
      </main>
    </div>
  );
}
