import { useCalendarStore } from '@/store/calendarStore';
import { cn } from '@/lib/utils';
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { DndContext, useDraggable, useDroppable, type DragEndEvent } from '@dnd-kit/core';
import type { AppEvent } from '@shared/types';
export function MonthView() {
  const currentDate = useCalendarStore((state) => state.currentDate);
  const events = useCalendarStore((state) => state.events);
  const categoryMap = useCalendarStore((state) => state.categoryMap);
  const selectEvent = useCalendarStore((state) => state.selectEvent);
  const moveEvent = useCalendarStore((state) => state.moveEvent);
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth),
    end: endOfWeek(lastDayOfMonth),
  });
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const getEventsForDay = (day: Date) => {
    return events
      .filter(event => isSameDay(parseISO(event.start), day))
      .sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime());
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const eventId = active.id as string;
      const newDate = over.id as string;
      moveEvent(eventId, new Date(newDate));
    }
  };
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex-grow flex flex-col p-4 md:p-6">
        <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-muted-foreground pb-2 border-b">
          {daysOfWeek.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 grid-rows-5 flex-grow gap-px bg-border -ml-px -mt-px">
          {daysInMonth.map((day) => (
            <DayCell key={day.toString()} day={day} currentDate={currentDate}>
              <AnimatePresence>
                {getEventsForDay(day).map((event, eventIndex) => (
                  <EventItem key={event.id} event={event} eventIndex={eventIndex} onSelect={selectEvent} categoryColor={categoryMap.get(event.calendarId)?.color} />
                ))}
              </AnimatePresence>
            </DayCell>
          ))}
        </div>
      </div>
    </DndContext>
  );
}
function DayCell({ day, currentDate, children }: { day: Date; currentDate: Date; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: day.toISOString() });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        'bg-background p-2 flex flex-col border-t border-l border-border transition-colors duration-200 relative',
        !isSameMonth(day, currentDate) && 'bg-muted/50',
        isOver && 'bg-primary/10'
      )}
    >
      <time
        dateTime={format(day, 'yyyy-MM-dd')}
        className={cn(
          'h-8 w-8 flex items-center justify-center rounded-full text-sm font-medium mb-1',
          isToday(day) && 'bg-primary text-primary-foreground',
          !isToday(day) && isSameMonth(day, currentDate) && 'text-foreground',
          !isToday(day) && !isSameMonth(day, currentDate) && 'text-muted-foreground'
        )}
      >
        {format(day, 'd')}
      </time>
      <div className="mt-1 space-y-1 flex-grow overflow-y-auto">{children}</div>
    </div>
  );
}
function EventItem({ event, eventIndex, onSelect, categoryColor }: { event: AppEvent; eventIndex: number; onSelect: (e: AppEvent) => void; categoryColor?: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: event.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, transition: { delay: eventIndex * 0.05 } }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={() => onSelect(event)}
      className={cn(
        "p-1.5 rounded-md text-xs font-medium bg-secondary hover:bg-accent cursor-pointer transition-all duration-200 ease-in-out hover:shadow-md",
        isDragging && "shadow-xl z-10 opacity-80 ring-2 ring-primary scale-105 rotate-3"
      )}
    >
      <div className="flex items-center gap-1.5">
        <div className={cn('w-2 h-2 rounded-full flex-shrink-0', categoryColor || 'bg-gray-400')} />
        <span className="truncate text-secondary-foreground">{event.title}</span>
      </div>
    </motion.div>
  );
}