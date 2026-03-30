const { AppException } = require("./AppException");

class BadRequestException extends AppException {
  constructor(message = "Bad request", { domain = "request", details } = {}) {
    super(message, { status: 400, code: "BAD_REQUEST", domain, details });
  }
}

module.exports = { BadRequestException };

