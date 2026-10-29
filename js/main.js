// Año del pie de página
document.getElementById('anio').textContent = new Date().getFullYear();

// La escena 3D es un adorno: si el navegador no tiene WebGL,
// la página se ve igual de completa con el fondo estático.
function hayWebGL() {
    try {
        const c = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch {
        return false;
    }
}

if (hayWebGL()) {
    import('./escena.js')
        .then(({ iniciarEscena }) => iniciarEscena({
            canvas: document.getElementById('espacio'),
            capaEtiquetas: document.getElementById('etiquetas'),
        }))
        .catch((error) => {
            console.error('No se pudo iniciar la escena 3D:', error);
            document.body.classList.add('sin-3d');
        });
} else {
    document.body.classList.add('sin-3d');
}
