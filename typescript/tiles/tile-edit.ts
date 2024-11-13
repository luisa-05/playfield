import domElements from '../dom-elements';
import CarObject from '../objects/car-object';
import LakeObject from '../objects/lake-object';
import TreeObject from '../objects/tree-object';
import StreetTile from './street-tile';
import LawnTile from './lawn-tile';
import EventareaObject from '../objects/eventarea-object';
import { ConnectedObj, Tile } from '../interfaces';
import vars from '../vars';
import SetStreetSvg from './set-street-svg';
import CarObjectEdit from '../objects/car-object-edit';

class TileEdit {
  svgCar!: SVGElement | null;
  constructor(svgCar: SVGElement | null) {
    this.svgCar = svgCar;
    this.init();
  }

  init() {
    this.eventListenerEdit();
  }

  chooseTileKind() {
    const select: HTMLSelectElement | null = domElements.selectKind();

    if (select?.dataset.x && select.dataset.y) {
      const x = +select.dataset.x;
      const y = +select.dataset.y;

      if (select.value === 'lawn') {
        new LawnTile(x, y);
      } else if (select.value === 'street') {
        new StreetTile(x, y);
        new SetStreetSvg();
      }
    }
  }

  addSelectedObjects() {
    const selectKind = domElements.selectKind();

    if (selectKind?.dataset.x && selectKind.dataset.y) {
      const x = +selectKind.dataset.x;
      const y = +selectKind.dataset.y;

      const parentTile: Tile | undefined = vars.utilities.getTileFromArr(x, y);

      const domParentTile: HTMLDivElement | undefined =
        vars.utilities.getCertainTileObject(x, y);

      const treeObj: ConnectedObj | undefined = parentTile?.contains.find(
        (obj: ConnectedObj) => obj.type === 'tree',
      );
      if (domElements.treeCheckbox()?.checked) {
        if (treeObj) {
          new TreeObject(x, y, treeObj?.id);
        } else {
          new TreeObject(x, y);
        }
      } else {
        if (treeObj) {
          domParentTile?.querySelector('.playfield__tree')?.remove();

          parentTile?.contains.splice(
            parentTile.contains.findIndex(
              (obj: ConnectedObj) => obj === treeObj,
            ),
            1,
          );

          vars.trees.splice(
            vars.trees.findIndex(
              (tree: HTMLImageElement) =>
                +(tree.dataset.id ?? -1) === treeObj?.id,
            ),
            1,
          );
        }
      }

      const lakeObj: ConnectedObj | undefined = parentTile?.contains.find(
        (obj: ConnectedObj) => obj.type === 'lake',
      );
      if (domElements.lakeCheckbox()?.checked) {
        if (lakeObj) {
          new LakeObject(x, y, lakeObj?.id);
        } else {
          new LakeObject(x, y);
        }
      } else {
        if (lakeObj) {
          domParentTile?.querySelector('.playfield__lake')?.remove();

          parentTile?.contains.splice(
            parentTile.contains.findIndex(
              (obj: ConnectedObj) => obj === lakeObj,
            ),
            1,
          );

          vars.lakes.splice(
            vars.lakes.findIndex(
              (lake: HTMLImageElement) =>
                +(lake.dataset.id ?? -1) === lakeObj?.id,
            ),
            1,
          );
        }
      }

      if (domElements.carCheckbox()?.checked) {
        if (this.svgCar) {
          new CarObjectEdit().chooseCarColor(+(this.svgCar.dataset.id ?? -1));
        } else {
          if (parentTile) {
            const carDestination =
              vars.utilities.defineCarDestination(parentTile);
            new CarObject(x, y, carDestination);
          }
        }
      } else {
        if (this.svgCar) {
          vars.utilities.removeCar(this.svgCar, parentTile);
        }
      }

      if (domElements.eventareaCheckbox()?.checked) {
        new EventareaObject(true, x, y);
      }
    }
  }

  saveKind = (e: Event) => {
    e.preventDefault();
    this.chooseTileKind();
  };

  saveObjects = (e: Event) => {
    e.preventDefault();
    this.addSelectedObjects();
  };

  cancel(e: Event) {
    vars.utilities.cancelEdits(
      e,
      domElements.formEditTile() as HTMLFormElement,
    );
  }

  checkForAnyChanges() {
    let objectWasChanged: boolean = false;
    let kindWasChanged: boolean = false;
    const objectsArr: (HTMLInputElement | null)[] = [
      domElements.treeCheckbox(),
      domElements.lakeCheckbox(),
      domElements.carCheckbox(),
      domElements.eventareaCheckbox(),
    ];

    const handleChangeKind = () => {
      if (tileKind !== domElements.selectKind()?.value) {
        kindWasChanged = true;
      } else {
        kindWasChanged = false;
      }
    };

    const handleChangeObject = () => {
      objectWasChanged = true;
    };

    const tileKind = domElements.selectKind()?.value;
    domElements.selectKind()?.addEventListener('change', handleChangeKind);
    domElements
      .selectCarColor()
      ?.addEventListener('change', handleChangeObject);
    objectsArr.forEach((object: HTMLInputElement | null) =>
      object?.addEventListener('change', handleChangeObject),
    );

    domElements.saveBtn()?.addEventListener('click', (e) => {
      if (kindWasChanged || objectWasChanged) {
        if (kindWasChanged) {
          this.saveKind(e);
          this.saveObjects(e);
          domElements.formEditTile()?.remove();
        } else if (objectWasChanged) {
          this.saveObjects(e);
          domElements.formEditTile()?.remove();
        }
      } else {
        this.cancel(e);
      }
    });
  }

  eventListenerEdit() {
    domElements.svgCancel()?.addEventListener('click', this.cancel);
    domElements.cancelBtn()?.addEventListener('click', this.cancel);
    this.checkForAnyChanges();
  }
}

export default TileEdit;
