import { Router } from "express";
import * as controller from "../controllers/eventController";
import { validateRequest } from "../middleware/validate";
import { eventSchemas } from "../validation/eventSchemas";

const router = Router();

router.post(
  "/events",
  validateRequest(eventSchemas.create),
  controller.createEventHandler
);

router.get("/events", controller.getAllEventsHandler);

router.get(
  "/events/:id",
  validateRequest(eventSchemas.idParam),
  controller.getEventByIdHandler
);

router.put(
  "/events/:id",
  validateRequest({ params: eventSchemas.update.params, body: eventSchemas.update.body }),
  controller.updateEventHandler
);

router.delete(
  "/events/:id",
  validateRequest(eventSchemas.idParam),
  controller.deleteEventHandler
);

export default router;