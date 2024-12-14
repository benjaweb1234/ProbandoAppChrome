// apv.js

// Función para calcular el determinante de una matriz 3x3 usando Sarrus
function determinantSarrus(matrix) {
  if (matrix.length !== 3 || matrix[0].length !== 3) {
    throw new Error('La matriz debe ser de 3x3.');
  }

  const [[a11, a12, a13], [a21, a22, a23], [a31, a32, a33]] = matrix;

  return (
    a11 * a22 * a33 +
    a12 * a23 * a31 +
    a13 * a21 * a32 -
    (a13 * a22 * a31 + a11 * a23 * a32 + a12 * a21 * a33)
  );
}

// Función para resolver un sistema de 3x3 por el método de Cramer
function cramer3x3(A, B) {
  if (A.length !== 3 || A[0].length !== 3 || B.length !== 3) {
    throw new Error('El sistema debe ser de 3x3.');
  }

  const detA = determinantSarrus(A);

  if (detA === 0) {
    throw new Error('El sistema no tiene solución única (det(A) = 0).');
  }

  // Calcular A1, A2, A3
  const A1 = A.map((row, i) => [B[i], row[1], row[2]]);
  const A2 = A.map((row, i) => [row[0], B[i], row[2]]);
  const A3 = A.map((row, i) => [row[0], row[1], B[i]]);

  const detA1 = determinantSarrus(A1);
  const detA2 = determinantSarrus(A2);
  const detA3 = determinantSarrus(A3);

  // Soluciones
  const x = detA1 / detA;
  const y = detA2 / detA;
  const z = detA3 / detA;

  return { x, y, z, detA, detA1, detA2, detA3 };
}

// Función para parsear las ecuaciones y extraer los coeficientes
function parseEcuacion(ecuacion) {
  const ecuacionSinEspacios = ecuacion.replace(/\s+/g, '');
  const regex = /([+-]?\d*\.?\d*)([xyz])/g;
  const matches = [...ecuacionSinEspacios.matchAll(regex)];
  const coeficientes = { x: 0, y: 0, z: 0 };

  matches.forEach((match) => {
    const coef =
      match[1] === '' || match[1] === '+'
        ? 1
        : match[1] === '-'
        ? -1
        : parseFloat(match[1]);
    coeficientes[match[2]] = coef;
  });

  const resultado = parseFloat(ecuacionSinEspacios.split('=')[1]);
  return { coeficientes, resultado };
}

// Función para validar que las ecuaciones no contengan espacios
function validarEcuacionSinEspacios(ecuacion) {
  return !/\s/.test(ecuacion);
}

// Función para resolver las ecuaciones ingresadas
function resolverEcuaciones() {
  const ecuacion1 = document.getElementById('ecuacion1').value.trim();
  const ecuacion2 = document.getElementById('ecuacion2').value.trim();
  const ecuacion3 = document.getElementById('ecuacion3').value.trim();

  if (
    !validarEcuacionSinEspacios(ecuacion1) ||
    !validarEcuacionSinEspacios(ecuacion2) ||
    !validarEcuacionSinEspacios(ecuacion3)
  ) {
    document.getElementById(
      'resultado'
    ).innerHTML = `<div class="alert alert-danger">Las ecuaciones no deben contener espacios.</div>`;
    return;
  }

  try {
    const { coeficientes: coef1, resultado: res1 } = parseEcuacion(ecuacion1);
    const { coeficientes: coef2, resultado: res2 } = parseEcuacion(ecuacion2);
    const { coeficientes: coef3, resultado: res3 } = parseEcuacion(ecuacion3);

    const A = [
      [coef1.x, coef1.y, coef1.z],
      [coef2.x, coef2.y, coef2.z],
      [coef3.x, coef3.y, coef3.z],
    ];

    const B = [res1, res2, res3];

    const soluciones = cramer3x3(A, B);

    mostrarResultados(soluciones, A, B);
  } catch (error) {
    document.getElementById(
      'resultado'
    ).innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}

// Función para mostrar los resultados y los pasos
function mostrarResultados(soluciones, A, B) {
  const { x, y, z, detA, detA1, detA2, detA3 } = soluciones;

  const D_1 =
    A[0][0] * A[1][1] * A[2][2] +
    A[0][1] * A[1][2] * A[2][0] +
    A[0][2] * A[1][0] * A[2][1];
  const D_2 = -(
    A[0][2] * A[1][1] * A[2][0] +
    A[0][0] * A[1][2] * A[2][1] +
    A[0][1] * A[1][0] * A[2][2]
  );

  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerHTML = `

  <h3>Sistema de Ecuaciones</h3>
  <p>Consideremos el siguiente sistema de ecuaciones:</p>
  <div class="border p-3 bg-white">
      \\[
      \\begin{align*}
      ${A[0][0]}x + ${A[0][1]}y + ${A[0][2]}z &= ${B[0]} \\\\
      ${A[1][0]}x + ${A[1][1]}y + ${A[1][2]}z &= ${B[1]} \\\\
      ${A[2][0]}x + ${A[2][1]}y + ${A[2][2]}z &= ${B[2]}
      \\end{align*}
      \\]
  </div>

  <h3>Método de Determinantes (Método de Cramer)</h3>
  <p>Para resolver este sistema, utilizaremos el método de Cramer, que implica calcular los determinantes.</p>

  <h4>Determinante del Sistema</h4>
  <p>El determinante del sistema se calcula como sigue:</p>
  <div class="border p-3 bg-white">
      \\[
      D =
      \\begin{vmatrix}
      ${A[0][0]} & ${A[0][1]} & ${A[0][2]} \\\\
      ${A[1][0]} & ${A[1][1]} & ${A[1][2]} \\\\
      ${A[2][0]} & ${A[2][1]} & ${A[2][2]}
      \\end{vmatrix}
      \\]
  </div>

  <h4>Cálculo del Determinante</h4>
  <p>Multiplicamos las diagonales principales:</p>
  <ul>
      <li>Primera diagonal: ${A[0][0]} * ${A[1][1]} * ${A[2][2]} = ${
    A[0][0] * A[1][1] * A[2][2]
  }</li>
      <li>Segunda diagonal: ${A[0][1]} * ${A[1][2]} * ${A[2][0]} = ${
    A[0][1] * A[1][2] * A[2][0]
  }</li>
      <li>Tercera diagonal: ${A[0][2]} * ${A[1][0]} * ${A[2][1]} = ${
    A[0][2] * A[1][0] * A[2][1]
  }</li>
  </ul>
  <p>Suma: D_1 = ${D_1}</p>

  <p>Multiplicamos las diagonales secundarias:</p>
  <ul>
      <li>Primera secundaria: ${A[0][2]} * ${A[1][1]} * ${A[2][0]} = ${
    A[0][2] * A[1][1] * A[2][0]
  }</li>
      <li>Segunda secundaria: ${A[0][0]} * ${A[1][2]} * ${A[2][1]} = ${
    A[0][0] * A[1][2] * A[2][1]
  }</li>
      <li>Tercera secundaria: ${A[0][1]} * ${A[1][0]} * ${A[2][2]} = ${
    A[0][1] * A[1][0] * A[2][2]
  }</li>
  </ul>
  <p>Suma: D_2 = ${D_2}</p>

  <h4>Determinante Final</h4>
  <p>Por lo tanto, el determinante del sistema es:</p>
  \\[
  D = D_1 + D_2 = ${D_1} - (${D_2}) = ${detA}
  \\]

  <h4>Determinantes para x, y, z</h4>

  <!-- Determinante para x -->
  <h5>Determinante para x (Dx)</h5>
  <div class="border p-3 bg-white">
      \\[
      D_x =
      \\begin{vmatrix}
      ${B[0]} & ${A[0][1]} & ${A[0][2]} \\\\
      ${B[1]} & ${A[1][1]} & ${A[1][2]} \\\\
      ${B[2]} & ${A[2][1]} & ${A[2][2]}
      \\end{vmatrix}
      \\]
  </div>

  <!-- Cálculo de Dx -->
  <p>Cálculo de \\(D_x\\):</p>
  <ul>
      <li>Primera diagonal: ${B[0]} * ${A[1][1]} * ${A[2][2]} = ${
    B[0] * A[1][1] * A[2][2]
  }</li>
      <li>Segunda diagonal: ${A[0][1]} * ${A[1][2]} * ${B[2]} = ${
    A[0][1] * A[1][2] * B[2]
  }</li>
      <li>Tercera diagonal: ${A[0][2]} * ${B[1]} * ${A[2][0]} = ${
    A[0][2] * B[1] * A[2][0]
  }</li>
  </ul>
  <p>Suma de diagonales principales: D_{x_1} = ${B[0] * A[1][1] * A[2][2]} + ${
    A[0][1] * A[1][2] * B[2]
  } + ${A[0][2] * B[1] * A[2][0]}</p>

  <p>Multiplicamos las diagonales secundarias:</p>
  <ul>
      <li>Primera secundaria: ${A[0][2]} * ${A[1][1]} * ${B[2]} = ${
    A[0][2] * A[1][1] * B[2]
  }</li>
      <li>Segunda secundaria: ${B[0]} * ${A[1][2]} * ${A[2][0]} = ${
    B[0] * A[1][2] * A[2][0]
  }</li>
      <li>Tercera secundaria: ${A[0][1]} * ${B[1]} * ${A[2][2]} = ${
    A[0][1] * B[1] * A[2][2]
  }</li>
  </ul>
  <p>Suma de diagonales secundarias: D_{x_2} = ${A[0][2] * A[1][1] * B[2]} + ${
    B[0] * A[1][2] * A[2][0]
  } + ${A[0][1] * B[1] * A[2][2]}</p>
  <p>Por lo tanto: D_x = D_{x1} - D_{x2} = ${B[0] * A[1][1] * A[2][2]} + ${
    A[0][1] * A[1][2] * B[2]
  } + ${A[0][2] * B[1] * A[2][0]} - (${A[0][2] * A[1][1] * B[2]} + ${
    B[0] * A[1][2] * A[2][0]
  } + ${A[0][1] * B[1] * A[2][2]}) = ${detA1}</p>

  Finalmente:
  \\[
  X = \\frac{D_x}{D} = \\frac{${detA1}}{${detA}} = ${x}
  \\]

  <!-- Determinante para y -->
  <h5>Determinante para y (Dy)</h5>
  <div class="border p-3 bg-white">
      \\[
      D_y =
      \\begin{vmatrix}
      ${A[0][0]} & ${B[0]} & ${A[0][2]} \\\\
      ${A[1][0]} & ${B[1]} & ${A[1][2]} \\\\
      ${A[2][0]} & ${B[2]} & ${A[2][2]}
      \\end{vmatrix}
      \\]
  </div>

  <!-- Cálculo de Dy -->
  <p>Cálculo de \\(D_y\\):</p>
  <ul>
      <li>Primera diagonal: ${A[0][0]} * ${B[1]} * ${A[2][2]} = ${
    A[0][0] * B[1] * A[2][2]
  }</li>
      <li>Segunda diagonal: ${B[0]} * ${A[1][2]} * ${A[2][0]} = ${
    B[0] * A[1][2] * A[2][0]
  }</li>
      <li>Tercera diagonal: ${A[0][2]} * ${A[1][0]} * ${B[2]} = ${
    A[0][2] * A[1][0] * B[2]
  }</li>
  </ul>
  <p>Suma de diagonales principales: D_{y_1} = ${A[0][0] * B[1] * A[2][2]} + ${
    B[0] * A[1][2] * A[2][0]
  } + ${A[0][2] * A[1][0] * B[2]}</p>

  <p>Multiplicamos las diagonales secundarias:</p>
  <ul>
      <li>Primera secundaria: ${A[0][2]} * ${B[1]} * ${A[2][0]} = ${
    A[0][2] * B[1] * A[2][0]
  }</li>
      <li>Segunda secundaria: ${B[0]} * ${A[1][0]} * ${A[2][2]} = ${
    B[0] * A[1][0] * A[2][2]
  }</li>
      <li>Tercera secundaria: ${A[0][0]} * ${A[1][2]} * ${B[2]} = ${
    A[0][0] * A[1][2] * B[2]
  }</li>
  </ul>
  <p>Suma de diagonales secundarias: D_{y_2} = ${A[0][2] * B[1] * A[2][0]} + ${
    B[0] * A[1][0] * A[2][2]
  } + ${A[0][0] * A[1][2] * B[2]}</p>
  <p>Por lo tanto: D_y = D_{y1} - D_{y2} = ${A[0][0] * B[1] * A[2][2]} + ${
    B[0] * A[1][2] * A[2][0]
  } + ${A[0][2] * A[1][0] * B[2]} - (${A[0][2] * B[1] * A[2][0]} + ${
    B[0] * A[1][0] * A[2][2]
  } + ${A[0][0] * A[1][2] * B[2]}) = ${detA2}</p>

  Finalmente:
  \\[
  Y = \\frac{D_y}{D} = \\frac{${detA2}}{${detA}} = ${y}
  \\]

  <!-- Determinante para z -->
  <h5>Determinante para z (Dz)</h5>
  <div class="border p-3 bg-white">
      \\[
      D_z =
      \\begin{vmatrix}
      ${A[0][0]} & ${A[0][1]} & ${B[0]} \\\\
      ${A[1][0]} & ${A[1][1]} & ${B[1]} \\\\
      ${A[2][0]} & ${A[2][1]} & ${B[2]}
      \\end{vmatrix}
      \\]
  </div>

  <!-- Cálculo de Dz -->
  <p>Cálculo de \\(D_z\\):</p>
  <ul>
      <li>Primera diagonal: ${A[0][0]} * ${A[1][1]} * ${B[2]} = ${
    A[0][0] * A[1][1] * B[2]
  }</li>
      <li>Segunda diagonal: ${A[0][1]} * ${B[1]} * ${A[2][0]} = ${
    A[0][1] * B[1] * A[2][0]
  }</li>
      <li>Tercera diagonal: ${B[0]} * ${A[1][0]} * ${A[2][1]} = ${
    B[0] * A[1][0] * A[2][1]
  }</li>
  </ul>
  <p>Suma de diagonales principales: D_{z_1} = ${A[0][0] * A[1][1] * B[2]} + ${
    A[0][1] * B[1] * A[2][0]
  } + ${B[0] * A[1][0] * A[2][1]}</p>

  <p>Multiplicamos las diagonales secundarias:</p>
  <ul>
      <li>Primera secundaria: ${B[0]} * ${A[1][1]} * ${A[2][0]} = ${
    B[0] * A[1][1] * A[2][0]
  }</li>
      <li>Segunda secundaria: ${A[0][1]} * ${A[1][0]} * ${B[2]} = ${
    A[0][1] * A[1][0] * B[2]
  }</li>
      <li>Tercera secundaria: ${A[0][0]} * ${B[1]} * ${A[2][1]} = ${
    A[0][0] * B[1] * A[2][1]
  }</li>
  </ul>
  <p>Suma de diagonales secundarias: D_{z_2} = ${B[0] * A[1][1] * A[2][0]} + ${
    A[0][1] * A[1][0] * B[2]
  } + ${A[0][0] * B[1] * A[2][1]}</p>
  <p>Por lo tanto: D_z = D_{z1} - D_{z2} = ${A[0][0] * A[1][1] * B[2]} + ${
    A[0][1] * B[1] * A[2][0]
  } + ${B[0] * A[1][0] * A[2][1]} - (${B[0] * A[1][1] * A[2][0]} + ${
    A[0][1] * A[1][0] * B[2]
  } + ${A[0][0] * B[1] * A[2][1]}) = ${detA3}</p>

  Finalmente:
  \\[
  Z = \\frac{D_z}{D} = \\frac{${detA3}}{${detA}} = ${z}
  \\]

  <!-- Resultados Finales -->
  <h4>Resultados Finales</h4>
  <p>Los valores obtenidos son:</p>
  <ul>
      <li>X = ${x}</li>
      <li>Y = ${y}</li>
      <li>Z = ${z}</li>
  </ul>
  
  <p>Para verificar la solución, sustituimos los valores en las ecuaciones originales:</p>
  <ul>
      <li>Para la primera ecuación: ${A[0][0]} * ${x} + ${A[0][1]} * ${y} + ${
    A[0][2]
  } * ${z} = ${A[0][0] * x + A[0][1] * y + A[0][2] * z}</li>
      <li>Para la segunda ecuación: ${A[1][0]} * ${x} + ${A[1][1]} * ${y} + ${
    A[1][2]
  } * ${z} = ${A[1][0] * x + A[1][1] * y + A[1][2] * z}</li>
      <li>Para la tercera ecuación: ${A[2][0]} * ${x} + ${A[2][1]} * ${y} + ${
    A[2][2]
  } * ${z} = ${A[2][0] * x + A[2][1] * y + A[2][2] * z}</li>
  </ul>
  
  <!-- Ejercicio Práctico -->
  <footer class="mt-5 text-center">
      <p>Benjamin Rodriguez Ortiz</p>
  </footer>
  `;

  // Actualizar MathJax para renderizar las ecuaciones
  if (window.MathJax) {
    MathJax.typesetPromise();
  }
}
