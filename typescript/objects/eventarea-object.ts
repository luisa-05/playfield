import domElements from '../dom-elements';
import { Eventarea, Tile, TileKind } from '../interfaces';
import vars from '../vars';
import EventareaObjectForm from './eventarea-object-form';

class EventareaObject {
  initRender!: boolean;
  x!: number;
  y!: number;
  idArea!: number;
  widthArea!: number;
  heightArea!: number;
  contentArea!: string | undefined;
  bgcolorArea!: string | undefined;
  eventarea!: HTMLDivElement | null | undefined;
  startTile!: HTMLDivElement | undefined;

  constructor(
    initRender: boolean = true,
    x: number,
    y: number,
    idArea: number = vars.counterIdObjects,
    widthArea: number = +(domElements.widthEventarea()?.value ?? -1),
    heightArea: number = +(domElements.heightEventarea()?.value ?? -1),
    contentArea: string | undefined = domElements.selectContentEventarea()
      ?.value,
    bgcolorArea: string | undefined = domElements.backgroundColorEventarea()
      ?.value,
  ) {
    this.initRender = initRender;
    this.x = x;
    this.y = y;
    this.idArea = idArea;
    this.widthArea = widthArea;
    this.heightArea = heightArea;
    this.contentArea = contentArea;
    this.bgcolorArea = bgcolorArea;
    this.startTile = vars.utilities.getCertainTileObject(this.x, this.y);
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    const currentTile: HTMLDivElement | undefined =
      vars.utilities.getCertainTileObject(this.x, this.y);

    const htmlEventarea: string = `
<div class="playfield__eventarea" data-x="${this.x}" data-y="${this.y}" data-id="${this.idArea}" data-width="${this.widthArea}" data-height="${this.heightArea}" data-content="${this.contentArea}" data-bgcolor="${this.bgcolorArea}">
</div>`;

    const arrTilesArea: (Tile | undefined)[] = [];
    for (let y = this.y; y < this.y + this.heightArea; y++) {
      for (let x = this.x; x < this.x + this.widthArea; x++) {
        const tile: Tile | undefined = vars.utilities.getTileFromArr(x, y);
        arrTilesArea.push(tile);
      }
    }

    const kindTilesArea: (TileKind | null | undefined)[] = [];
    arrTilesArea.forEach((tile) => {
      kindTilesArea.push(tile?.kind);
    });

    if (
      !arrTilesArea.includes(undefined) &&
      !kindTilesArea.includes('street')
    ) {
      const streetTileOrUndefined: Tile | undefined =
        vars.utilities.areaCheckForStreetNeighbours(arrTilesArea);
      if (this.contentArea === 'carPark' && !streetTileOrUndefined) {
        vars.modal.showModal(
          `Plazierung nicht möglich! <br> 
          Die Eventarea benötigt mindestens EIN anliegendes Straßen-Tile.`,
          'Ok',
          false,
        );
      } else {
        if (this.contentArea === 'carPark' && streetTileOrUndefined) {
          streetTileOrUndefined.carParkEntrance.entrance = true;
          streetTileOrUndefined.carParkEntrance.idCarPark = this.idArea;
        }

        currentTile?.insertAdjacentHTML('afterbegin', htmlEventarea);
        this.eventarea = this.startTile?.querySelector(
          `.playfield__eventarea[data-x="${this.x}"][data-y="${this.y}"]`,
        );

        if (this.eventarea) {
          vars.eventareas.push(this.eventarea);
        }
        if (this.initRender) {
          arrTilesArea.map((tile: Tile | undefined) => {
            if (tile) {
              return tile.contains.push({
                type: 'eventarea',
                content: this.contentArea,
                id: vars.counterIdObjects,
              });
            }
          });
          vars.counterIdObjects++;
        }

        this.style();

        if (this.contentArea === 'carPark') {
          const entranceTile: Tile | undefined = vars.tilesArr.find(
            (tile: Tile) =>
              tile.carParkEntrance.idCarPark ===
              +(this.eventarea?.dataset.id ?? -1),
          );
          currentTile
            ?.querySelector('car-park')
            ?.addEventListener('sendCapacity', (e) => {
              const carCapacity: (string | number)[] = (e as CustomEvent)
                .detail;

              if (this.eventarea) {
                this.eventarea.dataset.carCapacity = carCapacity[0] + '';
                this.eventarea.dataset.availableCapacity = carCapacity[1] + '';

                if (entranceTile) {
                  const availableCapacity =
                    this.eventarea.dataset.availableCapacity === 'true'
                      ? true
                      : false;
                  entranceTile.carParkEntrance.availableCapacity =
                    availableCapacity;
                }
              }

              this.data(carCapacity);
              new EventareaObjectForm().formEditEventarea(
                this.eventarea,
                carCapacity[0],
              );

              const areaData: Eventarea | undefined = vars.eventareasArr.find(
                (area: Eventarea) =>
                  area.id === +(this.eventarea?.dataset.id ?? -1),
              );
              currentTile
                ?.querySelector('car-park')
                ?.addEventListener('sendCarNumb', (e) => {
                  const carNumb: number = (e as CustomEvent).detail;

                  if (this.eventarea && areaData) {
                    this.eventarea.dataset.currentCarNumb = carNumb + '';
                    areaData.currentCarNumb = carNumb;
                  }
                });
            });
        } else {
          this.data();
          new EventareaObjectForm().formEditEventarea(this.eventarea);
        }
      }
    } else {
      vars.modal.showModal(
        `Plazierung nicht möglich! <br> 
        Eventarea befindet sich außerhalb des Spielfeldes <br> oder es sind Straßen Tiles im Weg.`,
        'Ok',
        false,
      );
    }
  }

  style() {
    vars.utilities.eventareaStyle(
      this.eventarea,
      this.widthArea,
      this.heightArea,
      this.contentArea,
      this.bgcolorArea,
    );
  }

  logData(e: Event, currentArea: HTMLDivElement | null | undefined) {
    e.stopPropagation();
    const dataArea = vars.eventareasArr.find(
      (area: Eventarea) => area.id === +(currentArea?.dataset.id ?? -1),
    );
    console.dir(dataArea);
  }

  listenerLogData() {
    const currentArea: HTMLDivElement | null | undefined = this.eventarea;
    currentArea?.addEventListener('click', (e) => this.logData(e, currentArea));
  }

  data(carCapacity: (string | number)[] = []) {
    const eventarea: Eventarea = {
      element: 'eventarea',
      content: this.contentArea,
      startX: +(this.eventarea?.dataset.x ?? -1),
      startY: +(this.eventarea?.dataset.y ?? -1),
      width: this.widthArea,
      height: this.heightArea,
      id: +(this.eventarea?.dataset.id ?? -1),
      bgcolor: this.eventarea?.dataset.bgcolor,
    };
    if (this.contentArea === 'carPark') {
      const availableCapacity = carCapacity[1];
      eventarea.maxCapacity = carCapacity[0];
      if (typeof availableCapacity === 'boolean') {
        eventarea.availableCapacity = availableCapacity;
      }
    }
    if (this.initRender) {
      vars.eventareasArr.push(eventarea);
    }
    this.listenerLogData();
  }
}

export default EventareaObject;
