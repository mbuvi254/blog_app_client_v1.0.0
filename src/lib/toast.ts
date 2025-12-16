// lib/toast.ts
import { toast } from "sonner";

/**
 * Centralized Toast Utilities
 * Fully typed, async-safe, and production-ready
 */

type ActionCallback = () => void;

export const toastUtils = {
  success: (title: string, description?: string) =>
    toast.success(title, { description }),

  error: (
    title: string,
    description?: string,
    actionLabel?: string,
    actionCallback?: ActionCallback
  ) =>
    toast.error(title, {
      description,
      ...(actionLabel &&
        actionCallback && {
          action: { label: actionLabel, onClick: actionCallback },
        }),
    }),

  info: (title: string, description?: string) =>
    toast.info(title, { description }),

  warning: (title: string, description?: string) =>
    toast.warning(title, { description }),

  loading: (message: string) => toast.loading(message),

  dismiss: (id?: string) => toast.dismiss(id),


  auth: {
    loginSuccess: () =>
      toast.success("Login successful!", {
        description: "Welcome back to your dashboard",
      }),

    loginFailed: (error?: string, retryCallback?: ActionCallback) =>
      toast.error("Login failed", {
        description: error || "Invalid credentials or server error",
        ...(retryCallback && {
          action: { label: "Retry", onClick: retryCallback },
        }),
      }),

    registrationSuccess: () =>
      toast.success("Account created successfully!", {
        description: "Your author account is ready",
      }),

    registrationFailed: (error?: string, retryCallback?: ActionCallback) =>
      toast.error("Registration failed", {
        description: error || "Unable to complete registration",
        ...(retryCallback && {
          action: { label: "Retry", onClick: retryCallback },
        }),
      }),

    logoutSuccess: () =>
      toast.success("Logged out successfully", {
        description: "You have been safely logged out",
      }),

    validationError: (description: string, fixCallback?: ActionCallback) =>
      toast.error("Validation error", {
        description,
        ...(fixCallback && {
          action: { label: "Fix", onClick: fixCallback },
        }),
      }),

    passwordMismatch: (checkCallback?: ActionCallback) =>
      toast.error("Password mismatch", {
        description: "Please ensure both passwords match",
        ...(checkCallback && {
          action: { label: "Check", onClick: checkCallback },
        }),
      }),
  },


  blog: {
    createSuccess: (title = "Blog post created!") =>
      toast.success(title, {
        description: "Your post has been successfully created",
      }),

    updateSuccess: (title = "Blog post updated!") =>
      toast.success(title, {
        description: "Your changes have been saved",
      }),

    deleteSuccess: (
      title = "Blog post deleted!",
      undoCallback?: ActionCallback
    ) =>
      toast.success(title, {
        description: "The post has been moved to trash",
        ...(undoCallback && {
          action: { label: "Undo", onClick: undoCallback },
        }),
      }),

    publishSuccess: (title = "Published successfully!") =>
      toast.success(title, {
        description: "Your post is now live",
      }),

    unpublishSuccess: (title = "Unpublished successfully!") =>
      toast.info(title, {
        description: "Your post has been moved to drafts",
      }),

    draftSaved: (title = "Draft saved!") =>
      toast.info(title, {
        description: "Your work has been saved as a draft",
      }),

    commentPosted: (title = "Comment posted!") =>
      toast.success(title, {
        description: "Your comment is now visible",
      }),

    commentDeleted: (title = "Comment deleted!") =>
      toast.warning(title, {
        description: "The comment has been removed",
      }),

    operationFailed: (
      operation: string,
      error?: string,
      retryCallback?: ActionCallback
    ) =>
      toast.error(`${operation} failed`, {
        description:
          error || `Something went wrong while performing ${operation}`,
        ...(retryCallback && {
          action: { label: "Retry", onClick: retryCallback },
        }),
      }),

    validationError: (field: string, error?: string) =>
      toast.error(`${field} validation error`, {
        description: error || `Please check the ${field} field`,
      }),

    networkError: (retryCallback?: ActionCallback) =>
      toast.error("Network error", {
        description: "Unable to connect to the server",
        ...(retryCallback && {
          action: { label: "Retry", onClick: retryCallback },
        }),
      }),

    unauthorized: (loginCallback?: ActionCallback) =>
      toast.error("Unauthorized", {
        description: "Please login to access this feature",
        ...(loginCallback && {
          action: { label: "Login", onClick: loginCallback },
        }),
      }),
  },

  general: {
    networkError: (retryCallback?: ActionCallback) =>
      toast.error("Network error", {
        description: "Please check your internet connection",
        ...(retryCallback && {
          action: { label: "Retry", onClick: retryCallback },
        }),
      }),

    unauthorized: (loginCallback?: ActionCallback) =>
      toast.error("Unauthorized", {
        description: "Please login to access this feature",
        ...(loginCallback && {
          action: { label: "Login", onClick: loginCallback },
        }),
      }),
  },


  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages);
  },
};

export default toastUtils;
