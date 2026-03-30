function clampInt(n, min, max) {
  if (!Number.isFinite(n)) return min;
  const x = Math.trunc(n);
  return Math.min(Math.max(x, min), max);
}

function parsePaginationQuery(
  query,
  { defaultPage = 0, defaultSize = 10, maxSize = 100 } = {},
) {
  const rawPage = Number(query?.page);
  const rawSize = Number(query?.size);
  const page = Number.isFinite(rawPage) ? rawPage : defaultPage;
  const size = Number.isFinite(rawSize) ? rawSize : defaultSize;

  return {
    page: clampInt(page, 0, Number.MAX_SAFE_INTEGER),
    size: clampInt(size, 1, maxSize),
  };
}
function paginateArray(items, { page = 0, size = 10, maxSize = 100 } = {}) {
  const safeSize = clampInt(size, 1, maxSize);
  const safePage = clampInt(page, 0, Number.MAX_SAFE_INTEGER);

  const totalElements = items.length;
  const totalPages = Math.ceil(totalElements / safeSize) || 1;

  const start = safePage * safeSize;
  const end = start + safeSize;
  const content = items.slice(start, end);

  return {
    content,
    totalElements,
    totalPages,
    currentPage: safePage,
    pageSize: safeSize,
  };
}

module.exports = { paginateArray, parsePaginationQuery };
