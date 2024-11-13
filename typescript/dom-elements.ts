const playfieldElement = document.querySelector<HTMLDivElement>('.playfield');

const navContainer = document.querySelector<HTMLDivElement>('.nav-container');

const containerCloseOpenNav =
  document.querySelector<HTMLDivElement>('.close-open-nav');

const arrowCloseNav = () =>
  document.querySelector<SVGElement>('.arrow-to-left');

const arrowOpenNav = () =>
  document.querySelector<SVGElement>('.arrow-to-right');

const nav = document.querySelector<HTMLDivElement>('.nav');

const onboardingBtn =
  document.querySelector<HTMLButtonElement>('.start-driver-btn');

const widthPlayfield: HTMLInputElement | null =
  document.querySelector<HTMLInputElement>('#size-x');
const heightPlayfield: HTMLInputElement | null =
  document.querySelector<HTMLInputElement>('#size-y');
const btnGenerate = document.querySelector<HTMLButtonElement>(
  '.btn-generate-playfield',
);

const randomBtn = document.querySelector<HTMLButtonElement>('.btn-random-size');
const btnAllData =
  document.querySelector<HTMLButtonElement>('.btn-log-all-data');
const btnRandomPlayfield = document.querySelector<HTMLButtonElement>(
  '.btn-random-playfield',
);

// playfield name
const navPlayfieldName = document.querySelector('.playfield-name-h5');

// playfield scale
const sliderScale = document.querySelector<HTMLInputElement>('.scale');

const btnDefaultScale =
  document.querySelector<HTMLButtonElement>('.btn-default-scale');

// speed simulation
const sliderSpeed = document.querySelector<HTMLInputElement>('.speed-range');

// number cars
const sliderCars = document.querySelector<HTMLInputElement>('.slider-car-numb');

const containerValuesCarNumb = () =>
  document.querySelector<HTMLDivElement>('.min-max-car-numb');

const dynamicCarNumb = () =>
  document.querySelector<HTMLSpanElement>('.dynamic-car-number');

// start stop simulation
const simulationPauseButton = () =>
  document.querySelector<SVGElement>('.simulation-pause-btn');
const simulationPlayButton = () =>
  document.querySelector<SVGElement>('.simulation-play-btn');

// street network
const btnSetStreets = document.querySelector<HTMLButtonElement>(
  '.create-street-network',
);
const btnExitSetStreets = () =>
  document.querySelector<HTMLButtonElement>('.exit-create-street-network');

// save-load playfield
const manualSaveSwitch =
  document.querySelector<HTMLInputElement>('.input-manual-save');

const savePlayfield = document.querySelector<HTMLButtonElement>(
  '.btn-save-playfield',
);

const formSavePlayfield = document.querySelector<HTMLFormElement>(
  '.form-save-playfield',
);

const inputNamePlayfield =
  document.querySelector<HTMLInputElement>('.name-field-state');

const saveCurrentPlayfield =
  document.querySelector<HTMLButtonElement>('.save-playfield');

const cancelCurrentPlayfield = document.querySelector<HTMLButtonElement>(
  '.cancel-playfield-save',
);

const messageSuccessfulSaved = document.querySelector<HTMLDivElement>(
  '.message-successful-saved',
);

const messageSavingFailed = document.querySelector<HTMLDivElement>(
  '.message-saving-failed',
);

const deleteErrorMsg =
  document.querySelector<HTMLDivElement>('.error-msg-delete');

const openPlayfieldList = document.querySelector<HTMLDivElement>(
  '.headline-playfields-list',
);

const playfieldList = document.querySelector<HTMLUListElement>(
  '.saved-playfields-list',
);

const listArrowSvg = document.querySelector<SVGElement>('.fields-list-svg');

const modal = () => document.querySelector<HTMLDivElement>('.modal');

const modalConfirmed = () =>
  document.querySelector<HTMLButtonElement>('.confirmed');

const modalUnconfirmed = () =>
  document.querySelector<HTMLButtonElement>('.do-not-confirmed');

const inputPlayfieldName = () =>
  document.querySelector<HTMLInputElement>('.playfield-name');

const formEditMenu = () =>
  document.querySelector<HTMLFormElement>('.edit-menu-stored-fields');

const btnRenamePlayfield = () =>
  document.querySelector<HTMLFormElement>('.btn-rename');

const btnDeletePlayfield = () =>
  document.querySelector<HTMLFormElement>('.btn-delete-playfield');

// edit car
const formEditCar = () => document.querySelector<HTMLFormElement>('.edit-car');

const selectCarColor = () =>
  document.querySelector<HTMLSelectElement>('.edit-car__select-color');

// edit object
const formEditObject = () =>
  document.querySelector<HTMLFormElement>('.edit-object');

const svgDeleteObject = () =>
  document.querySelector<HTMLButtonElement>('.edit-object__delete');

// edit eventarea

const formEditEventarea = () =>
  document.querySelector<HTMLFormElement>('.edit-eventarea');

const widthEventarea = () =>
  document.querySelector<HTMLInputElement>('.eventarea__width');

const heightEventarea = () =>
  document.querySelector<HTMLInputElement>('.eventarea__height');

const backgroundColorEventarea = () =>
  document.querySelector<HTMLInputElement>('.eventarea-background-color');

const selectContentEventarea = () =>
  document.querySelector<HTMLSelectElement>('.eventarea-select-content');

const selectCapacityCarPark = () =>
  document.querySelector<HTMLSelectElement>('.eventarea-define-car-capacity');

const optionFixCapacity = () =>
  document.querySelector<HTMLOptionElement>('.fix-capacity');

const inputCustomCarCapacity = () =>
  document.querySelector<HTMLInputElement>('.custom-car-park-capacity');

// edit tile
const formEditTile = () =>
  document.querySelector<HTMLFormElement>('.edit-tile');

const labelSelectKind = () =>
  document.querySelector<HTMLLabelElement>('.edit-tile__label-kind');

const selectKind = () =>
  document.querySelector<HTMLSelectElement>('.edit-tile__select-kind');

const headlineAddObjects = () =>
  document.querySelector<HTMLParagraphElement>('.headline-add-objects');

const labelTreeCheckbox = () =>
  document.querySelector<HTMLLabelElement>('.object__tree-label');

const treeCheckbox = () =>
  document.querySelector<HTMLInputElement>('.object__tree');

const labelLakeCheckbox = () =>
  document.querySelector<HTMLLabelElement>('.object__lake-label');

const lakeCheckbox = () =>
  document.querySelector<HTMLInputElement>('.object__lake');

const labelCarCheckbox = () =>
  document.querySelector<HTMLLabelElement>('.object__car-label');

const carCheckbox = () =>
  document.querySelector<HTMLInputElement>('.object__car');

const containerSelectCarColor = () =>
  document.querySelector<HTMLDivElement>('.edit-tile__car-color');

const labelEventareaCheckbox = () =>
  document.querySelector<HTMLLabelElement>('.object__eventarea-label');

const eventareaCheckbox = () =>
  document.querySelector<HTMLInputElement>('.object__eventarea');

const containerEventareaSettings = () =>
  document.querySelector<HTMLDivElement>('.edit-tile__eventarea-settings');

// general edit
const svgCancel = () => document.querySelector<SVGElement>('.form__svg-cancel');

const saveBtn = () => document.querySelector<HTMLButtonElement>('.btn-save');

const cancelBtn = () =>
  document.querySelector<HTMLButtonElement>('.btn-cancel');

const deleteBtn = () =>
  document.querySelector<HTMLButtonElement>('.btn-delete');

const domElements = {
  playfieldElement,
  navContainer,
  containerCloseOpenNav,
  arrowCloseNav,
  arrowOpenNav,
  nav,
  onboardingBtn,
  widthPlayfield,
  heightPlayfield,
  btnGenerate,
  randomBtn,
  btnAllData,
  btnRandomPlayfield,
  navPlayfieldName,
  sliderScale,
  btnDefaultScale,
  sliderSpeed,
  sliderCars,
  containerValuesCarNumb,
  dynamicCarNumb,
  simulationPauseButton,
  simulationPlayButton,
  btnSetStreets,
  btnExitSetStreets,
  manualSaveSwitch,
  savePlayfield,
  formSavePlayfield,
  inputNamePlayfield,
  saveCurrentPlayfield,
  cancelCurrentPlayfield,
  messageSuccessfulSaved,
  messageSavingFailed,
  deleteErrorMsg,
  openPlayfieldList,
  playfieldList,
  listArrowSvg,
  modal,
  modalConfirmed,
  modalUnconfirmed,
  inputPlayfieldName,
  formEditMenu,
  btnRenamePlayfield,
  btnDeletePlayfield,
  formEditCar,
  selectCarColor,
  deleteBtn,
  formEditObject,
  svgDeleteObject,
  formEditTile,
  labelSelectKind,
  selectKind,
  headlineAddObjects,
  labelTreeCheckbox,
  treeCheckbox,
  labelLakeCheckbox,
  lakeCheckbox,
  labelCarCheckbox,
  carCheckbox,
  containerSelectCarColor,
  labelEventareaCheckbox,
  eventareaCheckbox,
  containerEventareaSettings,
  formEditEventarea,
  widthEventarea,
  heightEventarea,
  backgroundColorEventarea,
  selectContentEventarea,
  selectCapacityCarPark,
  optionFixCapacity,
  inputCustomCarCapacity,
  svgCancel,
  saveBtn,
  cancelBtn,
};

export default domElements;
