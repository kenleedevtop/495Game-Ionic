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

/* Theme variables */
import './theme/variables.css';
import './App.css';
import Lobby from './pages/Lobby';
import Ready from './pages/Ready';
import Game from './pages/Game';
import Over from './pages/Over';
setupIonicReact();

const App: React.FC = () => {

  return (
    <IonApp className="mobileview">
      <IonReactRouter>
        <IonRouterOutlet>
          <Route  path="/home">
            <Home />
          </Route>
          <Route  path="/lobby">
            <Lobby />
          </Route>
          <Route  path="/ready">
            <Ready />
          </Route>
          <Route  path="/game">
            <Game />
          </Route>
          <Route  path="/over">
            <Over />
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
