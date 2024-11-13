import { faker } from '@faker-js/faker';
import domElements from './dom-elements';
import vars from './vars';
import TreeObject from './objects/tree-object';
import LakeObject from './objects/lake-object';
import CarObject from './objects/car-object';
import { Car, ConnectedObj, Tile } from './interfaces';
import LawnTile from './tiles/lawn-tile';
import StreetTile from './tiles/street-tile';
import RenderTile from './render-tile';
import SetStreetSvg from './tiles/set-street-svg';
import StreetNetworkEdit from './tiles/street-network-edit';
import CarMoveRender from './objects/car-move-render';
import EventareaObject from './objects/eventarea-object';
import SetCurveData from './tiles/set-curve-data';

class Playfield {
  constructor() {}

  init() {
    this.listenerGenerate();
  }

  setFieldGrid(loadPlayfield: boolean = false) {
    vars.playfield.innerHTML = '';
    vars.playfield.style.gridTemplateColumns = `repeat(${vars.widthField}, ${vars.tileSize}px)`;
    vars.playfield.style.gridTemplateRows = `repeat(${vars.heightField}, ${vars.tileSize}px)`;

    vars.navRect = domElements.navContainer?.getBoundingClientRect();
    vars.utilities.initialPlayfieldScale(vars.navRect);

    if (!loadPlayfield) {
      this.setFieldData();
      this.checkNeighbour();
      this.renderTiles();
      this.listenerLogAllData();
      this.renderObjects();
      vars.carMove.init();
      this.scalePlayfield();
      new StreetNetworkEdit();
      vars.savePlayfield.init();

      if (vars.automaticSave) {
        vars.savePlayfield.onSave(true);
        domElements.openPlayfieldList?.addEventListener(
          'click',
          vars.savePlayfield.toggleList,
        );
      }
    }
  }

  setFieldSize(width: number, height: number) {
    vars.widthField = width;
    vars.heightField = height;
  }

  setFieldData() {
    vars.tilesArr.length = 0;
    for (let y = 0; y < vars.heightField; y++) {
      for (let x = 0; x < vars.widthField; x++) {
        const tile: Tile = {
          element: 'tile',
          kind: null,
          x,
          y,
          contains: [],
          hasNeighbourTop: true,
          hasNeighbourRight: true,
          hasNeighbourBottom: true,
          hasNeighbourLeft: true,
          carParkEntrance: {
            entrance: false,
            idCarPark: 0,
          },
        };
        vars.tilesArr.push(tile);
      }
    }
  }

  checkNeighbour() {
    // check if tile has top neighbour
    const withoutNeighbourTop: Tile[] = vars.tilesArr.filter(
      (obj: Tile) => obj.y === 0,
    );
    withoutNeighbourTop.forEach((obj: Tile) => (obj.hasNeighbourTop = false));

    // check if tile has right neighbour
    const withoutNeighbourRight: Tile[] = vars.tilesArr.filter(
      (obj: Tile) => obj.x === vars.widthField - 1,
    );
    withoutNeighbourRight.forEach(
      (obj: Tile) => (obj.hasNeighbourRight = false),
    );

    // check if tile has bottom neighbour
    const withoutNeighbourBottom: Tile[] = vars.tilesArr.filter(
      (obj: Tile) => obj.y === vars.heightField - 1,
    );
    withoutNeighbourBottom.forEach(
      (obj: Tile) => (obj.hasNeighbourBottom = false),
    );

    // check if tile has left neighbour
    const withoutNeighbourLeft: Tile[] = vars.tilesArr.filter(
      (obj: Tile) => obj.x === 0,
    );
    withoutNeighbourLeft.forEach((obj: Tile) => (obj.hasNeighbourLeft = false));
  }

  setLawn() {
    for (let y = 0; y < vars.heightField; y++) {
      for (let x = 0; x < vars.widthField; x++) {
        new LawnTile(x, y);
      }
    }
  }

  setStreetData() {
    let random: number = faker.number.int({ min: 4, max: 6 });
    const randomStartValue = faker.number.int({ min: 1, max: 2 });
    for (let y = 0; y < vars.heightField; y++) {
      for (let x = randomStartValue; x < vars.widthField; x++) {
        new StreetTile(x, y);
        x = x + random;
      }
    }
    random = faker.number.int({ min: 3, max: 5 });
    for (let x = 0; x < vars.widthField; x++) {
      for (let y = randomStartValue; y < vars.heightField; y++) {
        new StreetTile(x, y);
        y = y + random;
      }
    }

    new SetCurveData();
  }

  renderDefaultGrid() {
    for (let i = 0; i < vars.tilesArr.length; i++) {
      new RenderTile(vars.tilesArr[i], true);
    }
  }

  renderTiles() {
    this.renderDefaultGrid();
    this.setLawn();
    this.setStreetData();
    new SetStreetSvg();
  }

  logAllData() {
    console.dir(vars.tilesArr);
  }

  listenerLogAllData() {
    domElements.btnAllData?.addEventListener('click', this.logAllData);
  }

  renderCars() {
    vars.outerStreetTiles = vars.streetTiles.filter(
      (tile: Tile) =>
        (!tile.hasNeighbourTop ||
          !tile.hasNeighbourRight ||
          !tile.hasNeighbourBottom ||
          !tile.hasNeighbourLeft) &&
        (tile.streetKind === 'crossing' ||
          tile.streetKind === 'straight-horizontal' ||
          tile.streetKind === 'straight-vertical'),
    );

    // for only one car:
    // const randomInt = faker.number.int({
    //   min: 0,
    //   max: vars.outerStreetTiles.length - 1,
    // });
    // const x = +(vars.outerStreetTiles[randomInt].x ?? -1);
    // const y = +(vars.outerStreetTiles[randomInt].y ?? -1);

    // const carDestination = vars.utilities.defineCarDestination(
    //   vars.outerStreetTiles[randomInt],
    // );

    // new CarObject(x, y, carDestination);

    for (let i = 1; i <= Math.round(vars.streetTiles.length / 4); i++) {
      const randomNumb = faker.number.int({
        min: 0,
        max: vars.outerStreetTiles.length - 1,
      });
      const x: number = +(vars.outerStreetTiles[randomNumb].x ?? -1);
      const y: number = +(vars.outerStreetTiles[randomNumb].y ?? -1);
      new CarObject(
        x,
        y,
        vars.utilities.defineCarDestination(
          vars.utilities.getTileFromArr(x, y),
        ),
      );
      i = i + 1;
    }

    const sliderCars: HTMLInputElement | null = domElements.sliderCars;

    const updateCarNumber = () => {
      const maxSpeedRange: number = +(domElements.sliderSpeed?.max ?? -1) + 250;

      if (sliderCars?.value) {
        if (+sliderCars?.value > vars.carsArr.length) {
          for (let i = vars.carsArr.length; i < +sliderCars?.value; i++) {
            const randomNumb = faker.number.int({
              min: 0,
              max: vars.outerStreetTiles.length - 1,
            });
            const x: number = +(vars.outerStreetTiles[randomNumb].x ?? -1);
            const y: number = +(vars.outerStreetTiles[randomNumb].y ?? -1);
            new CarObject(
              x,
              y,
              vars.utilities.defineCarDestination(
                vars.utilities.getTileFromArr(x, y),
              ),
            );
          }
        } else if (+sliderCars?.value < vars.carsArr.length) {
          vars.carsArr.slice(+sliderCars.value).forEach((car: Car) => {
            const tile = vars.tilesArr.find((tl: Tile) =>
              tl.contains.find((obj: ConnectedObj) => obj.id === car.id),
            );
            if (tile && domElements.sliderSpeed?.value) {
              const connectedCar: ConnectedObj | undefined = tile.contains.find(
                (obj: ConnectedObj) => obj.id === car.id,
              );

              new CarMoveRender().destinationReached(
                tile?.x,
                tile?.y,
                car,
                connectedCar,
                maxSpeedRange - +domElements.sliderSpeed.value,
                true,
              );
            }
          });
        }
      }

      const dynamicCarNumb: HTMLSpanElement | null =
        domElements.dynamicCarNumb();
      if (dynamicCarNumb) {
        dynamicCarNumb.textContent = `${vars.carsArr.length}`;
      }
    };

    if (sliderCars) {
      sliderCars.min = '0';
      sliderCars.max = `${Math.round(vars.streetTiles.length / 2)}`;
      sliderCars.value = `${vars.carsArr.length}`;

      domElements.containerValuesCarNumb()?.remove();
      sliderCars.insertAdjacentHTML(
        'afterend',
        `<div class="min-max-car-numb">
          <span>0</span>
          <span class="dynamic-car-number">${vars.carsArr.length}</span>
          <span>${Math.round(vars.streetTiles.length / 2)}</span>
        </div>`,
      );

      sliderCars.addEventListener('change', updateCarNumber);
    }
  }

  renderTrees() {
    for (
      let i = faker.number.int({ min: 0, max: 3 });
      i < vars.lawnTiles.length;
      i++
    ) {
      const x = +(vars.lawnTiles[i].x ?? -1);
      const y = +(vars.lawnTiles[i].y ?? -1);
      new TreeObject(x, y);
      i = i + faker.number.int({ min: 0, max: 6 });
    }
  }

  renderLakes() {
    for (
      let i = faker.number.int({ min: 0, max: 3 });
      i < vars.lawnTiles.length;
      i++
    ) {
      const x = +(vars.lawnTiles[i].x ?? -1);
      const y = +(vars.lawnTiles[i].y ?? -1);
      new LakeObject(x, y);
      i = i + faker.number.int({ min: 8, max: 15 });
    }
  }

  checkAreaTiles(x: number, y: number): (Tile | undefined)[] {
    const arrTilesArea: (Tile | undefined)[] = [];
    for (let i = y; i < y + 3; i++) {
      for (let m = x; m < x + 2; m++) {
        const tile: Tile | undefined = vars.utilities.getTileFromArr(m, i);
        arrTilesArea.push(tile);
      }
    }

    return arrTilesArea;
  }

  renderAreas(areaContent: string) {
    const randomInt = faker.number.int({
      min: 0,
      max: vars.lawnTiles.length - 1,
    });
    let x = vars.lawnTiles[randomInt].x;
    let y = vars.lawnTiles[randomInt].y;
    let notLawn: Tile | undefined = this.checkAreaTiles(x, y).find(
      (tile: Tile | undefined) => tile?.kind !== 'lawn',
    );
    let anotherArea: Tile | undefined = this.checkAreaTiles(x, y).find(
      (tile: Tile | undefined) =>
        tile?.contains.find((obj: ConnectedObj) => obj.type === 'eventarea'),
    );

    let streetTileOrUndefined: Tile | undefined =
      vars.utilities.areaCheckForStreetNeighbours(this.checkAreaTiles(x, y));

    let count: number = 1;
    let shouldRender: boolean = true;
    while (
      notLawn ||
      this.checkAreaTiles(x, y).includes(undefined) ||
      anotherArea ||
      (areaContent === 'carPark' ? streetTileOrUndefined === undefined : false)
    ) {
      const randomInt = faker.number.int({
        min: 0,
        max: vars.lawnTiles.length - 1,
      });
      x = vars.lawnTiles[randomInt].x;
      y = vars.lawnTiles[randomInt].y;

      notLawn = this.checkAreaTiles(x, y).find(
        (tile: Tile | undefined) => tile?.kind !== 'lawn',
      );

      anotherArea = this.checkAreaTiles(x, y).find((tile: Tile | undefined) =>
        tile?.contains.find((obj: ConnectedObj) => obj.type === 'eventarea'),
      );

      streetTileOrUndefined = vars.utilities.areaCheckForStreetNeighbours(
        this.checkAreaTiles(x, y),
      );

      if (count > 30) {
        shouldRender = false;
        break;
      }

      count++;
    }

    if (shouldRender) {
      new EventareaObject(
        true,
        x,
        y,
        vars.counterIdObjects,
        2,
        3,
        areaContent,
        '#cccccc',
      );
      vars.counterIdObjects++;
    }
  }

  renderEventareas() {
    for (let i = 1; i <= 5; i++) {
      this.renderAreas('sheeps');
      this.renderAreas('carPark');
      this.renderAreas('plotArea');
    }
  }

  renderObjects() {
    vars.lawnTiles = vars.tilesArr.filter((tile: Tile) => tile.kind === 'lawn');
    this.renderTrees();
    this.renderLakes();
    this.renderEventareas();
    this.renderCars();
  }

  async generate(random: boolean = false, button: boolean = false) {
    if (random) {
      const width = faker.number.int({ min: vars.minWidth, max: 29 });
      const height = faker.number.int({ min: vars.minHeight, max: 17 });
      this.setFieldSize(width, height);
      if (domElements.widthPlayfield && domElements.heightPlayfield) {
        domElements.widthPlayfield.value = width + '';
        domElements.heightPlayfield.value = height + '';
      }
    } else {
      if (domElements.widthPlayfield && domElements.heightPlayfield) {
        this.setFieldSize(
          +domElements.widthPlayfield.value,
          +domElements.heightPlayfield.value,
        );
      }
    }

    if (button) {
      vars.carsArr.length = 0;
      vars.cars.length = 0;
      vars.eventareasArr.length = 0;
      vars.eventareas.length = 0;
      vars.trees.length = 0;
      vars.lakes.length = 0;
      this.setFieldGrid(true);
      this.setFieldData();
      this.checkNeighbour();
      this.renderTiles();
      this.renderObjects();

      if (domElements.navPlayfieldName) {
        domElements.navPlayfieldName.innerHTML = 'Unsaved';
      }

      const liFields: NodeList | undefined =
        domElements.playfieldList?.querySelectorAll('.field');
      if (liFields) {
        liFields.forEach(
          (field) => ((field as HTMLUListElement).style.background = 'none'),
        );
      }

      if (vars.automaticSave) {
        vars.savePlayfield.onSave(true);
        domElements.openPlayfieldList?.addEventListener(
          'click',
          vars.savePlayfield.toggleList,
        );
      }
    } else {
      this.setFieldGrid();
    }
  }

  listenerGenerate() {
    domElements.btnGenerate?.addEventListener('click', () => {
      this.generate(false, true);
      vars.playfield.style.position = 'fixed';
      vars.playfield.style.alignSelf = 'center';
      vars.playfield.style.marginTop = '0';
    });
    domElements.widthPlayfield?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.generate(false, true);
        vars.playfield.style.position = 'fixed';
        vars.playfield.style.alignSelf = 'center';
        vars.playfield.style.marginTop = '0';
      }
    });
    domElements.heightPlayfield?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.generate(false, true);
        vars.playfield.style.position = 'fixed';
        vars.playfield.style.alignSelf = 'center';
        vars.playfield.style.marginTop = '0';
      }
    });
    domElements.randomBtn?.addEventListener('click', () => {
      this.generate(true, true);
      vars.playfield.style.position = 'fixed';
      vars.playfield.style.alignSelf = 'center';
      vars.playfield.style.marginTop = '0';
    });
    domElements.btnRandomPlayfield?.addEventListener('click', () => {
      if (domElements.navPlayfieldName) {
        domElements.navPlayfieldName.innerHTML = 'Unsaved';
      }

      const liFields: NodeList | undefined =
        domElements.playfieldList?.querySelectorAll('.field');
      if (liFields) {
        liFields.forEach(
          (field) => ((field as HTMLUListElement).style.background = 'none'),
        );
      }
      if (vars.automaticSave) {
        vars.savePlayfield.onSave(true);
        domElements.openPlayfieldList?.addEventListener(
          'click',
          vars.savePlayfield.toggleList,
        );
      }

      vars.tilesArr.forEach((tile: Tile) => {
        tile.contains = [];
      });
      this.setLawn();
      this.setStreetData();
      new SetStreetSvg();
      this.renderObjects();
    });
  }

  scale() {
    vars.playfield.style.transform = `scale(${domElements.sliderScale?.value}%)`;
    vars.playfield.style.position = 'static';
    vars.playfield.style.alignSelf = 'flex-start';
    vars.playfield.style.marginTop = '20px';
  }

  scalePlayfield() {
    domElements.sliderScale?.addEventListener('change', this.scale);
    domElements.btnDefaultScale?.addEventListener('click', () => {
      vars.manualScaling = false;
      vars.playfield.style.position = 'fixed';
      vars.playfield.style.alignSelf = 'center';
      vars.playfield.style.marginTop = '0';
      vars.utilities.initialPlayfieldScale(vars.navRect);
    });
  }
}

export default Playfield;
