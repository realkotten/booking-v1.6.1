import React, { useState } from 'react';
import { useAtelier } from '../../store/AtelierContext';
import { ManagementTab } from '../../types';
import { AtelierShell } from '../AtelierShell';
import { TodayView } from './TodayView';
import { ScheduleView } from './ScheduleView';
import { ClientsView } from './ClientsView';
import { AnalyticsView } from './AnalyticsView';
import { ServiceManagementView } from './ServiceManagementView';
import { ReportsView } from './reports/ReportsView';
import { StudioSettingsView } from './settings/StudioSettingsView';
import { ClientDossierModal } from './ClientDossierModal';
import { DynamicIslandNotificationCenter } from '../notifications/DynamicIslandNotificationCenter';
import { 
  Clock, 
  Calendar, 
  Users, 
  TrendingUp, 
  Sparkles,
  Bell,
  ChevronDown,
  Scissors,
  Armchair,
  FileText,
  Sliders,
  BarChart3,
  LogOut,
  Menu,
  X,
  Flame,
  Activity,
  Layers,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import { toPersianDigits } from '../../utils/dateUtils';

export const ManagementShell: React.FC = () => {
  const { 
    managementTab, 
    setManagementTab, 
    managementSubTab,
    setManagementSubTab,
    logoutManagement,
    activeChair,
    activeBarber,
    customers,
    selectedClientForDossier,
    setSelectedClientForDossier,
  } = useAtelier();

  const handleOpenDossier = (customerId?: string) => {
    if (customerId) {
      const client = customers.find((c) => c.id === customerId);
      if (client) {
        setSelectedClientForDossier(client);
        return;
      }
    }
    setManagementTab('analytics');
    setManagementSubTab('clients');
  };

  return (
    <AtelierShell
      id="management-shell-container"
      isWideLayout={true}
      headerContent={
        <div className="w-full flex items-center justify-between gap-1.5 sm:gap-3" dir="rtl">
          {/* Right side: Studio Management Text & Barber Info */}
          <div className="text-right shrink-0 min-w-0">
            <h1 className="text-xs sm:text-sm font-serif font-black text-stone-900 leading-tight truncate">
              مدیریت رویال
            </h1>
            <p className="text-[9px] text-stone-600 font-mono mt-0.5 truncate hidden xs:block sm:block">
              {activeBarber.name} · {activeChair.name}
            </p>
          </div>

          {/* Center: Dynamic Island Notification Center */}
          <div className="flex-1 flex justify-center items-center min-w-0">
            <DynamicIslandNotificationCenter onNavigateToTab={setManagementTab as any} />
          </div>

          {/* Left side: Short Exit Button ("نمای مشتری") */}
          <div className="shrink-0 flex items-center">
            <button
              type="button"
              onClick={logoutManagement}
              className="flex items-center gap-1 bg-stone-900 hover:bg-stone-800 text-stone-100 hover:text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full transition-all shadow-sm border border-stone-700/60 cursor-pointer active:scale-95 whitespace-nowrap"
              title="خروج از پنل مدیریت و بازگشت به نمای مشتری"
            >
              <LogOut className="w-3 h-3 text-amber-400" />
              <span>نمای مشتری</span>
            </button>
          </div>
        </div>
      }
    >
      {/* 2. Main Dashboard Canvas (Fluid Flow Across Full Screen, Matching Client Portal) */}
      <section
        id="management-main-card"
        className="relative z-20 w-full px-3.5 sm:px-6 pt-2 pb-24 flex-1 min-h-0 overflow-y-auto space-y-4"
        dir="rtl"
      >
        {managementTab === 'today' && <TodayView onOpenDossier={handleOpenDossier} />}
        {managementTab === 'schedule' && <ScheduleView onOpenDossier={handleOpenDossier} />}
        {managementTab === 'clients' && (
          <ClientsView
            onOpenDossier={(cId) => {
              const client = customers.find((c) => c.id === cId);
              if (client) setSelectedClientForDossier(client);
            }}
          />
        )}
        {managementTab === 'analytics' && (
          <div className="space-y-4">
            {/* Analytics & Configuration Hub Sub-Navigation Bar */}
            <div 
              id="management-subtabs-bar"
              className="sticky top-0 z-20 flex items-center justify-between p-1.5 clay-card-subtle rounded-2xl gap-1.5 overflow-x-auto no-scrollbar backdrop-blur-xl bg-white/75 border border-white/60 shadow-sm"
            >
              {[
                { id: 'overview', label: 'آمار و تقاضا', icon: BarChart3 },
                { id: 'clients', label: 'مشتریان', icon: Users },
                { id: 'reports', label: 'گزارش‌ها', icon: FileText },
                { id: 'services', label: 'خدمات', icon: Scissors },
              ].map((st) => {
                const Icon = st.icon;
                const isSelected = managementSubTab === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setManagementSubTab(st.id as any)}
                    className={`flex-1 py-2 px-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-700 hover:text-stone-900 hover:bg-white/80'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#fbdcd9]' : 'text-stone-500'}`} />
                    <span className="truncate">{st.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Render Subtab View */}
            {managementSubTab === 'overview' && <AnalyticsView onOpenDossier={handleOpenDossier} />}
            {managementSubTab === 'clients' && (
              <ClientsView
                onOpenDossier={(cId) => {
                  const client = customers.find((c) => c.id === cId);
                  if (client) setSelectedClientForDossier(client);
                }}
              />
            )}
            {managementSubTab === 'reports' && <ReportsView />}
            {managementSubTab === 'services' && <ServiceManagementView />}
            {managementSubTab === 'settings' && <StudioSettingsView />}
          </div>
        )}
        {managementTab === 'settings' && <StudioSettingsView />}
      </section>

      {/* Client Dossier Detail & History Modal */}
      <ClientDossierModal
        customer={selectedClientForDossier}
        isOpen={!!selectedClientForDossier}
        onClose={() => setSelectedClientForDossier(null)}
        onNavigateToSchedule={() => setManagementTab('schedule')}
      />

      {/* 3. Bottom Floating Navigation Dock */}
      <div
        id="management-bottom-dock-container"
        className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-3"
      >
        <div className="px-3 max-w-sm sm:max-w-md mx-auto">
          <nav
            id="management-bottom-dock"
            aria-label="منوی ناوبری مدیریت آتلیه"
            className="pointer-events-auto nav-dock-3d rounded-full px-3 py-1.5 flex items-center justify-between"
            dir="rtl"
          >
            {/* Today Tab */}
            <button
              id="mgmt-tab-today"
              type="button"
              onClick={() => setManagementTab('today')}
              className={`flex flex-col items-center justify-center flex-1 min-h-[44px] py-1 transition-all ${
                managementTab === 'today'
                  ? 'text-[#7e5352] font-bold scale-105'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Clock className="w-4 h-4" />
                {managementTab === 'today' && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#7e5352]" />
                )}
              </div>
              <span className="text-[10px] font-medium tracking-normal mt-0.5">
                امروز
              </span>
            </button>

            {/* Schedule Tab */}
            <button
              id="mgmt-tab-schedule"
              type="button"
              onClick={() => setManagementTab('schedule')}
              className={`flex flex-col items-center justify-center flex-1 min-h-[44px] py-1 transition-all ${
                managementTab === 'schedule'
                  ? 'text-[#7e5352] font-bold scale-105'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Calendar className="w-4 h-4" />
                {managementTab === 'schedule' && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#7e5352]" />
                )}
              </div>
              <span className="text-[10px] font-medium tracking-normal mt-0.5">
                برنامه
              </span>
            </button>

            {/* Analytics & Stats Tab */}
            <button
              id="mgmt-tab-analytics"
              type="button"
              onClick={() => setManagementTab('analytics')}
              className={`flex flex-col items-center justify-center flex-1 min-h-[44px] py-1 transition-all ${
                managementTab === 'analytics'
                  ? 'text-[#7e5352] font-bold scale-105'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
                {managementTab === 'analytics' && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#7e5352]" />
                )}
              </div>
              <span className="text-[10px] font-medium tracking-normal mt-0.5">
                آمار
              </span>
            </button>

            {/* Settings Tab */}
            <button
              id="mgmt-tab-settings"
              type="button"
              onClick={() => setManagementTab('settings')}
              className={`flex flex-col items-center justify-center flex-1 min-h-[44px] py-1 transition-all ${
                managementTab === 'settings'
                  ? 'text-[#7e5352] font-bold scale-105'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Sliders className="w-4 h-4" />
                {managementTab === 'settings' && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#7e5352]" />
                )}
              </div>
              <span className="text-[10px] font-medium tracking-normal mt-0.5">
                تنظیمات
              </span>
            </button>
          </nav>
        </div>
      </div>
    </AtelierShell>
  );
};
