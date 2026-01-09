export interface UpdateProductDTO {
  companyId: string;
  productId: string;
  categoryId: string;
  name: string;
  price: string;
  description: string;
  newImagePaths: string[];
  removedImages: string[];
}
