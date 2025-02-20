function calcularDescuentos() {
    const sueldoBruto = parseFloat(document.getElementById("sueldo").value);

    if (isNaN(sueldoBruto) || sueldoBruto <= 0) {
        alert("Ingrese un sueldo válido");
        return;
    }

    const aportesSocialesPorcentaje = 0.105;
    const limiteImpositivo = 941000;
    const tasaImpositiva = 0.15;

    const aportesSociales = sueldoBruto * aportesSocialesPorcentaje;
    const impuestoSobreRenta = sueldoBruto > limiteImpositivo 
        ? (sueldoBruto - limiteImpositivo) * tasaImpositiva 
        : 0;
    const sueldoNeto = sueldoBruto - aportesSociales - impuestoSobreRenta;

    document.getElementById("aportes").textContent = aportesSociales.toFixed(2);
    document.getElementById("impuesto").textContent = impuestoSobreRenta.toFixed(2);
    document.getElementById("netoFinal").textContent = sueldoNeto.toFixed(2);
}
