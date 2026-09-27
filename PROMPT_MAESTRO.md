# Prompt maestro — Diplomacia Global (versión vigente)

> Este prompt describe **exactamente** la última versión publicada de la aplicación
> (repositorio `ehchavezm-hub/03-Diplomacia`, web `https://ehchavezm-hub.github.io/03-Diplomacia/`).
> Integra todas las correcciones y actualizaciones; no incluye versiones superadas.

---

## 1. Rol y objetivo

Actúa como **Desarrollador Full Stack Senior, Arquitecto de Software y Experto en UI/UX con
enfoque en accesibilidad (WCAG 2.1 AA)**.

Construye **Diplomacia Global**: una aplicación web **extremadamente fácil de usar**, pensada para
**adultos mayores y personas no vinculadas a la tecnología**, que funciona como buscador
centralizado de **noticias, papers académicos y libros sobre diplomacia, relaciones
internacionales y geopolítica**, **solo de fuentes de gran prestigio**, con una sección
**Nacional (Perú)** y otra **Internacional**.

Las personas usuarias **solo reciben un enlace**: no instalan ni configuran nada.

- Repositorio: `ehchavezm-hub/03-Diplomacia` (rama `main`). Todo el proyecto vive en la raíz.
- Enlace para compartir: `https://ehchavezm-hub.github.io/03-Diplomacia/`
  (también `…/03-Diplomacia/diplomacia/`, que redirige a la raíz).
- Idioma de la interfaz: **español**, tratamiento de **usted**, sin mensajes técnicos.

---

## 2. Arquitectura general

- **Frontend estático** (HTML5 + Tailwind CSS compilado + JavaScript vainilla en archivos
  separados con patrón UMD, sin frameworks). Se publica en **GitHub Pages** desde `public/`.
- **Datos precalculados** por **GitHub Actions cada 4 horas** (JSON en `public/datos/`).
- **Consultas en vivo desde el navegador** al buscar un tema (servicios con CORS abierto):
  GDELT (noticias), Crossref (papers) y Open Library (libros).
- **Servidor Node.js opcional** (sin dependencias, `npm start`) para uso local/desarrollo, con la
  misma lógica y una función extra: buscar dentro de libros propios.
- Los módulos de lógica (`motor-busqueda`, `fuentes-prestigio`, `crossref`, `gdelt`, `libros`,
  `temas`, `catalogo`) son **UMD**: los usa el navegador (`window.X`) y Node (`require`).

### Estructura de archivos

```
03-Diplomacia/
├── .github/workflows/publicar.yml   Publica public/ en Pages; actualiza datos cada 4 h
├── .gitignore                       node_modules/, biblioteca/* (salvo LEEME.md y libros.json)
├── README.md                        Instrucciones sencillas y documentación
├── PROMPT_MAESTRO.md                Este documento
├── package.json                     start, sin-internet, test, css, actualizar
├── tailwind.config.js               Colores y fuentes de la plantilla
├── estilos-fuente/tailwind.css      Entrada de Tailwind (@tailwind base/components/utilities)
├── servidor.js                      Servidor HTTP Node (opcional)
├── herramientas/actualizar-semana.js  Genera los JSON de datos (lo corre GitHub Actions)
├── servidor/
│   ├── config.js                    Puerto 3000, fuentes en vivo, espera 5 s, caché 15 min
│   ├── buscador.js                  Une fuentes, quita duplicados, marca ámbito, ordena por fecha
│   ├── semana.js                    Novedades de los últimos 7 días
│   ├── archivo.js                   Archivo acumulativo de noticias de 90 días
│   └── fuentes/
│       ├── catalogo-local.js        Catálogo + libros-recientes.json
│       ├── noticias-rss.js          RSS/Atom de medios y Google Noticias por sitio
│       ├── noticias-gdelt.js        Búsqueda GDELT
│       ├── crossref.js              Papers de revistas de prestigio
│       ├── libros-recientes.js      Google Books + Open Library (build) / Open Library (búsqueda)
│       ├── biblioteca-personal.js   Fragmentos de libros propios (.md/.txt)
│       └── utilidades.js            fetch con tiempo límite, caché
├── biblioteca/                      LEEME.md y libros.json (los libros no se versionan)
├── pruebas/pruebas.test.js          36 pruebas (node:test)
└── public/
    ├── index.html                   Página única con 4 pestañas
    ├── diplomacia/index.html        Redirección a ../
    ├── css/tailwind.css             Tailwind compilado (no requiere internet)
    ├── css/estilos.css              Estilos propios y escala tipográfica
    ├── img/icono.svg                Globo en Slate + arco Claret sobre FT Pink
    ├── datos/catalogo.js            Catálogo local
    ├── datos/ultima-semana.json     Novedades 7 días (generado)
    ├── datos/noticias-archivo.json  Archivo 90 días (generado)
    ├── datos/libros-recientes.json  Libros desde hace 3 años (generado)
    └── js/
        ├── fuentes-prestigio.js     Lista única de fuentes, dominios, revistas, editoriales
        ├── temas.js                 Temas sugeridos
        ├── crossref.js              URL/conversión Crossref + utilidades de texto
        ├── gdelt.js                 URL/conversión GDELT
        ├── libros.js                Google Books / Open Library
        ├── motor-busqueda.js        Búsqueda sin tildes, sinónimos, orden por fecha
        ├── servicio-datos.js        Modos servidor / web / archivo; búsqueda en dos pasos
        ├── interfaz.js              Tarjetas, secciones por ámbito, paginación, avisos
        ├── voz.js                   Búsqueda por voz
        └── app.js                   Une todo
```

Orden de carga de scripts en `index.html` (todos con `?v=__VERSION__`):
`datos/catalogo.js`, `js/fuentes-prestigio.js`, `js/crossref.js`, `js/gdelt.js`, `js/libros.js`,
`js/temas.js`, `js/motor-busqueda.js`, `js/servicio-datos.js`, `js/interfaz.js`, `js/voz.js`,
`js/app.js`. Antes de ellos: `<script>window.DG_VERSION = '__VERSION__';</script>`.

---

## 3. Diseño visual (plantilla «dip_ppt», estilo editorial Financial Times)

### Paleta (verificada con la fórmula de contraste WCAG 2.1)

| Uso | Color | Contraste |
|---|---|---|
| Fondo de página | FT Pink `#FFF1E5` | — |
| Texto principal | Slate Black `#33302E` | 11,8:1 |
| Cabecera y títulos H1 | FT Claret `#990F3D` (texto blanco encima 8,4:1) | 7,6:1 |
| Menú de pestañas | fondo Slate `#33302E`, texto blanco | 13,1:1 |
| Botón «Buscar», «Visitar enlace», enlaces | Oxford Blue `#0F5499`, texto blanco | 7,6:1 |
| Botón «Novedades de la semana» | Saffron `#F2AF26`, texto Slate, borde Slate | 6,8:1 |
| Fondos suaves / caja semanal | FT Pink Light `#F2E9DC`; bordes Pink Pale `#E2D7CA` | — |
| Texto secundario | Gray Dark `#66605A` (el Gray FT `#A8A49D` NO se usa: 2,2:1) | 5,6:1 |
| Descargas | FT Green oscurecido `#007A3D`, texto blanco | 5,5:1 |
| WhatsApp | `#075E54`, texto blanco | 7,7:1 |
| Papers | Purple Opinion `#593380` | 7,9:1 |
| Sección **Nacional (Perú)** | **Claret (rojo)** | — |
| Sección **Internacional** | **Oxford Blue (azul)** | — |
| Título «Agenda Contemporánea» | **Púrpura `#593380`** | 8,6:1 |
| Título «Agenda Clásica Vigente» | **Verde oscuro `#006432`** | 6,6:1 |
| Foco de teclado | contorno 4 px Oxford Blue (Saffron dentro de la cabecera) | 6,9:1 |

El rojo y el azul se reservan para Nacional/Internacional; las agendas temáticas usan púrpura y verde.

### Tipografía

- Texto: **Atkinson Hyperlegible Next** (Google Fonts, pesos 400/600/700; respaldo Verdana).
- Titulares: **Georgia** (serifa, estilo periódico; se ve en negrita porque no tiene seminegrita).
- Base del documento: 16 px (`html { font-size: calc(100% * var(--escala)) }`).
- Escala (clases propias en `estilos.css`):

| Elemento | Clase | Tamaño | Peso |
|---|---|---|---|
| Nombre «Diplomacia Global» | `t-marca` | 25 px | 700 |
| Encabezado H1 | `t-h1` | 23 px | 700 |
| Encabezado H2 y títulos de tarjeta | `t-h2` / `.titulo-tarjeta` | 19 px | 600 (Georgia: 700) |
| Botones, pestañas, filtros, temas | `t-boton` | 15 px | 600 |
| Texto de cuerpo y resúmenes | `t-cuerpo` | 16 px | 400 |
| Subtítulos, notas, fuente y fecha | `t-nota` | 14 px | 400 |

- Botones **A− / A+** cambian `--escala` entre 0,9 · 1 · 1,15 · 1,3 · 1,5 (se recuerda en
  `localStorage`, con try/catch).

### Accesibilidad obligatoria

- Contraste AA en todo el texto (mínimo 5:1 en la práctica).
- Controles de al menos 44 px de alto (botones ~46 px; temas 44 px en escritorio y 40 px en teléfono).
- Iconos SVG de línea **siempre acompañados de texto**; sin emojis de banderas (Windows no los muestra).
- Enlace «Saltar al contenido principal», `aria-live` en estados y avisos, `aria-current` en la
  pestaña activa, foco al título de sección al cambiar de pestaña, filtros como radios reales,
  `prefers-reduced-motion`, modo de alto contraste de Windows.
- Sin desplazamiento horizontal a 390 px de ancho.
- Todo texto externo se inserta con `textContent`, nunca con `innerHTML`.

---

## 4. Interfaz (página única `index.html`)

### Cabecera (fondo Claret)
Icono + «Diplomacia Global» (`t-marca`, Georgia) + subtítulo «Noticias, estudios y libros sobre las
relaciones entre países». A la derecha: «Tamaño del texto:» con **A−**, **A+** y **Ayuda** (abre
un `<dialog>` con 6 pasos de uso).

### Menú (fondo Slate), 4 pestañas grandes con icono y texto
**Buscar · Últimas Noticias · Papers Académicos · Libros Destacados** (2×2 en teléfono, 4 en fila en
escritorio). Navegación por `#hash`; la activa en FT Pink con texto Claret y barra inferior Claret.

### Sección «Buscar»
1. H1 «¿Qué desea encontrar?» + «Escriba un tema, un país o el nombre de un autor y pulse el botón **Buscar**.»
2. **Caja «¿Qué pasó esta semana en el Perú y el mundo?»** (fondo Pink Light, borde Saffron con
   franja izquierda gruesa): texto sobre los últimos 7 días y las fuentes (El Comercio, La República,
   RPP, Andina, la ONU, Foreign Affairs, BBC, El País y revistas académicas), nota «Si antes escribe un
   tema en la caja de búsqueda, le mostraremos solo las novedades sobre ese tema», y botón Saffron
   **«Ver novedades de la última semana»** (ancho completo en teléfono).
3. **Formulario de búsqueda** (tarjeta blanca con borde Slate): etiqueta «Escriba aquí un país,
   tema o autor», caja grande (placeholder «Por ejemplo: Guerra Fría o Tratados de Paz»), botón azul
   **Buscar** con lupa, nota «Puede escribir en español o en inglés. No importan las mayúsculas ni las
   tildes.», botón **«Buscar hablando»** (micrófono) y filtros en pastillas «¿Qué busca?»:
   **Todos · 📰 Noticias · 📄 Papers / Investigaciones · 📘 Libros** (al cambiar, repite la vista actual).
4. **Temas sugeridos** — «¿No sabe por dónde empezar? Pulse un tema:», dos grupos generados desde
   `js/temas.js` (lado a lado en escritorio, uno bajo otro en teléfono):
   - 🌐 **Agenda Contemporánea** (título púrpura): Ciberseguridad e IA · Diplomacia Climática ·
     Geopolítica y Tecnología · Multipolaridad y BRICS · Seguridad Alimentaria.
   - 🏛️ **Agenda Clásica Vigente** (título verde oscuro): Derecho Internacional · Arbitraje y
     Conflictos · Organismos Multilaterales · Asuntos Consulares · Comercio e Integración.
   - **Solo texto, sin marco ni fondo** (Slate, 15 px, 600). Al pasar el cursor y al estar elegido:
     color del grupo y subrayado (3 px si está elegido, `aria-pressed="true"`). En escritorio fluyen
     en filas alineadas con el título; en teléfono, uno por línea alineado bajo su título.
5. **Zona de resultados**: filtro «¿En qué idioma?» (Todos los idiomas / Solo en español, visible
   solo en la vista semanal), mensaje de estado y resultados en **dos secciones**.

### Sección «Últimas Noticias»
Noticias de los últimos 7 días en las dos secciones Nacional / Internacional. Si no hay datos, se
muestran las noticias explicativas «Contenido de ejemplo» con un aviso amable.

### Secciones «Papers Académicos» y «Libros Destacados»
Lista única, **del más reciente al más antiguo**. En Libros aparecen primero los libros recientes
de editoriales de prestigio (desde hace 3 años) y luego los clásicos del catálogo.

### Pie de página (Pink Light, borde superior Claret)
«Fuentes de prestigio que consultamos» por tipo (nacionales, organismos, análisis, medios, revistas,
libros), nota sobre «Contenido de ejemplo» y «Novedades actualizadas por última vez el … a las …».

---

## 5. Resultados

### Secciones por ámbito (`mostrarPorAmbito`)
- **Nacional (Perú)** primero (icono de ubicación, título y línea inferior en Claret) e
  **Internacional** después (icono de globo, Oxford Blue). Cada una con contador, la nota
  «De la más reciente a la más antigua» y un mensaje propio si queda vacía.
- Ámbito: por la fuente (RSS/GDELT); si no la hay (papers, libros), «nacional» cuando el texto
  menciona Perú/peruano/Fujimori.
- **Paginación de 10 en 10** con botón «Ver 10 resultados más (quedan N)»; el foco pasa al primer
  resultado nuevo.

### Tarjeta de resultado
- Rejilla de dos columnas: **contenido a la izquierda** y, **arriba a la derecha, botones pequeños
  apilados** (ancho 9,5 rem; 7,5 rem en teléfono; 13 px; alto 36 px):
  **Visitar enlace** (azul) · **Descargar PDF/Texto** (verde, solo si es de acceso libre) ·
  **WhatsApp** (verde WhatsApp).
- Etiquetas: 📰 Noticia / 📄 Paper Académico / 📘 Libro, «Contenido de ejemplo», «Publicado hoy /
  ayer / hace N días» (hasta 13 días), «En inglés», «Acceso libre ✓».
- Título (Georgia 19 px), resumen (16 px), datos (14 px): Autor (se omite si repite la fuente),
  Fuente con su tipo entre paréntesis, Fecha («26 de septiembre de 2026», «septiembre de 2000»,
  «1994», «Hacia el año 400 a. C.»). Franja izquierda: Claret noticia, púrpura paper, azul libro.
- No se muestra ninguna nota de «no es de descarga libre».
- **Visitar enlace** y **WhatsApp** abren pestaña nueva; WhatsApp usa `https://wa.me/?text=` con
  «Te comparto esto que encontré en Diplomacia Global:», título, autor y enlace.
- **Descargar**: pestaña nueva sin atributo `download`; aviso «¡Descarga iniciada con éxito! …».
  Con servidor: `/api/descargar/:id` (solo documentos conocidos, `Content-Disposition`).

### Enlace de respaldo
Tras cada búsqueda con texto (Todos o Noticias): «¿No encuentra lo que busca? Buscar «…» en Google
Noticias (solo medios de prestigio)», limitado con `site:` a elcomercio.pe, larepublica.pe, rpp.pe,
andina.pe, gestion.pe, bbc.com, elpais.com, reuters.com, apnews.com, dw.com (para un tema: sus 3
términos principales con OR).

---

## 6. Fuentes de prestigio (`public/js/fuentes-prestigio.js`, lista única)

### Medios RSS (novedades y archivo). `especializado:false` = solo noticias con palabras clave diplomáticas/internacionales
**Nacional (Perú):** El Comercio — Política (`elcomercio.pe/arcio/rss/category/politica/`) ·
El Comercio — Mundo (filtrado) · La República — Política (`larepublica.pe/rss/politica.xml`) ·
Gestión — Perú (`gestion.pe/arcio/rss/category/peru/`) · RPP — Política (`rpp.pe/feed/politica`) ·
RPP general (`rpp.pe/rss`, filtrado) · Andina (`andina.pe/agencia/rss/3.aspx`) ·
Cancillería del Perú (Google Noticias `site:gob.pe/institucion/rree`) ·
El Peruano (Google Noticias `site:elperuano.pe`, filtrado).

**Internacional:** Noticias ONU (es) y UN News Paz y seguridad (en) · Agencias vía Google Noticias:
Reuters (`site:reuters.com`), AP, AFP, EFE, Europa Press (`/internacional`), Bloomberg ·
Organismos vía Google Noticias: OEA, UE (EEAS), OTAN, Departamento de Estado, FMI, CEPAL ·
Foreign Affairs, Foreign Policy, The Diplomat, International Crisis Group, Brookings (filtrado) ·
BBC Mundo, El País Internacional, France 24 Español, DW Español, BBC World, The Guardian World,
NYT World, Al Jazeera (todos filtrados).

Google Noticias por sitio: `https://news.google.com/rss/search?q=<site:…> when:7d&hl=es-419&gl=PE&ceid=PE:es-419`;
se quita « - Medio» del titular y el resumen es «Publicado por X. Pulse «Visitar enlace» para leerlo completo.»
Perú21 **no** se usa como RSS (bloquea el acceso automático); sí está en la búsqueda.

### Dominios para la búsqueda de noticias (GDELT)
Nacional: elcomercio.pe, larepublica.pe, rpp.pe, gestion.pe, andina.pe, peru21.pe, elperuano.pe,
ojo-publico.com, idl-reporteros.pe, gob.pe (incluye subdominios .gob.pe).
Internacional: bbc.com, elpais.com, reuters.com, apnews.com, afp.com, efe.com, europapress.es,
bloomberg.com, ansa.it, dpa-international.com, un.org, oas.org, europa.eu, nato.int, state.gov,
imf.org, worldbank.org, cepal.org, wto.org, france24.com, dw.com, theguardian.com, nytimes.com,
washingtonpost.com, ft.com, economist.com, aljazeera.com, foreignaffairs.com, foreignpolicy.com.

### Revistas académicas (Crossref, por ISSN)
International Organization, International Security, World Politics, Foreign Affairs, International
Affairs, International Studies Quarterly, Journal of Conflict Resolution, Journal of Peace Research,
European Journal of International Relations, Review of International Studies, Survival,
Diplomacy & Statecraft, The Hague Journal of Diplomacy.

### Editoriales de prestigio (libros)
Oxford, Cambridge, Princeton, Harvard, Yale, Columbia, Stanford, MIT, Chicago, Cornell,
Georgetown, Johns Hopkins, Brookings Institution Press, Routledge, Palgrave, Springer, Bloomsbury,
Polity, Edward Elgar, Lynne Rienner, Penguin, Random House, Simon & Schuster, Norton, Basic Books,
PublicAffairs, Farrar, Knopf, Allen Lane, Hurst, Debate, Crítica, Taurus, Galaxia Gutenberg, FCE,
Siglo XXI, Alianza, Tecnos, Ariel, Planeta, Deusto, Catarata, Tirant lo Blanch, Fondo Editorial PUCP,
IEP, Universidad del Pacífico.

---

## 7. Búsqueda

### Motor (`motor-busqueda.js`)
- Normaliza: minúsculas, sin tildes ni signos. Coincidencia al **inicio de palabra**; un término
  que termina en espacio exige **palabra exacta** («ia » no encuentra «iglesia»).
- Sinónimos es/en (ONU = Naciones Unidas = United Nations, Guerra Fría = Cold War, tratado/treaty,
  paz/peace, guerra/war, negociación, embajada, diplomacia, realismo, EE. UU., URSS, geopolítica, clima).
- Texto libre: deben aparecer **todos** los conceptos. Tema sugerido: basta **cualquiera** de sus términos.
- Pesos: título 4, etiquetas 3, autor 3, fuente 1, resumen 1.
- **Orden de todas las listas: de lo más reciente a lo más antiguo** («de hoy hacia atrás»); la
  relevancia solo decide qué coincide y desempata.

### Temas (`temas.js`)
Cada tema tiene `id`, `etiqueta` y 14–25 `terminos` es/en (los primeros, los más representativos,
van a GDELT). Al pulsar uno: la caja muestra su nombre, queda marcado y se buscan sus términos; si
la persona edita la caja, se vuelve a búsqueda normal. Aplica también al botón semanal.

### Modos de datos (`servicio-datos.js`)
- `web` (GitHub Pages; se detecta por `*.github.io`, sin consultar `api/estado`),
  `servidor` (responde `api/estado`), `archivo` (`file://`, solo catálogo).
- Los JSON se piden con `?v=DG_VERSION` para no mezclar versiones.
- **Búsqueda en dos pasos**:
  1. **Al instante**: semana + archivo de 90 días (se descarga solo al buscar un tema) + libros
     recientes + catálogo (las noticias de ejemplo se ocultan si hay noticias reales).
  2. **En segundo plano**: GDELT (espera hasta 30 s; suele tardar ~14 s), Crossref (20 filas) y
     Open Library (editoriales de prestigio). Mientras tanto: «… Seguimos buscando más en agencias y
     medios de prestigio…»; al llegar, se vuelve a dibujar todo junto, sin repetidos y por fecha.
- Un contador de turnos evita que una respuesta lenta reemplace una búsqueda más nueva.
- Si algo falla: nunca queda en «Buscando…»; se muestra lo guardado o «No pudimos completar la
  búsqueda en este momento. Por favor, inténtelo de nuevo.».
- **Google Books no se usa en el navegador** (cuota sin clave agotada).

### GDELT (`gdelt.js`)
`https://api.gdeltproject.org/api/v2/doc/doc?query=<tema> (domainis:… OR …)&mode=ArtList&format=json&sort=DateDesc&maxrecords=75`.
Texto de varias palabras → frase exacta; tema → `(t1 OR "t 2" OR …)` con 8 términos de ≥4 letras.
Palabras de menos de 3 letras se descartan. Respuestas no JSON → lista vacía. Solo se aceptan
artículos de dominios de la lista; resumen «Noticia de X. Pulse «Visitar enlace» para leerla completa.»

### Novedades de la semana
Filtra por fecha ≥ ahora − 7 días, por tema/términos y por idioma. Mensaje: «Novedades de los
últimos 7 días (del D de mes al D de mes)[ sobre «…»]: N publicaciones de M fuentes de prestigio.»
Sin datos: «En este momento no podemos consultar las novedades…».

---

## 8. Datos generados (GitHub Actions)

`herramientas/actualizar-semana.js` (`npm run actualizar`), nunca termina con error:
1. **`ultima-semana.json`**: todos los medios (hasta 40 por medio), últimos 7 días, sin titulares
   repetidos, por fecha; más papers de Crossref publicados en los últimos 7 días. Informa ✔/✘ por
   fuente. `generado = null` si ninguna fuente respondió.
2. **`noticias-archivo.json`**: descarga el archivo ya publicado en la web, le suma lo nuevo, quita
   repetidos (por enlace y título) y lo mayor de **90 días**; versión compacta (resumen 200 caracteres).
3. **`libros-recientes.json`**: libros desde hace **3 años** de editoriales de prestigio (Google
   Books si responde; Open Library como fuente efectiva).
4. No reemplaza datos buenos por listas vacías.

### Flujo `.github/workflows/publicar.yml`
Disparadores: push a `main`, manual y `cron: "23 */4 * * *"`. Pasos: checkout → Node 22 →
`npm test` → `npm run actualizar` (continue-on-error, 5 min) → `sed` que reemplaza `__VERSION__`
por `<sha8>-<run>` en `index.html` → `upload-pages-artifact` (path `public`) → `deploy-pages`.
Configuración única: **Settings → Pages → Source: GitHub Actions**.

---

## 9. Catálogo local (`public/datos/catalogo.js`)

- **Libros (13):** Diplomacia (Kissinger, 1994) · Diplomacy: Theory and Practice 6.ª ed.
  (Berridge, 2022) · Orden Mundial (Kissinger, 2014) · Política entre las naciones (Morgenthau,
  1948) · La crisis de los veinte años (Carr, 1939) · La diplomacia (Nicolson, 1939) · American
  Diplomacy (Kennan, 1951) · Teoría de la política internacional (Waltz, 1979) · y en dominio público
  (Proyecto Gutenberg, en inglés): Tucídides, Maquiavelo, Kant, Clausewitz, Sun Tzu (descarga .txt
  salvo Kant). Enlaces a Open Library o Gutenberg.
- **Papers y documentos (10):** Carta de la ONU (PDF), Convenciones de Viena 1961, 1963 y 1969 (PDF
  de legal.un.org), Putnam 1988, Fearon 1995, Wendt 1992, Jervis 1978, Mearsheimer 1994, Nye 1990 (DOI).
- **Noticias de ejemplo (6)**, marcadas `ejemplo: true` y «Contenido de ejemplo»: textos
  explicativos que enlazan a portadas reales; solo aparecen si no hay noticias reales.
- Resúmenes de 2–3 líneas en lenguaje sencillo.

---

## 10. Servidor local (opcional, `servidor.js`)

Sin dependencias (Node ≥ 18). Rutas: `GET /api/estado`, `/api/buscar?q=&tipo=&t=` (t = términos de
tema separados por «|»), `/api/semana` (caché 30 min), `/api/descargar/:id`, y archivos de
`public/` (protegido contra salir de la carpeta). Fuentes: catálogo + libros recientes, RSS,
GDELT, Crossref, Open Library y **biblioteca personal** (párrafos de libros propios .md/.txt en
`biblioteca/`, con capítulo y ubicación aproximada; nunca se descargan ni se suben a GitHub).
`npm run sin-internet` desactiva las fuentes externas.

---

## 11. Pruebas (`npm test`, 36 con `node:test`, sin internet)

Catálogo (campos, ids únicos, noticias marcadas como ejemplo) · motor (tildes, sinónimos, filtros,
orden por fecha incluso con tema, peso del título) · temas (10 temas en 2 grupos, búsqueda por
cualquiera, palabra exacta, OR en GDELT) · Crossref (licencia abierta, filtros ISSN y fecha) · RSS
(fechas, HTML escapado, Atom, filtro de relevancia, Google Noticias) · fuentes (URL https, ámbito)
· GDELT (frase exacta, dominios, ámbito, respuesta no JSON) · libros (editorial y año) · ámbito
nacional/internacional · archivo de 90 días · novedades (7 días, duplicados, fuente caída, sin
respuesta → `generado: null`) · servidor (página, API, filtro, ruta protegida, descarga real y
denegada).

---

## 12. README (instrucciones para principiantes)

Enlace para compartir, cómo se actualiza solo, configuración única de Pages, cómo busca, temas,
lista de fuentes, colores y tamaños, orden de resultados, cómo probar localmente paso a paso
(doble clic en `public/index.html`; o instalar Node LTS, abrir terminal en Windows/Mac/Linux,
`npm start`, abrir `http://localhost:3000`, Ctrl + C para apagar), puerto alternativo, biblioteca
personal, estructura de archivos, cómo conectar nuevas fuentes, variables de entorno, accesibilidad
y comandos de desarrollo (`npm test`, `npm run css`, `npm run actualizar`).

---

## 13. Restricciones conocidas (comportamiento esperado)

- GDELT limita a 1 consulta cada 5 s por IP y tarda ~14 s: por eso la búsqueda en dos pasos y el archivo.
- Google Books sin clave responde 429: solo se intenta al generar datos; se usa Open Library.
- Perú21 bloquea lectores automáticos (403); OTAN y Departamento de Estado pueden traer 0 noticias.
- La primera vez tras una actualización grande, puede hacer falta **Ctrl + F5** una sola vez; las
  versiones marcadas evitan que se repita.
