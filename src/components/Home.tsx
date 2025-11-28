import React, { useEffect, useState } from "react";
import FeedService from "../services/feed.service";
import type { IPost } from "../types/post.type";
import Pagination from "./Pagination";
import FeedGrid from "./FeedGrid";

const HomeFeed: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await FeedService.getHomeFeed(page, 20);
      setPosts(res.data);

      setHasMore(res.data.length === 20);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);
  if (loading)
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle
          fill="#DC7A34"
          stroke="#DC7A34"
          stroke-width="4"
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
          stroke-width="4"
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
          stroke-width="4"
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
    <>
      <div className="home">
        {loading}
        <aside className="page-content">
          <h2 className="home__line">Popular now</h2>
          <br></br>
        </aside>
        <FeedGrid items={posts} />

        <Pagination
          page={page}
          totalPages={hasMore ? page + 1 : page}
          setPage={setPage}
        />
      </div>
    </>
  );
};

export default HomeFeed;
