// @flow
import { HttpClient } from "~/internal/http/client";

/**
 * ErrorUnauthorized is a custom error type for performing unauthorized operations.
 */
export class UnauthorizedError extends Error {
  constructor(message = "authorization required") {
    super(message);
  }
}

/**
 * BadRequestError is a custom error type for performing bad request.
 */
export class BadRequestError extends Error {
  constructor(message = "bad request") {
    super(message);
  }
}

/**
 * InternalError is a custom error type for internal server error.
 */
export class InternalError extends Error {
  constructor(message = "internal server error") {
    super(message);
  }
}

/**
 * APIClient is base client that holds http client and error handler.
 */
export class APIClient {
  http: HttpClient = new HttpClient();

  async handleError(response: Response): Promise<void> {
    const body = await response.json();

    switch (response.status) {
      case 401:
        throw new UnauthorizedError(body.error);
      case 400:
        throw new BadRequestError(body.error);
      case 500:
      default:
        throw new InternalError(body.error);
    }
  }
}
