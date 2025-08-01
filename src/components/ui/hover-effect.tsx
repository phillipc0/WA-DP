import { ReactNode, forwardRef, HTMLAttributes } from "react";

interface HoverEffectProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  isClickable?: boolean;
  hoverScale?: number;
  className?: string;
  inheritChildStyle?: boolean;
}

export const HoverEffect = forwardRef<HTMLDivElement, HoverEffectProps>(
  (
    {
      children,
      href,
      onClick,
      isClickable = false,
      hoverScale = 1.02,
      className = "",
      inheritChildStyle = false,
      ...props
    },
    ref,
  ) => {
    const scaleClass =
      hoverScale === 1.05 ? "hover:scale-105" : "hover:scale-[1.02]";
    const hoverClasses = `group transition-all duration-300 ${scaleClass} hover:shadow-lg hover:border-primary/30 ${
      isClickable || href || onClick ? "cursor-pointer" : ""
    }`;

    const handleClick = () => {
      if (href) {
        window.open(href, "_self");
      } else if (onClick) {
        onClick();
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleClick();
      }
    };

    const isInteractive = isClickable || href || onClick;

    // For chips and other rounded elements, we need to inherit the border radius
    const wrapperClasses = `${hoverClasses} ${className} ${inheritChildStyle ? "rounded-full" : ""}`;

    return (
      <div
        ref={ref}
        className={wrapperClasses}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onClick={isInteractive ? handleClick : undefined}
        onKeyDown={isInteractive ? handleKeyDown : undefined}
        {...props}
      >
        {children}
      </div>
    );
  },
);

HoverEffect.displayName = "HoverEffect";

// Utility function to get hover effect classes
export const getHoverEffectClasses = (hoverScale: number = 1.02) => {
  // Use predefined Tailwind scale classes to avoid CSS template literal issues
  const scaleClass =
    hoverScale === 1.05 ? "hover:scale-105" : "hover:scale-[1.02]";
  return `group transition-all duration-300 ${scaleClass} hover:shadow-lg hover:border-primary/30`;
};

// Utility function to get text hover effect classes
export const getTextHoverEffectClasses = (
  hoverTextColor: string = "primary",
) => {
  return `group-hover:text-${hoverTextColor} transition-colors duration-200`;
};
