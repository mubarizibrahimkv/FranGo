import { StockResponseDTO } from "../dtos/inventory";
import { IStock } from "../models/stockSchema";

export class StockMapper {

  static toResponse(stock: IStock): StockResponseDTO {
    return {
      _id: String(stock._id),
      product: stock.product.toString(),
      application: stock.application.toString(),
      investor: stock.investor.toString(),
      quantity: stock.quantity,
      createdAt: stock.createdAt,
      updatedAt: stock.updatedAt,
    };
  }

  static toResponseList(stocks: IStock[]): StockResponseDTO[] {
    return stocks.map((stock) => this.toResponse(stock));
  }
}
