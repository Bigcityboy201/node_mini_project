const { AppException } = require("./AppException");

class NotFoundException extends AppException {
  constructor(message = "Not found", { domain = "task", details } = {}) {
    super(message, { status: 404, code: "NOT_FOUND", domain, details });
  }
}

module.exports = { NotFoundException };

