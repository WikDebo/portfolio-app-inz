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
  //const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPortfolio = async () => {
      //setLoading(true);
      try {
        const data = isOwnPortfolio
          ? await PortfolioService.getMyPortfolio()
          : await PortfolioService.getPortfolio(username!);
        setPortfolio(data);
      } catch (err) {
        console.error(err);
      } finally {
        //setLoading(false);
      }
    };
    loadPortfolio();
  }, [username, isOwnPortfolio]);

  if (!portfolio) {
    return (
      <div>
        <div className="page-content">
          <h2>No portfolio found</h2>
          {isOwnPortfolio ? (
            <button
              className="save-btn"
              onClick={() => navigate("/profile/portfolio/edit")}
            >
              Create Your Portfolio
            </button>
          ) : (
            <p>This user has no portfolio</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio">
      <div className="portfolio__all">
        <div className="page-content">
          {isOwnPortfolio && (
            <div className="profile__edit-icon">
              <Link to="/profile/portfolio/edit">
                <i className="material-symbols-outlined">edit</i>
              </Link>
            </div>
          )}
          <div className="portfolio__intro">
            <h1>{portfolio.title}</h1>
            <h4 className="small">By {username || currentUser?.username}</h4>

            <p className="medium">{portfolio.description || ""}</p>
            <br></br>
            <h3>Projects</h3>
          </div>
          <div className="portfolio__categories">
            {isOwnPortfolio &&
              portfolio.categories?.map((cat: ICategory) => (
                <Link key={cat.id} to={`/profile/portfolio/category/${cat.id}`}>
                  <h3 key={cat.id} className="portfolio__categories-card">
                    {cat.categoryName}
                  </h3>
                </Link>
              ))}
            {!isOwnPortfolio &&
              portfolio.categories?.map((cat: ICategory) => (
                <h2 key={cat.id} className="portfolio__categories-card">
                  <Link
                    to={`/profile/${username}/portfolio/category/${cat.id}`}
                  >
                    {cat.categoryName}
                  </Link>
                </h2>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
