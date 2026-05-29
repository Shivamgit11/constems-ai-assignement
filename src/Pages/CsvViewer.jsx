import { useState, useRef, useCallback } from "react";
import Papa from "papaparse";
import StatCard from "../Components/StatCard";
import ColumnFilter from "../Components/ColumnFilter";
import PgBtn from "../Components/PgBtn";

const PAGE_SIZE = 15;

const CsvViewere = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");

  const inputRef = useRef();

  const parseFile = (file) => {
    if (!file || !file.name.endsWith(".csv")) return;

    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data: rows, meta }) => {
        setColumns(meta.fields || []);
        setData(rows);
        setFilters({});
        setSortCol(null);
        setPage(1);
      },
    });
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    parseFile(e.dataTransfer.files[0]);
  }, []);

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }

    setPage(1);
  };

  const handleFilter = (col, vals) => {
    setFilters((f) => ({
      ...f,
      [col]: vals,
    }));

    setPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const hasFilters = Object.values(filters).some((v) => v?.length > 0);

  const activeCount = Object.values(filters).reduce(
    (a, v) => a + (v?.length || 0),
    0
  );

  const filtered = data.filter((row) =>
    columns.every((col) => {
      const f = filters[col];
      return !f?.length || f.includes(String(row[col] ?? ""));
    })
  );

  const sorted = sortCol
    ? [...filtered].sort((a, b) => {
        const av = a[sortCol] ?? "";
        const bv = b[sortCol] ?? "";

        const an = parseFloat(av);
        const bn = parseFloat(bv);

        const cmp =
          !isNaN(an) && !isNaN(bn)
            ? an - bn
            : String(av).localeCompare(String(bv));

        return sortDir === "asc" ? cmp : -cmp;
      })
    : filtered;

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  const paginated = sorted.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const pageNums = () => {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 3) {
      return [1, 2, 3, 4, "…", totalPages];
    }

    if (page >= totalPages - 2) {
      return [
        1,
        "…",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [1, "…", page - 1, page, page + 1, "…", totalPages];
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] px-8 py-10 font-[Poppins] text-[#B8CEDD]">
      {/* Header */}
      <div className="mb-9">
        <div className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-white">
          <span className="inline-block h-[2px] w-7 rounded bg-[#00C6FF]" />
          Constems-Csv Viewer
        </div>

        <h1 className="mb-2.5 text-[42px] font-extrabold leading-tight tracking-[-0.03em] text-!white">
          CSV Viewer
        </h1>

        <p className="text-base leading-7 text-[#B8CEDD]">
          Upload any CSV file to explore, filter by multiple values per
          column, and sort your data instantly.
        </p>
      </div>

      {/* Upload */}
      <div
        onClick={() => inputRef.current.click()}
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        className={`relative mb-7 cursor-pointer overflow-hidden rounded-[20px] border-2 border-dashed px-8 py-12 text-center transition-all ${
          dragging
            ? "border-[#00C6FF] bg-[rgba(0,198,255,0.06)]"
            : "border-[rgba(0,198,255,0.45)] bg-[#0D1526]"
        }`}
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,198,255,0.05)_0%,transparent_70%)]" />

        <div className="mb-3 text-[40px] leading-none text-[#00C6FF]">
          ⬆
        </div>

        <p className="mb-1.5 text-lg font-semibold text-white">
          {fileName ? `Loaded: ${fileName}` : "Drop your CSV file here"}
        </p>

        <p className="mb-5 text-sm text-[#6A8AA8]">
          Supports .csv files with header rows
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current.click();
          }}
          className="rounded-[10px] bg-gradient-to-br from-[#00C6FF] to-[#0072FF] px-7 py-3 text-sm font-bold tracking-[0.06em] text-white transition-opacity hover:opacity-90"
        >
          Browse File
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            parseFile(e.target.files[0]);
            e.target.value = "";
          }}
        />
      </div>

      {data.length > 0 && (
        <>
          {/* Stats */}
          <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3.5">
            <StatCard
              label="Total rows"
              value={data.length.toLocaleString()}
              accent
            />

            <StatCard label="Columns" value={columns.length} />

            <StatCard
              label="Filtered"
              value={filtered.length.toLocaleString()}
            />

            <StatCard label="Pages" value={totalPages} />
          </div>

          {/* Filters */}
          <div className="mb-6 rounded-[20px] border border-[rgba(0,198,255,0.18)] bg-[#0D1526] px-7 py-6">
            <div className="mb-[18px] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#00C6FF]">
                  Filter columns
                </span>

                {activeCount > 0 && (
                  <span className="rounded-[20px] bg-[#00C6FF] px-2.5 py-0.5 text-[11px] font-extrabold tracking-[0.04em] text-[#0A0F1E]">
                    {activeCount} active
                  </span>
                )}
              </div>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="rounded-lg border border-[rgba(0,198,255,0.45)] px-3.5 py-1.5 text-xs font-medium text-[#6A8AA8] transition-all hover:border-[#00C6FF] hover:text-white"
                >
                  ✕ Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3">
              {columns.map((col) => (
                <ColumnFilter
                  key={col}
                  col={col}
                  data={data}
                  selected={filters[col] || []}
                  onChange={(vals) => handleFilter(col, vals)}
                />
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-[20px] border border-[rgba(0,198,255,0.18)] bg-[#0D1526]">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr className="bg-[#060B16]">
                    {columns.map((col) => (
                      <th
                        key={col}
                        onClick={() => handleSort(col)}
                        className={`cursor-pointer select-none whitespace-nowrap border-b border-r border-[rgba(0,198,255,0.18)] px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.12em] transition-all ${
                          sortCol === col
                            ? "bg-[rgba(0,198,255,0.1)] text-white"
                            : "text-[rgba(0,198,255,0.65)] hover:bg-[rgba(255,255,255,0.04)]"
                        }`}
                      >
                        {col}

                        <span className="ml-1.5 text-[10px] opacity-45">
                          {sortCol === col
                            ? sortDir === "asc"
                              ? "↑"
                              : "↓"
                            : "↕"}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="p-12 text-center text-sm italic text-[#3A5570]"
                      >
                        No rows match your filters.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((row, ri) => (
                      <tr
                        key={ri}
                        className={`border-b border-[rgba(255,255,255,0.07)] transition-colors hover:bg-[rgba(0,198,255,0.06)] ${
                          ri % 2 === 1
                            ? "bg-[#111D35]"
                            : "bg-[#0D1526]"
                        }`}
                      >
                        {columns.map((col, ci) => (
                          <td
                            key={ci}
                            title={String(row[col] ?? "")}
                            className="max-w-[200px] overflow-hidden whitespace-nowrap border-r border-[rgba(255,255,255,0.07)] px-4 py-[11px] text-[13px] leading-relaxed text-[#B8CEDD] text-ellipsis"
                          >
                            {row[col] ?? ""}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-[rgba(0,198,255,0.18)] bg-[#060B16] px-5 py-3">
              <span className="text-[13px] font-medium text-[#6A8AA8]">
                {sorted.length === 0
                  ? "0 rows"
                  : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(
                      page * PAGE_SIZE,
                      sorted.length
                    )} of ${sorted.length.toLocaleString()} rows`}
              </span>

              <div className="flex items-center gap-1">
                <PgBtn
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ‹
                </PgBtn>

                {pageNums().map((n, i) =>
                  n === "…" ? (
                    <span
                      key={"e" + i}
                      className="px-1 text-xs text-[#3A5570]"
                    >
                      …
                    </span>
                  ) : (
                    <PgBtn
                      key={n}
                      onClick={() => setPage(n)}
                      active={page === n}
                    >
                      {n}
                    </PgBtn>
                  )
                )}

                <PgBtn
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={page === totalPages}
                >
                  ›
                </PgBtn>
              </div>
            </div>
          </div>
        </>
      )}

      {data.length === 0 && (
        <p className="mt-6 text-center text-sm italic leading-7 text-[#3A5570]">
          No data loaded yet — upload a CSV to get started.
        </p>
      )}
    </div>
  );
};

export default CsvViewere;