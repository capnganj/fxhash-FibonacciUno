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
  let factor = 3.0;

  //iteration vars -- these get reset on screen resize
  let i = 267;
  let length = 0;

  //sketch setup
  sk.setup = () => {
    sk.createCanvas(sk.windowWidth, sk.windowHeight);
    
    //new featuresClass
    feet = new Features();
   
    // FX Features
    window.$fxhashFeatures = {
      "Palette" : feet.color.inverted ? feet.color.name + " Invert" : feet.color.name
    };
    console.log("fxhashFeatures", window.$fxhashFeatures);
    //console.log("HashSmokeFeatures", feet);

    //set the screen diagonal
    length = screenDiagonal();

    //set the background color 
    sk.background(0);
    sk.drawingContext.shadowColor = 'black';
    sk.drawingContext.shadowBlur = length * 0.005;
    sk.noStroke();
    sk.ellipseMode(sk.CENTER);

    factor = feet.map(fxrand(), 0, 1, 2.97, 3.03);
    console.log("factor", factor);
  };


  //sketch draw function 
  sk.draw = () => {

    //sk.background(0);
    if (i > -1) {
      
      //position
      let x = i * factor;
      let xx = x * Math.cos(x);
      let yy = x * Math.sin(x);

      //colors

      //as i counts down, reduce the chances of a selection off of the gradient
      //i's t value going through the loop
      let iRatio = i / 267;
      //as the ratio appraches 0, the range multiplier should get closer to 0
      let rangeMultiplier = feet.map(iRatio, 0, 1, 0.05, 0.5)
      //add a random number to t, using the range multiplier to set range of random values
      let rand = feet.map(fxrand(), 0, 1, rangeMultiplier * -1, rangeMultiplier);
      let iWithNoise = iRatio + rand;

      //conditional manages putting lighter colors on top in either standard or inverted mode
      let rgb = feet.color.inverted ? feet.interpolateFn( iWithNoise ) : feet.interpolateFn( 1 - iWithNoise );
      let col = sk.color(rgb.r, rgb.g, rgb.b);
      col.setAlpha(feet.map(i, 0, 267, 150, 0));
      sk.fill(col);

      //size
      let r = feet.map(i, 0, 267, length/40, length/5);

      //yes
      sk.ellipse( (sk.windowWidth * 0.618) + xx, sk.windowHeight/2 + yy, r, r);

      //increment
      i-=0.5
    }

    //call preview and noloop after going all the way through
    else{
      sk.noLoop();
    }
    

    // if( previewed == false) {
    //   fxpreview();
    //   previewed = true;
    // }
  };

  

  //handle window resize
  sk.windowResized = () => {
    i=267;
    sk.resizeCanvas(sk.windowWidth, sk.windowHeight);
    length = screenDiagonal();
    sk.drawingContext.shadowBlur = length * 0.005;
    sk.background(0);
    sk.loop();
  };

  function screenDiagonal() {
    return Math.sqrt(Math.pow(sk.windowWidth, 2) + Math.pow(sk.windowHeight, 2));
  }
};




//pass our sketch to p5js
let myp5 = new p5(s);