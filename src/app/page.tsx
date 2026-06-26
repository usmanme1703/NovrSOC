'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DashboardSelector } from '@/components/layout/DashboardSelector';
import { InfoCards } from '@/components/layout/RightRail';

import { GeneralDashboard } from '@/components/dashboards/GeneralDashboard';
import { ExecutiveDashboard } from '@/components/dashboards/ExecutiveDashboard';
import { ManagerDashboard } from '@/components/dashboards/ManagerDashboard';
import { AnalystDashboard } from '@/components/dashboards/AnalystDashboard';

import {
  ComplianceDashboard,
  SoarDashboard,
  ReportingDashboard,
  CustomerDashboard,
  NovrAiCommandCenter
} from '@/components/dashboards/PlatformDashboards';

export default function Home() {
  const [activeDashboard, setActiveDashboard] = useState<string>('General');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderDashboard = () => {
    switch (activeDashboard) {
      case 'General':                 return <GeneralDashboard />;
      case 'Executive':               return <ExecutiveDashboard />;
      case 'SOC Manager':             return <ManagerDashboard />;
      case 'SOC Analyst':             return <AnalystDashboard />;
      case 'Compliance':              return <ComplianceDashboard />;
      case 'SOAR Platform':           return <SoarDashboard />;
      case 'Reporting Center':        return <ReportingDashboard />;
      case 'Customer Multi-Tenant':   return <CustomerDashboard />;
      case 'NovrAI Command Center':   return <NovrAiCommandCenter />;
      default:                        return <GeneralDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#111827] text-gray-900 dark:text-gray-100 flex font-sans antialiased transition-colors duration-200">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col">
        <Header
          currentDashboard={activeDashboard}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(!darkMode)}
        />
        <DashboardSelector value={activeDashboard} onChange={setActiveDashboard} />

        <div className="p-8 flex-1 overflow-y-auto">
          {renderDashboard()}
          <InfoCards />
        </div>
      </div>
    </div>
  );
}
