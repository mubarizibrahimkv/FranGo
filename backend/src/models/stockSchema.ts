import mongoose, { Document, model, Types } from "mongoose";

export interface IStock extends Document {
    product: Types.ObjectId;
    investor: Types.ObjectId;
    application: Types.ObjectId;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}



const StockSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    application: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
        required: true
    },
    investor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Investor",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
}, { timestamps: true });


StockSchema.index({ product: 1, application: 1 }, { unique: true });


const Stock = model<IStock>("Stock", StockSchema);

export default Stock;