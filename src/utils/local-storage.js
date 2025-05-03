// utils/localstorage.js

export const saveMessagesToLocal = (chatType, chatId, messages) => {
    if (!chatType || !chatId) return;
    const key = `${chatType}-${chatId}`;
    localStorage.setItem(key, JSON.stringify(messages));
  };
  
  export const getMessagesFromLocal = (chatType, chatId) => {
    if (!chatType || !chatId) return [];
    const key = `${chatType}-${chatId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  };
  