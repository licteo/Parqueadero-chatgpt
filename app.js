function imprimirReporte() {
  // Buscar cuál tabla tiene datos
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
