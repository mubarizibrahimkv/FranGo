import { ProductResponseDTO } from "../dtos/product/product-reponse.dto";
import { IProduct, ProductWithQuantity } from "../models/productModel";

export class ProductMapper {
   static toResponse(product: IProduct | ProductWithQuantity): ProductResponseDTO {
    return {
        _id: String(product._id),
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images,

        status: product.status,
        isListed: product.isListed,

        company: product.company?.toString() ?? "",
        productCategory: product.productCategory?.toString() ?? "",
        industryCategory: product.industryCategory?.toString() ?? "",

        quantity: "quantity" in product ? product.quantity : 0,

        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
}

    static toResponseList(products: (IProduct | ProductWithQuantity)[]): ProductResponseDTO[] {
        return products.map((product) => this.toResponse(product));
    }
}
