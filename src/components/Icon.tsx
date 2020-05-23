import React from 'react';

// @ts-ignore
const iconsContext = require.context('../icons/', true, /svg$/);

export type SvgIcon = 'close' | 'chevron-down';

export function Icon({ name, width, height }: { name: SvgIcon; width?: number; height?: number }) {
    const icon = iconsContext(`./${name}.svg`).default;
    return (
        <svg viewBox={icon.viewBox} width={width} height={height}>
            <use xlinkHref={`#${icon.id}`} />
        </svg>
    );
}
