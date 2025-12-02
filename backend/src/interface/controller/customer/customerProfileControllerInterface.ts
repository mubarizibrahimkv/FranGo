import { Request, Response } from "express";

export interface ICustomerProfileController{
   addAddress(req:Request,res:Response):Promise<void>
   getAddress(req:Request,res:Response):Promise<void>
   editAddress(req:Request,res:Response):Promise<void>
   deleteAddress(req:Request,res:Response):Promise<void>
}