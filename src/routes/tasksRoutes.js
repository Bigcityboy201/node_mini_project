const express = require("express");

function tasksRouter(controller) {
  const router = express.Router();

  router.post("/", controller.create);
  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  router.put("/:id", controller.update);
  router.delete("/:id", controller.delete);

  return router;
}

module.exports = { tasksRouter };

