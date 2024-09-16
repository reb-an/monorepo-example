/**
 * Useful class to handle localstorage
 */
export class StorageService {
  setItem = async (key: string, value: string) => {
    return localStorage.setItem(key, value);
  };

  getItem = async (key: string) => {
    return localStorage.getItem(key);
  };

  removeItem = async (key: string) => {
    return localStorage.removeItem(key);
  };
}
