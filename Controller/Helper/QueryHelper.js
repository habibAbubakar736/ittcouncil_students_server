const pool = require("../../Config/db_pool");

exports.PaginationQuery = async (query_count, query, cond, limit, page) => {
  limit = (limit === "" || !limit) ? 20 : Number(limit);
  page = (page === "" || !page) ? 1 : Number(page);

  let total_records = 0;
  let total_pages = 0;
  let next = true;
  let prev = true;
  const start = (page - 1) * limit;

  try {
    const [[totalCount]] = await pool.query(query_count, cond);
    total_records = totalCount.total_records;
    total_pages = Math.ceil(total_records / limit);
    cond.push(start);
    cond.push(limit);
    const [dataRows] = await pool.query(query, cond);
    next = page < total_pages;
    prev = page > 1;

    return {
      success: true,
      total_records,
      total_pages,
      page,
      next,
      prev,
      data: dataRows,
    };
  } catch (error) {
    throw new Error(`Pagination query failed: ${error.message}`);
  }
};


exports.MongoosePaginationQuery = async (model, query = {}, options = {}) => {
  let { page, limit, sort = { createdAt: -1 } } = options;
  page = parseInt(page);
  limit = parseInt(limit);

  const total_records = await model.countDocuments(query);
  const total_pages = Math.ceil(total_records / limit);

  const data = await model
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sort);

  return {
    success: true,
    total_records,
    total_pages,
    page,
    next: page < total_pages,
    prev: page > 1,
    data
  };
};
