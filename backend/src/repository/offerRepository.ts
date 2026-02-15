import { FilterQuery } from "mongoose";
import { IOfferRepo } from "../interface/ṛepository/offerRepositoryInterface";
import Offer, { IOffer } from "../models/offerModel";
import { BaseRepository } from "./baseRepository";

export class OfferRepository extends BaseRepository<IOffer> implements IOfferRepo {
    constructor() {
        super(Offer);
    }
    async findAllByCompanyId(companyId: string, skip: number, limit: number, search: string) {
        const filter: FilterQuery<IOffer> = {
            company: companyId,
        };
        if (search) {
            filter.offerName = { $regex: search, $options: "i" };
        }
        filter.isActive = true;
        const offers = await Offer.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

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