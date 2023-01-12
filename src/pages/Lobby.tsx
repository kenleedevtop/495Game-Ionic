import { IonButton, IonCol, IonContent, IonGrid, IonLoading, IonPage, IonRow, useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import './Lobby.scss';
import './Lobby.css';

interface ContainerProps {
  socket: any;
  id: any;
  name: any;
  setName: any;
  room: any;
  setRoom: any;
}

const Lobby: React.FC<ContainerProps> = ({ socket, id, setRoom, room }) => {
  const history = useHistory();
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomNames, setRoomNames] = useState<string[]>([])
  const [showLoading, setShowLoading] = useState(false);
  const [presentToast] = useIonToast();
  const [approvedRoom, setApprovedRoom] = useState<any>(null)
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    // @ts-ignore
    socket.current.on("room_list", (room_list) => {
      const roms: any = []
      const romnames: any = [];
      Object.keys(room_list).forEach(function (key, index) {
        const currentroom = room_list[key]
        if (currentroom['maxMembers'] > currentroom['currentMembers'] && currentroom['start'] === false) {
          roms.push(room_list[key]);
          romnames.push(key);
        }
      });
      setRooms(roms);
      setRoomNames(romnames);
    });

    // @ts-ignore
    socket.current.on("response_join_room_fail", (message) => {
      presentToast({
        message: message,
        duration: 3000
      })
    });
    // @ts-ignore
    socket.current.on("response_join_room", (newroom, name, approve) => {
      if (name === id) {
        if (approve) {
          setApprovedRoom(newroom);
          setApproved(true);
        } else {
          setApprovedRoom(newroom);
          setApproved(false);
        }
      }
    });

    // @ts-ignore
    // eslint-disable-next-line
  }, [socket.current]);

  useEffect(() => {
    socket.current.emit('join_lobby');
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (showLoading) {
      if (approved) {
        if (room === approvedRoom) {
          presentToast({
            message: `The Admin of room "${approvedRoom}" has approved your join request.`,
            duration: 3000
          })
          joinRoom(approvedRoom)
          setApproved(false);
          setApprovedRoom(null);
          setShowLoading(false);
        }
      } else {
        if (room === approvedRoom) {
          presentToast({
            message: `The Admin of room "${approvedRoom}" has declined your join request.`,
            duration: 3000
          })
          setApprovedRoom(null);
          setShowLoading(false);
        }
      }
    } else {
      setApproved(false);
      setApprovedRoom(null);
      setShowLoading(false);
    }
    // eslint-disable-next-line 
  }, [approvedRoom, approved])



  const joinRoom = (newroom: any) => {
    socket.current.emit('join_room', { room: newroom, name: id, member: 8 });
    history.push("/ready")
  }

  const handleJoin = () => {
    setShowLoading(true);
    socket.current.emit('request_join_room', { room, name: id });
    setTimeout(() => {
        setShowLoading(false);
        // presentToast({
        //   message: `The Admin does not respond to the join request. \n Please try again later.`,
        //   duration: 3000
        // })
    }, 20000);
  }

  const handleBack = () => {
    history.push("/home")
  }

  const handleSelectRoom = (room: any) => {
    setRoom(room);
  }
  return (
    <IonPage className='lobbyPage'>
      <IonContent >
        <IonRow className='content'>
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
                  roomNames.map((roomitem: any, index: any) => {
                    let classname = "room-item"
                    if (roomitem === room) {
                      classname = "active-room-item"
                    } else {
                      if (index % 2 === 0) {
                        classname = "room-item"
                      } else {
                        classname = "room-item-odd"
                      }
                    }
                    return (
                      <IonRow key={index} className={classname} onClick={() => handleSelectRoom(roomitem)}>
                        <IonCol>{roomitem}</IonCol>
                        <IonCol size="auto">
                          <div style={{ width: "150px" }}>{rooms[index].maxMembers}</div>
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
                <IonButton disabled={room === ""} className='color2' onClick={handleJoin}><p>JOIN</p></IonButton>
                <IonButton className='color3' onClick={handleBack}><p>HOME</p></IonButton>
              </div>
            </div>
          </div>
        </IonRow>
        <IonLoading
          cssClass='custom-loading'
          isOpen={showLoading}
          spinner='bubbles'
          onDidDismiss={() => setShowLoading(false)}
          message={'Please wait for the admin to approve it'}
        />
      </IonContent>
    </IonPage>
  );
};

export default Lobby;
