import toast from "react-hot-toast"
import { AlertTriangle, CheckCircle, Info, WifiOff } from "lucide-react"

interface ToastOptions {
  duration?: number
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
  id?: string
}

export const toastUtils = {
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      duration: options?.duration || 4000,
      position: options?.position || "top-right",
      id: options?.id,
      style: {
        background: "#1e293b",
        color: "#10b981",
        border: "1px solid #10b981",
      },
      iconTheme: {
        primary: "#10b981",
        secondary: "#1e293b",
      },
    })
  },

  error: (error: string | Error, options?: ToastOptions) => {
    const message = typeof error === "string" ? error : error.message
    
    return toast.error(message, {
      duration: options?.duration || 6000,
      position: options?.position || "top-right",
      id: options?.id,
      style: {
        background: "#1e293b",
        color: "#ef4444",
        border: "1px solid #ef4444",
      },
      iconTheme: {
        primary: "#ef4444",
        secondary: "#1e293b",
      },
    })
  },

  warning: (message: string, options?: ToastOptions) => {
    return toast(message, {
      duration: options?.duration || 5000,
      position: options?.position || "top-right",
      id: options?.id,
      icon: "⚠️",
      style: {
        background: "#1e293b",
        color: "#f59e0b",
        border: "1px solid #f59e0b",
      },
    })
  },

  info: (message: string, options?: ToastOptions) => {
    return toast(message, {
      duration: options?.duration || 4000,
      position: options?.position || "top-right",
      id: options?.id,
      icon: "ℹ️",
      style: {
        background: "#1e293b",
        color: "#3b82f6",
        border: "1px solid #3b82f6",
      },
    })
  },

  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, {
      position: options?.position || "top-right",
      id: options?.id,
      style: {
        background: "#1e293b",
        color: "#f8fafc",
        border: "1px solid #475569",
      },
    })
  },

  networkError: (options?: ToastOptions) => {
    return toast.error("Network connection lost. Please check your internet connection.", {
      duration: Infinity,
      position: options?.position || "top-right",
      id: options?.id || "network-error",
      icon: "📡",
      style: {
        background: "#1e293b",
        color: "#ef4444",
        border: "1px solid #ef4444",
      },
    })
  },

  networkRestored: (options?: ToastOptions) => {
    toast.dismiss("network-error")
    return toast.success("Connection restored", {
      duration: 3000,
      position: options?.position || "top-right",
      id: options?.id || "network-restored",
      style: {
        background: "#1e293b",
        color: "#10b981",
        border: "1px solid #10b981",
      },
    })
  },

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: Error) => string)
    },
    options?: ToastOptions
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        position: options?.position || "top-right",
        id: options?.id,
        style: {
          background: "#1e293b",
          color: "#f8fafc",
          border: "1px solid #475569",
        },
        success: {
          style: {
            background: "#1e293b",
            color: "#10b981",
            border: "1px solid #10b981",
          },
        },
        error: {
          style: {
            background: "#1e293b",
            color: "#ef4444",
            border: "1px solid #ef4444",
          },
        },
      }
    )
  },

  dismiss: (id?: string) => {
    return toast.dismiss(id)
  },

  dismissAll: () => {
    return toast.dismiss()
  }
}

// Helper function to handle common error scenarios
export function handleAsyncError(error: unknown, context?: string) {
  console.error(`Error${context ? ` in ${context}` : ""}:`, error)
  
  if (error instanceof Error) {
    if (error.message.toLowerCase().includes("network") || 
        error.message.toLowerCase().includes("fetch")) {
      toastUtils.networkError()
    } else {
      toastUtils.error(error)
    }
  } else {
    toastUtils.error("An unexpected error occurred")
  }
}