/*
 * TEMAS SUGERIDOS
 * ---------------
 * Botones de "¿No sabe por dónde empezar? Pulse un tema".
 * Cada tema busca CUALQUIERA de sus términos (en español e inglés), no la frase exacta.
 *   - Un término busca el comienzo de una palabra: "ciberataque" encuentra "ciberataques".
 *   - Si termina en espacio, debe ser la palabra exacta: "ia " no encuentra "iglesia".
 *   - Los primeros términos de cada lista son los que se usan en el buscador de noticias
 *     en internet (GDELT), así que conviene poner primero los más representativos.
 *
 * Para cambiar un tema, edite su "etiqueta" (lo que se ve) o su lista de "terminos".
 * Se usa en el navegador (window.Temas) y en Node.js (require).
 */
(function (raiz) {
  'use strict';

  var grupos = [
    {
      id: 'contemporanea',
      titulo: 'Agenda Contemporánea',
      icono: '🌐',
      temas: [
        { id: 'ciber-ia', etiqueta: 'Ciberseguridad e IA', terminos: [
          'ciberseguridad', 'inteligencia artificial', 'cybersecurity', 'artificial intelligence', 'ciberataque',
          'cyberattack', 'ciberdefensa', 'ciberespacio', 'cyber ', 'ia ', 'ai ', 'hacker', 'desinformacion', 'disinformation'] },
        { id: 'clima', etiqueta: 'Diplomacia Climática', terminos: [
          'cambio climatico', 'climate change', 'acuerdo de paris', 'paris agreement', 'cop30', 'cop31',
          'clima ', 'climate', 'emisiones', 'emissions', 'calentamiento global', 'global warming',
          'transicion energetica', 'energy transition', 'descarboniz', 'decarboni', 'net zero', 'amazonia'] },
        { id: 'geotec', etiqueta: 'Geopolítica y Tecnología', terminos: [
          'semiconductor', 'tierras raras', 'rare earth', 'control de exportaciones', 'export controls',
          'chips ', 'litio', 'lithium', '5g ', 'huawei', 'nvidia', 'tiktok', 'satelit', 'satellite',
          'carrera espacial', 'space race', 'tecnolog', 'technolog'] },
        { id: 'brics', etiqueta: 'Multipolaridad y BRICS', terminos: [
          'brics', 'multipolar', 'sur global', 'global south', 'orden mundial', 'world order',
          'desdolarizacion', 'de-dollarization', 'dedollarization', 'organizacion de cooperacion de shanghai',
          'shanghai cooperation', 'g20 ', 'g7 ', 'xi jinping', 'putin', 'modi ', 'lula'] },
        { id: 'alimentos', etiqueta: 'Seguridad Alimentaria', terminos: [
          'seguridad alimentaria', 'food security', 'hambre', 'hunger', 'inseguridad alimentaria', 'food insecurity',
          'hambruna', 'famine', 'programa mundial de alimentos', 'world food programme', 'fao ', 'wfp ',
          'precios de los alimentos', 'food prices', 'granos', 'grain', 'cereales', 'fertilizante', 'fertilizer'] }
      ]
    },
    {
      id: 'clasica',
      titulo: 'Agenda Clásica Vigente',
      icono: '🏛️',
      temas: [
        { id: 'derecho', etiqueta: 'Derecho Internacional', terminos: [
          'derecho internacional', 'international law', 'corte internacional de justicia', 'international court of justice',
          'corte penal internacional', 'international criminal court', 'crimenes de guerra', 'war crimes',
          'cij ', 'icj ', 'cpi ', 'tratado', 'treaty', 'convencion', 'convention', 'soberania', 'sovereignty',
          'jurisdiccion', 'jurisdiction', 'derechos humanos', 'human rights'] },
        { id: 'arbitraje', etiqueta: 'Arbitraje y Conflictos', terminos: [
          'arbitraje', 'arbitration', 'mediacion', 'mediation', 'alto el fuego', 'ceasefire', 'acuerdo de paz',
          'peace deal', 'peace talks', 'conversaciones de paz', 'tregua', 'truce', 'ciadi', 'icsid',
          'la haya', 'the hague', 'diferendo', 'controversia', 'disputa', 'dispute', 'negociacion', 'negotiat',
          'conflicto', 'conflict'] },
        { id: 'multilaterales', etiqueta: 'Organismos Multilaterales', terminos: [
          'naciones unidas', 'united nations', 'consejo de seguridad', 'security council', 'asamblea general',
          'general assembly', 'onu ', 'oea ', 'organization of american states', 'otan ', 'nato ',
          'union europea', 'european union', 'fmi ', 'imf ', 'banco mundial', 'world bank', 'omc ', 'wto ',
          'organizacion mundial de la salud', 'world health organization', 'cepal', 'apec ', 'multilateral'] },
        { id: 'consulares', etiqueta: 'Asuntos Consulares', terminos: [
          'consulado', 'consulate', 'consular', 'consul ', 'pasaporte', 'passport', 'peruanos en el exterior',
          'repatriacion', 'repatriation', 'deportacion', 'deportation', 'migrante', 'migrant', 'migracion',
          'migration', 'visa ', 'visas ', 'asilo', 'asylum', 'refugiad', 'refugee', 'embajada', 'embassy', 'cancilleria'] },
        { id: 'comercio', etiqueta: 'Comercio e Integración', terminos: [
          'tratado de libre comercio', 'free trade', 'comercio exterior', 'aranceles', 'tariff', 'alianza del pacifico',
          'pacific alliance', 'mercosur', 'comunidad andina', 'apec ', 'tlc ', 'omc ', 'wto ',
          'comercio', 'trade ', 'trade war', 'guerra comercial', 'integracion', 'integration',
          'exportaciones', 'exports', 'importaciones', 'imports ', 'inversion extranjera', 'foreign investment',
          'cadena de suministro', 'supply chain'] }
      ]
    }
  ];

  /** Busca un tema por su id. */
  function porId(id) {
    for (var g = 0; g < grupos.length; g++) {
      for (var t = 0; t < grupos[g].temas.length; t++) {
        if (grupos[g].temas[t].id === id) return grupos[g].temas[t];
      }
    }
    return null;
  }

  var Temas = { grupos: grupos, porId: porId };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Temas;
  } else {
    raiz.Temas = Temas;
  }
})(typeof window !== 'undefined' ? window : globalThis);
