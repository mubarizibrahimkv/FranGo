import { IIndustryCategory } from "../../models/industryCategoryModel";

export interface IIndustryCategoryRepo{
   create(data:IIndustryCategory):Promise<IIndustryCategory>
   delete(id:string):Promise<IIndustryCategory|null>
   update(id:string,data:IIndustryCategory):Promise<IIndustryCategory|null>
   findById(id:string):Promise<IIndustryCategory|null>
   findOne(categoryName:string):Promise<IIndustryCategory|null>
   findAll():Promise<IIndustryCategory[]>
   findBySearch(limit:number,skip:number,search:string,filter?:string):Promise<IIndustryCategory[]>
}