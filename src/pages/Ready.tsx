import { IonButton, IonCol, IonContent, IonGrid, IonPage, IonRow, IonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import TextInput from '../components/TextInput';
import './Ready.scss';

interface ContainerProps {
  socket: any;
  id: any;
  name: any;
  setName: any;
  room: any;
  setRoom: any;
}

const Ready: React.FC<ContainerProps> = ({ socket, id, room, setRoom }) => {
  const history = useHistory();
  const [nickname, setNickName] = useState<string>("");
  // eslint-disable-next-line
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);
  const [players, setPlayers] = useState<any[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // @ts-ignore
    socket.current.on("player_names", (names) => {
      setPlayers(names);
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
    socket.current.on("start_game", (players) => {
      handleJoin(players);
    });
    // @ts-ignore
    // eslint-disable-next-line 
  }, [socket.current]);



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
      socket.current.emit('join_game', { room , id});
      setReady(false);
      history.push('/game')
    }
  }

  const handleStart1 = () => {
    const readyplayer = players.filter((player: any) => player.nickname.length > 0)
    if (readyplayer.length >= 2) {
      socket.current.emit('join_game', { room });
      setReady(false);
      history.push('/game')
    } else {
      setShowAlert(true);
    }
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

  return (
    <IonPage className='readyPage'>
      <IonContent >
        <IonRow className='content'>
          <div className='container'>
            <div className='room-container'>
              <IonGrid >
                <IonRow className='room-item-title'>
                  <IonCol>NUMBER OF PLAYERS</IonCol>
                  <IonCol size="auto">
                    <div style={{ width: "261px" }}>{playerCount}</div>
                  </IonCol>
                </IonRow>
              </IonGrid>

              <IonGrid className='item-container'>
                {
                  players.map((item: any, index: any) => {
                    if (item.id === id) {
                      return (
                        <IonRow className='room-item' key={index}>
                          <IonCol>PLAYER {index + 1}</IonCol>
                          <IonCol size="auto">
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
                        </IonRow>
                      )
                    } else {
                      return (
                        <IonRow className='room-item' key={index}>
                          <IonCol>PLAYER {index + 1}</IonCol>
                          <IonCol size="auto">
                            <div style={{ width: "261px" }}>{item.nickname ? item.nickname : "Not Ready"}</div>
                          </IonCol>
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
