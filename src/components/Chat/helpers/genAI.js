export const formateChatHistory = (chatHistory = []) => {
  return chatHistory.reduce((acc, history) => {
    const { role, text } = history;
    const element = {
      role,
      parts: [{ text }],
    };
    acc.push(element);
    return acc;
  }, []);
};
