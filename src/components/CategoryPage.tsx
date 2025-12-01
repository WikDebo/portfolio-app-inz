import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import PortfolioService from "../services/portfolio.service";
import type { ICategory, IPortfolioFile } from "../types/portfolio.type";
import AuthContext from "../context/AuthContext";

interface ModalImg {
  src: string;
  alt: string;
}

const CategoryPage: React.FC = () => {
  const { username, categoryId } = useParams<{
    username: string;
    categoryId: string;
  }>();
  const { currentUser } = useContext(AuthContext);
  const isOwnCategory = !username || username === currentUser?.username;

  const [category, setCategory] = useState<ICategory | null>(null);
  const [modalImg, setModalImg] = useState<ModalImg | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const data = isOwnCategory
          ? await PortfolioService.getMyCategoryById(Number(categoryId))
          : await PortfolioService.getUserCategoryById(
              username!,
              Number(categoryId)
            );
        setCategory(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadCategory();
  }, [username, categoryId, isOwnCategory]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalImg(null);
    };
    if (modalImg) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modalImg]);

  if (!category) return <p>Loading category...</p>;

  return (
    <>
      <div className="page-content">
        <div className="category-page">
          <div className="category-page__left">
            <h1>{category.categoryName}</h1>
            <h4 className="small">By {username || currentUser?.username}</h4>
            <p className="small">{category.description || "No description"}</p>
          </div>

          <div className="category-page__right">
            <div className="portfolio__grid">
              {category.portfolioFiles?.map((file: IPortfolioFile) => (
                <button
                  key={file.id}
                  className="btn-special portfolio__grid-item"
                  onClick={() =>
                    setModalImg({
                      src: file.path,
                      alt: file.alt || file.caption || "Portfolio image",
                    })
                  }
                >
                  <img
                    src={`http://localhost:8080${file.path}`}
                    alt={file.alt || file.caption || "Portfolio image"}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {modalImg && (
        <div
          ref={modalRef}
          className="fullscreen-modal"
          role="dialog"
          tabIndex={-1}
          onClick={() => setModalImg(null)}
        >
          <div
            className="fullscreen-modal__content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn-special fullscreen-modal__close"
              onClick={() => setModalImg(null)}
            ></button>
            <img
              src={`http://localhost:8080${modalImg.src}`}
              alt={modalImg.alt}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryPage;
