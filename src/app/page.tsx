'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DashboardSelector } from '@/components/layout/DashboardSelector';
import { RightRail } from '@/components/layout/RightRail';

// Role Dashboards Imports
import { GeneralDashboard } from '@/components/dashboards/GeneralDashboard';
import { ExecutiveDashboard } from '@/components/dashboards/ExecutiveDashboard';
import { ManagerDashboard } from '@/components/dashboards/ManagerDashboard';
import { AnalystDashboard } from '@/components/dashboards/AnalystDashboard';

// Platform Dashboards Imports
import {
  ComplianceDashboard,
  SoarDashboard,
  ReportingDashboard,
  CustomerDashboard,
  NovrAiCommandCenter
} from '@/components/dashboards/PlatformDashboards';

export default function Home() {
  const [activeDashboard, setActiveDashboard] = useState<string>("General");

  // Orchestrator Mapping Tree handling all 14 functional entry points smoothly
  const renderDashboard = () => {
    switch (activeDashboard) {
      // Role Dashboards
      case "General":
        return <GeneralDashboard />;
      case "Executive":
        return <ExecutiveDashboard />;
      case "SOC Manager":
        return <ManagerDashboard />;
      case "SOC Analyst":
        return <AnalystDashboard />;

      // Service Dashboards (Reusing the robust General layout as a comprehensive visual canvas baseline)
      case "Threat Intelligence":
      case "Security Operations":
      case "Assets & Risk":
      case "Exposure Monitoring":
      case "Protection & Automation":
        return <GeneralDashboard />;

      // Platform Dashboards
      case "Compliance":
        return <ComplianceDashboard />;
      case "SOAR Platform":
        return <SoarDashboard />;
      case "Reporting Center":
        return <ReportingDashboard />;
      case "Customer Multi-Tenant":
        return <CustomerDashboard />;
      case "NovrAI Command Center":
        return <NovrAiCommandCenter />;

      default:
        return <GeneralDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 flex font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col">
        <Header currentDashboard={activeDashboard} />
        <DashboardSelector value={activeDashboard} onChange={setActiveDashboard} />

        <div className="p-8 flex-1 overflow-y-auto">
          {renderDashboard()}
        </div>
      </div>

      <RightRail />
    </div>
  );
}