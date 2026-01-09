
export interface AddressDTO {
  _id: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  isDefault?: boolean;
  isListed?: boolean;
}

export interface AddressResponseDTO {
  address: AddressDTO;
  message?: string;
}

export interface AddressListResponseDTO {
  addresses: AddressDTO[];
}
