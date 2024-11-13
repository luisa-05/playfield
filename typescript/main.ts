import domElements from './dom-elements';
import DriverDemo from './driver-demo';
import Nav from './nav';
import Playfield from './playfield';
import SavePlayfieldSettings from './save-playfield-settings';
import vars from './vars';

if (domElements.playfieldElement) {
  vars.playfield = domElements.playfieldElement;
}

// // DELETE:
// await fetch(`http://localhost:3000/playfield`, {
//   method: 'DELETE',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

new DriverDemo();
new Nav();
const playfield = new Playfield();
playfield.generate();
playfield.init();
new SavePlayfieldSettings();
