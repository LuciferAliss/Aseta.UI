export const VALIDATION_CONSTANTS = {
  EMAIL: {
    MAX_LENGTH: 256,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
  },
  USER_NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 32,
  },
  INVENTORY: {
    NAME: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 36,
    },
    DESCRIPTION: {
      MAX_LENGTH: 1000,
    },
  },
  INVENTORY_FILTER: {
    PAGE_SIZE: { MIN: 1, MAX: 100 },
    ITEMS_COUNT: { MIN: 0 },
  },
};
