import {Text} from './text.js'

class App {
   constructor() {
      this.setWebgl()

      WebFont.load({
         google: {
            families: ['Hind:700']
         },
         fontactive: () => {
            window.addEventListener('resize', this.resize.bind(this), false);
            this.resize();

            requestAnimationFrame(this.animate.bind(this))
         }
      });
   }

   setWebgl() {
      this.renderer = new PIXI.Renderer({
         width: document.body.clientWidth,
         height: document.body.clientHeight,
         antialias: true,
         transparent: false,
         resolution: (window.devicePixelRatio > 1) ? 2 : 1,
         autoDensity: true,
         powerPreference: 'high-performance',
         backgroundColor: 0xffffff,
      })
      document.body.appendChild(this.renderere.view)

      this.stage = new PIXI.Container()
   }

   resize() {
      this.stageWidth = document.body.clientWidth
      this.stageHeight = document.body.clientHeight

      this.renderer.resize(this.stageWidth, this.stageHeight)
   }

   animate(t) {
      requestAnimationFrame(this.animate.bind(this))
      this.renderer.render(this.stage)
   }
}

window.onload = () => {
   new App();
}
