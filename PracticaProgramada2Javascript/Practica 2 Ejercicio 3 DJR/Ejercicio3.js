document.addEventListener('DOMContentLoaded', () => {
    const formularioProducto = document.getElementById('producto-form');
    const listaDeProductos = document.getElementById('lista-productos');
    const filtroDeCategoria = document.getElementById('filtro-categoria');
    let listaProductos = [];

    formularioProducto.addEventListener('submit', añadirProducto);
    filtroDeCategoria.addEventListener('change', filtrarPorCategoria);

    function añadirProducto(evento) {
        evento.preventDefault();

        const nombreDelProducto = document.getElementById('nombre').value.trim();
        const precioDelProducto = document.getElementById('precio').value.trim();
        const categoriaDelProducto = document.getElementById('categoria').value;

        if (!nombreDelProducto || !precioDelProducto || !categoriaDelProducto) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        const nuevoProducto = {
            nombre: nombreDelProducto,
            precio: parseFloat(precioDelProducto).toFixed(2),
            categoria: categoriaDelProducto
        };

        listaProductos.push(nuevoProducto);
        formularioProducto.reset();
        actualizarListaProductos();
    }

    function actualizarListaProductos(productosFiltrados = listaProductos) {
        listaDeProductos.innerHTML = '';

        productosFiltrados.forEach((producto, indice) => {
            const itemLista = document.createElement('li');
            itemLista.innerHTML = `
                <span>${producto.nombre} - $${producto.precio} - ${producto.categoria}</span>
                <button class="boton-eliminar" data-indice="${indice}">Eliminar</button>
            `;
            listaDeProductos.appendChild(itemLista);
        });

        document.querySelectorAll('.boton-eliminar').forEach(boton => {
            boton.addEventListener('click', eliminarProducto);
        });
    }

    function eliminarProducto(evento) {
        const indiceProducto = evento.target.getAttribute('data-indice');
        listaProductos.splice(indiceProducto, 1);
        actualizarListaProductos();
    }

    function filtrarPorCategoria() {
        const categoriaSeleccionada = filtroDeCategoria.value;

        const productosFiltrados = categoriaSeleccionada === 'Todos'
            ? listaProductos
            : listaProductos.filter(producto => producto.categoria === categoriaSeleccionada);

        actualizarListaProductos(productosFiltrados);
    }
});
