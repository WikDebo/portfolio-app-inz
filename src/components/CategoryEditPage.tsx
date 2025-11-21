/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PortfolioService from "../services/portfolio.service";
import type { IPortfolioFile } from "../types/portfolio.type";

const CategoryEditPage: React.FC = () => {
  const { categoryId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<IPortfolioFile[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const cat = await PortfolioService.getMyCategoryById(
          Number(categoryId)
        );
        setTitle(cat.categoryName);
        setDescription(cat.description || "");
        setFiles(cat.portfolioFiles || []);
      } catch (err: any) {
        console.error(err);
        setMessage("Failed to load category.");
      }
    };
    loadCategory();
  }, [categoryId]);

  const handleSave = async () => {
    try {
      await PortfolioService.editCategory(Number(categoryId), {
        categoryName: title,
        description,
      });
      alert("Category updated");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to update category");
    }
  };

  const canUpload = files.length < 12;

  const handleUpload = async () => {
    if (!file) return setMessage("Please select a file.");

    const formData = new FormData();
    //portfolio files
    formData.append("image", file);
    formData.append("caption", caption);

    try {
      setUploading(true);
      const response = await PortfolioService.uploadPortfolioFile(
        Number(categoryId),
        formData
      );
      //new file to top of gallery
      setFiles((prev) => [response.file, ...prev]);
      setFile(null);
      setCaption("");
      setMessage(response.message || "Upload successful!");
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.message || err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: number) => {
    if (!window.confirm("Delete this file?")) return;
    try {
      await PortfolioService.deletePortfolioFiles(fileId);
      const cat = await PortfolioService.getMyCategoryById(Number(categoryId));
      setFiles(cat.portfolioFiles || []);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to delete file");
    }
  };

  return (
    <div>
      <h2>Edit Category</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <label>
          Title:{" "}
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Description:{" "}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <button type="submit">Save Category</button>
      </form>

      {canUpload && (
        <div className="gallery__upload">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept="image/*"
          />
          <input
            type="text"
            placeholder="Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      )}
      {!canUpload && <p>Maximum 12 photos</p>}
      {message && <p className="gallery__message">{message}</p>}

      <div className="gallery__grid">
        {files.map((f) => (
          <div key={f.id} className="gallery__item-container">
            <img
              src={`http://localhost:8080${f.path}`}
              alt={f.caption || ""}
              className="gallery__item"
            />
            <button onClick={() => handleDeleteFile(f.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryEditPage;
