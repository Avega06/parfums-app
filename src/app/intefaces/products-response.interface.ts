export interface ProductsResponse {
  result: ProductsResponseResult;
}

export interface ProductsResponseResult {
  pages: string;
  result: Product[];
}

export interface Product {
  parfumId: string;
  product: string;
  price: number;
  volume: string;
  imageUrl: string;
  link: string;
  type: Type;
  brand: string;
  shop: Shop;
}

export enum Shop {
  Cosmetic = 'Cosmetic',
}

export enum Type {
  Edp = 'EDP',
  Edt = 'EDT',
  Other = 'Other',
}
