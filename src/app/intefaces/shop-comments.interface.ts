export interface ShopComments {
  id?: string;
  rating: number;
  comment: string;
  created_at: Date;
  author_name: string; // Mapeará con 'author_name' de la vista
}
