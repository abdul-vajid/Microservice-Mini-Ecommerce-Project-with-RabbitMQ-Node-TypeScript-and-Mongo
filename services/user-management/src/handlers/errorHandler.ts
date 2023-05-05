import { NextFunction, Request, Response } from "express";
import ErrorResponse from "./ErrorResponse";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  if (err instanceof ErrorResponse) {
    return res.status(err.status).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }
  return res
    .status(500)
    .json({ success: false, status: 500, message: "Something went wrong" });
};

export default errorHandler;
