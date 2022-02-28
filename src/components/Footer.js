import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  const toYear = new Date().getFullYear();

  return (
    <>
      <footer>
        <div className="footerContainer">
          <div className="footerRow">
            <h5 className="footerTitle">Beautiful Trauma</h5>
            <h4 className="footerContent"><FontAwesomeIcon icon={faCopyright} /> {toYear} reserved by M.W.Na</h4>
          </div>
          <div className="footerRow">
            <h5 className="footerTitle">Provided By</h5>
            <h4 className="footerContent"><a href="https://ko.reactjs.org/">React</a></h4>
            <h4 className="footerContent"><a href="https://firebase.google.com/?hl=ko">Firebase</a></h4>
            <h4 className="footerContent"><a href="https://fontawesome.com/">Font Awesome</a></h4>
          </div>
          <div className="footerRow">
            <h5 className="footerTitle">Developer's Homepage</h5>
            <h4 className="footerContent"><a href="https://raadi.tistory.com/">Blog</a></h4>
            <h4 className="footerContent"><a href="https://github.com/roqhdehd502">Github</a></h4>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;