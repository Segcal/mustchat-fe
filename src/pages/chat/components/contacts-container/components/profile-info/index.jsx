import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { getColor } from "@/lib/utils";
import { useAppStore } from "@/stores";
import { HOST } from "@/utils/constants";
import { FaEdit } from "react-icons/fa";
import { IoPowerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ProfileInfo = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();
  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <div>
          <Avatar className="h-12 w-12 relative">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12 text-2xl font-bold border-[1px] flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.charAt(0).toUpperCase()
                  : userInfo.email.charAt(0).toUpperCase()}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <TooltipTrigger>
                <FaEdit
                  className="text-blue-900 text-xl font-medium"
                  onClick={() => navigate("/profile")}
                />
              </TooltipTrigger>
              <TooltipContent className="text-white bg-black/30 rounded-md p-2 text-sm font-medium">
                Edit Profile
              </TooltipContent>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <TooltipTrigger>
                <IoPowerSharp
                  className="text-red-500 text-xl font-medium"
                />
              </TooltipTrigger>
              <TooltipContent className="text-white bg-black/30 rounded-md p-2 text-sm font-medium">
                Logout
              </TooltipContent>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
