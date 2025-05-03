export const createChartSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContacts: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  channels: [],
  setChannels: (channels) => set({ channels }),
  setIsUploading: (isUpload) => set({ isUpload }),
  setIsDownloading: (isDownload) => set({ isDownload }),
  setFileUploadProgress: (fileUploadProgress) =>
    set({ fileUploadProgress }),
  setFileDownloadProgress: (fileDownloadProgress) =>
    set({ fileDownloadProgress }),
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  setDirectMessagesContacts: (directMessagesContacts) =>
    set({ directMessagesContacts }),

  addChannel: (channel) => {
    const channels = get().channels;
    set({ channels: [ channel, ...channels] });
  },
  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;
    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          timestamp: message.timestamp || new Date().toISOString(), // Use 'timestamp' to match MessageContainer
          recipient: // Corrected typo and simplified logic
            selectedChatType === "channel"
              ? message.recipient
              : message.recipient?._id || message.recipient,
          sender: // Simplified logic
            selectedChatType === "channel"
              ? message.sender
              : message.sender?._id || message.sender,
        },
      ],
    });
  },
});