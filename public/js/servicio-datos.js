/*
 * SERVICIO DE DATOS
 * Decide de dónde salen los resultados. Hay tres formas de abrir la aplicación:
 *
 *   'servidor'  Con "npm start" (http://localhost:3000). Pregunta a /api/buscar y /api/semana.
 *   'web'       Publicada en internet como página estática (GitHub Pages). Usa:
 *                 - el catálogo local,
 *                 - datos/ultima-semana.json, datos/libros-recientes.json y
 *                   datos/noticias-archivo.json (noticias de los últimos 90 días, solo se
 *                   descarga al buscar un tema); los actualiza GitHub Actions cada 4 horas,
 *                 - y, al buscar un tema, consulta directamente desde el navegador:
 *                     GDELT (noticias de los últimos 3 meses en medios de prestigio),
 *                     Crossref (revistas académicas) y Google Books (editoriales de prestigio).
 *   'archivo'   Abriendo index.html con doble clic. Solo el catálogo local.
 *
 * Cada resultado queda marcado como 'nacional' (Perú) o 'internacional'.
 * La persona usuaria nunca ve estos detalles técnicos.
 */
(function (DG) {
  'use strict';

  var modoPromesa = null;
  var semanaPromesa = null;
  var librosPromesa = null;
  var archivoPromesa = null;

  /** Conexión con tiempo máximo de espera. Devuelve el texto de la respuesta. */
  function traerTexto(url, ms) {
    var control = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var t = setTimeout(function () { if (control) control.abort(); }, ms || 8000);
    return fetch(url, control ? { signal: control.signal } : {})
      .then(function (r) {
        clearTimeout(t);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      }, function (e) { clearTimeout(t); throw e; });
  }

  function traer(url, ms) {
    return traerTexto(url, ms).then(function (t) { return JSON.parse(t); });
  }

  function modo() {
    if (!modoPromesa) {
      modoPromesa = !/^https?:$/.test(window.location.protocol)
        ? Promise.resolve('archivo')
        : traer('api/estado', 3000)
          .then(function (d) { return d && d.ok ? 'servidor' : 'web'; })
          .catch(function () { return 'web'; });
    }
    return modoPromesa;
  }

  /** Marca cada documento como nacional o internacional. */
  function conAmbito(docs) {
    docs.forEach(function (d) { d.ambito = window.FuentesPrestigio.ambitoDe(d); });
    return docs;
  }

  /* ----------------------- Datos guardados ----------------------- */

  /** @returns {Promise<{generado: string|null, dias: number, fuentes: Array, resultados: Array}>} */
  function datosSemana() {
    if (!semanaPromesa) {
      semanaPromesa = modo().then(function (m) {
        if (m === 'archivo') return null;
        return traer(m === 'servidor' ? 'api/semana' : 'datos/ultima-semana.json', 20000);
      }).catch(function () { return null; }).then(function (d) {
        d = d || { generado: null, dias: 7, fuentes: [], resultados: [] };
        conAmbito(d.resultados);
        return d;
      });
    }
    return semanaPromesa;
  }

  /** Libros recientes de editoriales de prestigio (datos/libros-recientes.json). */
  function librosRecientes() {
    if (!librosPromesa) {
      librosPromesa = modo().then(function (m) {
        return m === 'archivo' ? null : traer('datos/libros-recientes.json', 15000);
      }).catch(function () { return null; }).then(function (d) {
        return conAmbito((d && d.resultados) || []);
      });
    }
    return librosPromesa;
  }

  /** Noticias de los últimos 90 días (se descarga solo la primera vez que se busca un tema). */
  function archivoNoticias() {
    if (!archivoPromesa) {
      archivoPromesa = modo().then(function (m) {
        return m === 'archivo' ? null : traer('datos/noticias-archivo.json', 20000);
      }).catch(function () { return null; }).then(function (d) {
        return conAmbito((d && d.resultados) || []);
      });
    }
    return archivoPromesa;
  }

  /**
   * Novedades de los últimos 7 días, opcionalmente filtradas por tema e idioma.
   * @param {{consulta?: string, idioma?: 'todos'|'es', ahora?: Date}} op
   */
  function semana(op) {
    op = op || {};
    return datosSemana().then(function (d) {
      var ahora = op.ahora || new Date();
      var limite = ahora.getTime() - (d.dias || 7) * 86400000;
      var lista = d.resultados.filter(function (x) {
        var t = Date.parse(x.fecha);
        return !isNaN(t) && t >= limite;
      });
      if (op.idioma === 'es') lista = lista.filter(function (x) { return x.idioma === 'es'; });
      if (op.consulta) lista = window.MotorBusqueda.buscar(lista, { consulta: op.consulta });
      return { generado: d.generado, dias: d.dias || 7, fuentes: d.fuentes, resultados: window.MotorBusqueda.ordenarPorFecha(lista) };
    });
  }

  /* ------------------------------ Búsqueda ------------------------------ */

  function buscarNoticias(consulta) {
    var url = window.Gdelt.construirUrl(consulta);
    if (!url) return Promise.resolve([]);
    return traerTexto(url, 12000).then(window.Gdelt.interpretar).catch(function () { return []; });
  }

  function buscarPapers(consulta) {
    return traer(window.Crossref.construirUrl({ consulta: consulta, filas: 20 }), 10000)
      .then(function (j) { return ((j.message && j.message.items) || []).map(window.Crossref.convertir); })
      .catch(function () { return []; });
  }

  function buscarLibros(consulta) {
    return traer(window.Libros.urlGoogle({ q: consulta, recientes: false }), 10000)
      .then(function (j) { return window.Libros.interpretarGoogle(j); })
      .catch(function () { return []; });
  }

  function buscarSinServidor(opciones, m) {
    var tipo = opciones.tipo || 'todos';
    var consulta = opciones.consulta || '';
    var enVivo = consulta && m === 'web';
    var quiere = function (t) { return tipo === 'todos' || tipo === t; };

    return Promise.all([
      datosSemana(),
      librosRecientes(),
      enVivo && quiere('noticia') ? buscarNoticias(consulta) : [],
      enVivo && quiere('paper') ? buscarPapers(consulta) : [],
      enVivo && quiere('libro') ? buscarLibros(consulta) : [],
      consulta && quiere('noticia') ? archivoNoticias() : []
    ]).then(function (r) {
      var recientes = r[0].resultados.concat(r[5]);
      var hayNoticiasReales = recientes.some(function (d) { return d.tipo === 'noticia'; });
      // Con noticias reales disponibles, las noticias de ejemplo del catálogo se ocultan.
      var catalogo = window.CATALOGO_DIPLOMACIA.filter(function (d) { return !(hayNoticiasReales && d.ejemplo); });
      var guardados = window.MotorBusqueda.buscar(recientes.concat(r[1], catalogo), opciones);
      var enLinea = r[2].concat(r[3], r[4]).filter(function (d) { return quiere(d.tipo); });

      // Todo junto y sin repetir títulos.
      var vistos = {};
      var todos = guardados.concat(enLinea).filter(function (d) {
        var clave = window.MotorBusqueda.normalizar(d.titulo);
        if (vistos[clave]) return false;
        vistos[clave] = true;
        return true;
      });
      return { resultados: window.MotorBusqueda.ordenarPorFecha(conAmbito(todos)), avisos: [], modo: m };
    });
  }

  /**
   * @param {{consulta: string, tipo: string}} opciones
   * @returns {Promise<{resultados: Array, avisos: string[], modo: string}>}
   */
  function buscar(opciones) {
    return modo().then(function (m) {
      if (m !== 'servidor') return buscarSinServidor(opciones, m);
      var url = 'api/buscar?q=' + encodeURIComponent(opciones.consulta || '') +
                '&tipo=' + encodeURIComponent(opciones.tipo || 'todos');
      return traer(url, 25000)
        .then(function (d) { return { resultados: conAmbito(d.resultados), avisos: d.avisos || [], modo: m }; })
        .catch(function () { return buscarSinServidor(opciones, 'web'); });
    });
  }

  var modoActual = null;
  modo().then(function (m) { modoActual = m; });

  /** Dirección para descargar un documento con un clic. */
  function urlDescarga(doc) {
    if (!doc.descarga) return null;
    return modoActual === 'servidor' ? 'api/descargar/' + encodeURIComponent(doc.id) : doc.descarga.url;
  }

  DG.Datos = {
    modo: modo,
    buscar: buscar,
    semana: semana,
    librosRecientes: librosRecientes,
    urlDescarga: urlDescarga,
    hayServidor: function () { return modoActual === 'servidor'; }
  };
})(window.DG = window.DG || {});
