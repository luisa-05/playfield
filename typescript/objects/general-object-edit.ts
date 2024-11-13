import domElements from '../dom-elements';
import { ConnectedObj, Tile } from '../interfaces';
import vars from '../vars';

class GeneralObjectEdit {
  constructor(currentObject: HTMLImageElement | null | undefined) {
    this.init(currentObject);
  }

  init(currentObject: HTMLImageElement | null | undefined) {
    this.eventListenerEdit(currentObject);
  }

  getObjectParentTile(objId: number, object: string): Tile | undefined {
    const objectParentTile: Tile | undefined = vars.tilesArr.find(
      (tile: Tile) => {
        if (objId) {
          return tile.contains.find(
            (el) => el.id === objId && el.type === object,
          );
        }
      },
    );
    return objectParentTile;
  }

  deleteObject = (
    e: Event,
    currentObject: HTMLImageElement | null | undefined,
  ) => {
    e.preventDefault();
    const formEditObject: HTMLFormElement | null = domElements.formEditObject();

    vars.modal
      .showModal(
        'Möchten Sie das Objekt endgültig löschen?',
        'Löschen',
        'Abbrechen',
      )
      .then((result) => {
        if (result) {
          const objects = {
            tree: vars.trees,
            lake: vars.lakes,
          };

          let objId!: number;
          let objName!: string;
          if (formEditObject?.dataset.kind) {
            currentObject?.remove();
            objects[formEditObject?.dataset.kind].splice(
              objects[formEditObject?.dataset.kind].indexOf(currentObject),
              1,
            );
            if (currentObject?.dataset.id) {
              objId = +currentObject.dataset.id;
            }
            objName = formEditObject?.dataset.kind;
          }

          const indexConnectedObj = this.getObjectParentTile(
            objId,
            objName,
          )?.contains.findIndex(
            (obj: ConnectedObj) => obj.id === objId && obj.type === objName,
          ) as number;

          this.getObjectParentTile(objId, objName)?.contains.splice(
            indexConnectedObj,
            1,
          );
        }
      });
    formEditObject?.remove();
  };

  cancelEdits = (e: Event) => {
    vars.utilities.cancelEdits(
      e,
      domElements.formEditObject() as HTMLFormElement,
    );
  };

  eventListenerEdit(currentObject: HTMLImageElement | null | undefined) {
    domElements.svgCancel()?.addEventListener('click', this.cancelEdits);
    domElements
      .svgDeleteObject()
      ?.addEventListener('click', (e) => this.deleteObject(e, currentObject));
  }
}
export default GeneralObjectEdit;
