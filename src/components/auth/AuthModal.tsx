import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useState } from "react";
import LoginView from "./LoginView";
import RegisterView from "./RegisterView";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "register";
}

const AuthModal = ({
  isOpen,
  onClose,
  initialView = "login",
}: AuthModalProps) => {
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

  return (
    <Modal
      initialFocusRef={view === "login" ? initialRefLogin : initialRefRegister}
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        flexDirection="column"
        bg="card-bg"
        borderColor="card-border"
        borderWidth="4px"
        borderRadius="lg"
        boxShadow="card-glow-shadows"
      >
        <ModalCloseButton
          _focusVisible={{
            boxShadow: "none",
            border: "2px solid var(--chakra-colors-focus-border-color)",
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
  );
};

export default AuthModal;
