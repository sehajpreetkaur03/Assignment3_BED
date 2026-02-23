import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { successResponse } from "../models/responseModel";
import * as service from "../services/eventService";

// ✅ Tell TypeScript that params includes { id: string }
type EventIdParams = { id: string };

// CREATE EVENT
export const createEventHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await service.createEvent(req.body);
    res
      .status(HTTP_STATUS.CREATED)
      .json(successResponse(event, "Event created successfully"));
  } catch (error) {
    next(error);
  }
};

// GET ALL EVENTS
export const getAllEventsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const events = await service.getAllEvents();
    res
      .status(HTTP_STATUS.OK)
      .json(successResponse(events, "Events fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// GET EVENT BY ID
export const getEventByIdHandler = async (
  req: Request<EventIdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await service.getEventById(req.params.id);
    res
      .status(HTTP_STATUS.OK)
      .json(successResponse(event, "Event fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// UPDATE EVENT
export const updateEventHandler = async (
  req: Request<EventIdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await service.updateEvent(req.params.id, req.body);
    res
      .status(HTTP_STATUS.OK)
      .json(successResponse(event, "Event updated successfully"));
  } catch (error) {
    next(error);
  }
};

// DELETE EVENT
export const deleteEventHandler = async (
  req: Request<EventIdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    await service.deleteEvent(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};