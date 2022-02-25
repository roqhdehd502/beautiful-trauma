
import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt, faImage, faPlus } from "@fortawesome/free-solid-svg-icons";

const Trauma = ({ traumaObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTrauma, setNewTrauma] = useState(traumaObj.text);

  const onDeleteClick = async () => { // DELETE
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if(ok) {
      await dbService.doc(`traumas/${traumaObj.id}`).delete(); // Find collection and field, then delete this
      await storageService.refFromURL(traumaObj.attachmentUrl).delete();
    }
  }

  const toggleEditing = () => setEditing(prev => !prev);

  const onSubmit = async (event) => { // UPDATE
    event.preventDefault();
    await dbService.doc(`traumas/${traumaObj.id}`).update({
      text: newTrauma,
    }); // Find collection and field, then update this
    setEditing(false);
  }

  const onChange = (event) => {
    const { 
      target: { value },
    } = event;
    setNewTrauma(value);
  };

  function convertTime(createAt) {
    let presTime = Date.now()-createAt;
    if(presTime < 60000) { // sec
      presTime = Math.floor(presTime / 1000);
      return presTime + "초 전";
    } else if(presTime < 3600000) { // min
      presTime = Math.floor(presTime / 60000);
      return presTime + "분 전";
    } else if(presTime < 86400000) { // hour
      presTime = Math.floor(presTime / 3600000);  
      return presTime + "시간 전";
    } else if(presTime < 604800000) { // day
      presTime = Math.floor(presTime / 86400000);
      return presTime + "일 전";
    } else if(presTime < 2629700000) { // week
      presTime = Math.floor(presTime / 604800000);
      return presTime + "주 전";
    } else if(presTime < 31556952000) { // month
      presTime = Math.floor(presTime / 2629700000);
      return presTime + "달 전";
    } else { // year
      presTime = Math.floor(presTime / 31556952000);
      return presTime + "년 전";
    }
  }

  return (
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input 
              type="text" 
              placeholder="수정" 
              value={newTrauma} 
              required
              onChange={onChange}
              autoFocus
              className="formInput"
            />
            {/* 파일 업로드 기능 구현하기 */}
            {/* <label htmlFor="attach-file" className="factoryInput__label" style={{ textAlign:"center", marginTop:10 }}>
              <FontAwesomeIcon size="2x" icon={faImage} />&nbsp;
              <FontAwesomeIcon size="sm" icon={faPlus} />
            </label> */}
            <input type="submit" value="수정하기" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            취소
          </span>
        </>
      ) : (
        <>
          {isOwner && (
          <>
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon color={"#B667F1"} icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon color={"#B667F1"} icon={faPencilAlt} />
              </span>
            </div>
            <br />
            <div>
              <h5>{convertTime(traumaObj.createAt)}</h5>
              <h4>{traumaObj.text}</h4>
              {traumaObj.attachmentUrl && (
                <img src={traumaObj.attachmentUrl} />
              )}
            </div>
          </>
          )}
        </>
      )} 
    </div> 
  );
};

export default Trauma;