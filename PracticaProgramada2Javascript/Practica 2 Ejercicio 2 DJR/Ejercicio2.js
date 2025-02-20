document.addEventListener("DOMContentLoaded", function () {
    const usuarios = [];
    let usuarioEditandoId = null;

    const formularioUsuario = document.querySelector("form");
    const tablaUsuariosBody = document.querySelector("tbody");
    const botonModoOscuro = document.getElementById("toggleDarkMode");
    const pagina = document.body;

    function generarIdUnico() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    function actualizarTablaUsuarios() {
        tablaUsuariosBody.innerHTML = "";

        usuarios.forEach((usuario, indice) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${indice + 1}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.correo}</td>
                <td>${usuario.cargo}</td>
                <td>
                    <button class="btn btn-warning btn-editar" data-id="${usuario.id}">Editar</button>
                    <button class="btn btn-danger btn-eliminar" data-id="${usuario.id}">Eliminar</button>
                </td>
            `;
            tablaUsuariosBody.appendChild(fila);
        });

        document.querySelectorAll(".btn-editar").forEach(boton => {
            boton.addEventListener("click", manejarEdicion);
        });

        document.querySelectorAll(".btn-eliminar").forEach(boton => {
            boton.addEventListener("click", manejarEliminacion);
        });
    }

    formularioUsuario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("email").value.trim();
        const cargo = document.getElementById("rol").value;

        if (!nombre || !correo || cargo === "Seleccion un rol") {
            alert("Por favor, complete todos los campos correctamente.");
            return;
        }

        if (usuarioEditandoId) {
            const indice = usuarios.findIndex(usuario => usuario.id === usuarioEditandoId);
            usuarios[indice] = { ...usuarios[indice], nombre, correo, cargo };
            usuarioEditandoId = null;
        } else {
            usuarios.push({ id: generarIdUnico(), nombre, correo, cargo });
        }

        actualizarTablaUsuarios();
        formularioUsuario.reset();
    });

    function manejarEdicion(evento) {
        const usuarioId = evento.target.getAttribute("data-id");
        const usuario = usuarios.find(usuario => usuario.id === usuarioId);

        if (usuario) {
            document.getElementById("nombre").value = usuario.nombre;
            document.getElementById("email").value = usuario.correo;
            document.getElementById("rol").value = usuario.cargo;
            usuarioEditandoId = usuarioId;
        }
    }

    function manejarEliminacion(evento) {
        const usuarioId = evento.target.getAttribute("data-id");
        usuarios.splice(usuarios.findIndex(usuario => usuario.id === usuarioId), 1);
        actualizarTablaUsuarios();
    }

    botonModoOscuro.addEventListener("click", function () {
        pagina.classList.toggle("dark-mode");
        botonModoOscuro.textContent = pagina.classList.contains("dark-mode") ? "Modo Claro" : "Modo Oscuro";
    });

    usuarios.push({
        id: generarIdUnico(),
        nombre: "Juan Pérez",
        correo: "juanperez@gmail.com",
        cargo: "Administrador"
    });

    actualizarTablaUsuarios();
});


