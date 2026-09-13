'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DataPasien from './DataPasien';
import styles from './DataPasienPage.module.css';

export default function DataPasienPage() {
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
        <DataPasien />
      </main>
    </div>
  );
}
