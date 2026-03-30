const { BadRequestException } = require("../../exception/BadRequestException");

function parseCreateTask(body) {
  const title = body?.title;
  if (typeof title !== "string" || title.trim().length === 0) {
    throw new BadRequestException("title is required", { domain: "request" });
  }
  return { title: title.trim() };
}

function parseUpdateTask(body) {
  const out = {};
  if (body?.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim().length === 0) {
      throw new BadRequestException("title must be a non-empty string", { domain: "request" });
    }
    out.title = body.title.trim();
  }
  if (body?.completed !== undefined) {
    if (typeof body.completed !== "boolean") {
      throw new BadRequestException("completed must be boolean", { domain: "request" });
    }
    out.completed = body.completed;
  }
  if (Object.keys(out).length === 0) {
    throw new BadRequestException("No updatable fields", { domain: "request" });
  }
  return out;
}

module.exports = { parseCreateTask, parseUpdateTask };

