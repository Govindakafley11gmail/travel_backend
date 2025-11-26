"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosError = exports.ServiceUnavailable = exports.InternalServerError = exports.ForbiddenError = exports.ValidationError = exports.UnauthorizedError = exports.BadRequestError = exports.NotFoundError = exports.DataBaseError = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
class DataBaseError extends AppError {
    constructor(message) {
        super(message, 500);
    }
}
exports.DataBaseError = DataBaseError;
class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends AppError {
    constructor(message) {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}
exports.ValidationError = ValidationError;
class ForbiddenError extends AppError {
    constructor(message) {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
class InternalServerError extends AppError {
    constructor(message) {
        super(message, 500);
    }
}
exports.InternalServerError = InternalServerError;
class ServiceUnavailable extends AppError {
    constructor(message) {
        super(message, 503);
    }
}
exports.ServiceUnavailable = ServiceUnavailable;
class AxiosError extends AppError {
    constructor(message) {
        super(message, 500);
    }
}
exports.AxiosError = AxiosError;
//# sourceMappingURL=error.js.map