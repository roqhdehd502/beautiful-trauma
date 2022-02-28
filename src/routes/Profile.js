import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { authService, dbService } from "fbase";

export default ({ refreshUser, userObj }) => {
  const history = useHistory();
  const [proEditing, setProEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogOutClick = () => { // Logout
    authService.signOut();
    history.push("/");
  };

  const toggleProEditing = () => setProEditing(prev => !prev);

  const onChange = (event) => { // Write event
    const {
      target: {value},
    } = event;
    setNewDisplayName(value);
  };

  const getMyTraumas = async() => { // Read my trauma data
    const traumas = await dbService
      .collection("traumas")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt", "desc")
      .get(); // Data Query
  };

  useEffect(() => {
    getMyTraumas();
  }, []);

  const onSubmit = async (event) => { // Update profile
    event.preventDefault();
    if(newDisplayName === "") {
      return ;
    }
    if(userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
      setProEditing(false);
    }
  }

  return (
    <div className="container">
      <div className="profile__row">
        <Link to="/profile">
          {userObj.photoURL ? (
            <span className="profile__profile">
              <img src={userObj.photoURL} />
            </span>
          ) : (
            <span className="profile__profile">
              <img src={userObj.photoURL} />
            </span>
          )}
        </Link>
      </div>

      {proEditing ? (
        <>
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
            />
            <span onClick={toggleProEditing} className="formBtn cancelBtn">
              취소
            </span>
          </form>
        </>
      ) : (
        <>
          <div className="profileForm">
            <span 
              className="formBtn" 
              onClick={toggleProEditing}
            >
              {userObj.displayName}님의 프로필 변경 
            </span>
          </div>
        </>
      )}
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        로그아웃 
      </span>
    </div>
  );
};