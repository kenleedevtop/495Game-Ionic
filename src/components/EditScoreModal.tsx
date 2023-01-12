import React, { useEffect, useState } from 'react';
import {
    IonCol,
    IonModal,
    IonRow
} from '@ionic/react';

import './EditScoreModal.scss';
import Input from './ScoreInput';
import { useHistory } from 'react-router';

interface ContainerProps {
    showModal: boolean;
    dismiss: any;
    socket: any;
    setRoom: any;
    id: any;
    room: any;
    players: any;
    playerDebts: any;
}

const EditScoreModal: React.FC<ContainerProps> = ({ showModal, dismiss, id, room, socket, players, playerDebts }) => {
    const [size, setSize] = useState<string>("12");
    const [debts, setDebts] = useState<any[]>([]);
    const [ids, setIds] = useState<string[]>([]);
    const handleContinue = () => {
        dismiss();
    }

    const handleDebtChange = (event: any, id: any) => {
        const value = event.target.value;
        const newdebts = debts.map((item: any) => {
            if (item.id === id) {
                return { 'id': id, 'debt': value }
            } else {
                return item
            }
        })

        setDebts(() => [...newdebts]);
    }

    const handleChangeScore = async () => {
        const newdebts =  debts.map((item: any) => {
            return parseInt(item.debt);
        })
        socket.current.emit("edit_score", {  ids, room, debts:newdebts });
        dismiss();
    }

    useEffect(() => {
        if (players && playerDebts) {
            if (players.length <= 3) {
                setSize("12");
            }
            else if (players.length === 4) {
                setSize("6");
            }
            else if (players.length > 4 && players.length <= 6) {
                setSize('4');
            }
            else if (players.length > 6 && players.length <= 8) {
                setSize('3');
            }

            const newids = players.map((player: any) => {
                return player.id;
            })

            setIds(newids);

            const newdebts = players.map((player: any) => {
                const myDebt: any = playerDebts.filter((debt: any) => debt.id === player.id);
                if (myDebt.length > 0) {
                    return { 'id': player.id, 'debt': myDebt[0].debt }
                } else {
                    return { 'id': player.id, 'debt': 0 }
                }
            })

            setDebts(newdebts);
        }
    }, [players, playerDebts])

    return (
        <IonModal id="create-score-modal" isOpen={showModal} backdropDismiss={false} >
            <IonRow className='scorewrapper'>
                <IonCol size="12">
                    <div style={{ padding: '20px' }}>
                        <IonRow>
                            {
                                debts.length > 0 && players?.map((player: any) => {
                                    let pname = ""
                                    if (player.id === id) {
                                      pname = "You"
                                    } else {
                                      pname = player.nickname
                                    }
                                    const myDebt: any = debts.filter((debt: any) => debt.id === player.id);
                                    let newvlaue: any = 0;
                                    if (myDebt.length > 0) {
                                        newvlaue = myDebt[0].debt;
                                    }
                                    return (
                                        <IonCol size={size} key={player.id}>
                                            <h2>
                                                {pname}
                                            </h2>
                                            <Input
                                                elemenName='nickname'
                                                labelStr=''
                                                type='number'
                                                placeholder="Name"
                                                value={newvlaue}
                                                onChange={(e) => handleDebtChange(e, player.id)}
                                            />
                                        </IonCol>
                                    )
                                })
                            }
                        </IonRow>
                    </div>
                    <div className='row'>
                        <div className='nothanks-btn' onClick={handleContinue}>
                            <p style={{ margin: 0 }}>CANCEL</p>
                        </div>
                        <button className='okay-btn' onClick={handleChangeScore}>
                            <p style={{ margin: 0 }}>SUBMIT</p>
                        </button>
                    </div>
                </IonCol>
            </IonRow>
        </IonModal>
    );
}

export default EditScoreModal;