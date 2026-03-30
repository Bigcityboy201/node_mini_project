class AppException extends Error {
  constructor(message, { status = 500, code = "INTERNAL_SERVER_ERROR", domain = "system", details } = {}) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;
    this.domain = domain;
    this.details = details;
    this.isAppException = true;
  }
}

module.exports = { AppException };

