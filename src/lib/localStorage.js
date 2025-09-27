export const setItemInLocalStorage = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return false;
  }
};

export const getItemInLocalStorage = (key, defaultValue = []) => {
  try {
    const serializedValue = localStorage.getItem(key);
    const deSerializedValue = JSON.parse(serializedValue);
    return deSerializedValue || defaultValue;
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return defaultValue;
  }
};

export const deleteItemInLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return false;
  }
};
