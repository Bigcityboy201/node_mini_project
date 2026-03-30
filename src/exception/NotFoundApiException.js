const { AppException } = require("./AppException");

class NotFoundApiException extends AppException {
  constructor(message = "API not found", { domain = "route", details } = {}) {
    super(message, { status: 404, code: "NOT_FOUND", domain, details });
  }
}

module.exports = { NotFoundApiException };

