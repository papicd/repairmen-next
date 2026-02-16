"use client";

import React from "react";
import "./table.scss";

type Column<T> = {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  className?: string;
};

export default function Table<T>({
                                   columns,
                                   data,
                                   className = "",
                                 }: TableProps<T>) {
  return (
    <div className={`custom-table-wrapper ${className}`}>
      <table className="custom-table">
        <thead>
        <tr>
          {columns.map((column) => (
            <th key={String(column.key)}>{column.label}</th>
          ))}
        </tr>
        </thead>

        <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className="table__row">
            {columns.map((column) => (
              <td
                key={String(column.key)}
                className={`table__cell ${
                  column.align ? `table__cell--${column.align}` : ""
                }`}
              >
                {column.render
                  ? column.render(row)   // ✅ PASS WHOLE ROW
                  : (row[column.key] as React.ReactNode)}
              </td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
