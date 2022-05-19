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
  let mask;

  //unitless x and y maximums -- need these to map against
  let maxX= 0;
  let maxY = 0;

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
      "Position" : feet.position.tag, //where is the focal point?
      "Direction" : feet.direction.tag,  //radial stacking direction
      "Quantity": feet.quantity.tag  //how many circles in the loop?
    };
    console.log("fxhashFeatures", window.$fxhashFeatures);
    //console.log("HashSmokeFeatures", feet);

    //create the mask image and calculate length
    createMask();

    //set the background color and other sketch-level variables
    sk.drawingContext.shadowColor = 'black';
    sk.drawingContext.shadowBlur = length * 0.005;
    sk.noStroke();
    sk.ellipseMode(sk.CENTER);

    //make colors for the sketch -- happens only once so order is the same on resizes
    makeColors();

    //set other sketch vars using features and length
    numberOfCircles = feet.quantity.value
    factor = feet.map(fxrand(), 0, 1, 1.47, 1.53);
    //console.log("factor", factor);

    //max unitless x and y use the number of circles and the factor to figure the largest X and Y values
    for (let i = numberOfCircles; i > numberOfCircles-10; i--) {
      let test = i * factor;
      let newX = Math.abs(feet.direction.value ? test * Math.cos(test) : test * Math.sin(test))
      let newY = Math.abs(feet.direction.value ? test * Math.sin(test) : test * Math.cos(test))
      if ( newX > maxX) {
        maxX = newX;
      }
      if ( newY > maxY ) {
        maxY = newY;
      }
    }

    //set i to number of circles here and in resize
    i = numberOfCircles;
    sk.background(28);

    
  };


  //sketch draw function 
  sk.draw = () => {

    //circles
    if (i >= 0) {

      sk.drawingContext.shadowBlur = length * 0.005;
      
      //position

      //raw feed of floats for trig to chew on
      let x = i * factor;
      //unitless offset values 
      let xx = feet.direction.value ? x * Math.cos(x) : x * Math.sin(x);
      let yy = feet.direction.value? x * Math.sin(x) : x * Math.cos(x);
      //scaled offset values

      //scale by unitless maxX and maxY ranges
      let xxx = feet.position.orientation == "H" ? feet.map(xx, maxX * -1, maxX, length/2 * -1, length/2) : feet.map(xx, maxX * -1, maxX, length*0.6 * -1, length*0.6);
      let yyy = feet.position.orientation == "H" ? feet.map(yy, maxY * -1, maxY, length/2 * -1, length/2) : feet.map(yy, maxY * -1, maxY, length*0.6 * -1, length*0.6 );


      //colors
      let rgb = colors[i];
      let col = sk.color(rgb.r, rgb.g, rgb.b);
      col.setAlpha(feet.map(i, 0, numberOfCircles, feet.opacity.topValue, feet.opacity.baseValue));
      sk.fill(col);

      //size
      let r = feet.map(i, numberOfCircles, 0, length/feet.radii.baseValue, length/feet.radii.topValue);

      //position
      let xPos, yPos;
      if (feet.position.tag == "Right") {
        xPos = (sk.windowWidth * 0.618) + xxx;
        yPos = (sk.windowHeight * 0.47) + yyy
      }
      else if (feet.position.tag == "Left") {
        xPos = (sk.windowWidth * 0.618/2) + xxx;
        yPos = (sk.windowHeight * 0.47) + yyy
      }
      else if (feet.position.tag == "Top") {
        xPos = (sk.windowWidth / 2) + xxx;
        yPos = (sk.windowHeight * 0.618/2) + yyy
      }
      else {
        xPos = (sk.windowWidth / 2) + xxx;
        yPos = (sk.windowHeight * 0.618) + yyy
      }
      //yes!
      sk.ellipse( xPos, yPos, r, r);

      //increment
      i--



      //draw mask
      if (i == 0) {
        sk.drawingContext.shadowBlur = length * 0.015
      } else {
        sk.drawingContext.shadowBlur = 0;
      }
      //sk.drawingContext.shadowBlur = 0;
      sk.image(mask, 0, 0);
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
    createMask();
    sk.drawingContext.shadowBlur = length * 0.005;
    sk.background(28);
    sk.loop();
  };

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

  function createMask() {
    //create graphics the size of the canvas
    let g = sk.createGraphics(sk.windowWidth, sk.windowHeight);
    g.rectMode(sk.CENTER);
    g.ellipseMode(sk.CENTER);
    g.fill(36)
    g.rect(sk.windowWidth/2, sk.windowHeight/2, sk.windowWidth, sk.windowHeight)
    

    let a = sk.color(255);
    a.setAlpha(255);
    g.fill(a);
    g.noStroke();
    g.blendMode(sk.REMOVE);
    //handle verical and horizontal stuffs
    if( feet.position.orientation == "H" ) {
      //draw a horizontal rectangle and compute length
      g.rect(sk.windowWidth/2, sk.windowHeight*0.47, sk.windowWidth * 0.85, sk.windowWidth * 0.85 * 0.618);
      length = Math.sqrt(Math.pow(sk.windowWidth * 0.85, 2) + Math.pow(sk.windowWidth * 0.85 * 0.618, 2));
    }
    else {
      //draw a vertical rectangle and compute length
      g.rect(sk.windowWidth/2, sk.windowHeight*0.47, sk.windowHeight * 0.85 * 0.618, sk.windowHeight * 0.85)
      length = Math.sqrt(Math.pow(sk.windowHeight * 0.9 * 0.618, 2) + Math.pow(sk.windowHeight * 0.85, 2))
    }
    mask = g.get();
  }
};




//pass our sketch to p5js
let myp5 = new p5(s);