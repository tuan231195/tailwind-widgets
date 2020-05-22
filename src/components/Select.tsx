import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from './Icon';
import ContentEditable from 'react-contenteditable';

export type SelectProps = {
    options: { value: any; option: any }[];
    value: any;
    label?: string;
    placeholder?: string;
    multi?: boolean;
    onChange?: (e, { value, option }) => void;
    optionToText?: (option: any) => string;
    closeOnSelect?: boolean;
};

export function Select({
    options: items,
    value = [],
    closeOnSelect = true,
    multi,
    optionToText = ({ option = '' } = {}) => option,
    onChange = ({ option }) => option,
}: SelectProps) {
    const defaultValue = multi ? [] : null;
    const [searchInput, setSearchInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const filteredItem = useMemo(() => {
        return filterOptions({
            items,
            optionToText,
            searchInput,
        });
    }, [searchInput]);
    useEffect(() => {
        setSearchInput(isOpen ? searchInput : '');
    }, [isOpen]);
    const selectedOptions = items.filter(item => isSelected({ item, selectedValue: value }));
    const searchInputRef = useRef<any>();
    const select = useCallback(
        (e, item) => {
            let selectedValue = item.value;
            if (multi) {
                if (!isSelected({ item, selectedValue: value })) {
                    selectedValue = value.concat(item.value);
                } else {
                    selectedValue = value;
                }
            }
            onChange(e, { value: selectedValue, option: item });
            if (closeOnSelect) {
                setIsOpen(false);
            }
        },
        [value]
    );
    return (
        <div className="text-sm inline-block" style={{ minWidth: '200px' }}>
            <div
                onClick={() => {
                    if (searchInputRef.current.el) {
                        searchInputRef.current.el.current.focus();
                    } else {
                        searchInputRef.current.focus();
                    }
                }}
            >
                <div className="my-2 bg-white p-1 flex border border-gray-200 rounded">
                    <div className="flex flex-auto flex-wrap">
                        {multi && (
                            <>
                                {selectedOptions.map(option => (
                                    <DefaultMultiValueRenderer
                                        key={option.value}
                                        item={option}
                                        selectedValue={value}
                                        optionToText={optionToText}
                                        onRemove={e => {
                                            onChange(e, {
                                                option,
                                                value: value.filter(element => element !== option.value),
                                            });
                                        }}
                                    />
                                ))}
                                <ContentEditable
                                    html={searchInput}
                                    ref={searchInputRef}
                                    onChange={e => {
                                        setSearchInput((e.target as any).value);
                                    }}
                                    className={'p-1 px-2 outline-none text-gray-800'}
                                    onFocus={() => {
                                        setIsOpen(true);
                                    }}
                                />
                            </>
                        )}
                        {!multi && (
                            <input
                                ref={searchInputRef}
                                value={searchInput || optionToText(selectedOptions[0])}
                                className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                                onChange={e => {
                                    setSearchInput(e.target.value);
                                }}
                                onFocus={() => {
                                    setIsOpen(true);
                                }}
                                onKeyPress={e => {
                                    if (!searchInput) {
                                        (e.target as any).value = '';
                                    }
                                }}
                            />
                        )}
                    </div>

                    <div className={'w-6 mr-2'}>
                        {(searchInput || !isEmpty(value)) && (
                            <button
                                className="cursor-pointer h-full flex items-center justify-center text-black"
                                onClick={e => {
                                    onChange(e, { value: defaultValue, option: null });
                                    setIsOpen(false);
                                }}
                            >
                                <Icon name={'close'} width={16} height={16} />
                            </button>
                        )}
                    </div>

                    <div className="w-8 border-gray-200 pl-2 border-l flex items-center pr-3">
                        <button
                            className="cursor-pointer w-6 h-6 flex items-center justify-center text-gray-600"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <Icon name={'chevron-down'} width={16} height={16} />
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="shadow w-full left-0 rounded overflow-y-auto">
                    <ul className="flex flex-col w-full">
                        {filteredItem.map(item => (
                            <li
                                key={item.value}
                                tabIndex={0}
                                className="cursor-pointer w-full"
                                onClick={e => {
                                    select(e, item);
                                }}
                            >
                                <DefaultOptionRender item={item} selectedValue={value} optionToText={optionToText} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

function filterOptions({ items, optionToText, searchInput = '' }) {
    return items.filter(item =>
        optionToText(item)
            .toLocaleLowerCase()
            .includes(searchInput.toLocaleLowerCase())
    );
}

function DefaultOptionRender({
    item,
    selectedValue,
    optionToText,
}: {
    item: any;
    selectedValue: any;
    optionToText: Function;
}) {
    return (
        <div
            className={`p-2 pl-2 items-center flex border-transparent bg-white border-l-2 relative hover:border-teal-600 ${
                isSelected({ item, selectedValue }) ? 'border-teal-600' : ''
            }`}
        >
            <div className="mx-2 leading-6">{optionToText(item)}</div>
        </div>
    );
}

function DefaultMultiValueRenderer({
    item,
    optionToText,
    onRemove,
}: {
    item: any;
    selectedValue: any;
    optionToText: Function;
    onRemove: Function;
}) {
    return (
        <div className="flex justify-center items-center m-1 py-1 px-2 bg-white rounded-full text-teal-700 bg-teal-100 border border-teal-300 ">
            <div className="leading-none max-w-full flex-initial">{optionToText(item)}</div>
            <button
                className="cursor-pointer ml-1 h-full flex items-center justify-center text-teal-700"
                onClick={e => onRemove(e)}
            >
                <Icon name={'close'} width={16} height={16} />
            </button>
        </div>
    );
}

function isSelected({ item, selectedValue }: { item: any; selectedValue: any }) {
    if (isEmpty(selectedValue)) {
        return false;
    }
    if (Array.isArray(selectedValue)) {
        return selectedValue.includes(item.value);
    }
    return selectedValue === item.value;
}

function isEmpty(selectedValue) {
    if (selectedValue == null) {
        return true;
    }
    return !selectedValue?.length;
}
