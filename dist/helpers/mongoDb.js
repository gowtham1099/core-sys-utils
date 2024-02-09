"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginatedItems = exports.getPaginationQuery = exports.mongoTimestamp = exports.getCaseSensitive = void 0;
const getCaseSensitive = (data) => {
    return { $regex: new RegExp(`^${data?.trim()}$`), $options: "i" };
};
exports.getCaseSensitive = getCaseSensitive;
const mongoTimestamp = () => {
    return { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } };
};
exports.mongoTimestamp = mongoTimestamp;
const getPaginationQuery = (data, searchFields) => {
    try {
        const query = { limit: data?.limit, page: data?.page };
        let limit = 10;
        let page = 1;
        if (query.limit && query.limit !== 0)
            limit = query.limit;
        if (query.page && query.page !== 0)
            page = query.page;
        delete query.limit;
        delete query.page;
        const searchQuery = [];
        searchFields.forEach((value) => {
            const searchData = {};
            if (data[value]) {
                searchData[value] = {
                    $regex: new RegExp(`^${String(data[value]).trim()}`),
                    $options: "i",
                };
                searchQuery.push(searchData);
            }
        });
        if (searchQuery.length !== 0)
            query.$or = searchQuery;
        return { query, page, limit };
    }
    catch (error) {
        return { query: {}, page: 1, limit: 10 };
    }
};
exports.getPaginationQuery = getPaginationQuery;
const getPaginatedItems = async (model, pagination, select = "", sort = { created_at: -1 }) => {
    const [items, total] = await Promise.all([
        model
            .find(pagination.query)
            .select(`${select} -_id`)
            .sort(sort)
            .skip(parseInt(String((pagination.page - 1) * pagination.limit), 10))
            .limit(parseInt(String(pagination.limit), 10))
            .allowDiskUse(true)
            .exec(),
        model.countDocuments(pagination.query).exec(),
    ]);
    return { items, total_count: total, total_pages: Math.ceil(total / pagination.limit) };
};
exports.getPaginatedItems = getPaginatedItems;
