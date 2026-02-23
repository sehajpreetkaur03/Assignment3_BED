import { HTTP_STATUS } from "../../../constants/httpConstants";
import { CreateEventBody, Event, UpdateEventBody } from "../models/eventModel";
import * as repo from "../repositories/firestoreRepository";

const COLLECTION = "events";

export class NotFoundError extends Error {
  statusCode = HTTP_STATUS.NOT_FOUND;
  constructor(message: string) {
    super(message);
  }
}

// CREATE
export const createEvent = async (body: CreateEventBody): Promise<Event> => {
  const event = {
    ...body,
  };

  const id = await repo.createDocument<Event>(COLLECTION, event);

  return { id, ...event } as Event;
};

// GET ALL
export const getAllEvents = async (): Promise<Event[]> => {
  return await repo.getAllDocuments<Event>(COLLECTION);
};

// GET BY ID
export const getEventById = async (id: string): Promise<Event> => {
  const event = await repo.getDocById<Event>(COLLECTION, id);
  if (!event) throw new NotFoundError("Event not found");
  return event;
};

// UPDATE
export const updateEvent = async (
  id: string,
  body: UpdateEventBody
): Promise<Event> => {
  const existing = await repo.getDocById<Event>(COLLECTION, id);
  if (!existing) throw new NotFoundError("Event not found");

  await repo.updateDocument<Event>(COLLECTION, id, body);

  const updated = await repo.getDocById<Event>(COLLECTION, id);
  return updated as Event;
};

// DELETE
export const deleteEvent = async (id: string): Promise<void> => {
  const existing = await repo.getDocById<Event>(COLLECTION, id);
  if (!existing) throw new NotFoundError("Event not found");

  await repo.deleteDocument(COLLECTION, id);
};