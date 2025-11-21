/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GalleryService from "../services/gallery.service";
import type { IGalleryFile } from "../types/gallery.type";
import type { IUser } from "../types/user.type";
import GalleryItem from "./GalleryItem";

const Gallery: React.FC = () => {
  const { username } = useParams();
  const isOwner = !username;

  const [files, setFiles] = useState<IGalleryFile[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState<{
    user: IUser;
    file: IGalleryFile;
  } | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = isOwner
          ? await GalleryService.getMyGalleryFiles()
          : await GalleryService.getUserGallery(username!);
        setFiles(data);
      } catch (err) {
        console.error("Gallery load error:", err);
        setMessage("Failed to load gallery files.");
      }
    };
    loadGallery();
  }, [username, isOwner]);

  const handleUpload = async () => {
    if (!file) return setMessage("Please select a file.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);

    try {
      setUploading(true);
      const response = await GalleryService.uploadGalleryFile(formData);
      setFiles([response.file, ...files]);
      setFile(null);
      setCaption("");
      setMessage(response.message || "Upload successful!");
    } catch (err: any) {
      setMessage(err.response?.data?.message || err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId: number) => {
    if (!window.confirm("Delete this file?")) return;

    try {
      await GalleryService.deleteGalleryFile(fileId);

      setFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileId));

      // Close modal if the deleted file is open
      if (selectedItem?.file.id === fileId) {
        setSelectedItem(null);
      }

      setMessage("File deleted successfully");
    } catch (err: any) {
      setMessage(err.response?.data?.message || err.message || "Delete failed");
    }
  };

  return (
    <div className="gallery">
      <h2 className="gallery__title">
        {isOwner ? "My Gallery" : `${username}'s Gallery`}
      </h2>

      {/* Upload modal? */}
      {isOwner && (
        <div className="gallery__upload">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
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

      {message && <p className="gallery__message">{message}</p>}

      {/* Gallery grid */}
      <div className="gallery__grid">
        {files.map((file) => (
          <div
            key={file.id}
            className="gallery__item-container"
            onClick={() => {
              if (!file.user) {
                console.error("File has no user attached:", file);
                return;
              }
              setSelectedItem({ file, user: file.user });
            }}
          >
            <img
              src={`http://localhost:8080${file.path}`}
              alt={file.caption || ""}
              className="gallery__item"
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="modal" onClick={() => setSelectedItem(null)}>
          <div className="modal__content" onClick={(e) => e.stopPropagation()}>
            <GalleryItem {...selectedItem} onDelete={handleDelete} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
