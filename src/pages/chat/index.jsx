import { useAppStore } from "@/stores";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please complete your profile setup first");
      navigate("/profile");
    }
  }, [userInfo, useNavigate]);
  return (
    <div className="flex h-[100vh] overflow-hidden text-white">
      {
        isUploading && <div className="h-[100vh] w-[100vw] fixed top-0 right-0 z-10 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse duration-300 ease-in">Uploading File....</h5>
          {fileUploadProgress} %
        </div>
      }
      {
        isDownloading && <div className="h-[100vh] w-[100vw] fixed top-0 right-0 z-10 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse duration-300 ease-in">Downloading File....</h5>
          {fileDownloadProgress} %
        </div>
      }
      <ContactsContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default Chat;
