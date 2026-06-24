'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DashboardSelector } from '@/components/layout/DashboardSelector';
import { RightRail } from '@/components/layout/RightRail';

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
  const [activeDashboard, setActiveDashboard] = useState<string>("General");
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Toggle utility hook mapping dark class directives directly onto document HTML element nodes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderDashboard = () => {
    switch (activeDashboard) {
      case "General": return <GeneralDashboard />;
      case "Executive": return <ExecutiveDashboard />;
      case "SOC Manager": return <ManagerDashboard />;
      case "SOC Analyst": return <AnalystDashboard />;
      case "Compliance": return <ComplianceDashboard />;
      case "SOAR Platform": return <SoarDashboard />;
      case "Reporting Center": return <ReportingDashboard />;
      case "Customer Multi-Tenant": return <CustomerDashboard />;
      case "NovrAI Command Center": return <NovrAiCommandCenter />;
      default: return <GeneralDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#111827] text-gray-900 dark:text-gray-100 flex font-sans antialiased transition-colors duration-200">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header containing theme toggle button */}
        <div className="relative">
          <Header currentDashboard={activeDashboard} />
          {/* Absolute floating interactive theme toggle trigger action anchor right next to cloud node indicators */}
          <div className="absolute right-48 top-[18px] z-30">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0B0F19] text-xs font-bold text-gray-600 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? '☀️ Light View' : '🌙 Corporate Dark'}
            </button>
          </div>
        </div>

        <DashboardSelector value={activeDashboard} onChange={setActiveDashboard} />

        <div className="p-8 flex-1 overflow-y-auto">
          {renderDashboard()}
        </div>
      </div>

      <RightRail />
    </div>
  );
}