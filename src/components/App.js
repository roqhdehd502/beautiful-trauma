import React, { useState, useEffect } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

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
        /> : 
        "초기화중..."
      }
      <footer>&copy; {new Date().getFullYear()} Beautiful Trauma</footer>
    </>
  );
}

export default App;