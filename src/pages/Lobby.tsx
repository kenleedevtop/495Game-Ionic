import { IonButton, IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import './Lobby.scss';

const Lobby: React.FC = () => {
  const history = useHistory();
  const [selectedRoom, setSelectedRoom] = useState("");

  const handleJoin = () => {
    history.push("/ready")
  }

  const handleBack = () => {
    history.push("/home")
  }

  const handleSelectRoom = (room: any) => {
    setSelectedRoom(room);
  }

  const rooms = ["World of Star", "Strong Man", "Powerful Team", "Friend of Me", "Combat Team", "World of Star1", "Strong Man1", "Powerful Team1", "Friend of Me1", "Combat Team1", "World of Star2", "Strong Man2", "Powerful Team2", "Friend of Me2", "Combat Team2", "World of Star12", "Strong Man12", "Powerful Team12", "Friend of Me12", "Combat Team12"]

  return (
    <IonPage className='lobbyPage'>
      <IonContent >
        <IonRow className='content'>
          {/* <div className='title-container'>
            <p className='title'>49O</p>
          </div> */}
          <div className='container'>
            <div className='room-container'>
              <IonGrid >
                <IonRow className='room-item-title'>
                  <IonCol>Room Name</IonCol>
                  <IonCol size="auto">
                    <div style={{ width: "150px" }}>Members</div>
                  </IonCol>
                </IonRow>
              </IonGrid>

              <IonGrid className='item-container'>
                {
                  rooms.map((room: any, index: any) => {
                    let classname = "room-item"
                    if (room === selectedRoom) {
                      classname = "active-room-item"
                    } else {
                      if (index % 2 === 0) {
                        classname = "room-item"
                      } else {
                        classname = "room-item-odd"
                      }
                    }
                    return (
                      <IonRow className={classname} onClick={() => handleSelectRoom(room)}>
                        <IonCol>{room}</IonCol>
                        <IonCol size="auto">
                          <div style={{ width: "150px" }}>8</div>
                        </IonCol>
                      </IonRow>
                    )
                  })
                }
              </IonGrid>
            </div>
            <div className='btn-container'>
              <div className='logo'>
                <img src="/assets/icon/icon.png" alt="light" />
              </div>
              <div className='button-container'>
                <IonButton disabled={selectedRoom === ""} className='color2' onClick={handleJoin}><p>JOIN</p></IonButton>
                <IonButton className='color3' onClick={handleBack}><p>HOME</p></IonButton>
              </div>
            </div>
          </div>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Lobby;
