function toResponseDTO(task) {
  return {
    id: task.id,
    title: task.title,
    completed: task.completed,
  };
}

function toResponseDTOList(tasks) {
  return tasks.map(toResponseDTO);
}

module.exports = { toResponseDTO, toResponseDTOList };
