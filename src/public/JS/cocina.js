var jsonCont = {Total: 0, ProductosSeleccionados : []}
var ProductosSeleccionados = [];
function agregarArticulo(elm){
    if(document.getElementsByName(elm.Nombre).length > 0){
        for(var i = 0; i < ProductosSeleccionados.length; i++){
            if(ProductosSeleccionados[i].ID == elm.ID){
                
                ProductosSeleccionados[i].Cantidad += 1;
                ProductosSeleccionados[i].precio += parseFloat(elm.Precio);
                
                console.log(document.getElementsByClassName(elm.Nombre + 'Cant')[0])

                document.getElementsByName(elm.Nombre)[0].textContent = formatMoney(ProductosSeleccionados[i].precio);
                document.getElementsByClassName(elm.Nombre + 'Cant')[0].textContent = ProductosSeleccionados[i].Cantidad;
            }
        }
    }else{
        var priceFormated = formatMoney(elm.Precio);
        var tdAdd = `<td style="padding:0; padding-left: 15px;">${elm.Nombre}</td>
        <td style="padding:0;" class="redHover ${elm.Nombre}Cant" onclick="quitarProducto(this,${elm.Precio})">1</td>
        <td style="padding:0;" name="${elm.Nombre}">${priceFormated}</td>`;

        var elmD = document.createElement('tr');
        elmD.id = elm.ID
        elmD.setAttribute('style','border:none;')
        elmD.innerHTML = tdAdd;

        document.getElementById('tbdTicketDetalle').append(elmD);
        ProductosSeleccionados.push({ID: elm.ID, nombre: elm.Nombre, precio: elm.Precio, Cantidad: 1});
        
//AGREGAR INPUT NAME PRODUCTOS EN VISTA
    }
    getTotal(elm.Precio);
}

function getTotal(sum){
    var pA = jsonCont.Total;
    pA = parseFloat(pA)+ parseFloat(sum);
    jsonCont = {Total: pA, Productos: ProductosSeleccionados}
    pA = formatMoney(pA);
    document.getElementById('Productos').value = JSON.stringify(jsonCont);
    document.getElementById('h_total').textContent = 'Total: '+ pA;
}

function reiniciarCuenta(){
    ProductosSeleccionados = [];
    jsonCont = {Total: 0, ProductosSeleccionados : []};
    document.getElementById('h_total').textContent = 'Total: $ 0.00';
    document.getElementById('tbdTicketDetalle').innerHTML = '';
    document.getElementById('MenuForm').innerHTML = '';
}

function quitarProducto(elm, precio){
    if(elm.textContent == 1){
        for(var i = 0; i < ProductosSeleccionados.length; i++){
            if(ProductosSeleccionados[i].ID == elm.parentNode.id){
                ProductosSeleccionados.splice(i,1);
            }
        }
        elm.parentNode.remove();
    }else{
        for(var i = 0; i < ProductosSeleccionados.length; i++){
            if(ProductosSeleccionados[i].ID == elm.parentNode.id){ //CAMBIAR ID
                ProductosSeleccionados[i].Cantidad -= 1;
                ProductosSeleccionados[i].precio -= parseFloat(precio);
                                
                elm.parentNode.children[2].textContent = formatMoney( ProductosSeleccionados[i].precio);
                elm.textContent = ProductosSeleccionados[i].Cantidad;
            }
        }
    }
    getTotal(- (parseFloat(precio)))
}

function createTicket(){
    if(jsonCont.Total != 0){
        var TDate = new Date();
        document.getElementById('lblDate').textContent = TDate.toLocaleDateString() + ' ' + TDate.toLocaleTimeString();
        var total = parseFloat(jsonCont.Total);
        var iva2 = (iva/100).toFixed(2);
        const iva8 = (parseFloat(total) * iva2 ).toFixed(2);
        var Subtotal = total - iva8;
        
        var innerTDPRODUCTOS = '';
        for(var j = 0; j < jsonCont.Productos.length; j++){
            innerTDPRODUCTOS += `<tr>
            <td style="padding:0;">${jsonCont.Productos[j].Cantidad}</td>
            <td style="padding:0;">${jsonCont.Productos[j].nombre}</td>
            <td style="padding:0;">${formatMoney(jsonCont.Productos[j].precio)}</td>
            </tr>`
        }
        

        var innerTotalTD = `<tr style="border: none;">
        <td style="padding:0;"></td>
        <td style="padding:0;">Subtotal:</td>
        <td style="padding:0;" id="tdSubtotal">${formatMoney(Subtotal)}</td>
        </tr>
        <tr style="border: none;">
        <td style="padding:0;"></td>
        <td style="padding:0;">IVA(${iva}%):</td>
        <td style="padding:0;" id="tdIva">${formatMoney(iva8)}</td>
        </tr>
        <tr style="border: none;">
        <td style="padding:0;"></td>
        <td style="padding:0;">Total:</td>
        <td style="padding:0;" id="tdTotal">${formatMoney(total)}</td>
        </tr>`;
        document.getElementById('tbdProductos').innerHTML = innerTDPRODUCTOS + innerTotalTD;

        var modal = document.querySelectorAll('#modalTicket');
        var inst = M.Modal.init(modal)
        inst[0].open();
    }else{

        alert('Seleccione productos antes de generar el ticket.')
    }
}

function formatMoney(n, c, d, t) {
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
      d = d == undefined ? "." : d,
      t = t == undefined ? "," : t,
      s = n < 0 ? "-" : "",
      i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
      j = (j = i.length) > 3 ? j % 3 : 0;
  
    return '$ ' + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  };

function sendForm(){
    document.getElementById('btn-send').click();
}