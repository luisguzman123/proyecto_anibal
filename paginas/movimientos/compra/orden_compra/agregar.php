<div class="container-fluid card" style="padding: 30px;">
    <?php session_start();?>
<div class="row">
    <input type="text" id="id_cliente" hidden value="0">
    <div class="col-md-12">
        <h3>Agregar Orden de  Compra</h3>
    </div>
    <div class="col-md-12">
        <hr> 
    </div>
    <div class="col-md-1">
        <label for="">Codigo</label>
        <input type="text" id="cod" class="form-control" readonly>
    </div>
    
    <div class="col-md-5">
        <label for="">Usuario</label>
        <input type="text" id="usuario_lst" class="form-control" readonly value="<?= $_SESSION['usuario_alias']?>">
          
    </div>
    <div class="col-md-6">
        <label for="">Fecha</label>
        <input type="date" name="" id="fecha" class="form-control"></input>
    </div>
<!--    <div class="col-md-6">
        <label>Presupuesto</label>
        <select name="" id="presupuesto_compra_lst" class="form-control"></select>
    </div>-->
    <div class="col-md-12">
        <label>Proveedor</label>
        <select name="" id="proveedor_compra_lst" class="form-control"></select>
    </div>
    
    
    
    
       <div class="col-md-12">
        <hr> 
    </div>
    <div class="col-md-4">
        <label>Insumo</label>
        <select name="" id="insumo_lst" class="form-control"></select>
    </div>
    <div class="col-md-3">
        <label>Cantidad</label>
        <input type="text" value="1" class="form-control formatear-numero" id="cantidad_txt">
    </div>
    <div class="col-md-3">
        <label>Costo</label>
        <input type="text" value="1" class="form-control formatear-numero" id="costo_txt">
    </div>
    <div class="col-md-2">
        <label>Operaciones</label>
        <button class="form-control btn btn-primary" onclick="agregarTablaOrdenCompra(); return false;">Agregar</button>
    </div>
       <div class="col-md-12">
        <hr> 
    </div>
    
 
    <div class="col-md-12">
        <table class="table table-bordered">
            <thead>
                <tr>
                     <th>#</th>
                     <th>Insumo</th>
                     <th>Costo</th>
                     <th>Cantidad</th>
                     <th>Total</th>
                    
                </tr>
            </thead>
            <tbody id="orden_compra_compra"></tbody>
            <tfoot>
                <tr>
                    <th colspan="5">Total</th>
                    <th id="total">0</th>
                </tr>
            </tfoot>
        </table>
    </div>
    
   
   
    <div class="col-md-12">
        <hr> 
    </div>
    <div class="col-md-3">
        <button class="form-control btn btn-success" onclick="guardarOrdenCompra(); return false;"><i class="fa fa-save"></i> Guardar</button>
    </div>
    <div class="col-md-3">
        <button class="form-control btn btn-danger" onclick="cancelarOrdenCompra(); return false;"><i class="fa fa-ban"></i> Cancelar</button>
    </div>
</div>
</div>
