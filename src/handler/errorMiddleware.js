const { errorOf } = require("../response/errorResponse");
const { BadRequestException } = require("../exception/BadRequestException");
const { AppException } = require("../exception/AppException");

function errorMiddleware(err, req, res, next) {
  if (res.headersSent) return next(err);

  let appErr = err;

  if (!appErr || !appErr.isAppException) {
    if (
      appErr instanceof SyntaxError ||
      appErr?.type === "entity.parse.failed"
    ) {
      appErr = new BadRequestException("Invalid request body format", {
        domain: "request",
      });
    } else if (Number.isInteger(appErr?.status)) {
      appErr = new AppException(appErr?.message || "Error", {
        status: appErr.status,
        code:
          appErr?.code ||
          (appErr.status === 404 ? "NOT_FOUND" : "INTERNAL_SERVER_ERROR"),
        domain: appErr?.domain || (appErr.status >= 500 ? "system" : "request"),
        details: appErr?.details,
      });
    } else {
      appErr = new AppException(
        "An internal error occurred. Please contact support.",
        {
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
          domain: "system",
        },
      );
    }
  }

  const status = Number.isInteger(appErr?.status) ? appErr.status : 500;
  const code =
    appErr?.code || (status === 404 ? "NOT_FOUND" : "INTERNAL_SERVER_ERROR");
  const domain = appErr?.domain || (status >= 500 ? "system" : "request");

  return res
    .status(status)
    .json(errorOf(appErr?.message || "Error", code, domain, appErr?.details));
}

module.exports = { errorMiddleware };
