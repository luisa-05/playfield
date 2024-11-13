import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import domElements from './dom-elements';

class DriverDemo {
  constructor() {
    this.startTour();
  }

  runDriver(e: Event) {
    e.stopPropagation();
    const driverObj = driver({
      showProgress: true,
      progressText: '{{current}} von {{total}}',
      prevBtnText: '<-- Zurück',
      nextBtnText: 'Weiter -->',
      doneBtnText: 'Fertig',
      popoverClass: 'my-theme',
      steps: [
        {
          element: '.playfield-name-h5',
          popover: {
            title: 'Spielfeldname',
            description:
              'Hier ist der Spielfeldname Abgebildet oder "Unsaved" wenn das Spielfeld noch nicht gespeichert wurde.',
          },
        },
        {
          element: '.btn-generate-playfield',
          popover: {
            title: 'Neues Spielfeld Generieren',
            description:
              'Beim Klick darauf wird ein neues Spielfeld mit der darüber angegebenen Größe generiert.',
          },
        },
        {
          element: '.btn-default-scale',
          popover: {
            title: 'Standardskalierung',
            description:
              'Beim Klick darauf wird das Spielfeld nach den Kriterien des Initialen Renderns skaliert.',
          },
        },
        {
          element: '.nav__speed-range',
          popover: {
            title: 'Geschwindigkeit verwalten',
            description:
              'Hier können Sie die Geschwindigkeit regulieren, in welcher die Simulation läuft.',
          },
        },
        {
          element: '.nav__change-car-numb',
          popover: {
            title: 'Anzahl Autos ändern',
            description:
              'Hier können Sie die Anzahl der Autos vergrößern/verringern. Die aktuelle Zahl zeigt die aktuelle Anzahl der Autos auf dem Spielfeld an.',
          },
        },
        {
          element: '.nav__start-stop-simulation',
          popover: {
            title: 'Starten/Stoppen',
            description:
              'Hier können Sie die Fortlaufende Spielteppich-Simulation jederzeit stoppen/starten.',
          },
        },
        {
          element: '.create-street-network',
          popover: {
            title: 'Eigene Straßen ziehen',
            description: 'Hier können Sie beliebig Straßen hinzufügen.',
          },
        },
        {
          element: '.manual-save-switch',
          popover: {
            title: 'Manuelles Speichern aktivieren',
            description:
              'Wenn Sie das manuelle Speichern aktivieren, wird das automatische Speichern deaktiviert und Sie können ein Spielfeld jederzeit über den unten abgebildeten Button speichern.',
          },
        },
        {
          element: '.btn-save-playfield',
          popover: {
            title: 'Spielfeld Speichern',
            description:
              'Dieser Button ist nur aktiv, wenn das manuelle Speichern aktiv ist. Hier können Sie ein beliebiges Spielfeld speichern.',
          },
        },
        {
          element: '.saved-playfields-container',
          popover: {
            title: 'Gespeicherte Spielstände',
            description: 'Hier finden Sie alle gespeicherten Spielstände.',
          },
        },
      ],
    });

    driverObj.drive();
  }

  startTour() {
    domElements.onboardingBtn?.addEventListener('click', this.runDriver);
  }
}

export default DriverDemo;
