'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DataNonMedis from './DataNonMedis';
import styles from './DataNonMedisPage.module.css';

export default function DataNonMedisPage() {
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
        <DataNonMedis />
      </main>
    </div>
  );
}
