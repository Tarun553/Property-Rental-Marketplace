import { RequestHandler } from "express";

export type AsyncHandler = (
  ...args: Parameters<RequestHandler>
) => Promise<any>;

export const asyncHandler = (handler: AsyncHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};
