import { IonButton, IonContent, IonPage, IonRow } from '@ionic/react';
// import { useState } from 'react';
import { useHistory } from 'react-router';
import { Screenshot } from 'capacitor-screenshot';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import './Over.scss';
import { useState } from 'react';

interface ContainerProps {
  socket: any;
  id: any;
  name: any;
  setName: any;
  room: any;
  totalTurn: any;
  setRoom: any;
}
const Over: React.FC<ContainerProps> = ({ socket, id, room, setRoom, totalTurn }) => {
  const history = useHistory();
  const [showScreen, setShowScreen] = useState(false);

  const handleLobby = () => {
    setShowScreen(true);
    try {
      Screenshot.take().then(async (ret: { base64: string }) => {
        const savedfile = await Filesystem.writeFile({
          path: 'winss.png',
          data: ret.base64,
          directory: Directory.Cache
        });
        await Share.share({
          title: 'Just won 490 cards',
          text: '',
          url: savedfile.uri,
          dialogTitle: 'Share with buddies',
        });
      });
    } catch (error) {
    }
  }

  const handleExit = () => {
    socket.current.emit('leave_room', { name: id, room });
    setRoom("");
    history.push('/home')
  }

  const handleRset = () => {
    setShowScreen(false);
  }
  return (
    <IonPage className='overPage'>
      <IonContent >
        {
          showScreen ?
            <IonRow className='content'  onClick={handleRset}>
              <div className='title-container'>
                <p className='title'>O</p>
              </div>
              <div className='btn-container'>
                <div className='logo'>
                  <p className='con-text1'>
                    I JUST WON 490 CARDS® <br />
                    IN {totalTurn} TURNS <br />
                    BY FORGIVING ALL DEBTS <br />
                    OWED TO ME!
                  </p>
                </div>
              </div>
            </IonRow>
            :
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
        }
      </IonContent>
    </IonPage>
  );
};

export default Over;
