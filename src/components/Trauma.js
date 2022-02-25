
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt, faImage, faPlus } from "@fortawesome/free-solid-svg-icons";

const Trauma = ({ traumaObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTrauma, setNewTrauma] = useState(traumaObj.text);
  const [attachment, setAttachment] = useState("");

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
    // 변경시 기존 사진을 먼저 삭제하고
    if(attachment !== "") {
      await storageService.refFromURL(traumaObj.attachmentUrl).delete();
    }
     
    // 내용과 사진을 업로드 한다.
    let attachmentUrl = "";
    if(attachment !== "") {
      const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    await dbService.doc(`traumas/${traumaObj.id}`).update({
      text: newTrauma,
      attachmentUrl,
    }); // Find collection and field, then update this
    setAttachment("");
    setEditing(false);
  }

  const onChange = (event) => {
    const { 
      target: { value },
    } = event;
    setNewTrauma(value);
  };

  const onFileChange = (event) => { // File uplaod event
    const { 
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => setAttachment("");

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
    <>
      {isOwner && (
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
                {traumaObj.attachmentUrl && (
                  <img src={traumaObj.attachmentUrl} width={50} />
                )}
                <label htmlFor="attach-file" className="factoryInput__label" style={{ textAlign:"center", marginTop:10 }}>
                  <FontAwesomeIcon size="2x" icon={faImage} />&nbsp;
                  <FontAwesomeIcon size="sm" icon={faPlus} />
                </label>
                <input
                  id="attach-file"
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  style={{
                    opacity: 0,
                  }}
                />
                {attachment && (
                  <div className="factoryForm__attachment">
                    <img
                      src={attachment}
                      style={{
                        backgroundImage: attachment,
                      }}
                    />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                      <FontAwesomeIcon size="2x" icon={faTimes} />
                    </div>
                  </div>
                )}
                <input type="submit" value="수정하기" className="formBtn" />
              </form>
              <span onClick={toggleEditing} className="formBtn cancelBtn">
                취소
              </span>
            </>
          ) : (
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
        </div> 
      )}
    </>
  );
};

export default Trauma;