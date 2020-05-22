import React from 'react';

const iconMap = {
    close: require('../icons/close.svg').default,
    'chevron-down': require('../icons/chevron-down.svg').default,
};

export function Icon({ name, width, height }: { name: keyof typeof iconMap; width?: number; height?: number }) {
    const icon = iconMap[name];
    return (
        <svg viewBox={icon.viewBox} width={width} height={height}>
            <use xlinkHref={`#${icon.id}`} />
        </svg>
    );
}
