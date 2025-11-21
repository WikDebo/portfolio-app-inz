export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  usertitle?: string;
  bio?: string;
  profilephoto?: string;
  roles?: string[];
  accessToken?: string;
}
export interface IUserLink {
  id: number;
  link: string;
  userId: number;
}