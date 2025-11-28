/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import searchService from "../services/search.service";
import type { IGalleryFile } from "../types/gallery.type";
import type { IUser } from "../types/user.type";
import type { IPortfolio } from "../types/portfolio.type";
import GalleryItem from "./GalleryItem";
import type { ISearchResponse } from "../types/search.type";

type ModalItem = {
  user: IUser;
  file: IGalleryFile;
};

type SearchTab = "All" | "Users" | "Portfolios" | "Gallery";

function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  const [query, setQuery] = useState(initialQuery);
  const [users, setUsers] = useState<IUser[]>([]);
  const [portfolios, setPortfolios] = useState<IPortfolio[]>([]);
  const [gallery, setGallery] = useState<IGalleryFile[]>([]);
  const [modalItem, setModalItem] = useState<ModalItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTab, setSearchTab] = useState<SearchTab>("All");

  const runSearch = async (q: string) => {
    setLoading(true);
    try {
      const response: ISearchResponse = await searchService.searchEverything(q);

      const mappedPortfolios: IPortfolio[] = response.portfolios.map((p) => ({
        ...p,
        user: p.user,
      }));

      setUsers(response.users);
      setPortfolios(mappedPortfolios);
      setGallery(response.gallery);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) runSearch(initialQuery);
  }, [initialQuery]);

  const handleSearch = () => {
    const q = query.trim() === "" ? "*" : query;
    navigate(`/search?query=${encodeURIComponent(q)}`);
    runSearch(q);
  };
  if (loading)
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle
          fill="#DC7A34"
          stroke="#DC7A34"
          stroke-width="2"
          r="15"
          cx="40"
          cy="65"
        >
          <animate
            attributeName="cy"
            calcMode="spline"
            dur="2"
            values="65;135;65;"
            keySplines=".5 0 .5 1;.5 0 .5 1"
            repeatCount="indefinite"
            begin="-.4"
          ></animate>
        </circle>
        <circle
          fill="#DC7A34"
          stroke="#DC7A34"
          stroke-width="2"
          r="15"
          cx="100"
          cy="65"
        >
          <animate
            attributeName="cy"
            calcMode="spline"
            dur="2"
            values="65;135;65;"
            keySplines=".5 0 .5 1;.5 0 .5 1"
            repeatCount="indefinite"
            begin="-.2"
          ></animate>
        </circle>
        <circle
          fill="#DC7A34"
          stroke="#DC7A34"
          stroke-width="2"
          r="15"
          cx="160"
          cy="65"
        >
          <animate
            attributeName="cy"
            calcMode="spline"
            dur="2"
            values="65;135;65;"
            keySplines=".5 0 .5 1;.5 0 .5 1"
            repeatCount="indefinite"
            begin="0"
          ></animate>
        </circle>
      </svg>
    );

  return (
    <div className="search">
      <h2>Search</h2>

      <form
        className="search__bar"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <input
          type="text"
          placeholder="Search profiles, portfolios, or gallery..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search__input"
        />

        <button type="submit" className="search__btn">
          Search
        </button>
      </form>

      {loading}

      <div className="search__tabspace">
        {[
          {
            label: "All",
            count: users.length + portfolios.length + gallery.length,
          },
          { label: "Users", count: users.length },
          { label: "Portfolios", count: portfolios.length },
          { label: "Gallery", count: gallery.length },
        ].map((tab) => (
          <button
            key={tab.label}
            onClick={() => setSearchTab(tab.label as SearchTab)}
            className={`search__tab ${searchTab === tab.label ? "active" : ""}`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <aside className="page-content">
        {(searchTab === "All" || searchTab === "Users") && users.length > 0 && (
          <div className="search__info">
            {users.map((u) => (
              <Link
                key={u.id}
                to={`/profile/${u.username}`}
                className="feed__profile"
              >
                <img
                  src={
                    u.profilephoto
                      ? `http://localhost:8080/uploads/${u.profilephoto}`
                      : "/preview.png"
                  }
                  alt={u.username}
                  width={40}
                  height={40}
                  className="feed__profile-img"
                />
                <div>
                  <strong>{u.username}</strong>
                </div>
              </Link>
            ))}
          </div>
        )}
      </aside>
      <div className="page-content">
        {(searchTab === "All" || searchTab === "Portfolios") &&
          portfolios.length > 0 && (
            <div className="search__info">
              {portfolios.map((p) => (
                <Link
                  key={p.id}
                  to={`/profile/${p.user?.username}/portfolio`}
                  className="portfolio-link"
                >
                  <strong>{p.title || "Untitled Portfolio"}</strong>
                  <p className="truncate">
                    {p.description || "No description"}
                  </p>
                </Link>
              ))}
            </div>
          )}
      </div>
      <div className="page-content">
        {(searchTab === "All" || searchTab === "Gallery") &&
          gallery.length > 0 && (
            <div className="gallery__grid">
              {gallery.map((g) => (
                <div
                  key={g.id}
                  className="gallery__item-container"
                  onClick={() => {
                    if (!g.user)
                      return console.error("File has no user attached:", g);
                    setModalItem({ file: g, user: g.user });
                  }}
                >
                  <img
                    src={`http://localhost:8080${g.path}`}
                    alt={g.caption || "Gallery Image"}
                    className="gallery__item"
                  />
                </div>
              ))}
            </div>
          )}
      </div>
      {modalItem && (
        <div onClick={() => setModalItem(null)} className="modal">
          <div onClick={(e) => e.stopPropagation()} className="modal__content">
            <GalleryItem
              file={modalItem.file}
              user={modalItem.user}
              onDelete={() => {
                setGallery((prev) =>
                  prev.filter((f) => f.id !== modalItem.file.id)
                );
                setModalItem(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
