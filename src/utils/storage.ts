const KEY = 'bachkhoa-sol-wallet-secret';

export const saveSecret = (secret: string) => {
  try {
    localStorage.setItem(KEY, secret);
  } catch (error) {
    console.error('Failed to persist wallet secret', error);
  }
};

export const loadSecret = () => {
  try {
    return localStorage.getItem(KEY);
  } catch (error) {
    console.error('Failed to load wallet secret', error);
    return null;
  }
};

export const clearSecret = () => {
  try {
    localStorage.removeItem(KEY);
  } catch (error) {
    console.error('Failed to clear wallet secret', error);
  }
};
