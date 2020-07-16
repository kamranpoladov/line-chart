import React, { useState, useEffect } from 'react';
import { ContentRect } from 'resize-observer/lib/ContentRect';
import { ResizeObserver } from 'resize-observer';

export const useResizeObserver = (ref: React.MutableRefObject<any>) => {
    const [dimensions, setDimensions] = useState<ContentRect | null>(null);
    useEffect(() => {
        const observeTarget = ref.current;
        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                setDimensions(entry.contentRect);
            });
        })
        resizeObserver.observe(observeTarget);
        return () => {
            resizeObserver.unobserve(observeTarget);
        };
    }, [ref]);
    return dimensions;
};