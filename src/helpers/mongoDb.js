/*
 * Created by Gowtham R
 * Created on Sat Dec 23 2023
 * Copyright (c) 2023
 */
const logger = require("./logger");

module.exports = {
    /**
     * Get Mongodb Case Sensitive Regex
     * @param {*} data
     * @returns
     */
    getCaseSensitive: (data) => ({ $regex: new RegExp(`^${data?.trim()}$`), $options: "i" }),

    /**
     * Returns Mongodb schema timestamps
     * @returns
     */
    mongoTimestamp: () => ({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }),

    /**
     * Create pagination query with input data
     * @param {*} data
     * @param {*} searchFields
     * @returns
     */
    getPaginationQuery: (data, searchFields) => {
        try {
            const query = { limit: data?.limit, page: data?.page };
            let limit = 10;
            let page = 1;
            if (query.limit && query.limit !== 0) limit = query.limit;
            if (query.page && query.page !== 0) page = query.page;

            delete query.limit;
            delete query.page;

            const searchQuery = [];
            searchFields.forEach((value) => {
                const searchData = {};
                if (data[value]) {
                    searchData[value] = { $regex: new RegExp(`^${String(data[value]).trim()}`), $options: "i" };
                    searchQuery.push(searchData);
                }
            });
            if (searchQuery.length !== 0) query.$or = searchQuery;
            return { query, page, limit };
        } catch (error) {
            return { query: {}, page: 1, limit: 10 };
        }
    },

    /**
     * Return paginated data from any collections
     * @param {*} model
     * @param {*} pagination
     * @param {*} select
     * @param {*} sort
     * @returns
     */
    getPaginatedItems: async (model, pagination, select = "", sort = { created_at: -1 }) => {
        const [items, total] = await Promise.all([
            model
                .find(pagination.query)
                .select(`${select} -_id`)
                .sort(sort)
                .skip(parseInt((pagination.page - 1) * pagination.limit, 10))
                .limit(parseInt(pagination.limit, 10))
                .allowDiskUse(true),
            model.countDocuments(pagination.query),
        ]);
        return { items, total_count: total, total_pages: Math.ceil(total / pagination.limit) };
    },
};
