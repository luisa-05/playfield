import domElements from '../dom-elements';
import Form from '../form';
import { ConnectedObj, Eventarea, Tile } from '../interfaces';
import vars from '../vars';

class EventareaObjectEdit {
  constructor(areaEvent: HTMLDivElement | null) {
    this.init(areaEvent);
  }

  init(areaEvent: HTMLDivElement | null) {
    this.addListenerEdit(areaEvent);
  }

  cancelEdits(e: Event) {
    vars.utilities.cancelEdits(
      e,
      domElements.formEditEventarea() as HTMLFormElement,
    );
  }

  saveEdits(e: Event, eventarea: HTMLDivElement | null) {
    e.preventDefault;
    vars.utilities.eventareaStyle(eventarea);
    domElements.formEditEventarea()?.remove();

    eventarea
      ?.querySelector('car-park')
      ?.addEventListener('sendCapacity', (e) => {
        const carCapacity: (string | number)[] = (e as CustomEvent).detail;
        new Form().editEventarea(eventarea?.dataset.content, carCapacity[0]);
      });
  }

  deleteArea(e: Event, eventarea: HTMLDivElement | null) {
    e.preventDefault();

    vars.modal
      .showModal(
        'Möchten Sie die Eventarea endgültig löschen?',
        'Löschen',
        'Abbrechen',
      )
      .then((result) => {
        if (result) {
          eventarea?.remove();

          vars.eventareas.splice(
            vars.eventareas.findIndex(
              (area: HTMLDivElement) => area === eventarea,
            ),
            1,
          );

          vars.eventareasArr.splice(
            vars.eventareasArr.findIndex(
              (area: Eventarea) =>
                area.startX === +(eventarea?.dataset.x ?? -1) &&
                area.startY === +(eventarea?.dataset.y ?? -1),
            ),
            1,
          );

          const areaTiles = vars.tilesArr.filter((tile: Tile) =>
            tile.contains.find(
              (obj: ConnectedObj) =>
                obj.id === +(eventarea?.dataset.id ?? -1) &&
                obj.type === 'eventarea',
            ),
          );
          areaTiles.map((tile: Tile) =>
            tile.contains.splice(
              tile.contains.findIndex(
                (obj: ConnectedObj) =>
                  obj.id === +(eventarea?.dataset.id ?? -1) &&
                  obj.type === 'eventarea',
              ),
              1,
            ),
          );

          domElements.formEditEventarea()?.remove();

          if (eventarea?.dataset.content === 'carPark') {
            const entrance = vars.tilesArr.find(
              (tile: Tile) =>
                tile.carParkEntrance.idCarPark ===
                +(eventarea.dataset.id ?? -1),
            );
            if (entrance) {
              entrance.carParkEntrance.entrance = false;
              entrance.carParkEntrance.idCarPark = 0;
            }
          }
        }
      });
  }

  addListenerEdit(areaEvent: HTMLDivElement | null) {
    domElements.svgCancel()?.addEventListener('click', this.cancelEdits);
    domElements
      .saveBtn()
      ?.addEventListener('click', (e) => this.saveEdits(e, areaEvent));
    domElements.cancelBtn()?.addEventListener('click', this.cancelEdits);
    domElements
      .deleteBtn()
      ?.addEventListener('click', (e) => this.deleteArea(e, areaEvent));
  }
}

export default EventareaObjectEdit;
