export const TITLES = {
  '1': 'I1 — Porcentaje de Candidatos Activos con Sentencia Firme (0 a 100%)',
  '2': 'I2 — Índice de Preparación (0 a 20)',
  '3': 'I3 — Cantidad de Candidatos que han declarado ingreso S/ 0.00',
  '4b': 'I4 — Promedio de Ingreso Anual por Candidato (sin máx. ni S/ 0)',
  '5': 'I5 — Historial asociado #PorEstosNo',
  '6': 'I6 — Cantidad de Congresistas que buscan Reelección',
  '7': 'I7 — Candidatos Hábiles al Senado Nacional (0 a 30)',
  '8': 'I8 — Índice de Presencia de Candidatos en REINFO',
}

export const TEXTO_INFO = 'Cada indicador tiene su propia escala. Mueve la raya roja: los que no pasen este umbral se marcan en gris y se suman a los que ya descartaste en otros indicadores — así va quedando más gris el resto del sitio.'

/** Texto extendido para el modal "i" del Indicador 2 (Índice de Preparación). Cada bloque separado por \n\n se muestra como párrafo. */
export const TEXTO_INFO_I2 = `IP = PR + SE + ETC + ENU + EU + EPM + EPD

El Índice de Preparación (IP) va de 0 (analfabeto) a 20 (estudios en todos los niveles).

Componentes y puntajes:

PR — Educación Básica Primaria: 1 punto

SE — Educación Básica Secundaria: 1 punto

ETC — Estudios Técnicos completos: 2 puntos

ENU — Estudios No Universitarios completos: 2 puntos

EU — Grado de Bachiller otorgado: 3 puntos (0 si estudios completos no graduado)

EPM — Grado de Maestría otorgado: 5 puntos

EPD — Grado de Doctorado, según origen: 10 pts (universidad extranjera); 5 pts (universidad peruana, menos 3 cuestionadas); 3 pts (Univ. Cesar Vallejo, Telesup, Alas Peruanas)`

/** Textos extendidos para el modal "i" por indicador. */
export const TEXTO_INFO_I1 = 'Mide qué proporción de los candidatos activos del partido tiene sentencia firme (condena ya firme). El valor es un porcentaje de 0 a 100 %. Un porcentaje más alto indica más candidatos con sentencia; muchos usuarios prefieren partidos con menor valor en este indicador.'

export const TEXTO_INFO_I3 = 'Indica cuántos Candidatos de la lista al SENADO del partido declararon ingreso S/ 0.00 en sus declaraciones juradas. Sirve como señal de opacidad o de candidatos que no reportan ingresos. Un número más alto suele verse como peor; puedes fijar un tope y descartar partidos que superen esa cantidad.'

export const TEXTO_INFO_I4b = 'Mide el promedio de ingreso anual declarado por candidato en el partido, sin considerar los que declararon S/ 0 ni valores máximos extremos. Da una idea del nivel socioeconómico de la lista. Puedes elegir un rango (mínimo y máximo) y descartar partidos fuera de ese rango.'

export const TEXTO_INFO_I5 = 'Mide en qué medida candidatos o figuras asociadas al movimiento #PorEstosNo aparecen en listas de otros partidos (historial asociado #PorEstosNo). Es un índice ponderado por posición en lista; va de 0 a 100 %. Un valor más alto indica mayor presencia de esos nombres en la lista del partido; puedes descartar partidos por encima de un umbral que elijas.'

export const TEXTO_INFO_I6 = 'Cuenta cuántos congresistas del partido están buscando reelección. Sirve para ver concentración de carrera política o continuismo. Puedes fijar un tope y descartar partidos con más de X candidatos en reelección.'

export const TEXTO_INFO_I7 = 'Indica cuántos candidatos presenta el partido para el Senado Nacional. Refleja el tamaño de la lista para esa elección (escala 0 a 30). Puedes filtrar partidos con muy pocos o con muchos candidatos hábiles según tu criterio.'

export const TEXTO_INFO_I8 = 'Mide el grado de presencia o completitud de los candidatos del partido en el Registro de Candidatos (REINFO). Un valor más alto suele indicar mejor registro o cobertura en la información oficial. La escala va de 0 a 9; puedes descartar partidos por debajo de un umbral.'

const TEXTO_POR_INDICADOR = {
  '1': TEXTO_INFO_I1,
  '2': TEXTO_INFO_I2,
  '3': TEXTO_INFO_I3,
  '4b': TEXTO_INFO_I4b,
  '5': TEXTO_INFO_I5,
  '6': TEXTO_INFO_I6,
  '7': TEXTO_INFO_I7,
  '8': TEXTO_INFO_I8,
}

/** Texto del modal por indicador; si existe, se usa en lugar de TEXTO_INFO. */
export function getModalTexto(indicadorId) {
  return TEXTO_POR_INDICADOR[indicadorId] ?? TEXTO_INFO
}
