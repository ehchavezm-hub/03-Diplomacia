/*
 * FUENTES DE PRESTIGIO
 * --------------------
 * Única lista de medios, organismos, revistas académicas y editoriales que usa la
 * aplicación. Solo se muestran resultados de estas fuentes.
 *
 * - medios: fuentes RSS para "Novedades de la última semana".
 *     ambito: 'nacional' (Perú) o 'internacional'.
 *     especializado: true  -> se toma todo su contenido (secciones de política o
 *                             internacional, organismos, revistas de política exterior).
 *     especializado: false -> medio general: solo las noticias que mencionan temas
 *                             diplomáticos o internacionales (ver PALABRAS_CLAVE).
 * - dominios: sitios web en los que busca el buscador de noticias (GDELT).
 * - revistas: revistas académicas de relaciones internacionales (Crossref, por ISSN).
 * - editoriales: editoriales de prestigio para los libros recientes.
 *
 * Para añadir una fuente, copie una línea y cambie sus datos.
 * Se usa en el navegador (window.FuentesPrestigio) y en Node.js (require).
 */
(function (raiz) {
  'use strict';

  var medios = [
    // ---------------- NACIONAL (Perú) ----------------
    { id: 'el-comercio', nombre: 'El Comercio — Política', tipoFuente: 'Diario de referencia nacional', idioma: 'es', ambito: 'nacional', especializado: true,
      url: 'https://elcomercio.pe/arcio/rss/category/politica/' },
    { id: 'el-comercio-mundo', nombre: 'El Comercio — Mundo', tipoFuente: 'Diario de referencia nacional', idioma: 'es', ambito: 'nacional', especializado: false,
      url: 'https://elcomercio.pe/arcio/rss/category/mundo/' },
    { id: 'la-republica', nombre: 'La República — Política', tipoFuente: 'Diario de referencia nacional', idioma: 'es', ambito: 'nacional', especializado: true,
      url: 'https://larepublica.pe/arcio/rss/category/politica/' },
    { id: 'gestion', nombre: 'Gestión — Perú', tipoFuente: 'Diario de referencia nacional', idioma: 'es', ambito: 'nacional', especializado: true,
      url: 'https://gestion.pe/arcio/rss/category/peru/' },
    { id: 'peru21', nombre: 'Perú21 — Política', tipoFuente: 'Diario de referencia nacional', idioma: 'es', ambito: 'nacional', especializado: true,
      url: 'https://peru21.pe/arcio/rss/category/politica/' },
    { id: 'rpp', nombre: 'RPP Noticias — Política', tipoFuente: 'Medio de referencia nacional', idioma: 'es', ambito: 'nacional', especializado: true,
      url: 'https://rpp.pe/rss/politica' },
    { id: 'andina', nombre: 'Andina — Agencia Peruana de Noticias', tipoFuente: 'Agencia oficial de noticias', idioma: 'es', ambito: 'nacional', especializado: true,
      url: 'https://andina.pe/agencia/rss/3.aspx' },

    // ---------------- INTERNACIONAL ----------------
    // Organismos internacionales
    { id: 'onu-es', nombre: 'Noticias ONU', tipoFuente: 'Organismo internacional', idioma: 'es', ambito: 'internacional', especializado: true,
      url: 'https://news.un.org/feed/subscribe/es/news/all/rss.xml' },
    { id: 'onu-paz', nombre: 'UN News — Paz y seguridad', tipoFuente: 'Organismo internacional', idioma: 'en', ambito: 'internacional', especializado: true,
      url: 'https://news.un.org/feed/subscribe/en/news/topic/peace-and-security/feed/rss.xml' },

    // Revistas y centros de análisis de política exterior
    { id: 'foreign-affairs', nombre: 'Foreign Affairs', tipoFuente: 'Revista de política exterior', idioma: 'en', ambito: 'internacional', especializado: true,
      url: 'https://www.foreignaffairs.com/rss.xml' },
    { id: 'foreign-policy', nombre: 'Foreign Policy', tipoFuente: 'Revista de política exterior', idioma: 'en', ambito: 'internacional', especializado: true,
      url: 'https://foreignpolicy.com/feed/' },
    { id: 'the-diplomat', nombre: 'The Diplomat', tipoFuente: 'Revista de política exterior', idioma: 'en', ambito: 'internacional', especializado: true,
      url: 'https://thediplomat.com/feed/' },
    { id: 'crisis-group', nombre: 'International Crisis Group', tipoFuente: 'Centro de análisis', idioma: 'en', ambito: 'internacional', especializado: true,
      url: 'https://www.crisisgroup.org/rss.xml' },
    { id: 'brookings', nombre: 'Brookings Institution', tipoFuente: 'Centro de análisis', idioma: 'en', ambito: 'internacional', especializado: false,
      url: 'https://www.brookings.edu/feed/' },

    // Periódicos y cadenas de referencia mundial
    { id: 'bbc-mundo', nombre: 'BBC Mundo', tipoFuente: 'Medio de referencia', idioma: 'es', ambito: 'internacional', especializado: false,
      url: 'https://feeds.bbci.co.uk/mundo/rss.xml' },
    { id: 'el-pais', nombre: 'El País — Internacional', tipoFuente: 'Medio de referencia', idioma: 'es', ambito: 'internacional', especializado: false,
      url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/internacional/portada' },
    { id: 'france24-es', nombre: 'France 24 Español', tipoFuente: 'Medio de referencia', idioma: 'es', ambito: 'internacional', especializado: false,
      url: 'https://www.france24.com/es/rss' },
    { id: 'dw-es', nombre: 'DW Español', tipoFuente: 'Medio de referencia', idioma: 'es', ambito: 'internacional', especializado: false,
      url: 'https://rss.dw.com/xml/rss-sp-all' },
    { id: 'bbc-world', nombre: 'BBC News — World', tipoFuente: 'Medio de referencia', idioma: 'en', ambito: 'internacional', especializado: false,
      url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
    { id: 'guardian', nombre: 'The Guardian — World', tipoFuente: 'Medio de referencia', idioma: 'en', ambito: 'internacional', especializado: false,
      url: 'https://www.theguardian.com/world/rss' },
    { id: 'nyt', nombre: 'The New York Times — World', tipoFuente: 'Medio de referencia', idioma: 'en', ambito: 'internacional', especializado: false,
      url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml' },
    { id: 'al-jazeera', nombre: 'Al Jazeera', tipoFuente: 'Medio de referencia', idioma: 'en', ambito: 'internacional', especializado: false,
      url: 'https://www.aljazeera.com/xml/rss/all.xml' }
  ];

  // Sitios donde busca el buscador de noticias (GDELT), con su nombre visible.
  var dominios = [
    // Nacional (Perú)
    { dominio: 'elcomercio.pe', nombre: 'El Comercio', ambito: 'nacional' },
    { dominio: 'larepublica.pe', nombre: 'La República', ambito: 'nacional' },
    { dominio: 'rpp.pe', nombre: 'RPP Noticias', ambito: 'nacional' },
    { dominio: 'gestion.pe', nombre: 'Gestión', ambito: 'nacional' },
    { dominio: 'andina.pe', nombre: 'Andina', ambito: 'nacional' },
    { dominio: 'peru21.pe', nombre: 'Perú21', ambito: 'nacional' },
    { dominio: 'ojo-publico.com', nombre: 'Ojo Público', ambito: 'nacional' },
    { dominio: 'idl-reporteros.pe', nombre: 'IDL-Reporteros', ambito: 'nacional' },
    { dominio: 'gob.pe', nombre: 'Gobierno del Perú (gob.pe)', ambito: 'nacional' },
    // Internacional
    { dominio: 'news.un.org', nombre: 'Noticias ONU', ambito: 'internacional' },
    { dominio: 'bbc.com', nombre: 'BBC', ambito: 'internacional' },
    { dominio: 'elpais.com', nombre: 'El País', ambito: 'internacional' },
    { dominio: 'reuters.com', nombre: 'Reuters', ambito: 'internacional' },
    { dominio: 'apnews.com', nombre: 'Associated Press', ambito: 'internacional' },
    { dominio: 'france24.com', nombre: 'France 24', ambito: 'internacional' },
    { dominio: 'dw.com', nombre: 'DW', ambito: 'internacional' },
    { dominio: 'theguardian.com', nombre: 'The Guardian', ambito: 'internacional' },
    { dominio: 'nytimes.com', nombre: 'The New York Times', ambito: 'internacional' },
    { dominio: 'washingtonpost.com', nombre: 'The Washington Post', ambito: 'internacional' },
    { dominio: 'ft.com', nombre: 'Financial Times', ambito: 'internacional' },
    { dominio: 'economist.com', nombre: 'The Economist', ambito: 'internacional' },
    { dominio: 'aljazeera.com', nombre: 'Al Jazeera', ambito: 'internacional' },
    { dominio: 'foreignaffairs.com', nombre: 'Foreign Affairs', ambito: 'internacional' },
    { dominio: 'foreignpolicy.com', nombre: 'Foreign Policy', ambito: 'internacional' }
  ];

  var revistas = [
    { nombre: 'International Organization', issn: '0020-8183' },
    { nombre: 'International Security', issn: '0162-2889' },
    { nombre: 'World Politics', issn: '0043-8871' },
    { nombre: 'Foreign Affairs', issn: '0015-7120' },
    { nombre: 'International Affairs', issn: '0020-5850' },
    { nombre: 'International Studies Quarterly', issn: '0020-8833' },
    { nombre: 'Journal of Conflict Resolution', issn: '0022-0027' },
    { nombre: 'Journal of Peace Research', issn: '0022-3433' },
    { nombre: 'European Journal of International Relations', issn: '1354-0661' },
    { nombre: 'Review of International Studies', issn: '0260-2105' },
    { nombre: 'Survival', issn: '0039-6338' },
    { nombre: 'Diplomacy & Statecraft', issn: '0959-2296' },
    { nombre: 'The Hague Journal of Diplomacy', issn: '1871-1901' }
  ];

  // Editoriales de prestigio (se compara sin tildes ni mayúsculas, por coincidencia parcial).
  var editoriales = [
    'oxford university press', 'cambridge university press', 'princeton university press',
    'harvard university press', 'yale university press', 'columbia university press',
    'stanford university press', 'mit press', 'university of chicago press', 'cornell university press',
    'georgetown university press', 'johns hopkins university press', 'brookings institution press',
    'routledge', 'palgrave', 'springer', 'bloomsbury', 'polity', 'edward elgar', 'lynne rienner',
    'penguin', 'random house', 'simon & schuster', 'w. w. norton', 'norton', 'basic books',
    'publicaffairs', 'public affairs', 'farrar', 'knopf', 'allen lane', 'hurst',
    'debate', 'critica', 'taurus', 'galaxia gutenberg', 'fondo de cultura economica', 'siglo xxi',
    'alianza editorial', 'tecnos', 'ariel', 'planeta', 'deusto', 'catarata', 'tirant lo blanch',
    'pontificia universidad catolica del peru', 'fondo editorial pucp',
    'instituto de estudios peruanos', 'universidad del pacifico'
  ];

  // Temas que hacen "relevante" una noticia de un medio general (sin tildes, en minúsculas).
  // Cada término busca el comienzo de una palabra ("diplomac" = diplomacia, diplomático…);
  // si termina en espacio, debe ser la palabra exacta ("war " no encuentra "warning").
  var PALABRAS_CLAVE = [
    'diplomac', 'diplomat', 'embajad', 'embass', 'ambassador', 'canciller', 'cancilleria',
    'ministro de exteriores', 'ministra de exteriores', 'ministro de relaciones exteriores',
    'foreign minister', 'foreign secretary', 'secretary of state', 'foreign policy', 'politica exterior',
    'cumbre', 'summit', 'tratado', 'treaty', 'acuerdo de paz', 'peace deal', 'peace talks',
    'negociacion', 'negociaciones', 'negotiat', 'talks ', 'dialogo', 'mediacion', 'mediat',
    'alto el fuego', 'tregua', 'ceasefire', 'truce', 'sancion', 'sanction', 'aranceles', 'tariff',
    'onu ', 'naciones unidas', 'united nations', 'consejo de seguridad', 'security council',
    'otan ', 'nato ', 'g7 ', 'g20 ', 'brics ', 'union europea', 'european union', 'oea ', 'asean ',
    'apec ', 'geopolit', 'relaciones internacionales', 'international relations', 'bilateral', 'multilateral',
    'conflicto', 'conflict', 'guerra', 'war ', 'wars ', 'invasion', 'refugiad', 'refugee', 'derechos humanos',
    'human rights', 'nuclear', 'desarme', 'disarmament', 'frontera', 'border', 'soberan', 'sovereign',
    'peru', 'peruan'
  ];

  function sinTildes(texto) {
    return String(texto || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  /** ¿La noticia de un medio general trata un tema diplomático o internacional? */
  function esRelevante(titulo, resumen) {
    var texto = ' ' + sinTildes(titulo + ' ' + resumen).replace(/[^a-z0-9ñ]+/g, ' ') + ' ';
    return PALABRAS_CLAVE.some(function (p) { return texto.indexOf(' ' + p) > -1; });
  }

  /** ¿La editorial está en la lista de prestigio? */
  function esEditorialPrestigio(editorial) {
    var e = sinTildes(editorial);
    return !!e && editoriales.some(function (p) { return e.indexOf(p) > -1; });
  }

  /** Datos del sitio (nombre y ámbito) a partir de una dirección web o dominio. */
  function sitioDe(urlODominio) {
    var host = sinTildes(urlODominio).replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '');
    for (var i = 0; i < dominios.length; i++) {
      var d = dominios[i].dominio;
      if (host === d || host.slice(-(d.length + 1)) === '.' + d) return dominios[i];
    }
    return null;
  }

  /**
   * 'nacional' (Perú) o 'internacional'.
   * Usa el ámbito de la fuente; si no lo tiene (papers, libros), mira si el texto trata del Perú.
   */
  function ambitoDe(doc) {
    if (doc.ambito) return doc.ambito;
    var sitio = doc.tipo === 'noticia' && doc.enlace ? sitioDe(doc.enlace) : null;
    if (sitio) return sitio.ambito;
    var texto = ' ' + sinTildes([doc.titulo, doc.resumen, (doc.etiquetas || []).join(' ')].join(' '))
      .replace(/[^a-z0-9ñ]+/g, ' ');
    return /\s(peru|peruan|fujimori)/.test(texto) ? 'nacional' : 'internacional';
  }

  var FuentesPrestigio = {
    medios: medios,
    dominios: dominios,
    revistas: revistas,
    editoriales: editoriales,
    PALABRAS_CLAVE: PALABRAS_CLAVE,
    esRelevante: esRelevante,
    esEditorialPrestigio: esEditorialPrestigio,
    sitioDe: sitioDe,
    ambitoDe: ambitoDe
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = FuentesPrestigio;
  } else {
    raiz.FuentesPrestigio = FuentesPrestigio;
  }
})(typeof window !== 'undefined' ? window : globalThis);
