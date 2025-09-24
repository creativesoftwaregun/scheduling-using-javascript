import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, EventEntity, CalendarCategoryEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { CreateEventSchema, UpdateEventSchema } from "@shared/types";
import { ZodError } from "zod";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // DEMO ROUTES
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const page = await UserEntity.list(c.env, c.req.query('cursor') ?? null, c.req.query('limit') ? Number(c.req.query('limit')) : undefined);
    return ok(c, page);
  });
  app.post('/api/users', async (c) => {
    const { name } = (await c.req.json()) as { name?: string };
    if (!name?.trim()) return bad(c, 'name required');
    return ok(c, await UserEntity.create(c.env, { id: crypto.randomUUID(), name: name.trim() }));
  });
  app.get('/api/chats', async (c) => {
    await ChatBoardEntity.ensureSeed(c.env);
    const page = await ChatBoardEntity.list(c.env, c.req.query('cursor') ?? null, c.req.query('limit') ? Number(c.req.query('limit')) : undefined);
    return ok(c, page);
  });
  app.post('/api/chats', async (c) => {
    const { title } = (await c.req.json()) as { title?: string };
    if (!title?.trim()) return bad(c, 'title required');
    const created = await ChatBoardEntity.create(c.env, { id: crypto.randomUUID(), title: title.trim(), messages: [] });
    return ok(c, { id: created.id, title: created.title });
  });
  app.get('/api/chats/:chatId/messages', async (c) => {
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.listMessages());
  });
  app.post('/api/chats/:chatId/messages', async (c) => {
    const chatId = c.req.param('chatId');
    const { userId, text } = (await c.req.json()) as { userId?: string; text?: string };
    if (!isStr(userId) || !text?.trim()) return bad(c, 'userId and text required');
    const chat = new ChatBoardEntity(c.env, chatId);
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.sendMessage(userId, text.trim()));
  });
  // CHRONO ROUTES
  app.get('/api/categories', async (c) => {
    await CalendarCategoryEntity.ensureSeed(c.env);
    const { items } = await CalendarCategoryEntity.list(c.env);
    return ok(c, items);
  });
  app.get('/api/events', async (c) => {
    const { start, end } = c.req.query();
    const { items } = await EventEntity.list(c.env);
    if (start && end) {
      try {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const filteredItems = items.filter(event => {
          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);
          return eventStart < endDate && eventEnd > startDate;
        });
        return ok(c, filteredItems);
      } catch (e) {
        return bad(c, "Invalid date format for start or end query parameters.");
      }
    }
    return ok(c, items);
  });
  app.post('/api/events', async (c) => {
    try {
      const body = await c.req.json();
      const validatedData = CreateEventSchema.parse(body);
      const newEventData = {
        id: crypto.randomUUID(),
        ...validatedData,
      };
      const createdEvent = await EventEntity.create(c.env, newEventData);
      return ok(c, createdEvent);
    } catch (error) {
      if (error instanceof ZodError) {
        return bad(c, error.flatten().formErrors.join(', '));
      }
      return bad(c, 'Invalid event data.');
    }
  });
  app.put('/api/events/:id', async (c) => {
    const { id } = c.req.param();
    const eventEntity = new EventEntity(c.env, id);
    if (!await eventEntity.exists()) {
      return notFound(c, 'Event not found');
    }
    try {
      const body = await c.req.json();
      const validatedData = UpdateEventSchema.parse(body);
      const updatedData = { id, ...validatedData };
      await eventEntity.save(updatedData);
      return ok(c, updatedData);
    } catch (error) {
      if (error instanceof ZodError) {
        return bad(c, error.flatten().formErrors.join(', '));
      }
      return bad(c, 'Invalid event data.');
    }
  });
  app.delete('/api/events/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await EventEntity.delete(c.env, id);
    if (!deleted) {
      return notFound(c, 'Event not found');
    }
    return ok(c, { message: `Event ${id} deleted successfully` });
  });
}