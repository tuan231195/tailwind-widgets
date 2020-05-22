import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from './Icon';
import ContentEditable from '@vdtn359/content-editable';
import { Popover } from './Popover';
import {root} from "postcss";

export type SelectProps = {
    options: { value: any; option: any }[];
    value: any;
    components?: { singleValue?: React.FC<any>; option?: React.FC<any>; multiValue?: React.FC<any> };
    label?: string;
    placeholder?: string;
    multi?: boolean;
    onChange?: (e, { value, option }) => void;
    optionToText?: (option: any) => string;
    closeOnSelect?: boolean;
    showClear?: boolean;
};

export function Select({
    options: items,
    value = [],
    closeOnSelect = true,
    label,
    showClear,
    placeholder,
    components = {
        option: DefaultOptionRender,
    },
    multi,
    optionToText = ({ option = '' } = {}) => option,
    onChange = ({ option }) => option,
}: SelectProps) {
    const defaultValue = multi ? [] : null;
    const [searchInput, setSearchInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<any>();
    const filteredItems = useMemo(() => {
        return filterOptions({
            items,
            optionToText,
            searchInput,
        });
    }, [searchInput]);
    useEffect(() => {
        setSearchInput(isOpen ? searchInput : '');
        const keydownHandler = e => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        const clickHandler = e => {
            if (rootRef.current?.contains(e.target)) {
                return;
            }
            setIsOpen(false);
        };
        if (isOpen) {
            document.addEventListener('keydown', keydownHandler);
            document.addEventListener('click', clickHandler);
        } else {
            document.removeEventListener('keydown', keydownHandler);
            document.removeEventListener('click', clickHandler);
        }
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
    const SingleValueComponent = components?.singleValue;
    const OptionComponent = components?.option || DefaultOptionRender;
    const MultiValueComponent = components?.multiValue || DefaultMultiValueRenderer;
    return (
        <>
            <div className="text-sm inline-block" style={{ minWidth: '200px' }} ref={rootRef}>
                {label && <h4 className={'font-bold'}>{label}</h4>}
                <div
                    onClick={() => {
                        if (searchInputRef.current?.el) {
                            searchInputRef.current.el.current.focus();
                        } else {
                            searchInputRef.current?.focus();
                        }
                    }}
                >
                    <div className="my-2 bg-white p-1 flex border border-gray-200 rounded">
                        <div className="flex flex-auto flex-wrap">
                            {multi &&
                                renderMultiValueInput({
                                    component: MultiValueComponent,
                                    searchInput,
                                    setSearchInput,
                                    setIsOpen,
                                    onRemove: (e, item) => {
                                        onChange(e, {
                                            option: item,
                                            value: value.filter(element => element !== item.value),
                                        });
                                    },
                                    value,
                                    optionToText,
                                    selectedOptions,
                                    placeholder,
                                    inputRef: searchInputRef,
                                })}
                            {!multi &&
                                renderSingleValueInput({
                                    setIsOpen,
                                    isOpen,
                                    searchInput,
                                    setSearchInput,
                                    optionToText,
                                    component: SingleValueComponent,
                                    inputRef: searchInputRef,
                                    selectedOption: selectedOptions[0],
                                })}
                        </div>

                        <div className={'w-4 mr-1'}>
                            {showClear &&
                                (searchInput || !isEmpty(value)) &&
                                renderClose({
                                    onClose: e => {
                                        onChange(e, { value: defaultValue, option: null });
                                        setIsOpen(false);
                                    },
                                })}
                        </div>

                        {renderArrowButton({ isOpen, setIsOpen })}
                    </div>
                </div>
                {isOpen &&
                    renderList({
                        onSelect: select,
                        parentRef: rootRef,
                        value,
                        optionToText,
                        items: filteredItems,
                        component: OptionComponent,
                    })}
            </div>
        </>
    );
}

function renderMultiValueInput({
    component: MultiValueComponent,
    inputRef,
    selectedOptions,
    optionToText,
    searchInput,
    placeholder,
    setSearchInput,
    setIsOpen,
    value,
    onRemove,
}) {
    return (
        <>
            {selectedOptions.map(option => (
                <MultiValueComponent
                    key={option.value}
                    item={option}
                    selectedValue={value}
                    optionToText={optionToText}
                    onRemove={e => {
                        onRemove(e, option);
                    }}
                />
            ))}
            <ContentEditable
                html={searchInput}
                ref={inputRef}
                placeholder={placeholder}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                    }
                }}
                onChange={e => {
                    setSearchInput((e.target as any).value);
                }}
                className={'break-all p-1 px-2 outline-none text-gray-800'}
                onFocus={() => {
                    setIsOpen(true);
                }}
            />
        </>
    );
}

function renderSingleValueInput({
    component: SingleValueComponent,
    inputRef,
    selectedOption,
    optionToText,
    searchInput,
    setSearchInput,
    setIsOpen,
    isOpen,
}) {
    return (
        <div className={'p-1 px-2 w-full'}>
            {(!SingleValueComponent || !selectedOption) && (
                <ContentEditable
                    html={searchInput || (selectedOption && optionToText(selectedOption)) || ''}
                    ref={inputRef}
                    onInput={e => {
                        setSearchInput((e.target as any).innerText);
                    }}
                    onKeyPress={e => {
                        if (!searchInput) {
                            (e.target as any).innerText = '';
                        }
                    }}
                    className={'break-all outline-none text-gray-800'}
                    onFocus={() => {
                        setIsOpen(true);
                    }}
                />
            )}
            {SingleValueComponent && selectedOption && (
                <SingleValueComponent
                    option={selectedOption.option}
                    value={selectedOption.value}
                    onOpen={() => setIsOpen(!isOpen)}
                />
            )}
        </div>
    );
}

function renderClose({ onClose }: { onClose: Function }) {
    return (
        <div className={'w-4 mr-1'}>
            <button
                className="cursor-pointer h-full flex items-center justify-center text-black"
                onClick={e => {
                    onClose(e);
                }}
            >
                <Icon name={'close'} width={12} height={12} />
            </button>
        </div>
    );
}

function renderArrowButton({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: Function }) {
    return (
        <div className="w-4  mr-2 flex items-center">
            <button
                className="cursor-pointer w-4 h-4 flex items-center justify-center text-gray-600"
                onClick={e => {
                    setIsOpen(!isOpen);
                    if (isOpen) {
                        e.stopPropagation();
                    }
                }}
            >
                <Icon name={'chevron-down'} width={12} height={12} />
            </button>
        </div>
    );
}

function renderList({
    onSelect,
    parentRef,
    items,
    value,
    optionToText,
    component: OptionComponent,
}: {
    onSelect: Function;
    parentRef: any;
    value: any;
    items: any[];
    optionToText: Function;
    component: any;
}) {
    return (
        <Popover parentRef={parentRef} offset={{ left: '0', top: '100%' }}>
            <div className="shadow bg-white w-full rounded overflow-y-auto">
                <ul className="flex flex-col w-full">
                    {items.map(item => (
                        <li
                            key={item.value}
                            tabIndex={0}
                            className="cursor-pointer w-full"
                            onKeyDown={e => {
                                console.log(e.key);
                                if (e.key === 'Enter') {
                                    onSelect(e, item);
                                }
                            }}
                            onClick={e => {
                                onSelect(e, item);
                            }}
                        >
                            <OptionComponent item={item} selectedValue={value} optionToText={optionToText} />
                        </li>
                    ))}
                </ul>
            </div>
        </Popover>
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
        <div className="flex text-xs justify-center items-center m-1 py-1 px-2 bg-white rounded-full text-teal-700 bg-teal-100 border border-teal-300 ">
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
