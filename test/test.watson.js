import * as svgmo from "svgmotion";
const voc = new svgmo.WatsonTTS();

// voc._say('hello world', '/tmp/say1.ogg').then((data) => {
//     console.warn(data);
// });

voc.say('good morning').then((data) => {
    console.warn(data);
});

const gvoc = new svgmo.GTTS();
gvoc.say('hello world').then((data) => {
    console.warn(data);
});