import * as React from 'react';
import { useState } from 'react';
import { Select } from './components/Select';
import { Avatar } from './components/Avatar';

const SingleSelect: React.FC = () => {
    const [value, setValue] = useState(null);
    return (
        <>
            <Select
                value={value}
                onChange={(e, { value }) => setValue(value)}
                options={[
                    {
                        option: 'JavaScript',
                        value: 'js',
                    },
                    {
                        option: 'Python',
                        value: 'py',
                    },
                    {
                        option: 'C++',
                        value: 'c++',
                    },
                ]}
            />
            <div>Value: {JSON.stringify(value, null, 4)}</div>
        </>
    );
};

const CustomSingleSelect: React.FC = () => {
    const [value, setValue] = useState(null);
    return (
        <>
            <Select
                value={value}
                onChange={(e, { value }) => setValue(value)}
                label={'Multi select'}
                options={[
                    {
                        option: {
                            avatar: 'https://pickaface.net/gallery/avatar/unr_random_180410_1905_z1exb.png',
                            name: 'Javascript',
                        },
                        value: 'js',
                    },
                    {
                        option: {
                            avatar: 'https://pickaface.net/gallery/avatar/unr_random_180410_1905_z1exb.png',
                            name: 'Python',
                        },
                        value: 'py',
                    },
                    {
                        option: {
                            avatar: 'https://pickaface.net/gallery/avatar/unr_random_180410_1905_z1exb.png',
                            name: 'C++',
                        },
                        value: 'c++',
                    },
                ]}
                optionToText={({ option: { name } }) => name}
                components={{
                    singleValue: ({ option, onOpen }: { option: any; onOpen: Function }) => {
                        return (
                            <span className={'flex items-center'} onClick={() => onOpen()}>
                                <Avatar src={option.avatar} />
                                <span className={'ml-2 flex-grow'}>{option.name}</span>
                            </span>
                        );
                    },
                    option: ({
                        item: {
                            option: { name, avatar },
                        },
                    }: {
                        item: any;
                    }) => {
                        return (
                            <span className={'flex  p-2 pl-2 items-center'}>
                                <Avatar src={avatar} />
                                <span className={'ml-2 flex-grow'}>{name}</span>
                            </span>
                        );
                    },
                }}
            />
            <div>Value: {JSON.stringify(value, null, 4)}</div>
        </>
    );
};

const MultiSelect: React.FC = () => {
    const [value, setValue] = useState([]);

    return (
        <div style={{ maxWidth: '300px' }}>
            <Select
                value={value}
                multi={true}
                onChange={(e, { value }) => {
                    setValue(value);
                }}
                options={[
                    {
                        option: 'JavaScript',
                        value: 'js',
                    },
                    {
                        option: 'Python',
                        value: 'py',
                    },
                    {
                        option: 'C++',
                        value: 'c++',
                    },
                ]}
            />
            <div>Value: {JSON.stringify(value, null, 4)}</div>
        </div>
    );
};

function App() {
    return (
        <div className={'container'}>
            <SingleSelect />
            <MultiSelect />
            <CustomSingleSelect />
        </div>
    );
}

export default App;
