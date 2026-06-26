import toast from "react-hot-toast";
import type { ReactNode } from "react";

const baseStyle = {
  color: "#e5e7eb",
  borderRadius: "12px",
  padding: "12px 16px",
};

export const showSuccessToast = (message: string | ReactNode) => {
  toast.success(message as string, {
    style: {
      ...baseStyle,
      background: "#0e1e27",
      border: "1px solid rgba(34, 197, 94, 0.3)",
    },
    iconTheme: { primary: "#22c55e", secondary: "#1a1838" },
  });
};

export const showErrorToast = (message: string | ReactNode) => {
  toast.error(message as string, {
    style: {
      ...baseStyle,
      background: "#231124",
      border: "1px solid rgba(239, 68, 68, 0.3)",
    },
    iconTheme: { primary: "#ef4444", secondary: "#1a1838" },
  });
};

export const showWarningToast = (message: string | ReactNode) => {
  toast(message as string, {
    icon: "⚠️",
    style: {
      ...baseStyle,
      background: "#241a1d",
      border: "1px solid rgba(245, 158, 11, 0.3)",
    },
  });
};
