import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import Trauma from "components/Trauma";
import TraumaFactory from "components/TraumaFactory";

const Home = ({ userObj }) => {
  const [traumas, setTraumas] = useState([]);

  useEffect(() => {
    dbService.collection("traumas").orderBy("createAt", "desc").onSnapshot((snapshot) => { // snapshot: when updating db, alarm this
      const traumaArray = snapshot.docs.map(doc => ({
        id: doc.id, 
        ...doc.data(),
      }));
      setTraumas(traumaArray);
    });
  }, []);

  return (
    <div className="container">
      <TraumaFactory userObj={userObj} />

      <div style={{ marginTop: 30 }}>
        {traumas.map((trauma) => (
          <Trauma 
            key={trauma.id} 
            traumaObj={trauma} 
            isOwner={trauma.creatorId === userObj.uid}
            userObj={userObj} 
          />
        ))}
      </div>
    </div>
  );
};
  
export default Home;