var boton = $('.quedadas-toggle');
var limit = 3;
boton.click(function(){
    if (boton.text() === 'Ver todas') {
        boton.text('Ver próximas');
        $('#nuevas').hide();
        if (!$('#viejas').html()) {
           var pageQuedadas = getQuedadas(0, limit, function(data){
               $("#viejas").append(viejasHtml(data[1]));
               $("#viejas").append(pageHtml(data[0], limit));

               $(".pagination a").click(function(e){
                    e.preventDefault();
                    $('#viejas .quedada').remove();
                    getQuedadas(Number($(this).text())-1, limit, function(data){
                        $('#viejas').prepend(viejasHtml(data[1]));
                    })
                })
              
           });
        }
        $('#viejas').show();
    } else {
        boton.text('Ver todas');
        
        $('#viejas').hide();
        $('#nuevas').show();
    }
})


function getQuedadas(page, limit, callback){
     $.get('http://localhost:3000/quedadas?page='+page+'&limit='+limit,function(data){
         callback(data);
     })
}

function pageHtml(total, limit) {
    var html = '';
    html+='<ul class="pagination pagination-lg">'
    for (var i=1; i<=Math.ceil(total/limit); i++) {
        html+= '<li><a href="">'+i+'</a><li>';
    }
    html+='</ul>';
    return html;
}

function viejasHtml(viejas) {
    html = '';
    viejas.forEach(function(vieja){
        html+='<div class="row quedada">';
        html+='<div class="col-md-4 tipo">'+vieja.tipo+'</div>';
        html+='<div class="col-md-4 fecha">'+vieja.fecha+'</div>';
        html+='<div class="col-md-4 participante">';
        vieja.participantes.forEach(function(participante){
            html+= '<span>'+participante+'</span>';
        })
        html+='</div></div>';
    })
    return html;
}

function remove(id){
    
    $.ajax({
        url: "/delete/"+id,
        method: "delete"
    }).done(function(data) {
        if (data.success) $("#"+id).remove();
        else console.log('No se ha podido borrar')
    });
    
}

function edit(quedada){
    //Crear html de la ventana modal
    var html = '<div class="modal fade" tabindex="-1" role="dialog">\
                <div class="modal-dialog" role="document">\
                <div class="modal-content">\
                <div class="modal-header">\
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                <h4 class="modal-title">Edit</h4>\
                </div>\
                <div class="modal-body">\
                <input type="text"
                </div>\
                <div class="modal-footer">\
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
                <button type="button" class="btn btn-primary">Save changes</button>\
                </div>\
                </div>\
                </div>\
                </div>;


    // Rellenarlo con los datos

    //Mostrarla



}