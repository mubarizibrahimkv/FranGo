import { formData } from "../../controllers/company/authController";
import { ICompany } from "../../models/companyModel";

export interface ICompanyAuthService {
  register(
    formData: formData,
    registrationProof: string,
    companyLogo: string,
  ): Promise<{ company: ICompany ;
     token: string; 
     refreshToken: string; }>


  verifyCompany(
    verificationToken: string,
  ): Promise<{
    user: ICompany;
  }>;

  sendVerificationEmail(
  email: string,
  verificationToken: string,
  purpose?:string|undefined
): Promise<boolean>;

  resendLink(email: string,purpose:string|undefined): Promise<ICompany>;
  forgotPassword(email:string):Promise<ICompany>
  changePassword(email:string,password:string):Promise<ICompany>
  
  login(email:string,password:string):Promise<{
    company:ICompany,
    token:string,
    refreshToken:string
  }>

}