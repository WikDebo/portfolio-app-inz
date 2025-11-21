import type { IUser } from "../types/user.type";
import type { IPortfolio } from "../types/portfolio.type";
import type { IGalleryFile } from "../types/gallery.type";

export interface ISearchResponse {
  users: IUser[];
  portfolios: IPortfolio[];
  gallery: IGalleryFile[];
}
