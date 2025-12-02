import { IInvestor } from "../../models/investorModel";

export interface IProfileRepo{
    updateProfile(investorId:string,updatedData:IInvestor):Promise<IInvestor|null>
    findById(investorId:string):Promise<IInvestor|null>
}