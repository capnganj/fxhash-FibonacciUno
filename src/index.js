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

    //set the background color 
    sk.background(0);
    sk.drawingContext.shadowColor = 'black';
    sk.drawingContext.shadowBlur = 15;
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
      let rgb = feet.color.inverted ? feet.interpolateFn( i / 267 ) : feet.interpolateFn( 1 - i / 267 );
      let col = sk.color(rgb.r, rgb.g, rgb.b);
      //let col = sk.color(colors[colIndex].r, colors[colIndex].g, colors[colIndex].b);
      col.setAlpha(feet.map(i, 0, 267, 150, 0));
      sk.fill(col);

      //size
      let l = Math.sqrt(Math.pow(sk.windowWidth, 2) + Math.pow(sk.windowHeight, 2));
      let r = feet.map(i, 0, 267, l/40, l/5);

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
    sk.background(0);
    sk.loop();
  };
};

//pass our sketch to p5js
let myp5 = new p5(s);