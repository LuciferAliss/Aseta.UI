// src/theme/semantic-tokens.ts
export const semanticTokens = {
  colors: {
    // ------------------------------------------
    // GLOBAL APP BACKGROUNDS
    // ------------------------------------------
    "app-bg": {
      _light: "gray.50",
      _dark: "slate.950",
    },
    "app-bg-subtle": {
      _light: "gray.100",
      _dark: "slate.900",
    },

    // ------------------------------------------
    // TYPOGRAPHY
    // ------------------------------------------
    "text-primary": {
      _light: "gray.900",
      _dark: "slate.50",
    },
    "text-secondary": {
      _light: "gray.600",
      _dark: "slate.300",
    },
    "text-disabled": {
      _light: "gray.400",
      _dark: "slate.600",
    },
    "text-brand": {
      _light: "violet.600",
      _dark: "violet.400",
    },

    // ------------------------------------------
    // BORDERS & DIVIDERS
    // ------------------------------------------
    "border-subtle": {
      _light: "gray.200",
      _dark: "slate.800",
    },
    "border-default": {
      _light: "gray.300",
      _dark: "slate.700",
    },
    "focus-ring": {
      _light: "violet.600",
      _dark: "violet.400",
    },

    // ------------------------------------------
    // COMPONENTS: CARD
    // ------------------------------------------
    "card-bg": {
      _light: "white",
      _dark: "slate.800",
    },
    "card-border": {
      _light: "gray.400",
      _dark: "violet.600",
    },
    "card-border-active": {
      _light: "violet.600",
      _dark: "violet.500",
    },
    "card-glow-shadow-color": {
      _light: "violet.200", // Сделал мягче
      _dark: "violet.900",
    },

    // ------------------------------------------
    // COMPONENTS: BUTTONS
    // ------------------------------------------
    // Primary Button
    "btn-primary-bg": {
      _light: "violet.600",
      _dark: "violet.600",
    },
    "btn-primary-hover-bg": {
      _light: "violet.700",
      _dark: "violet.500",
    },
    "btn-primary-active-bg": {
      _light: "violet.800",
      _dark: "violet.400",
    },
    "btn-primary-text": {
      _light: "white",
      _dark: "white",
    },

    "btn-secondary-bg": {
      _light: "transparent",
      _dark: "transparent",
    },
    "btn-secondary-border": {
      _light: "violet.200",
      _dark: "slate.600",
    },
    "btn-secondary-text": {
      _light: "violet.700",
      _dark: "violet.300",
    },
    "btn-secondary-hover-bg": {
      _light: "violet.50",
      _dark: "slate.700",
    },
    "btn-link-text": {
      _light: "violet.600", // Базовый цвет (как text-brand)
      _dark: "violet.400",
    },
    "btn-link-hover-text": {
      _light: "violet.800", // Темнее при наведении в светлой теме
      _dark: "violet.300", // Светлее/ярче при наведении в темной теме
    },

    // ------------------------------------------
    // COMPONENTS: INPUTS
    // ------------------------------------------
    "input-bg": {
      _light: "white",
      _dark: "slate.900", // Чуть темнее чем карта
    },
    "input-border": {
      _light: "gray.300",
      _dark: "slate.600",
    },
    "input-border-hover": {
      _light: "violet.400",
      _dark: "violet.500",
    },
    "input-border-focus": {
      _light: "violet.600",
      _dark: "violet.400",
    },
    "input-placeholder": {
      _light: "gray.400",
      _dark: "slate.500",
    },

    // ------------------------------------------
    // COMPONENTS: MENU / NAVIGATION
    // ------------------------------------------
    "menu-bg": {
      _light: "white",
      _dark: "slate.800",
    },
    "menu-item-hover-bg": {
      _light: "violet.50",
      _dark: "slate.700",
    },
    "menu-item-active-bg": {
      _light: "violet.100",
      _dark: "violet.900",
    },
    "menu-item-active-text": {
      _light: "violet.700",
      _dark: "violet.200",
    },

    // ------------------------------------------
    // FEEDBACK (Error / Success)
    // ------------------------------------------
    "status-error-bg": {
      _light: "red.50",
      _dark: "rgba(239, 68, 68, 0.15)", // Прозрачный красный
    },
    "status-error-text": {
      _light: "red.600",
      _dark: "red.100",
    },
    "status-success-bg": {
      _light: "green.50",
      _dark: "rgba(34, 197, 94, 0.15)", // Прозрачный зеленый
    },
    "status-success-text": {
      _light: "green.600",
      _dark: "green.100",
    },
  },
};
