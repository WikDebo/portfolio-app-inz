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
  }, [page]);
  if (loading)
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle
          fill="#DC7A34"
          stroke="#DC7A34"
          strokeWidth="2"
          r="15"
          cx="40"
          cy="65"
        >
          <animate
            attributeName="cy"
            calcMode="spline"
            dur="2"
            values="65;135;65;"
            keySplines=".5 0 .5 1;.5 0 .5 1"
            repeatCount="indefinite"
            begin="-.4"
          ></animate>
        </circle>
        <circle
          fill="#DC7A34"
          stroke="#DC7A34"
          stroke-width="2"
          r="15"
          cx="100"
          cy="65"
        >
          <animate
            attributeName="cy"
            calcMode="spline"
            dur="2"
            values="65;135;65;"
            keySplines=".5 0 .5 1;.5 0 .5 1"
            repeatCount="indefinite"
            begin="-.2"
          ></animate>
        </circle>
        <circle
          fill="#DC7A34"
          stroke="#DC7A34"
          stroke-width="2"
          r="15"
          cx="160"
          cy="65"
        >
          <animate
            attributeName="cy"
            calcMode="spline"
            dur="2"
            values="65;135;65;"
            keySplines=".5 0 .5 1;.5 0 .5 1"
            repeatCount="indefinite"
            begin="0"
          ></animate>
        </circle>
      </svg>
    );

  return (
    <aside className="page-content">
      <div className="following">
        {loading}

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
                  alt=""
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
    </aside>
  );
};

export default FollowingFeed;
