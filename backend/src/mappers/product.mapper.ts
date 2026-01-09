import { ProductResponseDTO } from "../dtos/product/product-reponse.dto";
import { IProduct } from "../models/productModel";

export class ProductMapper {
    static toResponse(product: IProduct): ProductResponseDTO {
        return {
            _id: String(product._id),
            name: product.name,
            description: product.description,
            price: product.price,
            images: product.images,

            status: product.status,
            isListed: product.isListed,

            company: product.company.toString(),
            productCategory: product.productCategory.toString(),
            industryCategory: product.industryCategory.toString(),

            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    }

    static toResponseList(products: IProduct[]): ProductResponseDTO[] {
        return products.map((product) => this.toResponse(product));
    }
}
