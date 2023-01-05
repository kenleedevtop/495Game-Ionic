import React, { useState } from 'react';
import {
    IonModal, IonSelect, IonSelectOption
} from '@ionic/react';

import './CreateRoomModal.scss';
import Input from './TextInput';
// import { Preferences } from '@capacitor/preferences';

interface ContainerProps {
    showModal: boolean;
    dismiss: any;
}

const CreateRoomModal: React.FC<ContainerProps> = ({ showModal, dismiss }) => {
    const [roomname, setRoomName] = useState<string>("")
    const [members, setMembers] = useState<number>(2);
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
            // const body = {
            //     members: members,
            //     roomname: roomname
            // }
            // signUp(body)
            //     .then(async (res) => {
            //         await Preferences.remove({ key: 'createdUser' });
            //         await Preferences.set({ key: 'createdUser', value: "true" });
            //         dismiss();
            //     })
            //     .catch((err) => {
            //         dismiss();
            //     })
        } else {

        }
    }
    return (
        <IonModal id="create-user-modal" isOpen={showModal} backdropDismiss={false}>
            <div className="userwrapper">
                <p>
                    Would you like to make a room? When you create a room, you become the room manager.
                </p>
                <div>
                    <h1>Enter a RoomName:</h1>
                    <Input
                        elemenName='roomname'
                        labelStr=''
                        type='text'
                        placeholder="Name"
                        value={roomname}
                        onChange={handleRoomNameChange}
                    />
                </div>
                <div>
                    <h1>Select Member:</h1>
                    <div className='asha-select'>
                        <IonSelect
                            interfaceOptions={options}
                            value={members}
                            placeholder="Select..."
                            onIonChange={handleChangeMember}
                        >
                            <IonSelectOption value={2}>2</IonSelectOption>
                            <IonSelectOption value={3}>3</IonSelectOption>
                            <IonSelectOption value={4}>4</IonSelectOption>
                            <IonSelectOption value={5}>5</IonSelectOption>
                            <IonSelectOption value={6}>6</IonSelectOption>
                            <IonSelectOption value={7}>7</IonSelectOption>
                            <IonSelectOption value={8}>8</IonSelectOption>
                        </IonSelect>
                    </div>
                </div>
                <div className='row'>
                    <div className='nothanks-btn' onClick={handleContinue}>
                        <p>CANCEL</p>
                    </div>
                    <button className='okay-btn' onClick={handleCreateRoom}>
                        <p>CREATE</p>
                    </button>
                </div>
            </div>
        </IonModal>
    );
}

export default CreateRoomModal;