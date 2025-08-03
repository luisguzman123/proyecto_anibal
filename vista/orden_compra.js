function mostrarListarOrdenCompra() {
    let contenido = dameContenido("paginas/movimientos/compra/orden_compra/listar.php");
    $(".contenido-principal").html(contenido);
    cargarTablaOrdenCompra();
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function cargarListaProducto(componente) {
    let datos = ejecutarAjax("controladores/proyecto.php", "leer=1");
    let option = "<option value='0'>Selecciona un Producto</option>";
    if (datos !== "0") {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            option += `<option value='${item.cod_producto}'>${item.nombre}</option>`;
        });
    }
    $(componente).html(option);
}

//------------------------------------------------------------------------------
function mostrarAgregarOrdenCompra() {
    let contenido = dameContenido("paginas/movimientos/compra/orden_compra/agregar.php");
    $(".contenido-principal").html(contenido);
    dameFechaActual("fecha");
    let ultimo = ejecutarAjax("controladores/orden_compra.php", "ultimo_registro=1");
    console.log(ultimo);
    if (ultimo === "0") {
        $("#cod").val("1");
    } else {
        let json_ultimo = JSON.parse(ultimo);
        $("#cod").val(quitarDecimalesConvertir(json_ultimo['cod_orden']) + 1);


    }
    cargarListaProducto("#producto_lst");
    cargarListaProveedorActivos("#proveedor_compra_lst");
    cargarListaPresupuestoPendientes("#presupuesto_compra_lst");

}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function cancelarOrdenCompra() {
    Swal.fire({
        title: "ATENCION",
        text: "Desea cancelar la operacion?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "No",
        confirmButtonText: "Si"
    }).then((result) => {
        if (result.isConfirmed) {
            mostrarListarOrdenCompra();
        }
    });

}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function agregarTablaOrdenCompra() {
    if ($("#producto_lst").val() === "0") {
        mensaje_dialogo_info_ERROR("Debes seleccionar un producto", "ATENCION");
        return;
    }

    if ($("#cantidad_txt").val().trim().length === 0) {
        mensaje_dialogo_info_ERROR("Debes ingresar una cantidad", "ATENCION");
        return;
    }

    let cantidad = quitarDecimalesConvertir($("#cantidad_txt").val().trim());

    if (cantidad <= 0) {
        mensaje_dialogo_info_ERROR("La cantidad debe ser mayor a cero", "ATENCION");
        return;
    }
    if ($("#precio_txt").val().trim().length === 0) {
        mensaje_dialogo_info_ERROR("Debes ingresar un precio", "ATENCION");
        return;
    }

    let precio = quitarDecimalesConvertir($("#precio_txt").val().trim());

    if (precio <= 0) {
        mensaje_dialogo_info_ERROR("El precio debe ser mayor a cero", "ATENCION");
        return;
    }

    let materialRepetido = false; // Variable para detectar si el material ya existe

    $("#orden_compra_compra tr").each(function () {


        if ($(this).find("td:eq(0)").text() === $("#producto_lst").val()) {
            mensaje_dialogo_info_ERROR("El producto ya ha sido agregado anteriormente", "ATENCION");
            materialRepetido = true; // Marca como repetido
            return false; // Rompe el ciclo
        }
    });

// Si no se encontró material repetido, agrega una nueva fila
    if (!materialRepetido) {
        $("#orden_compra_compra").append(`
        <tr>
            <td>${$("#producto_lst").val()}</td>
            <td>${$("#producto_lst option:selected").html().split(" | ")[0]}</td>
            <td><input class="form-control costo-presu" value="${formatearNumero($("#precio_txt").val())}"></td>
            <td>${$("#cantidad_txt").val()}</td>
            <td>${formatearNumero(cantidad * precio)}</td>
            <td>
                <button class="btn btn-danger remover-item-orden_compra">Remover</button>
            </td>
        </tr>
    `);
        calcularTotalOrdenCompra();
    }
}
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
function calcularTotalOrdenCompra() {
    let total = 0;
    $("#orden_compra_compra tr").each(function (evt) {
        total += quitarDecimalesConvertir($(this).find("td:eq(4)").text());
    });

    $("#total").text(formatearNumero(total));
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
$(document).on("click", ".remover-item-orden_compra", function (evt) {
    let tr = $(this).closest("tr");
    Swal.fire({
        title: "ATENCION",
        text: "Desea remover el registro?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "No",
        confirmButtonText: "Si"
    }).then((result) => {
        if (result.isConfirmed) {
            $(tr).remove();
            calcularTotalOrdenCompra();
        }
    });
});

//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function guardarOrdenCompra() {
    if ($("#sucursal_lst").val() === "0") {
        mensaje_dialogo_info_ERROR("Debes seleccionar una sucursal", "ATENCION");
        return;
    }

    if ($("#fecha").val() < dameFechaActualSQL()) {
        mensaje_dialogo_info_ERROR("La fecha no puede ser menor a la fecha actual", "ATENCION");
        return;
    }

  

    let cabecera = {
        'cod_orden_compra': $("#cod").val(),
        'fecha_orden': $("#fecha").val(),
        'cod_presupuesto_comp': 1,
        'cod_proveedor': $("#proveedor_compra_lst").val(),
        'estado': 'PENDIENTE'
    };
    console.log(cabecera);

    let response = ejecutarAjax("controladores/orden_compra.php", "guardar=" + JSON.stringify(cabecera));

    console.log("CABECERA -> " + response);

    //detalle
    $("#orden_compra_compra tr").each(function (evt) {
        let detalle = {
            'cod_orden_compra': $("#cod").val(),
            'cod_producto': $(this).find("td:eq(0)").text(),
            'costo': quitarDecimalesConvertir($(this).find("input").val()),
            'cantidad': $(this).find("td:eq(3)").text()
        };
        response = ejecutarAjax("controladores/orden_compra_detalle.php", "guardar=" + JSON.stringify(detalle));

        console.log("DETALLE -> " + response);
    });
    mensaje_confirmacion("Se ha guardado correctamente, GUARDADO")

    mostrarListarOrdenCompra();
}

//------------------------------------------------------------------------------
function cargarTablaOrdenCompra() {
    let data = ejecutarAjax("controladores/orden_compra.php", "leer=1");

    let fila = "";
    if (data === "0") {
        fila = "NO HAY REGISTROS";
    } else {
        let json_data = JSON.parse(data);
        json_data.map(function (item) {
            fila += `<tr>`;
            fila += `<td>${item.cod_orden_compra}</td>`;
            fila += `<td>${item.fecha_orden}</td>`;
            fila += `<td>${item.nom_ape_prov}</td>`;
            fila += `<td>${formatearNumero(item.total)}</td>`;
            fila += `<td><span class="badge badge-${(item.estado === "PENDIENTE") ? 'info' : (item.estado === "ANULADO") ? 'danger' : 'success'}">${item.estado}</span></td>`;
            fila += `<td>
                        <button onclick="imprimirOrdenCompra(${item.cod_orden_compra}); return false;" class='btn btn-warning btn-sm imprimir-orden_compra'><i class='typcn typcn-printer'></i></button>
                        <button ${(item.estado === "CONFIRMADO" || item.estado === "ANULADO") ? "disabled" : ""} class='btn btn-danger btn-sm anular-orden_compra'><i class='typcn typcn-delete'></i></button>
                    </td>`;
            
            
            fila += `</tr>`;
        });
    }

    $("#orden_compra_compra").html(fila);
}
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
function imprimirOrdenCompra(id) {
    window.open("paginas/movimientos/compra/orden_compra/print.php?id=" + id);
}
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
$(document).on("change", "#producto_lst", function (evt) {
    if ($("#producto_lst").val() === "0") {
        $("#precio_txt").val("1");
    } else {
        let producto = ejecutarAjax("controladores/proyecto.php", "id=" + $("#producto_lst").val());
        if (producto !== "0") {
            let json_producto = JSON.parse(producto);
            $("#precio_txt").val(formatearNumero(json_producto['precio']));
        }
    }
});

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
$(document).on("change", "#presupuesto_compra_lst", function (evt) {
    if ($("#presupuesto_compra_lst").val() === "0") {
            $("#orden_compra_compra").html("");
            $("#proveedor_compra_lst").val("0");

    } else {
        let cabecera = ejecutarAjax("controladores/presupuesto.php", "id=" + $("#presupuesto_compra_lst").val());
        console.log(cabecera);
        
        let json_cabecera =  JSON.parse(cabecera);
        $("#proveedor_compra_lst").val(json_cabecera['cod_proveedor']);
        
        let data = ejecutarAjax("controladores/presupuesto_detalle.php", "id=" + $("#presupuesto_compra_lst").val());
        console.log(data);
        let fila = "";
        if (data === "0") {
            $("#orden_compra_compra").html("");
        } else {
            let json_data = JSON.parse(data);

            $("#orden_compra_compra").html("");
            json_data.map(function (item) {
                $("#orden_compra_compra").append(`
                    <tr>
                        <td>${item.cod_material}</td>
                        <td>${item.nombre_material}</td>
                        <td><input class="form-control costo-presu" value="${formatearNumero(item.costo)}"></td>
                        <td>${item.cantidad}</td>
                        <td>${formatearNumero(item.total)}</td>
                        <td>
                            <button class="btn btn-danger remover-item-orden_compra">Remover</button>
                        </td>
                    </tr>
                `);
            });
        }
    }
    calcularTotalOrdenCompra();
});
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
$(document).on("click", ".anular-orden_compra", function (evt) {
     let id = $(this).closest("tr").find("td:eq(0)").text();
    Swal.fire({
        title: "Atencion",
        text: "Desea anular el registro?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "No",
        confirmButtonText: "Si"
    }).then((result) => {
        if (result.isConfirmed) {
            let response = ejecutarAjax("controladores/orden_compra.php",
                    "anular=" + id);


            console.log(response);
            mensaje_confirmacion("Anulado Correctamente", "Eliminado");
            mostrarListarOrdenCompra();
        }
    });
});
