/* =========================================================
   Escena 3D del portafolio
   Cada proyecto es un "sistema" construido con su estructura real:
   - RetailPulse: el esquema estrella (tablas y filas reales)
   - Unified Data Hub: tres fuentes que convergen en un tablero
   - E-Commerce: el pipeline ETL con Airflow orbitando alrededor
   - Museos: las 26 tablas y sus relaciones, sacadas del script SQL
   ========================================================= */
import * as THREE from 'three';

/* ---------- Colores (los mismos de css/style.css) ---------- */
const C = {
    flujo: new THREE.Color('#3CCFB8'),
    estrella: new THREE.Color('#F2B84B'),
    hecho: new THREE.Color('#FFD98A'),
    fuente: new THREE.Color('#C9CCF2'),
    tablero: new THREE.Color('#EEF0FF'),
    polvo: new THREE.Color('#A3A8D1'),
    nebulosa: new THREE.Color('#6B5BD6'),
};

const v = (x, y, z) => new THREE.Vector3(x, y, z);
const filas = (n) => `${n.toLocaleString('es-ES').replace(/,/g, '.')} filas`;

/* ---------- Layout de la base de datos del museo ----------
   Calculado a partir de las llaves foráneas de Script.sql */
const MUSEO = {"t":["obra","empleado_mantenimiento","idioma","lugar_geografico","museo","estructura_fisica","estructura_organizacional","empleado_profesional","titulo_formacion","coleccion","sala_exp","evento","ticket_de_entrada","tipo_ticket","horario","hecho_historico","artista","asignacion_mensual","historico_cierre_temp","sala_col","autor","idioma_hablado","historico_empleado","hist_obra_movimiento","actividad_conservacion","hist_conservacion"],"p":[[3.33,1.78,0.46],[-4.47,5.01,0.94],[1.59,-6.0,-2.49],[0.4,0.07,3.06],[-1.45,-0.86,1.19],[-1.62,2.01,0.32],[-1.31,-0.65,-1.39],[1.14,-1.83,-0.83],[2.62,-3.05,0.43],[-0.11,0.82,-2.68],[0.14,2.9,-1.31],[-3.81,-0.69,0.66],[-2.39,0.32,3.04],[-0.75,-2.54,2.74],[-2.6,-2.95,0.73],[-3.02,-1.85,2.87],[2.23,1.06,3.8],[-3.14,3.68,0.69],[0.62,4.99,-1.52],[-0.33,2.67,-3.33],[3.64,1.89,2.57],[1.44,-4.2,-1.74],[-0.51,-2.21,-2.23],[1.76,0.89,-1.33],[3.51,0.27,-2.53],[3.09,-1.54,-2.13]],"e":[[24,23],[16,3],[17,1],[17,5],[20,16],[20,0],[9,6],[7,4],[5,4],[6,4],[11,4],[15,4],[25,24],[25,7],[23,9],[23,7],[23,0],[23,10],[18,10],[22,7],[22,6],[14,4],[21,7],[21,2],[4,3],[19,9],[19,10],[10,5],[12,4],[13,4],[8,7]],"deg":[2,1,1,2,9,3,3,6,1,3,4,1,1,1,1,1,2,2,1,2,2,2,2,5,2,2],"auto":[3,5]};

/* ---------- Definición de los sistemas ---------- */
function definirSistemas() {
    const tam = (n) => 0.55 + 0.2 * Math.log10(n);   // tamaño según las filas

    const retail = {
        id: 'retail',
        nombre: 'RetailPulse',
        centro: v(0, 0, 0),
        nodos: [
            { id: 'fact', etiqueta: 'fact_sales', sub: filas(500000), pos: v(0, 0, 0), tam: tam(500000) * 0.95, color: C.hecho, retraso: 0.05 },
            { id: 'date', etiqueta: 'dim_date', sub: filas(731), pos: v(0.2, 3.3, 0.4), tam: tam(731), color: C.estrella, retraso: 0.35 },
            { id: 'product', etiqueta: 'dim_product', sub: filas(1000), pos: v(-3.4, 1.1, -0.9), tam: tam(1000), color: C.estrella, retraso: 0.45 },
            { id: 'customer', etiqueta: 'dim_customer', sub: filas(10000), pos: v(3.3, 1.2, 0.7), tam: tam(10000), color: C.estrella, retraso: 0.55 },
            { id: 'store', etiqueta: 'dim_store', sub: filas(50), pos: v(-2.2, -2.7, 1.0), tam: tam(50), color: C.estrella, retraso: 0.65 },
            { id: 'promotion', etiqueta: 'dim_promotion', sub: filas(20), pos: v(2.4, -2.6, -1.0), tam: tam(20), color: C.estrella, retraso: 0.75 },
        ],
        // Los datos de cada dimensión viajan hacia la tabla de hechos
        aristas: [
            ['date', 'fact'], ['product', 'fact'], ['customer', 'fact'], ['store', 'fact'], ['promotion', 'fact'],
        ],
        particulasPorArista: 7,
        colorArista: C.flujo,
    };

    const unified = {
        id: 'unified',
        nombre: 'Unified Data Hub',
        centro: v(36, 6, -28),
        nodos: [
            { id: 'fake', etiqueta: 'Fake Store API', pos: v(-5.2, 2.8, -0.6), tam: 0.85, color: C.fuente },
            { id: 'airtable', etiqueta: 'Airtable', pos: v(-5.6, 0, 1.2), tam: 0.85, color: C.fuente },
            { id: 'notion', etiqueta: 'Notion CRM', pos: v(-5.0, -2.8, -0.2), tam: 0.85, color: C.fuente },
            { id: 'n8n', etiqueta: 'n8n', sub: 'ingesta', pos: v(-2.2, 0, 0), tam: 1.1, color: C.flujo },
            { id: 'crudo', etiqueta: 'PostgreSQL', sub: 'tablas crudas', pos: v(0.4, 0.9, -0.8), tam: 1.15, color: C.estrella },
            { id: 'python', etiqueta: 'transform.py', sub: 'limpia y unifica', pos: v(2.2, -1.2, 0.4), tam: 0.9, color: C.flujo },
            { id: 'unificado', etiqueta: 'unified_data', sub: 'tabla unificada', pos: v(4.0, 0.8, 0), tam: 1.15, color: C.estrella },
            { id: 'streamlit', etiqueta: 'Streamlit', sub: 'tablero', pos: v(6.2, -0.3, 0.6), tam: 1.0, color: C.tablero },
        ],
        aristas: [
            ['fake', 'n8n'], ['airtable', 'n8n'], ['notion', 'n8n'], ['n8n', 'crudo'],
            ['crudo', 'python'], ['python', 'unificado'], ['unificado', 'streamlit'],
        ],
        particulasPorArista: 5,
        colorArista: C.flujo,
    };

    const ecommerce = {
        id: 'ecommerce',
        nombre: 'E-Commerce Data Pipeline',
        centro: v(-14, -8, -56),
        nodos: [
            { id: 'api', etiqueta: 'Fake Store API', pos: v(-6.0, -1.6, 0.8), tam: 0.9, color: C.fuente },
            { id: 'extract', etiqueta: 'extract', pos: v(-3.2, -0.2, -0.4), tam: 0.95, color: C.flujo },
            { id: 'transform', etiqueta: 'transform', pos: v(-0.4, 0.9, 0.4), tam: 0.95, color: C.flujo },
            { id: 'load', etiqueta: 'load', pos: v(2.4, 0.3, -0.5), tam: 0.95, color: C.flujo },
            { id: 'pg', etiqueta: 'PostgreSQL', sub: 'crudo y mart', pos: v(4.6, -1.2, 0.5), tam: 1.2, color: C.estrella },
            { id: 'metabase', etiqueta: 'Metabase', sub: 'tablero', pos: v(6.6, 0.4, -0.2), tam: 1.0, color: C.tablero },
        ],
        aristas: [
            ['api', 'extract'], ['extract', 'transform'], ['transform', 'load'], ['load', 'pg'], ['pg', 'metabase'],
        ],
        particulasPorArista: 6,
        colorArista: C.flujo,
        // Airflow orbita alrededor de las tres tareas que orquesta
        anillo: { centro: v(-0.4, 0.3, 0), rx: 4.6, ry: 2.2, inclinacion: 0.35, etiqueta: 'Airflow', sub: 'DAG programado' },
    };

    const escala = 0.85;
    const museo = {
        id: 'museo',
        nombre: 'Sistema de museos',
        centro: v(30, -5, -86),
        nodos: MUSEO.t.map((t, i) => ({
            id: t,
            etiqueta: t,
            sub: `${MUSEO.deg[i] + (MUSEO.auto.includes(i) ? 1 : 0)} ${MUSEO.deg[i] === 1 ? 'relación' : 'relaciones'}`,
            pos: v(...MUSEO.p[i]).multiplyScalar(escala),
            tam: 0.55 + 0.11 * MUSEO.deg[i],
            color: MUSEO.deg[i] >= 4 ? C.estrella : C.polvo.clone().multiplyScalar(0.75),
            clave: MUSEO.deg[i] >= 4,
        })),
        aristas: [
            ...MUSEO.e.map(([a, b]) => [MUSEO.t[a], MUSEO.t[b]]),
            // Las dos tablas que se referencian a sí mismas
            ...MUSEO.auto.map((i) => [MUSEO.t[i], MUSEO.t[i]]),
        ],
        particulasPorArista: 2,
        colorArista: C.nebulosa,
    };

    return { retail, unified, ecommerce, museo };
}

/* ---------- Puntos de cámara de cada sección ----------
   az/el en radianes, desplazamiento = cuánto se corre la escena
   hacia la derecha para dejar espacio al texto */
function definirCamaras(S) {
    // Punto medio de los cuatro sistemas, para las tomas abiertas
    const medio = Object.values(S).reduce((acc, sis) => acc.add(sis.centro), v(0, 0, 0)).multiplyScalar(0.25);
    return {
        'inicio':          { objetivo: S.retail.centro, dist: 13.5, az: 0.42, el: 0.14, etiquetas: { retail: 'cursor' } },
        'sobre-mi':        { objetivo: S.retail.centro, dist: 19, az: -0.55, el: 0.42, etiquetas: {} },
        'retailpulse':     { objetivo: S.retail.centro, dist: 11.8, az: 0.12, el: 0.06, etiquetas: { retail: 'todas' } },
        'unified':         { objetivo: S.unified.centro.clone().add(v(0.8, 0, 0)), dist: 20, az: 0.16, el: 0.12, etiquetas: { unified: 'todas' } },
        'ecommerce':       { objetivo: S.ecommerce.centro, dist: 19, az: 0.1, el: 0.42, etiquetas: { ecommerce: 'todas' } },
        'museo':           { objetivo: S.museo.centro, dist: 13, az: 0.35, el: 0.22, etiquetas: { museo: 'claves' } },
        'certificaciones': { objetivo: medio, dist: 82, az: 0.0, el: 0.5, etiquetas: { sistemas: true } },
        'contacto':        { objetivo: medio.clone().add(v(-2, -4, 6)), dist: 100, az: -0.3, el: 0.58, etiquetas: { sistemas: true } },
    };
}

/* ---------- Shaders ---------- */
const vertexPunto = /* glsl */`
    attribute float aTam;
    attribute float aRetraso;
    attribute float aIndice;
    attribute vec3 aColor;
    attribute float aSistema;
    uniform float uEscala;
    uniform float uIntro;
    uniform float uTiempo;
    uniform float uMovimiento;
    uniform float uFoco;
    uniform float uAtenuacion[4];
    varying vec3 vColor;
    varying float vAlfa;
    void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float aparece = smoothstep(aRetraso, aRetraso + 0.4, uIntro);
        float titila = 1.0 + uMovimiento * 0.07 * sin(uTiempo * 1.6 + aIndice * 2.37);
        float foco = 1.0 + 0.55 * (1.0 - step(0.5, abs(aIndice - uFoco)));
        float d = -mv.z;
        gl_PointSize = aTam * uEscala * aparece * titila * foco / d;
        vAlfa = aparece * uAtenuacion[int(aSistema + 0.5)];
        vColor = aColor;
        gl_Position = projectionMatrix * mv;
    }
`;

const fragmentPunto = /* glsl */`
    varying vec3 vColor;
    varying float vAlfa;
    void main() {
        vec2 c = gl_PointCoord - 0.5;
        float r = length(c) * 2.0;
        float nucleo = smoothstep(0.24, 0.0, r);
        float halo = exp(-r * r * 6.0) * 0.6;
        float a = (nucleo + halo) * vAlfa;
        if (a < 0.004) discard;
        gl_FragColor = vec4(vColor * (halo * 1.4 + nucleo * 0.6) + vec3(nucleo * 0.55), a);
    }
`;

const vertexEstrellas = /* glsl */`
    attribute float aTam;
    attribute float aFase;
    attribute vec3 aColor;
    uniform float uEscala;
    uniform float uTiempo;
    uniform float uMovimiento;
    uniform float uIntro;
    varying vec3 vColor;
    varying float vAlfa;
    void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float titila = 0.75 + 0.25 * sin(uTiempo * (0.6 + aFase) + aFase * 40.0) * uMovimiento;
        gl_PointSize = max(aTam * uEscala / -mv.z, 1.2);
        vAlfa = titila * smoothstep(0.0, 0.8, uIntro);
        vColor = aColor;
        gl_Position = projectionMatrix * mv;
    }
`;

const fragmentEstrellas = /* glsl */`
    varying vec3 vColor;
    varying float vAlfa;
    void main() {
        float r = length(gl_PointCoord - 0.5) * 2.0;
        float a = smoothstep(1.0, 0.0, r);
        a *= a * vAlfa;
        if (a < 0.01) discard;
        gl_FragColor = vec4(vColor, a);
    }
`;

/* ---------- Curvas por donde viajan los datos ---------- */
function curvaEntre(a, b, elevacion) {
    if (a.equals(b)) {
        // Relación de una tabla consigo misma: un pequeño lazo
        const centro = a.clone().add(v(0.3, 0.3, 0));
        return (t, salida) => salida.set(
            centro.x + Math.cos(t * Math.PI * 2 + Math.PI * 1.25) * 0.42,
            centro.y + Math.sin(t * Math.PI * 2 + Math.PI * 1.25) * 0.42,
            centro.z,
        );
    }
    const medio = a.clone().lerp(b, 0.5);
    const dir = b.clone().sub(a);
    const lado = new THREE.Vector3(0, 1, 0).cross(dir).normalize();
    if (lado.lengthSq() < 0.01) lado.set(1, 0, 0);
    const control = medio.add(lado.multiplyScalar(dir.length() * elevacion)).add(v(0, dir.length() * 0.06, 0));
    const curva = new THREE.QuadraticBezierCurve3(a.clone(), control, b.clone());
    return (t, salida) => curva.getPoint(t, salida);
}

function curvaAnillo(centro, rx, ry, inclinacion) {
    const rot = new THREE.Euler(inclinacion, 0, 0.12);
    const q = new THREE.Quaternion().setFromEuler(rot);
    return (t, salida) => {
        const ang = t * Math.PI * 2;
        return salida.set(Math.cos(ang) * rx, Math.sin(ang) * ry * 0.5, Math.sin(ang) * ry).applyQuaternion(q).add(centro);
    };
}

/* =========================================================
   Arranque
   ========================================================= */
export function iniciarEscena({ canvas, capaEtiquetas }) {
    const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)');
    const conCursor = window.matchMedia('(hover: hover) and (pointer: fine)');
    const esAngosta = () => window.innerWidth <= 820;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, esAngosta() ? 1.5 : 1.75));

    const escena = new THREE.Scene();
    const camara = new THREE.PerspectiveCamera(50, 1, 0.1, 900);

    const S = definirSistemas();
    const sistemas = Object.values(S);
    const camaras = definirCamaras(S);

    const uniformes = {
        uEscala: { value: 1 },
        uIntro: { value: 0 },
        uTiempo: { value: 0 },
        uMovimiento: { value: movimientoReducido.matches ? 0 : 1 },
        uFoco: { value: -1 },
        uAtenuacion: { value: [1, 1, 1, 1] },
    };

    /* ----- Nodos (las estrellas de cada sistema) ----- */
    const nodos = [];
    sistemas.forEach((sis, i) => { sis.orden = i; });
    sistemas.forEach((sis) => {
        sis.nodos.forEach((n) => {
            n.sistema = sis.id;
            n.mundo = n.pos.clone().add(sis.centro);
            n.indice = nodos.length;
            n.retraso = n.retraso ?? 0.5 + Math.random() * 0.5;
            nodos.push(n);
        });
        if (sis.anillo) {
            const a = sis.anillo;
            a.curva = curvaAnillo(a.centro.clone().add(sis.centro), a.rx, a.ry, a.inclinacion);
            a.mundo = a.curva(0.25, new THREE.Vector3());
        }
    });

    {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(nodos.flatMap((n) => n.mundo.toArray()), 3));
        g.setAttribute('aColor', new THREE.Float32BufferAttribute(nodos.flatMap((n) => n.color.toArray()), 3));
        g.setAttribute('aTam', new THREE.Float32BufferAttribute(nodos.map((n) => n.tam * 2.4), 1));
        g.setAttribute('aRetraso', new THREE.Float32BufferAttribute(nodos.map((n) => n.retraso), 1));
        g.setAttribute('aIndice', new THREE.Float32BufferAttribute(nodos.map((n) => n.indice), 1));
        g.setAttribute('aSistema', new THREE.Float32BufferAttribute(nodos.map((n) => S[n.sistema].orden), 1));
        const m = new THREE.ShaderMaterial({
            uniforms: uniformes, vertexShader: vertexPunto, fragmentShader: fragmentPunto,
            transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        });
        escena.add(new THREE.Points(g, m));
    }

    /* ----- Aristas y partículas de datos ----- */
    const caminos = [];   // { curva, color, particulas }
    sistemas.forEach((sis) => {
        const porId = Object.fromEntries(sis.nodos.map((n) => [n.id, n]));
        sis.aristas.forEach(([a, b]) => {
            caminos.push({
                curva: curvaEntre(porId[a].mundo, porId[b].mundo, sis.id === 'museo' ? 0.08 : 0.16),
                color: sis.colorArista,
                cantidad: sis.particulasPorArista,
                velocidad: sis.id === 'museo' ? 0.06 : 0.14,
                opacidad: sis.id === 'museo' ? 0.4 : 0.55,
                sistema: sis,
            });
        });
        if (sis.anillo) {
            caminos.push({ curva: sis.anillo.curva, color: C.polvo, cantidad: 4, velocidad: 0.05, opacidad: 0.5, sistema: sis });
        }
    });

    // Un juego de líneas por sistema, para poder atenuar los que están lejos
    sistemas.forEach((sis) => {
        sis.lineas = new THREE.LineBasicMaterial({
            vertexColors: true, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
        });
        const pos = [];
        const col = [];
        const p = new THREE.Vector3();
        const q = new THREE.Vector3();
        const pasos = 28;
        caminos.filter((c) => c.sistema === sis).forEach((c) => {
            const color = c.color.clone().multiplyScalar(c.opacidad);
            for (let i = 0; i < pasos; i++) {
                c.curva(i / pasos, p);
                c.curva((i + 1) / pasos, q);
                pos.push(...p.toArray(), ...q.toArray());
                col.push(...color.toArray(), ...color.toArray());
            }
        });
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
        escena.add(new THREE.LineSegments(g, sis.lineas));
    });

    const particulas = [];
    caminos.forEach((c) => {
        for (let i = 0; i < c.cantidad; i++) {
            particulas.push({ camino: c, fase: i / c.cantidad + Math.random() * 0.08, velocidad: c.velocidad * (0.85 + Math.random() * 0.3) });
        }
    });
    const geoParticulas = new THREE.BufferGeometry();
    const posParticulas = new Float32Array(particulas.length * 3);
    const tamParticulas = new Float32Array(particulas.length);
    geoParticulas.setAttribute('position', new THREE.BufferAttribute(posParticulas, 3));
    geoParticulas.setAttribute('aTam', new THREE.BufferAttribute(tamParticulas, 1));
    geoParticulas.setAttribute('aColor', new THREE.Float32BufferAttribute(particulas.flatMap((p) => p.camino.color.toArray()), 3));
    geoParticulas.setAttribute('aRetraso', new THREE.Float32BufferAttribute(particulas.map(() => 1.0), 1));
    geoParticulas.setAttribute('aIndice', new THREE.Float32BufferAttribute(particulas.map(() => -10), 1));
    geoParticulas.setAttribute('aSistema', new THREE.Float32BufferAttribute(particulas.map((p) => p.camino.sistema.orden), 1));
    escena.add(new THREE.Points(geoParticulas, new THREE.ShaderMaterial({
        uniforms: uniformes, vertexShader: vertexPunto, fragmentShader: fragmentPunto,
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    })));

    /* ----- Fondo de estrellas y polvo alrededor de cada sistema ----- */
    {
        const total = esAngosta() ? 900 : 1900;
        const pos = [];
        const col = [];
        const tam = [];
        const fase = [];
        const centroFondo = v(12, 0, -44);
        const tonos = [C.tablero, C.tablero, C.fuente, C.fuente, C.estrella];
        for (let i = 0; i < total; i++) {
            const dir = v(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
            const r = 110 + Math.random() * 220;
            pos.push(...dir.multiplyScalar(r).add(centroFondo).toArray());
            col.push(...tonos[Math.floor(Math.random() * tonos.length)].toArray());
            tam.push(0.6 + Math.random() * 1.8);
            fase.push(Math.random());
        }
        sistemas.forEach((sis) => {
            for (let i = 0; i < 90; i++) {
                const p = v(gauss(), gauss() * 0.7, gauss()).multiplyScalar(4.2).add(sis.centro);
                pos.push(...p.toArray());
                col.push(...(Math.random() < 0.5 ? C.nebulosa : C.polvo).toArray());
                tam.push(0.04 + Math.random() * 0.06);
                fase.push(Math.random());
            }
        });
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        g.setAttribute('aColor', new THREE.Float32BufferAttribute(col, 3));
        g.setAttribute('aTam', new THREE.Float32BufferAttribute(tam, 1));
        g.setAttribute('aFase', new THREE.Float32BufferAttribute(fase, 1));
        escena.add(new THREE.Points(g, new THREE.ShaderMaterial({
            uniforms: uniformes, vertexShader: vertexEstrellas, fragmentShader: fragmentEstrellas,
            transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        })));
    }

    /* ----- Etiquetas en HTML (texto nítido sobre la escena) ----- */
    const etiquetas = [];
    function crearEtiqueta(texto, sub, mundo, extra) {
        const el = document.createElement('div');
        el.className = 'etiqueta' + (extra.clase ? ` ${extra.clase}` : '');
        el.textContent = texto;
        if (sub) {
            const s = document.createElement('small');
            s.textContent = sub;
            el.appendChild(s);
        }
        capaEtiquetas.appendChild(el);
        const e = { el, mundo, opacidad: 0, visible: false, x: -1, y: -1, ...extra };
        etiquetas.push(e);
        return e;
    }
    nodos.forEach((n) => {
        n.etiquetaEl = crearEtiqueta(n.etiqueta, n.sub, n.mundo, { tipo: 'nodo', sistema: n.sistema, clave: !!n.clave, nodo: n, dx: 14, dy: -9 });
    });
    sistemas.forEach((sis) => {
        if (sis.anillo) {
            crearEtiqueta(sis.anillo.etiqueta, sis.anillo.sub, sis.anillo.mundo, { tipo: 'nodo', sistema: sis.id, clave: true, dx: 10, dy: -9 });
        }
        crearEtiqueta(sis.nombre, null, sis.centro.clone().add(v(0, 6.5, 0)), { tipo: 'sistema', clase: 'sistema', dx: 0, dy: 0, centrada: true });
    });

    /* ----- Lectura del scroll ----- */
    const secciones = [...document.querySelectorAll('[data-camara]')];
    let anclas = [];
    function medirAnclas() {
        anclas = secciones.map((el) => {
            const r = el.getBoundingClientRect();
            return { y: r.top + window.scrollY + r.height / 2 - window.innerHeight / 2, cam: camaras[el.dataset.camara] };
        });
    }

    const suave = (a, b, t) => {
        const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
        return x * x * (3 - 2 * x);
    };

    function tramoActual() {
        const y = window.scrollY;
        if (y <= anclas[0].y) return { A: anclas[0].cam, B: anclas[0].cam, t: 0 };
        for (let i = 0; i < anclas.length - 1; i++) {
            if (y < anclas[i + 1].y) {
                let t = (y - anclas[i].y) / (anclas[i + 1].y - anclas[i].y);
                t = movimientoReducido.matches ? Math.round(t) : suave(0.12, 0.88, t);
                return { A: anclas[i].cam, B: anclas[i + 1].cam, t };
            }
        }
        const ult = anclas[anclas.length - 1].cam;
        return { A: ult, B: ult, t: 0 };
    }

    /* ----- Estado de la cámara (se suaviza hacia el objetivo) ----- */
    const estado = { objetivo: v(0, 0, 0), dist: 13.5, az: 0.42, el: 0.14 };
    const deseado = { objetivo: v(0, 0, 0), dist: 0, az: 0, el: 0 };
    const cursor = { x: 0, y: 0, sx: 0, sy: 0, px: null, py: null };

    window.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        cursor.x = (e.clientX / window.innerWidth) * 2 - 1;
        cursor.y = (e.clientY / window.innerHeight) * 2 - 1;
        cursor.px = e.clientX;
        cursor.py = e.clientY;
    }, { passive: true });
    document.addEventListener('pointerleave', () => { cursor.px = null; });

    function ajustarTamano() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setSize(w, h, false);
        camara.aspect = w / h;
        camara.fov = esAngosta() ? 62 : 50;
        // Desplaza la escena: a la derecha en escritorio, hacia arriba en móvil
        if (esAngosta()) camara.setViewOffset(w, h, 0, h * 0.2, w, h);
        else camara.setViewOffset(w, h, -w * 0.2, 0, w, h);
        camara.updateProjectionMatrix();
        uniformes.uEscala.value = (renderer.domElement.height / 2) / Math.tan(THREE.MathUtils.degToRad(camara.fov / 2));
        medirAnclas();
    }
    ajustarTamano();
    window.addEventListener('resize', ajustarTamano);
    // Con las fuentes cargadas cambian los altos de las secciones y el ancho de las etiquetas
    document.fonts?.ready.then(() => {
        medirAnclas();
        etiquetas.forEach((e) => { e.ancho = 0; });
    });
    // Las secciones pueden cambiar de alto cuando cargan las fuentes o al rotar
    new ResizeObserver(medirAnclas).observe(document.body);

    {
        const { A } = tramoActual();
        estado.objetivo.copy(A.objetivo);
        estado.dist = A.dist;
        estado.az = A.az;
        estado.el = A.el;
    }

    /* ----- Visibilidad de etiquetas ----- */
    function visibilidad(e, cam, foco) {
        if (!cam) return 0;
        if (e.tipo === 'sistema') return cam.etiquetas.sistemas ? 1 : 0;
        const modo = cam.etiquetas[e.sistema];
        if (modo === 'todas') return 1;
        if (modo === 'claves') return e.clave || e === foco ? 1 : 0;
        if (modo === 'cursor') return e === foco ? 1 : 0;
        return 0;
    }

    /* ----- Bucle principal ----- */
    let ultimo = performance.now();
    const proyectado = new THREE.Vector3();
    const tmp = new THREE.Vector3();
    let intro = movimientoReducido.matches ? 2 : 0;
    let tiempo = 0;
    let focoActual = null;

    function cuadro() {
        const ahora = performance.now();
        const dt = Math.min((ahora - ultimo) / 1000, 0.05);
        ultimo = ahora;
        const reducido = movimientoReducido.matches;
        uniformes.uMovimiento.value = reducido ? 0 : 1;
        if (!reducido) tiempo += dt;
        intro = reducido ? 2 : Math.min(2, intro + dt * 0.8);
        uniformes.uTiempo.value = tiempo;
        uniformes.uIntro.value = intro;


        // Cámara: mezcla de las dos secciones entre las que estamos
        const { A, B, t } = tramoActual();
        deseado.objetivo.copy(A.objetivo).lerp(B.objetivo, t);
        deseado.dist = THREE.MathUtils.lerp(A.dist, B.dist, t);
        deseado.az = THREE.MathUtils.lerp(A.az, B.az, t);
        deseado.el = THREE.MathUtils.lerp(A.el, B.el, t);

        const k = reducido ? 1 : 1 - Math.exp(-dt * 3.2);
        estado.objetivo.lerp(deseado.objetivo, k);
        estado.dist += (deseado.dist - estado.dist) * k;
        estado.az += (deseado.az - estado.az) * k;
        estado.el += (deseado.el - estado.el) * k;

        cursor.sx += (cursor.x - cursor.sx) * (reducido ? 1 : 1 - Math.exp(-dt * 2.5));
        cursor.sy += (cursor.y - cursor.sy) * (reducido ? 1 : 1 - Math.exp(-dt * 2.5));
        const deriva = reducido ? 0 : Math.sin(tiempo * 0.07) * 0.12;
        const az = estado.az + deriva + (reducido ? 0 : cursor.sx * 0.1);
        const el = estado.el + (reducido ? 0 : -cursor.sy * 0.06);
        camara.position.set(
            Math.sin(az) * Math.cos(el),
            Math.sin(el),
            Math.cos(az) * Math.cos(el),
        ).multiplyScalar(estado.dist).add(estado.objetivo);
        camara.lookAt(estado.objetivo);
        camara.updateMatrixWorld();

        // Los sistemas lejanos se apagan para no estorbar al que se está viendo
        sistemas.forEach((sis) => {
            const cercania = THREE.MathUtils.clamp(2.1 - camara.position.distanceTo(sis.centro) / estado.dist, 0.06, 1);
            uniformes.uAtenuacion.value[sis.orden] = cercania;
            sis.lineas.opacity = suave(0.7, 1.5, intro) * 0.9 * cercania;
        });

        // Partículas de datos viajando por sus caminos
        particulas.forEach((p, i) => {
            const u = (p.fase + tiempo * p.velocidad) % 1;
            p.camino.curva(u, tmp);
            posParticulas[i * 3] = tmp.x;
            posParticulas[i * 3 + 1] = tmp.y;
            posParticulas[i * 3 + 2] = tmp.z;
            tamParticulas[i] = 0.62 * Math.sin(Math.PI * u) * suave(1.0, 1.6, intro);
        });
        geoParticulas.attributes.position.needsUpdate = true;
        geoParticulas.attributes.aTam.needsUpdate = true;

        // Qué estrella está bajo el cursor (solo en el sistema que se está viendo)
        const dominante = t < 0.5 ? A : B;
        const w = window.innerWidth;
        const h = window.innerHeight;
        let foco = null;
        if (cursor.px !== null && conCursor.matches) {
            let mejor = 30 * 30;
            nodos.forEach((n) => {
                if (!dominante.etiquetas[n.sistema]) return;
                proyectado.copy(n.mundo).project(camara);
                if (proyectado.z > 1) return;
                const x = (proyectado.x + 1) / 2 * w;
                const y = (1 - proyectado.y) / 2 * h;
                const d = (x - cursor.px) ** 2 + (y - cursor.py) ** 2;
                if (d < mejor) { mejor = d; foco = n.etiquetaEl; }
            });
        }
        if (foco !== focoActual) {
            focoActual?.el.classList.remove('foco');
            foco?.el.classList.add('foco');
            focoActual = foco;
            uniformes.uFoco.value = foco ? foco.nodo.indice : -1;
        }

        // Etiquetas
        const angosta = esAngosta();
        etiquetas.forEach((e) => {
            const objetivoOpacidad = (1 - t) * visibilidad(e, A, foco) + t * visibilidad(e, B, foco);
            proyectado.copy(e.mundo).project(camara);
            // En pantallas angostas el texto ocupa casi todo: las etiquetas solo estorbarían
            let op = angosta ? 0 : objetivoOpacidad * suave(1.0, 1.6, intro);
            if (proyectado.z > 1) op = 0;
            if (op > 0.01) {
                let dx = e.dx;
                if (e.nodo) {
                    const d = camara.position.distanceTo(e.mundo);
                    const radio = (e.nodo.tam * 2.4 * uniformes.uEscala.value / d) / renderer.getPixelRatio() * 0.16;
                    dx = Math.max(e.dx, radio + 6);
                }
                const x = Math.round((proyectado.x + 1) / 2 * w + dx);
                const y = Math.round((1 - proyectado.y) / 2 * h + e.dy);
                // Si la etiqueta se saldría de la pantalla, mejor no mostrarla cortada
                e.ancho ||= e.el.offsetWidth;
                const izquierda = e.centrada ? x - e.ancho / 2 : x;
                if (izquierda < 8 || izquierda + e.ancho > w - 8 || y < 70 || y > h - 30) op = 0;
                if (x !== e.x || y !== e.y) {
                    e.el.style.transform = e.centrada
                        ? `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%)`
                        : `translate3d(${x}px, ${y}px, 0)`;
                    e.x = x;
                    e.y = y;
                }
            }
            const redondeada = Math.round(op * 20) / 20;
            if (redondeada !== e.opacidad) {
                e.el.style.opacity = redondeada;
                e.opacidad = redondeada;
            }
        });

        renderer.render(escena, camara);
        requestAnimationFrame(cuadro);
    }
    requestAnimationFrame(cuadro);
}

function gauss() {
    // Distribución aproximadamente normal, para el polvo de cada sistema
    return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
}
