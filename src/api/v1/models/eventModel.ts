export type EventStatus = "active" | "cancelled";
export type EventCategory = "general" | "workshop" | "networking";

export interface Event {
  id: string;
  name: string;
  date: string; // ISO string
  capacity: number;
  registrationCount: number;
  status: EventStatus;
  category: EventCategory;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type CreateEventBody = {
  name: string;
  date: string;
  capacity: number;
  status?: EventStatus;
  category?: EventCategory;
};

export type UpdateEventBody = Partial<CreateEventBody>;