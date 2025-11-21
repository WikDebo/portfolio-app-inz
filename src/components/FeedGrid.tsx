import React, { useState } from "react";
import FeedItem from "./FeedItem";
import type { IUser } from "../types/user.type";

interface FeedItemData {
  id: number;
  user: IUser;
  path: string;
  caption?: string;
  likeCount: number;
}

interface FeedGridProps {
  items: FeedItemData[];
}

const FeedGrid: React.FC<FeedGridProps> = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState<FeedItemData | null>(null);

  return (
    <>
      <div className="feed-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className="feed-grid__container"
            onClick={() => setSelectedItem(item)}
          >
            <img
              src={`http://localhost:8080${item.path}`}
              alt={item.caption}
              className="feed-grid__item"
            />
            <div className="feed-grid__wrapper">
              <img
                src={
                  item.user.profilephoto
                    ? `http://localhost:8080/uploads/${item.user.profilephoto}`
                    : "../../public/silly-seal.gif"
                }
                alt={item.user.username}
                className="feed-grid__profile-img"
              />
              <a className="feed-grid__profile-name"> {item.user.username}</a>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="modal" onClick={() => setSelectedItem(null)}>
          <div className="modal__content" onClick={(e) => e.stopPropagation()}>
            <FeedItem {...selectedItem} />
          </div>
        </div>
      )}
    </>
  );
};

export default FeedGrid;
