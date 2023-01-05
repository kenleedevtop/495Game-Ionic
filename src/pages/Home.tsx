import { IonButton, IonContent, IonPage, IonRow } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import CreateRoomModal from '../components/CreateRoomModal';
import './Home.scss';

const Home: React.FC = () => {
  const [showRoomModal, setShowRoomModal] = useState<boolean>(false);
  const history = useHistory();

  const handleLobby = () => {
    history.push('/lobby')
  }

  const handleExit = () => {

  }

  const handleShowRoomModal = () => {
    setShowRoomModal(true);
  }

  const handleHideRoomModal = () => {
    setShowRoomModal(false);
  }

  return (
    <IonPage className='homePage'>
      <IonContent >
        <IonRow className='content'>
          <div className='title-container'>
            <p className='title'>49O</p>
          </div>
          <div className='btn-container'>
            <div className='logo'>
              <img src="/assets/icon/icon.png" alt="light" />
            </div>
            <div className='button-container'>
              <IonButton className='color2' onClick={handleShowRoomModal}><p>NEW</p></IonButton>
              <IonButton className='color2' onClick={handleLobby}><p>LOBBY</p></IonButton>
              <IonButton className='color3' onClick={handleExit}><p>EXIT</p></IonButton>
            </div>
          </div>
        </IonRow>
      </IonContent>
      <CreateRoomModal
        showModal={showRoomModal}
        dismiss={handleHideRoomModal}
      />
    </IonPage>
  );
};

export default Home;
