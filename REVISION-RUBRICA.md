# DeporZone: ajustes de rúbrica

Se conservan las 15 canchas, imágenes, precios, temas, filtros, reservas,
pago QR de demostración y minijuego.

Cambios:
- Validación reforzada de JSON: límites de registros y de longitud de textos.
- Carga con tiempo máximo y cancelación de solicitudes anteriores.
- Eventos jQuery con namespaces y .off().on(), con protección contra doble inicio.
- Limpieza de temporizadores y animaciones al salir, con reactivación del carrusel al volver.
- Precarga offline de las 15 fotos locales junto al catálogo y archivos de la app.
- Actualización de PWA mediante botón cuando hay una nueva versión disponible.
- Ajustes de botones de 44px, foco visible, truncado y viewport con teclado virtual.
- Desplazamiento interior en pantallas pequeñas para mantener accesibles los formularios.

Verificación realizada:
- Sintaxis de todos los archivos JavaScript.
- 15 canchas con identificadores únicos y fotografías existentes.
- Service Worker probado en simulación: precarga, respuesta del JSON sin red y navegación offline.

Pendiente:
No se pudo ejecutar un navegador en este entorno. Queda probar visualmente
360px, 390px, 768px, horizontal y teclado virtual en Chrome, Brave y Opera,
y comprobar instalación y modo avión en un dispositivo real.
Las fuentes, iconos, fondos externos y el QR de demostración usan servicios externos;
no se garantiza su disponibilidad offline si no fueron guardados antes en caché.
Las 15 fotos de canchas sí se incluyen en la precarga local.

Publicación:
Reemplazar el contenido de la carpeta DeporZone del repositorio con esta carpeta.
Abrir mediante GitHub Pages o Live Server, no con doble clic en index.html.
Esperar la descarga inicial antes de probar sin conexión; las fotos suman unos 45 MB.
La rúbrica también requiere revisar el enlace público del proyecto personal.
