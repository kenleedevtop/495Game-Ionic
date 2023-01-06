import { IonButton, IonContent, IonPage, IonRow } from '@ionic/react';
// import { useState } from 'react';
import { useHistory } from 'react-router';
import './Over.scss';

interface ContainerProps {
  socket: any;
  id: any;
  name: any;
  setName: any;
  room: any;
  setRoom: any;
}
const Over: React.FC<ContainerProps> = ({socket}) => {
  const history = useHistory();

  const handleLobby = () => {
  }

  const handleExit = () => {
    history.push('/home')
  }

  return (
    <IonPage className='overPage'>
      <IonContent >
        <IonRow className='content'>
          <div className='title-container'>
            <p className='title'>O</p>
          </div>
          <div className='btn-container'>
            <div className='logo'>
              <p className='con-text'>
                CONGRATULATIONS! <br />
                YOU WON 490 CARDS <br />
                BY FORGIVING ALL DEBTS!
              </p>
            </div>
            <div className='button-container'>
              <IonButton className='color2' onClick={handleLobby}><p>POST&nbsp;&nbsp;FACEBOOK</p></IonButton>
              <IonButton className='color3' onClick={handleExit}><p>HOME</p></IonButton>
            </div>
          </div>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Over;
