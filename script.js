const API_URL = "http://localhost:3000/users";
let usuarioEditando = null; // Almacena el ID del usuario en edición

document.getElementById("formulario").addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = document.getElementById("user").value;
  const password = document.getElementById("password").value;

  if (usuarioEditando) {
    // Actualizar usuario existente
    await fetch(`${API_URL}/${usuarioEditando}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user, password: password }),
    });
    usuarioEditando = null;
  } else {
    // Crear nuevo usuario
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user, password: password }),
    });
  }

  document.getElementById("formulario").reset();
  cargarUsuarios();
});

async function cargarUsuarios() {
  const response = await fetch(API_URL);
  const users = await response.json();
  const listaUsuarios = document.getElementById("lista-usuarios");
  listaUsuarios.innerHTML = "";

  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${user.username} 
      <button class="edit-btn" data-id="${user.id}" data-username="${user.username}" data-password="${user.password}">Editar</button>
      <button class="delete-btn" data-id="${user.id}">Eliminar</button>
    `;
    listaUsuarios.appendChild(li);
  });

  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = event.target.getAttribute("data-id");
      const username = event.target.getAttribute("data-username");
      const password = event.target.getAttribute("data-password");
      editarUsuario(id, username, password);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = event.target.getAttribute("data-id");
      eliminarUsuario(id);
    });
  });
}

async function eliminarUsuario(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    cargarUsuarios();
  }
}

function editarUsuario(id, username, password) {
  document.getElementById("user").value = username;
  document.getElementById("password").value = password;
  usuarioEditando = id; // Guarda el ID del usuario en edición
}

// Hacer las funciones accesibles globalmente
window.editarUsuario = editarUsuario;
window.eliminarUsuario = eliminarUsuario;

// Cargar usuarios al iniciar
cargarUsuarios();
