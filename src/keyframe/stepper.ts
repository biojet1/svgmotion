import {cubic_bezier_y_of_x} from "./bezier.js"

function apply<T>(a: Array<any>, u:(frame: number) => T, s:number, e:number): void {
  for (const d of a) {
    switch(d.$) {
        case 'repeat': {
         console.log("nothing");break;
        } 
        case '<': { 
         console.log("nothing");break;
        } 
        case 'p': {
         console.log("nothing");break;
        }
    }
  }
} 