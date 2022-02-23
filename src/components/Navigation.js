import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import BTLogo from "../BTLogo.png";

const Navigation = ({ userObj }) => (
  <nav>
   <ul style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
     <li>
        <Link to="/" style={{ marginRight: 10 }}>
          <img src={BTLogo} width="40px" height="40px" />
        </Link>
     </li>
     <li>
       {/* 나중에 프로필 사진도 첨부할 것: photoURL */}
       <Link
          to="/profile"
          style={{
            marginLeft: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: 12,
          }}
        >
          <FontAwesomeIcon icon={faUser} color={"#B667F1"} size="2x" />
          <span style={{ marginTop: 10 }}>
            {userObj.displayName
              ? `${userObj.displayName}`
              : "프로필"}
          </span>
        </Link>  
     </li>
   </ul>
  </nav>

);

export default Navigation;