import { Tile } from './interfaces';
import vars from './vars';

class RenderTile {
  initial!: boolean;
  constructor(obj: Tile, initial = false) {
    this.initial = initial;
    this.init(obj);
  }

  init(obj: Tile) {
    this.render(obj);
  }

  getTileElement(x: number, y: number): HTMLDivElement {
    return document.querySelector(
      `.playfield__tile[data-x="${x}"][data-y="${y}"]`,
    ) as HTMLDivElement;
  }

  render(obj: Tile) {
    const htmlTiles = `
<div class="playfield__tile playfield__tile--${obj.kind}" data-x="${obj.x}" data-y="${obj.y}" data-kind="${obj.kind}">
</div>
        `;
    // <span class="x-coordinate">${obj.x}</span>
    // <span class="y-coordinate">${obj.y}</span>

    if (this.initial) {
      vars.playfield.insertAdjacentHTML('beforeend', htmlTiles);
    } else {
      this.getTileElement(obj.x, obj.y).outerHTML = htmlTiles;
    }

    vars.tiles = [
      ...vars.playfield.querySelectorAll<HTMLDivElement>('.playfield__tile'),
    ];
  }
}

export default RenderTile;
