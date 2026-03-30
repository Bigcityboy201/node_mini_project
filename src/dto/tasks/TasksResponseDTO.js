const {
  toResponseDTO,
  toResponseDTOList,
} = require("../../mapper/task/TaskMapper");

module.exports = {
  toTaskResponse: toResponseDTO,
  toTaskResponseList: toResponseDTOList,
};
