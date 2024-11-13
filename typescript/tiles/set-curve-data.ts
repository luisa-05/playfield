import { faker } from '@faker-js/faker';
import StreetTile from './street-tile';
import { Tile } from '../interfaces';
import vars from '../vars';

class SetCurveData {
  constructor() {
    this.init();
  }

  init() {
    this.setData();
  }

  countCurveTilesH(
    streetTile: Tile,
    direction: string,
    randomNumb: number | undefined = undefined,
  ): number {
    let counterTilesH: number = 1;
    for (
      let i = streetTile.x;
      direction.includes('right') ? i < vars.widthField - 1 : i > 0;
      direction.includes('right') ? i++ : i--
    ) {
      const tileH: Tile | undefined = vars.utilities.getTileFromArr(
        direction.includes('right')
          ? streetTile.x + counterTilesH
          : streetTile.x - counterTilesH,
        randomNumb
          ? direction.includes('right')
            ? streetTile.y + randomNumb
            : streetTile.y - randomNumb
          : streetTile.y,
      );
      const neighbourTop = vars.utilities.getTileFromArr(
        tileH?.x ?? -1,
        (tileH?.y ?? -1) - 1,
      );
      const neighbourBottom = vars.utilities.getTileFromArr(
        tileH?.x ?? -1,
        (tileH?.y ?? -1) + 1,
      );
      if (!tileH || tileH?.kind === 'street') {
        break;
      } else if (
        neighbourTop?.kind === 'street' ||
        neighbourBottom?.kind === 'street'
      ) {
        counterTilesH++;
        break;
      } else {
        counterTilesH++;
      }
    }

    return counterTilesH;
  }

  countCurveTilesV(
    streetTile: Tile,
    direction: string,
    randomNumb: number | undefined = undefined,
  ): number {
    let counterTilesV: number = 1;
    for (
      let i = streetTile.y;
      direction.includes('down') ? i < vars.heightField - 1 : i > 0;
      direction.includes('down') ? i++ : i--
    ) {
      const tileV: Tile | undefined = vars.utilities.getTileFromArr(
        randomNumb
          ? direction.includes('down')
            ? streetTile.x + randomNumb
            : streetTile.x - randomNumb
          : streetTile.x,
        direction.includes('down')
          ? streetTile.y + counterTilesV
          : streetTile.y - counterTilesV,
      );
      const neighbourLeft = vars.utilities.getTileFromArr(
        (tileV?.x ?? -1) - 1,
        tileV?.y ?? -1,
      );
      const neighbourRight = vars.utilities.getTileFromArr(
        (tileV?.x ?? -1) + 1,
        tileV?.y ?? -1,
      );
      if (!tileV || tileV?.kind === 'street') {
        break;
      } else if (
        neighbourLeft?.kind === 'street' ||
        neighbourRight?.kind === 'street'
      ) {
        counterTilesV++;
        break;
      } else {
        counterTilesV++;
      }
    }

    return counterTilesV;
  }

  setData() {
    vars.streetTiles = vars.tilesArr.filter(
      (tile: Tile) => tile.kind === 'street',
    );

    const randomCurve = faker.number.int({ min: 1, max: 3 });
    for (let i = randomCurve; i < vars.streetTiles.length; i++) {
      const streetTile: Tile = vars.streetTiles[i];
      const neighbourTop: Tile | undefined = vars.utilities.getTileFromArr(
        streetTile.x,
        streetTile.y - 1,
      );
      const neighbourRight: Tile | undefined = vars.utilities.getTileFromArr(
        streetTile.x + 1,
        streetTile.y,
      );
      const neighbourBottom: Tile | undefined = vars.utilities.getTileFromArr(
        streetTile.x,
        streetTile.y + 1,
      );
      const neighbourLeft: Tile | undefined = vars.utilities.getTileFromArr(
        streetTile.x - 1,
        streetTile.y,
      );
      const diagonalTopRight: Tile | undefined = vars.utilities.getTileFromArr(
        streetTile.x + 1,
        streetTile.y - 1,
      );
      const diagonalBottomRight: Tile | undefined =
        vars.utilities.getTileFromArr(streetTile.x + 1, streetTile.y + 1);
      const diagonalBottomLeft: Tile | undefined =
        vars.utilities.getTileFromArr(streetTile.x - 1, streetTile.y + 1);
      const diagonalTopLeft: Tile | undefined = vars.utilities.getTileFromArr(
        streetTile.x - 1,
        streetTile.y - 1,
      );

      if (
        neighbourTop?.kind === 'street' &&
        neighbourRight?.kind === 'street' &&
        neighbourBottom?.kind === 'street' &&
        neighbourLeft?.kind === 'street'
      ) {
        return;
      } else {
        if (
          neighbourTop?.kind === 'street' &&
          neighbourBottom?.kind === 'street' &&
          diagonalBottomRight &&
          diagonalBottomRight.kind !== 'street' &&
          diagonalTopRight?.kind !== 'street'
        ) {
          const direction = 'right-down';
          const counterTilesH: number = this.countCurveTilesH(
            streetTile,
            direction,
          );

          if (counterTilesH >= 3) {
            const randomNumbHorizontal = faker.number.int({
              min: 2,
              max: counterTilesH - 1,
            });

            const counterTilesV: number = this.countCurveTilesV(
              streetTile,
              direction,
              randomNumbHorizontal,
            );

            for (let i = 1; i <= randomNumbHorizontal; i++) {
              new StreetTile(streetTile.x + i, streetTile.y);
            }
            if (randomNumbHorizontal !== counterTilesH - 1) {
              for (let i = 1; i <= counterTilesV - 1; i++) {
                new StreetTile(
                  streetTile.x + randomNumbHorizontal,
                  streetTile.y + i,
                );
              }
            }
          }
        }

        if (
          neighbourTop?.kind === 'street' &&
          neighbourBottom?.kind === 'street' &&
          diagonalBottomLeft &&
          diagonalBottomLeft.kind !== 'street' &&
          diagonalTopLeft?.kind !== 'street'
        ) {
          const direction = 'left-up';
          const counterTilesH: number = this.countCurveTilesH(
            streetTile,
            direction,
          );

          if (counterTilesH >= 3) {
            const randomNumbHorizontal = faker.number.int({
              min: 2,
              max: counterTilesH - 1,
            });

            const counterTilesV: number = this.countCurveTilesV(
              streetTile,
              direction,
              randomNumbHorizontal,
            );

            for (let i = 1; i <= randomNumbHorizontal; i++) {
              new StreetTile(streetTile.x - i, streetTile.y);
            }
            if (randomNumbHorizontal !== counterTilesH - 1) {
              for (let i = 1; i <= counterTilesV - 1; i++) {
                new StreetTile(
                  streetTile.x - randomNumbHorizontal,
                  streetTile.y - i,
                );
              }
            }
          }
        }

        if (
          neighbourLeft?.kind === 'street' &&
          neighbourRight?.kind === 'street' &&
          diagonalBottomRight &&
          diagonalBottomRight.kind !== 'street' &&
          diagonalBottomLeft?.kind !== 'street'
        ) {
          const direction = 'down-right';
          const counterTilesV: number = this.countCurveTilesV(
            streetTile,
            direction,
          );

          if (counterTilesV >= 3) {
            const randomNumbVertical = faker.number.int({
              min: 2,
              max: counterTilesV - 1,
            });

            const counterTilesH: number = this.countCurveTilesH(
              streetTile,
              direction,
              randomNumbVertical,
            );

            for (let i = 1; i <= randomNumbVertical; i++) {
              new StreetTile(streetTile.x, streetTile.y + i);
            }
            if (randomNumbVertical !== counterTilesV - 1) {
              for (let i = 1; i < counterTilesH; i++) {
                new StreetTile(
                  streetTile.x + i,
                  streetTile.y + randomNumbVertical,
                );
              }
            }
          }
        }

        if (
          neighbourLeft?.kind === 'street' &&
          neighbourRight?.kind === 'street' &&
          diagonalTopRight &&
          diagonalTopRight.kind !== 'street' &&
          diagonalTopLeft?.kind !== 'street'
        ) {
          const direction = 'up-left';
          const counterTilesV: number = this.countCurveTilesV(
            streetTile,
            direction,
          );

          if (counterTilesV >= 3) {
            const randomNumbVertical = faker.number.int({
              min: 2,
              max: counterTilesV - 1,
            });

            const counterTilesH: number = this.countCurveTilesH(
              streetTile,
              direction,
              randomNumbVertical,
            );

            for (let i = 1; i <= randomNumbVertical; i++) {
              new StreetTile(streetTile.x, streetTile.y - i);
            }
            if (randomNumbVertical !== counterTilesV - 1) {
              for (let i = 1; i < counterTilesH; i++) {
                new StreetTile(
                  streetTile.x - i,
                  streetTile.y - randomNumbVertical,
                );
              }
            }
          }
        }
      }

      i = i + randomCurve;
    }
  }
}

export default SetCurveData;
