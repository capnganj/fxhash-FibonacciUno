import { interpolateCool, interpolateInferno, interpolateMagma, interpolateWarm, interpolateViridis } from 'd3-scale-chromatic'
import { rgb, color } from 'd3-color';

class Features {
    constructor() {

        //color scheme 
        this.color = {
            name: "",
            inverted: false
        };
        this.setColorPalette();

    }

    //map function logic from processing <3
    map(n, start1, stop1, start2, stop2) {
        const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
        return newval;
    }

    //color palette interpolation
    interpolateFn(val) {
        let col;
        switch (this.color.name) {
            case "Cool": 
                col = rgb(interpolateCool(val));
                break
            case "Warm": 
                col = rgb(interpolateWarm(val));
                break;
            case "Viridis": 
                col = rgb(interpolateViridis(val));
                break;
            case "Magma": 
                col = rgb(interpolateMagma(val));
                break;
            case "Inferno": 
                col = rgb(interpolateInferno(val));
                break;
            default:
                col = rgb(interpolateWarm(val));
        }

        if (this.color.inverted) {
            col = this.invertColor(col) 
        }

        return col;
    }

    //color inverter
    invertColor(rgb, bw) {
        let hex = color(rgb).formatHex()
        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        // convert 3-digit hex to 6-digits.
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) {
            throw new Error('Invalid HEX color.');
        }
        var r = parseInt(hex.slice(0, 2), 16),
            g = parseInt(hex.slice(2, 4), 16),
            b = parseInt(hex.slice(4, 6), 16);
        if (bw) {
            // https://stackoverflow.com/a/3943023/112731
            return (r * 0.299 + g * 0.587 + b * 0.114) > 186
                ? '#000000'
                : '#FFFFFF';
        }
        // invert color components
        r = (255 - r).toString(16);
        g = (255 - g).toString(16);
        b = (255 - b).toString(16);
        // pad each with zeros and return
        let inverted = color("#" + padZero(r) + padZero(g) + padZero(b)).rgb();
        return inverted;

        function padZero(str, len) {
            len = len || 2;
            var zeros = new Array(len).join('0');
            return (zeros + str).slice(-len);
        }
    }

    //set color palette globally
    setColorPalette() {
        let c = fxrand();

        //set palette
        if (c < 0.15) {
            this.color.name = "Warm"
        }
        else if (c < 0.25) {
            this.color.name = "Cool"
        }
        else if (c < 0.5) {
            this.color.name = "Viridis"
        }
        else if (c < 0.7) {
            this.color.name = "Magma"
        }
        else {
            this.color.name = "Inferno"
        }

        //inverted?
        if( fxrand() > 0.666 ) {
            this.color.inverted = true;
        }
    }
}

export {Features}