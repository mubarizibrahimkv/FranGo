import { CompanyLoginDTO } from "../../dtos/company/company.login.dto";
import { CompanyRegisterDTO } from "../../dtos/company/company.register.dto";
import { CompanyResponseDTO } from "../../dtos/company/company.response.dto";
import { ICompany } from "../../models/companyModel";

export interface ICompanyAuthService {
  register(
    dto: CompanyRegisterDTO,
  ): Promise<{ 
    company: CompanyResponseDTO;
     token: string; 
     refreshToken: string; }>


  verifyCompany(
    verificationToken: string,
  ): Promise<{ 
    user: CompanyResponseDTO;
  }>;

  sendVerificationEmail(
  email: string,
  verificationToken: string,
  purpose?:string|undefined
): Promise<boolean>;

  resendLink(email: string,purpose:string|undefined): Promise<CompanyResponseDTO>;
  forgotPassword(email:string):Promise<ICompany>
  changePassword(email:string,password:string):Promise<ICompany>
  
  login(dto: CompanyLoginDTO):Promise<{
    company:CompanyResponseDTO,
    token:string,
    refreshToken:string
  }>

}