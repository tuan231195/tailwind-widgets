import {useEffect, useState} from 'react';

export function useMeasure(node, onMeasure) {
    const ResizeObserver = (window as any).ResizeObserver;
    if (ResizeObserver) {
        const ro = new ResizeObserver(() => onMeasure());
        ro.observe(node);
        return () => {
            ro.disconnect();
        };
    } else {
        const cachedSize = { width: 0, height: 0 };
        function handleMutate() {
            const { width, height } = node.getBoundingClientRect();
            if (cachedSize.width !== width || cachedSize.height !== height) {
                cachedSize.width = width;
                cachedSize.height = height;
                onMeasure();
            }
        }
        const mob = new MutationObserver(handleMutate);
        const mutationObserverOption = {
            subtree: true,
            childList: true,
            attributes: true,
            characterData: true,
        };
        mob.observe(node, mutationObserverOption);
        return () => {
            mob.disconnect();
        };
    }
}

export function useBoundingClientRect(target) {
    const [rect, setRect] = useState(target.getBoundingClientRect());
    useEffect(() => {
        return useMeasure(target, () => {
            setRect(target.getBoundingClientRect());
        });
    }, [target]);
    return rect;
}
