let vehiculos = [];
let historial = [];

document.getElementById("registroForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const placa = document.getElementById("placa").value;
  const tipo = document.getElementById("tipo").value;
  const subtipo = document.getElementById("subtipo").value;
  const propietario = document.getElementById("propietario").value;
  const precio = document.getElementById("precio").value;
  const ingreso = new Date().toLocaleString();

  vehiculos.push({ placa, tipo, subtipo, propietario, precio, ingreso });
  this.reset();
  mostrarVehiculos();
});

function mostrarVehiculos() {
  const contenedor = document.getElementById("vehiculosActivos");
  if (vehiculos.length === 0) {
    contenedor.innerHTML = "<p class='text-gray-500'>No hay vehículos activos.</p>";
    return;
  }
  let tabla = `<table class="w-full text-sm text-center border border-gray-200">
    <thead class="bg-blue-600 text-white">
      <tr>
        <th class="p-2">Placa</th>
        <th class="p-2">Tipo</th>
        <th class="p-2">Subtipo</th>
        <th class="p-2">Propietario</th>
        <th class="p-2">Precio</th>
        <th class="p-2">Ingreso</th>
        <th class="p-2">Acción</th>
      </tr>
    </thead>
    <tbody>`;

  vehiculos.forEach((v, index) => {
    tabla += `<tr class="border-t">
      <td class="p-2">${v.placa}</td>
      <td class="p-2">${v.tipo}</td>
      <td class="p-2">${v.subtipo}</td>
      <td class="p-2">${v.propietario}</td>
      <td class="p-2">$${v.precio}</td>
      <td class="p-2">${v.ingreso}</td>
      <td class="p-2"><button class="bg-red-600 hover:bg-red-800 text-white py-1 px-3 rounded" onclick="darSalida(${index})">Dar salida</button></td>
    </tr>`;
  });

  tabla += "</tbody></table>";
  contenedor.innerHTML = tabla;
}

function darSalida(index) {
  const vehiculo = vehiculos[index];
  historial.push({ ...vehiculo, salida: new Date().toLocaleString() });
  vehiculos.splice(index, 1);
  mostrarVehiculos();
  generarReporte();
  mostrarToast(`Vehículo ${vehiculo.placa} salió ✅`);
}

function imprimirReporte() {
  const contenido = document.getElementById("reporteTabla").innerHTML;
  const ventana = window.open("", "", "width=800,height=600");
  ventana.document.write("<html><head><title>Reporte</title>");
  ventana.document.write('<script src="https://cdn.tailwindcss.com"></script></head><body class="p-6">');
  ventana.document.write("<h2 class='text-2xl font-bold mb-4'>Reporte de Vehículos</h2>");
  ventana.document.write(contenido);
  ventana.document.write("</body></html>");
  ventana.document.close();
  ventana.print();
}

function generarReporte() {
  const contenedor = document.getElementById("reporteTabla");
  if (historial.length === 0) {
    contenedor.innerHTML = "<p class='text-gray-500'>No hay registros en el reporte.</p>";
    return;
  }
  let tabla = `<table class="w-full text-sm text-center border border-gray-200">
    <thead class="bg-green-600 text-white">
      <tr>
        <th class="p-2">Placa</th>
        <th class="p-2">Tipo</th>
        <th class="p-2">Subtipo</th>
        <th class="p-2">Propietario</th>
        <th class="p-2">Precio</th>
        <th class="p-2">Ingreso</th>
        <th class="p-2">Salida</th>
      </tr>
    </thead>
    <tbody>`;

  historial.forEach(v => {
    tabla += `<tr class="border-t">
      <td class="p-2">${v.placa}</td>
      <td class="p-2">${v.tipo}</td>
      <td class="p-2">${v.subtipo}</td>
      <td class="p-2">${v.propietario}</td>
      <td class="p-2">$${v.precio}</td>
      <td class="p-2">${v.ingreso}</td>
      <td class="p-2">${v.salida}</td>
    </tr>`;
  });

  tabla += "</tbody></table>";
  contenedor.innerHTML = tabla;
}

function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  toast.innerText = mensaje;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}

generarReporte();
