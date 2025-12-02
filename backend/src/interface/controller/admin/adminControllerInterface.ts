import { Request, Response } from "express";

export interface IAdminControler{
    addIndustryCategory(req:Request,res:Response):Promise<void>
    editIndustryCategory(req:Request,res:Response):Promise<void>
    getIndustryCategory(req:Request,res:Response):Promise<void>
    deleteIndustryCategory(req:Request,res:Response):Promise<void>
}