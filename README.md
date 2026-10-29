# Ivifer Pita | Portafolio de ingeniería de datos

[![GitHub Pages](https://img.shields.io/badge/Sitio%20en%20vivo-GitHub%20Pages-100000?style=flat&logo=github&logoColor=white)](https://ivifer1.github.io)
[![three.js](https://img.shields.io/badge/three.js-r186-0B0E26?style=flat&logo=threedotjs&logoColor=white)](https://threejs.org)

> Portafolio de ingeniería de datos presentado como un recorrido espacial en 3D. Cada proyecto es un sistema construido con su estructura real: el esquema estrella de RetailPulse con sus tablas y filas, los flujos de Unified Data Hub y E-Commerce Data Pipeline, y las 26 tablas y relaciones de la base de datos del museo.

🔗 **Sitio en vivo:** [https://ivifer1.github.io](https://ivifer1.github.io)

## Estructura

```
index.html            Contenido de la página
css/style.css         Estilos, paleta y versión móvil
js/main.js            Arranque: activa la escena 3D si el navegador tiene WebGL
js/escena.js          Escena 3D: sistemas, cámara guiada por el scroll y etiquetas
js/vendor/three.min.js  three.js empaquetado (licencia MIT)
```

## Cómo verlo en local

Los módulos de JavaScript necesitan un servidor, no basta con abrir el archivo:

```bash
python3 -m http.server 8000
```

y abrir `http://localhost:8000`.

## Accesibilidad

- Todo el contenido está en el HTML. La escena 3D es decorativa y está oculta para lectores de pantalla.
- Si el sistema tiene activado "reducir movimiento", la escena se queda quieta y la cámara salta entre secciones sin animación.
- Sin WebGL la página se ve completa con un fondo estático.
