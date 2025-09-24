import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useCalendarStore } from '@/store/calendarStore';
import { format } from 'date-fns';
import { ThemeToggle } from '@/components/ThemeToggle';
export function ChronoHeader() {
  const { currentDate, nextMonth, prevMonth, goToToday, openDialog, view, setView } = useCalendarStore();
  const handleViewChange = (value: string) => {
    if (value) {
      setView(value as 'month' | 'week' | 'day');
    }
  };
  return (
    <header className="p-4 md:p-6 flex flex-wrap items-center justify-between gap-4 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <CalendarIcon className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-display font-bold text-foreground">Chrono</h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="outline" size="sm" onClick={goToToday} className="transition-all hover:shadow-md">
          Today
        </Button>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={prevMonth} aria-label="Previous month">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-lg font-medium text-foreground w-32 text-center tabular-nums">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <Button variant="ghost" size="icon" onClick={nextMonth} aria-label="Next month">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ToggleGroup type="single" value={view} onValueChange={handleViewChange} aria-label="Calendar View">
          <ToggleGroupItem value="month" aria-label="Month view">Month</ToggleGroupItem>
          <ToggleGroupItem value="week" aria-label="Week view">Week</ToggleGroupItem>
          <ToggleGroupItem value="day" aria-label="Day view">Day</ToggleGroupItem>
        </ToggleGroup>
        <ThemeToggle />
        <Button
          onClick={openDialog}
          className="transition-all duration-200 ease-in-out bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
        >
          Create Event
        </Button>
      </div>
    </header>
  );
}