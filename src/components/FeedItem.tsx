import React, { useEffect, useState, useContext } from "react";
import LikesService from "../services/likes.service";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import type { IFeedItem } from "../types/feedItem.type";

const FeedItem: React.FC<IFeedItem> = ({ id, user, path, caption }) => {
  const { currentUser } = useContext(AuthContext);
  //const isOwner = currentUser?.id === user.id;

  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await LikesService.getLikeCount(id);
        setLikes(res.likeCount);
      } catch (err) {
        console.error("Error fetching like count:", err);
      }
    };
    fetchLikes();
  }, [id]);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!currentUser) return;
      try {
        const status = await LikesService.checkLikeStatus(id);
        setIsLiked(status.isLiked);
      } catch (err) {
        console.error("Error checking like status:", err);
      }
    };
    fetchLikeStatus();
  }, [id, currentUser]);

  const handleLikeToggle = async () => {
    if (!currentUser || loading) return;

    setLoading(true);
    try {
      if (isLiked) {
        await LikesService.unlikeFile(id);
        setLikes((prev) => prev - 1);
      } else {
        await LikesService.likeFile(id);
        setLikes((prev) => prev + 1);
      }
      setIsLiked((prev) => !prev);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
    setLoading(false);
  };

  return (
    <div className="feed">
      <div className="feed__profile">
        <Link
          key={user.id}
          to={`/profile/${user.username}`}
          className="feed__profile"
        >
          <img
            src={
              user.profilephoto
                ? `http://localhost:8080/uploads/${user.profilephoto}`
                : "/silly-seal.gif"
            }
            alt={user.username}
            className="feed__profile-img"
          />
          <p className="medium feed__profilename">{user.username}</p>
        </Link>{" "}
      </div>

      {caption && <p className="feed__caption">{caption}</p>}

      {/* Gallery Item but feed*/}
      <img
        src={`http://localhost:8080${path}`}
        alt={caption || ""}
        className="feed__image"
      />

      {/* Likes */}
      <div className="feed__likeArea">
        {currentUser && (
          <button
            onClick={handleLikeToggle}
            className={`feed__like ${isLiked ? "liked" : ""}`}
            disabled={loading}
          >
            {isLiked ? "Unlike" : "Like"}
          </button>
        )}
        <span className="feed__likeCount">
          {likes} {likes === 1 ? "like" : "likes"}
        </span>
      </div>

      {/* Owner actions 
      {isOwner && (
        <div className="feed__ownerActions">
          <button>Edit</button>
          <button>Delete</button>
        </div>
      )}*/}
    </div>
  );
};

export default FeedItem;
