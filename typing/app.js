(() => {
   let i = 0;
   let text = "Hello, sweetie!";
   const element = document.getElementById('text')
   const letterDelay = 80;

   function typing() {
      if (i < text.length) {
         element.textContent += text.charAt(i);
         i++;
         setTimeout(typing, letterDelay)
      }
   }
   typing();

   setInterval(() => {
      element.textContent = '';
      i = 0;

      typing();
   }, (text.length * letterDelay + 1000) )
})();
