import React, { useState } from "react";
import "./progress.css";
import { useAlert } from "../../Alert/Alert";

export default function Progress({ onClose }) {
  const [formData, setFormData] = useState({
    category: "DSA Mastery",
    note: "",
    links: [""],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { showAlert, AlertComponent } = useAlert();

  const categories = [
    "DSA Mastery",
    "System Design",
    "Advanced Backend",
    "DBMS Advanced",
    "Operating System",
    "OOPs Advanced",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLinkChange = (index, value) => {
    setFormData((prev) => {
      const newLinks = [...prev.links];
      newLinks[index] = value;
      return { ...prev, links: newLinks };
    });
  };

  const addLinkField = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, ""],
    }));
  };

  const removeLinkField = (index) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        category: formData.category,
        status: 1,
        note: formData.note,
        record: formData.links.filter((link) => link.trim() !== ""),
      };

      const res = await fetch(
        `${process.env.REACT_APP_BASE_API}/api/progress`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Something went wrong");

      showAlert(result.message, result.status);
      setFormData({ category: "DSA Mastery", note: "", links: [""] });
      if (onClose) onClose(); // form close karne ke liye parent ko inform karega
    } catch (err) {
      setError(err.message || "Failed to save progress");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="progress-form-overlay">
      <AlertComponent />
      <div className="progress-form-container">
        <h2>Add Progress Entry</h2>

        {error && <div className="progress-form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="progress-form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="progress-form-group">
            <label htmlFor="note">Notes</label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="What did you work on today?"
              rows={4}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="progress-form-group">
            <label>Resources/Links</label>
            {formData.links.map((link, index) => (
              <div key={index} className="progress-form-link-group">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  placeholder="https://example.com"
                  disabled={isSubmitting}
                  required
                />
                {formData.links.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLinkField(index)}
                    disabled={isSubmitting}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addLinkField} disabled={isSubmitting}>
              + Add Another Link
            </button>
          </div>

          <div className="progress-form-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Progress"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}