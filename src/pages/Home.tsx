import { IonButton, IonContent, IonPage, IonRow, useIonAlert } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import CreateRoomModal from '../components/CreateRoomModal';
import './Home.scss';

interface ContainerProps {
  socket: any;
  setRoom: any;
  id: any;
  setAdmin: any;
}

const Home: React.FC<ContainerProps> = ({ socket, setRoom, setAdmin, id }) => {
  const [showRoomModal, setShowRoomModal] = useState<boolean>(false);
  const history = useHistory();
  const [presentAlert] = useIonAlert();

  const handleLobby = () => {
    socket.current.emit('join_lobby');
    history.push('/lobby')
  }

  const handleExit = () => {
    try {
      //@ts-ignore
      navigator['app'].exitApp();
    } catch (error) {
    }
  }

  const handleExitClick = () => {
    presentAlert({
      header: `Are you sure?`,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Yes',
          role: 'confirm',
          cssClass: 'alert-button-confirm',
          handler: () => {
            handleExit()
          },
        },
      ],
    })
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
              <IonButton className='color3' onClick={handleExitClick}><p>QUIT</p></IonButton>
            </div>
          </div>
        </IonRow>
      </IonContent>
      <CreateRoomModal
        showModal={showRoomModal}
        socket={socket}
        setRoom={setRoom}
        setAdmin={setAdmin}
        id={id}
        dismiss={handleHideRoomModal}
      />
    </IonPage>
  );
};

export default Home;
