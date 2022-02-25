import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { authService, dbService } from "fbase";

export default ({ refreshUser, userObj }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogOutClick = () => { // Logout
    authService.signOut();
    history.push("/");
  };

  const onChange = (event) => { // Write event
    const {
      target: {value},
    } = event;
    setNewDisplayName(value);
  }

  const getMyTraumas = async() => { // Read my trauma
    const traumas = await dbService
      .collection("traumas")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt", "desc")
      .get(); // Data Query
    // console.log(traumas.docs.map((doc) => doc.data()));
  };

  useEffect(() => {
    getMyTraumas();
  }, []);

  const onSubmit = async (event) => { // Update profile
    event.preventDefault();
    if(userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  }

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input 
          onChange={onChange}
          type="text" 
          placeholder="프로필 이름"
          value={newDisplayName}
          autoFocus
          className="formInput"
        />
        <input
          type="submit"
          value="프로필 변경"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        로그아웃 
      </span>
      <>
        {getMyTraumas}
      </>
    </div>
  );
};