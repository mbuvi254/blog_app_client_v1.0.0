import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  // Map Next-themes system to Sonner auto
  const mappedTheme: ToasterProps["theme"] =
    theme === "system" ? "auto" : (theme as ToasterProps["theme"]);

  return (
    <Sonner
      theme={mappedTheme}
      position="top-right"
      icons={{
        success: <CircleCheckIcon className="w-4 h-4" />,
        info: <InfoIcon className="w-4 h-4" />,
        warning: <TriangleAlertIcon className="w-4 h-4" />,
        error: <OctagonXIcon className="w-4 h-4" />,
        loading: <Loader2Icon className="w-4 h-4 animate-spin" />,
      }}
      toastOptions={{
        style: {
          borderRadius: "0.75rem",
          boxShadow:
            "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
        },
        success: {
          style: {
            background: "#f0fdf4",
            color: "#166534",
            border: "1px solid #22c55e",
          },
          iconTheme: {
            primary: "#22c55e",
            secondary: "white",
          },
        },
        info: {
          style: {
            background: "#f0f9ff",
            color: "#0369a1",
            border: "1px solid #0ea5e9",
          },
          iconTheme: {
            primary: "#0ea5e9",
            secondary: "white",
          },
        },
        warning: {
          style: {
            background: "#fefce8",
            color: "#a16207",
            border: "1px solid #facc15",
          },
          iconTheme: {
            primary: "#facc15",
            secondary: "white",
          },
        },
        error: {
          style: {
            background: "#fef2f2",
            color: "#dc2626",
            border: "1px solid #ef4444",
          },
          iconTheme: {
            primary: "#ef4444",
            secondary: "white",
          },
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
