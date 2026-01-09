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

  createdAt: Date;
  updatedAt: Date;
}
