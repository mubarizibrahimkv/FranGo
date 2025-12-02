import { ICompany } from "../../models/companyModel";

export interface ICompanyAuthRepo{
    registerUser(companyName: string,email: string,role: string,registrationProof: string,companyLogo:string,hashedPassword: string,verificationToken:string): Promise<ICompany | null>
    findByEmail(email: string): Promise<ICompany| null>;
    findByVerificationToken(verificationToken: string): Promise<ICompany | null>;
    findById(email: string): Promise<ICompany | null>;
    saveUser(company:ICompany):Promise<ICompany>
}