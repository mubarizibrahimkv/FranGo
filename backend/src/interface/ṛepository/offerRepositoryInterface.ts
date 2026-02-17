import { IOffer } from "../../models/offerModel";

export interface IOfferRepo{
    create(data:Partial<IOffer>):Promise<IOffer>
    deleteOffer(id:string):Promise<void>
    update(id:string,data:Partial<IOffer>):Promise<IOffer|null>
    findAllByCompanyId(companyId:string, skip?: number, limit?: number, search?: string):Promise<{offers:IOffer[],totalCount:number}>
    existsByName(companyId: string,offerName: string,excludeId?: string):Promise<boolean>
}