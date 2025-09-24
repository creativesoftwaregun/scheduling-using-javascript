import { create } from 'zustand';
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay, set as setDate, differenceInMilliseconds } from 'date-fns';
import type { AppEvent, CalendarCategory, CreateEventInput, UpdateEventInput } from '@shared/types';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
type CalendarView = 'month' | 'week' | 'day';
interface CalendarState {
  currentDate: Date;
  view: CalendarView;
  events: AppEvent[];
  categories: CalendarCategory[];
  categoryMap: Map<string, CalendarCategory>;
  isLoading: boolean;
  selectedEvent: AppEvent | null;
  isDialogOpen: boolean;
  // Actions
  setCurrentDate: (date: Date) => void;
  setView: (view: CalendarView) => void;
  nextMonth: () => void;
  prevMonth: () => void;
  goToToday: () => void;
  selectEvent: (event: AppEvent | null) => void;
  openDialog: () => void;
  closeDialog: () => void;
  // Async Actions
  fetchInitialData: () => Promise<void>;
  fetchEvents: (date: Date, view: CalendarView) => Promise<void>;
  createEvent: (eventData: CreateEventInput) => Promise<AppEvent | null>;
  updateEvent: (eventId: string, eventData: UpdateEventInput) => Promise<AppEvent | null>;
  deleteEvent: (eventId: string) => Promise<boolean>;
  moveEvent: (eventId: string, newDate: Date) => Promise<void>;
}
export const useCalendarStore = create<CalendarState>((set, get) => ({
  currentDate: new Date(),
  view: 'month',
  events: [],
  categories: [],
  categoryMap: new Map(),
  isLoading: true,
  selectedEvent: null,
  isDialogOpen: false,
  setCurrentDate: (date) => set({ currentDate: date }),
  setView: (view) => {
    set({ view });
    get().fetchEvents(get().currentDate, view);
  },
  nextMonth: () => {
    const newDate = addMonths(get().currentDate, 1);
    set({ currentDate: newDate });
    get().fetchEvents(newDate, get().view);
  },
  prevMonth: () => {
    const newDate = subMonths(get().currentDate, 1);
    set({ currentDate: newDate });
    get().fetchEvents(newDate, get().view);
  },
  goToToday: () => {
    const today = new Date();
    set({ currentDate: today });
    get().fetchEvents(today, get().view);
  },
  selectEvent: (event) => set({ selectedEvent: event, isDialogOpen: !!event }),
  openDialog: () => set({ isDialogOpen: true, selectedEvent: null }),
  closeDialog: () => set({ isDialogOpen: false, selectedEvent: null }),
  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      const categories = await api<CalendarCategory[]>('/api/categories');
      const categoryMap = new Map(categories.map(c => [c.id, c]));
      set({ categories, categoryMap });
      await get().fetchEvents(get().currentDate, get().view);
    } catch (error) {
      toast.error("Failed to load initial calendar data.");
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchEvents: async (date, view) => {
    set({ isLoading: true });
    try {
      let start, end;
      switch (view) {
        case 'month':
          start = startOfWeek(startOfMonth(date));
          end = endOfWeek(endOfMonth(date));
          break;
        case 'week':
          start = startOfWeek(date);
          end = endOfWeek(date);
          break;
        case 'day':
          start = startOfDay(date);
          end = endOfDay(date);
          break;
      }
      const events = await api<AppEvent[]>(`/api/events?start=${start.toISOString()}&end=${end.toISOString()}`);
      set({ events });
    } catch (error) {
      toast.error("Failed to fetch events.");
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },
  createEvent: async (eventData) => {
    try {
      const newEvent = await api<AppEvent>('/api/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
      });
      set((state) => ({ events: [...state.events, newEvent] }));
      toast.success("Event created successfully!");
      return newEvent;
    } catch (error) {
      toast.error(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  },
  updateEvent: async (eventId, eventData) => {
    try {
      const updatedEvent = await api<AppEvent>(`/api/events/${eventId}`, {
        method: 'PUT',
        body: JSON.stringify(eventData),
      });
      set((state) => ({
        events: state.events.map((e) => (e.id === eventId ? updatedEvent : e)),
      }));
      toast.success("Event updated successfully!");
      return updatedEvent;
    } catch (error) {
      toast.error(`Failed to update event: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  },
  deleteEvent: async (eventId) => {
    try {
      await api(`/api/events/${eventId}`, { method: 'DELETE' });
      set((state) => ({
        events: state.events.filter((e) => e.id !== eventId),
      }));
      toast.success("Event deleted successfully!");
      return true;
    } catch (error) {
      toast.error(`Failed to delete event: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  },
  moveEvent: async (eventId, newDate) => {
    const originalEvents = get().events;
    const eventToMove = originalEvents.find(e => e.id === eventId);
    if (!eventToMove) return;
    const originalStartDate = new Date(eventToMove.start);
    const duration = differenceInMilliseconds(new Date(eventToMove.end), originalStartDate);
    const newStartDate = setDate(newDate, {
      hours: originalStartDate.getHours(),
      minutes: originalStartDate.getMinutes(),
      seconds: originalStartDate.getSeconds(),
    });
    const newEndDate = new Date(newStartDate.getTime() + duration);
    const updatedEvent: AppEvent = {
      ...eventToMove,
      start: newStartDate.toISOString(),
      end: newEndDate.toISOString(),
    };
    // Optimistic update
    set({ events: originalEvents.map(e => e.id === eventId ? updatedEvent : e) });
    try {
      await get().updateEvent(eventId, {
        title: updatedEvent.title,
        description: updatedEvent.description,
        start: updatedEvent.start,
        end: updatedEvent.end,
        calendarId: updatedEvent.calendarId,
      });
    } catch (error) {
      // Revert on failure
      set({ events: originalEvents });
      toast.error("Failed to move event.");
    }
  },
}));