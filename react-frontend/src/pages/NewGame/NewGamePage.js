import {Link, Switch, Route} from 'react-router-dom';
import NewGameBreadCrumb from './NewGameBreadCrumb';
import { GameDataContext } from 'src/app/Context';
import {useContext, useEffect} from 'react';
import ColonizerConfigPage from './ColonizerConfigPage';
import SpeciesDesignPage from './SpeciesDesignPage';
import GalaxyConfigPage from './GalaxyConfigPage';
import ChatLobby from '../ChatPage/ChatLobby';
import GameDashboardPage from '../GameDashboardPage';
import {authenticate, getGameConfiguration, joinChatLobby, setGameConfiguration, selectWebsocket, setChatLobbyId} from '../../modules/websocket';
import './NewGamePage.css';
import {useDispatch, useSelector} from 'react-redux';
import UserContext from 'src/app/UserContext';
import UserCard from 'src/shared/UserCard/UserCard';

const NewGameLayout = () => {

    const dispatch = useDispatch();
    const userContext = useContext(UserContext);
    const data = useContext(GameDataContext);
    const websocket = useSelector(selectWebsocket);
    const chatLobbyId = '1234';

    //   useEffect(() => {
    //     createNewMultiplayerGame();
    //   }, []);


    const createNewMultiplayerGame = () => {
        createNewLobby();
    };

    const createNewLobby = () =>  {
        dispatch(setChatLobbyId(chatLobbyId));
        dispatch(authenticate(userContext.email, userContext.displayName, userContext.token));
        dispatch(joinChatLobby(userContext.email, chatLobbyId));
    };

    const setGameData = () => {
        const systemsJson = data.galaxyWidget.exportGalaxyDataToJson();
        dispatch(setGameConfiguration(chatLobbyId, systemsJson));
    };

    const downloadGameData = () => {
        dispatch(getGameConfiguration(chatLobbyId));
    };

    const overrideGameData = () => {
        data.galaxyWidget.importGalaxyData(websocket.systemsJson);
    };


    return (
        <>
            <UserCard />
            <div className="newgame-wrap">
                <div className="big-header">New Multiplayer Game</div>
                <button onClick={createNewLobby}>Create or Join New Lobby</button>
                <button onClick={setGameData}>Set Game Data</button>
                <button onClick={downloadGameData}>Download Game Data</button>
                <button onClick={overrideGameData}>Override Game Data</button>
                <NewGameBreadCrumb />
                <Switch>
                    <Route exact path="/new_game" component={ChatLobby} />

                    <Route path="/new_game/colonizer_config" component={ColonizerConfigPage} />
                    <Route path="/new_game/species_design" component={SpeciesDesignPage} />
                    <Route path="/new_game/galaxy_config" component={GalaxyConfigPage} />
                    <Route path="/new_game/lobby/:lobbyToken" component={ChatLobby} />
                    <Route path="/new_game/lobby/:lobbyToken/game" component={GameDashboardPage} />
                </Switch>
            </div>
        </>
    );
};

export default NewGameLayout;
