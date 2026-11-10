// Ítems del diagnóstico inicial y final.
// Cada par (A, B) mide la misma habilidad con la misma estructura y los mismos tipos de error.
// Un estudiante recibe una forma en el inicio y la otra en el final (contrabalanceo al azar).
const va = '<i class="v">a</i>', vb = '<i class="v">b</i>', vc = '<i class="v">c</i>';

window.HABILIDADES = {
  H1: 'Lectura geométrica de una combinación lineal',
  H2: 'Alcance de un conjunto generador',
  H3: 'Dependencia en R²: vectores opuestos',
  H4: 'Dependencia en R²: vector nulo',
  H5: 'Solución trivial y definición de independencia',
  H6: 'Más vectores que dimensiones',
  H7: 'Dependencia en R³: vectores en un mismo plano'
};

window.ERRORES = {
  E_SENTIDO: 'Ignora que un escalar negativo invierte el sentido',
  E_CONO: 'Cree que la combinación lineal solo alcanza la región entre los vectores',
  E_SIGNO_INV: 'Invierte los signos de los escalares',
  E_CONTEO: 'Decide por el número de vectores sin revisar su dirección',
  E_DEP_NADA: 'Cree que un conjunto dependiente no genera ningún vector',
  E_OPUESTOS_IND: 'Considera independientes a dos vectores opuestos',
  E_ORTO: 'Confunde dependencia con ortogonalidad',
  E_NULO_NEUTRO: 'Cree que el vector nulo no afecta la independencia',
  E_MUTUO: 'Exige que cada vector sea múltiplo del otro',
  E_NULO_GENERA: 'Confunde independencia con capacidad de generar',
  E_TRIVIAL_BASTA: 'Cree que basta con que la solución trivial exista',
  E_INVERSION: 'Invierte la definición: asocia independencia con escalares no nulos',
  E_CONDICION_EXTRA: 'Agrega una condición que no corrige el argumento',
  E_PARES: 'Evalúa la dependencia solo por pares de vectores',
  E_NOSABE: 'Considera que la información no alcanza',
  E_N_MAS_1: 'Aplica la regla de más vectores que dimensiones donde no corresponde'
};

window.ITEMS = [
  { id: 'P1', h: 'H1',
    A: {
      fig: { a: [2, 1], b: [1, 2], c: [3, 0] },
      enun: `En la figura, el vector ${vc} se expresa como ${vc} = α${va} + β${vb}. Elige la afirmación correcta sobre los escalares.`,
      ops: [
        { t: 'α es positivo y β es negativo.', ok: 1 },
        { t: 'α y β son positivos, porque una combinación lineal suma vectores.', err: 'E_SENTIDO' },
        { t: 'α es negativo y β es positivo.', err: 'E_SIGNO_INV' },
        { t: `No existen tales escalares, porque ${vc} no está entre ${va} y ${vb}.`, err: 'E_CONO' }
      ],
      exp: `${vc} queda fuera de la región entre ${va} y ${vb}, del lado de ${va}. Para llegar a él se avanza sobre ${va} (α positivo) y se retrocede sobre ${vb} (β negativo). En este caso α = 2 y β = −1.`
    },
    B: {
      fig: { a: [1, 2], b: [2, 1], c: [0, 3] },
      enun: `En la figura, el vector ${vc} se expresa como ${vc} = α${va} + β${vb}. Elige la afirmación correcta sobre los escalares.`,
      ops: [
        { t: 'α es positivo y β es negativo.', ok: 1 },
        { t: 'α y β son positivos, porque una combinación lineal suma vectores.', err: 'E_SENTIDO' },
        { t: 'α es negativo y β es positivo.', err: 'E_SIGNO_INV' },
        { t: `No existen tales escalares, porque ${vc} no está entre ${va} y ${vb}.`, err: 'E_CONO' }
      ],
      exp: `${vc} queda fuera de la región entre ${va} y ${vb}, del lado de ${va}. Para llegar a él se avanza sobre ${va} (α positivo) y se retrocede sobre ${vb} (β negativo). En este caso α = 2 y β = −1.`
    }
  },
  { id: 'P2', h: 'H2',
    A: {
      enun: `Se tienen ${va} = (1, 2) y ${vb} = (−2, −4). Un estudiante afirma:`,
      cita: `«Como son dos vectores en R², el conjunto {${va}, ${vb}} genera todo R².»`,
      ops: [
        { t: `Es incorrecto. El conjunto solo genera los vectores ubicados sobre la recta que pasa por el origen con la dirección de ${va}.`, ok: 1 },
        { t: 'Es correcto. Dos vectores en R² siempre generan R².', err: 'E_CONTEO' },
        { t: 'Es incorrecto. Al ser dependiente, el conjunto no genera ningún vector.', err: 'E_DEP_NADA' },
        { t: 'Es correcto. Al ser opuestos, sus combinaciones cubren ambos lados del plano.', err: 'E_OPUESTOS_IND' }
      ],
      exp: `${vb} = −2${va}, así que toda combinación α${va} + β${vb} es un múltiplo de ${va}. El conjunto genera una recta, no el plano. Por ejemplo, (1, 0) no puede generarse.`
    },
    B: {
      enun: `Se tienen ${va} = (3, 1) y ${vb} = (−6, −2). Un estudiante afirma:`,
      cita: `«Como son dos vectores en R², el conjunto {${va}, ${vb}} genera todo R².»`,
      ops: [
        { t: `Es incorrecto. El conjunto solo genera los vectores ubicados sobre la recta que pasa por el origen con la dirección de ${va}.`, ok: 1 },
        { t: 'Es correcto. Dos vectores en R² siempre generan R².', err: 'E_CONTEO' },
        { t: 'Es incorrecto. Al ser dependiente, el conjunto no genera ningún vector.', err: 'E_DEP_NADA' },
        { t: 'Es correcto. Al ser opuestos, sus combinaciones cubren ambos lados del plano.', err: 'E_OPUESTOS_IND' }
      ],
      exp: `${vb} = −2${va}, así que toda combinación α${va} + β${vb} es un múltiplo de ${va}. El conjunto genera una recta, no el plano. Por ejemplo, (0, 1) no puede generarse.`
    }
  },
  { id: 'P3', h: 'H3', abierta: 1,
    A: {
      enun: 'Verifica la validez de la siguiente afirmación:',
      cita: '«Si dos vectores no nulos de R² forman un conjunto dependiente, entonces tienen la misma dirección y el mismo sentido.»',
      ops: [
        { t: 'Falsa. Pueden ser opuestos: uno es un múltiplo negativo del otro.', ok: 1 },
        { t: 'Verdadera. Si uno es múltiplo del otro, ambos apuntan hacia el mismo lado.', err: 'E_SENTIDO' },
        { t: 'Verdadera. Si tuvieran sentidos contrarios, el conjunto sería independiente.', err: 'E_OPUESTOS_IND' },
        { t: 'Falsa. Dos vectores dependientes también pueden ser ortogonales.', err: 'E_ORTO' }
      ],
      exp: `Dependiente significa que uno es múltiplo del otro, y el múltiplo puede ser negativo. ${va} = (1, 2) y ${vb} = (−2, −4) forman un conjunto dependiente con sentidos contrarios. Este contraejemplo basta para negar la afirmación.`
    },
    B: {
      enun: 'Verifica la validez de la siguiente afirmación:',
      cita: '«Si dos vectores no nulos de R² forman un conjunto dependiente, entonces sus vectores unitarios asociados son iguales.»',
      ops: [
        { t: 'Falsa. Pueden ser opuestos, y en ese caso sus vectores unitarios también son opuestos.', ok: 1 },
        { t: 'Verdadera. Si uno es múltiplo del otro, al llevarlos a distancia 1 coinciden.', err: 'E_SENTIDO' },
        { t: 'Verdadera. Si los unitarios fueran distintos, el conjunto sería independiente.', err: 'E_OPUESTOS_IND' },
        { t: 'Falsa. Dos vectores dependientes también pueden ser ortogonales.', err: 'E_ORTO' }
      ],
      exp: `Dependiente significa que uno es múltiplo del otro, y el múltiplo puede ser negativo. ${va} = (3, 4) y ${vb} = (−3, −4) forman un conjunto dependiente y sus unitarios son (0.6, 0.8) y (−0.6, −0.8). Este contraejemplo basta para negar la afirmación.`
    }
  },
  { id: 'P4', h: 'H4',
    A: {
      enun: 'Verifica la validez de la siguiente afirmación:',
      cita: `«El conjunto {${va}, ∅} en R², con ${va} no nulo, es independiente porque ${va} no es múltiplo del vector nulo.»`,
      ops: [
        { t: `Falsa. 0${va} + 1∅ = ∅ es una solución distinta de la trivial, así que el conjunto es dependiente.`, ok: 1 },
        { t: 'Verdadera. El vector nulo no aporta dirección, así que no altera la independencia.', err: 'E_NULO_NEUTRO' },
        { t: 'Verdadera. Para que sea dependiente, cada vector debe ser múltiplo del otro.', err: 'E_MUTUO' },
        { t: 'Falsa. Es dependiente porque un solo vector no nulo no puede generar R².', err: 'E_NULO_GENERA' }
      ],
      exp: `Basta que un vector del conjunto sea combinación lineal de los demás. Aquí ∅ = 0${va}. En la ecuación α${va} + β∅ = ∅ sirve cualquier β con α = 0, así que hay soluciones no triviales.`
    },
    B: {
      enun: 'Verifica la validez de la siguiente afirmación:',
      cita: '«Un conjunto de dos vectores de R² que contiene al vector nulo es independiente siempre que el otro vector no sea nulo.»',
      ops: [
        { t: 'Falsa. El escalar que acompaña al vector nulo puede ser cualquiera, así que existe una solución distinta de la trivial.', ok: 1 },
        { t: 'Verdadera. El vector nulo no aporta dirección, así que no altera la independencia.', err: 'E_NULO_NEUTRO' },
        { t: 'Verdadera. Para que sea dependiente, cada vector debe ser múltiplo del otro.', err: 'E_MUTUO' },
        { t: 'Falsa. Es dependiente porque un solo vector no nulo no puede generar R².', err: 'E_NULO_GENERA' }
      ],
      exp: `Basta que un vector del conjunto sea combinación lineal de los demás, y el nulo siempre lo es: ∅ = 0${va}. Todo conjunto que contiene al vector nulo es dependiente.`
    }
  },
  { id: 'P5', h: 'H5', abierta: 1,
    A: {
      enun: 'Verifica la validez de la siguiente afirmación:',
      cita: `«Si la ecuación α${va} + β${vb} = ∅ se cumple con α = β = 0, entonces el conjunto {${va}, ${vb}} es independiente.»`,
      ops: [
        { t: 'Falsa. Esa solución se cumple en cualquier conjunto. Es independiente solo si es la única.', ok: 1 },
        { t: 'Verdadera. La solución trivial es la que define a un conjunto independiente.', err: 'E_TRIVIAL_BASTA' },
        { t: 'Falsa. Un conjunto independiente requiere escalares distintos de cero.', err: 'E_INVERSION' },
        { t: `Verdadera, siempre que ${va} y ${vb} sean no nulos.`, err: 'E_CONDICION_EXTRA' }
      ],
      exp: `α = β = 0 cumple la ecuación para cualquier par de vectores, incluso para ${va} = (1, 2) y ${vb} = (2, 4), que son dependientes. La independencia exige que la solución trivial sea la única.`
    },
    B: {
      enun: 'Verifica la validez de la siguiente afirmación:',
      cita: `«Para demostrar que {${va}, ${vb}} es independiente basta comprobar que 0${va} + 0${vb} = ∅.»`,
      ops: [
        { t: 'Falsa. Esa igualdad se cumple en cualquier conjunto. Hay que demostrar que no existe otra solución.', ok: 1 },
        { t: 'Verdadera. La solución trivial es la que define a un conjunto independiente.', err: 'E_TRIVIAL_BASTA' },
        { t: 'Falsa. Un conjunto independiente requiere escalares distintos de cero.', err: 'E_INVERSION' },
        { t: `Verdadera, siempre que ${va} y ${vb} sean no nulos.`, err: 'E_CONDICION_EXTRA' }
      ],
      exp: `0${va} + 0${vb} = ∅ se cumple para cualquier par de vectores, incluso para ${va} = (1, 3) y ${vb} = (2, 6), que son dependientes. La independencia exige que la solución trivial sea la única.`
    }
  },
  { id: 'P6', h: 'H6',
    A: {
      enun: `En R², ${va} y ${vb} forman un conjunto independiente. Se agrega un tercer vector ${vc} cualquiera. El conjunto {${va}, ${vb}, ${vc}} es:`,
      ops: [
        { t: `Siempre dependiente, porque ${vc} puede expresarse como combinación lineal de ${va} y ${vb}.`, ok: 1 },
        { t: `Dependiente solo si ${vc} es múltiplo de ${va} o de ${vb}.`, err: 'E_PARES' },
        { t: `Independiente si ${vc} tiene una dirección distinta a las de ${va} y ${vb}.`, err: 'E_PARES' },
        { t: `Depende de ${vc}: no puede saberse sin conocer sus elementos.`, err: 'E_NOSABE' }
      ],
      exp: `Un conjunto independiente de dos vectores en R² es base y genera todo el plano, incluido ${vc}. Entonces ${vc} = α${va} + β${vb} y el conjunto es dependiente. Todo conjunto con más vectores que dimensiones es dependiente.`
    },
    B: {
      enun: 'En R² se tienen tres vectores no nulos con tres direcciones distintas, de modo que ninguno es múltiplo de otro. El conjunto formado por los tres es:',
      ops: [
        { t: 'Siempre dependiente, porque uno de ellos puede expresarse como combinación lineal de los otros dos.', ok: 1 },
        { t: 'Dependiente solo si alguno fuera múltiplo de otro, lo cual aquí no ocurre.', err: 'E_PARES' },
        { t: 'Independiente, porque las tres direcciones son distintas.', err: 'E_PARES' },
        { t: 'Depende de los vectores: no puede saberse sin conocer sus elementos.', err: 'E_NOSABE' }
      ],
      exp: 'Dos de ellos ya forman un conjunto independiente en R², que es base y genera todo el plano, incluido el tercero. Todo conjunto con más vectores que dimensiones es dependiente.'
    }
  },
  { id: 'P7', h: 'H7', abierta: 1,
    A: {
      enun: 'Verifica la validez de la siguiente afirmación:',
      cita: '«En R³, si tres vectores no nulos cumplen que ninguno es múltiplo de otro, entonces forman un conjunto independiente.»',
      ops: [
        { t: 'Falsa. Si los tres están contenidos en un mismo plano que pasa por el origen, uno es combinación lineal de los otros dos.', ok: 1 },
        { t: 'Verdadera. No hay vectores superpuestos, opuestos ni nulos, que son los casos de dependencia.', err: 'E_PARES' },
        { t: 'Verdadera. Tres vectores no nulos en R³ siempre forman un conjunto base.', err: 'E_CONTEO' },
        { t: 'Falsa. Tres vectores en R³ siempre forman un conjunto dependiente.', err: 'E_N_MAS_1' }
      ],
      exp: `Contraejemplo: ${va} = (1, 0, 0), ${vb} = (0, 1, 0) y ${vc} = (1, 1, 0). Ninguno es múltiplo de otro, pero ${vc} = ${va} + ${vb}. Los tres están en el mismo plano y el conjunto es dependiente.`
    },
    B: {
      enun: `En R³, ${va} y ${vb} forman un conjunto independiente y ${vc} = 2${va} − ${vb}. Un estudiante afirma:`,
      cita: `«${vc} no es múltiplo de ${va} ni de ${vb}. Por lo tanto, {${va}, ${vb}, ${vc}} es independiente.»`,
      ops: [
        { t: `Es incorrecto. ${vc} está contenido en el plano que generan ${va} y ${vb}, así que es combinación lineal de ellos.`, ok: 1 },
        { t: 'Es correcto. No hay vectores superpuestos, opuestos ni nulos, que son los casos de dependencia.', err: 'E_PARES' },
        { t: 'Es correcto. Tres vectores no nulos en R³ siempre forman un conjunto base.', err: 'E_CONTEO' },
        { t: 'Es incorrecto, porque tres vectores en R³ siempre forman un conjunto dependiente.', err: 'E_N_MAS_1' }
      ],
      exp: `2${va} − ${vb} − ${vc} = ∅ es una solución distinta de la trivial. Que ningún vector sea múltiplo de otro descarta la dependencia por pares, pero en R³ tres vectores también son dependientes cuando comparten un plano.`
    }
  }
];
