import domElements from '../dom-elements';
import vars from '../vars';
import CarMoveRender from './car-move-render';

class CarMove {
  maxSpeedRange: number = +(domElements.sliderSpeed?.max ?? -1) + 250;
  defaultValSpeedRange: number = 500;
  constructor() {}

  init() {
    this.time();
  }

  render(speed: number) {
    new CarMoveRender().init(speed);
  }

  timeInterval(speed: number) {
    vars.intervalSimulation = window.setInterval(() => {
      this.render(speed);
    }, speed);
  }

  startSimulation() {
    if (vars.assets.pauseBtn) {
      (domElements.simulationPlayButton() as SVGElement).outerHTML =
        vars.assets.pauseBtn();
    }

    if (domElements.sliderSpeed) {
      this.timeInterval(this.maxSpeedRange - +domElements.sliderSpeed.value);
      vars.simulationRunning = true;
    }

    domElements
      .simulationPauseButton()
      ?.addEventListener('click', this.pauseSimulation);
  }

  pauseSimulation = () => {
    if (vars.assets.playBtn) {
      (domElements.simulationPauseButton() as SVGElement).outerHTML =
        vars.assets.playBtn();
    }
    clearInterval(vars.intervalSimulation);
    vars.simulationRunning = false;

    clearInterval(vars.parkIntervall);

    domElements
      .simulationPlayButton()
      ?.addEventListener('click', () => this.startSimulation());
  };

  time() {
    if (domElements.sliderSpeed) {
      domElements.sliderSpeed.value =
        this.maxSpeedRange - this.defaultValSpeedRange + '';
      let speed: number = this.maxSpeedRange - +domElements.sliderSpeed.value;

      this.timeInterval(speed);

      domElements.sliderSpeed?.addEventListener('change', () => {
        if (domElements.sliderSpeed && domElements.simulationPauseButton()) {
          speed = this.maxSpeedRange - +domElements.sliderSpeed.value;
          clearInterval(vars.intervalSimulation);
          this.timeInterval(speed);
        }
      });
    }

    domElements
      .simulationPauseButton()
      ?.addEventListener('click', this.pauseSimulation);
  }
}

export default CarMove;
