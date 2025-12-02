import { ICustomer } from "../../models/customerModel";


export interface ICustomerAuthService {
  registerUser(
    userName: string,
    email: string,
    password: string,
    role: string
  ): Promise<{ user:ICustomer  | null;
     token: string; 
     refreshToken: string; }>


  verifyOtp(
    email: string,
    otp: string
  ): Promise<{
    customer: ICustomer;
    message: string;
  }>;

  resendOtp(email: string): Promise<string>;

  Login(
  email: string,
  password: string
): Promise<{
  user: ICustomer;
  token: string;
  refreshToken: string;
}>;

forgotPassword(email:string):Promise<ICustomer>
changePassword(email:string,password:string):Promise<ICustomer>

}

export interface IError {
  status: number;
  message: string;
}

