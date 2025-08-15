import React, { useState } from 'react';
import axios from 'axios';
import './ChatBox.css';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

const ChatBox = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/ai/chat`, { question: input });

      const botMessage = { sender: 'bot', text: res.data.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        sender: 'bot',
        text: 'Error contacting assistant.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setInput('');
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className='chatbox-container'>
      <div className='chat-header'>
        <h3>Snapple</h3>
      </div>
      <div className='chat-messages'>
        {messages.map((msg, index) => (
          <div key={index} className={`chat-msg ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className='chat-msg bot'>Typing...</div>}
      </div>
      <div className='chat-input'>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Ask for help...'
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
