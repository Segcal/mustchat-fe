import logo from '@/assets/mustchat.png'
import ProfileInfo from './components/profile-info';
import NewDm from './components/new-dm';
import { useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { GET_DM_CONTACTS_ROUTE, GET_USER_CHANNELS_ROUTE } from '@/utils/constants';
import { useAppStore } from '@/stores';
import ContactList from '@/components/contact-list';
import CreateChannel from './components/create-channel';

const ContactsContainer = () => {

  const { directMessagesContacts, setDirectMessagesContacts, channels, setChannels } = useAppStore()
  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTE, {
        withCredentials: true,
      });
      if (response.data.contacts) {
        //console.log(response.data.contacts);
        setDirectMessagesContacts(response.data.contacts);
      }
    };
    const getChannels = async () => {
      const response = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
        withCredentials: true,
      });
      if (response.data.channels) {
        //console.log(response.data.contacts);
        setChannels(response.data.channels);
      }
    };
    getContacts();
    getChannels();
  }, [setChannels, setDirectMessagesContacts])
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-3">
        <Logo />
      </div>
      <div className='my-5'>
        <div className="flex justify-between items-center pr-10">
          <Title text="Direct Message" />
          <NewDm />
        </div>
        <div className="overflow-y-auto scrollbar-hidden max-h-[38vh]">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>

      <div className='my-5'>
        <div className="flex justify-between items-center pr-10">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className="overflow-y-auto scrollbar-hidden max-h-[38vh]">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;

const Logo = () => {
  return (
    <div>
      <img src={logo} alt="logo" width="200" height="32" />
    </div>
  )
}

const Title = ({ text }) => {
  return (
    <h6 className='uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm'>
      {text}
    </h6>
  )
}
