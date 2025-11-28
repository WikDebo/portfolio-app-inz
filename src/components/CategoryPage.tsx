import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import PortfolioService from "../services/portfolio.service";
import type { ICategory, IPortfolioFile } from "../types/portfolio.type";
import AuthContext from "../context/AuthContext";

const CategoryPage: React.FC = () => {
  const { username, categoryId } = useParams<{
    username: string;
    categoryId: string;
  }>();
  const { currentUser } = useContext(AuthContext);
  const isOwnCategory = !username || username === currentUser?.username;
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [category, setCategory] = useState<ICategory | null>(null);

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

  if (!category) return <p>Loading category...</p>;

  return (
    <>
      <aside className="page-content">
        <div className="category-page">
          <div className="category-page__left">
            <h1>{category.categoryName}</h1>
            <h4 className="small">By {username || currentUser?.username}</h4>
            <p className="small">{category.description || "No description"}</p>
          </div>

          <div className="category-page__right">
            <div className="portfolio__grid">
              {category.portfolioFiles?.map((file: IPortfolioFile) => (
                <div key={file.id} className="portfolio__grid-item">
                  <img
                    src={`http://localhost:8080${file.path}`}
                    alt=""
                    onClick={() => setModalImg(file.path)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>{" "}
      {modalImg && (
        <div className="fullscreen-modal" onClick={() => setModalImg(null)}>
          <img src={`http://localhost:8080${modalImg}`} alt="" />
        </div>
      )}
    </>
  );
};

export default CategoryPage;
