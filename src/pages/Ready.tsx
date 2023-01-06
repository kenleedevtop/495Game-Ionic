import { IonButton, IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react';
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

const Ready: React.FC<ContainerProps> = ({ socket, id , room}) => {
  const history = useHistory();
  const [nickname, setNickName] = useState<string>("");
  // eslint-disable-next-line
  const [start, setStart] = useState(false);
  const [ready, setReady] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    // @ts-ignore
    socket.current.on("player_names", (names) => {
      setPlayers(names);
    });
    // @ts-ignore
    socket.current.on("max_member", (count) => {
      setPlayerCount(count);
    });
    socket.current.on("start_game", () => {
      setStart(true);
    });
    // @ts-ignore
    // eslint-disable-next-line 
  }, [socket.current]);

  const handleStart = () => {
    history.push('/game')
  }

  const handleReady = () => {
    socket.current.emit('ready', {room, id, nickname});
    setReady(true);
  }


  const handleBack = () => {
    socket.current.emit('join_lobby');
    socket.current.emit('leave_room', {name: id, room});
    setReady(false);
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
                  <IonButton  className='color2' onClick={handleStart}><p>START</p></IonButton>
                }
                <IonButton className='color3' onClick={handleBack}><p>LOBBY</p></IonButton>
              </div>
            </div>
          </div>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Ready;
