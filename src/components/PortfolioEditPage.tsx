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

    // Add the new category
    await PortfolioService.addCategory({ categoryName: newCategoryName });

    // Refetch portfolio to get the new category with its ID
    const portfolio = await PortfolioService.getMyPortfolio();
    setCategories(portfolio.categories || []);

    // Reset form
    setNewCategoryName("");
    setIsAdding(false);
  };

  const handleDeleteCategory = async (id: number) => {
    if (!id) return; // make sure id exists
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
    <div>
      <h2>{portfolioExists ? "Edit Portfolio" : "Create Your Portfolio"}</h2>

      {/* portfolio edit */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSavePortfolio();
        }}
      >
        <label>
          Title:
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <button type="submit">
          {portfolioExists ? "Save Changes" : "Create Portfolio"}
        </button>
      </form>

      {portfolioExists && (
        <>
          <h3>Categories</h3>
          {/* add category  */}
          {!isAdding ? (
            <button onClick={() => setIsAdding(true)}>Add Category</button>
          ) : (
            <div className="category__text">
              <input
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <button onClick={handleConfirmAddCategory}>Add</button>
              <button onClick={() => setIsAdding(false)}>Cancel</button>
            </div>
          )}
          <ul>
            {categories.map((cat) => (
              <li key={cat.id}>
                {cat.categoryName}
                <Link
                  className="category__text"
                  to={`/profile/portfolio/category/${cat.id}/edit`}
                >
                  Edit
                </Link>
                <button
                  className="btn"
                  onClick={() => handleDeleteCategory(cat.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default PortfolioEditPage;
