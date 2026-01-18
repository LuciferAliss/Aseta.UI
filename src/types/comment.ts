export interface Comment {
  id: string;
  content: string;
  userName: string;
  email: string;
  createdAt: string;
}

export interface KeysetPage<T> {
  cursor: string | null;
  hasNextPage: boolean;
  items: T[];
}

export interface CommentsResponse {
  comments: KeysetPage<Comment>;
}

export interface GetCommentsCatalogRequest {
  inventoryId: string;
  cursor?: string;
  pageSize: number;
}
