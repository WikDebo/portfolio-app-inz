import type { IUser } from "./user.type";

export interface IPortfolio {
  id: number;
  title: string;
  description?: string | null;
  userId?: number;
  user?: IUser;
  categories?: ICategory[];
}

export interface ICategory {
  id: number;
  categoryName: string;
  description?: string | null;
  portfolioFiles?: IPortfolioFile[];
  portfolioId: number;
}

export interface IPortfolioFile {
  id: number;
  fileName: string;
  caption?: string | null;
  path: string;
  categoryId?: number;
}
