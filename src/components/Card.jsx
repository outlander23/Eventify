import { clsx } from "clsx";

const Card = ({ className, ...props }) => (
  <div
    className={clsx(
      "rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm hover:shadow-md transition-shadow",
      className
    )}
    {...props}
  />
);

const CardHeader = ({ className, ...props }) => (
  <div
    className={clsx("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
);

const CardTitle = ({ className, ...props }) => (
  <h3
    className={clsx(
      "text-2xl font-semibold leading-none tracking-tight text-gray-900",
      className
    )}
    {...props}
  />
);

const CardDescription = ({ className, ...props }) => (
  <p className={clsx("text-sm text-gray-600", className)} {...props} />
);

const CardContent = ({ className, ...props }) => (
  <div className={clsx("p-6 pt-0", className)} {...props} />
);

const CardFooter = ({ className, ...props }) => (
  <div className={clsx("flex items-center p-6 pt-0", className)} {...props} />
);

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
