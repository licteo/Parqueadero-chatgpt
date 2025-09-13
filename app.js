// Guardar vehículos en localStorage
document.getElementById("formVehiculo").addEventListener("submit", function(e) {
  e.preventDefault();
  const placa = document.getElementById("placa").value;
  const tipo = document.getElementById("tipo").value;
  const propietario = document.getElementById("propietario").value;
  const ingreso = new Date().toLocaleString();

  const vehiculo = { placa, tipo, propietario, ingreso, salida: "-" };

  let vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];
  vehiculos.push(vehiculo);
  localStorage.setItem("vehiculos", JSON.stringify(vehiculos));

  mostrarActivos();
  e.target.reset();
});

function mostrarActivos() {
  const tbody = document.querySelector("#tablaActivos tbody");
  tbody.innerHTML = "";
  const vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];
  vehiculos.forEach(v => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${v.placa}</td><td>${v.tipo}</td><td>${v.propietario}</td><td>${v.ingreso}</td><td>${v.salida}</td>`;
    tbody.appendChild(row);
  });
}

function generarReporteDiario() {
  const tbody = document.querySelector("#tablaReporteDiario tbody");
  tbody.innerHTML = "";
  const hoy = new Date().toLocaleDateString();
  const vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];
  const filtrados = vehiculos.filter(v => new Date(v.ingreso).toLocaleDateString() === hoy);

  if (filtrados.length === 0) {
    tbody.innerHTML = "<tr><td colspan='5'>No hay registros hoy</td></tr>";
    return;
  }

  filtrados.forEach(v => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${v.placa}</td><td>${v.tipo}</td><td>${v.propietario}</td><td>${v.ingreso}</td><td>${v.salida}</td>`;
    tbody.appendChild(row);
  });
}

function generarReporteMensual() {
  const tbody = document.querySelector("#tablaReporteMensual tbody");
  tbody.innerHTML = "";
  const ahora = new Date();
  const mes = ahora.getMonth();
  const anio = ahora.getFullYear();

  const vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];
  const filtrados = vehiculos.filter(v => {
    const fecha = new Date(v.ingreso);
    return fecha.getMonth() === mes && fecha.getFullYear() === anio;
  });

  if (filtrados.length === 0) {
    tbody.innerHTML = "<tr><td colspan='5'>No hay registros este mes</td></tr>";
    return;
  }

  filtrados.forEach(v => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${v.placa}</td><td>${v.tipo}</td><td>${v.propietario}</td><td>${v.ingreso}</td><td>${v.salida}</td>`;
    tbody.appendChild(row);
  });
}

function generarReporteGeneral() {
  const tbody = document.querySelector("#tablaReporteGeneral tbody");
  tbody.innerHTML = "";
  const vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];

  if (vehiculos.length === 0) {
    tbody.innerHTML = "<tr><td colspan='5'>No hay registros</td></tr>";
    return;
  }

  vehiculos.forEach(v => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${v.placa}</td><td>${v.tipo}</td><td>${v.propietario}</td><td>${v.ingreso}</td><td>${v.salida}</td>`;
    tbody.appendChild(row);
  });
}

function imprimirReporte() {
  let tabla = "";
  if (document.querySelector("#tablaReporteDiario tbody").children.length > 0) {
    tabla = document.getElementById("tablaReporteDiario").outerHTML;
  } else if (document.querySelector("#tablaReporteMensual tbody").children.length > 0) {
    tabla = document.getElementById("tablaReporteMensual").outerHTML;
  } else if (document.querySelector("#tablaReporteGeneral tbody").children.length > 0) {
    tabla = document.getElementById("tablaReporteGeneral").outerHTML;
  } else {
    alert("No hay datos para imprimir");
    return;
  }

  const ventana = window.open("", "", "width=900,height=700");
  ventana.document.write(`
    <html>
    <head>
      <title>Reporte de Parqueadero</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h2 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
        th { background: #2563eb; color: white; }
        tr:nth-child(even) { background: #f1f5f9; }
      </style>
    </head>
    <body>
      <h2>Reporte de Parqueadero</h2>
      ${tabla}
    </body>
    </html>
  `);
  ventana.document.close();
  ventana.print();
}

mostrarActivos();
