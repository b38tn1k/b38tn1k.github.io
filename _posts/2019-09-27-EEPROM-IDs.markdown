---
layout: post
title:  "Projects with more than one Arduino"
date:   2019-09-27
categories: arduino
comments: True
---
The other day I introduced a friend to Arduino. They already have a background in code but hadn't touched anything embedded for a minute. For a starter project we talked about making music with the Arduino using piezeo speakers and the [Arduino tone library](https://www.arduino.cc/reference/en/language/functions/advanced-io/tone/).

I put together an example project just to make sure i had the answers to any questions and realized the tone library is pretty fun for lofi chip music. You have a basic squarewave beep for melodies, using random() you can generate a psuedo-white noise sound that works well for percussion. If you give random a range to 'filter' the noise you can make a snare drum sound different from a hihat sound. Kick drums can be made with a fast descending note, pitching it up for toms:

{% highlight null %}
// Percussion Sounds for the Arduino tone library
int tonePin = 7; //any PWM pin works afaik
void kick() {
  for (int i = 234; i > 34; i--) {
    tone(tonePin, i, 100);
  }
  noTone(tonePin);
}

void loTom() {
  for (int i = 1034; i > 534; i--) {
    tone(tonePin, i, 10);
  }
  noTone(tonePin);
}

void hiTom() {
  for (int i = 1534; i > 1034; i--) {
    tone(tonePin, i, 10);
  }
  noTone(tonePin);
}

void snare() {
  for (int i = 534; i > 34; i--) {
    tone(tonePin, random(1000, 2000), 100);
  }
  noTone(tonePin);
}

void hat() {
  for (int i = 100; i > 0; i--) {
    tone(tonePin, random(3000, 6000), 1);
  }
  noTone(tonePin);
}
{% endhighlight %}

I wanted to make a bassline play with a drum track. Due to the single timer available on the Arduino Uno this is not possible. I found 3 more Arduinos and decided to make an 'orchestra'.

I implemented a basic sequencer using a 16 int array and the timer method from BlinkWithoutDelay.ino and started making beepy noises using 2 Arduinos. I wrote a beat, uploaded it to Arduino1, sequenced some frequencies and uploaded them to Arduino2 from the same (now edited) sketch. Commenting code in and out for the difference sequences was not really ideal, nor was the idea of 4 separate sketches.

Using [Arduino EEPROM library](https://www.arduino.cc/en/Reference/EEPROM) I figured out how to get each individual Arduino to do different things when programmed from the same sketch. This works well in this case as a lot of the code is shared, it is just the musical sequence that changes from Arduino1..4.

It is a 2 step process:

1. Using the EEPROM I tagged each Arduino with a unique ID that is stored in the Arduino's 'permanent' memory. Then I removed the tagging code; no more writing to EEPROM.

2. With the now ID'd Arduinos, in the setup() function I look up the ID number and then using a conditional I can set each Arduino to send a different pattern to the sequencer.

You still have to program each Arduino by swapping ports in the IDE but once the initial EEPROM ID setup is done you don't need to worry about accidentally erasing one sequence for another.

Synchronising the sequencers is currently done by power cycling all Arduinos at the same time using a USB hub, interestingly they fall out of sync with each other after about 5 minutes. It is a mix of Genuino and clone hardware so maybe there is a difference in the crystal??? Anyway, this can be fixed by implementing the sequencer on Arduino1 and slave-ing Arduino2..4 via an interrupt pin, which i will probably do next.

[follow along here](https://github.com/b38tn1k/toneOrchestra)

## hardware

Hi TZ! you need:

- an Arduino, which you have
- a [breadboard and some wire](https://www.amazon.com/microtivity-400-point-Experiment-Breadboard-Jumper/dp/B004RXKWDQ/ref=asc_df_B004RXKWDQ/?tag=hyprod-20&linkCode=df0&hvadid=198069655422&hvpos=1o2&hvnetw=g&hvrand=17074970942676933232&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=1019244&hvtargid=pla-393596646141&psc=1)
- some [beepy buzzers](https://www.amazon.com/Gikfun-Terminals-Passive-Electronic-Arduino/dp/B01GJLE5BS/ref=sr_1_7?keywords=piezo+speakers+arduino&qid=1569601582&s=gateway&sr=8-7)
- an [100 Ohm resistor](https://www.amazon.com/REXQualis-Resistor-Assortment-Kit-Values/dp/B07D54XMFK/ref=sr_1_15?crid=2TU31IQ6KKPLD&keywords=100+ohm+resistor&qid=1569601663&s=gateway&sprefix=100+ohm%2Caps%2C191&sr=8-15)

Connect one leg of the speaker to pin 7. Connect the other leg to the 100Ohm resistor and then to ground. Use the tone library to make beeps.
