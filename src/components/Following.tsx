/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import FeedService from "../services/feed.service";
import FeedItem from "./FeedItem";
import ConnectionsService from "../services/connections.service";
import type { IUser } from "../types/user.type";
import Pagination from "./Pagination";
import { Link } from "react-router-dom";

interface Post {
  id: number;
  user: IUser;
  path: string;
  caption?: string;
  likeCount: number;
}

const FollowingFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [following, setFollowing] = useState<IUser[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchFollowing = async () => {
    try {
      const data = await ConnectionsService.getFollowing();
      setFollowing(data.map((f: any) => f.FollowingUser));
    } catch (err) {
      console.error("Error loading connections:", err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await FeedService.getFollowingFeed(page, 25);
      setPosts(res.data);
      setHasMore(res.data.length === 25);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchFollowing();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  return (
    <div className="page-content">
      <div className="following">
        <div className="following__line">
          {following.map((u) => (
            <div key={u.id} className="following__line-space">
              {" "}
              <Link
                key={u.id}
                to={`/profile/${u.username}/gallery`}
                className="feed__profile"
              >
                <img
                  src={
                    u.profilephoto
                      ? `http://localhost:8080/uploads/${u.profilephoto}`
                      : "/preview.png"
                  }
                  alt={`Profile photo of ${u.username}`}
                  className="feed__profile-img"
                />
                <p className="medium">{u.username}</p>
              </Link>
            </div>
          ))}
        </div>
        <br></br>
        <div className="following__all">
          {posts.map((post) => (
            <FeedItem key={post.id} {...post} />
          ))}
        </div>
        <Pagination
          page={page}
          totalPages={hasMore ? page + 1 : page}
          setPage={setPage}
        ></Pagination>
      </div>
    </div>
  );
};

export default FollowingFeed;
