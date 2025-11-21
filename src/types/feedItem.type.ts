import type { IUser } from "./user.type";

export interface IFeedItem {
  id: number;
  user: IUser
  path: string;
  caption?: string;
  likeCount: number;
}