import React, { useEffect, useState } from 'react';
import GetGame, { GetGameResponse } from '../../clients/GetGame';
import JoinGame from '../../clients/JoinGame';
import Loading from '../Loading';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { useHistory, useLocation } from 'react-router-dom';

export default function () {
    const [gameData, setGameData] = useState<GetGameResponse>();
    const [loading, setLoading] = useState(true);
    const [done, setDone] = useState(false);
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        Auth.currentSession()
            .catch(() => history.push("/"))
            .then(() => getGameFromURL())
            .then((gameId) => GetGame(gameId))
            .then((response) => setGameData(response))
            .then(() => setLoading(false))
            .catch(err => console.log("Could not get game"));    
    });

    const getGameFromURL = () => {
        console.log(location.search);
        const s = new URLSearchParams(location.search).get('gameId');

        if (s == null) {
            history.push('/');
        }

        return s!;
    }

    const joinGame = () => {
        JoinGame("gameId")
            .then(() => setDone(true))
            .catch(err => console.log("Could not join game"))
    }

    if (loading) {
        return (<Loading/>);
    };

    return (
        <div>
            Do you want to join this game?

            <div>
                { gameData?.host + "'s  Game!" }
            </div>

            <ul className="lsit-group">
                { gameData?.players.map((player) => <li className="list-group-item">{player}</li>) }
            </ul>


            <button className="btn btn-primary" onClick={joinGame}>
                Join Game!
            </button>

            <div className="modal fade" id="createGameModal" role="dialog" hidden={!done}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Game Successfully Created!</h5>
                            <Link className="close" to="/"/>
                        </div>
                        <div className="modal-body">
                            You have successfully joined the Game! Wait until the host starts the game!
                        </div>
                    </div>
                </div>
            </div>
        </div>    
    );
}