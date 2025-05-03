import { useAppStore } from "@/stores";
import { Avatar, AvatarImage } from "./ui/avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    setSelectedChatData,
    setSelectedChatType,
    selectedChatType,
    selectedChatData,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      // setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-blue-800 hover:bg-blue-700"
              : "hover:bg-blue-800/5"
          }
        `}
          onClick={() => handleClick(contact)}
        >
          <div className="flex items-center gap-5 text-neutral-300">
            {!isChannel && (
              <Avatar className="h-10 w-10 rounded-full">
                {contact.image ? (
                  <AvatarImage
                    src={`${HOST}/${contact.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`
                        ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#ffffff22] border border-white/70" : getColor(contact.color)}
                        uppercase h-10 w-10 text-2xl font-bold border flex items-center justify-center rounded-full 
                    )}`}
                  >
                    {contact.firstName
                      ? contact.firstName.charAt(0).toUpperCase()
                      : contact.email?.charAt(0).toUpperCase()}
                  </div>
                )}
              </Avatar>
            )}
            {isChannel && (
              <div className="bg-[#ffffff22] text-black h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
            {isChannel ? (
              <span>{contact.name}</span>
            ) : (
              <span>{`${contact.firstName} ${contact.lastName}`}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
