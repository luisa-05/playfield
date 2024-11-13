import domElements from './dom-elements';
import vars from './vars';

class Nav {
  constructor() {
    this.init();
  }

  init() {
    this.listenerCloseOpen();
  }

  toggleNav = () => {
    const arrowCloseNav = domElements.arrowCloseNav();
    const arrowOpenNav = domElements.arrowOpenNav();
    const closeOpenNavRect: DOMRect | undefined =
      domElements.containerCloseOpenNav?.getBoundingClientRect();

    if (domElements.nav) {
      // if nav closed
      if (arrowCloseNav && vars.assets.navArrowOpen) {
        domElements.nav.style.display = 'none';
        arrowCloseNav.outerHTML = vars.assets.navArrowOpen();

        if (!vars.manualScaling) {
          vars.utilities.initialPlayfieldScale(closeOpenNavRect);
        }
      }
      // if nav opened
      else if (arrowOpenNav && vars.assets.navArrowClose) {
        domElements.nav.style.display = 'flex';
        arrowOpenNav.outerHTML = vars.assets.navArrowClose();

        if (!vars.manualScaling) {
          vars.utilities.initialPlayfieldScale(vars.navRect);
        }
      }
    }
  };

  listenerCloseOpen() {
    domElements.containerCloseOpenNav?.addEventListener(
      'click',
      this.toggleNav,
    );

    domElements.sliderScale?.addEventListener('change', () => {
      vars.manualScaling = true;
      vars.playfield.style.position = 'static';
      vars.playfield.style.alignSelf = 'flex-start';
      vars.playfield.style.marginTop = '20px';
    });
  }
}

export default Nav;
