document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('transaccion-form');
    const listaTransacciones = document.getElementById('lista-transacciones');
    const resumenCuenta = document.getElementById('resumen-cuenta');
    let transacciones = [];

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        agregarTransaccion();
        form.reset();
    });

    const agregarTransaccion = () => {
        const desc = document.getElementById('descripcion').value;
        const monto = parseFloat(document.getElementById('monto').value);
        transacciones.push({ desc, monto });
        actualizarCuenta();
    };

    const actualizarCuenta = () => {
        listaTransacciones.innerHTML = transacciones.map(t => `<li>${t.desc}: $${t.monto.toFixed(2)}</li>`).join('');
        
        const total = transacciones.reduce((sum, t) => sum + t.monto, 0);
        const totalInteres = total * 1.026;
        const cashBack = total * 0.001;
        const totalFinal = totalInteres - cashBack;

        resumenCuenta.innerHTML = `
            <p>1. Las transacciones registradas, con su descripcion y monto.</p>
            <p>2. El monto total de contado: $${total.toFixed(2)}</p>
            <p>3. El monto total con un interes aplicado del 2.6%: $${totalInteres.toFixed(2)}</p>
            <p>4. El cash back correspondiente (0.1% del monto de contado): $${cashBack.toFixed(2)}</p>
        `;
    };
});


