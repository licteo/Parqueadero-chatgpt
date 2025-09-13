let activos = [];
let reportes = [];

document.getElementById("tipo").addEventListener("change", function() {
  const subtipoContainer = document.getElementById("subtipoContainer");
  subtipoContainer.style.display = this.value === "Buseta" ? "block" : "none";
});

document.getElementById("formRegistro").addEventListener("submit", function(e) {
  e.preventDefault();
  const placa = document.getElementById("placa").value;
  const tipo = document.getElementById("tipo").value;
  const subtipo = tipo === "Buseta" ? document.getElementById("subtipo").value : "";
  const propietario = document.getElementById("propietario").value;
  const precio = document.getElementById("precio").value;
  const ingreso = new Date().toLocaleString();

  const vehiculo = { placa, tipo, subtipo, propietario, precio, ingreso, salida: null };
  activos.push(vehiculo);
  actualizarTablaActivos();
  this.reset();
  document.getElementById("subtipoContainer").style.display = "none";
});

function actualizarTablaActivos() {
  const tbody = document.querySelector("#tablaActivos tbody");
  tbody.innerHTML = "";
  activos.forEach((v, i) => {
    const fila = `
      <tr>
        <td>${v.placa}</td>
        <td>${v.tipo}</td>
        <td>${v.subtipo || "-"}</td>
        <td>${v.propietario}</td>
        <td>${v.precio}</td>
        <td>${v.ingreso}</td>
        <td><button onclick="darSalida(${i})">Dar salida</button></td>
      </tr>`;
    tbody.innerHTML += fila;
  });
}

function darSalida(index) {
  const vehiculo = activos[index];
  vehiculo.salida = new Date().toLocaleString();
  reportes.push(vehiculo);
  mostrarToast(`✅ Vehículo placa ${vehiculo.placa} salió a las ${vehiculo.salida}`);
  activos.splice(index, 1);
  actualizarTablaActivos();
}

function generarReporte(tipo) {
  const tbody = document.querySelector("#tablaReportes tbody");
  tbody.innerHTML = "";
  let datos = [];
  const hoy = new Date();
  if (tipo === "diario") {
    datos = reportes.filter(v => new Date(v.ingreso).toDateString() === hoy.toDateString());
  } else if (tipo === "mensual") {
    datos = reportes.filter(v => new Date(v.ingreso).getMonth() === hoy.getMonth() &&
                                 new Date(v.ingreso).getFullYear() === hoy.getFullYear());
  } else {
    datos = reportes;
  }
  datos.forEach(v => {
    const fila = `
      <tr>
        <td>${v.placa}</td>
        <td>${v.tipo}</td>
        <td>${v.subtipo || "-"}</td>
        <td>${v.propietario}</td>
        <td>${v.precio}</td>
        <td>${v.ingreso}</td>
        <td>${v.salida || "-"}</td>
      </tr>`;
    tbody.innerHTML += fila;
  });
}

function imprimirReporte() {
  const tabla = document.getElementById("tablaReportes").outerHTML;
  const ventana = window.open("", "_blank");
  ventana.document.write(`<html><head><title>Reporte</title></head><body>${tabla}</body></html>`);
  ventana.print();
}

function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.className = "toast show";
  setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}
