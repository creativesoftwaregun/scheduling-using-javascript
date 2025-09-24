/**
 * Minimal real-world demo: One Durable Object instance per entity (User, ChatBoard), with Indexes for listing.
 */
import { IndexedEntity } from "./core-utils";
import type { User, Chat, ChatMessage, AppEvent, CalendarCategory } from "@shared/types";
import { MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS } from "@shared/mock-data";
// USER ENTITY: one DO instance per user
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}
// CHAT BOARD ENTITY: one DO instance per chat board, stores its own messages
export type ChatBoardState = Chat & { messages: ChatMessage[] };
const SEED_CHAT_BOARDS: ChatBoardState[] = MOCK_CHATS.map(c => ({
  ...c,
  messages: MOCK_CHAT_MESSAGES.filter(m => m.chatId === c.id),
}));
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  static seedData = SEED_CHAT_BOARDS;
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}
// CALENDAR CATEGORY ENTITY for Chrono App
const SEED_CATEGORIES: CalendarCategory[] = [
    { id: 'work', name: 'Work', color: 'bg-blue-500' },
    { id: 'personal', name: 'Personal', color: 'bg-green-500' },
    { id: 'project', name: 'Project', color: 'bg-purple-500' },
    { id: 'urgent', name: 'Urgent', color: 'bg-red-500' },
];
export class CalendarCategoryEntity extends IndexedEntity<CalendarCategory> {
    static readonly entityName = "calendarCategory";
    static readonly indexName = "calendarCategories";
    static readonly initialState: CalendarCategory = { id: "", name: "", color: "" };
    static seedData = SEED_CATEGORIES;
}
// EVENT ENTITY for Chrono App
export class EventEntity extends IndexedEntity<AppEvent> {
    static readonly entityName = "event";
    static readonly indexName = "events";
    static readonly initialState: AppEvent = {
        id: "",
        title: "",
        start: new Date().toISOString(),
        end: new Date().toISOString(),
        calendarId: "",
    };
}