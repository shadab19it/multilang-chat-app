import React, { useState, useEffect, FC } from "react";
import queryString from "query-string";
//@ts-ignore
import io, { Socket } from "socket.io-client";

import TextContainer from "../TextContainer/TextContainer";
import Messages from "../Messages/Messages";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import { translateText, removeTextSpace, IUser, Message } from "../../services/translateService";
import "./Chat.css";
import { defaultRooms } from "../Join/Join";
import { useLocation, useParams } from "react-router-dom";

let socket: Socket;

const Chat: FC<{}> = ({}) => {
  const location = useLocation();
  const params = useParams();
  const [userName, setName] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [users, setUsers] = useState<IUser[]>([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const { name, roomId, lang } = queryString.parse(location.search);
    console.log(name, roomId, lang);
    const roomName: any = defaultRooms.find((r, i) => r.key === roomId);
    socket = io.connect("http://localhost:4000");
    setRoom(roomName.value);
    setName(name as string);

    socket.emit("join", { name, room: roomName.key as string, userLang: lang }, (error: any) => {
      if (error) {
        alert(error);
      }
    });
  }, [location.search]);

  useEffect(() => {
    const { name } = queryString.parse(location.search);
    socket.on("message", async (message: Message) => {
      let updateMsgObj = message;
      const toLang = JSON.parse(localStorage.getItem(removeTextSpace(name as string)) as string);
      if (message?.msgLang && message.msgLang !== toLang) {
        const trsRes = await translateText(message.text, message.msgLang, toLang);
        updateMsgObj = {
          text: trsRes.data[0]?.translations[0]?.text,
          user: message.user,
          msgLang: message.msgLang,
        };
      }
      setMessages((messages) => [...messages, updateMsgObj]);
    });

    socket.on("last_100_messages", async (last100Msgs: any) => {
      let prvMsg = JSON.parse(last100Msgs);
      prvMsg.reverse();
      // console.log(prvMsg);
      const toLang = JSON.parse(localStorage.getItem(removeTextSpace(name as string)) as string);
      prvMsg.map(async (msg: any) => {
        if (msg?.userLang && msg.userLang !== toLang) {
          const trsRes = await translateText(msg.message, msg.userLang, toLang);
          const updateMsgObj = {
            text: trsRes.data[0]?.translations[0]?.text,
            user: msg.username,
            msgLang: msg.userLang,
          };
          setMessages((messages) => [...messages, updateMsgObj]);
        } else {
          const updateMsgObj = {
            text: msg.message,
            user: msg.username,
            msgLang: msg.userLang,
          };
          setMessages((messages) => [...messages, updateMsgObj]);
        }
      });
    });

    socket.on("roomData", ({ users }: any) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = (event: any) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: any) => {
      e.preventDefault();
      e.returnValue = ""; // This is required for some browsers to display the custom message
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  return (
    <div className='outerContainer'>
      <div className='container'>
        <InfoBar room={room} name={userName} />
        <Messages messages={messages} name={userName} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
