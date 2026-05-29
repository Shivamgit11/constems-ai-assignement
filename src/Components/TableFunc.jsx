// import { useState, useRef, useCallback, useEffect } from "react";
// import Papa from "papaparse";

// // ─── Constems-AI Design Tokens (extracted from site visual inspection) ───────
// // Font:        Poppins (Google Fonts) — the site's primary typeface
// // Page bg:     #0A0F1E  (deepest navy)
// // Card bg:     #0D1526  (slightly lighter navy)
// // Card alt:    #111D35  (table row alt)
// // Border:      rgba(0,198,255,0.18)  /  rgba(0,198,255,0.35) active
// // Accent:      #00C6FF  (primary cyan)
// // Accent2:     #0072FF  (secondary blue for gradient CTAs)
// // Text H1:     #FFFFFF  48px / 700
// // Text H2:     #FFFFFF  32px / 600
// // Text H3:     #FFFFFF  22px / 600
// // Text body:   #B8CEDD  16px / 400  line-height 1.7
// // Text label:  #6A8AA8  12px / 500  uppercase tracking 0.15em
// // Text muted:  #3A5570  11px
// // Nav links:   #CBD9E8  14px / 500
// // Button text: #FFFFFF  14px / 700  letter-spacing 0.06em
// // Card padding: 24px 28px
// // Border-radius card: 16px  /  input: 10px  /  button: 8px
// // ─────────────────────────────────────────────────────────────────────────────

// const PAGE_SIZE = 15;

// const T = {
//   pageBg: "#0A0F1E",
//   cardBg: "#0D1526",
//   cardAlt: "#111D35",
//   cardHover: "rgba(0,198,255,0.06)",
//   border: "rgba(0,198,255,0.18)",
//   borderAct: "rgba(0,198,255,0.45)",
//   borderSub: "rgba(255,255,255,0.07)",
//   cyan: "#00C6FF",
//   cyanDim: "rgba(0,198,255,0.65)",
//   blue: "#0072FF",
//   textH: "#FFFFFF",
//   textBody: "#B8CEDD",
//   textLabel: "#6A8AA8",
//   textMuted: "#3A5570",
//   fontMain: "'Poppins', 'Segoe UI', sans-serif",
// };

// // ─── Multi-select searchable dropdown ────────────────────────────────────────
// function ColumnFilter({ col, data, selected, onChange }) {
//   const [search, setSearch] = useState("");
//   const [open, setOpen] = useState(false);
//   const ref = useRef();

//   const uniqueVals = [
//     ...new Set(data.map((r) => String(r[col] ?? "")).filter(Boolean)),
//   ].sort((a, b) => {
//     const an = parseFloat(a),
//       bn = parseFloat(b);
//     return !isNaN(an) && !isNaN(bn) ? an - bn : a.localeCompare(b);
//   });

//   const visible = uniqueVals.filter((v) =>
//     v.toLowerCase().includes(search.toLowerCase()),
//   );

//   useEffect(() => {
//     const h = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener("mousedown", h);
//     return () => document.removeEventListener("mousedown", h);
//   }, []);

//   const toggle = (val) =>
//     onChange(
//       selected.includes(val)
//         ? selected.filter((s) => s !== val)
//         : [...selected, val],
//     );

//   const toggleAll = () => {
//     if (visible.every((v) => selected.includes(v)))
//       onChange(selected.filter((s) => !visible.includes(s)));
//     else onChange([...new Set([...selected, ...visible])]);
//   };

//   const isActive = selected.length > 0;
//   const allVis =
//     visible.length > 0 && visible.every((v) => selected.includes(v));

//   const chip = (bg, color, text) => (
//     <span
//       style={{
//         background: bg,
//         color,
//         fontSize: 10,
//         fontWeight: 700,
//         borderRadius: 4,
//         padding: "1px 7px",
//         letterSpacing: "0.04em",
//         flexShrink: 0,
//       }}
//     >
//       {text}
//     </span>
//   );

//   return (
//     <div ref={ref} style={{ position: "relative" }}>
//       {/* Label */}
//       <div
//         style={{
//           fontSize: 11,
//           fontWeight: 600,
//           letterSpacing: "0.15em",
//           textTransform: "uppercase",
//           color: T.textLabel,
//           marginBottom: 5,
//         }}
//       >
//         {col}
//       </div>

//       {/* Trigger */}
//       <button
//         type="button"
//         onClick={() => setOpen((o) => !o)}
//         style={{
//           width: "100%",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           gap: 6,
//           padding: "8px 12px",
//           borderRadius: 10,
//           fontSize: 13,
//           fontFamily: T.fontMain,
//           fontWeight: 400,
//           cursor: "pointer",
//           textAlign: "left",
//           outline: "none",
//           background: isActive
//             ? "rgba(0,198,255,0.07)"
//             : "rgba(255,255,255,0.04)",
//           border: `1px solid ${isActive ? T.borderAct : T.border}`,
//           color: isActive ? T.cyan : T.textBody,
//           transition: "all 0.15s",
//         }}
//       >
//         <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 6,
//             minWidth: 0,
//             overflow: "hidden",
//           }}
//         >
//           {isActive ? (
//             <>
//               {chip(T.cyan, "#0A0F1E", selected.length)}
//               <span
//                 style={{
//                   overflow: "hidden",
//                   textOverflow: "ellipsis",
//                   whiteSpace: "nowrap",
//                   fontSize: 12,
//                 }}
//               >
//                 {selected.length === 1
//                   ? selected[0]
//                   : `${selected.length} values`}
//               </span>
//             </>
//           ) : (
//             <span style={{ color: T.textMuted, fontSize: 13 }}>
//               All values…
//             </span>
//           )}
//         </span>
//         <span
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 4,
//             flexShrink: 0,
//           }}
//         >
//           {isActive && (
//             <span
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onChange([]);
//               }}
//               style={{
//                 color: T.textLabel,
//                 fontSize: 11,
//                 cursor: "pointer",
//                 lineHeight: 1,
//                 padding: "0 2px",
//               }}
//             >
//               ✕
//             </span>
//           )}
//           <span
//             style={{
//               color: T.textMuted,
//               fontSize: 9,
//               transition: "transform 0.15s",
//               display: "inline-block",
//               transform: open ? "rotate(180deg)" : "none",
//             }}
//           >
//             ▾
//           </span>
//         </span>
//       </button>

//       {/* Dropdown */}
//       {open && (
//         <div
//           style={{
//             position: "absolute",
//             zIndex: 999,
//             top: "calc(100% + 4px)",
//             left: 0,
//             width: "100%",
//             minWidth: 190,
//             background: "#080E1C",
//             border: `1px solid ${T.borderAct}`,
//             borderRadius: 12,
//             overflow: "hidden",
//             boxShadow:
//               "0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,198,255,0.06)",
//           }}
//         >
//           {/* Search */}
//           <div style={{ padding: 8, borderBottom: `1px solid ${T.borderSub}` }}>
//             <input
//               autoFocus
//               type="text"
//               placeholder="Search values…"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 width: "100%",
//                 boxSizing: "border-box",
//                 padding: "6px 10px",
//                 borderRadius: 8,
//                 fontSize: 12,
//                 fontFamily: T.fontMain,
//                 background: "rgba(255,255,255,0.05)",
//                 border: `1px solid ${T.border}`,
//                 color: T.textBody,
//                 outline: "none",
//               }}
//             />
//           </div>

//           {/* Select all row */}
//           {visible.length > 0 && (
//             <div
//               onClick={toggleAll}
//               style={{
//                 padding: "8px 12px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 8,
//                 cursor: "pointer",
//                 fontSize: 12,
//                 fontStyle: "italic",
//                 color: T.textLabel,
//                 borderBottom: `1px solid ${T.borderSub}`,
//               }}
//               onMouseEnter={(e) =>
//                 (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
//               }
//               onMouseLeave={(e) =>
//                 (e.currentTarget.style.background = "transparent")
//               }
//             >
//               <Checkbox checked={allVis} />
//               <span>
//                 {allVis
//                   ? "Deselect all"
//                   : `Select all${search ? " matches" : ""}`}
//               </span>
//             </div>
//           )}

//           {/* Options */}
//           <ul
//             style={{
//               maxHeight: 210,
//               overflowY: "auto",
//               margin: 0,
//               padding: 0,
//               listStyle: "none",
//             }}
//           >
//             {visible.length === 0 ? (
//               <li
//                 style={{
//                   padding: "12px",
//                   textAlign: "center",
//                   color: T.textMuted,
//                   fontSize: 12,
//                   fontStyle: "italic",
//                 }}
//               >
//                 No matches
//               </li>
//             ) : (
//               visible.map((v) => {
//                 const checked = selected.includes(v);
//                 return (
//                   <li
//                     key={v}
//                     onClick={() => toggle(v)}
//                     title={v}
//                     style={{
//                       padding: "8px 12px",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 8,
//                       cursor: "pointer",
//                       fontSize: 12,
//                       fontFamily: T.fontMain,
//                       color: checked ? T.cyan : T.textBody,
//                       background: checked
//                         ? "rgba(0,198,255,0.07)"
//                         : "transparent",
//                       transition: "background 0.1s",
//                     }}
//                     onMouseEnter={(e) => {
//                       if (!checked)
//                         e.currentTarget.style.background =
//                           "rgba(255,255,255,0.04)";
//                     }}
//                     onMouseLeave={(e) => {
//                       if (!checked)
//                         e.currentTarget.style.background = "transparent";
//                     }}
//                   >
//                     <Checkbox checked={checked} />
//                     <span
//                       style={{
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       {v}
//                     </span>
//                   </li>
//                 );
//               })
//             )}
//           </ul>

//           {/* Footer */}
//           {isActive && (
//             <div
//               style={{
//                 padding: "7px 12px",
//                 borderTop: `1px solid ${T.borderSub}`,
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <span style={{ fontSize: 11, color: T.textMuted }}>
//                 {selected.length} / {uniqueVals.length} selected
//               </span>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onChange([]);
//                 }}
//                 style={{
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                   fontSize: 11,
//                   color: T.textLabel,
//                   fontFamily: T.fontMain,
//                   padding: 0,
//                 }}
//               >
//                 Clear
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// function Checkbox({ checked }) {
//   return (
//     <span
//       style={{
//         width: 15,
//         height: 15,
//         borderRadius: 4,
//         flexShrink: 0,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         background: checked ? T.cyan : "transparent",
//         border: `1.5px solid ${checked ? T.cyan : T.textMuted}`,
//         transition: "all 0.12s",
//       }}
//     >
//       {checked && (
//         <span
//           style={{
//             color: "#0A0F1E",
//             fontSize: 9,
//             fontWeight: 900,
//             lineHeight: 1,
//           }}
//         >
//           ✓
//         </span>
//       )}
//     </span>
//   );
// }

// // ─── Stat card ────────────────────────────────────────────────────────────────
// function StatCard({ label, value, accent }) {
//   return (
//     <div
//       style={{
//         background: T.cardBg,
//         border: `1px solid ${T.border}`,
//         borderRadius: 16,
//         padding: "20px 24px",
//         borderTop: accent ? `2px solid ${T.cyan}` : `1px solid ${T.border}`,
//       }}
//     >
//       <div
//         style={{
//           fontSize: 11,
//           fontWeight: 600,
//           letterSpacing: "0.15em",
//           textTransform: "uppercase",
//           color: T.textLabel,
//           marginBottom: 8,
//         }}
//       >
//         {label}
//       </div>
//       <div
//         style={{
//           fontSize: 28,
//           fontWeight: 700,
//           color: T.textH,
//           letterSpacing: "-0.02em",
//           lineHeight: 1,
//         }}
//       >
//         {value}
//       </div>
//     </div>
//   );
// }

// // ─── Main ─────────────────────────────────────────────────────────────────────
// export default function TableFunction() {
//   const [data, setData] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [filters, setFilters] = useState({});
//   const [sortCol, setSortCol] = useState(null);
//   const [sortDir, setSortDir] = useState("asc");
//   const [page, setPage] = useState(1);
//   const [dragging, setDragging] = useState(false);
//   const [fileName, setFileName] = useState("");
//   const inputRef = useRef();

//   const parseFile = (file) => {
//     if (!file || !file.name.endsWith(".csv")) return;
//     setFileName(file.name);
//     Papa.parse(file, {
//       header: true,
//       skipEmptyLines: true,
//       complete: ({ data: rows, meta }) => {
//         setColumns(meta.fields || []);
//         setData(rows);
//         setFilters({});
//         setSortCol(null);
//         setPage(1);
//       },
//     });
//   };

//   const onDrop = useCallback((e) => {
//     e.preventDefault();
//     setDragging(false);
//     parseFile(e.dataTransfer.files[0]);
//   }, []);

//   const handleSort = (col) => {
//     if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//     else {
//       setSortCol(col);
//       setSortDir("asc");
//     }
//     setPage(1);
//   };

//   const handleFilter = (col, vals) => {
//     setFilters((f) => ({ ...f, [col]: vals }));
//     setPage(1);
//   };

//   const clearFilters = () => {
//     setFilters({});
//     setPage(1);
//   };
//   const hasFilters = Object.values(filters).some((v) => v?.length > 0);
//   const activeCount = Object.values(filters).reduce(
//     (a, v) => a + (v?.length || 0),
//     0,
//   );

//   const filtered = data.filter((row) =>
//     columns.every((col) => {
//       const f = filters[col];
//       return !f?.length || f.includes(String(row[col] ?? ""));
//     }),
//   );

//   const sorted = sortCol
//     ? [...filtered].sort((a, b) => {
//         const av = a[sortCol] ?? "",
//           bv = b[sortCol] ?? "";
//         const an = parseFloat(av),
//           bn = parseFloat(bv);
//         const cmp =
//           !isNaN(an) && !isNaN(bn)
//             ? an - bn
//             : String(av).localeCompare(String(bv));
//         return sortDir === "asc" ? cmp : -cmp;
//       })
//     : filtered;

//   const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
//   const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   const pageNums = () => {
//     if (totalPages <= 6)
//       return Array.from({ length: totalPages }, (_, i) => i + 1);
//     if (page <= 3) return [1, 2, 3, 4, "…", totalPages];
//     if (page >= totalPages - 2)
//       return [
//         1,
//         "…",
//         totalPages - 3,
//         totalPages - 2,
//         totalPages - 1,
//         totalPages,
//       ];
//     return [1, "…", page - 1, page, page + 1, "…", totalPages];
//   };

//   return (
//     <>
//       {/* Google Fonts — Poppins */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         body { background: #0A0F1E; }
//         ::-webkit-scrollbar { width: 6px; height: 6px; }
//         ::-webkit-scrollbar-track { background: #0A0F1E; }
//         ::-webkit-scrollbar-thumb { background: rgba(0,198,255,0.3); border-radius: 3px; }
//         ::-webkit-scrollbar-thumb:hover { background: rgba(0,198,255,0.55); }
//         input::placeholder { color: #3A5570; }
//       `}</style>

//       <div
//         style={{
//           minHeight: "100vh",
//           background: T.pageBg,
//           fontFamily: T.fontMain,
//           padding: "40px 32px",
//           color: T.textBody,
//         }}
//       >
//         {/* ── Eyebrow + Title ── */}
//         <div style={{ marginBottom: 36 }}>
//           <div
//             style={{
//               fontSize: 12,
//               fontWeight: 600,
//               letterSpacing: "0.25em",
//               textTransform: "uppercase",
//               color: T.cyan,
//               marginBottom: 10,
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//             }}
//           >
//             <span
//               style={{
//                 display: "inline-block",
//                 width: 28,
//                 height: 2,
//                 background: T.cyan,
//                 borderRadius: 2,
//               }}
//             />
//             Constems-Csv Viewer
//           </div>
//           <h1
//             style={{
//               fontSize: 42,
//               fontWeight: 800,
//               color: T.textH,
//               letterSpacing: "-0.03em",
//               lineHeight: 1.1,
//               marginBottom: 10,
//             }}
//           >
//             CSV Viewer
//           </h1>
//           <p
//             style={{
//               fontSize: 16,
//               fontWeight: 400,
//               color: T.textBody,
//               lineHeight: 1.7,
//               maxWidth: 480,
//             }}
//           >
//             Upload any CSV file to explore, filter by multiple values per
//             column, and sort your data instantly.
//           </p>
//         </div>

//         {/* ── Drop zone ── */}
//         <div
//           onClick={() => inputRef.current.click()}
//           onDrop={onDrop}
//           onDragOver={(e) => {
//             e.preventDefault();
//             setDragging(true);
//           }}
//           onDragLeave={() => setDragging(false)}
//           style={{
//             border: `2px dashed ${dragging ? T.cyan : T.borderAct}`,
//             borderRadius: 20,
//             padding: "48px 32px",
//             textAlign: "center",
//             cursor: "pointer",
//             marginBottom: 28,
//             transition: "all 0.2s",
//             background: dragging ? "rgba(0,198,255,0.06)" : T.cardBg,
//             position: "relative",
//             overflow: "hidden",
//           }}
//         >
//           {/* subtle radial glow */}
//           <div
//             style={{
//               position: "absolute",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%,-50%)",
//               width: 300,
//               height: 300,
//               borderRadius: "50%",
//               background:
//                 "radial-gradient(circle, rgba(0,198,255,0.05) 0%, transparent 70%)",
//               pointerEvents: "none",
//             }}
//           />

//           <div
//             style={{
//               fontSize: 40,
//               color: T.cyan,
//               marginBottom: 12,
//               lineHeight: 1,
//             }}
//           >
//             ⬆
//           </div>
//           <p
//             style={{
//               fontSize: 18,
//               fontWeight: 600,
//               color: T.textH,
//               marginBottom: 6,
//             }}
//           >
//             {fileName ? `Loaded: ${fileName}` : "Drop your CSV file here"}
//           </p>
//           <p style={{ fontSize: 14, color: T.textLabel, marginBottom: 20 }}>
//             Supports .csv files with header rows
//           </p>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               inputRef.current.click();
//             }}
//             style={{
//               background: `linear-gradient(135deg, ${T.cyan}, ${T.blue})`,
//               color: "#fff",
//               border: "none",
//               borderRadius: 10,
//               padding: "11px 28px",
//               fontSize: 14,
//               fontWeight: 700,
//               letterSpacing: "0.06em",
//               cursor: "pointer",
//               fontFamily: T.fontMain,
//               transition: "opacity 0.15s",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
//             onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
//           >
//             Browse File
//           </button>
//           <input
//             ref={inputRef}
//             type="file"
//             accept=".csv"
//             style={{ display: "none" }}
//             onChange={(e) => {
//               parseFile(e.target.files[0]);
//               e.target.value = "";
//             }}
//           />
//         </div>

//         {data.length > 0 && (
//           <>
//             {/* ── Stats row ── */}
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
//                 gap: 14,
//                 marginBottom: 24,
//               }}
//             >
//               <StatCard
//                 label="Total rows"
//                 value={data.length.toLocaleString()}
//                 accent
//               />
//               <StatCard label="Columns" value={columns.length} />
//               <StatCard
//                 label="Filtered"
//                 value={filtered.length.toLocaleString()}
//               />
//               <StatCard label="Pages" value={totalPages} />
//             </div>

//             {/* ── Filter panel ── */}
//             <div
//               style={{
//                 background: T.cardBg,
//                 border: `1px solid ${T.border}`,
//                 borderRadius: 20,
//                 padding: "24px 28px",
//                 marginBottom: 24,
//               }}
//             >
//               {/* Header */}
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   marginBottom: 18,
//                 }}
//               >
//                 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                   <span
//                     style={{
//                       fontSize: 13,
//                       fontWeight: 700,
//                       letterSpacing: "0.12em",
//                       textTransform: "uppercase",
//                       color: T.cyan,
//                     }}
//                   >
//                     Filter columns
//                   </span>
//                   {activeCount > 0 && (
//                     <span
//                       style={{
//                         background: T.cyan,
//                         color: "#0A0F1E",
//                         fontSize: 11,
//                         fontWeight: 800,
//                         borderRadius: 20,
//                         padding: "2px 10px",
//                         letterSpacing: "0.04em",
//                       }}
//                     >
//                       {activeCount} active
//                     </span>
//                   )}
//                 </div>
//                 {hasFilters && (
//                   <button
//                     onClick={clearFilters}
//                     style={{
//                       background: "transparent",
//                       border: `1px solid ${T.borderAct}`,
//                       borderRadius: 8,
//                       padding: "5px 14px",
//                       fontSize: 12,
//                       cursor: "pointer",
//                       color: T.textLabel,
//                       fontFamily: T.fontMain,
//                       fontWeight: 500,
//                       transition: "all 0.15s",
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.color = T.textH;
//                       e.currentTarget.style.borderColor = T.cyan;
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.color = T.textLabel;
//                       e.currentTarget.style.borderColor = T.borderAct;
//                     }}
//                   >
//                     ✕ Clear all
//                   </button>
//                 )}
//               </div>

//               {/* Grid of dropdowns */}
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
//                   gap: 12,
//                 }}
//               >
//                 {columns.map((col) => (
//                   <ColumnFilter
//                     key={col}
//                     col={col}
//                     data={data}
//                     selected={filters[col] || []}
//                     onChange={(vals) => handleFilter(col, vals)}
//                   />
//                 ))}
//               </div>

//               {/* Active tags */}
//               {hasFilters && (
//                 <div
//                   style={{
//                     marginTop: 16,
//                     display: "flex",
//                     flexWrap: "wrap",
//                     gap: 8,
//                   }}
//                 >
//                   {columns.flatMap((col) =>
//                     (filters[col] || []).map((val) => (
//                       <span
//                         key={`${col}:${val}`}
//                         style={{
//                           display: "inline-flex",
//                           alignItems: "center",
//                           gap: 6,
//                           background: "rgba(0,198,255,0.08)",
//                           border: `1px solid ${T.borderAct}`,
//                           borderRadius: 8,
//                           padding: "4px 10px",
//                           fontSize: 12,
//                           fontWeight: 400,
//                         }}
//                       >
//                         <span style={{ color: T.textMuted, fontSize: 11 }}>
//                           {col}:
//                         </span>
//                         <span
//                           style={{
//                             color: T.cyan,
//                             fontWeight: 600,
//                             maxWidth: 120,
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           {val}
//                         </span>
//                         <button
//                           onClick={() =>
//                             handleFilter(
//                               col,
//                               (filters[col] || []).filter((v) => v !== val),
//                             )
//                           }
//                           style={{
//                             background: "none",
//                             border: "none",
//                             cursor: "pointer",
//                             color: T.textMuted,
//                             padding: 0,
//                             lineHeight: 1,
//                             fontSize: 12,
//                             fontFamily: T.fontMain,
//                           }}
//                         >
//                           ✕
//                         </button>
//                       </span>
//                     )),
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* ── Table ── */}
//             <div
//               style={{
//                 background: T.cardBg,
//                 border: `1px solid ${T.border}`,
//                 borderRadius: 20,
//                 overflow: "hidden",
//               }}
//             >
//               <div style={{ overflowX: "auto" }}>
//                 <table
//                   style={{
//                     width: "100%",
//                     borderCollapse: "collapse",
//                     fontSize: 13,
//                     fontFamily: T.fontMain,
//                   }}
//                 >
//                   <thead>
//                     <tr style={{ background: "#060B16" }}>
//                       {columns.map((col) => (
//                         <th
//                           key={col}
//                           onClick={() => handleSort(col)}
//                           style={{
//                             padding: "12px 16px",
//                             textAlign: "left",
//                             fontSize: 11,
//                             fontWeight: 700,
//                             letterSpacing: "0.12em",
//                             textTransform: "uppercase",
//                             whiteSpace: "nowrap",
//                             cursor: "pointer",
//                             userSelect: "none",
//                             borderRight: `1px solid ${T.borderSub}`,
//                             borderBottom: `1px solid ${T.border}`,
//                             color: sortCol === col ? T.textH : T.cyanDim,
//                             background:
//                               sortCol === col
//                                 ? "rgba(0,198,255,0.1)"
//                                 : "transparent",
//                             transition: "all 0.15s",
//                           }}
//                           onMouseEnter={(e) => {
//                             if (sortCol !== col)
//                               e.currentTarget.style.background =
//                                 "rgba(255,255,255,0.04)";
//                           }}
//                           onMouseLeave={(e) => {
//                             if (sortCol !== col)
//                               e.currentTarget.style.background = "transparent";
//                           }}
//                         >
//                           {col}
//                           <span
//                             style={{
//                               marginLeft: 5,
//                               opacity: 0.45,
//                               fontSize: 10,
//                             }}
//                           >
//                             {sortCol === col
//                               ? sortDir === "asc"
//                                 ? "↑"
//                                 : "↓"
//                               : "↕"}
//                           </span>
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {paginated.length === 0 ? (
//                       <tr>
//                         <td
//                           colSpan={columns.length}
//                           style={{
//                             padding: "3rem",
//                             textAlign: "center",
//                             color: T.textMuted,
//                             fontSize: 14,
//                             fontStyle: "italic",
//                           }}
//                         >
//                           No rows match your filters.
//                         </td>
//                       </tr>
//                     ) : (
//                       paginated.map((row, ri) => (
//                         <tr
//                           key={ri}
//                           style={{
//                             background: ri % 2 === 1 ? T.cardAlt : T.cardBg,
//                             borderBottom: `1px solid ${T.borderSub}`,
//                             transition: "background 0.1s",
//                           }}
//                           onMouseEnter={(e) =>
//                             (e.currentTarget.style.background = T.cardHover)
//                           }
//                           onMouseLeave={(e) =>
//                             (e.currentTarget.style.background =
//                               ri % 2 === 1 ? T.cardAlt : T.cardBg)
//                           }
//                         >
//                           {columns.map((col, ci) => (
//                             <td
//                               key={ci}
//                               title={String(row[col] ?? "")}
//                               style={{
//                                 padding: "11px 16px",
//                                 fontSize: 13,
//                                 fontWeight: 400,
//                                 color: T.textBody,
//                                 lineHeight: 1.5,
//                                 maxWidth: 200,
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                                 whiteSpace: "nowrap",
//                                 borderRight: `1px solid ${T.borderSub}`,
//                               }}
//                             >
//                               {row[col] ?? ""}
//                             </td>
//                           ))}
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination footer */}
//               <div
//                 style={{
//                   padding: "12px 20px",
//                   borderTop: `1px solid ${T.border}`,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   flexWrap: "wrap",
//                   gap: 10,
//                   background: "#060B16",
//                 }}
//               >
//                 <span
//                   style={{ fontSize: 13, color: T.textLabel, fontWeight: 500 }}
//                 >
//                   {sorted.length === 0
//                     ? "0 rows"
//                     : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, sorted.length)} of ${sorted.length.toLocaleString()} rows`}
//                 </span>
//                 <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//                   {/* Prev */}
//                   <PgBtn
//                     onClick={() => setPage((p) => Math.max(1, p - 1))}
//                     disabled={page === 1}
//                   >
//                     ‹
//                   </PgBtn>
//                   {pageNums().map((n, i) =>
//                     n === "…" ? (
//                       <span
//                         key={"e" + i}
//                         style={{
//                           color: T.textMuted,
//                           fontSize: 12,
//                           padding: "0 3px",
//                         }}
//                       >
//                         …
//                       </span>
//                     ) : (
//                       <PgBtn
//                         key={n}
//                         onClick={() => setPage(n)}
//                         active={page === n}
//                       >
//                         {n}
//                       </PgBtn>
//                     ),
//                   )}
//                   {/* Next */}
//                   <PgBtn
//                     onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                     disabled={page === totalPages}
//                   >
//                     ›
//                   </PgBtn>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {data.length === 0 && (
//           <p
//             style={{
//               textAlign: "center",
//               color: T.textMuted,
//               fontStyle: "italic",
//               fontSize: 14,
//               marginTop: 24,
//               lineHeight: 1.7,
//             }}
//           >
//             No data loaded yet — upload a CSV to get started.
//           </p>
//         )}
//       </div>
//     </>
//   );
// }

// function PgBtn({ children, onClick, disabled, active }) {
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       style={{
//         width: 30,
//         height: 30,
//         borderRadius: 8,
//         border: `1px solid ${active ? T.cyan : T.borderAct}`,
//         background: active ? "rgba(0,198,255,0.18)" : "transparent",
//         color: active ? T.cyan : T.textLabel,
//         fontSize: 13,
//         fontWeight: active ? 700 : 400,
//         fontFamily: T.fontMain,
//         cursor: disabled ? "default" : "pointer",
//         opacity: disabled ? 0.28 : 1,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         transition: "all 0.12s",
//       }}
//     >
//       {children}
//     </button>
//   );
// }
