import express from "express";
import dotenv from "dotenv";
import http from "http";
import logger from "./logger";
import investorRoutes from "./routes/investorRoutes";
import companyRouter from "./routes/companyRoutes";
import cors from "cors";
import connectDB from "./config/db";
import cookieParser from "cookie-parser";
import customerRouter from "./routes/customerRoutes";
import adminRouter from "./routes/adminRoutes";
import messageRouter from "./routes/messageRoutes";
import passport from "./config/passport";
import session from "express-session";
import { setupSocket } from "./config/socket";


dotenv.config();
const app = express();
const server = http.createServer(app);

connectDB();

app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "Mubariz",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true,
            sameSite: "lax",
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/investor", investorRoutes);
app.use("/api/company", companyRouter);
app.use("/api/customer", customerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/message", messageRouter);

setupSocket(server);

const PORT = process.env.PORT;

server.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
}); 