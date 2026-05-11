// ============================================================
// Header.js — App header with logo and tagline
// ============================================================

import React from "react";

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-logo">
          ✂️ <span className="logo-text">LinkSnip</span>
        </div>
        <p className="header-tagline">
          Paste a long URL. Get a short one. Share it anywhere.
        </p>
      </div>
    </header>
  );
}

export default Header;
