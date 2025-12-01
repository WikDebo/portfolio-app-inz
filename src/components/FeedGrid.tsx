import React, { useEffect, useRef, useState } from "react";
import FeedItem from "./FeedItem";
import type { IUser } from "../types/user.type";

interface FeedItemData {
  id: number;
  user: IUser;
  path: string;
  caption?: string;
  alt?: string;
  likeCount: number;
}

interface FeedGridProps {
  items: FeedItemData[];
}

const FeedGrid: React.FC<FeedGridProps> = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState<FeedItemData | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedItem(null);
    };
    if (selectedItem) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem]);
  return (
    <>
      <div className="page-content">
        <section className="feed-grid">
          {items.map((item) => (
            <button
              key={item.id}
              className="feed-grid__container"
              onClick={() => setSelectedItem(item)}
            >
              <img
                src={`http://localhost:8080${item.path}`}
                alt={item.alt}
                className="feed-grid__item"
              />
              <div className="feed-grid__wrapper">
                <img
                  src={
                    item.user.profilephoto
                      ? `http://localhost:8080/uploads/${item.user.profilephoto}`
                      : "/preview.png"
                  }
                  alt={item.user.username}
                  className="feed-grid__profile-img"
                />
                <a className="feed-grid__profile-name"> {item.user.username}</a>
              </div>
            </button>
          ))}
        </section>
      </div>

      {selectedItem && (
        <span
          className="feedgrid__modal"
          ref={modalRef}
          tabIndex={-1}
          onClick={() => setSelectedItem(null)}
        >
          <span
            className="feedgrid__modal__content"
            onClick={(e) => e.stopPropagation()}
          >
            <FeedItem {...selectedItem} />
          </span>{" "}
          <button
            className="btn-special feedgrid__modal__close"
            onClick={() => setSelectedItem(null)}
          ></button>
        </span>
      )}
    </>
  );
};

export default FeedGrid;
