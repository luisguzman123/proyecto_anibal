<?php

require_once '../conexion/db.php';
//aasda
if (isset($_POST['guardar'])) {
    guardar($_POST['guardar']);
}

function guardar($lista) {
    //crea un arreglo del texto que se le pasa
    session_start();
    $json_datos = json_decode($lista, true);
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare("INSERT INTO det_orden
(cod_orden, cod_producto, cantidad, prec_uni)
VALUES(:cod_orden_compra, :cod_producto, :cantidad, :costo);");

    $query->execute($json_datos);
}

//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------

// if(isset($_POST['leer'])){
//     leer();
// }

// function leer(){
//     $base_datos = new DB();
//     $query = $base_datos->conectar()->prepare("SELECT 
// oc.cod_orden_compra,
// oc.fecha_orden,
// oc.estado,
// pc.cod_presupuesto_comp,
// pvc.nom_ape_prov,
// u.nombre_apellido,
// s.suc_descripcion
// FROM orden_compra oc
// join presupuesto_compra pc
// on pc.cod_presupuesto_comp = oc.cod_presupuesto_comp
// join proveedor pvc
// on pvc.cod_proveedor = oc.cod_proveedor
// join usuarios u 
// on u.cod_usuario = oc.cod_usuario
// join sucursal s 
// on s.id_sucursal = oc.id_sucursal
// order by  oc.cod_orden_compra  desc 
// ");
    
//     $query->execute();

//     if ($query->rowCount()) {
//         print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
//     } else {
//         echo '0';
//     }
// }
// //-----------------------------------------------------------------------------------------------------
// //-----------------------------------------------------------------------------------------------------
// //-----------------------------------------------------------------------------------------------------

// if(isset($_POST['ultimo_registro'])){
//     ultimo_registro();
// }

// function ultimo_registro(){
//     $base_datos = new DB();
//     $query = $base_datos->conectar()->prepare("SELECT 
// oc.cod_orden_compra,
// oc.fecha_orden,
// oc.estado,
// pc.cod_presupuesto_comp,
// pvc.nom_ape_prov,
// u.nombre_apellido,
// s.suc_descripcion
// FROM orden_compra oc
// join presupuesto_compra pc
// on pc.cod_presupuesto_comp = oc.cod_presupuesto_comp
// join proveedor pvc
// on pvc.cod_proveedor = oc.cod_proveedor
// join usuarios u 
// on u.cod_usuario = oc.cod_usuario
// join sucursal s 
// on s.id_sucursal = oc.id_sucursal
// order by oc.cod_orden_compra DESC limit 1");
    
//     $query->execute();

//     if ($query->rowCount()) {
//         print_r(json_encode($query->fetch(PDO::FETCH_OBJ)));
//     } else {
//         echo '0';
//     }
// }
// //-----------------------------------------------------------------------------------
// //-----------------------------------------------------------------------------------
// //-----------------------------------------------------------------------------------
 if(isset($_POST['id'])){
     id($_POST['id']);
 }

 function id($id){
     $base_datos = new DB();
     $query = $base_datos->conectar()->prepare("select 
        p.cod_producto as cod_producto,
        p.nombre  as nombre_producto,
        dpc.cantidad ,
        dpc.prec_uni as costo,
        dpc.cantidad  * dpc.prec_uni  as total
        from det_orden  dpc
        join producto p ON p.cod_producto  = dpc.cod_producto
        WHERE dpc.cod_orden  = $id ");
    
     $query->execute();

     if ($query->rowCount()) {
         print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
     } else {
         echo '0';
     }
 }

// //----------------------------------------------------------------
// //----------------------------------------------------------------
// //----------------------------------------------------------------
// if(isset($_POST['actualizar'])){
//     actualizar($_POST['actualizar']);
// }

// function actualizar($lista){
//     $json_datos = json_decode($lista, true);
//     $base_datos = new DB();
//     $query = $base_datos->conectar()->prepare("UPDATE `orden_compra`
//      SET `fecha_orden`=:fecha_orden,`estado`=:estado ,`cod_presupuesto_comp`=:cod_presupuesto_comp ,
//      `cod_proveedor`=:cod_proveedor , `cod_usuario`=:cod_usuario, `id_sucursal` = :id_sucursal
//      WHERE `cod_orden_compra`=:cod_orden_compra,");

//     $query->execute($json_datos);
// }

// if(isset($_POST['eliminar'])){
//     eliminar($_POST['eliminar']);
// }

// function eliminar($id){
   
//     $base_datos = new DB();
//     $query = $base_datos->conectar()->prepare("DELETE FROM `orden_compra` where cod_orden_compra = $id");

//     $query->execute();
// }


// if (isset($_POST["leer_descripcion_materiales"])) {
    
//     leer_descripcion_materiales($_POST["leer_descripcion_materiales"]);
//    }
//    function leer_descripcion_materiales ($nombre_apellido){
//        $base = new DB();
//        $query = $base ->conectar()->prepare("SELECT 
// pc.cod_pedido_compra,
// pc.fecha_pedido,
// pc.estado,
// u.nombre_apellido,
// u.cod_usuario,
// s.suc_descripcion,
// s.id_sucursal
// from pedido_compra pc
// join usuarios u 
// on u.cod_usuario = pc.cod_usuario 
// JOIN sucursal s 
// on s.id_sucursal = pc.id_sucursal
// WHERE CONCAT(cod_pedido_compra,' ', nombre_apellido) LIKE '%$nombre_apellido%'");
//        $query ->execute ();
       
//       if ($query->rowCount()) {
//            print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
//        } else {
//            echo '0';
//        }
//    }