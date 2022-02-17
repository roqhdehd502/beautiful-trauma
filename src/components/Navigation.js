import React from "react";
import { Link } from "react-router-dom";

const Navigation = ({ userObj }) => (
  <nav>
   <ul>
     <li>
       <Link to="/">홈</Link>
     </li>
     <li>
       {/* 나중에 프로필 사진도 첨부할 것: photoURL */}
       <Link to="/profile">{userObj.displayName}</Link>
     </li>
   </ul>
  </nav>

);

export default Navigation;