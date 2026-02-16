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
                as: "productDetails",
            },
        });

        pipeline.push({
            $unwind: "$productDetails",
        });

        if (search.trim()) {
            pipeline.push({
                $match: {
                    $or: [
                        { "productDetails.name": { $regex: search, $options: "i" } },
                        { "productDetails.description": { $regex: search, $options: "i" } },
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
                            "productDetails._id": 1,
                            "productDetails.name": 1,
                            "productDetails.description": 1,
                            "productDetails.price": 1,
                            "productDetails.images": 1,
                            "productDetails.status": 1,
                            "productDetails.isListed": 1,
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