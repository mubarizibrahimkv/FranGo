export interface StockResponseDTO {
  _id: string;
  product: string;
  application: string;
  investor: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}
