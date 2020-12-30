(() => {
   const canvas = document.querySelector('canvas');
   const ctx = canvas.getContext('2d');

   let w = canvas.width = window.innerWidth * 2
   let h = canvas.height = window.innerHeight * 2

   let particleArray = [];

   const dotColor = '#C8E0EE'

   let mouse = {
      x: null,
      y: null,
      radius: 150,
   }

   window.addEventListener('mousemove', function(event) {
      mouse.x = event.x;
      mouse.y = event.y;
   })

   ctx.fillStyle = dotColor;
   ctx.font = '700  20px "Arial Black"';
   ctx.fillText('HI!', 10, 20);

   const textCoordinates = ctx.getImageData(0, 0, 300, 300);

   class Particle {
      constructor(x, y) {
         this.x = x;
         this.y = y;
         this.size = 20;
         this.baseX = this.x;
         this.baseY = this.y;
         this.density = (Math.random() * 200) ;
      }

      draw() {
         ctx.strokeStyle = dotColor;
         ctx.lineWidth = 4;
         ctx.beginPath();
         ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
         ctx.closePath();
         ctx.stroke();
      }

      update() {
         let dx = mouse.x * 2 - this.x ;
         let dy = mouse.y * 2 - this.y ;
         let distance = Math.hypot(dx, dy);
         let forceDirectionX = dx / distance;
         let forceDirectionY = dy / distance;
         let maxDistance = mouse.radius;

         let force = (maxDistance - distance) / maxDistance;
         let directionX = force * forceDirectionX * this.density;
         let directionY = force * forceDirectionY * this.density;

         if(distance < mouse.radius) {
            this.x -= directionX * 4
            this.y -= directionY * 4
         } else {
            if (this.x !== this.baseX) {
               let dx = this.x - this.baseX;
               this.x -= dx/60;
            }

            if (this.y !== this.baseY) {
               let dy = this.y - this.baseY;
               this.y -= dy/60;
            }
         }
      }
   }

   function init() {
      particleArray = [];

      for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
         for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
               let positionX = x;
               let positionY = y ;
               particleArray.push(new Particle(positionX * 60, positionY * 60))
            }
         }
      }
   }
   init();


   function animate() {
      ctx.clearRect(0, 0, w, h);
      for(let i = 0; i < particleArray.length; i++) {
         particleArray[i].draw();
         particleArray[i].update();
      }
      requestAnimationFrame(animate)
   }
   animate()

})()
