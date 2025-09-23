import { clsx } from "clsx";
import { Link } from "react-router-dom";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled,
  href,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    ghost: "hover:bg-gray-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8",
    icon: "h-10 w-10",
  };

  const classNames = clsx(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link to={href} className={classNames} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classNames} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
