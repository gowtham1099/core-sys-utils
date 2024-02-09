/*
 * Created by Gowtham R
 * Created on Sat Dec 23 2023
 * Copyright (c) 2023
 */
import { Document, Model } from "mongoose";

export const getCaseSensitive = (data: string): object => {
    return { $regex: new RegExp(`^${data?.trim()}$`), $options: "i" };
};

export const mongoTimestamp = (): object => {
    return { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } };
};

type PaginationQuery = {
    query: Record<string, any>;
    page: number;
    limit: number;
};

export const getPaginationQuery = (data: any, searchFields: string[]): PaginationQuery => {
    try {
        const query: Record<string, any> = { limit: data?.limit, page: data?.page };
        let limit = 10;
        let page = 1;

        if (query.limit && query.limit !== 0) limit = query.limit;
        if (query.page && query.page !== 0) page = query.page;

        delete query.limit;
        delete query.page;

        const searchQuery: Record<string, any>[] = [];
        searchFields.forEach((value) => {
            const searchData: Record<string, any> = {};
            if (data[value]) {
                searchData[value] = {
                    $regex: new RegExp(`^${String(data[value]).trim()}`),
                    $options: "i",
                };
                searchQuery.push(searchData);
            }
        });

        if (searchQuery.length !== 0) query.$or = searchQuery;

        return { query, page, limit };
    } catch (error) {
        return { query: {}, page: 1, limit: 10 };
    }
};

type PaginatedItemsResult<T> = {
    items: T[];
    total_count: number;
    total_pages: number;
};

type SortOrder = 1 | -1;

type SortOption = string | { [key: string]: SortOrder | { $meta: any } } | [string, SortOrder][];

export const getPaginatedItems = async <T extends Document>(
    model: Model<T>,
    pagination: PaginationQuery,
    select: string = "",
    sort: SortOption = { created_at: -1 }
): Promise<PaginatedItemsResult<T>> => {
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
