function agregarArticulo(elm){
    if(document.getElementsByName(elm.Nombre).length > 0){
        var precioAnterior = document.getElementsByName(elm.Nombre)[0].textContent.split(' ')[1];
        document.getElementsByName(elm.Nombre)[0].textContent = '$ ' +( parseFloat(precioAnterior) + elm.Precio);

    }else{
        var inner = '<div class="col s9"><label style="color:black;">'+ elm.Nombre + '</label></div><div class="col s3"><label style="color:black;" name="'+elm.Nombre+'">$ '+ elm.Precio + '</label></div>';
        var elmD = document.createElement('div');
        elmD.classList = 'col s12'
        elmD.innerHTML = inner;
        document.getElementById('prodOrd').append(elmD);
    }
}

function getTotal(){


    document.getElementById('h_total').textContent = 'Total: $500';
}