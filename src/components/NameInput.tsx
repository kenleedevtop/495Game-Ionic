import React, { FC } from 'react';

import './NameInput.scss';

interface InputProps {
    elemenName?: string;
    labelStr?: string;
    placeholder: string;
    value?: string;
    disable?: boolean;
    type: string;
    onChange: (event: React.FormEvent<HTMLInputElement>) => void;
}

const NameInput: FC<InputProps> = (props) => {
    const {
        elemenName = "",
        labelStr,
        type,
        disable,
        placeholder,
        value = "",
        onChange
    } = props;

    return (<>
        <div className='cdxc-input'>
            { labelStr &&
                <strong className="title-color">{labelStr}</strong>
            }
            <input
                name={elemenName}
                autoComplete="off"
                type={type}
                style={{textAlign: 'center'}}
                disabled={disable}
                placeholder={placeholder}
                value={value}
                onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e)}
            />
        </div>
    </>)
}

export default NameInput;
