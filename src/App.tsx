import * as React from 'react';
import { Icon } from './components/Icon';
import { Select } from './components/Select';
import { useState } from 'react';

const App: React.FC = () => {
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
            <Icon name="close" width={24} height={24} />
        </>
    );
};
export default App;
