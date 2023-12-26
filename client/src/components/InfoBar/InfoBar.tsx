import { FC } from "react";

import onlineIcon from "../../icons/onlineIcon.png";
import closeIcon from "../../icons/closeIcon.png";

import "./InfoBar.css";

const InfoBar: FC<{ room: string; name: string }> = ({ room, name }) => {
  return (
    <div className='infoBar'>
      <div className='leftInnerContainer'>
        <img className='onlineIcon' src={onlineIcon} alt='online icon' />
        <h3>{room}</h3>
        <h4>{name}</h4>
      </div>
      <div className='rightInnerContainer'>
        <a href='/'>
          <img src={closeIcon} alt='close icon' />
        </a>
      </div>
    </div>
  );
};

export default InfoBar;
