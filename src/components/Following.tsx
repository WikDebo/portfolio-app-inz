/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import FeedService from "../services/feed.service";
import FeedItem from "./FeedItem";
import ConnectionsService from "../services/connections.service";
import type { IUser } from "../types/user.type";
import Pagination from "./Pagination";
import { Link } from "react-router-dom";
import type { IPost } from "../types/following.type";

const FollowingPage: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      const res = await FeedService.getFollowingFeed(page, 25);
      setPosts(res.data);
      setHasMore(res.data.length === 25);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchFollowing();
  }, []);

  useEffect(() => {
    fetchPosts();
  });

  return (
    <div className="following">
      {loading && <p>Loading...</p>}
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
                    : "../../public/silly-seal.gif"
                }
                alt=""
                className="feed__profile-img"
              />
              <p className="medium">{u.username}</p>
            </Link>
          </div>
        ))}
      </div>
      <br></br>
      {posts.map((post) => (
        <FeedItem key={post.id} {...post} />
      ))}
      <Pagination
        page={page}
        totalPages={hasMore ? page + 1 : page}
        setPage={setPage}
      ></Pagination>
    </div>
  );
};

export default FollowingPage;
