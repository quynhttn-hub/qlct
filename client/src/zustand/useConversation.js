import { create } from "zustand";

const useConversation = create((set) => ({
  file: null,
  setFile: (file) => set({ file }),
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),
}));

export default useConversation;
