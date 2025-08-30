import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from 'stream-chat';
import toast from 'react-hot-toast';
import ChatLoader from './ChatLoader';
import CallButton from '../components/CallButton';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const {id: targetUserID} = useParams();

  const [chatClient,setChatClient] = useState(null);
  const [channel,setChannel] = useState(null);
  const [ loading, setLoading] = useState(true);

  const {authUser} = useAuthUser();
  // console.log("HA bhai",authUser)

  const {data:tokenData} = useQuery({//runs immediately but we want above authuser to be fetched first then this should run 
    queryKey:["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser //do not run this query untill we have this authUser 
  });
  console.log("Tokendata",tokenData)

  useEffect(()=>{
    const initChat = async()=>{
      if(!tokenData?.token || !authUser) return ;

      try {
        console.log("Initialising Stream chat Client")
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser({
          id: authUser?.data._id,
          name: authUser?.data.fullName,
          image:authUser?.data.profilePic,
        }, tokenData.token);

        const channeId = [authUser?.data._id, targetUserID].sort().join("-");
        // u & me having chat , I start 

        const currentChannel = client.channel("messaging",channeId,{
          members: [authUser?.data._id,targetUserID],  
        })

        await currentChannel.watch(); // listen for any changes & works real time 

        setChatClient(client);
        setChannel(currentChannel);
      } catch (error) {
        console.log("Error while Initializing the chat",error);
        toast.error("Could not connect to chat. Please try again.");
      } finally{
        setLoading(false);
      }
    }

    initChat()
  },[tokenData,authUser,targetUserID])

  const handleVideoCall=()=>{
    if(channel){
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text:`I have started a video call. Join me Here: ${callUrl}`
      })

      toast.success("Video call Link sent Successfully.")
    }
  }

  if(loading || !chatClient || !channel) return <ChatLoader/>
  return (
    <div className='h-[93vh]'>
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className='w-full relative'>
            <CallButton handleVideoCall={handleVideoCall}/>
            <Window>
              <ChannelHeader/>
                <MessageList/>
                <MessageInput focus/>
            </Window>
          </div>
          <Thread/>
        </Channel>

      </Chat>
      

    </div>
  )
}

export default ChatPage