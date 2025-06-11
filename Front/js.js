const propietarioData = [];
const domiciliosPropietario = [];
const propiedadData = [];
const domicilioPropiedad = [];
const ventas = [];

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

    console.log('Ejecutando Guardar...');

    // Limpiar errores previos
    $('.form-control').removeClass('is-invalid');
    $('.invalid-feedback').hide();

    let camposInvalidos = [];

    // Validar datos del propietario
    [
        '#apellido_Propietario', '#nombre_Propietario', '#dni_propietario',
        '#cuil_propietario', '#telefono_Propietario', '#email_Propietario',
        '#provincia_propietario', '#localidad_propietario', '#calle_propietario'
    ].forEach(id => {
        const $el = $(id);
        const val = $el.val();
        if (!val || val.trim() === '') {
            $el.addClass('is-invalid');
            $el.siblings('.invalid-feedback').show();
            camposInvalidos.push(id);
        }
    });

    if (!validarPropiedad()) {
        return
    }

    // Armado de objetos
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

    // Obtener datos del localStorage
    const propietarios = JSON.parse(localStorage.getItem("propietarioData")) || [];
    const domPropietario = JSON.parse(localStorage.getItem("domiciliosPropietario")) || [];
    const propiedades = JSON.parse(localStorage.getItem("propiedadData")) || [];
    const domPropiedad = JSON.parse(localStorage.getItem("domiciliosPropiedad")) || [];

    if (idEnEdicion) {
        // MODIFICACIÓN
        const idxProp = propiedades.findIndex(p => p.IdPropiedad === idEnEdicion);
        if (idxProp !== -1) propiedades[idxProp] = propiedad;

        const idxDomProp = domPropiedad.findIndex(d => d.IdPropiedad === idEnEdicion);
        if (idxDomProp !== -1) domPropiedad[idxDomProp] = domicilioPropiedad;

        const idxPropietario = propietarios.findIndex(p => p.DNI === propietario.DNI);
        if (idxPropietario !== -1) propietarios[idxPropietario] = propietario;

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

    // Guardar en localStorage
    localStorage.setItem("propietarioData", JSON.stringify(propietarios));
    localStorage.setItem("domiciliosPropietario", JSON.stringify(domPropietario));
    localStorage.setItem("propiedadData", JSON.stringify(propiedades));
    localStorage.setItem("domiciliosPropiedad", JSON.stringify(domPropiedad));

    // Reset
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

function validarYAvanzar() {
    $('.form-control').removeClass('is-invalid');
    let camposInvalidos = [];

    ['#apellido_Propietario', '#nombre_Propietario', '#dni_propietario', '#cuil_propietario', '#telefono_Propietario', '#email_Propietario',
        '#provincia_propietario', '#localidad_propietario', '#barrio_propietario', '#calle_propietario', '#altura_propietario'].forEach(id => {
            if (!$(id).val().trim()) {
                $(id).addClass('is-invalid');
                $(id).next('.invalid-feedback').show(); // Asegura que esté visible si no lo hace automáticamente
                camposInvalidos.push(id);
            }
        });

    // Forzar blur para mostrar los feedbacks
    camposInvalidos.forEach(id => $(id).trigger('blur'));

    if (camposInvalidos.length > 0) {
        const primero = document.querySelector(camposInvalidos[0]);
        if (primero) primero.focus();
        return; // Detiene avance si hay errores
    }
    // Habilitar el tab manualmente
    const tabBtn = document.getElementById('propiedad-tab');
    tabBtn.removeAttribute('disabled');

    // Activar el tab usando Bootstrap.Tab
    const tab = new bootstrap.Tab(tabBtn);
    tab.show();
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
                        <div class="text-center fw-bold text-uppercase border p-2 mb-2 estado-card">
                            ${estadoTexto}
                        </div>
                        <!-- Datos -->
                        <div>
                            <p class="mb-1" style="font-size:20px;"><strong>Superficie construida:</strong> ${prop.metros} m&sup2;</p>
                            <p class="mb-1" style="font-size:20px;"><strong>Ambientes:</strong> ${prop.ambientes}</p>
                            <p class="mb-1" style="font-size:20px;"><strong>Baños:</strong> ${prop.banios}</p>
                            <p class="mb-1 fw-bold" style="font-size:20px;">${prop.descripcionCorta}</p>
                            <p class="text-muted small" style="font-size:20px;">${direccion}</p>
                        </div>
                    </div>

                    <!-- DERECHA: Precio centrado verticalmente + botones al fondo -->
                    <div class="col-md-3 d-flex flex-column justify-content-between align-items-end">
                        <div class="flex-grow-1 w-100 d-flex align-items-center justify-content-center">
                            <h2 class="text-success fw-bold mb-0 precio-lista">U$S${Number(prop.precio).toLocaleString()}</h2>
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
    let ventas = JSON.parse(localStorage.getItem("ventas")) || [];

    const prop = propiedades.find(p => p.IdPropiedad === idProp);
    const dom = domicilios.find(d => d.IdPropiedad === idProp);
    if (!prop) return;

    // Limpiar errores anteriores
    $('#formVenta input, #formVenta select').removeClass('error');
    $('#formVenta .invalid-feedback').remove();

    let valido = true;

    // Validar cliente
    $('#cliente_apellido, #cliente_nombre, #cliente_dni, #cliente_cuil, #cliente_telefono, #cliente_email').each(function () {
        if (!$(this).val().trim()) {
            $(this).addClass('error').after('<div class="invalid-feedback">Campo obligatorio</div>');
            valido = false;
        }
    });

    // Validar fecha
    if (!$('#cobro_fecha').val().trim()) {
        $('#cobro_fecha').addClass('error').after('<div class="invalid-feedback">Campo obligatorio</div>');
        valido = false;
    }

    // Validar bancos y comprobantes si está activo el check transferencia
    if ($('#chk_transferencia').is(':checked')) {
        $('#cobro_banco, #cobro_comprobante').each(function () {
            if (!$(this).val().trim()) {
                $(this).addClass('error').after('<div class="invalid-feedback">Campo obligatorio</div>');
                valido = false;
            }
        });
    }

    const subtotal = parseARNumber($('#cobro_subtotal').val());
    const total = parseARNumber($('#cobro_total').val());

    const $cobroTotal = $('#cobro_total');
    $cobroTotal.removeClass('error');
    $cobroTotal.siblings('.invalid-feedback').remove();

    if (subtotal < total - 0.01 || subtotal > total + 0.01) {
        $cobroTotal.addClass('error');
        $cobroTotal.after('<div class="invalid-feedback">El total debe coincidir con el valor del subtotal</div>');
        return;
    }

    // Armar objeto venta
    const venta = {
        IdVenta: 'VENTA' + Date.now(),
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
            Medios: {
                efectivo: $('#chk_efectivo').is(':checked'),
                transferencia: $('#chk_transferencia').is(':checked')
            },
            Fecha: $('#cobro_fecha').val(),
            Cotizacion: parseARNumber($('#cotizacion_dolar').val()),
            Subtotal: parseARNumber($('#cobro_subtotal').val()),
            Comision: parseARNumber($('#cobro_comision').val()),
            Monto: total,
            Banco: $('#cobro_banco').val().trim() || null,
            Comprobante: $('#cobro_comprobante').val().trim() || null,
            Observaciones: $('#cobro_observaciones').val().trim() || '',
            MontoPesos: {
                efectivo: parseARNumber($('#efectivo_pesos').val()),
                transferencia: parseARNumber($('#transferencia_pesos').val())
            },
            MontoDolares: {
                efectivo: parseARNumber($('#efectivo_dolares').val()),
                transferencia: parseARNumber($('#transferencia_dolares').val())
            }
        },
        fechaVenta: new Date().toISOString()
    };

    // Guardar
    ventas.push(venta);
    localStorage.setItem("ventas", JSON.stringify(ventas));

    const idx = propiedades.findIndex(p => p.IdPropiedad === idProp);
    if (idx !== -1) {
        propiedades[idx].estado = "3";
        localStorage.setItem("propiedadData", JSON.stringify(propiedades));
    }

    abrirComprobante(venta);

    // Mostrar modal y redirigir
    new bootstrap.Modal(document.getElementById('modalVentaConfirmada')).show();
    window.location.href = "/Front/_ListaPropiedades.html";
}



function abrirComprobante(venta) {
    const win = window.open('', '_blank');

    const formatAR = (n) => {
        const num = parseFloat(n);
        return isNaN(num)
            ? 'S/V'
            : num.toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
    };

    const safe = (v) => v ? v : 'S/V';

    const html = `
        <html>
        <head>
            <title>Comprobante de Compra-Venta</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h2 { color: #2e7d32; }
                .seccion { margin-bottom: 20px; }
                .seccion h4 { margin-bottom: 5px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
                p { margin: 2px 0; }
            </style>
        </head>
        <body>
            <h2>🏠 Comprobante de Compra-Venta</h2>
            
            <div class="seccion">
                <h4>Propiedad</h4>
                <p><strong>Descripción:</strong> ${safe(venta.propiedad?.descripcionCorta)}</p>
                <p><strong>Dirección:</strong> 
                    ${safe(venta.domicilio?.Calle)} ${safe(venta.domicilio?.Altura)}, 
                    ${safe(venta.domicilio?.Barrio)}, 
                    ${safe(venta.domicilio?.Localidad)}, 
                    ${safe(venta.domicilio?.Provincia)}
                </p>
                <p><strong>Precio base (U$S):</strong> ${formatAR(venta.propiedad?.precio)}</p>
                <p><strong>Subtotal cobrado ($):</strong> ${formatAR(venta.cobro?.Subtotal)}</p>
            </div>

            <div class="seccion">
                <h4>Cliente</h4>
                <p><strong>Nombre:</strong> ${safe(venta.cliente?.Nombre)} ${safe(venta.cliente?.Apellido)}</p>
                <p><strong>DNI:</strong> ${safe(venta.cliente?.DNI)}</p>
                <p><strong>CUIL:</strong> ${safe(venta.cliente?.CUIL)}</p>
                <p><strong>Email:</strong> ${safe(venta.cliente?.Email)}</p>
                <p><strong>Teléfono:</strong> ${safe(venta.cliente?.Telefono)}</p>
            </div>

            <div class="seccion">
                <h4>Datos de Cobro</h4>
                <p><strong>Cotización dólar utilizada:</strong> ${formatAR(venta.cobro?.Cotizacion)}</p>
                <p><strong>Medios de pago:</strong> ${[
            venta.cobro?.Medios?.efectivo ? 'Efectivo' : '',
            venta.cobro?.Medios?.transferencia ? 'Transferencia' : ''
        ].filter(Boolean).join(' y ') || 'S/V'}</p>
                <p><strong>Fecha:</strong> ${venta.cobro?.Fecha && !isNaN(new Date(venta.cobro.Fecha))
            ? new Date(venta.cobro.Fecha).toLocaleDateString('es-AR')
            : 'S/V'
        }</p>
                <p><strong>Comisión(%):</strong> ${venta.cobro?.Comision ?? 'S/V'}%</p>
                <p><strong>Total a cobrar ($):</strong> ${formatAR(venta.cobro?.Monto)}</p>

                <p><strong>Banco:</strong> ${safe(venta.cobro?.Banco)}</p>
                <p><strong>N° Comprobante:</strong> ${safe(venta.cobro?.Comprobante)}</p>
                <p><strong>Observaciones:</strong> ${safe(venta.cobro?.Observaciones)}</p>
            </div>

            <p><em>Fecha de operación: ${new Date(venta.fechaVenta).toLocaleString('es-AR')}</em></p>

            <script>
                window.onload = function() {
                    window.print();
                }
            </script>
        </body>
        </html>
    `;

    win.document.write(html);
    win.document.close();
}



function redirigirListado() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalVentaConfirmada'));
    modal.hide();
    window.location.href = "/Front/_ListaPropiedades.html";
}

function cerrarModalYVolverAlInicio() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalCargado'));
    modal.hide();
    irAlTab('propiedad-tab');
}

function validarPropiedad() {
    var valido = true;

    if ($('#descripcion_corta').val().trim() === '') {
        marcarInvalido('#descripcion_corta');
        valido = false;
    }

    return valido;

}

function marcarInvalido(selector) {
    const $el = $(selector);
    $el.addClass('is-invalid');

    // Buscar el mensaje sin importar el nivel
    const feedback = $el.closest('.mb-3').find('.invalid-feedback');
    if (feedback.length) {
        feedback.css('display', 'block');
    }
}

function iniciarVenta(idPropiedad) {
    const propiedades = JSON.parse(localStorage.getItem("propiedadData")) || [];
    const prop = propiedades.find(p => p.IdPropiedad === idPropiedad);

    if (!prop) return;

    if (prop.estado === "3") {
        // Mostrar modal de ya vendida
        $('#modalYaVendida').data('id', idPropiedad).modal('show');
    } else {
        localStorage.setItem("propiedadParaVenta", idPropiedad);
        window.location.href = "/Front/NuevaVenta.html";
    }
}

function reimprimirComprobante() {
    const id = $('#modalYaVendida').data('id');
    const ventas = JSON.parse(localStorage.getItem("ventas")) || [];
    const venta = ventas.find(v => v.propiedad.IdPropiedad === id);

    if (venta) {
        abrirComprobante(venta);
    }

    $('#modalYaVendida').modal('hide');
}