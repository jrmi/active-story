(function(scene, story){
	"use strict";

    scene.load(story);

    function downloady(content, filename, contentType){
        if(!contentType)
            contentType = 'application/octet-stream';
        var a = $('<a>Télécharger</a>');
        var blob = new Blob([content], {'type': contentType});
        a.attr('href', window.URL.createObjectURL(blob));
        a.attr('download', filename);
        $('body').append(a);
        a.click();
    };
    function mkDldURL(content, contentType){
        if(!contentType)
            contentType = 'application/octet-stream';
        var blob = new Blob([content], {'type': contentType});
        return(window.URL.createObjectURL(blob));
    };

	$().ready(function(){
		$('#input').val(scene.get('Start'));
        window.onhashchange = function(e){
            var next_scene = location.hash.substr(1);
            next_scene = next_scene ? next_scene : 'Start';
            console.log(next_scene);
            $('#input').val(scene.get(next_scene));
			$('#comp').click();
        }
		$('#comp').on('click', function(evt){
			var text = $("#input").val();
			$("#error").empty();

			try{
			    $("#story").html(scene.render(text));
			}
			catch(exp){
				$("#error").html(exp);
			    $("#story").empty();
				return false;
			}

		}).click();

		$('#save').on('click', function(evt){
			scene.save($('#input').val());
			$('#download').attr('href', mkDldURL("var scenes=" + scene.export() + ";", 'application/javascript'));
		});
	});
})(scene, scenes);
