// ============================================================
// App.js — Root component of the URL Shortener app
//
// Manages the list of all shortened URLs in state.
// Passes down functions to child components for creating
// and deleting URLs.
// ============================================================

import React, { useState, useEffect } from "react";
import ShortenForm from "./components/ShortenForm";
import UrlTable    from "./components/UrlTable";
import Header      from "./components/Header";

const API = "/api/urls";

function App() {
  const [urls, setUrls]       = useState([]);   // all shortened URLs from the DB
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // ── Fetch all URLs when the app first loads ────────────────
  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const res  = await fetch(API);
      const data = await res.json();
      setUrls(data);
    } catch (err) {
      setError("Could not connect to the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  // ── Called by ShortenForm after a successful POST ──────────
  // Adds the new URL to the top of the list without re-fetching
  const handleNewUrl = (newUrl) => {
    setUrls((prev) => {
      // If this URL already existed (backend returned existing), replace it
      const exists = prev.some((u) => u._id === newUrl._id);
      if (exists) return prev;
      return [newUrl, ...prev]; // add to top
    });
  };

  // ── Called when the delete button is clicked ───────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this short URL permanently?")) return;

    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      // Remove from state without re-fetching
      setUrls((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert("Could not delete the URL. Please try again.");
    }
  };

  return (
    <div className="app">
      <Header />

      <main className="main-container">
        {/* URL input form */}
        <ShortenForm onNewUrl={handleNewUrl} apiUrl={API} />

        {/* Divider */}
        <div className="divider">
          <span>Recent Links</span>
        </div>

        {/* Status messages */}
        {loading && <p className="status-msg">Loading your links...</p>}
        {error   && <p className="status-msg error">{error}</p>}

        {/* Table of all shortened URLs */}
        {!loading && !error && (
          <UrlTable urls={urls} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
}

export default App;
