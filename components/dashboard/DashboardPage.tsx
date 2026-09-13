'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import StatCards from './StatCards';
import FinancialOverview from './FinancialOverview';
import BottomCards from './BottomCards';
import DashboardFooter from './DashboardFooter';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main dashboard content */}
      <main className={styles.mainContent}>
        <TopHeader onMenuClick={() => setSidebarOpen(true)} />
        <StatCards />
        <FinancialOverview />
        <BottomCards />
        <DashboardFooter />
      </main>
    </div>
  );
}
