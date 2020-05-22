import React from 'react';
import Portal from './Portal';
import { useEffect, useState } from 'react';

export function Popover({
    parentRef,
    children,
    offset = { left: '0', top: '0' },
}: {
    offset: { left: string; top: string };
    children: any;
    parentRef: any;
}) {
    const [styles, setStyles] = useState<any>({});

    useEffect(() => {
        const rect = parentRef.current?.getBoundingClientRect();
        setStyles({
            left: window.scrollX + rect.x,
            top: window.scrollY + rect.y,
            width: rect.width,
            transform: `translate(${toPx(rect.width, offset.left)}px, ${toPx(rect.height, offset.top)}px)`,
        });
    }, [parentRef]);

    return (
        <Portal>
            <div className={'absolute box-content'} style={styles}>
                {children}
            </div>
        </Portal>
    );
}

function toPx(dimension, spec: string) {
    return eval(
        spec.replace(/(\d+)((px)|%)?/g, (match, number, unit) => {
            if (unit === '%') {
                return (dimension * (number / 100)).toString();
            }
            return number.toString();
        })
    );
}
