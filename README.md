CSV Viewer App

A modern and responsive CSV Viewer built with React, Tailwind CSS, and PapaParse.

This application allows users to:

Upload CSV files
View CSV data in a clean table
Filter data by column values
Sort columns ascending/descending
Paginate large datasets
Drag & drop CSV uploads
Explore dataset statistics instantly
Features
CSV Upload
Upload .csv files directly
Drag & drop support
Instant parsing using PapaParse
Data Table
Dynamic columns from CSV headers
Responsive table layout
Horizontal scrolling for large datasets
Filtering
Multi-select filtering per column
Active filter counter
Clear all filters functionality
Sorting
Ascending/Descending sorting
Supports:
Text sorting
Numeric sorting
Pagination
Efficient pagination
Page navigation controls
Displays row counts
UI
Dark modern dashboard style
Fully responsive
Tailwind CSS based styling
Tech Stack
React.js
Tailwind CSS
PapaParse
Folder Structure
src/
│
├── Components/
│   ├── ColumnFilter.jsx
│   ├── PgBtn.jsx
│   └── StatCard.jsx
│
├── Pages/
│   └── CsvViewere.jsx
│
├── App.jsx
└── main.jsx