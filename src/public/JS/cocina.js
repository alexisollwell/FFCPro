function agregarArticulo(elm){
    if(document.getElementsByName(elm.Nombre).length > 0){
        var precioAnterior = document.getElementsByName(elm.Nombre)[0].textContent.split(' ')[1];
        document.getElementsByName(elm.Nombre)[0].textContent = '$ ' +( parseFloat(precioAnterior) + elm.Precio);
        var cant = document.getElementsByClassName(elm.Nombre + 'Cant')[0].textContent.trim()
        cant = parseInt(cant) + 1;
        document.getElementsByClassName(elm.Nombre + 'Cant')[0].textContent = cant;

        var nombre = elm.Nombre.trim();
        var datos = document.getElementById(nombre);
        console.log(datos)
        var datosFood =datos.value.split(",");
        var CantidadDato= datosFood[3];
        var cantidad = CantidadDato.split(":");
        var nuevaCantidad = parseInt(cantidad[1])+1;
        document.getElementsByClassName(nombre)[0].value="{\'ID\':'"+ elm.ID+"',\'nombre\':'"+elm.Nombre+"', \'precio\':"+elm.Precio+', \'cantidad\':'+nuevaCantidad + '}';
    }else{
        var inner = '<div class="col s7"><label style="color:black;">'+ elm.Nombre + '</label></div><div class="col s1 redHover" onclick="quitarProducto(this,'+elm.Precio+')"><label class="'+ elm.Nombre+'Cant" style="color:black;">1</label></div><div class="col s3"><label style="color:black;" name="'+elm.Nombre+'">$ '+ elm.Precio + '</label></div>';
        var elmD = document.createElement('div');
        elmD.classList = 'col s12'
        elmD.innerHTML = inner;
        document.getElementById('prodOrd').append(elmD);

        var nombre = elm.Nombre.trim();
        var inn2 = '<input type="hidden" value="{\'ID\':\''+ elm.ID+'\',\'nombre\':\''+ elm.Nombre+"\',\'precio\':"+elm.Precio+', \'cantidad\':1}" id="'+nombre+'" name="Productos" class="'+nombre+'">';
        var el2 = document.createElement('input');
        el2.innerHTML = inn2;
        document.getElementById('MenuForm').append(el2);
    }
    getTotal(elm.Precio);
}

function getTotal(sum){
    var pA = document.getElementById('h_total').textContent.split('$')[1];
    pA = parseFloat(pA)+ parseFloat(sum);
    document.getElementById('h_total').textContent = 'Total: $'+pA;
}

function reiniciarCuenta(){
    document.getElementById('h_total').textContent = 'Total: $0';
    document.getElementById('prodOrd').innerHTML = '';
    document.getElementById('MenuForm').innerHTML = '';
}

function quitarProducto(elm, precio){
    if(elm.children[0].textContent == 1){
        elm.parentNode.remove();
    }else{
        elm.parentNode.children[2].children[0].textContent = '$ ' + ( parseFloat(elm.parentNode.children[2].children[0].textContent.split('$')[1].trim()) - precio).toString();
        elm.children[0].textContent = parseInt(elm.children[0].textContent) - 1;
    }
    getTotal(- (parseFloat(precio)))
}