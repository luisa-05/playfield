import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { faker } from '@faker-js/faker';

@Component({
  tag: 'sheep-pasture',
  styleUrl: 'sheep-pasture.css',
  shadow: true,
})
export class SheepPasture {
  @Prop() sizeArea: number = 4;
  @Prop() heightArea: number = 200;
  @Prop() widthArea: number = 200;
  @State() sheepFill: string = 'rgb(221, 221, 221)';
  @Element() el: HTMLElement;

  hungerDisplay(sheep: SVGElement) {
    const randomTime = faker.number.int({ min: 5000, max: 60000 });
    let r = 221;
    let g = 221;
    let b = 221;
    const hungerInterval = setInterval(() => {
      if (r > 150 && g > 0 && b > 0) {
        r -= 7.1;
        g -= 22.1;
        b -= 22.1;
        sheep.style.fill = `rgb(${r}, ${g}, ${b})`;
      } else {
        clearInterval(hungerInterval);
      }
    }, randomTime);
  }

  resetHunger(sheep: SVGElement) {
    sheep.style.fill = 'rgb(221, 221, 221)';
    this.hungerDisplay(sheep);
  }

  moveSheep(sheep: SVGElement, pastureRect: DOMRect, tree: SVGElement, lake: SVGElement) {
    let sheepRect = sheep.getBoundingClientRect();

    const translateX = faker.number.int({ min: -parseInt(sheep.style.left), max: this.widthArea - parseInt(sheep.style.left) - 30 });
    const translateY = faker.number.int({ min: -parseInt(sheep.style.top), max: this.heightArea - parseInt(sheep.style.top) - 30 });

    sheep.style.transform = `translate(${translateX}px, ${translateY}px)`;
    sheep.style.transition = `transform 80s, top 80s, left 80s, right 80s, bottom 80s`;

    sheepRect = sheep.getBoundingClientRect();

    if (tree) {
      this.preventCollisions(sheep, sheepRect, tree, pastureRect);
    }
    if (lake) {
      this.preventCollisions(sheep, sheepRect, lake, pastureRect);
    }
  }

  preventCollisions(sheep: SVGElement, sheepRect: DOMRect, treeLake: SVGElement, pastureRect: DOMRect) {
    const treeLakeRect = treeLake.getBoundingClientRect();
    if (sheepRect.right > treeLakeRect.left && sheepRect.left < treeLakeRect.right && sheepRect.bottom > treeLakeRect.top && sheepRect.top < treeLakeRect.bottom) {
      if (sheepRect.top < pastureRect.top || sheepRect.left < pastureRect.left || sheepRect.bottom > pastureRect.bottom || sheepRect.right > pastureRect.right) {
        sheep.style.top = `${faker.number.int({ min: 0, max: this.heightArea - 30 })}px`;
        sheep.style.left = `${faker.number.int({ min: 0, max: this.widthArea - 30 })}px`;
      } else {
        if (sheepRect.right > treeLakeRect.left && sheepRect.right < treeLakeRect.right) {
          // sheep from left
          sheep.style.transform = `translateX(${-sheepRect.width + -sheepRect.width}px)`;
        } else if (sheepRect.left > treeLakeRect.left && sheepRect.left < treeLakeRect.right) {
          // sheep from right
          sheep.style.transform = `translateX(${sheepRect.width * 2}px)`;
        } else if (sheepRect.bottom > treeLakeRect.top && sheepRect.bottom < treeLakeRect.bottom) {
          // sheep from top
          sheep.style.transform = `translateY(${-sheepRect.width + -sheepRect.width}px)`;
        } else if (sheepRect.top > treeLakeRect.top && sheepRect.top < treeLakeRect.bottom) {
          // sheep from bottom
          sheep.style.transform = `translateY(${sheepRect.width * 2}px)`;
        }
      }
    }
  }

  componentDidRender() {
    const sheeps = this.el.shadowRoot.querySelectorAll<SVGElement>('.sheep');
    const tree = this.el.shadowRoot.querySelector<SVGElement>('.tree');
    const lake = this.el.shadowRoot.querySelector<SVGElement>('.lake');
    const pastureRect = this.el.getBoundingClientRect();

    const treeLakePosition = (treeLake: SVGElement, hasLake: boolean = false) => {
      treeLake.style.left = `${faker.number.int({ min: 0, max: this.widthArea - 54 })}px`;
      treeLake.style.top = `${faker.number.int({ min: 0, max: this.heightArea - 54 })}px`;

      if (hasLake) {
        const treeRect = tree.getBoundingClientRect();
        const lakeRect = lake.getBoundingClientRect();
        if (lakeRect.right > treeRect.left && lakeRect.left < treeRect.right && lakeRect.bottom > treeRect.top && lakeRect.top < treeRect.bottom) {
          treeLakePosition(lake, true);
        }
      }
    };

    if (tree) {
      treeLakePosition(tree);
    }
    if (lake) {
      treeLakePosition(lake, true);
    }
    Array.from(sheeps).forEach(sheep => {
      let sheepRect = sheep.getBoundingClientRect();

      sheep.style.top = `${faker.number.int({ min: 0, max: this.heightArea - 30 })}px`;
      sheep.style.left = `${faker.number.int({ min: 0, max: this.widthArea - 30 })}px`;

      sheepRect = sheep.getBoundingClientRect();

      this.hungerDisplay(sheep);
      sheep.addEventListener('click', () => this.resetHunger(sheep));

      if (tree) {
        this.preventCollisions(sheep, sheepRect, tree, pastureRect);
      }
      if (lake) {
        this.preventCollisions(sheep, sheepRect, lake, pastureRect);
      }

      this.moveSheep(sheep, pastureRect, tree, lake);
      setInterval(() => this.moveSheep(sheep, pastureRect, tree, lake), faker.number.int({ min: 10000, max: 30000 }));
    });
  }

  render() {
    const arrsizeArea = Array.from({ length: this.sizeArea }, (_, index) => `sheep${index + 1}`);

    const setTree = () => {
      if (this.sizeArea >= 4) {
        return <img class="tree" src="../../../../imgs/tree.png" alt="tree" />;
      }
    };

    const setLake = () => {
      if (this.sizeArea >= 9) {
        return <img class="lake" src="../../../../imgs/lake.png" alt="lake" />;
      }
    };

    return (
      <Host>
        <slot>
          {arrsizeArea.map(() => {
            return (
              <svg style={{ fill: `${this.sheepFill}` }} class="sheep" xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 428.348 428.348">
                <path d="M124.926 315.896h21.807v40.332h-21.807z" fill="#5c6670" />
                <path d="M124.926 356.228h21.807v8.666h-21.807z" fill="#2d3740" />
                <path
                  class="sheep-body"
                  d="M104.387 258.125c0-17.365 14.078-31.441 31.443-31.441s31.441 14.076 31.441 31.441v37.232c0 17.365-14.076 31.441-31.441 31.441s-31.443-14.076-31.443-31.441v-37.232z"
                />
                <path d="M280.49 315.896h21.807v40.332H280.49z" fill="#5c6670" />
                <path d="M280.49 356.228h21.807v8.666H280.49z" fill="#2d3740" />
                <path
                  class="sheep-body"
                  d="M259.951 258.125c0-17.365 14.078-31.441 31.443-31.441s31.441 14.076 31.441 31.441v37.232c0 17.365-14.076 31.441-31.441 31.441s-31.443-14.076-31.443-31.441v-37.232z"
                />
                <path d="M85.367 315.896h21.807v40.332H85.367z" fill="#7d868c" />
                <path d="M85.367 356.228h21.807v8.666H85.367z" fill="#333e48" />
                <path
                  class="sheep-body"
                  d="M64.828 258.125c0-17.365 14.077-31.441 31.442-31.441s31.442 14.076 31.442 31.441v37.232c0 17.365-14.077 31.441-31.442 31.441s-31.442-14.076-31.442-31.441v-37.232z"
                />
                <path d="M240.932 315.896h21.807v40.332h-21.807z" fill="#7d868c" />
                <path d="M240.932 356.228h21.807v8.666h-21.807z" fill="#333e48" />
                <path
                  class="sheep-body"
                  d="M220.393 258.125c0-17.365 14.077-31.441 31.442-31.441s31.442 14.076 31.442 31.441v37.232c0 17.365-14.077 31.441-31.442 31.441s-31.442-14.076-31.442-31.441v-37.232z"
                />
                <path
                  class="sheep-body"
                  d="M363.014 214.971c0-8.082-3.428-15.359-8.904-20.471-.824-36.938-20.643-69.186-50.075-87.369.206-1.367.313-2.766.313-4.191 0-15.463-12.536-28-28-28-2.433 0-4.793.313-7.043.895-5.129-5.787-12.615-9.439-20.957-9.439-8.904 0-16.832 4.16-21.96 10.639-8.49-8.395-20.157-13.58-33.04-13.58a46.777 46.777 0 0 0-27.523 8.912c-5.111-5.48-12.391-8.912-20.477-8.912-12.553 0-23.176 8.262-26.73 19.643a46.8 46.8 0 0 0-22.347-5.643c-17.181 0-32.202 9.221-40.398 22.983a17.065 17.065 0 0 0-9.128-2.646c-2.074 0-4.053.387-5.893 1.061-2.463-3.594-6.595-5.955-11.28-5.955a13.638 13.638 0 0 0-10.563 4.995 17.627 17.627 0 0 0-1.834-.101C7.689 97.791 0 105.48 0 114.965s7.689 17.174 17.174 17.174c2.561 0 4.979-.578 7.158-1.588a27.858 27.858 0 0 0-3.149 12.557c-10.39 8.621-17.009 21.629-17.009 36.185 0 12.426 4.832 23.719 12.707 32.123a46.843 46.843 0 0 0-3.707 18.326c0 24.064 18.092 43.893 41.412 46.658 18.527 16.152 42.749 25.938 69.259 25.938h.979c3.47 1.541 7.309 2.404 11.35 2.404s7.88-.863 11.35-2.404h8.961c9.014 8.406 21.104 13.559 34.4 13.559 13.299 0 25.387-5.152 34.401-13.559h23.411c16.447 0 32.014-3.768 45.887-10.484a47.218 47.218 0 0 0 10.242 1.133c25.957 0 47-21.043 47-47 0-2.77-.254-5.477-.713-8.113 7.196-5.067 11.901-13.435 11.901-22.903z"
                />
                <path
                  d="M386.346 92.971c23.197 0 42.002 18.805 42.002 42.004 0 23.195-18.805 42-42.002 42h-49.733c-23.196 0-42.001-18.805-42.001-42 0-23.199 18.805-42.004 42.001-42.004h49.733z"
                  fill="#5c6670"
                />
                <circle cx="367.015" cy="124.453" r="6.487" fill="#333e48" />
                <path
                  class="sheep-body"
                  d="M353.49 70.43a19.951 19.951 0 0 0-14.151 5.863c-5.103-6.869-13.276-11.322-22.491-11.322-15.464 0-28 12.537-28 28 0 .154.01.305.012.457-22.885 3.162-40.512 22.789-40.512 46.543 0 25.957 21.043 47 47 47 3.945 0 7.774-.492 11.436-1.408 3.217 6.748 10.08 11.424 18.053 11.424 11.053 0 20.012-8.961 20.012-20.012 0-6.365-2.982-12.025-7.615-15.689a46.773 46.773 0 0 0 5.115-21.314c0-9.412-2.777-18.17-7.542-25.521a28.102 28.102 0 0 0 6.625-8.066c3.357 2.543 7.525 4.07 12.06 4.07 11.052 0 20.012-8.961 20.012-20.012S364.542 70.43 353.49 70.43z"
                />
                <path d="m318.014 128.896 4.334 19.998a9.21 9.21 0 1 1-18 3.9 9.37 9.37 0 0 1 0-3.9l4.334-19.998a4.774 4.774 0 0 1 9.332 0z" fill="#5c6670" />
              </svg>
            );
          })}
          {setTree()}
          {setLake()}
        </slot>
      </Host>
    );
  }
}
