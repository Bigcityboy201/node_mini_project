const { AppException } = require("./AppException");

class ConflictException extends AppException {
  constructor(message = "Conflict", { domain = "task", details } = {}) {
    super(message, { status: 409, code: "CONFLICT", domain, details });
  }
}

module.exports = { ConflictException };

