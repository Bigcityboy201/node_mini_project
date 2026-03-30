const { toResponseDTO, toResponseDTOList } = require("../../mapper/task/TaskMapper");
const { successOf, successOfPaged } = require("../../response/successResponse");

class TasksController {
  constructor(taskService) {
    this._svc = taskService;
  }

  create = (req, res, next) => {
    const created = this._svc.create(req.body);
    return res.status(201).json(successOf(toResponseDTO(created)));
  };

  list = (req, res, next) => {
    const paged = this._svc.listPaged(req.query);
    const pagedDto = { ...paged, content: toResponseDTOList(paged.content) };
    return res.json(successOfPaged(pagedDto));
  };

  getById = (req, res, next) => {
    const task = this._svc.getById(req.params.id);
    return res.json(successOf(toResponseDTO(task)));
  };

  update = (req, res, next) => {
    const updated = this._svc.update(req.params.id, req.body);
    return res.json(successOf(toResponseDTO(updated)));
  };

  delete = (req, res, next) => {
    const deleted = this._svc.delete(req.params.id);
    return res.json(successOf(toResponseDTO(deleted)));
  };
}

module.exports = { TasksController };

