import React, { useEffect, useState } from "react";
import FeedService from "../services/feed.service";
import type { IPost } from "../types/post.type";
import Pagination from "./Pagination";
import FeedGrid from "./FeedGrid";

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await FeedService.getHomeFeed(page, 25);
      setPosts(res.data);

      // Stops the page when less than 25
      setHasMore(res.data.length === 25);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  });

  return (
    <>
      <div className="home">
        {loading && <p>Loading...</p>}
        <h2>Recent posts</h2>
        <br></br>
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

export default HomePage;
