import { IFranchise } from "../../models/franchiseModel";

export interface IFranchiseRepo{
    create(data:Partial<IFranchise>):Promise<IFranchise>
    update(franchiseId:string,data:Partial<IFranchise>):Promise<IFranchise|null>
    delete(franchiseId:string):Promise<IFranchise|null>
    findByCompanyId(companyId:string,skip:number,limit:number,search:string,filter?: Record<string, string>):Promise<IFranchise[]>
    countByCompanyId(companyId:string):Promise<number>
    findById(franchiseId:string):Promise<IFranchise|null>
    findAll():Promise<IFranchise[]|[]>
    findAllWithCompany(query:any,sortOption:any):Promise<IFranchise[]|[]>
    findByIdWithComapny(franchiseId:string):Promise<IFranchise|null>
}