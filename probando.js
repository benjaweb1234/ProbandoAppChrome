// apv.js

// Función para calcular el determinante de una matriz 3x3 usando Sarrus
function determinantSarrus(matrix) {
    if (matrix.length !== 3 || matrix[0].length !== 3) {
      throw new Error("La matriz debe ser de 3x3.");
    }
  
    const [
      [a11, a12, a13],
      [a21, a22, a23],
      [a31, a32, a33]
    ] = matrix;
  
    return (
      a11 * a22 * a33 + a12 * a23 * a31 + a13 * a21 * a32 - 
      (a13 * a22 * a31 + a11 * a23 * a32 + a12 * a21 * a33)
    );
  }
  
  // Función para resolver un sistema de 3x3 por el método de Cramer
  function cramer3x3(A, B) {
    if (A.length !== 3 || A[0].length !== 3 || B.length !== 3) {
      throw new Error("El sistema debe ser de 3x3.");
    }
  
    const detA = determinantSarrus(A);
  
    if (detA === 0) {
      throw new Error("El sistema no tiene solución única (det(A) = 0).");
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
  
    matches.forEach(match => {
      const coef = match[1] === '' || match[1] === '+' ? 1 : match[1] === '-' ? -1 : parseFloat(match[1]);
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
  
    if (!validarEcuacionSinEspacios(ecuacion1) || !validarEcuacionSinEspacios(ecuacion2) || !validarEcuacionSinEspacios(ecuacion3)) {
      document.getElementById('resultado').innerHTML = `<div class="alert alert-danger">Las ecuaciones no deben contener espacios.</div>`;
      return;
    }
  
    try {
      const { coeficientes: coef1, resultado: res1 } = parseEcuacion(ecuacion1);
      const { coeficientes: coef2, resultado: res2 } = parseEcuacion(ecuacion2);
      const { coeficientes: coef3, resultado: res3 } = parseEcuacion(ecuacion3);
  
      const A = [
        [coef1.x, coef1.y, coef1.z],
        [coef2.x, coef2.y, coef2.z],
        [coef3.x, coef3.y, coef3.z]
      ];
  
      const B = [res1, res2, res3];
  
      const soluciones = cramer3x3(A, B);
  
      mostrarResultados(soluciones, A, B);
    } catch (error) {
      document.getElementById('resultado').innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
  }
  
  // Función para mostrar los resultados y los pasos
  function mostrarResultados(soluciones, A, B) {
    const { x, y, z, detA, detA1, detA2, detA3 } = soluciones;
  
    let resultadoHTML = `
      <h3>Resultados:</h3>
      <p>Determinante de A (D): ${detA}</p>
      <p>Determinante de A1 (Dx): ${detA1}</p>
      <p>Determinante de A2 (Dy): ${detA2}</p>
      <p>Determinante de A3 (Dz): ${detA3}</p>
      <p>x = Dx / D = ${x}</p>
      <p>y = Dy / D = ${y}</p>
      <p>z = Dz / D = ${z}</p>
      <h3>Comprobación:</h3>
    `;
  
    // Comprobación
    const comprobacion1 = A[0][0] * x + A[0][1] * y + A[0][2] * z;
    const comprobacion2 = A[1][0] * x + A[1][1] * y + A[1][2] * z;
    const comprobacion3 = A[2][0] * x + A[2][1] * y + A[2][2] * z;
  
    resultadoHTML += `
      <p>Ecuación 1: ${A[0][0]}*${x} + ${A[0][1]}*${y} + ${A[0][2]}*${z} = ${comprobacion1} (Resultado esperado: ${B[0]})</p>
      <p>Ecuación 2: ${A[1][0]}*${x} + ${A[1][1]}*${y} + ${A[1][2]}*${z} = ${comprobacion2} (Resultado esperado: ${B[1]})</p>
      <p>Ecuación 3: ${A[2][0]}*${x} + ${A[2][1]}*${y} + ${A[2][2]}*${z} = ${comprobacion3} (Resultado esperado: ${B[2]})</p>
    `;
  
    document.getElementById('resultado').innerHTML = resultadoHTML;
  }