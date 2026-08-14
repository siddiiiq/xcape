import React, { useState } from "react";
import { X } from "lucide-react";

// Comma/Enter-delimited tag input backed by a plain string[] value.
const TagInput = ({ value = [], onChange, placeholder = "Add a tag and press Enter" }) => {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const tag = draft.trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setDraft("");
  };

  return (
    <div className="rounded-lg border border-line bg-white p-2">
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <span key={tag} className="flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs">
            {tag}
            <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))}>
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag();
            }
          }}
          onBlur={addTag}
          placeholder={value.length ? "" : placeholder}
          className="min-w-[120px] flex-1 border-none px-1 py-1 text-sm outline-none"
        />
      </div>
    </div>
  );
};

export default TagInput;
