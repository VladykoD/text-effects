class Animation {
   constructor() {
      this.mainText = 'sea';
      this.textSliceWidth = 1;
      this.textSize = 500;
      this.textSpeed = -6;
      this.waveAmplitude = 10
      this.waveLength = 200;
      this.waveSpeed = -2;
      this.c = new Canvas();
      this.loadImage('https://i.pinimg.com/originals/b7/ff/e5/b7ffe556b5c07784ab6ee8e58ee08881.jpg')
   }
   init() {
      this.createTextData();
      this.setupProperties();

      window.addEventListener('resize', () => {
         this.c.fitToScreen();
         this.createTextData();
         this.setupProperties();
      })
      this.animate()
   }
   setupProperties() {
      this.gradientLayer = this.c.createGradient();
      this.textSlicesCount = this.textArea.w / this.textSliceWidth;
      this.twoPI = Math.PI * 2;
      this.textY = this.c.h / 2 - this.textArea.h / 2;

      this.textX = 0;
   }
   createTextData() {
      this.textArea = this.c.drawText(this.mainText);
      this.textData = this.c.gid(this.textArea);
      this.c.clear();
   }

   loadImage(url) {
      this.imgLayer = new Image();
      this.imgLayer.src = url;
      this.imgLayer.onload = () => this.init()
   }

   wave() {
      const waveOffset = new Date().getMilliseconds() / 1000 * this.twoPI * this.waveSpeed;
      for (let i = 0; i < this.textSlicesCount; i++) {
         const xSlicePoint = i * this.textSliceWidth;
         const offsetY = Math.sin(waveOffset + xSlicePoint / this.waveLength * this.twoPI) * this.waveAmplitude;

         const y = this.textY + offsetY
         let x = this.textX;
         if (x + xSlicePoint > this.c.w) {
            x = x - this.c.w;
         }
         if (x + xSlicePoint < 0) {
            x = x + this.c.w;
         }

         this.c.pid(this.textData, x, y, xSlicePoint, 0, this.textSliceWidth, this.textArea.h)
      }

      this.textX = (this.textX + this.textSpeed) % this.c.w;
   }
   addImageLayer() {
      this.c.gco(`source-atop`);
      this.coverImage(this.imgLayer, 'cover')
      ///this.c.ctx.drawImage(this.imgLayer, 0, 0)
   }
   coverImage(img, type) {
      const imgRatio = img.height / img.width;
      const winRatio = this.c.h / this.c.w;
      if ((imgRatio < winRatio && type === 'contain') || (imgRatio > winRatio && type === 'cover')) {
         const h = this.c.w * imgRatio;
         this.c.ctx.drawImage(this.imgLayer, 0, (this.c.h - h) / 2, this.c.w, h);
      }
      if ((imgRatio > winRatio && type === 'contain') || (imgRatio < winRatio && type === 'cover')) {
         const w = this.c.w * winRatio / imgRatio
         this.c.ctx.drawImage(this.imgLayer, (this.c.w - w) / 2, 0, w, this.c.h);
      }
   }
   animate() {
      this.c.clear();
      this.wave();
      this.addImageLayer();
      requestAnimationFrame(() => this.animate());
   }
}
window.onload = () => {
   new Animation();
}


class Canvas {
   constructor() {
      this.createCanvas();
      this.fitToScreen();
   }
   createCanvas() {
      this.cnv = document.querySelector(`canvas`);
      this.ctx = this.cnv.getContext('2d');
   }

   fitToScreen() {
      this.w = this.cnv.width = innerWidth * 2;
      this.h = this.cnv.height = innerHeight * 2;
   }

   fitTextToCanvas(textWidth, textHeight) {
      return this.w / textWidth * textHeight;
   }

   drawText(t = 'hello') {
      this.ctx.font = `${this.h}px Arial Black,  sans-serif`;

      const newTextSize = this.fitTextToCanvas(this.ctx.measureText(t).width, this.h)
      this.ctx.font = `${newTextSize}px Arial Black,  sans-serif`;


      this.ctx.fillStyle = 'white';
      this.ctx.textBaseline = 'top'
      this.ctx.fillText(t, 0, 0);

      const fw = this.ctx.measureText(t).width;
      return {x: 0, y: 0, w: fw, h: newTextSize};
   }

   createGradient() {
      const gradient = this.ctx.createLinearGradient(0,0,this.w, this.h);
      for (let i = 0; i < 360; i++) {
         const p = i / 360;
         gradient.addColorStop(p, `hsl(${i}, 100%, 50%)`)
      }
      this.rect(gradient, 0, 0, this.w, this.h)
      const img = new Image();
      img.src = this.cnv.toDataURL();
      return img
   }

   //get image data
   gid({x, y, w, h}) {
      return this.ctx.getImageData(x,y,w,h)
   }
   //put image data
   pid(d, x, y, dx, dy, dw, dh) {
      this.ctx.putImageData(d, x, y, dx, dy, dw, dh)
   }
   //global composite operation
   gco(type) {
      this.ctx.globalCompositeOperation = type
   }

   rect(c, x , y, w, h) {
      this.ctx.fillStyle = c;
      this.ctx.fillRect(x,y,w,h)
   }

   clear() {
      this.ctx.clearRect(0, 0, this.w, this.h)
   }
}
