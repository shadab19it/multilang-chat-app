import { FC } from "react";

import "./Input.css";

const Input: FC<{ setMessage: any; sendMessage: any; message: string }> = ({ setMessage, sendMessage, message }) => {
  return (
    <form className='form'>
      <input
        className='input'
        type='text'
        placeholder='Type a message...'
        value={message}
        onChange={({ target: { value } }) => setMessage(value)}
        onKeyDown={(event) => (event.key === "Enter" ? sendMessage(event) : null)}
      />
      <button className='sendButton' onClick={(e) => sendMessage(e)}>
        Send
      </button>
    </form>
  );
};

export default Input;
