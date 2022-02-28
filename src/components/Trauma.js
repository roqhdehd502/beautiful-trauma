
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt, faImage, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const Trauma = ({ traumaObj, isOwner, userObj }) => {
  const [editing, setEditing] = useState(false);
  const [newTrauma, setNewTrauma] = useState(traumaObj.text);
  const [newAttachment, setNewAttachment] = useState("");

  const onDeleteClick = async () => { // DELETE
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if(ok) {
      await dbService.doc(`traumas/${traumaObj.id}`).delete(); // Find collection and field, then delete this
      await storageService.refFromURL(traumaObj.attachmentUrl).delete();
    }
  }

  const toggleEditing = () => setEditing(prev => !prev);

  const onSubmit = async (event) => { // UPDATE
    if (newTrauma === "") { return; }
    event.preventDefault();
    let newAttachmentUrl = "";
    if(newAttachment !== "") {
      if(traumaObj.attachmentUrl !== "") {
        await storageService.refFromURL(traumaObj.attachmentUrl).delete();
      }
      const newAttachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const newResponse = await newAttachmentRef.putString(newAttachment, "data_url");
      newAttachmentUrl = await newResponse.ref.getDownloadURL();
    } else {
      newAttachmentUrl = traumaObj.attachmentUrl;
    }
    const newTraumaObj = {
      text: newTrauma,
      attachmentUrl: newAttachmentUrl,
    }
    await dbService.doc(`traumas/${traumaObj.id}`).update(newTraumaObj); // Find collection and field, then update this
    setNewAttachment("");
    setEditing(false);
  }

  const onChange = (event) => {
    const { 
      target: { value },
    } = event;
    setNewTrauma(value);
  };

  const onNewFileChange = (event) => { // Update file uplaod event
    const { 
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setNewAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearNewAttachment = () => setNewAttachment("");

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
        <div className="trauma">
          {editing ? (
            <>
              <form onSubmit={onSubmit} className="container traumaEdit">
                <input 
                  type="text" 
                  placeholder="수정할 이야기를 적어주세요" 
                  value={newTrauma} 
                  required
                  onChange={onChange}
                  autoFocus
                  className="formInput"
                />
                {traumaObj.attachmentUrl && (
                  <img src={traumaObj.attachmentUrl} width={50} />
                )}
                <label htmlFor="new-attach-file" className="trauma__label">
                  <FontAwesomeIcon size="2x" icon={faImage} />&nbsp;
                  <FontAwesomeIcon size="sm" icon={faPlus} />
                </label>
                <input
                  id="new-attach-file"
                  type="file"
                  accept="image/*"
                  onChange={onNewFileChange}
                  style={{
                    opacity: 0,
                  }}
                />
                {newAttachment && (
                  <div className="trauma__newAttachment">
                    <img
                      src={newAttachment}
                      style={{
                        backgroundImage: newAttachment,
                      }}
                    />
                    <div className="trauma__clear" onClick={onClearNewAttachment}>
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
              <div className="trauma__actions">
                <span onClick={onDeleteClick}>
                  <FontAwesomeIcon color={"#B667F1"} icon={faTrash} />
                </span>
                <span onClick={toggleEditing}>
                  <FontAwesomeIcon color={"#B667F1"} icon={faPencilAlt} />
                </span>
              </div>
              <br />
              <div>
                <h5 className="trauma__createAt">{convertTime(traumaObj.createAt)}</h5>
                <h4 className="trauma__content">{traumaObj.text}</h4>
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