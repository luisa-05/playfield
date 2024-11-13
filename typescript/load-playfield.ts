import domElements from './dom-elements';
import {
  Car,
  ConnectedObj,
  Eventarea,
  StoredplayfieldBackend,
  Tile,
} from './interfaces';
import CarObject from './objects/car-object';
import EventareaObject from './objects/eventarea-object';
import LakeObject from './objects/lake-object';
import TreeObject from './objects/tree-object';
import Playfield from './playfield';
import RenderTile from './render-tile';
import DefaultTile from './tiles/default-tile';
import SetStreetSvg from './tiles/set-street-svg';
import vars from './vars';

class LoadPlayfield {
  constructor(
    field: StoredplayfieldBackend,
    fieldName: HTMLUListElement | null,
  ) {
    this.init(field, fieldName);
  }

  init(field: StoredplayfieldBackend, fieldName: HTMLUListElement | null) {
    this.showPlayfield(field, fieldName);
  }

  show(field: StoredplayfieldBackend, fieldName: HTMLUListElement | null) {
    if (domElements.navPlayfieldName) {
      domElements.navPlayfieldName.innerHTML = `${field.name}`;
    }

    const liFields: NodeList | undefined =
      domElements.playfieldList?.querySelectorAll('.field');
    if (liFields) {
      liFields.forEach(
        (field) => ((field as HTMLUListElement).style.background = 'none'),
      );
    }
    if (fieldName) {
      fieldName.style.backgroundColor = '#ccc';
    }

    // backend
    vars.tilesArr = field.data.tiles;
    vars.carsArr = field.data.cars;
    vars.eventareasArr = field.data.eventareas;
    vars.parkingCars = field.data.parkingCars;
    vars.streetTiles = field.data.tiles.filter(
      (tile: Tile) => tile.kind === 'street',
    );
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

    new Playfield().setFieldSize(
      +(field.data.widthPlayfield ?? -1),
      +(field.data.heightPlayfield ?? -1),
    );
    if (
      domElements.widthPlayfield &&
      domElements.heightPlayfield &&
      field.data.widthPlayfield &&
      field.data.heightPlayfield
    ) {
      domElements.widthPlayfield.value = field.data.widthPlayfield;
      domElements.heightPlayfield.value = field.data.heightPlayfield;
    }
    new Playfield().setFieldGrid(true);

    for (let i = 0; i < vars.tilesArr.length; i++) {
      new RenderTile(vars.tilesArr[i], true);
    }
    vars.tilesArr.forEach((tile: Tile) => new DefaultTile(tile.x, tile.y));
    new SetStreetSvg();

    const tilesContainsCar: Tile[] = vars.tilesArr.filter((tile: Tile) =>
      tile.contains.find((obj: ConnectedObj) => obj.type === 'car'),
    );

    const tilesContainsTree: Tile[] = vars.tilesArr.filter((tile: Tile) =>
      tile.contains.find((obj: ConnectedObj) => obj.type === 'tree'),
    );

    const tilesContainsLake: Tile[] = vars.tilesArr.filter((tile: Tile) =>
      tile.contains.find((obj: ConnectedObj) => obj.type === 'lake'),
    );

    tilesContainsCar?.forEach((tile: Tile) => {
      const carsFromContains: (ConnectedObj | undefined)[] =
        tile.contains.filter((obj: ConnectedObj) => obj.type === 'car');

      carsFromContains?.forEach((obj: ConnectedObj | undefined) => {
        const car: Car | undefined = vars.carsArr.find(
          (carObj: Car) => carObj.id === obj?.id,
        );

        if (car?.destination.tile) {
          new CarObject(
            tile.x,
            tile.y,
            car?.destination.tile,
            car?.color,
            car?.id,
            car?.kind,
          );
        }
      });
    });

    tilesContainsTree.forEach((tile: Tile) => {
      const treeFromContains: ConnectedObj | undefined = tile.contains.find(
        (obj: ConnectedObj) => obj.type === 'tree',
      );
      new TreeObject(tile.x, tile.y, treeFromContains?.id);
    });

    tilesContainsLake.forEach((tile: Tile) => {
      const lakeFromContains: ConnectedObj | undefined = tile.contains.find(
        (obj: ConnectedObj) => obj.type === 'lake',
      );
      new LakeObject(tile.x, tile.y, lakeFromContains?.id);
    });

    const tilesContainsEventarea: Tile[] = vars.tilesArr.filter((tile: Tile) =>
      tile.contains.find((obj: ConnectedObj) => obj.type === 'eventarea'),
    );

    const connectedEventareaArr: string[] = [];
    tilesContainsEventarea.forEach((tile: Tile) => {
      const connectedEventarea: ConnectedObj | undefined = tile.contains.find(
        (obj: ConnectedObj) => obj.type === 'eventarea',
      );
      connectedEventareaArr.push(JSON.stringify(connectedEventarea));
    });

    const connectedAreas: ConnectedObj[] = Array.from(
      new Set(connectedEventareaArr),
    ).map((obj: string) => JSON.parse(obj));

    const areas: (Eventarea | undefined)[] = [];
    connectedAreas.forEach((obj: ConnectedObj) => {
      const eventarea: Eventarea | undefined = field.data.eventareas.find(
        (area: Eventarea) => area.id === obj.id,
      );
      areas.push(eventarea);
    });

    if (areas.length > 0) {
      areas.forEach((eventarea: Eventarea | undefined) => {
        if (eventarea) {
          new EventareaObject(
            false,
            eventarea.startX,
            eventarea.startY,
            eventarea.id,
            eventarea.width,
            eventarea.height,
            eventarea.content,
            eventarea.bgcolor,
          );
        }
      });
    }
  }

  async showPlayfield(
    field: StoredplayfieldBackend,
    fieldName: HTMLUListElement | null,
  ) {
    vars.eventareas.length = 0;

    // backend showPlayfield
    if (domElements.manualSaveSwitch?.checked === true) {
      if (!(await vars.utilities.findSavedPlayfield())) {
        vars.modal
          .showModal(
            'Möchten Sie das Spielfeld vor dem Verlassen speichern?',
            'Speichern',
            'Nicht Speichern',
          )
          .then((result) => {
            if (result) {
              vars.utilities.openFormSavePlayfield();
            } else {
              this.show(field, fieldName);
            }
          });
      } else {
        this.show(field, fieldName);
      }
    } else {
      this.show(field, fieldName);
    }
  }
}

export default LoadPlayfield;
