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
    const validatePart = (schema: ObjectSchema, data: any) => {
      return schema.validate(data, {
        abortEarly: true, 
        stripUnknown: true,
      });
    };

    // BODY
    if (schemas.body) {
      const { error, value } = validatePart(schemas.body, req.body);
      if (error) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: `Validation error: ${error.details[0].message}`,
        });
      }
      req.body = value;
    }

    // PARAMS
    if (schemas.params) {
      const { error, value } = validatePart(schemas.params, req.params);
      if (error) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: `Validation error: ${error.details[0].message}`,
        });
      }
      req.params = value;
    }

    // QUERY
    if (schemas.query) {
      const { error, value } = validatePart(schemas.query, req.query);
      if (error) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: `Validation error: ${error.details[0].message}`,
        });
      }
      req.query = value;
    }

    next();
  };
};