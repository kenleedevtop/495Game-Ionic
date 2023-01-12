import { IonButton, IonCol, IonContent, IonGrid, IonPage, IonRow, IonToast, useIonAlert, useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import TextInput from '../components/NameInput';
import './Ready.scss';
import './Lobby.css'

interface ContainerProps {
  socket: any;
  id: any;
  name: any;
  setName: any;
  room: any;
  setRoom: any;
  admin: any;
}

const Ready: React.FC<ContainerProps> = ({ socket, id, room, setRoom, admin }) => {
  const history = useHistory();
  const [nickname, setNickName] = useState<string>("");
  // eslint-disable-next-line
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);
  const [players, setPlayers] = useState<any[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();
  const [kickedRoom, setKickedRoom] = useState<any>(null);
  const [kicked, setKicked] = useState(false);
  const [closedRoom, setClosedRoom] = useState<any>(null);
  const [closed, setClosed] = useState(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [startedRoom, setStartedRoom] = useState<any>(null);
  const [readyPlayers, setReadyPlayers] = useState<any>([]);

  let sockettime = 0;


  const handleApproveJoin = (name: any, socketid: any) => {
    socket.current.emit('response_join_room', { room, name, approve: true, socketid });
    sockettime=0
  }

  const handleDeniJoin = (name: any, socketid: any) => {
    socket.current.emit('response_join_room', { room, name, approve: false, socketid });
    sockettime=0
  }

  useEffect(() => {
    // @ts-ignore
    socket.current.on("request_join_room", (name, socketid) => {
      if (admin === id) {
        sockettime ++;
        if (sockettime === 1) {
          presentAlert({
            header: `Someone want to join.`,
            cssClass: 'custom-alert',
            buttons: [
              {
                text: 'Decline',
                role: 'cancel',
                cssClass: 'alert-button-cancel',
                handler: () => {
                  handleDeniJoin(name, socketid);
                },
              },
              {
                text: 'Approve',
                role: 'confirm',
                cssClass: 'alert-button-confirm',
                handler: () => {
                  handleApproveJoin(name, socketid)
                },
              },
            ],
          })
        }
      }
    });

    // @ts-ignore
    socket.current.on("player_names", (names) => {
      setPlayers(names);
    });

    // @ts-ignore
    socket.current.on("room_closed", (closed) => {
      setClosed(true);
      setClosedRoom(closed);
    });

    // @ts-ignore
    socket.current.on("kick_player", (name, kickedroom) => {
      if (name === id) {
        setKicked(true)
        setKickedRoom(kickedroom);
      }
    });

    // @ts-ignore
    socket.current.on("room_state", (started) => {
      setStarted(started);
    });

    // @ts-ignore
    socket.current.on("max_member", (count) => {
      setPlayerCount(count);
    });

    // @ts-ignore
    socket.current.on("start_game", (players, room) => {
      setStarted(true);
      setGameStarted(true);
      setStartedRoom(room);
      setReadyPlayers(players);
    });
    // @ts-ignore
    // eslint-disable-next-line 
  }, [socket.current]);


  useEffect(() => {
    if (kicked) {
      if (room === kickedRoom) {
        presentToast({
          message: `You have been kicked from room "${kickedRoom}" by the Admin.`,
          duration: 3000
        })
        handleBack();
        setKickedRoom(null);
        setKicked(false);
      }
    }
     // eslint-disable-next-line 
  }, [kicked, kickedRoom])

  useEffect(() => {
    if (closed) {
      if (room === closedRoom) {
        presentToast({
          message: `The room "${closedRoom}" has been closed by the Admin.`,
          duration: 3000
        })
        handleBack();
        setClosed(false);
        setClosedRoom(null);
      }
    }
     // eslint-disable-next-line 
  }, [ closed, closedRoom])

  useEffect(() => {
    if (gameStarted) {
      if (room === startedRoom) {
        presentToast({
          message: `The game has been started`,
          duration: 3000
        })
        handleJoin(readyPlayers);
        setGameStarted(false);
        setStartedRoom(null);
      }
    }
     // eslint-disable-next-line 
  }, [gameStarted, startedRoom])



  const handleStart = () => {
    const readyplayer = players.filter((player: any) => player.nickname.length > 0)
    if (readyplayer.length >= 2) {
      socket.current.emit('start_game', { room });
    } else {
      setShowAlert(true);
    }
  }

  const handleJoin = (newplayers: any) => {
    const me = newplayers.filter((player: any) => player.id === id);
    if (me.length > 0) {
      socket.current.emit('join_game_first', { room, id });
      setReady(false);
      history.push('/game')
    }
  }

  const handleStart1 = () => {
    socket.current.emit('join_game', { room, id });
    setReady(false);
    history.push('/game')
  }


  const handleReady = () => {
    socket.current.emit('ready', { room, id, nickname });
    setReady(true);
  }


  const handleBack = () => {
    socket.current.emit('leave_room', { name: id, room });
    socket.current.emit('join_lobby');
    setReady(false);
    setRoom("");
    history.push("/lobby")
  }

  const handleNickname = (event: any) => {
    const value = event.target.value;
    setNickName(value);
  }

  const handleKick = (id: any) => {
    socket.current.emit('kick_player', { name: id, room });
  }

  return (
    <IonPage className='readyPage'>
      <IonContent >
        <IonRow className='content'>
          <div className='container'>
            <div className='room-container'>
              <IonGrid >
                <IonRow className='room-item-title'>
                  <IonCol size="4">NUMBER OF PLAYERS</IonCol>
                  <IonCol size="7">
                    <div style={{ width: "100%" }}>{playerCount}</div>
                  </IonCol>
                  {
                    id === admin &&
                    <IonCol size="1">
                      <div style={{ width: "26px" }}>
                      </div>
                    </IonCol>
                  }
                </IonRow>
              </IonGrid>

              <IonGrid className='item-container'>
                {
                  players.map((item: any, index: any) => {
                    if (item.id === id) {
                      return (
                        <IonRow className='room-item' key={index}>
                          <IonCol size="4">PLAYER {index + 1}</IonCol>
                          <IonCol size="7">
                            <TextInput
                              elemenName='roomname'
                              labelStr=''
                              disable={ready}
                              type='text'
                              placeholder="NickName"
                              value={nickname}
                              onChange={handleNickname}
                            />
                          </IonCol>
                          {
                            id === admin &&
                            <IonCol size="1">
                              <div style={{ width: "100%" }}>
                              </div>
                            </IonCol>
                          }
                        </IonRow>
                      )
                    } else {
                      return (
                        <IonRow className='room-item' key={index}>
                          <IonCol size="4">PLAYER {index + 1}</IonCol>
                          <IonCol size="7">
                            <div style={{ width: "100%" }}>{item.nickname ? item.nickname : "Not Ready"}</div>
                          </IonCol>
                          {
                            id === admin &&
                            <IonCol size="1">
                              <div style={{ width: "100%" }} onClick={() => handleKick(item.id)}>
                                <img src="/assets/images/icon/kick-user.png" alt="light" />
                              </div>
                            </IonCol>
                          }
                        </IonRow>
                      )
                    }
                  })
                }
              </IonGrid>
            </div>
            <div className='btn-container'>
              <div className='logo'>
                <img src="/assets/icon/icon.png" alt="light" />
              </div>
              <div className='button-container'>
                {
                  !ready ?
                    <IonButton disabled={nickname === ""} className='color2' onClick={handleReady}><p>READY</p></IonButton>
                    :
                    <>
                      {
                        started ?
                          <IonButton className='color2' onClick={handleStart1}><p>JOIN</p></IonButton>
                          :
                          <IonButton className='color2' onClick={handleStart}><p>START</p></IonButton>
                      }
                    </>
                }
                <IonButton className='color3' onClick={handleBack}><p>LOBBY</p></IonButton>
              </div>
            </div>
          </div>
        </IonRow>
        <IonToast
          cssClass={'custom-class'}
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          message="A minimum of two ready players are required to start the game."
          duration={3000}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Ready;
