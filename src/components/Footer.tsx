import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__left">
          <div className="col">
            <h1 className="footer-text" style={{ color: "var(--color-text)" }}>
              Artfolio
            </h1>
            <h1
              className="footer-text"
              style={{ color: "var(--color-dark-1)" }}
            >
              Artfolio
            </h1>
            <h1
              className="footer-text"
              style={{ color: "var(--color-dark-2)" }}
            >
              Artfolio
            </h1>
            <h1
              className="footer-text"
              style={{ color: "var(--color-dark-3)" }}
            >
              Artfolio
            </h1>
            <h1
              className="footer-text"
              style={{ color: "var(--color-dark-4)" }}
            >
              Artfolio
            </h1>
          </div>
        </div>
        <div className="footer__right">
          <div className="col">
            <ul>
              <li>
                <a>Contact us</a>
              </li>
              <li>
                <a>Our Services</a>
              </li>
              <li>
                <a>Privacy Policy</a>
              </li>
              <li>
                <a>Terms & Conditions</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        WIKTORIA © 2025 — All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
