export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(message: string, code?: string): AppError {
    return new AppError(400, message, code || "BAD_REQUEST");
  }

  static unauthorized(message: string, code?: string): AppError {
    return new AppError(401, message, code || "UNAUTHORIZED");
  }

  static forbidden(message: string, code?: string): AppError {
    return new AppError(403, message, code || "FORBIDDEN");
  }

  static notFound(message: string, code?: string): AppError {
    return new AppError(404, message, code || "NOT_FOUND");
  }

  static conflict(message: string, code?: string): AppError {
    return new AppError(409, message, code || "CONFLICT");
  }

  static unprocessableEntity(message: string, code?: string): AppError {
    return new AppError(422, message, code || "UNPROCESSABLE_ENTITY");
  }

  static internal(message: string, code?: string): AppError {
    return new AppError(500, message, code || "INTERNAL_SERVER_ERROR");
  }
}
