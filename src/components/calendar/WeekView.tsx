import { useCalendarStore } from '@/store/calendarStore';
import { cn } from '@/lib/utils';
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isToday,
  startOfWeek,
  parseISO,
  isSameDay,
  getHours,
  getMinutes,
  differenceInMinutes,
} from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
export function WeekView() {
  const currentDate = useCalendarStore((state) => state.currentDate);
  const events = useCalendarStore((state) => state.events);
  const categoryMap = useCalendarStore((state) => state.categoryMap);
  const selectEvent = useCalendarStore((state) => state.selectEvent);
  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate),
  });
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const getEventPosition = (eventStart: Date) => {
    const startHour = getHours(eventStart);
    const startMinute = getMinutes(eventStart);
    return (startHour + startMinute / 60) * 60; // Position in minutes from top
  };
  const getEventDuration = (eventStart: Date, eventEnd: Date) => {
    return differenceInMinutes(eventEnd, eventStart);
  };
  return (
    <div className="flex-grow flex flex-col p-4 md:p-6 overflow-hidden">
      <div className="grid grid-cols-[auto_1fr] gap-x-4">
        <div /> {/* Spacer for time column */}
        <div className="grid grid-cols-7">
          {weekDays.map(day => (
            <div key={day.toString()} className="text-center py-2 border-b">
              <p className="text-sm text-muted-foreground">{format(day, 'EEE')}</p>
              <p className={cn('text-2xl font-bold', isToday(day) && 'text-primary')}>{format(day, 'd')}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">
        <div className="grid grid-cols-[auto_1fr] gap-x-4 h-[1440px]">
          {/* Time column */}
          <div className="grid grid-rows-24">
            {hours.map(hour => (
              <div key={hour} className="h-[60px] text-right pr-2 relative">
                <span className="text-xs text-muted-foreground relative -top-2.5">
                  {format(new Date(0, 0, 0, hour), 'ha')}
                </span>
              </div>
            ))}
          </div>
          {/* Events grid */}
          <div className="grid grid-cols-7 relative">
            {/* Vertical lines */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="absolute top-0 bottom-0 border-l" style={{ left: `${(i + 1) * (100 / 7)}%` }} />
            ))}
            {/* Horizontal lines */}
            {hours.map(hour => (
              <div key={hour} className="col-span-7 h-[60px] border-t" />
            ))}
            {/* Events */}
            {weekDays.map((day, dayIndex) => (
              <div key={day.toString()} className="relative" style={{ gridColumnStart: dayIndex + 1 }}>
                <AnimatePresence>
                  {events
                    .filter(event => isSameDay(parseISO(event.start), day))
                    .map((event, eventIndex) => {
                      const start = parseISO(event.start);
                      const end = parseISO(event.end);
                      const top = getEventPosition(start);
                      const height = getEventDuration(start, end);
                      return (
                        <motion.div
                          key={event.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0, transition: { delay: eventIndex * 0.05 } }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          style={{ top: `${top}px`, height: `${height}px` }}
                          className="absolute left-1 right-1 p-2 rounded-lg bg-secondary hover:bg-accent cursor-pointer transition-all duration-200 ease-in-out hover:shadow-lg z-10"
                          onClick={() => selectEvent(event)}
                        >
                          <div className="flex items-start gap-2 h-full">
                            <div className={cn('w-2 h-2 rounded-full flex-shrink-0 mt-1.5', categoryMap.get(event.calendarId)?.color || 'bg-gray-400')} />
                            <div className="flex flex-col text-sm overflow-hidden">
                              <p className="font-semibold truncate text-secondary-foreground">{event.title}</p>
                              <p className="text-xs text-muted-foreground">{format(start, 'p')}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}