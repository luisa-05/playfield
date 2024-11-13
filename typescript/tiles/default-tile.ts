import { Car, ConnectedObj, Tile } from '../interfaces';
import RenderTile from '../render-tile';
import vars from '../vars';
import TileForm from './tile-form';

class DefaultTile {
  constructor(x: number, y: number) {
    this.initTile(x, y);
  }

  initTile(x: number, y: number) {
    new RenderTile(this.getTileData(x, y));
    this.listenerLogEachData(x, y);
    new TileForm().FormEditTile(x, y);
  }

  getTileData(x: number, y: number): Tile {
    return vars.tilesArr.find(
      (tile: Tile) => x === tile.x && y === tile.y,
    ) as Tile;
  }

  showSingleData(tileX: number, tileY: number) {
    const currentTile = this.getTileData(tileX, tileY);
    const carFromContains: ConnectedObj | undefined = currentTile.contains.find(
      (obj: ConnectedObj) => obj.type === 'car',
    );

    console.dir(currentTile);

    if (carFromContains) {
      const car = vars.carsArr.find(
        (car: Car) => car.id === carFromContains?.id,
      );
      console.dir(car);
    }
  }

  listenerLogEachData(x: number, y: number) {
    let tileX: number = 0;
    let tileY: number = 0;
    const tile = vars.tiles.find((tile: HTMLDivElement) => {
      tileX = +(tile.dataset.x ?? -1);
      tileY = +(tile.dataset.y ?? -1);
      return +tileX === x && +tileY === y;
    });

    if (tile) {
      tile.addEventListener('click', () => this.showSingleData(tileX, tileY));
    }
  }
}

export default DefaultTile;
