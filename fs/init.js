load('api_gpio.js');
load('api_neopixel.js');
load('api_shadow.js');
load('api_math.js');

let pin = 5, numPixels = 12, colorOrder = NeoPixel.GRB;

let r = 0;
let g = 0;
let b = 0;

let state = {
  on: true,
  brightness: 255,
  pin: pin,
  numPixels: numPixels,
  effect: EFFECT.NONE,
  rgb: {
    r: r,
    g: g,
    b: b
  }
};

//Upon startup, report current actual state, "reported"
//When cloud sends us a command to update state (" "), do it
Shadow.addHandler(function(event, obj) {
  if (event === 'CONNECTED') {
    Shadow.update(0, state);  // Report device state
  } else if (event === 'UPDATE_DELTA') {
    for (let key in state) {
      if (obj[key] !== undefined) {
        print(key + ' has changed');
        state[key] = obj[key]; //only update the key that has changed (aka delta)
      }
    }
    
    print('local state: ' + JSON.stringify(state));
    
    let on = state.on;

    print(r);
    print(g);
    print(b);
    
    if(undefined !== state.rgb.r) {
      r = state.rgb.r;
    }
    
    if(undefined !== state.rgb.g) {
      g = state.rgb.g;
    }
    
    if(undefined !== state.rgb.b) {
      b = state.rgb.b;
    }
    
    //clear strip
    turnStripOff();
    
    //only change LEDs if strip is on
    if(on) {
      let strip = createNewStrip(pin, numPixels);
      for(let i = 0; i < numPixels; i++) {
        strip.setPixel(i, r, g, b);
      }
      strip.show();
    }
    
    //update device shadow
    Shadow.update(0, state);  // Report device state
  }
}, null);

let turnStripOff = function() {
  strip.clear();
  strip.show();
};

let createNewStrip = function(pin, numPixels) {
  let strip = NeoPixel.create(pin, numPixels, colorOrder);
  return strip;
};
