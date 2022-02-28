import { faBars, faHome, faHorse, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";

const Navigation = ({ userObj }) => {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <div>
        <div className="navbar">
          <Link to="#" className="menu-bars">
            <FontAwesomeIcon icon={faBars} onClick={showSidebar} color={"#B667F1"} />
          </Link>
          <Link to="/" className="menu-bars-img">
            <FontAwesomeIcon icon={faHome} size={"2x"} color={"#B667F1"} />
          </Link>
          <Link to="/profile" className="menu-bars-right">
            {userObj.photoURL ? (
              <img src={userObj.photoURL} />
            ) : (
              <img src={userObj.photoURL} />
            )}
          </Link>
        </div>

        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <FontAwesomeIcon icon={faXmark} color={"#B667F1"} />
              </Link>
            </li>

            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navigation;