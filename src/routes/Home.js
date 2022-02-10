import { dbService } from "fbase";
import React from "react";
import { useState, useEffect } from "react";

const Home = ({ userObj }) => {
  const [trauma, setTrauma] = useState("");
  const [traumas, setTraumas] = useState([]);

  useEffect(() => {
    dbService.collection("traumas").onSnapshot((snapshot) => {
      const traumaArray = snapshot.docs.map(doc => ({
        id: doc.id, 
        ...doc.data(),
      }));
      setTraumas(traumaArray);
    });
  }, []);

  const onSubmit = async (event) => { // CREATE
    event.preventDefault();
    await dbService.collection("traumas").add({ 
      text: trauma,
      createAt: Date.now(),
      creatorId: userObj.uid,
    });
    setTrauma("");
  };

  const onChange = (event) => { // Write Event
    const { 
      target:{value}, 
    } = event;
    setTrauma(value);
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

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input value={trauma} onChange={onChange} type="text" placeholder="당신의 생각을 담아주세요" maxLength={120}></input>
        <input type="submit" value="등록"></input>
      </form>

      <div>
        {traumas.map((trauma) => (
          <div key={trauma.id}>
            <h4>{trauma.text}</h4>
          </div>  
        ))}
      </div>
    </div>
  );
};
  
export default Home;