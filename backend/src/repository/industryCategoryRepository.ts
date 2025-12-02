import mongoose from "mongoose";
import { IIndustryCategoryRepo } from "../interface/ṛepository/adminIndustryCategoryInterface";
import IndustryCategory, { IIndustryCategory } from "../models/industryCategoryModel";
import { BaseRepository } from "./baseRepository";

export class IndustryCategoryRepo extends BaseRepository<IIndustryCategory> implements IIndustryCategoryRepo {
    constructor() {
        super(IndustryCategory);
    }
    
}