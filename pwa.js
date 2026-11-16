'use strict';
if ('serviceWorker' in navigator && window.isSecureContext) {
    window.addEventListener('load', async () => {
        const estado = document.createElement('span');
        estado.className = 'dz-solo-lectores';
        estado.setAttribute('role','status');
        document.body.append(estado);
        try {
            const registro = await navigator.serviceWorker.register('./sw.js', {scope:'./'});
            let recargar = false;
            let boton;
            function actualizacion() {
                if (!registro.waiting || boton) return;
                boton = document.createElement('button');
                boton.type='button'; boton.className='dz-pwa-actualizar';
                boton.textContent='Actualizar aplicación';
                boton.addEventListener('click', () => {
                    if (!registro.waiting) return;
                    recargar=true;
                    registro.waiting.postMessage({type:'SKIP_WAITING'});
                });
                document.body.append(boton);
            }
            actualizacion();
            registro.addEventListener('updatefound', () => {
                const worker=registro.installing;
                if (!worker) return;
                worker.addEventListener('statechange', () => {
                    if(worker.state==='installed') {
                        estado.textContent='Archivos y 15 fotografías descargados para uso sin conexión.';
                        actualizacion();
                    }
                    if(worker.state==='redundant') estado.textContent='No se completó la actualización offline. Reintenta con conexión.';
                });
            });
            navigator.serviceWorker.addEventListener('controllerchange', () => { if(recargar) location.reload(); });
            navigator.serviceWorker.ready.then(() => { estado.textContent='Aplicación preparada para uso sin conexión.'; });
        } catch (error) {
            estado.textContent='No se pudo preparar el modo sin conexión.';
            console.warn(estado.textContent,error.message);
        }
    }, {once:true});
}
