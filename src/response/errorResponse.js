function formatTimeVn(now = new Date()) {
  return now.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

function errorOf(message, code, domain, details) {
  let resolvedDomain = domain;
  let resolvedDetails = details;

  if (domain && typeof domain === "object" && resolvedDetails === undefined) {
    resolvedDetails = domain;
    resolvedDomain = undefined;
  }

  const resp = {
    operationType: "Failure",
    message,
    code,
  };

  if (resolvedDomain !== undefined) resp.domain = resolvedDomain;
  if (resolvedDetails !== undefined) resp.details = resolvedDetails;
  resp["thời gian"] = formatTimeVn();

  return resp;
}

module.exports = { errorOf };
