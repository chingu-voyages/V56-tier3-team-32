import React, { useState } from 'react';
import ChatBox from '../ChatBox/ChatBox';
import './ChatLauncher.css';

const ChatLauncher = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className='chat-icon' onClick={() => setOpen(!open)}>
        💬
      </button>
      {open && <ChatBox />}
    </>
  );
};

export default ChatLauncher;
