export function isValidHex(hex) {
    const regex = /^#([0-9A-F]{3}){1,2}$/i
    return regex.test(hex)
}

export function normalizeHex(hex) {
    if (!hex.startsWith("#")) {
        hex = "#" + hex
    }

    hex = hex.toLowerCase()

    if (hex.length === 4) {
        hex =
            "#" +
            hex[1] +
            hex[1] +
            hex[2] +
            hex[2] +
            hex[3] +
            hex[3]
    }

    return hex
}

//Convert hex to rgb
export function hexToRgb(hex) {
    hex = normalizeHex(hex)
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return { r, g, b }
}

//Convert rgb to hsl
export function rgbToHsl(r, g, b) {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)

    let h, s, l
    l = (max + min) / 2
    if (max === min) {
        h = s = 0
    } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break
            case g:
                h = (b - r) / d + 2
                break
            case b:
                h = (r - g) / d + 4
                break
        }
        h /= 6
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    }
}

//Convert hex to hsl
export function hexToHsl(hex) {
    const { r, g, b } = hexToRgb(hex)
    return rgbToHsl(r, g, b)
}


//Convert hsl to rgb
export function hslToRgb(h, s, l) {
    s /= 100
    l /= 100

    const k = n => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)

    const f = n =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))

    return {
        r: Math.round(255 * f(0)),
        g: Math.round(255 * f(8)),
        b: Math.round(255 * f(4))
    }
}

//Convert rgb to hex
export function rgbToHex(r, g, b) {
    const toHex = (c) => {
        const hex = c.toString(16)
        return hex.length === 1 ? "0" + hex : hex
    }
    return "#" + toHex(r) + toHex(g) + toHex(b)
}

//Convert hsl to hex
export function hslToHex(h, s, l) {
    const { r, g, b } = hslToRgb(h, s, l)
    return rgbToHex(r, g, b)
}



// Color Harmony Functions


// Complementary: opposite on the color wheel (180°) 
// Complementary color = 180° hue shift.
export function getComplementaryColor(hex) {
    const { h, s, l } = hexToHsl(hex)
    const newHue = (h + 180) % 360
    return hslToHex(newHue, s, l)
}

// Analogous: adjacent on the color wheel (±30°) 
// Analogous colors are 30° apart on the hue wheel.
export function getAnalogousColors(hex) {
    const { h, s, l } = hexToHsl(hex)
    return [
        hslToHex((h - 30 + 360) % 360, s, l),
        hex,
        hslToHex((h + 30) % 360, s, l)
    ]
}

// Triadic: evenly spaced on the color wheel (120°)
// Triadic colors are 120° apart.
export function getTriadicColors(hex) {
    const { h, s, l } = hexToHsl(hex)
    return [
        hex,
        hslToHex((h + 120) % 360, s, l),
        hslToHex((h + 240) % 360, s, l)
    ]
}

// Split-Complementary: one base color and two colors adjacent to its complement (150° and 210°)
// Split-complementary colors are 150° and 210° apart from the base color.
export function getSplitComplementaryColors(hex) {
    const { h, s, l } = hexToHsl(hex)
    return [
        hex,
        hslToHex((h + 150) % 360, s, l),
        hslToHex((h + 210) % 360, s, l)
    ]
}

//Square: four colors evenly spaced on the color wheel (90°)
// Square colors are 90° apart.
export function getSquareColors(hex) {
    const { h, s, l } = hexToHsl(hex)
    return [
        hex,
        hslToHex((h + 90) % 360, s, l),
        hslToHex((h + 180) % 360, s, l),
        hslToHex((h + 270) % 360, s, l)
    ]
}

//Tetradic: two complementary pairs 
export function getTetradicColors(hex) {
    const { h, s, l } = hexToHsl(hex)
    return [
        hex,
        hslToHex((h + 60) % 360, s, l),
        hslToHex((h + 180) % 360, s, l),
        hslToHex((h + 240) % 360, s, l)
    ]
}


//Monochromatic: variations in lightness and saturation of a single hue
// Monochromatic colors keep the same hue but change lightness/saturation.
export function getMonochromatic(hex) {
    const hsl = hexToHsl(hex)
    if (!hsl) return []
    const variations = [
        { l: Math.min(95, hsl.l + 30), s: Math.max(10, hsl.s - 20) }, // very light
        { l: Math.min(85, hsl.l + 15), s: hsl.s },                     // light
        { l: hsl.l, s: hsl.s },                                        // base
        { l: Math.max(15, hsl.l - 15), s: hsl.s },                     // dark
        { l: Math.max(5, hsl.l - 30), s: Math.min(100, hsl.s + 10) }   // very dark
    ]
    const labels = [
        "Tint 2",
        "Tint 1",
        "Base",
        "Shade 1",
        "Shade 2"
    ]
    return variations.map((v, i) => ({
        hex: hslToHex(hsl.h, v.s, v.l),
        hsl: {
            h: hsl.h,
            s: v.s,
            l: v.l
        },
        label: labels[i]
    }))
}


export function hexToRgbString(hex) {
    const { r, g, b } = hexToRgb(hex)
    return `rgb(${r}, ${g}, ${b})`
}

export function hexToHslString(hex) {
    const { h, s, l } = hexToHsl(hex)
    return `hsl(${h}, ${s}%, ${l}%)`
}