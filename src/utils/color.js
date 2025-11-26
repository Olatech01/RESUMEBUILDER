// src/utils/colors.js
// Convert CIE Lab color to sRGB string. Handles formats like: lab(53.232 80.109 -67.22 / 0.5)
const labToRgbString = (labString) => {
    try {
        // extract numbers (L a b [ / alpha])
        const parts = labString.replace(/\s+/g, ' ').trim();
        const inner = parts.match(/lab\(([^)]+)\)/i);
        if (!inner) return labString;

        const vals = inner[1].split('/').map(s => s.trim());
        const nums = vals[0].split(/\s+/).map(s => parseFloat(s.replace('%','')));
        if (nums.length < 3) return labString;

        const L = nums[0];
        const a = nums[1];
        const b = nums[2];
        let alpha = 1;
        if (vals[1]) {
            alpha = parseFloat(vals[1]);
            if (isNaN(alpha)) alpha = 1;
        }

        // Conversion Lab -> XYZ
        const refX = 95.047, refY = 100.0, refZ = 108.883;
        const fy = (L + 16) / 116;
        const fx = fy + a / 500;
        const fz = fy - b / 200;

        const fx3 = Math.pow(fx, 3);
        const fz3 = Math.pow(fz, 3);
        const fy3 = Math.pow(fy, 3);

        const xr = fx3 > 0.008856 ? fx3 : (fx - 16/116) / 7.787;
        const yr = fy3 > 0.008856 ? fy3 : (fy - 16/116) / 7.787;
        const zr = fz3 > 0.008856 ? fz3 : (fz - 16/116) / 7.787;

        const X = xr * refX;
        const Y = yr * refY;
        const Z = zr * refZ;

        // XYZ -> linear RGB (sRGB)
        const x = X / 100;
        const y = Y / 100;
        const z = Z / 100;

        let r = x *  3.2406 + y * -1.5372 + z * -0.4986;
        let g = x * -0.9689 + y *  1.8758 + z *  0.0415;
        let bb = x *  0.0557 + y * -0.2040 + z *  1.0570;

        const gamma = (c) => {
            if (c <= 0.0031308) return 12.92 * c;
            return 1.055 * Math.pow(c, 1/2.4) - 0.055;
        }

        r = Math.min(Math.max(0, gamma(r)), 1);
        g = Math.min(Math.max(0, gamma(g)), 1);
        bb = Math.min(Math.max(0, gamma(bb)), 1);

        const R = Math.round(r * 255);
        const G = Math.round(g * 255);
        const B = Math.round(bb * 255);

        if (alpha !== 1) return `rgba(${R}, ${G}, ${B}, ${alpha})`;
        return `rgb(${R}, ${G}, ${B})`;
    } catch (e) {
        return labString;
    }
}

export const fixTailwindColors = (element) => {
    const clone = element.cloneNode(true);
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.width = `${element.offsetWidth}px`;
    document.body.appendChild(clone);

    const allElements = clone.querySelectorAll('*');
    allElements.forEach(el => {
        const computed = window.getComputedStyle(el);

        // background
        if (computed.backgroundColor && /lab\(/i.test(computed.backgroundColor)) {
            el.style.backgroundColor = labToRgbString(computed.backgroundColor);
        }

        // color
        if (computed.color && /lab\(/i.test(computed.color)) {
            el.style.color = labToRgbString(computed.color);
        }

        // border colors (shorthand)
        if (computed.borderTopColor && /lab\(/i.test(computed.borderTopColor)) {
            el.style.borderTopColor = labToRgbString(computed.borderTopColor);
        }
        if (computed.borderRightColor && /lab\(/i.test(computed.borderRightColor)) {
            el.style.borderRightColor = labToRgbString(computed.borderRightColor);
        }
        if (computed.borderBottomColor && /lab\(/i.test(computed.borderBottomColor)) {
            el.style.borderBottomColor = labToRgbString(computed.borderBottomColor);
        }
        if (computed.borderLeftColor && /lab\(/i.test(computed.borderLeftColor)) {
            el.style.borderLeftColor = labToRgbString(computed.borderLeftColor);
        }
    });

    return clone;
};