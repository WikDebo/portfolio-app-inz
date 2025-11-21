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

  const [category, setCategory] = useState<ICategory | null>(null);
  //const [uploading, setUploading] = useState(false);

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

  // const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files || !category) return;
  //   const file = e.target.files[0];
  //   const formData = new FormData();
  //   formData.append("image", file);

  //   setUploading(true);
  //   try {
  //     await PortfolioService.uploadPortfolioFile(category.id, formData);
  //     await loadCategory();
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to upload file");
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  // const handleDeleteFile = async (fileId: number) => {
  //   if (!window.confirm("Delete this file?")) return;
  //   await PortfolioService.deletePortfolioFiles([fileId]);
  //   await loadCategory();
  // };

  // const canUpload = (category?.portfolioFiles?.length || 0) < 12;

  if (!category) return <p>Loading category...</p>;

  return (
    <div className="category-page">
      <h2>{category.categoryName}</h2>
      <p>Username: {username || currentUser?.username}</p>
      <p>{category.description || "No description"}</p>

      {/* {isOwnCategory && (
        <div>
          <label className="btn-upload">
            {uploading ? "Uploading..." : "Upload File"}
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={uploading || !canUpload}
            />
          </label>
          {!canUpload && <p>Maximum 12 images per category</p>}
        </div>
      )} */}

      <div className="gallery__grid">
        {category.portfolioFiles?.map((file: IPortfolioFile) => (
          <div key={file.id} className="gallery__item-container">
            <img
              src={`http://localhost:8080${file.path}`}
              alt={file.caption || file.fileName}
              className="gallery__item"
            />
            {/* {isOwnCategory && (
              <button onClick={() => handleDeleteFile(file.id)}>Delete</button>
            )} */}
          </div>
        ))}
      </div>

      {/* {isOwnCategory && (
        <Link to={`/profile/portfolio/category/${categoryId}/edit`}>
          Edit Category
        </Link>
      )} */}
    </div>
  );
};

export default CategoryPage;
