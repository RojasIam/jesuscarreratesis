'use client';

import { useSidebar } from '@/context/SidebarContext';
import AppHeader from '@/layout/AppHeader';
import AppSidebar from '@/layout/AppSidebar';
import Backdrop from '@/layout/Backdrop';
import MobileBottomNav from '@/layout/MobileBottomNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? 'ml-0'
    : isExpanded || isHovered
      ? 'xl:ml-[240px]'
      : 'xl:ml-[72px]';

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar />
      <Backdrop />
      <div className={`min-w-0 flex-1 overflow-x-hidden transition-all duration-300 ease-in-out ${mainContentMargin}`}>
        <AppHeader />
        <div className="w-full min-w-0 px-3 py-4 pb-24 md:px-4 md:py-5 md:pb-24 xl:pb-6">
          {children}
        </div>
        <MobileBottomNav />
      </div>
    </div>
  );
}
