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
    $query = $base_datos->conectar()->prepare("INSERT INTO orden_compra
(cod_orden, oc_fecha_emision, oc_estado, cod_presupuesto, cod_proveedor, cod_usuario) 
VALUES (:cod_orden_compra, :fecha_orden, :estado, :cod_presupuesto_comp,:cod_proveedor,
       ".$_SESSION['id_user'].") ");

    $query->execute($json_datos);
    
    
    $query2 = $base_datos->conectar()->prepare("UPDATE presupuesto set 
        estado_presupuesto = 'UTILIZADO' 
        WHERE cod_presupuesto = :cod_presupuesto_comp");

    $query2->execute([
        'cod_presupuesto_comp' => $json_datos['cod_presupuesto_comp']
    ]);
}

//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------

if(isset($_POST['leer'])){
    leer();
}

function leer(){
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare("SELECT 
oc.cod_orden as cod_orden_compra,
oc.oc_fecha_emision as fecha_orden,
oc.oc_estado as estado,
pvc.pro_razonsocial as nom_ape_prov,
u.usuario_alias as nombre_apellido,
SUM(do.cantidad * do.prec_uni) as total
FROM orden_compra oc
join det_orden  do 
on do.cod_orden  = oc.cod_orden 
join proveedor pvc
on pvc.cod_proveedor = oc.cod_proveedor
join usuario  u 
on u.cod_usuario = oc.cod_usuario
group by oc.cod_orden
order by  oc.cod_orden  desc 
");
    
    $query->execute();

    if ($query->rowCount()) {
        print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
    } else {
        echo '0';
    }
}
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------

if(isset($_POST['ultimo_registro'])){
    ultimo_registro();
}

function ultimo_registro(){
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare("SELECT 
cod_orden
FROM orden_compra
order by cod_orden DESC limit 1");
    
    $query->execute();

    if ($query->rowCount()) {
        print_r(json_encode($query->fetch(PDO::FETCH_OBJ)));
    } else {
        echo '0';
    }
}
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
if(isset($_POST['id'])){
    id($_POST['id']);
}

function id($id){
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare("SELECT 
oc.cod_orden as cod_orden_compra,
oc.cod_proveedor as cod_proveedor,
oc.oc_fecha_emision as fecha_orden,
oc.oc_estado as estado,
pvc.pro_razonsocial as nom_ape_prov,
u.usuario_alias as nombre_apellido,
SUM(do.cantidad * do.prec_uni) as total
FROM orden_compra oc
join det_orden  do 
on do.cod_orden  = oc.cod_orden 
join proveedor pvc
on pvc.cod_proveedor = oc.cod_proveedor
join usuario  u 
on u.cod_usuario = oc.cod_usuario
 WHERE oc.cod_orden  = $id ");
    
    $query->execute();

    if ($query->rowCount()) {
        print_r(json_encode($query->fetch(PDO::FETCH_OBJ)));
    } else {
        echo '0';
    }
}

//----------------------------------------------------------------
//----------------------------------------------------------------
//----------------------------------------------------------------
if(isset($_POST['actualizar'])){
    actualizar($_POST['actualizar']);
}

function actualizar($lista){
    $json_datos = json_decode($lista, true);
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare("UPDATE `orden_compra`
     SET `fecha_orden`=:fecha_orden,`estado`=:estado ,`cod_presupuesto_comp`=:cod_presupuesto_comp ,
     `cod_proveedor`=:cod_proveedor , `cod_usuario`=:cod_usuario, `id_sucursal` = :id_sucursal
     WHERE `cod_orden_compra`=:cod_orden_compra,");

    $query->execute($json_datos);
}

if(isset($_POST['eliminar'])){
    eliminar($_POST['eliminar']);
}

function eliminar($id){
   
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare("DELETE FROM `orden_compra` where cod_orden_compra = $id");

    $query->execute();
}

if(isset($_POST['anular'])){
    anular($_POST['anular']);
}

function anular($id){
   
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare("UPDATE `orden_compra` set oc_estado = 'ANULADO' where cod_orden = $id");

    $query->execute();
}



if(isset($_POST['pendientes'])){
    Orden_pendientes();
}
function Orden_pendientes(){
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare("SELECT 
oc.cod_orden as cod_orden_compra,
oc.oc_fecha_emision as fecha_orden,
oc.oc_estado as estado,
pvc.pro_razonsocial as nom_ape_prov,
u.usuario_alias as nombre_apellido,
SUM(do.cantidad * do.prec_uni) as total
FROM orden_compra oc
join det_orden  do 
on do.cod_orden  = oc.cod_orden 
join proveedor pvc
on pvc.cod_proveedor = oc.cod_proveedor
join usuario  u 
on u.cod_usuario = oc.cod_usuario
where oc.oc_estado = 'PENDIENTE'
GROUP BY oc.cod_orden
");
    
    $query->execute();

    if ($query->rowCount()) {
        print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
    } else {
        echo '0';
    }
}

