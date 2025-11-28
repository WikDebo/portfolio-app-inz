import type { IUser } from "./user.type";


export interface IGalleryFile {
  id: number;
  path: string;
  caption?: string;
  createdAt?: string;
  likes: number;            // total likes
  likedByUser: boolean;     // whether this user liked the file
  user: IUser; 
}


export interface IUploadResponse {
  message: string;
  file: IGalleryFile;
}
