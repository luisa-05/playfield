import vars from '../vars';
import DefaultTile from './default-tile';

class StreetTile {
  constructor(x: number, y: number) {
    this.init(x, y);
    new DefaultTile(x, y);
  }

  init(x: number, y: number) {
    this.create(x, y);
  }

  create(x: number, y: number) {
    const street = vars.utilities.getTileFromArr(x, y);

    if (street) {
      street.kind = 'street';
    }
  }
}

export default StreetTile;
