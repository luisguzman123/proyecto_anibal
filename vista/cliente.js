function mostrarListarCliente() {
    let contenido = dameContenido("paginas/referenciales/cliente/listar.php");
    $(".contenido-principal").html(contenido);
    cargarTablaCliente();
}
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
function mostrarAgregarCliente() {
    let contenido = dameContenido("paginas/referenciales/cliente/agregar.php");
    $(".contenido-principal").html(contenido);
    
     let ultimo = ejecutarAjax("controladores/cliente.php", "ultimo_registro=1");
    console.log(ultimo);
    if (ultimo === "0") {
        $("#cod").val("1");
    } else {
        let json_ultimo = JSON.parse(ultimo);
        $("#cod").val(quitarDecimalesConvertir(json_ultimo['cod_cliente']) + 1);


    }
    cargarListaCiudadCliente("#ciudad_lst");
}
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
function cancelarCliente() {
    Swal.fire({
        title: "Atencion",
        text: "Desea cancelar la operacion?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "No",
        confirmButtonText: "Si"
    }).then((result) => {
        if (result.isConfirmed) {
            let contenido = dameContenido("paginas/referenciales/cliente/listar.php");
            $(".contenido-principal").html(contenido);
            mostrarListarCliente();
        }
    });

}

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
function guardarClientes() {


    // Validar el campo 'Nombre y Apellido'
    if ($("#nombre_cliente").val().trim().length === 0) {
        mensaje_dialogo_info_ERROR("Atención", "Debes ingresar el Nombre y Apellido");
        return false;
    }
    if ($("#ci_cliente").val().trim().length === 0) {
        mensaje_dialogo_info_ERROR("Atención", "Debes ingresar nro de C.I");
        return false;
    }
    if ($("#ruc_cliente").val().trim().length === 0) {
        mensaje_dialogo_info_ERROR("Atención", "Debes ingresar nro de R.U.C");
        return false;
    }

    // Validar el campo 'Teléfono'
    if ($("#telefono_cliente").val().trim().length === 0) {
        mensaje_dialogo_info_ERROR("Atención", "Debes ingresar un número de teléfono");
        return false;
    }

    // Validar que el teléfono solo contenga números
    if (!/^\d+$/.test($("#telefono_cliente").val().trim())) {
        mensaje_dialogo_info_ERROR("Atención", "El teléfono solo debe contener números");
        return false;
    }


    // Validar que la cédula solo contenga números
    if (!/^\d+$/.test($("#ci_cliente").val().trim())) {
        mensaje_dialogo_info_ERROR("Atención", "La cédula solo debe contener números");
        return false;
    }

    // Validar el campo 'Dirección'
    if ($("#ciudad_lst").val() === "0") {
        mensaje_dialogo_info_ERROR("Atención", "Debes ingresar la dirección del cliente");
        return false;
    }

    // Validar selección de 'Ciudad'
    if ($("#ciudad_lst").val() === "" || $("#ciudad_lst").val() === "0") {
        mensaje_dialogo_info_ERROR("Atención", "Debes seleccionar una ciudad");
        return false;
    }



    let data = {
        'cod_cliente': $("#cod").val(),
        'nombre_cliente': $("#nombre_cliente").val(),
        'ci_cliente': $("#ci_cliente").val(),
        'ruc': $("#ruc_cliente").val(),
        'telefono': $("#telefono_cliente").val(),
        'estado_cliente': "ACTIVO",
        'cod_ciudad': $("#ciudad_lst").val()

    };


    if ($("#id_cliente").val() === "0") {

        let response = ejecutarAjax("controladores/cliente.php", "guardar=" + JSON.stringify(data));
//        console.log(response);
        mensaje_confirmacion("Guardado correctamente", "Guardado");
        mostrarListarCliente();
        console.log(response);
    } else {
        let data = {
            'cod_cliente': $("#id_cliente").val(),
            'nombre_cliente': $("#nombre_cliente").val(),
            'ci_cliente': $("#ci_cliente").val(),
            'ruc': $("#ruc_cliente").val(),
            'telefono': $("#telefono_cliente").val(),
            'estado_cliente': "ACTIVO",
            'cod_ciudad': $("#ciudad_lst").val()

        };

        let response = ejecutarAjax("controladores/cliente.php",
                "actualizar=" + JSON.stringify(data));
        console.log(response);
        mensaje_confirmacion("Actualizado Correctamente", "Actualizado");
        mostrarListarCliente();
    }


}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function cargarTablaCliente() {
    let data = ejecutarAjax("controladores/cliente.php", "leer=1");


    let fila = "";
    if (data === "0") {
        fila = "NO HAY REGISTROS";
    } else {
        let json_data = JSON.parse(data);
        json_data.map(function (item) {
            fila += `<tr>`;
            fila += `<td>${item.cod_cliente}</td>`;
            fila += `<td>${item.nombre_cliente}</td>`;
            fila += `<td>${item.ci_cliente}</td>`;
            fila += `<td>${item.telefono}</td>`;
            fila += `<td>${item.nombre_ciud}</td>`;
            fila += `<td>${item.estado_cliente}</td>`;
            fila += `<td>
                        <button class='btn btn-warning editar-cliente'><i class='fa fa-edit'></i> Editar</button>
                        <button class='btn btn-danger eliminar-cliente'><i class='fa fa-trash'></i> Eliminar</button>
                    </td>`;
            fila += `</tr>`;
        });
    }

    $("#cliente_tb").html(fila);
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
$(document).on("click", ".editar-cliente", function (evt) {
    let id = $(this).closest("tr").find("td:eq(0)").text();
    Swal.fire({
        title: "Atencion",
        text: "Desea editar el registro?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "No",
        confirmButtonText: "Si"
    }).then((result) => {
        if (result.isConfirmed) {
            let response = ejecutarAjax("controladores/cliente.php", "id=" + id);
            console.log(response);
            if (response === "0") {

            } else {
                let json_data = JSON.parse(response);
                //abrir ventana
                let contenido = dameContenido("paginas/referenciales/cliente/agregar.php");
                $(".contenido-principal").html(contenido);


                //cargar los datos
                let json_registro = JSON.parse(response);
                $("#id_cliente").val(id);
                $("#nombre_cliente").val(json_registro['nombre_cliente']);
                $("#ci_cliente").val(json_registro['ci_cliente']);
                $("#ruc_cliente").val(json_registro['ruc']);
                $("#telefono_cliente").val(json_registro['telefono']);
                cargarListaCiudadCliente("#ciudad_lst");
                $("#ciudad_lst").val(json_registro['cod_ciudad']);
            }
        }
    });
});
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
$(document).on("click", ".eliminar-cliente", function (evt) {
    let id = $(this).closest("tr").find("td:eq(0)").text();
    Swal.fire({
        title: "Atencion",
        text: "Desea eliminar el registro?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "No",
        confirmButtonText: "Si"
    }).then((result) => {
        if (result.isConfirmed) {
            let response = ejecutarAjax("controladores/cliente.php",
                    "eliminar=" + id);

            console.log(response);
            mensaje_confirmacion("Eliminado Correctamente", "Eliminado");
            mostrarListarCliente();
        }
    });
});
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
$(document).on("keyup", "#b_cliente", function (evt) {
    let data = ejecutarAjax("controladores/cliente.php", "leer_descripcion=" + $("#b_cliente").val());


    let fila = "";
    if (data === "0") {
        fila = "NO HAY REGISTROS";
    } else {
        let json_data = JSON.parse(data);
        json_data.map(function (item) {
            fila += `<tr>`;
            fila += `<td>${item.id_cliente}</td>`;
            fila += `<td>${item.descripcion}</td>`;
            fila += `<td>${formatearNumero(item.costo)}</td>`;
            fila += `<td>${item.estado}</td>`;
            fila += `<td>
                        <button class='btn btn-warning editar-cliente'><i class='fa fa-edit'></i> Editar</button>
                        <button class='btn btn-danger eliminar-cliente'><i class='fa fa-trash'></i> Eliminar</button>
                    </td>`;
            fila += `</tr>`;
        });
    }

    $("#cliente_tb").html(fila);
});
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function imprimirCliente() {
    window.open("paginas/referenciales/cliente/print.php");
}

function cargarListaCliente(componente) {
    let datos = ejecutarAjax("controladores/cliente.php", "leer_clientes_activos=1");
    console.log(datos);
    let option = "";
    if (datos === "0") {
        option = "<option value='0'>Selecciona un cliente</option>";
    } else {
        option = "<option value='0'>Selecciona un cliente</option>";
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            option += `<option value='${item.id_cliente}'>${item.descripcion}</option>`;


        });
    }
    $(componente).html(option);
}
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
function cargarListaCliente(componente) {
    let datos = ejecutarAjax("controladores/cliente.php", "leer_clientes_activos=1");
    console.log(datos);
    let option = "";
    if (datos === "0") {
        option = "<option value='0'>Selecciona un cliente</option>";
    } else {
        option = "<option value='0'>Selecciona un cliente</option>";
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            option += `<option value='${item.id_cliente}-${item.costo}'>${item.descripcion}</option>`;


        });
    }
    $(componente).html(option);
}

$(document).on("keyup", "#b_cliente2", function (evt) {
    let data = ejecutarAjax("controladores/cliente.php", "leer_descripcion_cliente=" + $("#b_cliente2").val());

    console.log(data);
    let fila = "";
    if (data === "0") {
        fila = "NO HAY REGISTROS";
    } else {
        let json_data = JSON.parse(data);
        json_data.map(function (item) {
            fila += `<tr>`;
            fila += `<td>${item.cod_cliente}</td>`;
            fila += `<td>${item.nom_apell_cliente}</td>`;
            fila += `<td>${item.telefono}</td>`;
            fila += `<td>${item.cedula_cliente}</td>`;
            fila += `<td>${item.direccion}</td>`;
            fila += `<td>${item.descripcion_ciud}</td>`;
            fila += `<td>${item.estado}</td>`;
            fila += `<td>
                        <button class='btn btn-warning editar-cliente'><i class='fa fa-edit'></i> Editar</button>
                        <button class='btn btn-danger eliminar-cliente'><i class='fa fa-trash'></i> Eliminar</button>
                    </td>`;
            fila += `</tr>`;
        });
    }

    $("#cliente_tb").html(fila);
});


function cargarListaCiudadCliente(componente) {
    let datos = ejecutarAjax("controladores/cliente.php", "leer_ciudad_c=1");
    console.log(datos);
    let option = "<option value='0'>Selecciona una ciudad</option>";
    if (datos !== "0") {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            option += `<option value='${item.cod_ciudad}'>${item.nombre_ciud}</option>`;
        });
    }
    $(componente).html(option);
}