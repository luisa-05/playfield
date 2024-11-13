import { ConnectedObj, Tile } from '../interfaces';
import vars from '../vars';

class SetStreetSvg {
  constructor() {
    this.init();
  }

  init() {
    this.setStreetSvgs();
  }

  setStreetSvgs() {
    vars.streetTiles = vars.tilesArr.filter(
      (tile: Tile) => tile.kind === 'street',
    );

    vars.streetTiles.forEach((tile: Tile) => {
      const svgH: string = `
      <img class="playfield__tile playfield__tile-street-svg" src="imgs/gerade_h.svg" data-x="${tile.x}" data-y="${tile.y}"></img>`;
      const svgV: string = `
      <img class="playfield__tile playfield__tile-street-svg" src="imgs/gerade_v.svg" data-x="${tile.x}" data-y="${tile.y}"></img>`;
      const svgCrossing: string = `
      <img class="playfield__tile playfield__tile-street-svg" src="imgs/kreuzung.svg" data-x="${tile.x}" data-y="${tile.y}"></img>`;
      const svgCurveDownLeft: string = `
      <img class="playfield__tile playfield__tile-street-svg" src="imgs/curve_down_left.svg" data-x="${tile.x}" data-y="${tile.y}"></img>`;
      const svgCurveDownRight: string = `
      <img class="playfield__tile playfield__tile-street-svg" src="imgs/curve_down_right.svg" data-x="${tile.x}" data-y="${tile.y}"></img>`;
      const svgCurveTopLeft: string = `
      <img class="playfield__tile playfield__tile-street-svg" src="imgs/curve_top_left.svg" data-x="${tile.x}" data-y="${tile.y}"></img>`;
      const svgCurveTopRight: string = `
      <img class="playfield__tile playfield__tile-street-svg" src="imgs/curve_top_right.svg" data-x="${tile.x}" data-y="${tile.y}"></img>`;

      const streetDiv = vars.utilities.getCertainTileObject(tile.x, tile.y);
      const arrNeigboursStreet: (Tile | undefined)[] = [];

      arrNeigboursStreet.push(
        vars.utilities.getTileFromArr(tile.x, tile.y - 1),
      );
      arrNeigboursStreet.push(
        vars.utilities.getTileFromArr(tile.x, tile.y + 1),
      );
      arrNeigboursStreet.push(
        vars.utilities.getTileFromArr(tile.x - 1, tile.y),
      );
      arrNeigboursStreet.push(
        vars.utilities.getTileFromArr(tile.x + 1, tile.y),
      );

      const hasStreetNeibour = arrNeigboursStreet.map(
        (neighbourTile: Tile | undefined) =>
          neighbourTile !== undefined && neighbourTile.kind === 'street',
      );

      let counterTrue = 0;
      for (let i = 0; i < hasStreetNeibour.length; i++) {
        if (hasStreetNeibour[i] === true) {
          counterTrue++;
        }
      }

      let streetSvg!: string;
      if (counterTrue === 4 || counterTrue === 3) {
        streetSvg = svgCrossing;
        tile.streetKind = 'crossing';
      } else if (
        hasStreetNeibour[0] === false &&
        hasStreetNeibour[3] === false &&
        hasStreetNeibour[1] &&
        hasStreetNeibour[2]
      ) {
        streetSvg = svgCurveDownLeft;
        tile.streetKind = 'curve-down-left';
      } else if (
        hasStreetNeibour[0] === false &&
        hasStreetNeibour[2] === false &&
        hasStreetNeibour[1] &&
        hasStreetNeibour[3]
      ) {
        streetSvg = svgCurveDownRight;
        tile.streetKind = 'curve-down-right';
      } else if (
        hasStreetNeibour[1] === false &&
        hasStreetNeibour[3] === false &&
        hasStreetNeibour[0] &&
        hasStreetNeibour[2]
      ) {
        streetSvg = svgCurveTopLeft;
        tile.streetKind = 'curve-top-left';
      } else if (
        hasStreetNeibour[1] === false &&
        hasStreetNeibour[2] === false &&
        hasStreetNeibour[0] &&
        hasStreetNeibour[3]
      ) {
        streetSvg = svgCurveTopRight;
        tile.streetKind = 'curve-top-right';
      } else if (
        hasStreetNeibour[2] === false &&
        hasStreetNeibour[3] === false
      ) {
        streetSvg = svgV;
        tile.streetKind = 'straight-vertical';
      } else if (
        hasStreetNeibour[0] === false &&
        hasStreetNeibour[1] === false
      ) {
        streetSvg = svgH;
        tile.streetKind = 'straight-horizontal';
      }

      streetDiv?.insertAdjacentHTML('afterbegin', streetSvg);

      // if you want to be able to render all objects no matter on which tile maybe you can deactivate this:
      const lawnObjects = tile.contains.filter(
        (obj: ConnectedObj) => obj.type === 'tree' || obj.type === 'lake',
      );

      lawnObjects.forEach((lawnObj: ConnectedObj) =>
        tile.contains.splice(
          tile.contains.findIndex((obj: ConnectedObj) => obj === lawnObj),
          1,
        ),
      );
      ///////////////////////////////////////////////////
    });
  }
}

export default SetStreetSvg;
