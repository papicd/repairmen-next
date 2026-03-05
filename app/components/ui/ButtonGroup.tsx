"use client";

import React from "react";
import "./button-group.scss";

export interface ButtonGroupOption {
  value: string;
  label: string;
}

interface ButtonGroupProps {
  options: ButtonGroupOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export default function ButtonGroup({
  options,
  value,
  onChange,
  label,
  className = "",
}: ButtonGroupProps) {
  return (
    <div className={`button-group ${className}`}>
      {label && <label className="button-group__label">{label}</label>}
      <div className="button-group__buttons">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`button-group__button ${
              value === option.value ? "button-group__button--active" : ""
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
