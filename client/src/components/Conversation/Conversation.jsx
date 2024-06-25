import React from 'react'
import Header from './Header'
import MessageBox from './MessageBox'
import MentionInput from './MentionInput'
import { ChatState } from '../../Context/ChatProvider'


const Conversation = ({ setOpen }) => {
  const {selectedChat} = ChatState()
  return (
    <div className="flex-1 flex flex-col w-full">
      <Header setOpen={setOpen} />
      <MessageBox />

      {selectedChat && (
        <div className="mt-auto">
          <MentionInput />
        </div>
      )}
    </div>
  );
};

export default Conversation
