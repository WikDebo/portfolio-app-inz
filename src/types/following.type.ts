import type { IUser } from "./user.type";

export interface IPost {
  id: number;
  user: IUser;
  path: string;
  caption?: string;
  likeCount: number;
}