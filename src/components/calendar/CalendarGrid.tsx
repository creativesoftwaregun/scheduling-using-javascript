import { useCalendarStore } from '@/store/calendarStore';
import { Skeleton } from '@/components/ui/skeleton';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
export function CalendarGrid() {
  const view = useCalendarStore((state) => state.view);
  const isLoading = useCalendarStore((state) => state.isLoading);
  const events = useCalendarStore((state) => state.events);
  if (isLoading && events.length === 0) {
    return <CalendarSkeleton />;
  }
  const renderView = () => {
    switch (view) {
      case 'month':
        return <MonthView />;
      case 'week':
        return <WeekView />;
      case 'day':
        return <DayView />;
      default:
        return <MonthView />;
    }
  };
  return renderView();
}
function CalendarSkeleton() {
    const days = Array.from({ length: 35 });
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
        <div className="flex-grow flex flex-col p-4 md:p-6 animate-pulse">
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-muted-foreground pb-2 border-b">
                {daysOfWeek.map((day) => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 grid-rows-5 flex-grow gap-px bg-border -ml-px -mt-px">
                {days.map((_, i) => (
                    <div key={i} className="bg-background p-2 flex flex-col border-t border-l border-border">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="mt-2 space-y-2">
                            <Skeleton className="h-4 w-full rounded" />
                            <Skeleton className="h-4 w-2/3 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}