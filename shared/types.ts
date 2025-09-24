import { z } from 'zod';
export type ApiResponse<T = unknown> = { success: true; data: T } | { success: false; error: string };
// DEMO TYPES - Replace with your own
export type User = { id: string; name: string };
export type Chat = { id: string; title: string };
export type ChatMessage = { id: string; chatId: string; userId: string; text: string; ts: number };
// CHRONO APP TYPES
export type CalendarCategory = {
  id: string;
  name: string;
  color: string; // e.g., 'bg-blue-500'
};
export type AppEvent = {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO 8601 string format for API transfer
  end: string;   // ISO 8601 string format for API transfer
  calendarId: string; // Foreign key to CalendarCategory
};
const baseEventSchema = {
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().optional(),
  start: z.string().datetime({ message: "Invalid start date format." }),
  end: z.string().datetime({ message: "Invalid end date format." }),
  calendarId: z.string().min(1, { message: "Please select a calendar." }),
};
export const CreateEventSchema = z.object(baseEventSchema).refine(data => new Date(data.start) < new Date(data.end), {
  message: "End date must be after the start date.",
  path: ["end"],
});
export type CreateEventInput = z.infer<typeof CreateEventSchema>;
export const UpdateEventSchema = z.object(baseEventSchema).refine(data => new Date(data.start) < new Date(data.end), {
    message: "End date must be after the start date.",
    path: ["end"],
});
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;