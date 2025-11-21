export interface IConnections {
  id: number;
  followerId: number;
  followingId: number;
  createdAt: Date;
  status: "new" | "seen";
}