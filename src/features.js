import { interpolateCool, interpolateInferno, interpolateMagma, interpolateWarm, interpolateViridis, interpolatePuRd, interpolateBuPu, interpolateYlGn } from 'd3-scale-chromatic'
import { rgb, color } from 'd3-color';


class Features {
    constructor() {

        //color scheme 
        this.color = {
            name: "",
            inverted: false
        };
        this.setColorPalette();

        //how noisy?  this drives the topmost layers' prbablilty of jumping around the color gradient
        this.noise = {
            tag: "",
            baseValue: 0.5,
            topValue: 0.5
        }
        this.setNoise();

        //how opaque do we stach up to?
        this.opacity = {
            tag: "",
            baseValue: 0.5,
            topValue: 0.5
        }
        this.setOpacity();

        //which way does it rotate?
        this.direction = {
            tag: "",
            value: 0
        }
        this.setDirection();

        //how big are the circles?
        this.radii = {
            tag: "",
            baseValue: 40,
            topValue: 5
        }
        this.setRadii();

        //how many circles in the stack?
        this.quantity = {
            tag: "",
            value: 256
        }
        this.setQuantity();

        //center position and orientation?
        this.position = {
            tag: "Right",
            orientation: "H"
        }
        this.setPosition();
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
            case "Purd":
                col = rgb(interpolatePuRd(1-val));
                break;
            case "Ylgn":
                col = rgb(interpolateYlGn(1-val));
                break;
            case "Bupu":
                col = rgb(interpolateBuPu(1-val));
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
        if (c < 0.05) {
            this.color.name = "Warm"
        }
        else if (c < 0.13) {
            this.color.name = "Cool"
        }
        else if (c < 0.27) {
            this.color.name = "Purd"
        }
        else if (c < 0.41) {
            this.color.name = "Ylgn"
        }
        else if (c < 0.53) {
            this.color.name = "Bupu"
        }
        else if (c < 0.65) {
            this.color.name = "Viridis"
        }
        else if (c < 0.8) {
            this.color.name = "Inferno"
        }
        else {
            this.color.name = "Magma"
        }

        //inverted?
        if( fxrand() > 0.666 ) {
            this.color.inverted = true;
        }
    }

    setNoise() {
        let n = fxrand();
        if (n < 0.38) {
            this.noise.tag = "Quiet"
        }
        else if ( n < 0.83) {
            this.noise.tag = "Nice"
        }
        else {
            this.noise.tag = "Noisy"
        }
        this.noise.topValue = this.map(n, 0, 1, 0.005, 0.07);
        this.noise.baseValue = this.map(n, 0, 1, 0.2, 0.5);
    }

    setOpacity() {
        let o = fxrand();
        if (o < 0.41) {
            this.opacity.tag = "Low";
        }
        else if (o < 0.69) {
            this.opacity.tag = "Some";
        }
        else {
            this.opacity.tag = "High"
        }
        this.opacity.baseValue = this.map(o, 0, 1, 5, 0);
        this.opacity.topValue = this.map(o, 0, 1, 150, 110);
    }

    setDirection() {
        let o = fxrand();
        if (o > 0.5) {
            this.direction.tag = "Clockwise";
        }
        else {
            this.direction.tag = "Counterclockwise"
        }
        this.direction.value = Math.round(o);
    }

    setRadii() {
        let r = fxrand();
        if (r < 0.27) {
            this.radii.tag = "Small";
        }
        else if (r < 0.43) {
            this.radii.tag = "Medium";
        }
        else if ( r < 0.71) {
            this.radii.tag = "Large";
        }
        else if ( r < 0.82 ) {
            this.radii.tag = "Extra Large";
        }
        else {
            this.radii.tag = "Extra Extra Large";
        }
        this.radii.baseValue = this.map(r, 0, 1, 4, 2);
        this.radii.topValue = this.map(r, 0, 1, 40, 20);
    }

    setQuantity() {
        let q = fxrand();
        if (q < 0.43) {
            this.quantity.tag = "Under"
        }
        else if (q < 0.79) {
            this.quantity.tag = "Within"
        }
        else {
            this.quantity.tag = "Over"
        }
        this.quantity.value = Math.round(this.map(q, 0, 1, 365, 512))
    }

    setPosition() {
        let p = fxrand();
        if (p < 0.25) {
            this.position.tag = "Right"
            this.position.orientation = "H"
        }
        else if (p < 0.5) {
            this.position.tag = "Left"
            this.position.orientation = "H"
        }
        else if ( p < 0.75 ) {
            this.position.tag = "Top"
            this.position.orientation = "V"
        }
        else {
            this.position.tag = "Bottom"
            this.position.orientation = "V"
        }
    }
}

export {Features}