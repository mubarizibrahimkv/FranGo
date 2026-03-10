export interface ProductResponseDTO {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];

  status: "active" | "inactive";
  isListed: boolean;

  company: string;
  productCategory: string;
  industryCategory: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}
