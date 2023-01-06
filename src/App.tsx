import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import io from "socket.io-client";

/* Theme variables */
import './theme/variables.css';
import './App.css';
import Lobby from './pages/Lobby';
import Ready from './pages/Ready';
import Game from './pages/Game';
import Over from './pages/Over';
import { useEffect, useRef, useState } from 'react';
import { makeRandom } from './utils';
setupIonicReact();

const CONNECTION = process.env.REACT_APP_ENV === 'prod' ? process.env.REACT_APP_WS_PROD_URL : process.env.REACT_APP_WS_DEV_URL

const App: React.FC = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  const socket = useRef();

  useEffect(() => {
    // @ts-ignore
    socket.current = io(CONNECTION, {
      transports: ["websocket"],
    });

    const ramdomid = makeRandom();
    setId(ramdomid);
  }, [socket]);

  return (
    <IonApp className="mobileview">
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/home">
            <Home
              socket={socket}
              id={id}
              setRoom={setRoom}
            />
          </Route>
          <Route path="/lobby">
            <Lobby
              id={id}
              name={name}
              setName={setName}
              room={room}
              setRoom={setRoom}
              socket={socket}
            />
          </Route>
          <Route path="/ready">
            <Ready
              id={id}
              name={name}
              setName={setName}
              room={room}
              setRoom={setRoom}
              socket={socket}
            />
          </Route>
          <Route path="/game">
            <Game
              id={id}
              name={name}
              setName={setName}
              room={room}
              setRoom={setRoom}
              socket={socket} />
          </Route>
          <Route path="/over">
            <Over
              id={id}
              name={name}
              setName={setName}
              room={room}
              setRoom={setRoom}
              socket={socket}
            />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
};

export default App;
