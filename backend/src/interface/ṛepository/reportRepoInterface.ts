import { IReport } from "../../models/reportModel";

export interface IRepoortRepo{
    create(data:IReport):Promise<IReport>
    findAll():Promise<IReport[]>
    findAllWithCompanyAndInvestor():Promise<IReport[]>
}