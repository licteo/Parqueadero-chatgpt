document.addEventListener("DOMContentLoaded", () => {
  mostrarVehiculosActivos();

  document.getElementById("formVehiculo").addEventListener("submit", e => {
    e.preventDefault();
    agregarVehiculo();
  });
});

/* Guardar en LocalStorage */
function agregarVehiculo() {
  const placa = document.getElementById("placa").value;
  const tipo = document.getElementById("tipo").value;
  const propietario = document.getElementById("propietario").value;

  const vehiculo = {
    placa,
    tipo,
    propietario,
    ingreso: new Date().toLocaleString(),
    salida: null
  };

  const vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];
  vehiculos.push(vehiculo);
  localStorage.setItem("vehiculos", JSON.stringify(vehiculos));

  document.getElementById("formVehiculo").reset();
  mostrarVehiculosActivos();
}

/* Mostrar en tabla activos */
function mostrarVehiculosActivos() {
  const activosBody = document.querySelector("#tablaActivos tbody");
  activosBody.innerHTML = "";

  const vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];
  vehiculos.forEach(v => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${v.placa}</td>
      <td>${v.tipo}</td>
      <td>${v.propietario}</td>
      <td>${v.ingreso}</td>
      <td>${v.salida || "-"}</td>
    `;
    activosBody.appendChild(row);
  });
}

/* Reporte Diario */
function generarReporteDiario() {
  const reporteBody = document.querySelector("#tablaReporteDiario tbody");
  reporteBody.innerHTML = "";

  const hoy = new Date().toLocaleDateString();
  const vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];

  const filtrados = vehiculos.filter(v => v.ingreso.includes(hoy));

  if (filtrados.length === 0) {
    reporteBody.innerHTML = `<tr><td colspan="5">No hay registros hoy</td></tr>`;
    return;
  }

  filtrados.forEach(v => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${v.placa}</td>
      <td>${v.tipo}</td>
      <td>${v.propietario}</td>
      <td>${v.ingreso}</td>
      <td>${v.salida || "-"}</td>
    `;
    reporteBody.appendChild(row);
  });
}

/* Reporte Mensual */
function generarReporteMensual() {
  const reporteBody = document.querySelector("#tablaReporteMensual tbody");
  reporteBody.innerHTML = "";

  const mesActual = new Date().getMonth();
  const anioActual = new Date().getFullYear();

  const vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];
  const filtrados = vehiculos.filter(v => {
    const fecha = new Date(v.ingreso);
    return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
  });

  if (filtrados.length === 0) {
    reporteBody.innerHTML = `<tr><td colspan="5">No hay registros este mes</td></tr>`;
    return;
  }

  filtrados.forEach(v => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${v.placa}</td>
      <td>${v.tipo}</td>
      <td>${v.propietario}</td>
      <td>${v.ingreso}</td>
      <td>${v.salida || "-"}</td>
    `;
    reporteBody.appendChild(row);
  });
}

/* Reporte General */
function generarReporteGeneral() {
  const reporteBody = document.querySelector("#tablaReporteGeneral tbody");
  reporteBody.innerHTML = "";

  const vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];

  if (vehiculos.length === 0) {
    reporteBody.innerHTML = `<tr><td colspan="5">No hay registros</td></tr>`;
    return;
  }

  vehiculos.forEach(v => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${v.placa}</td>
      <td>${v.tipo}</td>
      <td>${v.propietario}</td>
      <td>${v.ingreso}</td>
      <td>${v.salida || "-"}</td>
    `;
    reporteBody.appendChild(row);
  });
}

/* Imprimir Reporte */
function imprimirReporte() {
  const contenido = document.getElementById("reportes").innerHTML;
  const ventana = window.open("", "", "width=800,height=600");
  ventana.document.write("<html><head><title>Reporte</title></head><body>");
  ventana.document.write(contenido);
  ventana.document.write("</body></html>");
  ventana.document.close();
  ventana.print();
}
