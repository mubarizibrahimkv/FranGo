import { AddressDTO } from "../dtos/address.dto";
import { IAddress } from "../models/addressModel";


export class AddressMapper {
  static toDTO(address: IAddress): AddressDTO {
    return {
      _id: String(address._id),
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      address: address.address,
      city: address.city,
      state: address.state,
      pinCode: address.pinCode,
      country: address.country,
      isDefault: address.isDefault,
      isListed: address.isListed,
    };
  }

  static toDTOList(addresses: IAddress[]): AddressDTO[] {
    return addresses.map(AddressMapper.toDTO);
  }
}
