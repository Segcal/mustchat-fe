import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import Lottie from "react-lottie";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/stores";

const NewDm = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [opentNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTE,
          { searchTerm },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.contact) {
          setSearchedContacts(response.data.contact);
        } else {
          setSearchedContacts([]);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.error("Error searching contacts:", error);
    }
  };

  const selectNewContact = (contact) => {
    setOpenNewContactModel(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchedContacts([]);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-xl cursor-pointer hover:text-blue-900 duration-300 transition-all"
              onClick={() => setOpenNewContactModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="text-white bg-black/30 rounded-md p-3 mb-2 text-sm font-medium">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={opentNewContactModel} onOpenChange={setOpenNewContactModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div>
            <input
              type="search"
              className="rounded-lg px-6 py-4 border-none bg-[#2c2e3b] w-full"
              placeholder="Search for a contact..."
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          {searchedContacts.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {searchedContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => selectNewContact(contact)}
                  >
                    <Avatar className="h-12 w-12 relative">
                      {contact.image ? (
                        <AvatarImage
                          src={`${HOST}/${contact.image}`}
                          alt="profile"
                          className="object-cover w-full h-full bg-black"
                        />
                      ) : (
                        <div
                          className={`uppercase h-12 w-12 text-2xl font-bold border-[1px] flex items-center justify-center rounded-full ${getColor(
                            contact.color
                          )}`}
                        >
                          {contact.firstName
                            ? contact.firstName.charAt(0).toUpperCase()
                            : contact.email.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </Avatar>

                    <div className="flex flex-col">
                      <span className="text-white text-md font-semibold">
                        {contact.firstName || contact.email}
                      </span>
                      <span className="text-neutral-400 text-xs">
                        {contact.email}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {searchedContacts.length === 0 && (
            <div className="flex-1 overflow-y-auto mt-5">
              <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
                <Lottie
                  isClickToPauseDisabled={true}
                  height={100}
                  width={100}
                  options={animationDefaultOptions}
                />
                <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-4xl text-2xl duration-300 transition-all text-center">
                  <h3 className="poppins-medium">
                    Hi <span className="text-blue-500">!</span> Search new
                    <span className="text-blue-500"> Contact</span>
                  </h3>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDm;
