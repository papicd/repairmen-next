"use client";

import React from "react";
import "./table.scss";

export type TableColumn<T> = {
  key: keyof T;
  label: string;
  align?: "left" | "center" | "right";
  width?: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  className?: string;
  onRowClick?: (row: T) => void; // ✅ NEW
  getRowKey?: (row: T) => string; // ✅ better keys
};

export default function Table<T>({
                                   columns,
                                   data,
                                   className = "",
                                   onRowClick,
                                   getRowKey,
                                 }: TableProps<T>) {
  return (
    <div className={`custom-table-wrapper ${className}`}>
      <table className="custom-table">
        <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={String(column.key)}
              style={{ width: column.width }}
            >
              {column.label}
            </th>
          ))}
        </tr>
        </thead>

        <tbody>
        {data.map((row, rowIndex) => {
          const key = getRowKey
            ? getRowKey(row)
            : rowIndex.toString();

          return (
            <tr
              key={key}
              className={`table__row ${
                onRowClick ? "table__row--clickable" : ""
              }`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={`table__cell ${
                    column.align
                      ? `table__cell--${column.align}`
                      : ""
                  }`}
                >
                  {column.render
                    ? column.render(row)
                    : (row[column.key] as React.ReactNode)}
                </td>
              ))}
            </tr>
          );
        })}
        </tbody>
      </table>
    </div>
  );
}
