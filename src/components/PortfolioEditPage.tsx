/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PortfolioService from "../services/portfolio.service";
import type { ICategory, IPortfolio } from "../types/portfolio.type";

const PortfolioEditPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [portfolioExists, setPortfolioExists] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const portfolio: IPortfolio = await PortfolioService.getMyPortfolio();
        if (portfolio) {
          setPortfolioExists(true);
          setTitle(portfolio.title);
          setDescription(portfolio.description || "");
          setCategories(portfolio.categories || []);
        }
      } catch (err) {
        setPortfolioExists(false);
      }
    };
    loadPortfolio();
  }, []);

  const handleSavePortfolio = async () => {
    if (portfolioExists) {
      await PortfolioService.editPortfolio({ title, description });
      alert("Portfolio updated!");
    } else {
      await PortfolioService.createPortfolio({ title, description });
      alert("Portfolio created!");
      setPortfolioExists(true);
    }
  };

  const handleConfirmAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    await PortfolioService.addCategory({ categoryName: newCategoryName });

    const portfolio = await PortfolioService.getMyPortfolio();
    setCategories(portfolio.categories || []);

    setNewCategoryName("");
    setIsAdding(false);
  };

  const handleDeleteCategory = async (id: number) => {
    if (!id) return;
    if (!window.confirm("Delete this category?")) return;

    try {
      await PortfolioService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert("Failed to delete category. Please try again.");
    }
  };

  return (
    <aside className="page-content">
      <div className="portfolio">
        <div className="portfolio__all">
          <h2>
            {portfolioExists ? "Edit Portfolio" : "Create Your Portfolio"}
          </h2>

          <div className="portfolio__input">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSavePortfolio();
              }}
            >
              <label>
                Title:
                <input
                  className="title__input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <br></br>
              <label>
                Description:
                <textarea
                  className="input__desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>

              {portfolioExists && (
                <>
                  <div>
                    <h3>Categories</h3>
                    {!isAdding ? (
                      <button
                        className="link-btn"
                        onClick={() => setIsAdding(true)}
                      >
                        Add Category
                      </button>
                    ) : (
                      <div className="portfolio__add-category">
                        <input
                          placeholder="Category name"
                          className="portfolio__add-category__input"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                        <button
                          className="portfolio__add-category__btn"
                          onClick={handleConfirmAddCategory}
                        >
                          Add
                        </button>
                        <button
                          className="portfolio__add-category__btn"
                          onClick={() => setIsAdding(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  {categories.map((cat) => (
                    <div key={cat.id} className="portfolio__input-catlist">
                      <span>{cat.categoryName}</span>
                      <Link to={`/profile/portfolio/category/${cat.id}/edit`}>
                        <i className="material-symbols-outlined">edit</i>
                      </Link>
                      <a
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="material-symbols-outlined"
                      >
                        delete
                      </a>
                    </div>
                  ))}
                </>
              )}
              <button className="save-btn" type="submit">
                {portfolioExists ? "Save Changes" : "Create Portfolio"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default PortfolioEditPage;
