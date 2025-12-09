import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import Investor from "../models/investorModel";
import Customer from "../models/customerModel";
import Company from "../models/companyModel";

dotenv.config();

interface RoleModelMap {
    [key: string]: any;
}


export type AuthenticatedUser = {
  id: string;
  userName?: string;
  companyName?: string;
  profileImage?: string;
  email: string;
  isAdmin?: boolean;
  role: "customer" | "investor" | "company";
};

const roleModelMap: RoleModelMap = {
    investor: Investor,
    customer: Customer,
    company: Company,
};

export const setupGoogleStrategy = (role: string) => {
    const Model = roleModelMap[role];
    if (!Model) throw new Error("Invalid role for Google strategy");

    passport.use(
        `${role}-google`,
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID || "",
                clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
                callbackURL: `${process.env.SERVER_URL}/api/${role}/google/callback`,
            },
            async (_accessToken, _refreshToken, profile, done) => {
                try {
                    const user = await Model.findOne({ googleId: profile.id });

                    if (!user) {
                        const existingUser = await Model.findOne({
                            email: profile.emails?.[0]?.value,
                        });

                        const nameField = role === "company" ? "companyName" : "userName";
                        const includeProfileImage = role !== "customer";

                        if (existingUser) {
                            existingUser.googleId = profile.id;
                            existingUser[nameField] = profile.displayName;
                            existingUser.role = role;
                            existingUser.isBlocked = false;
                            if (includeProfileImage) {  
                                existingUser.profileImage = profile.photos?.[0]?.value || "";
                            }
                            await existingUser.save();
                            return done(null, existingUser);
                        } else {
                            const newUserData: any = {
                                email: profile.emails?.[0]?.value || "",
                                googleId: profile.id,
                                role,
                                status:"pending"
                            };

                            newUserData[nameField] = profile.displayName;
                            if (includeProfileImage) {
                                newUserData.profileImage = profile.photos?.[0]?.value || "";
                            }

                            const user = new Model(newUserData);
                            await user.save();
                            return done(null, user);
                        }
                    }
                    return done(null, user);
                } catch (error) {
                    return done(error as Error, false);
                }
            }
        )
    );
};


passport.serializeUser((user: any, done) => {
    done(null, user._id);
});



passport.deserializeUser(async (id, done) => {
    try {
        const user =
            (await Investor.findById(id)) ||
            (await Customer.findById(id)) ||
            (await Company.findById(id));
        done(null, user);
    } catch (error) {
        done(error, false);
    }
});
export default passport;