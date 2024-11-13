import { Tile } from '../interfaces';
import DefaultTile from './default-tile';
import vars from '../vars';

class LawnTile {
  constructor(x: number, y: number) {
    this.init(x, y);
    new DefaultTile(x, y);
  }

  init(x: number, y: number) {
    this.create(x, y);
  }

  create(x: number, y: number) {
    const lawn = vars.tilesArr.find(
      (tile: Tile) => tile.x === x && tile.y === y,
    );
    if (lawn) {
      lawn.kind = 'lawn';
      delete lawn.streetKind;
    }
  }
}

export default LawnTile;
