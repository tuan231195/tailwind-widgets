import React, { useMemo } from 'react';
import Portal from './Portal';
import { useBoundingClientRect } from '../hooks/use-measure';

export function Popover({
    parentRef,
    children,
    offset = { left: '0', top: '0' },
}: {
    offset: { left: string; top: string };
    children: any;
    parentRef: any;
}) {
    const rect = useBoundingClientRect(parentRef.current);
    const styles = useMemo(() => {
        return {
            left: window.scrollX + rect.x,
            top: window.scrollY + rect.y,
            width: rect.width,
            transform: `translate(${toPx(rect.width, offset.left)}px, ${toPx(rect.height, offset.top)}px)`,
        };
    }, [rect]);

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
