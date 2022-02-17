import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import Trauma from "components/Trauma";


const Home = ({ userObj }) => {
  const [trauma, setTrauma] = useState("");
  const [traumas, setTraumas] = useState([]);
  const [attachment, setAttachment] = useState("");

  useEffect(() => {
    dbService.collection("traumas").onSnapshot((snapshot) => { // snapshot: when updating db, alarm this
      const traumaArray = snapshot.docs.map(doc => ({
        id: doc.id, 
        ...doc.data(),
      }));
      setTraumas(traumaArray);
    });
  }, []);

  const onSubmit = async (event) => { // CREATE
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
  };

  const onChange = (event) => { // Write Event
    const { 
      target:{value}, 
    } = event;
    setTrauma(value);
  };

  const onFileChange = (event) => {
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

  const getTraumas = async () => { // READ
    const dbTraumas = await dbService.collection("traumas").get();
    dbTraumas.forEach((document) => {
      const traumaObject = {
        ...document.data(),
        id: document.id,
      };
      setTraumas((prev) => [traumaObject, ...prev]);
    });
  }

  const onClearAttachment = () => setAttachment(null);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input value={trauma} onChange={onChange} type="text" placeholder="당신의 생각을 담아주세요" maxLength={120} />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="등록" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>X</button>
          </div>
        )} 
      </form>

      <div>
        {traumas.map((trauma) => (
          <Trauma 
            key={trauma.id} 
            traumaObj={trauma} 
            isOwner={trauma.creatorId === userObj.uid} 
          />
        ))}
      </div>
    </div>
  );
};
  
export default Home;