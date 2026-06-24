import React, { useRef, useState, useEffect } from "react";
import { Bold, Italic, List, ListOrdered, Quote, AlignLeft, AlignCenter, AlignRight, Link, Image as ImageIcon } from "lucide-react";

export default function RichTextEditor({ value, onChange, placeholder, onAddMedia }) {
  const [tab, setTab] = useState("visual"); // "visual" | "code"
  const editorRef = useRef(null);

  // Sync content from value to editorRef when tab is "visual"
  useEffect(() => {
    if (editorRef.current && tab === "visual") {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value, tab]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command, val = null) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleAddLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const handleParagraphFormat = (e) => {
    executeCommand("formatBlock", e.target.value);
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
      {/* Editor Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onAddMedia && (
            <button
              type="button"
              onClick={onAddMedia}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-650 hover:text-slate-800 text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-indigo-500" /> Add Media
            </button>
          )}
        </div>

        <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden p-0.5">
          <button
            type="button"
            onClick={() => setTab("visual")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              tab === "visual"
                ? "bg-indigo-50 text-indigo-600 font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Visual
          </button>
          <button
            type="button"
            onClick={() => setTab("code")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              tab === "code"
                ? "bg-indigo-50 text-indigo-600 font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Code
          </button>
        </div>
      </div>

      {/* Editor Toolbar (Only in visual tab) */}
      {tab === "visual" && (
        <div className="bg-slate-50/50 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-1">
          <select
            onChange={handleParagraphFormat}
            className="text-xs font-semibold text-slate-650 bg-white border border-slate-200 rounded-md px-2 py-1 focus:outline-hidden mr-1 cursor-pointer"
            defaultValue="p"
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="blockquote">Blockquote</option>
          </select>

          <span className="w-px h-4 bg-slate-200 mx-1"></span>

          <button
            type="button"
            onClick={() => executeCommand("bold")}
            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-650 hover:text-slate-800 transition-colors cursor-pointer"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => executeCommand("italic")}
            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-650 hover:text-slate-800 transition-colors cursor-pointer"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-slate-200 mx-1"></span>

          <button
            type="button"
            onClick={() => executeCommand("insertUnorderedList")}
            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-650 hover:text-slate-800 transition-colors cursor-pointer"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => executeCommand("insertOrderedList")}
            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-650 hover:text-slate-800 transition-colors cursor-pointer"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => executeCommand("formatBlock", "blockquote")}
            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-650 hover:text-slate-800 transition-colors cursor-pointer"
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-slate-200 mx-1"></span>

          <button
            type="button"
            onClick={() => executeCommand("justifyLeft")}
            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-650 hover:text-slate-800 transition-colors cursor-pointer"
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => executeCommand("justifyCenter")}
            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-650 hover:text-slate-800 transition-colors cursor-pointer"
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => executeCommand("justifyRight")}
            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-650 hover:text-slate-800 transition-colors cursor-pointer"
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-slate-200 mx-1"></span>

          <button
            type="button"
            onClick={handleAddLink}
            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-650 hover:text-slate-800 transition-colors cursor-pointer"
            title="Insert Link"
          >
            <Link className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editor Content Area */}
      <div className="relative">
        {tab === "visual" ? (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            className="w-full min-h-48 max-h-96 overflow-y-auto px-4 py-3 focus:outline-hidden text-sm prose prose-sm max-w-none text-slate-750"
            placeholder={placeholder}
            style={{ minHeight: "12rem" }}
          />
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-h-48 max-h-96 font-mono text-xs px-4 py-3 bg-slate-900 text-slate-100 focus:outline-hidden border-0"
            placeholder="HTML Code goes here..."
            style={{ minHeight: "12rem" }}
            rows={8}
          />
        )}
      </div>
    </div>
  );
}
