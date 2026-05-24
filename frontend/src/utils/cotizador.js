// Esta función calcula la cotización del envío
export function calcularCotizacion({
  origenDestino,
  peso,
  nivelServicio,
  recoleccion,
  seguro,
}) {
  // Variables base
  let costoBase = 0;
  let costoDistancia = 0;
  let tiempoEstimado = "";

  // Convertimos el peso a número
  const pesoNumero = Number(peso);

  // Si el peso no es válido, devolvemos null
  if (isNaN(pesoNumero) || pesoNumero <= 0) {
    return null;
  }

  // Costo por peso
  const costoPeso = pesoNumero * 5;

  // Evaluamos tipo de origen y destino
  if (origenDestino === "misma-ciudad") {
    costoBase = 25;
    costoDistancia = 10;
    tiempoEstimado = "Same day or next day";
  } else if (origenDestino === "otro-departamento") {
    costoBase = 40;
    costoDistancia = 20;
    tiempoEstimado = "1 to 3 days";
  } else if (origenDestino === "internacional") {
    costoBase = 90;
    costoDistancia = 50;
    tiempoEstimado = "5 to 10 days";
  }

  // Si el servicio es exprés, se suma costo adicional
  if (nivelServicio === "expres") {
    costoBase += 20;
  }

  // Sumamos extras
  let costoExtras = 0;

  if (recoleccion) {
    costoExtras += 15;
  }

  if (seguro) {
    costoExtras += 15;
  }

  // Calculamos el total
  const total = costoBase + costoPeso + costoDistancia + costoExtras;

  // Retornamos todo el desglose
  return {
    costoBase,
    costoPeso,
    costoDistancia,
    costoExtras,
    total,
    tiempoEstimado,
  };
}