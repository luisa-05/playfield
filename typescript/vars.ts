import domElements from './dom-elements';
import { Assets, CarColorsData, Vars } from './interfaces';
import Modal from './modal';
import CarMove from './objects/car-move';
import SavePlayfield from './save-playfield';
import Utilities from './utilities';

const assets: Assets = {
  srcTree: 'imgs/tree.png',
  srcLake: 'imgs/lake.png',

  carSidewards(direction: 'left' | 'right', carId: number): string {
    return `
<svg class="playfield__car playfield__car--to-${direction}" data-id="${carId}" data-kind="car-to-${direction}" data-color="red" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 31.445 31.445">
<path class="car-wheels" d="M7.592 16.86c-1.77 0-3.203 1.434-3.203 3.204a3.203 3.203 0 1 0 3.203-3.204zm0 4.172c-.532 0-.968-.434-.968-.967s.436-.967.968-.967a.968.968 0 0 1 0 1.934z"/>
<path d="m30.915 17.439-.524-4.262a1.57 1.57 0 0 0-1.643-1.373l-1.148.064-3.564-3.211a1.865 1.865 0 0 0-1.249-.479l-7.241-.001a7.133 7.133 0 0 0-4.468 1.573l-4.04 3.246-5.433 1.358a1.568 1.568 0 0 0-1.188 1.521v1.566a.415.415 0 0 0-.417.415v2.071c0 .295.239.534.534.534h3.067c-.013-.133-.04-.26-.04-.396 0-2.227 1.804-4.029 4.03-4.029s4.029 1.802 4.029 4.029c0 .137-.028.264-.041.396h8.493c-.012-.133-.039-.26-.039-.396a4.028 4.028 0 1 1 8.057 0c0 .137-.026.264-.04.396h2.861a.533.533 0 0 0 .533-.534v-1.953a.528.528 0 0 0-.529-.535zm-10.747-5.237-10.102.511L12 11.158a5.911 5.911 0 0 1 3.706-1.305h4.462v2.349zm1.678-.085V9.854h.657c.228 0 .447.084.616.237l2.062 1.856-3.335.17z"/>
<path class="car-wheels" d="M24.064 16.86c-1.77 0-3.203 1.434-3.203 3.204a3.203 3.203 0 1 0 3.203-3.204zm0 4.172c-.533 0-.967-.434-.967-.967s.434-.967.967-.967c.531 0 .967.434.967.967s-.435.967-.967.967z"/></svg>`;
  },

  carFrontside(carId: number): string {
    return `
<svg class="playfield__car playfield__car--frontside" data-id="${carId}" data-kind="car-frontside" data-color="red" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 416 256s32 12.76 32 31.9-12.8 31.9-32 31.9z"/></svg>`;
  },

  carBackside(carId: number): string {
    return ` 
<svg class="playfield__car playfield__car--backside" data-id="${carId}" data-kind="car-backside" data-color="red"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m20.772 10.155-1.368-4.104A2.995 2.995 0 0 0 16.559 4H7.441a2.995 2.995 0 0 0-2.845 2.051l-1.368 4.104A2 2 0 0 0 2 12v5c0 .738.404 1.376 1 1.723V21a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2h12v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2.277A1.99 1.99 0 0 0 22 17v-5a2 2 0 0 0-1.228-1.845zM7.441 6h9.117c.431 0 .813.274.949.684L18.613 10H5.387l1.105-3.316A1 1 0 0 1 7.441 6zM5.5 16a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 5.5 16zm13 0a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 18.5 16z"/></svg>
          `;
  },

  playBtn(): string {
    return ` 
<svg
  class="simulation-play-btn"
  xmlns="http://www.w3.org/2000/svg"
  xml:space="preserve"
  style="enable-background: new 0 0 512 512"
  viewBox="0 0 512 512"
>
  <path
    d="M405.2 232.9 126.8 67.2c-3.4-2-6.9-3.2-10.9-3.2-10.9 0-19.8 9-19.8 20H96v344h.1c0 11 8.9 20 19.8 20 4.1 0 7.5-1.4 11.2-3.4l278.1-165.5c6.6-5.5 10.8-13.8 10.8-23.1s-4.2-17.5-10.8-23.1z"
  />
</svg>`;
  },

  pauseBtn(): string {
    return `
<svg
  class="simulation-pause-btn"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 320 512"
>
  <path
    d="M272 63.1h-32c-26.51 0-48 21.49-48 47.1v288c0 26.51 21.49 48 48 48l32 1.8c26.51 0 48-21.49 48-48V112c0-26.51-21.5-48.9-48-48.9zm-192 0H48c-26.51 0-48 21.49-48 48v288C0 426.5 21.49 448 48 448h32c26.51 0 48-21.49 48-48V112c0-26.51-21.5-48.9-48-48.9z"
  />
</svg>`;
  },

  navArrowClose(): string {
    return `
<svg
  class="arrow-to-left"
  xmlns="http://www.w3.org/2000/svg"
  xml:space="preserve"
  style="enable-background: new 0 0 512 512"
  viewBox="0 0 512 512"
>
  <path
    d="M189.3 128.4 89 233.4c-6 5.8-9 13.7-9 22.4s3 16.5 9 22.4l100.3 105.4c11.9 12.5 31.3 12.5 43.2 0 11.9-12.5 11.9-32.7 0-45.2L184.4 288h217c16.9 0 30.6-14.3 30.6-32s-13.7-32-30.6-32h-217l48.2-50.4c11.9-12.5 11.9-32.7 0-45.2-12-12.5-31.3-12.5-43.3 0z"
  />
</svg>`;
  },

  navArrowOpen(): string {
    return `
<svg
  class="arrow-to-right"
  xmlns="http://www.w3.org/2000/svg"
  xml:space="preserve"
  style="enable-background: new 0 0 512 512"
  viewBox="0 0 512 512"
>
  <path
    d="m322.7 128.4 100.3 105c6 5.8 9 13.7 9 22.4s-3 16.5-9 22.4L322.7 383.6c-11.9 12.5-31.3 12.5-43.2 0-11.9-12.5-11.9-32.7 0-45.2l48.2-50.4h-217c-17 0-30.7-14.3-30.7-32s13.7-32 30.6-32h217l-48.2-50.4c-11.9-12.5-11.9-32.7 0-45.2 12-12.5 31.3-12.5 43.3 0z"
  />
</svg>`;
  },
};

const carColors: Record<string, CarColorsData> = {
  red: { value: '#c10707', label: 'Rot' },
  green: { value: '#1eaf1e', label: 'Grün' },
  blue: { value: '#0000FF', label: 'Blau' },
  orange: { value: 'rgb(255, 167, 0)', label: 'Orange' },
};

const tileKind: Record<string, string> = {
  lawn: 'Wiese',
  street: 'Straße',
};

const domObjects: Record<string, string> = {
  tree: 'Baum',
  lake: 'See',
  car: 'Auto',
  eventarea: 'Eventarea',
};

const contentEventarea: Record<string, string> = {
  sheeps: 'Schafe',
  carPark: 'Parkplatz',
  plotArea: 'Grundstück',
  lake: 'See',
  playground: 'Spielplatz',
};

const vars: Vars = {
  playfield: {} as HTMLDivElement,
  widthField: 0,
  heightField: 0,
  maxWidth: 25,
  minWidth: 23,
  maxHeight: 15,
  minHeight: 5,
  navRect: domElements.navContainer?.getBoundingClientRect(),
  tileSize: 70,
  tilesArr: [],
  tiles: [],
  streetTiles: [],
  lawnTiles: [],
  outerStreetTiles: [],
  destinationStreetTiles: [],
  carsArr: [],
  cars: [],
  trees: [],
  lakes: [],
  eventareas: [],
  eventareasArr: [],
  counterIdObjects: 1,
  assets,
  carColors,
  tileKind,
  domObjects,
  contentEventarea,
  storedPlayfields: [],
  liFieldsArr: [],
  counterLiFields: 1,
  intervalSimulation: 0,
  simulationRunning: true,
  manualScaling: false,
  automaticSave: true,
  utilities: new Utilities(),
  carMove: new CarMove(),
  savePlayfield: new SavePlayfield(),
  modal: new Modal(),
  parkingCars: [],
  parkIntervall: 0,
};

export default vars;
