
import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
            <input type="submit" value="수정하기" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            취소
          </span>
        </>
      ) : (
        <>
          <h4>{traumaObj.text}</h4>
          {traumaObj.attachmentUrl && <img src={traumaObj.attachmentUrl} />}
          {isOwner && (
          <div className="nweet__actions">
            <span onClick={onDeleteClick}>
              <FontAwesomeIcon icon={faTrash} />
            </span>
            <span onClick={toggleEditing}>
              <FontAwesomeIcon icon={faPencilAlt} />
            </span>
          </div>
          )}
        </>
      )} 
    </div> 
  );
};

export default Trauma;