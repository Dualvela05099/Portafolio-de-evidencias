export const generateId = (): string =>
  `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

export const nowISO = (): string => new Date().toISOString();
