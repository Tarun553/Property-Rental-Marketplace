import { NextFunction, Request, Response } from "express";

interface ErrorWithStatus extends Error {
  status?: number;
  statusCode?: number;
}

export const errorHandler = (
  err: ErrorWithStatus,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  const status =
    typeof err.statusCode === "number"
      ? err.statusCode
      : typeof err.status === "number"
        ? err.status
        : 500;

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({ message: status >= 500 ? "Server error" : err.message });
};
