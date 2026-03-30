function getSize(data) {
  if (Array.isArray(data)) return data.length;
  return 0;
}

function successOf(data) {
  return {
    operationType: "Success",
    message: "success",
    code: "OK",
    data,
    size: getSize(data),
    "thời gian": new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
  };
}

function successOfPaged(paged) {
  return {
    operationType: "Success",
    message: "success",
    code: "OK",
    data: paged.content,
    size: Array.isArray(paged.content) ? paged.content.length : 0,
    totalElements: paged.totalElements,
    totalPages: paged.totalPages,
    page: paged.currentPage,
    pageSize: paged.pageSize,
    "thời gian": new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
  };
}

module.exports = { successOf, successOfPaged };

