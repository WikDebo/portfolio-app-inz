export interface IUser {
  id?: unknown | null,
  username: string,
  email: string,
  password: string,
  roles?: Array<string>
}
