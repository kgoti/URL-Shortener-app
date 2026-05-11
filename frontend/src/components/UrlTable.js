// ============================================================
// UrlTable.js — Table showing all shortened URLs with stats
//
// Columns: Original URL | Short URL | Clicks | Created | Delete
//
// If there are no URLs yet, shows an empty state message.
// ============================================================

import React, { useState } from "react";

// Format "2025-04-29T10:30:00.000Z" → "29 Apr 2025"
const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });

// Shorten a long URL for display in the table
// e.g. "https://www.example.com/very/long/path?q=123" → "https://www.example.com/very/lon..."
const truncate = (str, max = 50) =>
  str.length > max ? str.slice(0, max) + "..." : str;

// Props:
//   urls     — array of URL objects from MongoDB
//   onDelete — function to delete a URL by _id
function UrlTable({ urls, onDelete }) {
  // Track which short URL was just copied (to show feedback)
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url.shortUrl);
      setCopiedId(url._id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      alert(`Short URL: ${url.shortUrl}`);
    }
  };

  // ── Empty state ────────────────────────────────────────────
  if (urls.length === 0) {
    return (
      <div className="empty-table">
        <span className="empty-icon">🔗</span>
        <p>No links shortened yet.</p>
        <p className="empty-sub">Paste a URL above to get started!</p>
      </div>
    );
  }

  // ── Table ──────────────────────────────────────────────────
  return (
    <div className="table-wrapper">
      <table className="url-table">
        <thead>
          <tr>
            <th>Original URL</th>
            <th>Short URL</th>
            <th>Clicks</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr key={url._id}>
              {/* Original URL — truncated with full URL in title tooltip */}
              <td className="td-original" title={url.originalUrl}>
                <a href={url.originalUrl} target="_blank" rel="noreferrer">
                  {truncate(url.originalUrl)}
                </a>
              </td>

              {/* Short URL */}
              <td className="td-short">
                <a href={url.shortUrl} target="_blank" rel="noreferrer">
                  {url.shortUrl}
                </a>
              </td>

              {/* Click count */}
              <td className="td-clicks">
                <span className="click-badge">{url.clicks}</span>
              </td>

              {/* Creation date */}
              <td className="td-date">{formatDate(url.createdAt)}</td>

              {/* Copy and Delete buttons */}
              <td className="td-actions">
                <button
                  className={`action-btn copy-action ${copiedId === url._id ? "copied" : ""}`}
                  onClick={() => handleCopy(url)}
                  title="Copy short URL"
                >
                  {copiedId === url._id ? "✅" : "📋"}
                </button>
                <button
                  className="action-btn delete-action"
                  onClick={() => onDelete(url._id)}
                  title="Delete this link"
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UrlTable;
