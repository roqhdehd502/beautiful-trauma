import React from "react";
import { authService, firebaseInstance } from "fbase";
import AuthForm from "components/AuthForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";

const Auth = () => {
  
  const onSocialClick = async (event) => { // SOCIAL LOGIN
    const {
      target: { name },
    } = event;
    let provider;

    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }

    const data = await authService.signInWithPopup(provider);
    console.log(data);
  };

  return (
    <div className="authContainer">
      <FontAwesomeIcon className="authHome" size="4x" color={"#B667F1"} icon={faLock} />

      <AuthForm />

      <div className="authBtns">
        <button onClick={onSocialClick} name="google" className="authBtn">
          <FontAwesomeIcon size="2x" color={"#B667F1"} icon={faGoogle} /><br/>
        </button>
        <button onClick={onSocialClick} name="github" className="authBtn">
          <FontAwesomeIcon size="2x" color={"#B667F1"} icon={faGithub} /><br/>
        </button>
      </div>
    </div>
  );
}

export default Auth;