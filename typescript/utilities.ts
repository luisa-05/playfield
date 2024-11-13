import { faker } from '@faker-js/faker';
import domElements from './dom-elements';
import {
  Car,
  ConnectedObj,
  Eventarea,
  StoredplayfieldBackend,
  Tile,
} from './interfaces';
import vars from './vars';

class Utilities {
  constructor() {}

  getCertainTileObject(x: number, y: number): HTMLDivElement | undefined {
    return vars.tiles.find((tile: HTMLDivElement) => {
      if (tile.dataset.x && tile.dataset.y) {
        return +tile.dataset.x === x && +tile.dataset.y === y;
      }
    });
  }

  getTileFromArr(x: number, y: number): Tile | undefined {
    return vars.tilesArr.find((obj: Tile) => obj.x === x && obj.y === y);
  }

  positionContextmenu(form: HTMLFormElement, e: MouseEvent) {
    const { clientX: mouseX, clientY: mouseY } = e;
    const { innerHeight, innerWidth } = window;
    const { offsetWidth, offsetHeight } = form;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let x: number | string = 0;
    let y: number | string = 0;

    if (mouseX >= innerWidth - offsetWidth) {
      x = '-100%';
    }
    if (mouseY >= innerHeight - offsetHeight) {
      y = '-100%';
    }

    form.style.top = `${mouseY + scrollY}px`;
    form.style.left = `${mouseX + scrollX}px`;
    form.style.transform = `translate(${x}, ${y}`;
  }

  removeFormEdit(form: HTMLFormElement | null, domClass: string) {
    form?.classList.add(domClass);
  }

  cancelEdits(e: Event, form: HTMLFormElement) {
    e.preventDefault();
    form?.remove();
  }

  defineCarDestination(carTile: Tile | undefined): Tile {
    vars.destinationStreetTiles = vars.streetTiles.filter(
      (tile: Tile) =>
        ((!tile.hasNeighbourTop ||
          !tile.hasNeighbourRight ||
          !tile.hasNeighbourBottom ||
          !tile.hasNeighbourLeft) &&
          (tile.streetKind === 'crossing' ||
            tile.streetKind === 'straight-horizontal' ||
            tile.streetKind === 'straight-vertical')) ||
        (tile.carParkEntrance.entrance === true &&
          tile.carParkEntrance.availableCapacity === true),
    );

    const intForDestination = faker.number.int({
      min: 0,
      max: vars.destinationStreetTiles.length - 1,
    });

    let carDestination: Tile = vars.destinationStreetTiles[intForDestination];

    while (carTile === carDestination) {
      carDestination =
        vars.destinationStreetTiles[
          faker.number.int({
            min: 0,
            max: vars.destinationStreetTiles.length - 1,
          })
        ];
    }

    return carDestination;
  }

  removeCar(svgCar: SVGElement | null, parentTile: Tile | undefined) {
    if (svgCar) {
      const indexCarFromContains = parentTile?.contains.findIndex(
        (obj: ConnectedObj) => obj.id === +(svgCar.dataset.id ?? -1),
      ) as number;
      const indexCarFromCarsArr: number = vars.carsArr.findIndex(
        (car: Car) => car.id === +(svgCar.dataset.id ?? -1),
      );

      parentTile?.contains.splice(indexCarFromContains, 1);
      vars.carsArr.splice(indexCarFromCarsArr, 1);
      vars.cars.splice(
        vars.cars.findIndex((car: SVGElement) => car === svgCar),
        1,
      );
      svgCar.remove();
    }
  }

  eventareaStyle(
    eventarea: HTMLDivElement | null | undefined,
    widthArea: number = +(domElements.widthEventarea()?.value ?? -1),
    heightArea: number = +(domElements.heightEventarea()?.value ?? -1),
    contentArea: string | undefined = domElements.selectContentEventarea()
      ?.value,
    bgcolorArea: string | undefined = domElements.backgroundColorEventarea()
      ?.value,
  ) {
    const x = +(eventarea?.dataset.x ?? -1);
    const y = +(eventarea?.dataset.y ?? -1);
    const startTile = this.getCertainTileObject(x, y);
    const areaData: Eventarea | undefined = vars.eventareasArr.find(
      (area: Eventarea) => area.id === +(eventarea?.dataset.id ?? -1),
    );
    const entranceTile: Tile | undefined = vars.tilesArr.find(
      (tile: Tile) => tile.carParkEntrance.idCarPark === areaData?.id,
    );
    const selectCapacityValue =
      domElements.selectCapacityCarPark()?.value === 'endless'
        ? 'endless'
        : domElements.inputCustomCarCapacity()?.value;
    const endless: boolean = selectCapacityValue === 'endless' ? true : false;

    let eventareaContent!: string;

    if (contentArea === 'sheeps') {
      eventareaContent = `
<sheep-pasture size-area="${widthArea * heightArea}" height-area="${heightArea * vars.tileSize}" width-area="${widthArea * vars.tileSize}"></sheep-pasture>`;
    } else if (contentArea === 'carPark') {
      if (areaData?.currentCarNumb && areaData.currentCarNumb > 0) {
        eventareaContent = `
<car-park height-area="${heightArea}" width-area="${widthArea}" endless="${endless}" area-id="${+(eventarea?.dataset.id ?? -1)}" car-capacity="${selectCapacityValue ?? 10}" car-drove-in="true" parking-cars=${JSON.stringify(vars.parkingCars)}></car-park>`;
      } else {
        eventareaContent = `
<car-park height-area="${heightArea}" width-area="${widthArea}" endless="${endless}" car-capacity="${selectCapacityValue ?? 10}"></car-park>`;
      }
    } else if (contentArea === 'plotArea') {
      eventareaContent = `
<plot-area height-area="${heightArea}" width-area="${widthArea}"></plot-area>`;
    } else {
      eventareaContent = `
<p>${vars.contentEventarea[contentArea as string]}</p>
     `;
    }

    let borderWidthNumber!: number;
    if (startTile) {
      const stylesStartTile: CSSStyleDeclaration =
        window.getComputedStyle(startTile);
      const borderWidth: string =
        stylesStartTile.getPropertyValue('border-width');
      borderWidthNumber = parseInt(borderWidth);
    }

    if (eventarea) {
      eventarea.style.width = `${widthArea * vars.tileSize - borderWidthNumber * 2}px`;
      eventarea.style.height = `${heightArea * vars.tileSize - borderWidthNumber * 2}px`;
      eventarea.style.backgroundColor = bgcolorArea as string;
      eventarea.innerHTML = '';
      eventarea.insertAdjacentHTML('afterbegin', eventareaContent);

      eventarea.dataset.width = widthArea + '';
      eventarea.dataset.height = heightArea + '';
      eventarea.dataset.bgcolor = bgcolorArea;
    }

    if (eventarea && areaData) {
      areaData.width = widthArea;
      areaData.height = heightArea;
      areaData.content = contentArea;
      areaData.bgcolor = bgcolorArea;
      eventarea.dataset.content = areaData.content;
    }

    if (contentArea === 'carPark') {
      startTile
        ?.querySelector('car-park')
        ?.addEventListener('sendCapacity', (e) => {
          const carCapacity: (string | number)[] = (e as CustomEvent).detail;

          if (eventarea && areaData) {
            eventarea.dataset.carCapacity = carCapacity[0] + '';
            eventarea.dataset.availableCapacity = carCapacity[1] + '';

            const availableCapacity =
              eventarea.dataset.availableCapacity === 'true' ? true : false;
            areaData.maxCapacity = carCapacity[0];
            areaData.availableCapacity = availableCapacity;
            if (entranceTile) {
              entranceTile.carParkEntrance.availableCapacity =
                availableCapacity as boolean;
            }
          }
        });
    }
  }

  areaCheckForStreetNeighbours(areaTiles: (Tile | undefined)[]) {
    const neighboursAreaTiles: (Tile | undefined)[] = [];
    areaTiles.forEach((tile) => {
      if (tile) {
        const neighbourTop: Tile | undefined = vars.utilities.getTileFromArr(
          tile.x,
          tile.y - 1,
        );
        const neighbourRight: Tile | undefined = vars.utilities.getTileFromArr(
          tile.x + 1,
          tile.y,
        );
        const neighbourBottom: Tile | undefined = vars.utilities.getTileFromArr(
          tile.x,
          tile.y + 1,
        );
        const neighbourLeft: Tile | undefined = vars.utilities.getTileFromArr(
          tile.x - 1,
          tile.y,
        );

        neighboursAreaTiles.push(
          neighbourTop,
          neighbourRight,
          neighbourBottom,
          neighbourLeft,
        );
      }
    });

    return neighboursAreaTiles.find((tile) => tile?.kind === 'street');
  }

  async openFormSavePlayfield() {
    const autoincrement: Response = await fetch(
      'http://localhost:3000/playfield-id',
    );
    const id: number = (await autoincrement.json()) + 1;

    domElements.formSavePlayfield?.classList.remove(
      'form-save-playfield--hidden',
    );
    if (domElements.inputNamePlayfield) {
      const date: Date = new Date();
      const padZero = (num: number) => num.toString().padStart(2, '0');
      domElements.inputNamePlayfield.focus();
      domElements.inputNamePlayfield.value = `Field ${id} (${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())})`;
    }
  }

  initialPlayfieldScale(navRect: DOMRect | undefined) {
    const availableWidth = window.innerWidth - (navRect?.width ?? -1) - 45;
    const availableHeight = window.innerHeight - 20;

    const desiredTileSizeWidth = Math.floor(availableWidth / vars.widthField);
    const desiredTileSizeHeight = Math.floor(
      availableHeight / vars.heightField,
    );

    let desiredTileSize!: number;
    if (desiredTileSizeWidth < desiredTileSizeHeight) {
      desiredTileSize = desiredTileSizeWidth;
    } else {
      desiredTileSize = desiredTileSizeHeight;
    }

    const sliderValue: number = Math.round(
      (desiredTileSize / vars.tileSize) * 100,
    );

    if (domElements.sliderScale) {
      domElements.sliderScale.value = `${sliderValue}`;
      vars.playfield.style.transform = `scale(${domElements.sliderScale?.value}%)`;
    }

    vars.playfield.style.marginBottom = `-${(vars.tileSize - desiredTileSize) * vars.heightField}px`;
  }

  dataNotContainsCars(tilesArr: Tile[]) {
    const tilesContainsCar: Tile[] = tilesArr.filter((tile) =>
      tile.contains.find((obj: ConnectedObj) => obj.type === 'car'),
    );
    const carObjs: ConnectedObj[] = [];

    tilesContainsCar.forEach((tile: Tile) => {
      carObjs.push(
        ...tile.contains.filter((obj: ConnectedObj) => obj.type === 'car'),
      );

      [...carObjs].forEach((carObj: ConnectedObj) => {
        tile.contains.splice(
          tile.contains.findIndex((car) => car === carObj),
          1,
        );
      });

      carObjs.length = 0;
    });
  }

  async findSavedPlayfield(): Promise<StoredplayfieldBackend | undefined> {
    const data: Response = await fetch('http://localhost:3000/playfield');
    const dataPlayfields: StoredplayfieldBackend[] = await data.json();

    const copieStoredPlayfields: StoredplayfieldBackend[] = JSON.parse(
      JSON.stringify(dataPlayfields),
    );
    const copieTilesArr: Tile[] = JSON.parse(JSON.stringify(vars.tilesArr));

    copieStoredPlayfields.map((playfield: StoredplayfieldBackend) =>
      this.dataNotContainsCars(playfield.data.tiles),
    );

    this.dataNotContainsCars(copieTilesArr);

    const savedPlayfield = copieStoredPlayfields.find(
      (playfield: StoredplayfieldBackend) =>
        JSON.stringify(playfield.data.tiles) === JSON.stringify(copieTilesArr),
    );

    return savedPlayfield;
  }

  // maybe not needable:
  startSimulationInterval() {
    if (domElements.simulationPlayButton()) {
      vars.carMove.startSimulation();
    }
  }

  stopSimulationInterval() {
    if (domElements.simulationPauseButton()) {
      vars.carMove.pauseSimulation();
    }
  }
  // /////////////////////////////////////////
}

export default Utilities;
