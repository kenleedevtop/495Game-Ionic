import React, { useState } from 'react';
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonCol,
    IonModal, IonNote, IonRow, IonSelect, IonSelectOption
} from '@ionic/react';

import './EditScoreModal.scss';
import Input from './ScoreInput';
import { useHistory } from 'react-router';

interface ContainerProps {
    showModal: boolean;
    dismiss: any;
    socket: any;
    setRoom: any;
    setAdmin: any;
    id: any;
}

const EditScoreModal: React.FC<ContainerProps> = ({ showModal, dismiss, socket, setAdmin, setRoom, id }) => {
    const [roomname, setRoomName] = useState<string>("")
    const [members, setMembers] = useState<number>(2);
    const history = useHistory();
    const handleContinue = () => {
        dismiss();
    }

    const handleRoomNameChange = (event: any) => {
        const value = event.target.value;
        setRoomName(value);
    }

    const handleChangeMember = (event: any) => {
        const value = event.target.value;
        setMembers(value);
    }

    const options = {
        cssClass: 'my-custom-interface'
    };

    const handleCreateRoom = async () => {
        if (members && roomname) {
            setRoom(roomname)
            socket.current.emit('join_room', { room: roomname, name: id, members });
            setAdmin(id);
            history.push("/ready")
            dismiss();
        } else {

        }
    }
    return (
        <IonModal id="create-score-modal" isOpen={showModal} backdropDismiss={false} >
            <IonRow className='scorewrapper'>
                <IonCol size="12">
                    <div style={{ padding: '20px' }}>
                        <IonRow>
                            <IonCol size="12">
                                <h2>
                                    ksmekj
                                </h2>
                                <Input
                                    elemenName='roomname'
                                    labelStr=''
                                    type='number'
                                    placeholder="Name"
                                    value={roomname}
                                    onChange={handleRoomNameChange}
                                />
                            </IonCol>
                        </IonRow>
                    </div>
                    <div className='row'>
                        <div className='nothanks-btn' onClick={handleContinue}>
                            <p style={{ margin: 0 }}>CANCEL</p>
                        </div>
                        <button className='okay-btn' onClick={handleCreateRoom}>
                            <p style={{ margin: 0 }}>CHANGE</p>
                        </button>
                    </div>
                </IonCol>
            </IonRow>
        </IonModal>
    );
}

export default EditScoreModal;