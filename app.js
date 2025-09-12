let vehiculos = [];
let historial = [];

function registrarEntrada() {
  const placa = document.getElementById("placa").value;
  const tipoVehiculo = document.getElementById("tipoVehiculo").value;
  const nombre = document.getElementById("nombre").value;
  const tipoPago = document.getElementById("tipoPago").value;
  const monto = document.getElementById("monto").value;

  if(!placa || !tipoVehiculo || !nombre || !tipoPago) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  const entrada = {
    placa,
    tipoVehiculo,
    nombre,
    tipoPago,
    monto,
    horaEntrada: new Date()
  };

  vehiculos.push(entrada);
  mostrarVehiculos();
  limpiarFormulario();
}

function mostrarVehiculos() {
  const contenedor = document.getElementById("vehiculosActivos");
  contenedor.innerHTML = "";
  if(vehiculos.length === 0) {
    contenedor.innerHTML = "No hay vehículos activos";
    return;
  }

  vehiculos.forEach((v, index) => {
    const div = document.createElement("div");
    div.className = "vehiculo";
    div.innerHTML = `
      <strong>${v.placa}</strong> - ${v.tipoVehiculo}<br>
      Entrada: ${v.horaEntrada.toLocaleString()}<br>
      <button onclick="registrarSalida(${index})">Registrar Salida</button>
    `;
    contenedor.appendChild(div);
  });
}

function registrarSalida(index) {
  const vehiculo = vehiculos[index];
  vehiculo.horaSalida = new Date();

  const duracion = Math.ceil((vehiculo.horaSalida - vehiculo.horaEntrada) / (1000 * 60 * 60));
  vehiculo.duracion = duracion;
  vehiculo.costo = vehiculo.monto * duracion;

  historial.push(vehiculo);
  vehiculos.splice(index, 1);

  mostrarVehiculos();
  mostrarHistorial();
}

function mostrarHistorial() {
  const contenedor = document.getElementById("historialVehiculos");
  contenedor.innerHTML = "";

  historial.forEach(v => {
    const div = document.createElement("div");
    div.className = "historial-item";
    div.innerHTML = `
      <strong>${v.placa}</strong> - ${v.tipoVehiculo}<br>
      Entrada: ${v.horaEntrada.toLocaleString()}<br>
      Salida: ${v.horaSalida.toLocaleString()}<br>
      Duración: ${v.duracion} horas<br>
      Costo Total: $${v.costo}
    `;
    contenedor.appendChild(div);
  });
}

function limpiarFormulario() {
  document.getElementById("placa").value = "";
  document.getElementById("tipoVehiculo").value = "";
  document.getElementById("nombre").value = "";
  document.getElementById("tipoPago").value = "";
  document.getElementById("monto").value = 0;
}
