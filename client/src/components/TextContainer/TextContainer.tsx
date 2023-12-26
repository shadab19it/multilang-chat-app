import React, { FC } from "react";

import onlineIcon from "../../icons/onlineIcon.png";

import "./TextContainer.css";
import { transLanguages, removeTextSpace, IUser } from "../../services/translateService";

const TextContainer: FC<{ users: IUser[] }> = ({ users }) => {
  return (
    <div className='textContainer'>
      <div>
        <h1>
          Tutor Chat App with multiple language
          <span role='img' aria-label='emoji'>
            💬
          </span>
        </h1>
        <h2>
          Try it out right now!
          <span role='img' aria-label='emoji'>
            ⬅️
          </span>
        </h2>
      </div>
      {users ? (
        <div>
          <h1>People currently joined:</h1>
          <div className='activeContainer'>
            <h2>
              {users.map(({ name }) => (
                <div key={name} className='activeItem'>
                  <span>{name}</span>
                  <img alt='Online Icon' src={onlineIcon} />{" "}
                  <span>
                    {transLanguages.find((l) => l.key === JSON.parse(localStorage.getItem(removeTextSpace(name)) as string))?.value}
                  </span>
                </div>
              ))}
            </h2>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TextContainer;
