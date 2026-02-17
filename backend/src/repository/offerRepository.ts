import { FilterQuery } from "mongoose";
import { IOfferRepo } from "../interface/ṛepository/offerRepositoryInterface";
import Offer, { IOffer } from "../models/offerModel";
import { BaseRepository } from "./baseRepository";

export class OfferRepository extends BaseRepository<IOffer> implements IOfferRepo {
    constructor() {
        super(Offer);
    }
    async findAllByCompanyId(
        companyId: string,
        skip?: number,
        limit?: number,
        search?: string
    ) {
        const filter: FilterQuery<IOffer> = {
            company: companyId,
            isActive: true,
        };

        if (search?.trim()) {
            filter.offerName = { $regex: search, $options: "i" };
        }

        const query = Offer.find(filter).sort({ createdAt: -1 });

        if (typeof skip === "number") {
            query.skip(skip);
        }

        if (typeof limit === "number") {
            query.limit(limit);
        }

        const offers = await query.lean();

        const totalCount = await Offer.countDocuments(filter);

        return { offers, totalCount };
    }
    async deleteOffer(offerId: string) {
        await Offer.findByIdAndUpdate(offerId, { isActive: false });
        return;
    }
    async existsByName(
        companyId: string,
        offerName: string,
        excludeId?: string
    ) {
        const filter: FilterQuery<IOffer> = {
            company: companyId,
            offerName,
            isActive: true,
        };

        if (excludeId) {
            filter._id = { $ne: excludeId };
        }
        const exists = await Offer.exists(filter);
        return Boolean(exists);
    }

}