let myText = ["The warehouse looked like all the others. The","broken asphalt driveway punctuated by muddy","puddles. Rusted barbwire tangled around a partially","collapsed fence. The gate hung open, moving","silently in the slight breeze. A large transformer set","hard against the building appeared to be the only","recent addition.","","A rather large and angular shaped vehicle entered","the lot, ignoring the potholes and navigating","towards the small front door. The vehicle's bare","steel carapace reflected the sunlight such that it was","difficult to look directly at it. The vehicle stopped","and a single well-dressed passenger disembarked.","","She was met at the front door by a less-than-well-","dressed and slightly overweight man who appeared","both nervous and excited.","","\"You've made it! Sometimes the maps take people","the wrong way\"","","The entered the building and entered a large room","populated with server towers, each tower","connected by claustrophobically low networking","conduits that carry yellow and blue ribbons up and","down the aisles. It was noticeably warmer","compared to outside.","","\"We've been here around 2 years now. I started this","project back in the share house but some of my","roommates started complaining about the power","bill so I moved out and got this place. The system","is already up but it takes a minute or two for the","render engine to power on. Once it's ready I can","show you around inside. What you see here is what","we built with your initial funding. We run the sim","during work hours and switch over to crypto mining","when we are out. Gotta pay the bills somehow\"","","The man motioned to a desk with two worn office","chairs, a laptop and a pair of Virtual Reality","headsets.","","\"I find it easier to navigate the space this way. We","can render anything, follow subjects and pretty","much model any behavior, it's our own private","universe!\"","","Inside the headset was pitch black.","","\"It's pretty boring at the start before we just put in a","random seed and then we had too fast forward the","sim to verify. If we got something we liked we would","add it to the list. We have been getting closer and","closer to a stochastic model. Let's try this one\"","","In the headset, a speck of light at the center of the","view exploded into white before the white decayed","into speckled noise.","","\"So I'll keep it running fast but let's zoom in there\"","","A pale yellow dot in the top left grew to fill the view.","","\"You ok, some people get a bit dizzy at this scale.\"","","A familiar blue dot came into view.","","Earth","","Further","","North America","","Further","","West Coast","","Further","","Bay Area","","Further", ""];

let myTextSize = 22;

window.onresize = function() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas = null;
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  xoffset = 20;
  myTextSize = window.innerWidth/25.0;
  if (myTextSize > 32) {myTextSize=32;}
}

function setup() {
  canvas = null;
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  xoffset = 20;
  myTextSize = window.innerWidth/25.0;
  if (myTextSize > 32) {myTextSize=32;}
}
let offset = 0;
let yoffset = 0;
let xoffset;
let yprev;

function draw(){
  background(0);
  offset = yoffset/30.0;
  textSize(myTextSize*2);
  fill(150);
  text("Initial Conditions", xoffset, myTextSize*2);
  textSize(myTextSize);
  // offset+=0.01;
  fill(255);
  for (let i = 0; i < myText.length; i+=1){
    text(myText[(i + int(offset))%myText.length], xoffset, (i + 2)*myTextSize + myTextSize*2)
  }
}

function mouseDragged(event) {
  if (event.clientY > yprev){
    yoffset-=10;
  } else {
    yoffset+=15;
  }
  if (yoffset < 0){yoffset = 0;}
  yprev = event.clientY;
}

function mouseWheel(event) {
  //move the square according to the vertical scroll amount
  yoffset += event.delta;
  if (yoffset < 0){yoffset = 0;}
  //uncomment to block page scrolling
  //return false;
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    yoffset+=30;
  } else if (keyCode === DOWN_ARROW) {
   yoffset-=30;
  }
}
