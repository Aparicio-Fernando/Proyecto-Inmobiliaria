const propietarioData = [];
const domiciliosPropietario = [];
const propiedadData = [];
const domicilioPropiedad = [];
const ventas =[];

function mostrarVistaPrevia() {
    const url = $('#urlImagen').val().trim();
    const vistaPrevia = $('#vistaPrevia');

    if (url) {
        vistaPrevia.attr('src', url);
    } else {
        vistaPrevia.attr('src', 'https://img.freepik.com/vector-premium/banner-inmobiliario-icono-casa-estilo-plano-ilustracion-vectorial-etiqueta-venta-fondo-aislado-concepto-negocio-cartel-vendido_157943-44131.jpg?semt=ais_items_boosted&w=740');
    }
}

function Guardar(e) {
    e.preventDefault();

    const propietario = {
        DNI: $('#dni_propietario').val().trim(),
        CUIL: $('#cuil_propietario').val().trim(),
        Nombre: $('#nombre_Propietario').val().trim(),
        Apellido: $('#apellido_Propietario').val().trim(),
        Telefono: $('#telefono_Propietario').val().trim(),
        Email: $('#email_Propietario').val().trim()
    };

    const domicilioPropietario = {
        DNI: propietario.DNI,
        Provincia: $('#provincia_propietario').val().trim(),
        Localidad: $('#localidad_propietario').val().trim(),
        Barrio: $('#barrio_propietario').val().trim(),
        Calle: $('#calle_propietario').val().trim(),
        Altura: $('#altura_propietario').val().trim(),
        Piso: $('#piso_propietario').val().trim(),
        Dpto: $('#dpto_propietario').val().trim()
    };

    const idEnEdicion = localStorage.getItem('propiedadEnEdicion');
    const IdPropiedad = idEnEdicion || ('PROP' + Date.now());

    const domicilioPropiedad = {
        IdPropiedad: IdPropiedad,
        Provincia: $('#provincia').val().trim(),
        Localidad: $('#localidad').val().trim(),
        Barrio: $('#barrio').val().trim(),
        Calle: $('#calle').val().trim(),
        Altura: $('#altura').val().trim(),
        Piso: $('#piso').val().trim(),
        Dpto: $('#dpto').val().trim()
    };

    const propiedad = {
        IdPropiedad: IdPropiedad,
        DNIPropietario: propietario.DNI,
        descripcionCorta: $('#descripcion_corta').val().trim(),
        descripcionLarga: $('#descripcion_larga').val().trim(),
        precio: parseFloat($('#precio').val()),
        tipoPropiedad: $('#tipo_propiedad').val(),
        estado: $('#estado').val(),
        metros: parseFloat($('#metros').val()),
        ambientes: parseInt($('#ambientes').val()),
        banios: parseInt($('#banios').val()),
        imagenUrl: $('#urlImagen').val().trim()
    };

    // Obtener o inicializar arrays del storage
    const propietarios = JSON.parse(localStorage.getItem("propietarioData")) || [];
    const domPropietario = JSON.parse(localStorage.getItem("domiciliosPropietario")) || [];
    const propiedades = JSON.parse(localStorage.getItem("propiedadData")) || [];
    const domPropiedad = JSON.parse(localStorage.getItem("domiciliosPropiedad")) || [];

    if (idEnEdicion) {
        // MODIFICACIÓN

        // Propiedad
        const idxProp = propiedades.findIndex(p => p.IdPropiedad === idEnEdicion);
        if (idxProp !== -1) propiedades[idxProp] = propiedad;

        // Domicilio Propiedad
        const idxDomProp = domPropiedad.findIndex(d => d.IdPropiedad === idEnEdicion);
        if (idxDomProp !== -1) domPropiedad[idxDomProp] = domicilioPropiedad;

        // Propietario
        const idxPropietario = propietarios.findIndex(p => p.DNI === propietario.DNI);
        if (idxPropietario !== -1) propietarios[idxPropietario] = propietario;

        // Domicilio Propietario
        const idxDomPropietario = domPropietario.findIndex(d => d.DNI === propietario.DNI);
        if (idxDomPropietario !== -1) domPropietario[idxDomPropietario] = domicilioPropietario;

        localStorage.removeItem('propiedadEnEdicion');

        new bootstrap.Modal(document.getElementById('modalModificado')).show();

    } else {
        // ALTA NUEVA
        propiedades.push(propiedad);
        domPropiedad.push(domicilioPropiedad);
        propietarios.push(propietario);
        domPropietario.push(domicilioPropietario);

        new bootstrap.Modal(document.getElementById('modalCargado')).show();
    }

    // Guardar
    localStorage.setItem("propietarioData", JSON.stringify(propietarios));
    localStorage.setItem("domiciliosPropietario", JSON.stringify(domPropietario));
    localStorage.setItem("propiedadData", JSON.stringify(propiedades));
    localStorage.setItem("domiciliosPropiedad", JSON.stringify(domPropiedad));


    $('#formulario')[0].reset();
    $('#vistaPrevia').attr('src', 'https://img.freepik.com/vector-premium/banner-inmobiliario-icono-casa-estilo-plano-ilustracion-vectorial-etiqueta-venta-fondo-aislado-concepto-negocio-cartel-vendido_157943-44131.jpg?semt=ais_items_boosted&w=740');
}

function irAlTab(tabId) {
    const tabTrigger = document.querySelector(`[data-bs-target="#${tabId}"]`);
    if (tabTrigger) {
        const tab = new bootstrap.Tab(tabTrigger);
        tab.show();
    }
}

function dibujarPropiedades() {
    const propiedades = JSON.parse(localStorage.getItem("propiedadData")) || [];
    const domicilios = JSON.parse(localStorage.getItem("domiciliosPropiedad")) || [];

    const contenedor = $('#contenedor-cards');
    contenedor.empty();

    const estados = {
        "1": "DISPONIBLE",
        "2": "RESERVADA",
        "3": "VENDIDA"
    };

    propiedades.forEach(prop => {
        const domicilio = domicilios.find(d => d.IdPropiedad === prop.IdPropiedad);
        const direccion = domicilio
            ? `${domicilio.Calle} ${domicilio.Altura || ''}, ${domicilio.Barrio || ''}, ${domicilio.Localidad}, ${domicilio.Provincia}`
            : 'Domicilio no disponible';

        const estadoTexto = estados[prop.estado] || "SIN ESTADO";

        const card = $(`
            <div class="card mb-3 shadow-sm p-3" style="min-height: 220px;">
                <div class="row h-100">

                    <!-- FOTO -->
                    <div class="col-md-3 d-flex align-items-center justify-content-center">
                        <img src="${prop.imagenUrl || 'https://via.placeholder.com/300x200?text=Sin+imagen'}"
                             class="img-fluid rounded" style="max-height: 200px; object-fit: cover;" alt="Imagen">
                    </div>

                    <!-- CENTRO: Estado + Datos -->
                    <div class="col-md-6 d-flex flex-column justify-content-between">
                        <!-- Estado -->
                        <div class="text-center fw-bold text-uppercase border p-2 mb-2">
                            ${estadoTexto}
                        </div>
                        <!-- Datos -->
                        <div>
                            <p class="mb-1"><strong>Metros²:</strong> ${prop.metros}</p>
                            <p class="mb-1"><strong>Ambientes:</strong> ${prop.ambientes}</p>
                            <p class="mb-1"><strong>Baños:</strong> ${prop.banios}</p>
                            <p class="mb-1 fw-bold">Descripción corta</p>
                            <p class="text-muted small mb-0">${prop.descripcionCorta}</p>
                            <p class="text-muted small">${direccion}</p>
                        </div>
                    </div>

                    <!-- DERECHA: Precio centrado verticalmente + botones al fondo -->
                    <div class="col-md-3 d-flex flex-column justify-content-between align-items-end">
                        <div class="flex-grow-1 w-100 d-flex align-items-center justify-content-center">
                            <h2 class="text-success fw-bold mb-0">$${Number(prop.precio).toLocaleString()}</h2>
                        </div>
                        <div class="text-end mt-2">
                            <button class="btn btn-outline-success btn-sm me-2" onclick="iniciarVenta('${prop.IdPropiedad}')">
                                <i class="bi bi-currency-dollar"></i>
                            </button>
                            <button class="btn btn-outline-primary btn-sm me-2" onclick="verPropietario('${prop.IdPropiedad}')">
                                <i class="bi bi-person"></i>
                            </button>
                            <button class="btn btn-outline-secondary btn-sm" onclick="modificarPropiedad('${prop.IdPropiedad}')">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        `);

        contenedor.append(card);
    });
}

function verPropietario(idPropiedad) {
    const propiedades = JSON.parse(localStorage.getItem("propiedadData")) || [];
    const propietarios = JSON.parse(localStorage.getItem("propietarioData")) || [];
    const domicilios = JSON.parse(localStorage.getItem("domiciliosPropietario")) || [];

    const propiedad = propiedades.find(p => p.IdPropiedad === idPropiedad);
    if (!propiedad) return alert("Propiedad no encontrada.");

    const propietario = propietarios.find(p => p.DNI === propiedad.DNIPropietario);
    if (!propietario) return alert("Propietario no encontrado.");

    const domicilio = domicilios.find(d => d.DNI === propietario.DNI);

    $('#contenidoPropietario').html(`
        <p><strong>Nombre:</strong> ${propietario.Nombre} ${propietario.Apellido}</p>
        <p><strong>DNI:</strong> ${propietario.DNI}</p>
        <p><strong>CUIL:</strong> ${propietario.CUIL}</p>
        <p><strong>Teléfono:</strong> ${propietario.Telefono}</p>
        <p><strong>Email:</strong> ${propietario.Email}</p>
        <hr>
        <p><strong>Domicilio:</strong> 
            ${domicilio?.Calle || ''} ${domicilio?.Altura || ''}, 
            ${domicilio?.Barrio || ''}, 
            ${domicilio?.Localidad || ''}, 
            ${domicilio?.Provincia || ''}
        </p>
    `);

    const modal = new bootstrap.Modal(document.getElementById('modalPropietario'));
    modal.show();
}

function modificarPropiedad(idPropiedad) {
    // Guardar el ID de la propiedad que se desea editar
    localStorage.setItem('propiedadEnEdicion', idPropiedad);

    // Redirigir al formulario de carga
    window.location.href = '/Front/NuevaPropiedad.html';
}

function cargarFormularioEdicion() {
    const idEditar = localStorage.getItem("propiedadEnEdicion");
    if (!idEditar) return;

    const propiedades = JSON.parse(localStorage.getItem("propiedadData")) || [];
    const domicilios = JSON.parse(localStorage.getItem("domiciliosPropiedad")) || [];
    const propietarios = JSON.parse(localStorage.getItem("propietarioData")) || [];
    const domiciliosProp = JSON.parse(localStorage.getItem("domiciliosPropietario")) || [];

    const prop = propiedades.find(p => p.IdPropiedad === idEditar);
    const dom = domicilios.find(d => d.IdPropiedad === idEditar);
    const propietario = propietarios.find(p => p.DNI === prop.DNIPropietario);
    const domPropietario = domiciliosProp.find(d => d.DNI === prop.DNIPropietario);

    if (!prop) return;

    // Propietario
    $('#dni_propietario').val(propietario?.DNI || '');
    $('#cuil_propietario').val(propietario?.CUIL || '');
    $('#nombre_Propietario').val(propietario?.Nombre || '');
    $('#apellido_Propietario').val(propietario?.Apellido || '');
    $('#telefono_Propietario').val(propietario?.Telefono || '');
    $('#email_Propietario').val(propietario?.Email || '');

    $('#provincia_propietario').val(domPropietario?.Provincia || '');
    $('#localidad_propietario').val(domPropietario?.Localidad || '');
    $('#barrio_propietario').val(domPropietario?.Barrio || '');
    $('#calle_propietario').val(domPropietario?.Calle || '');
    $('#altura_propietario').val(domPropietario?.Altura || '');
    $('#piso_propietario').val(domPropietario?.Piso || '');
    $('#dpto_propietario').val(domPropietario?.Dpto || '');

    // Propiedad
    $('#descripcion_corta').val(prop.descripcionCorta);
    $('#descripcion_larga').val(prop.descripcionLarga);
    $('#precio').val(prop.precio);
    $('#tipo_propiedad').val(prop.tipoPropiedad);
    $('#estado').val(prop.estado);
    $('#metros').val(prop.metros);
    $('#ambientes').val(prop.ambientes);
    $('#banios').val(prop.banios);
    $('#urlImagen').val(prop.imagenUrl);
    $('#vistaPrevia').attr('src', prop.imagenUrl || 'https://img.freepik.com/vector-premium/banner-inmobiliario-icono-casa-estilo-plano-ilustracion-vectorial-etiqueta-venta-fondo-aislado-concepto-negocio-cartel-vendido_157943-44131.jpg?semt=ais_items_boosted&w=740');

    $('#provincia').val(dom?.Provincia || '');
    $('#localidad').val(dom?.Localidad || '');
    $('#barrio').val(dom?.Barrio || '');
    $('#calle').val(dom?.Calle || '');
    $('#altura').val(dom?.Altura || '');
    $('#piso').val(dom?.Piso || '');
    $('#dpto').val(dom?.Dpto || '');
}

function cerrarYRedirigir() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalModificado'));
    modal.hide();
    window.location.href = '/Front/_ListaPropiedades.html';
}

function iniciarVenta(idPropiedad) {
    localStorage.setItem('propiedadParaVenta', idPropiedad);
    window.location.href = '/Front/NuevaVenta.html';
}

function confirmarVenta() {
    const idProp = localStorage.getItem("propiedadParaVenta");
    const propiedades = JSON.parse(localStorage.getItem("propiedadData")) || [];
    const domicilios = JSON.parse(localStorage.getItem("domiciliosPropiedad")) || [];

    const prop = propiedades.find(p => p.IdPropiedad === idProp);
    const dom = domicilios.find(d => d.IdPropiedad === idProp);

    if (!prop) return alert("Propiedad no encontrada");

    // Validar monto
    const monto = parseFloat($('#cobro_monto').val());
    const precio = parseFloat(prop.precio);
    if (monto !== precio) {
        alert("El monto ingresado no coincide con el precio de la propiedad.");
        return;
    }

    // Armar objeto venta
    const venta = {
        propiedad: prop,
        domicilio: dom,
        cliente: {
            Apellido: $('#cliente_apellido').val().trim(),
            Nombre: $('#cliente_nombre').val().trim(),
            DNI: $('#cliente_dni').val().trim(),
            CUIL: $('#cliente_cuil').val().trim(),
            Telefono: $('#cliente_telefono').val().trim(),
            Email: $('#cliente_email').val().trim()
        },
        cobro: {
            Medio: $('#cobro_medio').val(),
            Fecha: $('#cobro_fecha').val(),
            Monto: monto,
            Banco: $('#cobro_banco').val(),
            Comprobante: $('#cobro_comprobante').val(),
            Observaciones: $('#cobro_observaciones').val()
        },
        fechaVenta: new Date().toISOString()
    };

    // Guardar venta
    const ventas = JSON.parse(localStorage.getItem("ventasRealizadas")) || [];
    ventas.push(venta);
    localStorage.setItem("ventasRealizadas", JSON.stringify(ventas));

    // Actualizar propiedad a "vendida"
    const idx = propiedades.findIndex(p => p.IdPropiedad === idProp);
    if (idx !== -1) {
        propiedades[idx].estado = "3"; // Vendida
        localStorage.setItem("propiedadData", JSON.stringify(propiedades));
    }

    new bootstrap.Modal(document.getElementById('modalVentaConfirmada')).show();
    window.location.href = "/Front/_ListaPropiedades.html";
}

function redirigirListado() {
  const modal = bootstrap.Modal.getInstance(document.getElementById('modalVentaConfirmada'));
  modal.hide();
  window.location.href = "/Front/_ListaPropiedades.html";
}