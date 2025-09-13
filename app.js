// App v2 - registro con subtipo, precio editable y dar salida
(function(){
  // Default prices by type (can be overridden by user in price field)
  const DEFAULT_PRICES = {
    'Carro': 2000,
    'Moto': 1000,
    'Buseta': 4000,
    'Turbo': 3000,
    'Pintores': 0
  };

  // Helpers for storage and formatting
  function getVehiculos(){
    return JSON.parse(localStorage.getItem('vehiculos') || '[]');
  }
  function setVehiculos(arr){
    localStorage.setItem('vehiculos', JSON.stringify(arr));
  }
  function formatPrice(v){ return Number(v).toLocaleString('es-CO'); }

  // Elements
  const form = document.getElementById('formVehiculo');
  const tipoEl = document.getElementById('tipo');
  const subtipoEl = document.getElementById('subtipo');
  const precioEl = document.getElementById('precio');
  const limpiarBtn = document.getElementById('limpiarBtn');

  // Init - set event listeners and render
  function init(){
    tipoEl.addEventListener('change', onTipoChange);
    form.addEventListener('submit', onSubmit);
    limpiarBtn.addEventListener('click', ()=> form.reset());
    mostrarActivos();
    // hide report tables initially
    document.querySelectorAll('.report-table').forEach(t => t.style.display = 'none');
  }

  function onTipoChange(){
    const tipo = tipoEl.value;
    if(tipo === 'Buseta'){
      subtipoEl.style.display = 'block';
      subtipoEl.required = true;
    } else {
      subtipoEl.style.display = 'none';
      subtipoEl.required = false;
      subtipoEl.value = '';
    }
    // set default price if exists
    if(DEFAULT_PRICES.hasOwnProperty(tipo)){
      precioEl.value = DEFAULT_PRICES[tipo] || '';
    } else {
      precioEl.value = '';
    }
  }

  function onSubmit(e){
    e.preventDefault();
    const placa = document.getElementById('placa').value.trim();
    const tipo = tipoEl.value;
    const subtipo = subtipoEl.value || '';
    const propietario = document.getElementById('propietario').value.trim();
    const precioRaw = precioEl.value;
    const precio = precioRaw === '' ? 0 : Number(precioRaw);

    if(!placa || !tipo || !propietario || (tipo === 'Buseta' && !subtipo)){
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    const now = new Date();
    const vehiculo = {
      placa,
      tipo,
      subtipo,
      propietario,
      precio,
      ingresoISO: now.toISOString(),
      ingreso: now.toLocaleString(),
      salidaISO: null,
      salida: '-'
    };

    const arr = getVehiculos();
    arr.push(vehiculo);
    setVehiculos(arr);

    form.reset();
    mostrarActivos();
    // hide report tables view so user can regenerate
    document.querySelectorAll('.report-table').forEach(t => t.style.display = 'none');
  }

  // Mostrar activos con boton dar salida
  function mostrarActivos(){
    const tbody = document.querySelector('#tablaActivos tbody');
    tbody.innerHTML = '';
    const arr = getVehiculos();
    if(arr.length === 0){
      tbody.innerHTML = '<tr><td colspan="8">No hay vehículos activos</td></tr>';
      return;
    }
    arr.forEach((v, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${v.placa}</td><td>${v.tipo}</td><td>${v.subtipo || '-'}</td><td>${v.propietario}</td><td>${formatPrice(v.precio)}</td><td>${v.ingreso}</td><td>${v.salida}</td><td>${v.salidaISO ? '-' : `<button onclick="darSalida(${idx})">Dar salida</button>`}</td>`;
      tbody.appendChild(tr);
    });
    // expose darSalida to global so button inline onclick can call it
    window.darSalida = function(index){
      const arr = getVehiculos();
      if(!arr[index]) return;
      const now = new Date();
      arr[index].salidaISO = now.toISOString();
      arr[index].salida = now.toLocaleString();
      setVehiculos(arr);
      mostrarActivos();
      // regenerate current visible report tables if any
      // simple approach: hide them to force regeneration
      document.querySelectorAll('.report-table').forEach(t => t.style.display = 'none');
    };
  }

  // Report generators use ISO dates for accurate filtering
  function generarReporteDiario(){
    const tbody = document.querySelector('#tablaReporteDiario tbody');
    tbody.innerHTML = '';
    const hoy = new Date();
    const arr = getVehiculos();
    const filtrados = arr.filter(v => {
      const ing = new Date(v.ingresoISO);
      return ing.getFullYear() === hoy.getFullYear() && ing.getMonth() === hoy.getMonth() && ing.getDate() === hoy.getDate();
    });
    if(filtrados.length === 0){
      tbody.innerHTML = '<tr><td colspan="7">No hay registros hoy</td></tr>';
    } else {
      filtrados.forEach(v => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${v.placa}</td><td>${v.tipo}</td><td>${v.subtipo || '-'}</td><td>${v.propietario}</td><td>${formatPrice(v.precio)}</td><td>${v.ingreso}</td><td>${v.salida}</td>`;
        tbody.appendChild(tr);
      });
    }
    mostrarTabla('#tablaReporteDiario');
  }

  function generarReporteMensual(){
    const tbody = document.querySelector('#tablaReporteMensual tbody');
    tbody.innerHTML = '';
    const hoy = new Date();
    const arr = getVehiculos();
    const filtrados = arr.filter(v => {
      const ing = new Date(v.ingresoISO);
      return ing.getFullYear() === hoy.getFullYear() && ing.getMonth() === hoy.getMonth();
    });
    if(filtrados.length === 0){
      tbody.innerHTML = '<tr><td colspan="7">No hay registros este mes</td></tr>';
    } else {
      filtrados.forEach(v => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${v.placa}</td><td>${v.tipo}</td><td>${v.subtipo || '-'}</td><td>${v.propietario}</td><td>${formatPrice(v.precio)}</td><td>${v.ingreso}</td><td>${v.salida}</td>`;
        tbody.appendChild(tr);
      });
    }
    mostrarTabla('#tablaReporteMensual');
  }

  function generarReporteGeneral(){
    const tbody = document.querySelector('#tablaReporteGeneral tbody');
    tbody.innerHTML = '';
    const arr = getVehiculos();
    if(arr.length === 0){
      tbody.innerHTML = '<tr><td colspan="7">No hay registros</td></tr>';
    } else {
      arr.forEach(v => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${v.placa}</td><td>${v.tipo}</td><td>${v.subtipo || '-'}</td><td>${v.propietario}</td><td>${formatPrice(v.precio)}</td><td>${v.ingreso}</td><td>${v.salida}</td>`;
        tbody.appendChild(tr);
      });
    }
    mostrarTabla('#tablaReporteGeneral');
  }

  // Show selected report table and hide others
  function mostrarTabla(selector){
    document.querySelectorAll('.report-table').forEach(t => t.style.display = 'none');
    const table = document.querySelector(selector);
    if(table) table.style.display = 'table';
    // scroll to report area for better UX
    document.getElementById('reportes').scrollIntoView({behavior:'smooth'});
  }

  // Print currently visible report table
  function imprimirReporte(){
    const diario = document.querySelector('#tablaReporteDiario tbody').children.length;
    const mensual = document.querySelector('#tablaReporteMensual tbody').children.length;
    const general = document.querySelector('#tablaReporteGeneral tbody').children.length;

    let tablaHTML = '';
    if(diario > 0 && document.querySelector('#tablaReporteDiario').style.display !== 'none'){
      tablaHTML = document.getElementById('tablaReporteDiario').outerHTML;
    } else if(mensual > 0 && document.querySelector('#tablaReporteMensual').style.display !== 'none'){
      tablaHTML = document.getElementById('tablaReporteMensual').outerHTML;
    } else if(general > 0 && document.querySelector('#tablaReporteGeneral').style.display !== 'none'){
      tablaHTML = document.getElementById('tablaReporteGeneral').outerHTML;
    } else {
      // if none visible, prefer general if has rows
      if(general > 0) tablaHTML = document.getElementById('tablaReporteGeneral').outerHTML;
      else if(mensual > 0) tablaHTML = document.getElementById('tablaReporteMensual').outerHTML;
      else if(diario > 0) tablaHTML = document.getElementById('tablaReporteDiario').outerHTML;
    }

    if(!tablaHTML){
      alert('No hay datos para imprimir');
      return;
    }

    const ventana = window.open('', '', 'width=1000,height=700');
    ventana.document.write(`
      <html>
      <head>
        <title>Reporte de Parqueadero</title>
        <style>
          body{font-family:Arial,Helvetica,sans-serif;margin:20px;}
          h2{text-align:center;margin:0 0 14px 0}
          table{width:100%;border-collapse:collapse;margin-top:10px}
          th,td{border:1px solid #ccc;padding:8px;text-align:center}
          th{background:#2563eb;color:#fff}
          tr:nth-child(even){background:#f7fbff}
        </style>
      </head>
      <body>
        <h2>Reporte de Parqueadero</h2>
        ${tablaHTML}
      </body>
      </html>
    `);
    ventana.document.close();
    ventana.print();
  }

  // expose functions to global scope used by buttons in HTML
  window.generarReporteDiario = generarReporteDiario;
  window.generarReporteMensual = generarReporteMensual;
  window.generarReporteGeneral = generarReporteGeneral;
  window.imprimirReporte = imprimirReporte;

  // init app
  init();
})();