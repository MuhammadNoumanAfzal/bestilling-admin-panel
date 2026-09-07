// Some legacy endpoints filter summaries but leave their item pages unfiltered.
// Collect each page before applying UI filters so matches cannot be lost between pages.
export async function loadCompleteList(request, filters) {
  const summaryResponse = await request(filters);
  const base = { ...filters, search: null, status: null, paymentStatus: null,
    vendorId: null, city: null, minRating: null, dateFrom: null, dateTo: null,
    joinedFrom: null, joinedTo: null, page: 1, pageSize: 100, limit: 100 };
  const rows = [];
  const seen = new Set();
  let firstResponse;
  for (let page = 1; page <= 100; page += 1) {
    const response = await request({ ...base, page });
    firstResponse ||= response;
    let added = 0;
    for (const row of response.rows) {
      if (!seen.has(String(row.id))) {
        seen.add(String(row.id));
        rows.push(row);
        added += 1;
      }
    }
    const total = response.pageInfo.totalItems;
    if (rows.length >= total && !response.pageInfo.hasNextPage) {
      return { ...summaryResponse, rows, filterOptions: firstResponse.filterOptions };
    }
    if (!added) throw new Error("The server returned incomplete pagination. Please retry loading the list.");
  }
  throw new Error("The list is too large to filter reliably with this API. Please contact support.");
}

export function paginateFilteredRows(rows, page, pageSize) {
  const totalItems = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  return {
    rows: rows.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    pageInfo: { page: currentPage, pageSize, totalItems, totalPages,
      hasNextPage: currentPage < totalPages, hasPreviousPage: currentPage > 1 },
  };
}
