import { IonButton, IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react';
import { useState } from 'react';
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

const Game: React.FC<ContainerProps> = ({socket}) => {
  const [roll, setRoll] = useState<any>(0);
  const [factor, setFactor] = useState<any>(0);
  // eslint-disable-next-line
  const [activename, setActiveName] = useState<string>("TOM");
  const [value, setValue] = useState<number>(490);
  const [realValue, setRealValue] = useState<string>("49O")
  const history = useHistory();

  const handleForgive = () => {
    const sum = parseInt(roll) * parseInt(factor);
    let subValue = value - sum;
    if (subValue <= 0)  {
      subValue = 0;
    }
    setValue(subValue);
   let strValue = subValue.toString();
   strValue = strValue.replace(/0/g, 'O');
   strValue = strValue.replace(/1/g, 'l');

   setRealValue(strValue);

   if(subValue === 0) {
    history.push('/over')
   }
  }

  const handleTransgress = () => {

  }

  const handleRoll = (event: any) => {
    const value = event.target.value;
    setRoll(value);
  }

  const handleFactor = (event: any) => {
    const value = event.target.value;
    setFactor(value);
  }

  const players = ["JOHN", "TOM", "JERRY", "CHRIS", "GINA", "STAR", "WOLF", "DOG"]

  return (
    <IonPage className='gamePage'>
      <IonContent >
          <div className='yourname'>
            TOM
          </div>
        <IonRow className='content'>
          <IonGrid className='item-container'>
            {
              players.map((name: any, index: any) => {
                let classname = "room-item"
                if (name === activename) {
                  classname = "active-room-item"
                } else {
                  classname = "room-item"
                }
                return (
                  <IonRow className={classname}>
                    <IonCol>{name}</IonCol>
                    <IonCol size="auto">
                      <div style={{ width: "50px" }}>{realValue}</div>
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
              <p style={{color: "white", marginTop: '46px'}}>x</p>
              <div  style={{ width: '100px' }}>
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
              <IonButton className='color2' onClick={handleForgive}><p>FORGIVE(-)</p></IonButton>
              <IonButton className='color3' onClick={handleTransgress}><p>TRANSGRESS(+)</p></IonButton>
            </div>
          </div>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Game;
