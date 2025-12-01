import type { IUser } from "./user.type";


export interface IGalleryFile {
  id: number;
  path: string;
  caption?: string;
  alt?: string;
  createdAt?: string;
  likes: number;
  likedByUser: boolean;
  user: IUser; 
}


export interface IUploadResponse {
  message: string;
  file: IGalleryFile;
}
