import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PortfolioService from "../services/portfolio.service";
import type { IPortfolio, ICategory } from "../types/portfolio.type";
import AuthContext from "../context/AuthContext";

const Portfolio: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { currentUser } = useContext(AuthContext);
  const isOwnPortfolio = !username || username === currentUser?.username;

  const [portfolio, setPortfolio] = useState<IPortfolio | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadPortfolio = async () => {
      setLoading(true);
      try {
        const data = isOwnPortfolio
          ? await PortfolioService.getMyPortfolio()
          : await PortfolioService.getPortfolio(username!);
        setPortfolio(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPortfolio();
  }, [username, isOwnPortfolio]);

  if (loading) return <p>Loading portfolio...</p>;

  if (!portfolio) {
    return (
      <div>
        <h2>No portfolio found</h2>
        {isOwnPortfolio ? (
          <button onClick={() => navigate("/profile/portfolio/edit")}>
            Create Your Portfolio
          </button>
        ) : (
          <p>This user has no portfolio</p>
        )}
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      {isOwnPortfolio && (
        <div className="profile__edit-icon">
          <Link to="/profile/portfolio/edit">
            <span className="material-symbols-outlined">edit</span>
          </Link>
        </div>
      )}
      <h2>{portfolio.title}</h2>
      <p>Username:{username || currentUser?.username}</p>
      <p>{portfolio.description || "No description"}</p>

      <h3>Categories:</h3>
      <ul>
        {isOwnPortfolio &&
          portfolio.categories?.map((cat: ICategory) => (
            <li key={cat.id}>
              <Link to={`/profile/portfolio/category/${cat.id}`}>
                {cat.categoryName}
              </Link>
            </li>
          ))}
        {!isOwnPortfolio &&
          portfolio.categories?.map((cat: ICategory) => (
            <li key={cat.id}>
              <Link to={`/profile/${username}/portfolio/category/${cat.id}`}>
                {cat.categoryName}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Portfolio;
