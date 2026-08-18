export interface CustomReview {
  id?: string;
  rating: number;
  comment: string;
  created_at: Date;
  author_name: string;
  isPublishing?: boolean;
}
