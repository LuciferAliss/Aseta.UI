import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";

type ToastStatus = "success" | "error" | "info" | "warning";

export const useAppToast = () => {
  const toast = useToast();

  const showToast = useCallback(
    (status: ToastStatus, title: string, description?: string) => {
      toast({
        title,
        description,
        status,
        duration: status === "error" ? 6000 : 5000,
        isClosable: true,
        position: "top-right",
      });
    },
    [toast]
  );

  const showSuccess = useCallback(
    (title: string, description?: string) => {
      showToast("success", title, description);
    },
    [showToast]
  );

  const showError = useCallback(
    (title: string, description: string) => {
      showToast("error", title, description);
    },
    [showToast]
  );

  const showInfo = useCallback(
    (title: string, description?: string) => {
      showToast("info", title, description);
    },
    [showToast]
  );

  return { showSuccess, showError, showInfo };
};
