//CAPNGANJ fibonacci study numero uno
//May, 2022

//imports
import p5 from 'p5';
import { Features } from './features';

//p5 sketch instance
const s = ( sk ) => {

  //global sketch variables
  let feet = {};
  let previewed = false;
  let factor = 1.5;
  let colors = [];
  let numberOfCircles = 512;

  //iteration vars -- these get reset on screen resize
  let i;
  let length;

  //sketch setup
  sk.setup = () => {
    sk.createCanvas(sk.windowWidth, sk.windowHeight);
    
    //new featuresClass
    feet = new Features();
   
    // FX Features
    window.$fxhashFeatures = {
      "Palette" : feet.color.inverted ? feet.color.name + " Invert" : feet.color.name,
      "Radii": feet.radii.tag, //circle sizes
      "Opacity" : feet.opacity.tag, //circle opacity
      "Noise" : feet.noise.tag, //how shuffled are the colors?
      "Position" : "Top", //where is the focal point?
      "Direction" : feet.direction.tag,  //radial stacking direction
      "Quantity": feet.quantity.tag  //how many circles in the loop?
    };
    console.log("fxhashFeatures", window.$fxhashFeatures);
    //console.log("HashSmokeFeatures", feet);

    //set the screen diagonal
    length = screenDiagonal();

    //set the background color and other sketch-level variables
    sk.drawingContext.shadowColor = 'black';
    sk.drawingContext.shadowBlur = length * 0.003;
    sk.noStroke();
    sk.ellipseMode(sk.CENTER);

    //make colors for the sketch -- happens only once so order is the same on resizes
    makeColors();

    //set other sketch vars using features
    numberOfCircles = feet.quantity.value
    factor = feet.map(fxrand(), 0, 1, 1.47, 1.53);
    //console.log("factor", factor);

    //set i to number of circles here and in resize
    i = numberOfCircles;
    sk.background(20);
  };


  //sketch draw function 
  sk.draw = () => {

    //sk.background(0);
    if (i >= 0) {
      
      //position
      let x = i * factor;
      let xx = feet.direction.value ? x * Math.cos(x) : x * Math.sin(x);
      let yy = feet.direction.value? x * Math.sin(x) : x * Math.cos(x);

      //colors
      let rgb = colors[i];
      let col = sk.color(rgb.r, rgb.g, rgb.b);
      col.setAlpha(feet.map(i, 0, numberOfCircles, feet.opacity.topValue, feet.opacity.baseValue));
      sk.fill(col);

      //size
      let r = feet.map(i, numberOfCircles, 0, length/feet.radii.baseValue, length/feet.radii.topValue);

      //yes
      sk.ellipse( (sk.windowWidth * 0.618) + xx, sk.windowHeight/2 + yy, r, r);

      //increment
      i--
    }

    //call preview and noloop after going all the way through
    else{
      sk.noLoop();
      if( previewed == false) {
        fxpreview();
        previewed = true;
      }
    }
  };

  

  //handle window resize
  sk.windowResized = () => {
    i=numberOfCircles;
    sk.resizeCanvas(sk.windowWidth, sk.windowHeight);
    length = screenDiagonal();
    sk.drawingContext.shadowBlur = length * 0.003;
    sk.background(20);
    sk.loop();
  };

  function screenDiagonal() {
    return Math.sqrt(Math.pow(sk.windowWidth, 2) + Math.pow(sk.windowHeight, 2));
  }

  function makeColors() {
    for (let j = numberOfCircles; j >= 0; j -= 1) {
      //as i counts down, reduce the chances of a selection off of the gradient
      //i's t value going through the loop
      let t = j / numberOfCircles;
      //as the ratio appraches 0, the range multiplier should get closer to 0
      let rangeMultiplier = feet.map(t, 0, 1, feet.noise.baseValue, feet.noise.topValue)
      //add a random number to t, using the range multiplier to set range of random values
      let rand = feet.map(fxrand(), 0, 1, rangeMultiplier * -1, rangeMultiplier);
      let tWithNoise = t + rand;

      //conditional manages putting lighter colors on top in either standard or inverted mode
      let rgb = feet.color.inverted ? feet.interpolateFn( 1 - tWithNoise ) : feet.interpolateFn( tWithNoise );

      //add to the global array of color
      colors.push(rgb);
    }
  }
};




//pass our sketch to p5js
let myp5 = new p5(s);