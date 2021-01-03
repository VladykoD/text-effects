class Animation {
   constructor() {
      this.mainText = 'RAINBOW';
      this.textSliceWidth = 1;
      this.textSize = 260;
      this.textSpeed = -6;
      this.waveAmplitude = 10
      this.waveLength = 200;
      this.waveSpeed = -3;
      this.c = new Canvas();
      this.createTextData();
      this.setupProperties();
      this.createColorSet();
      this.replaceTextColor();
      this.animate()
   }
   setupProperties() {
      this.textSlicesCount = this.textArea.w / this.textSliceWidth;
      this.twoPI = Math.PI * 2;
      this.textY = this.c.h / 2 - this.textArea.h / 2;

      this.textX = 0;
   }
   createTextData() {
      this.textArea = this.c.drawText(this.mainText, this.textSize, 200, 300);
      this.textData = this.c.gid(this.textArea);
      this.c.clear();
   }

   createColorSet() {
      for (let i = 0; i < this.textArea.w; i++) {
         const currentColor = `hsl(${i / this.textArea.w * 360}, 100%, 50%)`
         this.c.rect(currentColor, i, 300, 1, 1);
      }
      this.colorSetData = this.c.gid({x: 0, y: 300, w: this.textArea.w, h: 1})
   }

   replaceTextColor() {
      const colorSetPixelData = this.colorSetData.data;
      const textPixelData = this.textData.data;

      for (let x = 0; x < this.textData.width; x++) {
         for (let y = 0; y < this.textData.height; y++) {
            const red = (x + y * this.textData.width) * 4;
            const green = red + 1;
            const blue = red + 2;
            const alpha = red + 3;

            if (textPixelData[alpha] > 0) {
               textPixelData[red] = colorSetPixelData[x * 4]
               textPixelData[green] = colorSetPixelData[x * 4 + 1]
               textPixelData[blue] = colorSetPixelData[x * 4 + 2]
            }
         }
      }
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
   animate() {
      this.c.clear();
      this.wave();

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
   drawText(t = 'hello', fs = 90, x = 0, y = 0) {
      this.ctx.font = `${fs}px Arial Black,  sans-serif`;
      this.ctx.fillStyle = 'white';
      this.ctx.textBaseline = 'top'
      this.ctx.fillText(t, x, y);

      const fw = this.ctx.measureText(t).width;
      return {x: x, y: y, w: fw, h: fs};
   }
   //get image data
   gid({x, y, w, h}) {
      return this.ctx.getImageData(x,y,w,h)
   }
   //put image data
   pid(d, x, y, dx, dy, dw, dh) {
      this.ctx.putImageData(d, x, y, dx, dy, dw, dh)
   }

   rect(c, x , y, w, h) {
      this.ctx.fillStyle = c;
      this.ctx.fillRect(x,y,w,h)
   }

   clear() {
      this.ctx.clearRect(0, 0, this.w, this.h)
   }
}
