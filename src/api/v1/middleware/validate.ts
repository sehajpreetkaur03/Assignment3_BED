import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { MiddlewareFunction } from "../types/expressTypes";
import { HTTP_STATUS } from "../../../constants/httpConstants";

interface RequestSchemas {
  body?: ObjectSchema;
  params?: ObjectSchema;
  query?: ObjectSchema;
}

export const validateRequest = (schemas: RequestSchemas): MiddlewareFunction => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors: string[] = [];

      const validatePart = (
        schema: ObjectSchema,
        data: any,
        partName: "Body" | "Params" | "Query"
      ) => {
        const { error, value } = schema.validate(data, {
          abortEarly: false,
          stripUnknown: true,
        });

        if (error) {
          errors.push(
            ...error.details.map((d) => `${partName}: ${d.message}`)
          );
          return data;
        }

        return value;
      };

      if (schemas.body) req.body = validatePart(schemas.body, req.body, "Body");
      if (schemas.params)
        req.params = validatePart(schemas.params, req.params, "Params");
      if (schemas.query)
        req.query = validatePart(schemas.query, req.query, "Query");

      if (errors.length > 0) {
        // IMPORTANT: update this string formatting if the video shows different output
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: `Validation error: ${errors.join(", ")}`,
        });
      }

      next();
    } catch (err) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: (err as Error).message,
      });
    }
  };
};