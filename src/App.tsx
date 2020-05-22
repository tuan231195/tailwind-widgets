import * as React from 'react';
import { useState } from 'react';
import { Select } from './components/Select';

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
        <div className={'m-5'}>
            <SingleSelect />
            <MultiSelect />
        </div>
    );
}

export default App;
