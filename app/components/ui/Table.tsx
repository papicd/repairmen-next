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
  hideOnMobile?: boolean;
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  className?: string;
  onRowClick?: (row: T) => void;
  getRowKey?: (row: T) => string;
  mobileTitleColumn?: keyof T;
};

export default function Table<T>({
                                   columns,
                                   data,
                                   className = "",
                                   onRowClick,
                                   getRowKey,
                                   mobileTitleColumn,
                                 }: TableProps<T>) {
  const getCellValue = (row: T, column: TableColumn<T>): React.ReactNode => {
    if (column.render) {
      return column.render(row);
    }
    const value = row[column.key];
    if (value === null || value === undefined) {
      return <span className="text-gray-400">-</span>;
    }
    return value as React.ReactNode;
  };

  return (
    <div className={`custom-table-wrapper ${className}`}>
      {/* Desktop Table */}
      <table className="custom-table">
        <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={String(column.key)}
              style={{ width: column.width }}
              className={column.hideOnMobile ? 'hide-on-mobile' : ''}
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
                  } ${column.hideOnMobile ? 'hide-on-mobile' : ''}`}
                >
                  {getCellValue(row, column)}
                </td>
              ))}
            </tr>
          );
        })}
        </tbody>
      </table>

      {/* Mobile Card View */}
      <div className="table-mobile-card">
        {data.map((row, rowIndex) => {
          const key = getRowKey
            ? getRowKey(row)
            : rowIndex.toString();
          
          const titleColumn = mobileTitleColumn 
            ? columns.find(c => c.key === mobileTitleColumn)
            : columns[0];
          const title = titleColumn ? getCellValue(row, titleColumn) : `Item ${rowIndex + 1}`;

          return (
            <div
              key={key}
              className={`table-mobile-card__item ${
                onRowClick ? "table-mobile-card__item--clickable" : ""
              }`}
              onClick={() => onRowClick?.(row)}
            >
              <div className="table-mobile-card__header">
                <span className="table-mobile-card__title">{title}</span>
              </div>
              {columns
                .filter(col => col.key !== (mobileTitleColumn || columns[0]?.key) && !col.hideOnMobile)
                .map((column) => (
                  <div key={String(column.key)} className="table-mobile-card__row">
                    <span className="table-mobile-card__label">{column.label}</span>
                    <span className="table-mobile-card__value">
                      {getCellValue(row, column)}
                    </span>
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
