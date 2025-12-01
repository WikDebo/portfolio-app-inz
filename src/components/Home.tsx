import React, { useEffect, useState } from "react";
import FeedService from "../services/feed.service";
import type { IFeedItem } from "../types/feedItem.type";
import Pagination from "./Pagination";
import FeedGrid from "./FeedGrid";

const HomeFeed: React.FC = () => {
  const [posts, setPosts] = useState<IFeedItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await FeedService.getHomeFeed(page, 20);
      setPosts(res.data);

      setHasMore(res.data.length === 20);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  return (
    <>
      <div className="home">
        <div className="page-content">
          <h2 className="home__line">Popular now</h2>
          <br></br>
        </div>
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
