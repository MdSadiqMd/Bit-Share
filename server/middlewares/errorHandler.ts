import { Request, Response, NextFunction } from "../imports";

const errorHandler = (
  statusCode: number,
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }
  console.log("Error Middleware");
  res.status(statusCode || 500).json({
    message: err.message || "Internal Server Error",
    ok: false,
    data: null,
  });
};

export default errorHandler;
