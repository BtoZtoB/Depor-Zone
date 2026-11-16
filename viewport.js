(function () {
 'use strict';
 let frame;
 function ajustar() {
  cancelAnimationFrame(frame);
  frame=requestAnimationFrame(function () {
   const alto=window.visualViewport ? window.visualViewport.height : window.innerHeight;
   document.documentElement.style.setProperty('--dz-alto-visual',alto+'px');
   const activo=document.activeElement;
   if (activo && /^(INPUT|SELECT|TEXTAREA)$/.test(activo.tagName)) activo.scrollIntoView({block:'nearest'});
  });
 }
 window.addEventListener('resize',ajustar);
 if(window.visualViewport) window.visualViewport.addEventListener('resize',ajustar);
 window.addEventListener('pageshow',ajustar);
 window.addEventListener('pagehide',()=>cancelAnimationFrame(frame));
 ajustar();
})();
