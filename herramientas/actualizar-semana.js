/*
 * ACTUALIZAR LOS DATOS DE LA WEB PUBLICADA
 * Consulta las fuentes de prestigio y guarda:
 *   - public/datos/ultima-semana.json     novedades de los últimos 7 días (nacional e internacional)
 *   - public/datos/libros-recientes.json  libros publicados en los últimos años por editoriales de prestigio
 *
 * Lo ejecuta GitHub Actions automáticamente varias veces al día
 * (.github/workflows/publicar.yml). También puede ejecutarse a mano:
 *     npm run actualizar
 *
 * Nunca termina con error: si una fuente falla, se omite y se informa.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { obtenerSemana } = require('../servidor/semana');
const { obtenerRecientes } = require('../servidor/fuentes/libros-recientes');

const CARPETA = path.join(__dirname, '..', 'public', 'datos');
const SEMANA = path.join(CARPETA, 'ultima-semana.json');
const LIBROS = path.join(CARPETA, 'libros-recientes.json');
const ANIOS_LIBROS = 3; // libros publicados desde hace 3 años

function informar(fuentes) {
  for (const f of fuentes) {
    console.log(`  ${f.ok ? '✔' : '✘'} ${f.fuente}: ${f.ok ? f.cantidad : 'no respondió'}`);
  }
}

/** No reemplaza datos buenos por una lista vacía (por ejemplo, si internet falló). */
function guardar(destino, datos, cantidad) {
  if (!cantidad && fs.existsSync(destino)) {
    try {
      const anterior = JSON.parse(fs.readFileSync(destino, 'utf8'));
      if ((anterior.resultados || []).length) {
        console.log('  Sin resultados nuevos: se conservan los datos anteriores.');
        return;
      }
    } catch { /* archivo dañado: se reemplaza */ }
  }
  fs.writeFileSync(destino, JSON.stringify(datos, null, 1) + '\n');
  console.log('  Guardado en', path.relative(process.cwd(), destino));
}

(async () => {
  try {
    const semana = await obtenerSemana({ esperaMs: 20000 });
    const nacionales = semana.resultados.filter((d) => d.ambito === 'nacional').length;
    console.log(`Novedades de los últimos ${semana.dias} días: ${semana.resultados.length} publicaciones ` +
      `(${nacionales} nacionales, ${semana.resultados.length - nacionales} internacionales).`);
    informar(semana.fuentes);
    guardar(SEMANA, semana, semana.resultados.length);
  } catch (e) {
    console.error('No se pudieron actualizar las novedades:', e.message);
  }

  try {
    const desdeAnio = new Date().getFullYear() - ANIOS_LIBROS;
    const { libros, informe } = await obtenerRecientes({ desdeAnio, esperaMs: 20000 });
    console.log(`Libros recientes (desde ${desdeAnio}) de editoriales de prestigio: ${libros.length}.`);
    informar(informe);
    guardar(LIBROS, { generado: new Date().toISOString(), desdeAnio, fuentes: informe, resultados: libros }, libros.length);
  } catch (e) {
    console.error('No se pudieron actualizar los libros recientes:', e.message);
  }
})();
