// ============================================================
// ShortenForm.js — The main input form for shortening a URL
//
// User pastes a long URL → clicks "Shorten" → backend creates
// a short code → we show the result with a "Copy" button
// ============================================================

import React, { useState } from "react";

// Props:
//   onNewUrl — function in App.js, called with the new URL object
//   apiUrl   — "/api/urls"
function ShortenForm({ onNewUrl, apiUrl }) {
  const [input, setInput]     = useState("");     // the URL the user typed
  const [result, setResult]   = useState(null);   // the created URL object
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [copied, setCopied]   = useState(false);  // shows "Copied!" feedback

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setCopied(false);

    const trimmed = input.trim();
    if (!trimmed) {
      setError("Please paste a URL first.");
      return;
    }

    setLoading(true);

    try {
      const res  = await fetch(apiUrl, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ originalUrl: trimmed }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      setResult(data);      // show the result card below the form
      onNewUrl(data);       // tell App.js to add it to the table
      setInput("");         // clear the input

    } catch (err) {
      setError("Cannot connect to the server. Is the backend running on port 5000?");
    } finally {
      setLoading(false);
    }
  };

  // ── Copy short URL to clipboard ────────────────────────────
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      // Reset the "Copied!" text after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support clipboard API
      alert(`Short URL: ${result.shortUrl}`);
    }
  };

  return (
    <section className="shorten-section">
      {/* Input form */}
      <form className="shorten-form" onSubmit={handleSubmit}>
        <input
          className="url-input"
          type="text"
          placeholder="Paste your long URL here... e.g. https://www.example.com/very/long/path"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="shorten-btn" type="submit" disabled={loading}>
          {loading ? "Shortening..." : "✂️ Shorten"}
        </button>
      </form>

      {/* Error message */}
      {error && <p className="form-error">⚠️ {error}</p>}

      {/* Result card — shown after successful shortening */}
      {result && (
        <div className="result-card">
          <div className="result-left">
            <p className="result-label">Your short link is ready:</p>
            {/* Clicking the short URL opens it in a new tab */}
            <a
              className="result-link"
              href={result.shortUrl}
              target="_blank"
              rel="noreferrer"
            >
              {result.shortUrl}
            </a>
            <p className="result-original">
              Original: <span>{result.originalUrl}</span>
            </p>
          </div>
          <button
            className={`copy-btn ${copied ? "copied" : ""}`}
            onClick={handleCopy}
          >
            {copied ? "✅ Copied!" : "📋 Copy"}
          </button>
        </div>
      )}
    </section>
  );
}

export default ShortenForm;
