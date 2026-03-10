declare module '*/colorUtils' {
    export function getComplementaryColor(hex: string): string;
    export function getAnalogousColors(hex: string): string[];
    export function getTriadicColors(hex: string): string[];
    export function getSplitComplementaryColors(hex: string): string[];
    export function getSquareColors(hex: string): string[];
    export function getTetradicColors(hex: string): string[];
    export function getMonochromatic(hex: string): { hex: string, hsl: any, label: string }[];
    export function hexToRgbString(hex: string): string;
    export function hexToHslString(hex: string): string;
    export function rgbToHex(r: number, g: number, b: number): string;
    export function hslToHex(h: number, s: number, l: number): string;
}
