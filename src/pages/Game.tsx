import { IonButton, IonCol, IonContent, IonGrid, IonPage, IonRow, IonToast, useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import TextInput from '../components/TextInput';
import './Game.scss';

interface ContainerProps {
  socket: any;
  id: any;
  name: any;
  setName: any;
  room: any;
  setRoom: any;
}

const Game: React.FC<ContainerProps> = ({ socket, id, room, setRoom }) => {
  const [roll, setRoll] = useState<any>(0);
  const [factor, setFactor] = useState<any>(0);
  const [selectedPlayer, setSelectPlayer] = useState<string>("");
  const [value, setValue] = useState<number>(490);
  const [realValue, setRealValue] = useState<string>("49O")
  const [showAlert, setShowAlert] = useState(false);

  const [players, setPlayers] = useState([]);
  const [playerDebts, setPlayerDebts] = useState([]);
  const [currentTurn, setCurrentTurn] = useState("");
  const [myTurn, setMyTurn] = useState(false);

  const [presentToast] = useIonToast();

  const history = useHistory();

  useEffect(() => {
    // @ts-ignore
    socket.current.on("game_players", (players) => {
      setPlayers(players);
    });
    // @ts-ignore
    socket.current.on("player_debts", (debts) => {
      const myDebt = debts.filter((item: any) => item.id === id);
      setValue(myDebt[0].debt);
      let strValue = myDebt[0].debt.toString();
      strValue = strValue.replace(/0/g, 'O');
      strValue = strValue.replace(/1/g, 'l');
      setRealValue(strValue);
      setPlayerDebts(debts);
    });

    // @ts-ignore
    socket.current.on("your_turn", (newplayers, player_id) => {
      setPlayers(newplayers);
      const turnedPlayer: any = newplayers.filter((player: any) => player.id === player_id)
      if (player_id === id) {
        setCurrentTurn("You");
      } else {
        setCurrentTurn(turnedPlayer[0].nickname);
      }
      if (player_id === id) {
        setMyTurn(true);
      } else {
        setMyTurn(false);
      }
    });

    // @ts-ignore
    socket.current.on("forgive", (newid, amount, players) => {
      let Prefix = "";
      if (newid === id) {
        Prefix = "You"
      } else {
        const player = players.filter((item: any) => item.id === newid);
        Prefix = player[0].nickname
      }
      presentToast({
        message: `${Prefix} forgived ${amount} of debts`,
        duration: 3000
      })
    });

    // @ts-ignore
    socket.current.on("update", (message) => {
      presentToast({
        message: message,
        duration: 3000
      })
    });

    // @ts-ignore
    socket.current.on("transgress", (from, to, amount, players) => {
      let Prefix = "";
      let Subfix = "";
      if (to === id) {
        Prefix = "You"
      } else {
        const player = players.filter((item: any) => item.id === to);
        Prefix = player[0].nickname
      }
      if (from === id) {
        Subfix = "You"
      } else {
        const player = players.filter((item: any) => item.id === to);
        Subfix = player[0].nickname
      }
      presentToast({
        message: `${Subfix} transgressed ${amount} of debts to ${Prefix}`,
        duration: 3000
      })
    });

    // @ts-ignore
    socket.current.on("end_game", (message) => {
      presentToast({
        message: message,
        duration: 3000
      })
      // history.push('/lobby')
      setRoom("");
    });
    //eslint-disable-next-line
  }, [socket.current])

  const handleForgive = () => {
    const sum = parseInt(roll) * parseInt(factor);
    let subValue = value - sum;
    if (subValue <= 0) {
      subValue = 0;
    }
    socket.current.emit("forgive", { id, room, amount: sum, debt: subValue });
    socket.current.emit("turn_over", { room });
    if (subValue === 0) {
      socket.current.emit('success_game', { name: id, room });
      history.push('/over')
    }
  }

  const handleTransgress = () => {
    if (selectedPlayer) {
      const sum = parseInt(roll) * parseInt(factor);
      const othervalue: any = playerDebts.filter((item: any) => item.id === selectedPlayer)
      let subValue = othervalue[0].debt + sum;
      socket.current.emit("transgress", { from: id, to: selectedPlayer, room, amount: sum, debt: subValue });
      socket.current.emit("turn_over", { room });
    } else {
      setShowAlert(true)
    }
  }

  const handleExit = () => {
    socket.current.emit('leave_game', { name: id, room });
    socket.current.emit('join_lobby');
    setRoom("");
    history.push('/lobby')
  }

  const handleRoll = (event: any) => {
    const value = event.target.value;
    setRoll(value);
  }

  const handleFactor = (event: any) => {
    const value = event.target.value;
    setFactor(value);
  }

  const handleSelectPlayer = (id: any) => {
    setSelectPlayer(id);
  }

  return (
    <IonPage className='gamePage'>
      <IonContent >
        <div className='yourname'>
          {currentTurn}
        </div>
        <IonRow className='content'>
          <IonGrid className='item-container'>
            {
              players.map((item: any, index: any) => {
                let classname = "room-item"
                if (item.id === selectedPlayer) {
                  classname = "active-room-item"
                } else {
                  classname = "room-item"
                }
                const myDebt: any = playerDebts.filter((debt: any) => debt.id === item.id);

                let pname = ""
                if (item.id === id) {
                  pname = "You"
                } else {
                  pname = item.nickname
                }
                return (
                  <IonRow key={index} className={classname}
                    onClick={() => handleSelectPlayer(item.id)}
                  >
                    <IonCol>{pname}</IonCol>
                    <IonCol size="auto">
                      {
                        myDebt.length > 0 &&
                        <div style={{ width: "50px" }}>{myDebt[0].debt}</div>
                      }
                    </IonCol>
                  </IonRow>
                )
              })
            }
          </IonGrid>
          <div className='title-container'>
            <p className='title'>{realValue}</p>
          </div>
          <div className='btn-container'>
            <div className='input-container'>
              <div style={{ width: '100px' }}>
                <h1>ROLL</h1>
                <TextInput
                  elemenName='roll'
                  labelStr=''
                  type='number'
                  placeholder="roll"
                  value={roll}
                  onChange={handleRoll}
                />
              </div>
              <p style={{ color: "white", marginTop: '46px' }}>x</p>
              <div style={{ width: '100px' }}>
                <h1>FACTOR</h1>
                <TextInput
                  elemenName='factor'
                  labelStr=''
                  type='number'
                  placeholder="factor"
                  value={factor}
                  onChange={handleFactor}
                />
              </div>
            </div>
            <div className='button-container'>
              <IonButton className='color2' disabled={!myTurn} onClick={handleForgive}><p>FORGIVE(-)</p></IonButton>
              <IonButton className='color3' disabled={!myTurn} onClick={handleTransgress}><p>TRANSGRESS(+)</p></IonButton>
              <IonButton className='color1' onClick={handleExit}><p>EXIT</p></IonButton>
            </div>
          </div>
        </IonRow>
        <IonToast
          cssClass={'custom-class'}
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          duration={3000}
          message="You should select the other Player for transgress"
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Game;
