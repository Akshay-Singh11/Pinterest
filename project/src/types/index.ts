export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Pin {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  width: number;
  height: number;
  saved: boolean;
  category: string;
  user: User;
}