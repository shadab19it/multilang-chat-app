import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import { removeTextSpace } from "../../services/translateService";

import "./Join.css";

export const defaultRooms = [
  {
    key: "classroom1",
    value: "Classroom 1 Traninig",
  },
  {
    key: "classroom2",
    value: "Classroom 2 Traninig",
  },
  {
    key: "classroom3",
    value: "Classroom 3 Traninig",
  },
  {
    key: "classroom4",
    value: "Classroom 4 Traninig",
  },
  {
    key: "classroom5",
    value: "Classroom 5 Traninig",
  },
];
const SignIn: FC = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [userLang, setUserLang] = useState("en");

  const onSelectRoom = (e: any) => {
    const roomName = e.target.value;
    setRoom(roomName);
  };

  return (
    <div className='joinOuterContainer'>
      <div className='joinInnerContainer'>
        <h1 className='heading'>Join Tutor Chat Room</h1>
        <div>
          <input placeholder='Name' className='joinInput' type='text' onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <select className='joinInput mt-20' onChange={onSelectRoom}>
            <option>Select Room</option>
            {defaultRooms.map((r, i) => {
              return (
                <option value={r.key} key={i}>
                  {r.value}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <select
            className='joinInput mt-20'
            onChange={(e) => {
              if (!name) return alert("Please enter you name first");
              setUserLang(e.target.value);
              localStorage.setItem(removeTextSpace(name), JSON.stringify(e.target.value));
            }}>
            <option>Select Language</option>
            <option value='en'>English</option>
            <option value='ar'>عربي (Arabic)</option>
            <option value='fr'>française (French)</option>
            <option value='ko'>한국인 (Korean)</option>
            <option value='zh-Hans'>中国人 (Chinese)</option>
          </select>
        </div>
        <Link onClick={(e) => (!name || !room ? e.preventDefault() : null)} to={`/chat?name=${name}&roomId=${room}&lang=${userLang}`}>
          <button className={"button mt-20"} type='submit'>
            Join
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
