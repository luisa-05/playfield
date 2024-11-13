import Modal from './modal';
import CarMove from './objects/car-move';
import SavePlayfield from './save-playfield';
import Utilities from './utilities';

export interface Assets {
  srcTree: string;
  srcLake: string;

  carSidewards?: (direction: 'left' | 'right', carId: number) => string;
  carFrontside?: (carId: number) => string;
  carBackside?: (carId: number) => string;
  playBtn?: () => string;
  pauseBtn?: () => string;
  navArrowClose?: () => string;
  navArrowOpen?: () => string;
}

export interface Vars {
  playfield: HTMLDivElement;
  widthField: number;
  heightField: number;
  maxWidth: number;
  minWidth: number;
  maxHeight: number;
  minHeight: number;
  navRect: DOMRect | undefined;
  tileSize: number;
  tilesArr: Tile[];
  tiles: HTMLDivElement[];
  streetTiles: Tile[];
  lawnTiles: Tile[];
  outerStreetTiles: Tile[];
  destinationStreetTiles: Tile[];
  carsArr: Car[];
  cars: SVGElement[];
  trees: HTMLImageElement[];
  lakes: HTMLImageElement[];
  eventareas: HTMLDivElement[];
  eventareasArr: Eventarea[];
  counterIdObjects: number;
  assets: Assets;
  carColors: Record<string, CarColorsData>;
  tileKind: Record<string, string>;
  domObjects: Record<string, string>;
  contentEventarea: Record<string, string>;
  storedPlayfields: Storedplayfield[];
  liFieldsArr: string[];
  counterLiFields: number;
  intervalSimulation: number;
  simulationRunning: boolean;
  manualScaling: boolean;
  automaticSave: boolean;
  utilities: Utilities;
  carMove: CarMove;
  savePlayfield: SavePlayfield;
  modal: Modal;
  parkingCars: ParkingCar[];
  parkIntervall: number;
}

export interface ParkingCar {
  id: number;
  fill: string;
  idArea: number;
}

export interface CarColorsData {
  value: string;
  label: string;
}

export type ObjType = null | 'car' | 'tree' | 'lake' | 'eventarea';

export interface ConnectedObj {
  type: ObjType;
  id?: number;
  content?: string;
}

export interface carParkEntranceDetails {
  entrance: boolean;
  idCarPark: number;
  availableCapacity?: boolean;
}

export type TileKind = 'lawn' | 'street';
export type StreetKind =
  | 'straight-horizontal'
  | 'straight-vertical'
  | 'crossing'
  | 'curve-top-right'
  | 'curve-top-left'
  | 'curve-down-right'
  | 'curve-down-left';

export interface Tile {
  element: 'tile';
  kind: null | TileKind;
  x: number;
  y: number;
  contains: ConnectedObj[];
  hasNeighbourTop: boolean;
  hasNeighbourRight: boolean;
  hasNeighbourBottom: boolean;
  hasNeighbourLeft: boolean;
  streetKind?: StreetKind;
  carParkEntrance: carParkEntranceDetails;
}

export type CarKind =
  | 'car-to-left'
  | 'car-to-right'
  | 'car-frontside'
  | 'car-backside';

export interface Destination {
  tile: Tile;
  x: number;
  y: number;
}

export interface Car {
  element: 'car';
  id: number;
  kind: CarKind;
  color: string;
  destination: Destination;
}

export interface Eventarea {
  element: 'eventarea';
  content: string | undefined;
  startX: number;
  startY: number;
  width: number;
  height: number;
  id: number;
  bgcolor: string | undefined;
  maxCapacity?: string | number;
  availableCapacity?: boolean;
  currentCarNumb?: number;
}

// only for frontend save:
export interface Storedplayfield {
  tiles: Tile[];
  id?: number;
  eventareas: Eventarea[];
  cars: Car[];
  name?: string;
  widthPlayfield?: string;
  heightPlayfield?: string;
}
// //////////////////////////

export interface StoredplayfieldData {
  tiles: Tile[];
  eventareas: Eventarea[];
  cars: Car[];
  parkingCars: ParkingCar[];
  widthPlayfield?: string;
  heightPlayfield?: string;
}

export interface StoredplayfieldBackend {
  data: StoredplayfieldData;
  id: number;
  name: string;
  playfieldImg: string;
  creationDate: string;
}
