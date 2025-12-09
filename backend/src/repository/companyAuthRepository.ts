import { ICompanyAuthRepo } from "../interface/ṛepository/companyAuthRepositoryInterface";
import Company, { ICompany } from "../models/companyModel";

export class CompanyAuthRepository implements ICompanyAuthRepo {
    async registerUser(
        companyName: string,
        email: string,
        role: "customer" | "admin" | "investor" | "company",
        registrationProof: string,
        companyLogo:string,
        hashedPassword: string,
        verificationToken:string
    ){
        const company = new Company({
            companyName,
            email,
            password: hashedPassword,
            role,
            companyRegistrationProof:registrationProof,
            companyLogo:companyLogo,
            verificationToken,
            isAdmin: false,
            isBlocked: false,
        });
        return await company.save();
    }


    async findByEmail(email: string) {
        return Company.findOne({ email });
    }

    async findByVerificationToken(verificationToken:string){
        return Company.findOne({verificationToken});
    }

    async findById(id: string) {
        try {
            return await Company.findById(id);
        } catch (error) {
            console.error("Error in findById:", error);
            throw error;
        }
    }
    async saveUser(company: ICompany) {
        return await company.save();
    }
}