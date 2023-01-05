import { IonButton, IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import TextInput from '../components/TextInput';
import './Ready.scss';


const Ready: React.FC = () => {
  const history = useHistory();
  const [nickname, setNickName] = useState<string>("");

  const handleStart = () => {
    history.push('/game')
  }

  const handleBack = () => {
    history.push("/lobby")
  }

  const handleNickname = (event: any) => {
    const value = event.target.value;
    setNickName(value);
  }
 

  const players = ["JOHN", "TOM", "JERRY", "CHRIS", "GINA", "STAR", "WOLF", "DOG"]

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
                    <div style={{ width: "261px" }}>8</div>
                  </IonCol>
                </IonRow>
              </IonGrid>

              <IonGrid className='item-container'>
                {
                  players.map((room: any, index: any) => {
                    return (
                      <IonRow className='room-item'>
                        <IonCol>PLAYER {index + 1}</IonCol>
                        <IonCol size="auto">
                          <TextInput
                            elemenName='roomname'
                            labelStr=''
                            type='text'
                            placeholder="NickName"
                            value={nickname}
                            onChange={handleNickname}
                          />
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
                <IonButton disabled={nickname === ""} className='color2' onClick={handleStart}><p>START</p></IonButton>
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
