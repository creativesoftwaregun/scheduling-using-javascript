import { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { EventDialog } from '@/components/calendar/EventDialog';
import { Toaster } from '@/components/ui/sonner';
import { useCalendarStore } from '@/store/calendarStore';
export function HomePage() {
  const fetchInitialData = useCalendarStore((state) => state.fetchInitialData);
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);
  return (
    <>
      <div className="min-h-screen w-full bg-background text-foreground antialiased">
        <div
          className="fixed inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-background dark:bg-[linear-gradient(to_right,#1e1e1e_1px,transparent_1px),linear-gradient(to_bottom,#1e1e1e_1px,transparent_1px)]">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--primary)/0.05),transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--primary)/0.1),transparent)]"></div>
        </div>
        <AppLayout>
          <CalendarGrid />
        </AppLayout>
        <EventDialog />
      </div>
      <Toaster richColors closeButton />
    </>
  );
}