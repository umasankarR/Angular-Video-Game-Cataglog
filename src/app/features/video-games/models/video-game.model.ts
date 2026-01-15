export enum Genre {
  Action = 1,
  Adventure = 2,
  RPG = 3,
  Strategy = 4,
  Sports = 5,
  Racing = 6,
  Simulation = 7,
  Puzzle = 8,
  Fighting = 9,
  Shooter = 10,
  Horror = 11,
  Platformer = 12,
  Other = 99
}

export interface VideoGame {
  id: number;
  title: string;
  publisher: string;
  developer: string;
  releaseDate: string;
  genre: Genre;
  genreName: string;
  price: number;
  description: string;
  rating: number;
  coverImageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface CreateVideoGameRequest {
  title: string;
  publisher: string;
  developer: string;
  releaseDate: string;
  genre: Genre;
  price: number;
  description: string;
  rating: number;
  coverImageUrl: string;
}

export interface UpdateVideoGameRequest {
  id: number;
  title: string;
  publisher: string;
  developer: string;
  releaseDate: string;
  genre: Genre;
  price: number;
  description: string;
  rating: number;
  coverImageUrl: string;
  isActive: boolean;
}
