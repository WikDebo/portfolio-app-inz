/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
import LikesService from "../services/likes.service";
import AuthContext from "../context/AuthContext";
import type { IGalleryFile } from "../types/gallery.type";
import { Link } from "react-router-dom";
import type { IUser } from "../types/user.type";

interface GalleryItemProps {
  user: IUser;
  file: IGalleryFile;
  onDelete?: (fileId: number) => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ file, user, onDelete }) => {
  const { currentUser } = useContext(AuthContext);
  const isOwner = currentUser?.id === user.id;

  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await LikesService.getLikeCount(file.id);
        setLikes(res.likeCount);
      } catch (err) {
        console.error("Error fetching like count:", err);
      }
    };
    fetchLikes();
  }, [file.id]);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!currentUser) return;
      try {
        const status = await LikesService.checkLikeStatus(file.id);
        setIsLiked(status.isLiked);
      } catch (err) {
        console.error("Error checking like status:", err);
      }
    };
    fetchLikeStatus();
  }, [file.id, currentUser]);

  const handleLikeToggle = async () => {
    if (!currentUser || loading) return;

    setLoading(true);
    try {
      if (isLiked) {
        await LikesService.unlikeFile(file.id);
        setLikes((prev) => prev - 1);
      } else {
        await LikesService.likeFile(file.id);
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
                : "/preview.png"
            }
            alt={user.username}
            className="feed__profile-img"
          />
          <p className="medium feed__profilename">{user.username}</p>
        </Link>
      </div>

      {file.caption && <p className="feed__caption">{file.caption}</p>}

      <img
        src={`http://localhost:8080${file.path}`}
        alt={file.caption || ""}
        className="feed__image"
      />

      <div className="feed__likeArea">
        {currentUser && (
          <button
            onClick={handleLikeToggle}
            className={`feed__like ${isLiked ? "liked" : "not-liked"}`}
            disabled={loading}
          >
            {isLiked ? "Unlike" : "Like"}
          </button>
        )}
        <span className="feed__likeCount">
          {likes} {likes === 1 ? "like" : "likes"}
        </span>

        {isOwner && (
          <button
            className="gallery__modal-delete"
            onClick={() => onDelete?.(file.id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default GalleryItem;
