export const getPaginatedResults = (page, limit, products) => {
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 6;
  const totalCount = products.length;
  const totalPages = Math.ceil(totalCount / limitNumber);
  const startIndex = (pageNumber - 1) * limitNumber;
  const endIndex = pageNumber * limitNumber;
  const paginatedProducts = products.slice(startIndex, endIndex);
  return {
    totalPages,
    paginatedProducts,
    pageNumber,
    endIndex,
  };
}