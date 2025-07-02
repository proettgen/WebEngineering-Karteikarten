import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "../utils/AppError";

export const validateBody =
  <T>(schema: ZodSchema<T>): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        const errorMessage = e.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");

        next(new AppError(`Validation failed: ${errorMessage}`, 400));
        return;
      }
      next(new AppError("Validation error occurred", 400));
    }
  };
