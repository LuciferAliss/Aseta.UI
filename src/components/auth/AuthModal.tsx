import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  type ButtonProps,
} from "@chakra-ui/react";
import React, { useState } from "react";
import LoginView from "./LoginView";
import RegisterView from "./RegisterView";
import { useTranslation } from "react-i18next";

const AuthModal = (props: ButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [initialView, setInitialView] = useState<"login" | "register">("login");

  const { t } = useTranslation("auth");

  const [view, setView] = useState(initialView);

  const initialRefLogin = React.useRef<HTMLInputElement>(null);
  const initialRefRegister = React.useRef<HTMLInputElement>(null);

  const handleSwitchToRegister = () => setView("register");
  const handleSwitchToLogin = () => setView("login");

  React.useEffect(() => {
    if (isOpen) {
      setView(initialView);
    }
  }, [isOpen, initialView]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (view === "login" && initialRefLogin.current) {
        initialRefLogin.current.focus();
      } else if (view === "register" && initialRefRegister.current) {
        initialRefRegister.current.focus();
      }
    });

    return () => clearTimeout(timer);
  }, [view]);

  const openLogin = () => {
    setInitialView("login");
    onOpen();
  };

  return (
    <>
      <Button
        size={{ base: "sm", md: "md" }}
        onClick={openLogin}
        variant="ghost"
        {...props}
      >
        {t("button_title")}
      </Button>
      <Modal
        initialFocusRef={
          view === "login" ? initialRefLogin : initialRefRegister
        }
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton
            _focusVisible={{
              ring: "2px",
              ringColor: "btn-focus-ring",
              ringOffset: "2px",
              ringOffsetColor: "app-bg",
            }}
          />
          {view === "login" ? (
            <LoginView
              onSwitchToRegister={handleSwitchToRegister}
              ref={initialRefLogin}
            />
          ) : (
            <RegisterView
              onSwitchToLogin={handleSwitchToLogin}
              ref={initialRefRegister}
            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthModal;
