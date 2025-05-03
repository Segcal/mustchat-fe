import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/stores";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEMoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      const payload = {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      };
      socket.emit("sendMessage", payload);
      setMessage("");
    } else if (selectedChatType === "channel") {
      const payload = {
        sender: userInfo.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      };
      socket.emit("send-channel-message", payload);
      setMessage("");
    }
  };

  

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    setIsUploading(true);
    try {
      const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
        onUploadProgress: (data) => {
          setFileUploadProgress(Math.round((100 * data.loaded) / data/total));
        }
      });
      setIsUploading(false);
      const payload = {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "file",
        fileUrl: response.data.filePath,
      };
      socket.emit("sendMessage", payload);
      setMessage("");
    } catch (error) {
      setIsUploading(false);
      console.error("Error uploading file:", error);
    }

    if (selectedChatType === "channel") {
      const payload = {
        sender: userInfo.id,
        content: undefined,
        messageType: "file",
        fileUrl: response.data.filePath,
        channelId: selectedChatData._id,
      };
      socket.emit("sendMessage", payload);
      setMessage("");
    } else if (selectedChatType === "channel") {
      const payload = {
        sender: userInfo.id,
        content: undefined,
        recipient: selectedChatData._id,
        messageType: "file",
        fileUrl: response.data.filePath,
      };
      socket.emit("sendMessage", payload);
      setMessage("");
    }
    
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          className="text-neutral-500 focus:border-none focus:outline-none cursor-pointer focus:text-white duration-300 tranlsition-all"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none cursor-pointer focus:text-white duration-300 tranlsition-all
          "
            onClick={() => setEmojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEMoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        className="text-gray-50 bg-blue-900 rounded-md hover:bg-blue-800 p-5 flex items-center justify-center focus:border-none focus:bg-blue-800 focus:outline-none cursor-pointer focus:text-white duration-300 tranlsition-all"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
