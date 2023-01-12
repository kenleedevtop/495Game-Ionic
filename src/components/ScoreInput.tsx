import React, { FC } from 'react';

import './ScoreInput.scss';

interface InputProps {
    elemenName?: string;
    labelStr?: string;
    placeholder: string;
    value?: string;
    disable?: boolean;
    type: string;
    onChange: (event: React.FormEvent<HTMLInputElement>) => void;
}

const ScoreInput: FC<InputProps> = (props) => {
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
        <div className='cdxc-scoreinput'>
            { labelStr &&
                <strong className="title-color">{labelStr}</strong>
            }
            <input
                name={elemenName}
                autoComplete="off"
                type={type}
                disabled={disable}
                placeholder={placeholder}
                value={value}
                onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e)}
            />
        </div>
    </>)
}

export default ScoreInput;
