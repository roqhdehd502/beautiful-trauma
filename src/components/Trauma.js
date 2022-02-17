import { dbService, storageService } from "fbase";
import React from "react";
import { useState } from "react";

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
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input 
              type="text" 
              placeholder="수정" 
              value={newTrauma} 
              required
              onChange={onChange}
            />
            <input type="submit" value="수정하기" />
          </form>
          <button onClick={toggleEditing}>취소</button>
        </>
      ) : (
        <>
          <h4>{traumaObj.text}</h4>
          {traumaObj.attachmentUrl && 
            <img src={traumaObj.attachmentUrl} width="50px" height="50px" />
          }
          {isOwner && (
          <>
            <button onClick={onDeleteClick}>삭제</button>
            <button onClick={toggleEditing}>수정</button>
          </>
          )}
        </>
      )} 
    </div> 
  );
};

export default Trauma;