import { IInvestor } from "../../models/investorModel";


export interface IAuthService {
  registerUser(
    userName: string,
    email: string,
    password: string,
    role: string
  ): Promise<{ user:IInvestor  | null;
     token: string; 
     refreshToken: string; }>


  verifyOtp(
    email: string,
    otp: string
  ): Promise<{
    investor: IInvestor;
    message: string;
  }>;

  resendOtp(email: string): Promise<string>;

  Login(
  email: string,
  password: string
): Promise<{
  user: IInvestor;
  token: string;
  refreshToken: string;
}>;

forgotPassword(email:string):Promise<IInvestor>
changePassword(email:string,password:string):Promise<IInvestor>
refreshToken(refreshToken:string):Promise<string>

}

export interface IError {
  status: number;
  message: string;
}

