import { useEffect, useRef, useState } from "react";
import layoutJson from "../data/data.json";
import Checkbox from "./checkbox";
const  ColumnFilter = ({ col, data, selected, onChange })  => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const uniqueVals = [
    ...new Set(data.map((r) => String(r[col] ?? "")).filter(Boolean)),
  ].sort((a, b) => {
    const an = parseFloat(a),
      bn = parseFloat(b);
    return !isNaN(an) && !isNaN(bn) ? an - bn : a.localeCompare(b);
  });

  const visible = uniqueVals.filter((v) =>
    v.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggle = (val) =>
    onChange(
      selected.includes(val)
        ? selected.filter((s) => s !== val)
        : [...selected, val],
    );

  const toggleAll = () => {
    if (visible.every((v) => selected.includes(v)))
      onChange(selected.filter((s) => !visible.includes(s)));
    else onChange([...new Set([...selected, ...visible])]);
  };

  const isActive = selected.length > 0;
  const allVis =
    visible.length > 0 && visible.every((v) => selected.includes(v));

  const chip = (bg, color, text) => (
    <span
      style={{
        background: bg,
        color,
        fontSize: 10,
        fontWeight: 700,
        borderRadius: 4,
        padding: "1px 7px",
        letterSpacing: "0.04em",
        flexShrink: 0,
      }}
    >
      {text}
    </span>
  );

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Label */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: layoutJson.textLabel,
          marginBottom: 5,
        }}
      >
        {col}
      </div>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 6,
          padding: "8px 12px",
          borderRadius: 10,
          fontSize: 13,
          fontFamily: layoutJson.fontMain,
          fontWeight: 400,
          cursor: "pointer",
          textAlign: "left",
          outline: "none",
          background: isActive
            ? "rgba(0,198,255,0.07)"
            : "rgba(255,255,255,0.04)",
          border: `1px solid ${isActive ? layoutJson.borderAct : layoutJson.border}`,
          color: isActive ? layoutJson.cyan : layoutJson.textBody,
          transition: "all 0.15s",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          {isActive ? (
            <>
              {chip(layoutJson.cyan, "#0A0F1E", selected.length)}
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: 12,
                }}
              >
                {selected.length === 1
                  ? selected[0]
                  : `${selected.length} values`}
              </span>
            </>
          ) : (
            <span style={{ color: layoutJson.textMuted, fontSize: 13 }}>
              All values…
            </span>
          )}
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            flexShrink: 0,
          }}
        >
          {isActive && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
              }}
              style={{
                color: layoutJson.textLabel,
                fontSize: 11,
                cursor: "pointer",
                lineHeight: 1,
                padding: "0 2px",
              }}
            >
              ✕
            </span>
          )}
          <span
            style={{
              color: layoutJson.textMuted,
              fontSize: 9,
              transition: "transform 0.15s",
              display: "inline-block",
              transform: open ? "rotate(180deg)" : "none",
            }}
          >
            ▾
          </span>
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            zIndex: 999,
            top: "calc(100% + 4px)",
            left: 0,
            width: "100%",
            minWidth: 190,
            background: "#080E1C",
            border: `1px solid ${layoutJson.borderAct}`,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow:
              "0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,198,255,0.06)",
          }}
        >
          {/* Search */}
          <div style={{ padding: 8, borderBottom: `1px solid ${layoutJson.borderSub}` }}>
            <input
              autoFocus
              type="text"
              placeholder="Search values…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "6px 10px",
                borderRadius: 8,
                fontSize: 12,
                fontFamily: layoutJson.fontMain,
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${layoutJson.border}`,
                color: layoutJson.textBody,
                outline: "none",
              }}
            />
          </div>

          {/* Select all row */}
          {visible.length > 0 && (
            <div
              onClick={toggleAll}
              style={{
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                fontSize: 12,
                fontStyle: "italic",
                color: layoutJson.textLabel,
                borderBottom: `1px solid ${layoutJson.borderSub}`,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <Checkbox checked={allVis} />
              <span>
                {allVis
                  ? "Deselect all"
                  : `Select all${search ? " matches" : ""}`}
              </span>
            </div>
          )}

          {/* Options */}
          <ul
            style={{
              maxHeight: 210,
              overflowY: "auto",
              margin: 0,
              padding: 0,
              listStyle: "none",
            }}
          >
            {visible.length === 0 ? (
              <li
                style={{
                  padding: "12px",
                  textAlign: "center",
                  color: layoutJson.textMuted,
                  fontSize: 12,
                  fontStyle: "italic",
                }}
              >
                No matches
              </li>
            ) : (
              visible.map((v) => {
                const checked = selected.includes(v);
                return (
                  <li
                    key={v}
                    onClick={() => toggle(v)}
                    title={v}
                    style={{
                      padding: "8px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      fontSize: 12,
                      fontFamily: layoutJson.fontMain,
                      color: checked ? layoutJson.cyan : layoutJson.textBody,
                      background: checked
                        ? "rgba(0,198,255,0.07)"
                        : "transparent",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => {
                      if (!checked)
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      if (!checked)
                        e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <Checkbox checked={checked} />
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {v}
                    </span>
                  </li>
                );
              })
            )}
          </ul>

          {/* Footer */}
          {isActive && (
            <div
              style={{
                padding: "7px 12px",
                borderTop: `1px solid ${layoutJson.borderSub}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 11, color: layoutJson.textMuted }}>
                {selected.length} / {uniqueVals.length} selected
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChange([]);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 11,
                  color: layoutJson.textLabel,
                  fontFamily: layoutJson.fontMain,
                  padding: 0,
                }}
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ColumnFilter;