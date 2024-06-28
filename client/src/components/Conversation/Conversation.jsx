import Header from './Header'
import MessageBox from './MessageBox'
import MentionInput from './MentionInput'
import { ChatState } from '../../Context/ChatProvider'


const Conversation = ({ setOpen, fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <div className="flex-1 flex flex-col w-full">
      <Header setOpen={setOpen} />
      <MessageBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />

      {selectedChat && (
        <div className="mt-auto">
          <MentionInput fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>
      )}
    </div>
  );
};

export default Conversation
