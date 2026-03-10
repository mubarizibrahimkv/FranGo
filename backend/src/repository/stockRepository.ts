import mongoose, { PipelineStage } from "mongoose";
import { IStockRepo } from "../interface/ṛepository/stockRepoInterface";
import Stock, { IStock } from "../models/stockSchema";
import { BaseRepository } from "./baseRepository";

export class InventoryRepository extends BaseRepository<IStock> implements IStockRepo {
    constructor() {
        super(Stock);
    }
    async updateStock(applicationId: string, productId: string, stock: number) {
        return await Stock.findOneAndUpdate({ application: applicationId, product: productId }, { quantity: stock }, { new: true })
    }
    async existStock(applicationId: string, productId: string) {
        return await Stock.findOne({
            product: productId,
            application: applicationId
        });
    }
    async getProductsByApplication(
        applicationId: string,
        search: string = "",
        skip: number = 0,
        limit: number = 10
    ) {
        const pipeline: PipelineStage[] = [];

        pipeline.push({
            $match: {
                application: new mongoose.Types.ObjectId(applicationId),
            },
        });
        pipeline.push({
            $lookup: {
                from: "products",
                localField: "product",
                foreignField: "_id",
                as: "product",
            },
        });

        pipeline.push({
            $unwind: "$product",
        });

        if (search.trim()) {
            pipeline.push({
                $match: {
                    $or: [
                        { "product.name": { $regex: search, $options: "i" } },
                        { "product.description": { $regex: search, $options: "i" } },
                    ],
                },
            });
        }

        pipeline.push({
            $facet: {
                data: [
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $project: {
                            _id: 1,
                            quantity: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            "product._id": 1,
                            "product.name": 1,
                            "product.description": 1,
                            "product.price": 1,
                            "product.images": 1,
                            "product.status": 1,
                            "product.isListed": 1,
                        },
                    },
                ],
                totalCount: [
                    { $count: "count" }
                ],
            },
        });

        const result = await Stock.aggregate(pipeline);

        return {
            products: result[0]?.data ?? [],
            totalCount: result[0]?.totalCount[0]?.count ?? 0,
        };
    }
}