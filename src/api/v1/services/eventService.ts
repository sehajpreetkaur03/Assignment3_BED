import { HTTP_STATUS } from "../../../constants/httpConstants";
import { CreateEventBody, Event, UpdateEventBody } from "../models/eventModel";
import * as repo from "../repositories/firestoreRepository";

const COLLECTION = "events";

// Firestore store Dates or Timestamps
const toIso = (value: any): string => {
  if (!value) return new Date().toISOString();
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  return new Date().toISOString();
};

// Generate evt_000001 style ID 
const nextEventId = async (): Promise<string> => {
  const existing = await repo.getAllDocuments<Event>(COLLECTION);
  const next = existing.length + 1;
  return `evt_${String(next).padStart(6, "0")}`;
};


export class NotFoundError extends Error {
  statusCode = HTTP_STATUS.NOT_FOUND;
  constructor(message: string) {
    super(message);
  }
}

// CREATE
export const createEvent = async (body: CreateEventBody): Promise<Event> => {
  const nowIso = new Date().toISOString();
  const id = await nextEventId();

  const event: Omit<Event, "id"> = {
    name: body.name,
    date: body.date,
    capacity: body.capacity,
    registrationCount: 0,
    status: body.status ?? "active",
    category: body.category ?? "general",
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  await repo.createDocument<Event>(COLLECTION, event, id);

  return { id, ...event };

  };

// GET ALL
export const getAllEvents = async (): Promise<Event[]> => {
const events = await repo.getAllDocuments<Event>(COLLECTION);
  // Normalize timestamps if any:
  return events.map((e) => ({
    ...e,
    createdAt: toIso((e as any).createdAt),
    updatedAt: toIso((e as any).updatedAt),
  }));
};

// GET BY ID
export const getEventById = async (id: string): Promise<Event> => {
  const event = await repo.getDocById<Event>(COLLECTION, id);
  if (!event) throw new NotFoundError("Event not found");
  return {
    ...event,
    createdAt: toIso((event as any).createdAt),
    updatedAt: toIso((event as any).updatedAt),
  };
};

// UPDATE
export const updateEvent = async (
  id: string,
  body: UpdateEventBody
): Promise<Event> => {
  const existing = await repo.getDocById<Event>(COLLECTION, id);
  if (!existing) throw new NotFoundError("Event not found");

    const updated: Partial<Event> = {
    ...body,
    updatedAt: new Date().toISOString(),
  };

   await repo.updateDocument<Event>(COLLECTION, id, updated);

  const after = await repo.getDocById<Event>(COLLECTION, id);
  if (!after) throw new NotFoundError("Event not found");

  return {
    ...after,
    createdAt: toIso((after as any).createdAt),
    updatedAt: toIso((after as any).updatedAt),
  };
};


// DELETE
export const deleteEvent = async (id: string): Promise<void> => {
  const existing = await repo.getDocById<Event>(COLLECTION, id);
  if (!existing) throw new NotFoundError("Event not found");

  await repo.deleteDocument(COLLECTION, id);
};