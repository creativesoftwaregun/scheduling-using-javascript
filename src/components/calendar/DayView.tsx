import { useCalendarStore } from '@/store/calendarStore';
import { cn } from '@/lib/utils';
import { format, parseISO, isSameDay, getHours, getMinutes, differenceInMinutes } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
export function DayView() {
  const currentDate = useCalendarStore((state) => state.currentDate);
  const events = useCalendarStore((state) => state.events);
  const categoryMap = useCalendarStore((state) => state.categoryMap);
  const selectEvent = useCalendarStore((state) => state.selectEvent);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayEvents = events
    .filter(event => isSameDay(parseISO(event.start), currentDate))
    .sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime());
  const getEventPosition = (eventStart: Date) => {
    const startHour = getHours(eventStart);
    const startMinute = getMinutes(eventStart);
    return (startHour + startMinute / 60) * 60; // Position in minutes from top
  };
  const getEventDuration = (eventStart: Date, eventEnd: Date) => {
    return differenceInMinutes(eventEnd, eventStart);
  };
  return (
    <div className="flex-grow flex flex-col p-4 md:p-6 overflow-y-auto">
      <div className="text-center font-bold text-2xl mb-4 font-display">
        {format(currentDate, 'EEEE, MMMM d, yyyy')}
      </div>
      <div className="flex-grow relative grid grid-cols-[auto_1fr] gap-x-4">
        {/* Time column */}
        <div className="grid grid-rows-24 h-[1440px]">
          {hours.map(hour => (
            <div key={hour} className="h-[60px] text-right pr-2 relative">
              <span className="text-xs text-muted-foreground relative -top-2.5">
                {format(new Date(0, 0, 0, hour), 'ha')}
              </span>
            </div>
          ))}
        </div>
        {/* Events grid */}
        <div className="relative h-[1440px]">
          {/* Horizontal lines */}
          {hours.map(hour => (
            <div key={hour} className="h-[60px] border-t border-border" />
          ))}
          {/* Events */}
          <div className="absolute top-0 left-0 right-0 h-full">
            <AnimatePresence>
              {dayEvents.map((event, index) => {
                const start = parseISO(event.start);
                const end = parseISO(event.end);
                const top = getEventPosition(start);
                const height = getEventDuration(start, end);
                return (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    style={{ top: `${top}px`, height: `${height}px` }}
                    className="absolute left-0 right-4 p-2 rounded-lg bg-secondary hover:bg-accent cursor-pointer transition-all duration-200 ease-in-out hover:shadow-lg z-10"
                    onClick={() => selectEvent(event)}
                  >
                    <div className="flex items-start gap-2 h-full">
                      <div className={cn('w-2 h-2 rounded-full flex-shrink-0 mt-1.5', categoryMap.get(event.calendarId)?.color || 'bg-gray-400')} />
                      <div className="flex flex-col text-sm overflow-hidden">
                        <p className="font-semibold truncate text-secondary-foreground">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(start, 'p')} - {format(end, 'p')}
                        </p>
                        {event.description && <p className="text-xs text-muted-foreground truncate mt-1">{event.description}</p>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}