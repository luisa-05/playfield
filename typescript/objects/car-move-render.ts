import { faker } from '@faker-js/faker';
import domElements from '../dom-elements';
import { Car, ConnectedObj, Eventarea, ParkingCar, Tile } from '../interfaces';
import vars from '../vars';
import CarObject from './car-object';

class CarMoveRender {
  constructor() {}

  init(speed: number) {
    this.renderCar(speed);
  }

  updateCarPark(destinationTile: Tile | undefined, car: Car) {
    const eventarea = vars.eventareas.find(
      (area: HTMLDivElement) =>
        +(area.dataset.id ?? -1) === destinationTile?.carParkEntrance.idCarPark,
    );

    const dataEventarea = vars.eventareasArr.find(
      (area: Eventarea) => area.id === +(eventarea?.dataset.id ?? -1),
    );

    vars.parkingCars.push({
      id: car.id,
      fill: car.color,
      idArea: +(eventarea?.dataset.id ?? -1),
    });

    if (eventarea) {
      eventarea.innerHTML = `
      <car-park height-area="${eventarea?.dataset.height}" width-area="${eventarea?.dataset.width}" endless="${eventarea?.dataset.carCapacity === 'endless' ? true : false}" area-id="${+(eventarea?.dataset.id ?? -1)}" car-capacity="${eventarea?.dataset.carCapacity}" car-drove-in="true" parking-cars=${JSON.stringify(vars.parkingCars)}></car-park>`;
    }

    eventarea
      ?.querySelector('car-park')
      ?.addEventListener('sendCapacity', (e) => {
        const carCapacity: (string | number)[] = (e as CustomEvent).detail;
        eventarea.dataset.availableCapacity = carCapacity[1] + '';
        const availableCapacity =
          eventarea.dataset.availableCapacity === 'true' ? true : false;
        if (dataEventarea) {
          dataEventarea.availableCapacity = availableCapacity;
        }
        if (destinationTile) {
          destinationTile.carParkEntrance.availableCapacity = availableCapacity;
        }
      });

    eventarea
      ?.querySelector('car-park')
      ?.addEventListener('sendCarNumb', (e) => {
        const carNumb: number = (e as CustomEvent).detail;

        if (eventarea && dataEventarea) {
          eventarea.dataset.currentCarNumb = carNumb + '';
          dataEventarea.currentCarNumb = carNumb;
        }
      });

    const parkIntervall = () => {
      vars.parkIntervall = window.setInterval(
        () => {
          if (vars.parkingCars.length > 0) {
            const indexNumb: number =
              vars.parkingCars.length === 1
                ? 0
                : faker.number.int({
                    min: 0,
                    max: vars.parkingCars.length - 1,
                  });

            const indexCar = vars.parkingCars.indexOf(
              vars.parkingCars[indexNumb],
            );
            const leavingCar: ParkingCar = vars.parkingCars.splice(
              indexCar,
              1,
            )[0];
            const parkEventarea = vars.eventareas.find(
              (area: HTMLDivElement) =>
                +(area.dataset.id ?? -1) === leavingCar.idArea,
            );
            const entrance: Tile | undefined = vars.tilesArr.find(
              (tile: Tile) =>
                tile.carParkEntrance.idCarPark === leavingCar.idArea,
            );
            const dataParkEventarea = vars.eventareasArr.find(
              (area: Eventarea) => area.id === leavingCar.id,
            );

            if (parkEventarea) {
              parkEventarea.innerHTML = `
              <car-park height-area="${parkEventarea?.dataset.height}" width-area="${parkEventarea?.dataset.width}" endless="${parkEventarea?.dataset.carCapacity === 'endless' ? true : false}" area-id="${leavingCar.idArea}" car-capacity="${parkEventarea?.dataset.carCapacity}" car-drove-in="true" parking-cars=${JSON.stringify(vars.parkingCars)}></car-park>`;
            }

            const carDestination =
              vars.utilities.defineCarDestination(entrance);

            if (entrance) {
              new CarObject(
                entrance.x,
                entrance?.y,
                carDestination,
                leavingCar.fill,
                leavingCar.id,
                'empty',
                true,
              );
            }

            parkEventarea
              ?.querySelector('car-park')
              ?.addEventListener('sendCapacity', (e) => {
                const carCapacity: (string | number)[] = (e as CustomEvent)
                  .detail;
                parkEventarea.dataset.availableCapacity = carCapacity[1] + '';
                const availableCapacity =
                  parkEventarea.dataset.availableCapacity === 'true'
                    ? true
                    : false;
                if (dataParkEventarea) {
                  dataParkEventarea.availableCapacity = availableCapacity;
                }
                if (entrance) {
                  entrance.carParkEntrance.availableCapacity =
                    availableCapacity;
                }
              });

            parkEventarea
              ?.querySelector('car-park')
              ?.addEventListener('sendCarNumb', (e) => {
                const carNumb: number = (e as CustomEvent).detail;

                if (parkEventarea && dataParkEventarea) {
                  parkEventarea.dataset.currentCarNumb = carNumb + '';
                  dataParkEventarea.currentCarNumb = carNumb;
                }
              });
          } else {
            clearInterval(vars.parkIntervall);
          }
          clearInterval(vars.parkIntervall);
        },
        faker.number.int({ min: 20000, max: 300000 }),
      );
    };

    if (vars.parkingCars.length > 0) {
      parkIntervall();
    }
  }

  destinationReached(
    x: number,
    y: number,
    car: Car,
    connectedCar: ConnectedObj | undefined,
    speed: number,
    carNumbChanged: boolean = false,
  ) {
    clearInterval(vars.intervalSimulation);

    const destinationTile: Tile | undefined = vars.utilities.getTileFromArr(
      x,
      y,
    );

    const svgCar: SVGElement | null | undefined = vars.utilities
      .getCertainTileObject(x, y)
      ?.querySelector(`.playfield__car[data-id="${car.id}"]`);
    svgCar?.remove();

    // remove car
    destinationTile?.contains.splice(
      destinationTile.contains.findIndex(
        (obj: ConnectedObj) =>
          JSON.stringify(obj) === JSON.stringify(connectedCar),
      ),
      1,
    );

    if (destinationTile?.carParkEntrance.entrance === true) {
      this.updateCarPark(destinationTile, car);
    } else {
      vars.carsArr.splice(
        vars.carsArr.findIndex((obj: Car) => obj.id === car.id),
        1,
      );
      vars.cars.splice(
        vars.cars.findIndex(
          (carDom: SVGElement) => carDom.dataset.id === svgCar?.dataset.id,
        ),
        1,
      );

      if (!carNumbChanged) {
        // render new car
        vars.outerStreetTiles = vars.streetTiles.filter(
          (tile: Tile) =>
            (!tile.hasNeighbourTop ||
              !tile.hasNeighbourRight ||
              !tile.hasNeighbourBottom ||
              !tile.hasNeighbourLeft) &&
            (tile.streetKind === 'crossing' ||
              tile.streetKind === 'straight-horizontal' ||
              tile.streetKind === 'straight-vertical'),
        );

        const randomInt = faker.number.int({
          min: 0,
          max: vars.outerStreetTiles.length - 1,
        });
        const xNewCar = +(vars.outerStreetTiles[randomInt].x ?? -1);
        const yNewCar = +(vars.outerStreetTiles[randomInt].y ?? -1);
        const carDestination = vars.utilities.defineCarDestination(
          vars.outerStreetTiles[randomInt],
        );

        new CarObject(xNewCar, yNewCar, carDestination);
      }
      const dynamicCarNumb: HTMLSpanElement | null =
        domElements.dynamicCarNumb();
      if (domElements.sliderCars && dynamicCarNumb) {
        domElements.sliderCars.value = vars.carsArr.length + '';
        dynamicCarNumb.textContent = `${vars.carsArr.length}`;
      }
    }

    if (domElements.simulationPauseButton()) {
      vars.carMove.timeInterval(speed);
    }
  }

  getNeighbourTiles(
    tile: Tile,
    direction: string,
    crossingArr: boolean = true,
  ) {
    const tiles: (Tile | undefined)[] = [];
    let countTiles: number = 1;
    const valueForI =
      direction === 'left' || direction === 'right' ? tile.x : tile.y;
    const widthOrHeightField =
      direction === 'right' ? vars.widthField : vars.heightField;

    for (
      let i = valueForI;
      direction === 'right' || direction === 'bottom'
        ? i < widthOrHeightField - 1
        : i > 0;
      direction === 'right' || direction === 'bottom' ? i++ : i--
    ) {
      let tl!: Tile | undefined;
      if (direction === 'left') {
        tl = vars.utilities.getTileFromArr(tile.x - countTiles, tile.y);
      } else if (direction === 'right') {
        tl = vars.utilities.getTileFromArr(tile.x + countTiles, tile.y);
      } else if (direction === 'top') {
        tl = vars.utilities.getTileFromArr(tile.x, tile.y - countTiles);
      } else if (direction === 'bottom') {
        tl = vars.utilities.getTileFromArr(tile.x, tile.y + countTiles);
      }

      if (!tl || tl.kind !== 'street') {
        break;
      } else {
        tiles.push(tl);
        countTiles++;
      }
    }
    const crossingCurveTiles = tiles.filter(
      (tile: Tile | undefined) =>
        tile?.streetKind === 'crossing' || tile?.streetKind?.includes('curve'),
    );

    if (crossingArr) {
      return crossingCurveTiles;
    } else {
      return tiles;
    }
  }

  checkForCrossings(crossingTiles: (Tile | undefined)[], direction: string) {
    const tilesFromCrossings: (Tile | undefined)[] = [];
    crossingTiles.forEach((crossing: Tile | undefined) => {
      if (crossing) {
        let tiles: (Tile | undefined)[] = [];

        direction === 'right' || direction === 'left'
          ? (tiles = [
              ...this.getNeighbourTiles(crossing, 'top', false),
              ...this.getNeighbourTiles(crossing, 'bottom', false),
            ])
          : (tiles = [
              ...this.getNeighbourTiles(crossing, 'right', false),
              ...this.getNeighbourTiles(crossing, 'left', false),
            ]);

        tilesFromCrossings.push(...tiles);
      }
    });
    const anyCurvesCrossings = tilesFromCrossings.some(
      (crossing: Tile | undefined) =>
        crossing?.streetKind === 'crossing' ||
        crossing?.streetKind?.includes('curve'),
    );

    return anyCurvesCrossings;
  }

  renderOrPreventCrash(
    tile: Tile,
    newCarKind: string,
    newCarX: number,
    newCarY: number,
    car: Car,
    connectedCar: ConnectedObj | undefined,
  ) {
    const carSvg: SVGElement | null | undefined = vars.utilities
      .getCertainTileObject(tile.x, tile.y)
      ?.querySelector(`.playfield__car[data-id="${car.id}"]`);
    const newCarTile = vars.utilities.getTileFromArr(newCarX, newCarY);
    const connectedObjTile = newCarTile?.contains.find(
      (obj: ConnectedObj) => obj.type === 'car',
    );
    const neighbourCar: Car | undefined = vars.carsArr.find(
      (car: Car) => car.id === connectedObjTile?.id,
    );

    if (
      ((newCarKind === 'car-to-left' || newCarKind === 'car-to-right') &&
        (neighbourCar?.kind === 'car-frontside' ||
          neighbourCar?.kind === 'car-backside')) ||
      ((newCarKind === 'car-frontside' || newCarKind === 'car-backside') &&
        (neighbourCar?.kind === 'car-to-left' ||
          neighbourCar?.kind === 'car-to-right')) ||
      (newCarKind === 'car-to-left' && neighbourCar?.kind === 'car-to-left') ||
      (newCarKind === 'car-to-right' &&
        neighbourCar?.kind === 'car-to-right') ||
      (newCarKind === 'car-frontside' &&
        neighbourCar?.kind === 'car-frontside') ||
      (newCarKind === 'car-backside' && neighbourCar?.kind === 'car-backside')
    ) {
      // prevent car crash
      return;
    } else {
      tile.contains.splice(
        tile.contains.findIndex((obj: ConnectedObj) => obj === connectedCar),
        1,
      );
      carSvg?.remove();

      new CarObject(
        newCarX,
        newCarY,
        car.destination.tile,
        car.color,
        car.id,
        newCarKind,
        true,
      );
    }
  }

  renderCar(speed: number) {
    if (vars.carsArr.length > 0) {
      vars.carsArr.forEach((car: Car) => {
        const tile = vars.tilesArr.find((tl: Tile) =>
          tl.contains.find((obj: ConnectedObj) => obj.id === car.id),
        );

        if (tile) {
          const currentX = tile.x;
          const currentY = tile.y;
          const connectedCar: ConnectedObj | undefined = tile.contains.find(
            (obj: ConnectedObj) => obj.id === car.id,
          );

          const destinationX = car?.destination.x;
          const destinationY = car?.destination.y;
          const neighbourRight = vars.utilities.getTileFromArr(
            currentX + 1,
            currentY,
          );
          const neighbourLeft = vars.utilities.getTileFromArr(
            currentX - 1,
            currentY,
          );
          const neighbourTop = vars.utilities.getTileFromArr(
            currentX,
            currentY - 1,
          );
          const neighbourBottom = vars.utilities.getTileFromArr(
            currentX,
            currentY + 1,
          );

          const heuristic = (tile: Tile) => {
            return (
              Math.abs(destinationX - tile.x) + Math.abs(destinationY - tile.y)
            ); // Manhattan-Distanz
          };

          let newCarX!: number;
          let newCarY!: number;
          let newCarKind: string | undefined = car?.kind;

          if (currentX === destinationX && currentY === destinationY) {
            this.destinationReached(
              currentX,
              currentY,
              car,
              connectedCar,
              speed,
            );
          } else {
            if (tile.streetKind === 'straight-vertical') {
              if (!tile.hasNeighbourTop) {
                newCarX = currentX;
                newCarY = currentY + 1;
                newCarKind = 'car-frontside';
              } else if (!tile.hasNeighbourBottom) {
                newCarX = currentX;
                newCarY = currentY - 1;
                newCarKind = 'car-backside';
              } else {
                if (car.kind === 'car-frontside') {
                  newCarX = currentX;
                  newCarY = currentY + 1;
                } else if (car?.kind === 'car-backside') {
                  newCarX = currentX;
                  newCarY = currentY - 1;
                }
              }
            } else if (tile.streetKind === 'straight-horizontal') {
              if (!tile.hasNeighbourLeft) {
                newCarX = currentX + 1;
                newCarY = currentY;
                newCarKind = 'car-to-right';
              } else if (!tile.hasNeighbourRight) {
                newCarX = currentX - 1;
                newCarY = currentY;
                newCarKind = 'car-to-left';
              } else {
                if (car.kind === 'car-to-right') {
                  newCarX = currentX + 1;
                  newCarY = currentY;
                } else if (car?.kind === 'car-to-left') {
                  newCarX = currentX - 1;
                  newCarY = currentY;
                }
              }
            }
            // curves
            else if (tile.streetKind === 'curve-down-right') {
              if (car.kind === 'car-backside') {
                newCarX = currentX + 1;
                newCarY = currentY;
                newCarKind = 'car-to-right';
              } else if (car.kind === 'car-to-left') {
                newCarX = currentX;
                newCarY = currentY + 1;
                newCarKind = 'car-frontside';
              }
            } else if (tile.streetKind === 'curve-down-left') {
              if (car.kind === 'car-backside') {
                newCarX = currentX - 1;
                newCarY = currentY;
                newCarKind = 'car-to-left';
              } else if (car.kind === 'car-to-right') {
                newCarX = currentX;
                newCarY = currentY + 1;
                newCarKind = 'car-frontside';
              }
            } else if (tile.streetKind === 'curve-top-left') {
              if (car.kind === 'car-frontside') {
                newCarX = currentX - 1;
                newCarY = currentY;
                newCarKind = 'car-to-left';
              } else if (car.kind === 'car-to-right') {
                newCarX = currentX;
                newCarY = currentY - 1;
                newCarKind = 'car-backside';
              }
            } else if (tile.streetKind === 'curve-top-right') {
              if (car.kind === 'car-frontside') {
                newCarX = currentX + 1;
                newCarY = currentY;
                newCarKind = 'car-to-right';
              } else if (car.kind === 'car-to-left') {
                newCarX = currentX;
                newCarY = currentY - 1;
                newCarKind = 'car-backside';
              }
            }
            // ////////////////////////////////////////
            else if (tile.streetKind === 'crossing') {
              if (destinationX !== undefined && destinationY !== undefined) {
                const crossingCurveTilesR: (Tile | undefined)[] =
                  this.getNeighbourTiles(tile, 'right');

                const crossingCuveTilesL: (Tile | undefined)[] =
                  this.getNeighbourTiles(tile, 'left');

                const crossingCurveTilesT: (Tile | undefined)[] =
                  this.getNeighbourTiles(tile, 'top');

                const crossingCurveTilesB: (Tile | undefined)[] =
                  this.getNeighbourTiles(tile, 'bottom');

                const heuristicNeighTop = neighbourTop
                  ? heuristic(neighbourTop)
                  : Infinity;

                const heuristicNeighRight = neighbourRight
                  ? heuristic(neighbourRight)
                  : Infinity;

                const heuristicNeighBottom = neighbourBottom
                  ? heuristic(neighbourBottom)
                  : Infinity;

                const heuristicNeighLeft = neighbourLeft
                  ? heuristic(neighbourLeft)
                  : Infinity;

                const anyCurvesCrossingsR = this.checkForCrossings(
                  crossingCurveTilesR,
                  'right',
                );
                const anyCurvesCrossingsL = this.checkForCrossings(
                  crossingCuveTilesL,
                  'left',
                );
                const anyCurvesCrossingsT = this.checkForCrossings(
                  crossingCurveTilesT,
                  'top',
                );
                const anyCurvesCrossingsB = this.checkForCrossings(
                  crossingCurveTilesB,
                  'bottom',
                );

                if (
                  currentX < destinationX &&
                  neighbourRight?.kind === 'street' &&
                  currentY === destinationY
                ) {
                  newCarX = currentX + 1;
                  newCarY = currentY;
                  newCarKind = 'car-to-right';
                } else if (
                  currentX > destinationX &&
                  neighbourLeft?.kind === 'street' &&
                  currentY === destinationY
                ) {
                  newCarX = currentX - 1;
                  newCarY = currentY;
                  newCarKind = 'car-to-left';
                } else if (
                  currentY < destinationY &&
                  neighbourBottom?.kind === 'street' &&
                  currentX === destinationX
                ) {
                  newCarX = currentX;
                  newCarY = currentY + 1;
                  newCarKind = 'car-frontside';
                } else if (
                  currentY > destinationY &&
                  neighbourTop?.kind === 'street' &&
                  currentX === destinationX
                ) {
                  newCarX = currentX;
                  newCarY = currentY - 1;
                  newCarKind = 'car-backside';
                }
                // ////////////////////////////////////////////
                else if (
                  currentX > destinationX &&
                  neighbourLeft?.kind === 'street' &&
                  car?.kind !== 'car-to-right' &&
                  crossingCurveTilesT.length > 0 &&
                  heuristicNeighLeft < heuristicNeighTop &&
                  heuristicNeighLeft < heuristicNeighBottom &&
                  heuristicNeighLeft < heuristicNeighRight &&
                  anyCurvesCrossingsL
                ) {
                  newCarX = currentX - 1;
                  newCarY = currentY;
                  newCarKind = 'car-to-left';
                } else if (
                  currentX < destinationX &&
                  neighbourRight?.kind === 'street' &&
                  car?.kind !== 'car-to-left' &&
                  crossingCurveTilesR.length > 0 &&
                  heuristicNeighRight < heuristicNeighTop &&
                  heuristicNeighRight < heuristicNeighBottom &&
                  heuristicNeighRight < heuristicNeighLeft &&
                  anyCurvesCrossingsR
                ) {
                  newCarX = currentX + 1;
                  newCarY = currentY;
                  newCarKind = 'car-to-right';
                } else if (
                  currentY > destinationY &&
                  neighbourTop?.kind === 'street' &&
                  crossingCurveTilesT.length > 0 &&
                  car?.kind !== 'car-frontside' &&
                  heuristicNeighTop < heuristicNeighLeft &&
                  heuristicNeighTop < heuristicNeighBottom &&
                  heuristicNeighTop < heuristicNeighRight &&
                  anyCurvesCrossingsT
                ) {
                  newCarX = currentX;
                  newCarY = currentY - 1;
                  newCarKind = 'car-backside';
                } else if (
                  currentY < destinationY &&
                  neighbourBottom?.kind === 'street' &&
                  crossingCurveTilesB.length > 0 &&
                  car?.kind !== 'car-backside' &&
                  heuristicNeighBottom < heuristicNeighLeft &&
                  heuristicNeighBottom < heuristicNeighTop &&
                  heuristicNeighBottom < heuristicNeighRight &&
                  anyCurvesCrossingsB
                ) {
                  newCarX = currentX;
                  newCarY = currentY + 1;
                  newCarKind = 'car-frontside';
                }
                // /////////////////////////////////////////////////
                else if (
                  car.kind === 'car-backside' &&
                  neighbourTop?.kind === 'street' &&
                  heuristicNeighTop < heuristicNeighLeft &&
                  heuristicNeighTop < heuristicNeighRight &&
                  crossingCurveTilesT.length > 0
                ) {
                  newCarX = currentX;
                  newCarY = currentY - 1;
                } else if (
                  car.kind === 'car-backside' &&
                  neighbourLeft?.kind === 'street' &&
                  heuristicNeighLeft < heuristicNeighTop &&
                  heuristicNeighLeft < heuristicNeighRight &&
                  crossingCuveTilesL.length > 0
                ) {
                  newCarX = currentX - 1;
                  newCarY = currentY;
                  newCarKind = 'car-to-left';
                } else if (
                  car.kind === 'car-backside' &&
                  neighbourRight?.kind === 'street' &&
                  heuristicNeighRight < heuristicNeighTop &&
                  heuristicNeighRight < heuristicNeighLeft &&
                  crossingCurveTilesR.length > 0
                ) {
                  newCarX = currentX + 1;
                  newCarY = currentY;
                  newCarKind = 'car-to-right';
                } else if (
                  car.kind === 'car-frontside' &&
                  neighbourBottom?.kind === 'street' &&
                  heuristicNeighBottom < heuristicNeighLeft &&
                  heuristicNeighBottom < heuristicNeighRight &&
                  crossingCurveTilesB.length > 0
                ) {
                  newCarX = currentX;
                  newCarY = currentY + 1;
                } else if (
                  car.kind === 'car-frontside' &&
                  neighbourLeft?.kind === 'street' &&
                  heuristicNeighLeft < heuristicNeighBottom &&
                  heuristicNeighLeft < heuristicNeighRight &&
                  crossingCuveTilesL.length > 0
                ) {
                  newCarX = currentX - 1;
                  newCarY = currentY;
                  newCarKind = 'car-to-left';
                } else if (
                  car.kind === 'car-frontside' &&
                  neighbourRight?.kind === 'street' &&
                  heuristicNeighRight < heuristicNeighBottom &&
                  heuristicNeighRight < heuristicNeighLeft &&
                  crossingCurveTilesR.length > 0
                ) {
                  newCarX = currentX + 1;
                  newCarY = currentY;
                  newCarKind = 'car-to-right';
                } else if (
                  car.kind === 'car-to-left' &&
                  neighbourLeft?.kind === 'street' &&
                  heuristicNeighLeft < heuristicNeighTop &&
                  heuristicNeighLeft < heuristicNeighBottom &&
                  crossingCuveTilesL.length > 0
                ) {
                  newCarX = currentX - 1;
                  newCarY = currentY;
                } else if (
                  car.kind === 'car-to-left' &&
                  neighbourTop?.kind === 'street' &&
                  heuristicNeighTop < heuristicNeighLeft &&
                  heuristicNeighTop < heuristicNeighBottom &&
                  crossingCurveTilesT.length > 0
                ) {
                  newCarX = currentX;
                  newCarY = currentY - 1;
                  newCarKind = 'car-backside';
                } else if (
                  car.kind === 'car-to-left' &&
                  neighbourBottom?.kind === 'street' &&
                  heuristicNeighBottom < heuristicNeighLeft &&
                  heuristicNeighBottom < heuristicNeighTop &&
                  crossingCurveTilesB.length > 0
                ) {
                  newCarX = currentX;
                  newCarY = currentY + 1;
                  newCarKind = 'car-frontside';
                } else if (
                  car.kind === 'car-to-right' &&
                  neighbourRight?.kind === 'street' &&
                  heuristicNeighRight < heuristicNeighTop &&
                  heuristicNeighRight < heuristicNeighBottom &&
                  crossingCurveTilesR.length > 0
                ) {
                  newCarX = currentX + 1;
                  newCarY = currentY;
                } else if (
                  car.kind === 'car-to-right' &&
                  neighbourTop?.kind === 'street' &&
                  heuristicNeighTop < heuristicNeighRight &&
                  heuristicNeighTop < heuristicNeighBottom &&
                  crossingCurveTilesT.length > 0
                ) {
                  newCarX = currentX;
                  newCarY = currentY - 1;
                  newCarKind = 'car-backside';
                } else if (
                  car.kind === 'car-to-right' &&
                  neighbourBottom?.kind === 'street' &&
                  heuristicNeighBottom < heuristicNeighRight &&
                  heuristicNeighBottom < heuristicNeighTop &&
                  crossingCurveTilesB.length > 0
                ) {
                  newCarX = currentX;
                  newCarY = currentY + 1;
                  newCarKind = 'car-frontside';
                }
                // ///////////////////////////////////////////////////
                else if (
                  car.kind === 'car-to-left' &&
                  neighbourLeft?.kind === 'street' &&
                  crossingCuveTilesL.length > 0
                ) {
                  newCarX = currentX - 1;
                  newCarY = currentY;
                } else if (
                  car.kind === 'car-to-right' &&
                  neighbourRight?.kind === 'street' &&
                  crossingCurveTilesR.length > 0
                ) {
                  newCarX = currentX + 1;
                  newCarY = currentY;
                } else if (
                  car.kind === 'car-frontside' &&
                  neighbourBottom?.kind === 'street' &&
                  crossingCurveTilesB.length > 0
                ) {
                  newCarX = currentX;
                  newCarY = currentY + 1;
                } else if (
                  car.kind === 'car-backside' &&
                  neighbourTop?.kind === 'street' &&
                  crossingCurveTilesT.length > 0
                ) {
                  newCarX = currentX;
                  newCarY = currentY - 1;
                } else if (
                  neighbourLeft?.kind === 'street' &&
                  car.kind !== 'car-to-right' &&
                  crossingCuveTilesL.length > 0
                ) {
                  newCarX = currentX - 1;
                  newCarY = currentY;
                  newCarKind = 'car-to-left';
                } else if (
                  neighbourRight?.kind === 'street' &&
                  car.kind !== 'car-to-left' &&
                  crossingCurveTilesR.length > 0
                ) {
                  newCarX = currentX + 1;
                  newCarY = currentY;
                  newCarKind = 'car-to-right';
                } else if (
                  neighbourTop?.kind === 'street' &&
                  car.kind !== 'car-frontside' &&
                  crossingCurveTilesT.length > 0
                ) {
                  newCarX = currentX;
                  newCarY = currentY - 1;
                  newCarKind = 'car-backside';
                } else if (
                  neighbourBottom?.kind === 'street' &&
                  car.kind !== 'car-backside' &&
                  crossingCurveTilesB.length > 0
                ) {
                  newCarX = currentX;
                  newCarY = currentY + 1;
                  newCarKind = 'car-frontside';
                }
              }
            }

            this.renderOrPreventCrash(
              tile,
              newCarKind,
              newCarX,
              newCarY,
              car,
              connectedCar,
            );
          }
        }
      });
    } else {
      vars.carMove.pauseSimulation();
    }
  }
}

export default CarMoveRender;
