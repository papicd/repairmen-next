"use client";

import "./card.scss";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

/**
 * Reusable Card component
 * @param children - Card content
 * @param className - Additional CSS classes
 * @param onClick - Click handler
 * @param hoverable - Enable hover effect
 */
export function Card({ children, className = "", onClick, hoverable = false }: CardProps) {
  return (
    <div
      className={`card ${hoverable ? "card--hoverable" : ""} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card header section
 */
export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return <div className={`card__header ${className}`}>{children}</div>;
}

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card title
 */
export function CardTitle({ children, className = "" }: CardTitleProps) {
  return <h3 className={`card__title ${className}`}>{children}</h3>;
}

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card main content
 */
export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={`card__content ${className}`}>{children}</div>;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card footer section
 */
export function CardFooter({ children, className = "" }: CardFooterProps) {
  return <div className={`card__footer ${className}`}>{children}</div>;
}

export interface CardBadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info" | "default";
  className?: string;
}

/**
 * Card badge component
 */
export function CardBadge({ children, variant = "default", className = "" }: CardBadgeProps) {
  return (
    <span className={`card__badge card__badge--${variant} ${className}`}>
      {children}
    </span>
  );
}

export interface CardLabelProps {
  children: React.ReactNode;
  variant?: "service" | "service-request";
  className?: string;
}

/**
 * Card label component for indicating type (service vs service-request)
 */
export function CardLabel({ children, variant = "service", className = "" }: CardLabelProps) {
  return (
    <span className={`card__label card__label--${variant} ${className}`}>
      {children}
    </span>
  );
}

export interface CardAvatarProps {
  src?: string;
  alt?: string;
  initial?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Card avatar component
 */
export function CardAvatar({
  src,
  alt = "",
  initial,
  size = "md",
  className = ""
}: CardAvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`card__avatar card__avatar--${size} ${className}`}
      />
    );
  }

  return (
    <div className={`card__avatar card__avatar--${size} card__avatar--initial ${className}`}>
      {initial || "?"}
    </div>
  );
}

export interface CardDateProps {
  date?: string | null;
  format?: "short" | "long" | "relative";
  className?: string;
}

/**
 * Card date display
 */
export function CardDate({ date, format = "short", className = "" }: CardDateProps) {
  if (!date) return null;

  let formattedDate: string;
  const dateObj = new Date(date);

  switch (format) {
    case "long":
      formattedDate = dateObj.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      break;
    case "relative":
      // Simple relative date
      const now = new Date();
      const diff = now.getTime() - dateObj.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days === 0) formattedDate = "Today";
      else if (days === 1) formattedDate = "Yesterday";
      else if (days < 7) formattedDate = `${days} days ago`;
      else formattedDate = dateObj.toLocaleDateString();
      break;
    default:
      formattedDate = dateObj.toLocaleDateString();
  }

  return <span className={`card__date ${className}`}>{formattedDate}</span>;
}
