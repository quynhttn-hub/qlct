import Header from './Header'
// import MessageBox from './MessageBox'
import { ChatState } from '../../Context/ChatContext'


const Conversation = ({ setOpen }) => {
  const {selectedChat} = ChatState()
  return (
    <div className="flex-1 flex flex-col w-full">
      <Header setOpen={setOpen} />
      {/* <MessageBox /> */}

      {selectedChat && (
        <div className="mt-auto">
          // todo
          {/* <MentionInput /> */}
        </div>
      )}
    </div>
  );
};

export default Conversation
