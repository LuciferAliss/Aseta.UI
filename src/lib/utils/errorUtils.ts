import { isAxiosError } from "axios";

const parseValidationErrors = (data: any): string | null => {
  if (data && Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors
      .map((err: any) => err.description)
      .filter(Boolean)
      .join(" ");
  }
  return null;
};

export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    if (error.response) {
      const validationError = parseValidationErrors(error.response.data);
      if (validationError) {
        return validationError;
      }

      if (error.response.data?.detail) {
        return error.response.data.detail;
      }
      if (error.response.data?.message) {
        return error.response.data.message;
      }

      return `Server error: Status ${error.response.status}`;
    }
    if (error.request) {
      return "Network error. Please check your internet connection or if the server is running.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
};

export const getTitleError = (error: unknown): string => {
  if (isAxiosError(error)) {
    if (error.response) {
      if (error.response.data?.title) {
        return error.response.data.title;
      }
    }
  }
  return "An unexpected error occurred.";
};
