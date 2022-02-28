import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const TraumaFactory = ({ userObj }) => {
  const [trauma, setTrauma] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (event) => { // CREATE
    if (trauma === "") { return; }
    event.preventDefault();
    let attachmentUrl = "";
    if(attachment !== "") {
      const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const traumaObj = {
      text: trauma,
      createAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    }
    await dbService.collection("traumas").add(traumaObj);
    setTrauma("");
    setAttachment("");
  };

  const placeholder = `${userObj.displayName}님의 이야기를 적어주세요`;

  const onChange = (event) => { // Write event
    const { 
      target:{value}, 
    } = event;
    setTrauma(value);
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

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={trauma}
          onChange={onChange}
          type="text"
          placeholder={placeholder}
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label"> 
        <FontAwesomeIcon size="2x" icon={faImage} />&nbsp;
        <FontAwesomeIcon size="sm" icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{ opacity: 0, }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{ backgroundImage: attachment }}
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <FontAwesomeIcon size="2x" icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default TraumaFactory;