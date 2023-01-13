import { IonButton, IonCol, IonContent, IonGrid, IonPage, IonRow, IonToast, useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import TextInput from '../components/TextInput';
import './Game.scss';
import EditScoreModal from '../components/EditScoreModal';

interface ContainerProps {
  socket: any;
  id: any;
  name: any;
  setName: any;
  room: any;
  admin: any;
  setRoom: any;
  setTotalTurn: any;
}

const Game: React.FC<ContainerProps> = ({ socket, id, room, setRoom, setTotalTurn, admin }) => {
  const [roll, setRoll] = useState<any>(0);
  const [factor, setFactor] = useState<any>(0);
  const [selectedPlayers, setSelectPlayers] = useState<any[]>([]);
  const [value, setValue] = useState<number>(490);
  const [realValue, setRealValue] = useState<string>("49O")
  const [showAlert, setShowAlert] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState<boolean>(false);

  const [players, setPlayers] = useState([]);
  const [playerDebts, setPlayerDebts] = useState([]);
  const [currentTurn, setCurrentTurn] = useState("");
  const [myTurn, setMyTurn] = useState(false);
  const [turncount, setTurnCount] = useState<number>(0);

  const [endGame, setEndGame] = useState(true);
  const [endGameRoom, setEndGameRoom] = useState<any>(null);

  const [successed, setSuccessed] = useState(false);

  const [presentToast] = useIonToast();

  const history = useHistory();

  const handleShowRoomModal = () => {
    setShowRoomModal(true);
  }

  const handleHideRoomModal = () => {
    setShowRoomModal(false);
  }


  useEffect(() => {
    setTotalTurn(0);
    setTurnCount(0);
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (myTurn) {
      const turn = turncount + 1;
      setTurnCount(turn);
      setTotalTurn(turn);
    }
    // eslint-disable-next-line
  }, [myTurn])


  useEffect(() => {
    // @ts-ignore
    socket.current.on("game_players", (players) => {
      setPlayers(players);
    });

    // @ts-ignore
    socket.current.on("player_debts", (debts) => {
      const myDebt = debts.filter((item: any) => item.id === id);
      try {
        if (myDebt.length > 0) {
          setValue(myDebt[0].debt);
          let strValue = myDebt[0].debt.toString();
          strValue = strValue.replace(/0/g, 'O');
          strValue = strValue.replace(/1/g, 'l');
          setRealValue(strValue);
          setPlayerDebts(debts);
          if (myDebt[0].debt <= 0) {
            setSuccessed(true);
          }
        }
      } catch (error) {
      }
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
    socket.current.on("forgive_self", (newid, amount, players) => {
      let Prefix = "";
      if (newid === id) {
        Prefix = "You"
      } else {
        const player = players.filter((player: any) => player.id === newid);
        Prefix = player[0].nickname
      }
      presentToast({
        message: `${Prefix} forgave ${amount} debts`,
        duration: 3000
      })
    });

    // @ts-ignore
    socket.current.on("success_game", (name, nickname) => {
      let Prefix = "";
      if (name === id) {
        Prefix = "You"
      } else {
        Prefix = nickname
      }
      presentToast({
        message: `${Prefix} forgave All debts`,
        duration: 3000
      })
    });

    // @ts-ignore
    socket.current.on("forgive", (from, ids, amount, players) => {
      let Subfix = "";
      const names = ids.map((item: any) => {
        let Prefix = "";
        const player = players.filter((player: any) => player.id === item);
        if (player.length > 0) {
          Prefix = player[0].nickname
        } else {
          console.log(item, players)
        }
        return Prefix;
      });
      if (from === id) {
        Subfix = "You"
      } else {
        const player = players.filter((player: any) => player.id === from);
        Subfix = player[0].nickname
      }
      presentToast({
        message: `"${Subfix}" reduced ${amount} from "${names.toString()}"\`s debts-to-forgive`,
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
    socket.current.on("transgress", (from, ids, amount, players) => {
      let Subfix = "";
      const names = ids.map((item: any) => {
        let Prefix = "";
        const player = players.filter((player: any) => player.id === item);
        Prefix = player[0].nickname
        return Prefix;
      });
      if (from === id) {
        Subfix = "You"
      } else {
        const player = players.filter((player: any) => player.id === from);
        if (player.length > 0) {
          Subfix = player[0].nickname
        }
      }
      presentToast({
        message: `"${Subfix}" added ${amount} to "${names.toString()}"\`s debts-to-forgive`,
        duration: 3000
      })
    });

    // @ts-ignore
    socket.current.on("edit-score", (ids, amount, players) => {
      presentToast({
        message: `Admin changed scores`,
        duration: 3000
      })
    });

    // @ts-ignore
    socket.current.on("end_game", (room) => {
      setEndGameRoom(room);
      setEndGame(true);
    });
    //eslint-disable-next-line
  }, [socket.current])

  useEffect(() => {
    if (endGame) {
      if (room === endGameRoom) {
        presentToast({
          message: `The Admin has closed this game.`,
          duration: 3000
        })
        setEndGameRoom(null);
        setEndGame(false);
        history.push('/ready')
      } else {
        setEndGameRoom(null);
        setEndGame(false);
      }
    }
    // eslint-disable-next-line 
  }, [endGame, endGameRoom])

  useEffect(() => {
    if (successed) {
      setSuccessed(false);
      socket.current.emit('success_game', { name: id, room });
      history.push('/over')
    }
    // eslint-disable-next-line 
  }, [successed])


  const handleForgive = () => {
    const sum = parseInt(roll) * parseInt(factor);
    let subValue = value - sum;
    if (subValue <= 0) {
      subValue = 0;
    }
    socket.current.emit("forgive_self", { id, room, amount: sum, debt: subValue });
    socket.current.emit("turn_over", { room, players });
  }


  const handleReduceTransgress = () => {
    if (selectedPlayers.length > 0) {
      const count = selectedPlayers.length;
      const sum = Math.floor(parseInt(roll) * parseInt(factor) / count);
      const debts = selectedPlayers.map((player) => {
        const othervalue: any = playerDebts.filter((item: any) => item.id === player)
        let subValue = othervalue[0].debt - sum;
        if (subValue <= 0) {
          subValue = 0;
        }
        return subValue;
      })
      socket.current.emit("forgive", { from: id, ids: selectedPlayers, room, amount: sum, debts });
      socket.current.emit("turn_over", { room, players });
      // if (subValue === 0) {
      //   socket.current.emit('success_game', { name: id, room });
      //   history.push('/over')
      // }
    } else {
      setShowAlert(true)
    }
  }

  const handleAddTransgress = () => {
    if (selectedPlayers.length > 0) {
      const count = selectedPlayers.length;
      const sum = Math.floor(parseInt(roll) * parseInt(factor) / count);
      const debts = selectedPlayers.map((player) => {
        const othervalue: any = playerDebts.filter((item: any) => item.id === player)
        let subValue = othervalue[0].debt + sum;
        return subValue;
      })
      socket.current.emit("transgress", { from: id, ids: selectedPlayers, room, amount: sum, debts });
      socket.current.emit("turn_over", { room, players });
    } else {
      setShowAlert(true)
    }
  }

  const handleExit = () => {
    if (admin === id) {
      socket.current.emit('end_game', { room });
    } else {
      socket.current.emit('leave_room', { name: id, room });
      socket.current.emit('join_lobby');
      setRoom("");
      history.push('/lobby')
    }
  }

  const handleRoll = (event: any) => {
    const value = event.target.value;
    setRoll(value);
  }

  const handleFactor = (event: any) => {
    const value = event.target.value;
    setFactor(value);
  }

  const handleSelectPlayer = (selectedid: any) => {
    let tempplayers = selectedPlayers;
    if (tempplayers.includes(selectedid)) {
      tempplayers = tempplayers.filter((item) => item !== selectedid);
    } else {
      if (id !== selectedid) {
        tempplayers.push(selectedid);
      }
    }
    setSelectPlayers(() => [...tempplayers]);
  }

  return (
    <IonPage className='gamePage'>
      <IonContent >
        <div className='yourname'>
          {currentTurn}
        </div>
        {
          id === admin &&
          <div className='allscore'>
            <IonButton className='color4' onClick={handleShowRoomModal}><p>All Score</p></IonButton>
          </div>
        }
        <IonRow className='content'>
          <IonGrid className='item-container'>
            {
              players.map((item: any, index: any) => {
                let classname = "room-item"
                if (selectedPlayers.includes(item.id)) {
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
              <IonButton className='color3' disabled={!myTurn} onClick={handleAddTransgress}><p>TRANSGRESS(+)</p></IonButton>
              <IonButton className='color3' disabled={!myTurn} onClick={handleReduceTransgress}><p>TRANSGRESS(-)</p></IonButton>
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
        <EditScoreModal
          showModal={showRoomModal}
          socket={socket}
          setRoom={setRoom}
          id={id}
          room={room}
          players={players}
          playerDebts={playerDebts}
          dismiss={handleHideRoomModal}
        />
      </IonContent>
    </IonPage>
  );
};

export default Game;
