import React, { useState, useEffect } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Navigation from "./Navigation";
import Footer from "./Footer";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => { // Browse my user info
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          displayName:user.displayName,
          uid:user.uid,
          photoURL:user.photoURL,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => { // Refresh user info
    const user = authService.currentUser;
    setUserObj({
      displayName:user.displayName,
      uid:user.uid,
      photoURL:user.photoURL,
      updateProfile: (args) => user.updateProfile(args),
    });
  };
  
  return (
    <>
      {init ? 
        <AppRouter 
          refreshUser={refreshUser} 
          isLoggedIn={Boolean(userObj)} 
          userObj={userObj} 
        /> : (
        <div className="appLoading">
          <FontAwesomeIcon 
            size={"4x"} 
            color={"#B667F1"} 
            icon={faSpinner} 
            spin
          />
        </div>
      )}

      <Footer />
    </>
  );
}

export default App;