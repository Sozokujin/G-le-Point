import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

let timeoutId: NodeJS.Timeout;

export function debounce(fn: Function, delay: number = 300) {
    return function (...args: any[]) {
        if (timeoutId) clearTimeout(timeoutId);
        
        timeoutId = setTimeout(() => {
            fn(...args);
        }, delay);
    }();
}