"use client";

import React, { useState, useRef, useEffect } from "react";
import "./select.scss";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  label?: string;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  className?: string;
}

export default function Select({
  options,
  value,
  onChange,
  label,
  placeholder = "Select...",
  multiple = false,
  searchable = false,
  className = "",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search
  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  // Get selected labels for display
  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label)
    .join(", ");

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        event.target &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleToggle = (optionValue: string) => {
    if (multiple) {
      const newValue = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      onChange(newValue);
    } else {
      onChange([optionValue]);
      setIsOpen(false);
      setSearch("");
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div
      ref={containerRef}
      className={`select-container ${className} ${isOpen ? "select-container--open" : ""}`}
    >
      {label && <label className="select-container__label">{label}</label>}
      
      <button
        type="button"
        className="select-container__trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`select-container__value ${!value.length ? "select-container__value--placeholder" : ""}`}>
          {value.length === 0
            ? placeholder
            : multiple
            ? selectedLabels
            : options.find((opt) => opt.value === value[0])?.label || placeholder}
        </span>
        <div className="select-container__actions">
          {value.length > 0 && (
            <span
              className="select-container__clear"
              onClick={handleClear}
            >
              ×
            </span>
          )}
          <span className="select-container__arrow">▼</span>
        </div>
      </button>

      {isOpen && (
        <div className="select-container__dropdown">
          {searchable && (
            <div className="select-container__search">
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="select-container__search-input"
              />
            </div>
          )}
          
          <div className="select-container__options">
            {filteredOptions.length === 0 ? (
              <div className="select-container__empty">No options found</div>
            ) : (
              filteredOptions.map((option) => (
                <label
                  key={option.value}
                  className={`select-container__option ${
                    value.includes(option.value) ? "select-container__option--selected" : ""
                  }`}
                >
                  {multiple && (
                    <input
                      type="checkbox"
                      checked={value.includes(option.value)}
                      onChange={() => handleToggle(option.value)}
                      className="select-container__checkbox"
                    />
                  )}
                  <span
                    className="select-container__option-text"
                    onClick={() => !multiple && handleToggle(option.value)}
                  >
                    {option.label}
                  </span>
                </label>
              ))
            )}
          </div>
          
          {multiple && value.length > 0 && (
            <div className="select-container__footer">
              <span className="select-container__count">
                {value.length} selected
              </span>
              <button
                type="button"
                className="select-container__close"
                onClick={() => setIsOpen(false)}
              >
                Done
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
