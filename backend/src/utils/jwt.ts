import jwt from "jsonwebtoken";

export const generateToken = (id: string, role: string | undefined): string => {

    // logger.info(`Generating Access Token - id: ${id}, isAdmin: ${isAdmin}`);
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET as string,
        { expiresIn: "6h" }
    );
};

export const generateRefreshToken = (id: string , role: string | undefined): string => {
    
    // logger.info(`Generating Refresh Token - id: ${id}, isAdmin: ${isAdmin}`);
    return jwt.sign(
        { id, role },
        process.env.REFRESH_JWT_SECRET as string,
        { expiresIn: "7d" }
    );
};


export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET as string);
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, process.env.REFRESH_JWT_SECRET as string);
};
                    