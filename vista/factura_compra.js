function mostrarListarFacturaCompra() {
    let contenido = dameContenido("paginas/movimientos/compra/factura_compra/listar.php");
    $(".contenido-principal").html(contenido);
    cargarTablaFacturaCompra();
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function mostrarAgregarFacturaCompra() {
    let contenido = dameContenido("paginas/movimientos/compra/factura_compra/agregar.php");
    $(".contenido-principal").html(contenido);
   
    cargarListaProducto("#producto_lst");
    dameFechaActual("fecha");
    dameFechaActual("fecha_venc");
    cargarListaOrdenPendiente("#orden_compra_lst");
    cargarListaProveedorActivos("#proveedor_compra_lst");
  
    //obtener ultimo id
    let ultimo = ejecutarAjax("controladores/factura_compra.php", "ultimo_registro=1");
    console.log(ultimo);
    if (ultimo === "0" || ultimo.length === 0) {
        $("#cod").val("1");
    } else {
        let json_ultimo = JSON.parse(ultimo);
        $("#cod").val(quitarDecimalesConvertir(json_ultimo['cod_registro']) + 1);
    }

}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function cancelarFacturaCompra() {
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
            mostrarListarFacturaCompra();
        }
    });

}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function agregarTablaFacturaCompra() {
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
    if ($("#costo_txt").val().trim().length === 0) {
        mensaje_dialogo_info_ERROR("Debes ingresar un costo", "ATENCION");
        return;
    }

    let costo = quitarDecimalesConvertir($("#costo_txt").val().trim());

    if (costo <= 0) {
        mensaje_dialogo_info_ERROR("El costo debe ser mayor a cero", "ATENCION");
        return;
    }

    let productoRepetido = false; // Variable para detectar si el producto ya existe

    $("#factura_compra tr").each(function (evt) {


        if ($(this).find("td:eq(0)").text() === $("#producto_lst").val()) {
            mensaje_dialogo_info_ERROR("El producto ya ha sido agregado anteriormente", "ATENCION");
            productoRepetido = true; // Marca como repetido
            return false; // Rompe el ciclo
        }
    });

    let producto  = ejecutarAjax("controladores/insumo.php", "id="+$("#producto_lst").val());
    
    let json_producto = JSON.parse(producto);

// Si no se encontró producto repetido, agrega una nueva fila
    if (!productoRepetido) {
        $("#factura_compra").append(`
        <tr>
            <td>${$("#producto_lst").val()}</td>
            <td>${$("#producto_lst option:selected").html()}</td>
            <td>${formatearNumero($("#costo_txt").val())}</td>
            <td>${$("#cantidad_txt").val()}</td>
            <td>${(json_producto['cod_impuesto'] === 3) ? formatearNumero(cantidad * costo) : 0} </td>
            <td>${(json_producto['cod_impuesto'] === 2) ? formatearNumero(cantidad * costo) : 0} </td>
            <td>${(json_producto['cod_impuesto'] === 1) ? formatearNumero(cantidad * costo) : 0} </td>
            <td>
                <button class="btn btn-danger remover-item-factura_compra">Remover</button>
            </td>
        </tr>
    `);
        calcularTotalFacturaCompra();
    }
}
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
function calcularTotalFacturaCompra() {
    let total = 0;
    let totaliva5 = 0;
    let totaliva10 = 0;
    let totalexenta = 0;
    $("#factura_compra tr").each(function (evt) {
        totalexenta += quitarDecimalesConvertir($(this).find("td:eq(4)").text());
        totaliva5 += quitarDecimalesConvertir($(this).find("td:eq(5)").text());
        totaliva10 += quitarDecimalesConvertir($(this).find("td:eq(6)").text());
        
        total += quitarDecimalesConvertir($(this).find("td:eq(4)").text()) + 
                quitarDecimalesConvertir($(this).find("td:eq(5)").text()) + 
                quitarDecimalesConvertir($(this).find("td:eq(6)").text());
    });

    $("#total_exenta").text(formatearNumero(totalexenta));
    $("#total_iva5").text(formatearNumero(totaliva5));
    $("#total_iva10").text(formatearNumero(totaliva10));
    $("#total").text(formatearNumero(total));
    
    
    let intervalo = quitarDecimalesConvertir($("#intervalo").val());
    $("#monto_cuota").val(formatearNumero(Math.round(total / intervalo)));
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
$(document).on("click", ".remover-item-factura_compra", function (evt) {
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
            calcularTotalFacturaCompra();
        }
    });
});

//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function guardarFacturaCompra() {
    

    if ($("#fecha").val() < dameFechaActualSQL()) {
        mensaje_dialogo_info_ERROR("La fecha no puede ser menor a la fecha actual", "ATENCION");
        return;
    }

    console.log("ahola");

    let cabecera = {
        'cod_compra': $("#cod").val(),
        'fecha_compra': $("#fecha").val(),
        'condicion': $("#condicion_lst").val(),
        'timbrado': $("#timbrado").val(),
        'fecha_venc_timbrado': $("#fecha_venc").val(),
        'nro_factura': $("#nro_factura").val(),
        'cod_proveedor': $("#proveedor_compra_lst").val(),
        'cod_orden_compra': $("#orden_compra_lst").val()
    };
    //si el pago es a credito guardamos en cuenta a pagar
    if($("#condicion_lst").val() === "CREDITO"){
        let fecha = new Date($("#fecha").val());
        for (var i = 1; i <= quitarDecimalesConvertir($("#intervalo").val()); i++) {
            fecha.setMonth(fecha.getMonth() + 1);
            let cuenta =  {
                'cod_compra' :  $("#cod").val(),
                'monto_pagar' :  quitarDecimalesConvertir($("#monto_cuota").val()),
                'fecha_pago' :  fecha.toISOString().slice(0, 10),
                'saldo' :  quitarDecimalesConvertir($("#monto_cuota").val()),
                'estado' : 'NO PAGADO'
            }
            
            let res_cuenta =  ejecutarAjax("controladores/cuenta_pagar.php",  
            "guardar="+JSON.stringify(cuenta));
            console.log(res_cuenta);
        }
    }
    
    //guardamos el libro compraw
    let libro = {
        'cod_compra' : $("#cod").val(),
        'iva5' : Math.round(quitarDecimalesConvertir($("#total_iva5").text()) / 21),
        'grav5' : Math.round(quitarDecimalesConvertir($("#total_iva5").text())) - 
                Math.round(quitarDecimalesConvertir($("#total_iva5").text()) / 21),
        'grav10' : Math.round(quitarDecimalesConvertir($("#total_iva10").text())) - 
                Math.round(quitarDecimalesConvertir($("#total_iva5").text()) / 11),
        'exenta' : Math.round(quitarDecimalesConvertir($("#total_exenta").text()) / 21),
        'total' : Math.round(quitarDecimalesConvertir($("#total").text())),
        'iva10' : Math.round(quitarDecimalesConvertir($("#total_iva10").text()) / 21)
        
    };
    let response = "";
    response = ejecutarAjax("controladores/libro_compra.php", "guardar=" + JSON.stringify(libro));
    console.log("LIBRO -> " + response);
    
    console.log(cabecera);

    response = ejecutarAjax("controladores/factura_compra.php", "guardar=" + JSON.stringify(cabecera));

    console.log("CABECERA -> " + response);

    //detalle
    $("#factura_compra tr").each(function (evt) {
        let detalle = {
            'cod_compra': $("#cod").val(),
            'cod_producto': $(this).find("td:eq(0)").text(),
            'costo': quitarDecimalesConvertir($(this).find("td:eq(2)").text()),
            'cantidad': $(this).find("td:eq(3)").text()
        };
        console.log(detalle);
        response = ejecutarAjax("controladores/factura_compra_detalle.php", "guardar=" + JSON.stringify(detalle));

        console.log("DETALLE -> " + response);
    });
    mensaje_confirmacion("Se ha guardado correctamente, GUARDADO");

    mostrarListarFacturaCompra();
}

//------------------------------------------------------------------------------
function cargarTablaFacturaCompra() {
    let data = ejecutarAjax("controladores/factura_compra.php", "leer=1");

    let fila = "";
    if (data === "0") {
        fila = "NO HAY REGISTROS";
    } else {
        let json_data = JSON.parse(data);
        json_data.map(function (item) {
            fila += `<tr>`;
            fila += `<td>${item.cod_compra}</td>`;
            fila += `<td>${item.fecha_compra}</td>`;
            fila += `<td>${item.nro_factura}</td>`;
            fila += `<td>${item.razon_social_prov}</td>`;
            fila += `<td>${item.condicion}</td>`;
            fila += `<td>${formatearNumero(item.total)}</td>`;
            fila += `<td><span class="badge badge-${(item.estado === "PENDIENTE") ? 'info' : (item.estado === "ANULADO") ? 'danger' : 'success'}">${item.estado}</span></td>`;
             fila += `<td>
                        <button onclick="imprimirFacturaCompra(${item.cod_compra}); return false;" class='btn btn-warning btn-sm imprimir-orden_compra'><i class='typcn typcn-printer'></i></button>
                        <button ${(item.estado === "CONFIRMADO" || item.estado === "ANULADO") ? "disabled" : ""} class='btn btn-danger btn-sm anular-factura_compra'><i class='typcn typcn-delete'></i></button>
                    </td>`;
            
            
            fila += `</tr>`;
        });
    }

    $("#factura_compra").html(fila);
}
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
function imprimirFacturaCompra(id) {
    window.open("paginas/movimientos/compra/factura_compra/print.php?id=" + id);
}
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
$(document).on("change", "#orden_compra_lst", function (evt) {
    if ($("#orden_compra_lst").val() === "0") {
            $("#factura_compra").html("");
            $("#proveedor_compra_lst").val("0");

    } else {
        let cabecera = ejecutarAjax("controladores/orden_compra.php", "id=" + $("#orden_compra_lst").val());
        console.log(cabecera);
        
        let json_cabecera =  JSON.parse(cabecera);
        $("#proveedor_compra_lst").val(json_cabecera['cod_proveedor']);
        
        let data = ejecutarAjax("controladores/orden_compra_detalle.php", "id=" + $("#orden_compra_lst").val());
        console.log(data);
        let fila = "";
        if (data === "0") {
            $("#factura_compra").html("");
        } else {
            let json_data = JSON.parse(data);

            $("#factura_compra").html("");
            json_data.map(function (item) {
                $("#factura_compra").append(`
                    <tr>
                        <td>${item.cod_material}</td>
                        <td>${item.nombre_material}</td>
                        <td>${formatearNumero(item.costo)}</td>
                        <td>${item.cantidad}</td>
                        <td>${formatearNumero(item.exenta)}</td>
                        <td>${formatearNumero(item.iva5)}</td>
                        <td>${formatearNumero(item.iva10)}</td>
                        <td>
                            <button class="btn btn-danger remover-item-factura_compra">Remover</button>
                        </td>
                    </tr>
                `);
            });
        }
    }
    calcularTotalFacturaCompra();
});
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
$(document).on("click", ".anular-factura_compra", function (evt) {
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
            let response = ejecutarAjax("controladores/factura_compra.php",
                    "anular=" + id);


            console.log(response);
            mensaje_confirmacion("Anulado Correctamente", "Eliminado");
            mostrarListarFacturaCompra();
        }
    });
});
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function cargarListaOrdenPendiente(componente){
    let datos = ejecutarAjax("controladores/orden_compra.php", "pendientes=1");
    console.log(datos);
    let option = "<option value='0'>Selecciona un orden de compra</option>";
    if (datos !== "0") {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            option += `<option value='${item.cod_orden_compra}'>Nro Orden ${item.cod_orden_compra} | ${item.nom_ape_prov}  | Total: ${formatearNumero(item.total)}</option>`;
        });
    }
    $(componente).html(option);
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
$(document).on("change", "#condicion_lst", function (evt) {
    if($("#condicion_lst").val() === "CONTADO"){
        $(".bloque-credito").attr("hidden", true);
    }else{
        
        $(".bloque-credito").removeAttr("hidden");
    }
});
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
$(document).on("change", "#intervalo", function (evt) {
    let intervalo = quitarDecimalesConvertir($("#intervalo").val());
    let total  = quitarDecimalesConvertir($("#total").text());
    $("#monto_cuota").val(formatearNumero(Math.round(total / intervalo)));
});