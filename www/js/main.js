(function ($, scene, story){
	"use strict";

    scene.load(story);

    function mkDldURL(content, contentType){
        if(!contentType)
            contentType = 'application/octet-stream';
        var blob = new Blob([content], {'type': contentType});
        return(window.URL.createObjectURL(blob));
    };

	$().ready(function(){
		$('#input').val(scene.get('Start'));
        
        function updateStory(){
			var text = $("#input").val();
			$("#error").empty();

			try{
			    $("#story").html(scene.render(text));
			}
			catch(exp){
				$("#error").html(exp);
			    $("#story").empty().htam("Error, go back to see. !");
				return false;
			}
        }
        
        function saveStory(){
			scene.save($('#input').val());
			$('#download').attr('href', mkDldURL("var scenes=" + scene.export() + ";", 'application/javascript'));
        }
        
        window.onhashchange = function(e){
            var next_scene = location.hash.substr(1);
            next_scene = next_scene ? next_scene : 'Start';
            
            $('#input').val(scene.get(next_scene));
			updateStory();
        }
        
        $('#story-tab').on('shown.bs.tab', function (e) {
            updateStory();
            saveStory();
        });
        
        updateStory();
	});
})($, scene, scenes);
