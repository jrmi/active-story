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
        var history=['Start'];

        function updateStory(){
			var text = $("#input").val();
			$("#error").empty();

			try{
			    $("#story").html(scene.render(text));
			}
			catch(exp){
				$("#error").html(exp);
			    $("#story").empty().htlm("<p>Error, go back to see. !</p>");
				return false;
			}
            
        }
        
        function saveStory(){
			scene.save($('#input').val());
			$('#download').attr('href', mkDldURL(scene.export(), 'application/javascript'));
        }

        function importStory(e){
            var f = e.target.files[0];
            var reader = new FileReader();
        
            reader.onload = function(e){
                scene.load(JSON.parse(reader.result));
                $('#input').val(scene.get('Start'));
                updateStory();
            }
            reader.readAsText(f);
        }
        
        window.onhashchange = function(e){
            var next_scene = location.hash.substr(1);
            next_scene = next_scene ? next_scene : 'Start';
            
            var found = history.indexOf(next_scene);
            if(found > -1){
                history.splice(found, 1);
            }
            history.unshift(next_scene);
            if(history.length > 10){
                history.pop();
            }
            $('#history').empty();
            for(var i in history){
                var a = $('<a/>').attr('href','#' + history[i]).text(history[i]);
                var li = $('<li/>').append(a)
                $('#history').append(li);
            }
            
            $('#input').val(scene.get(next_scene));
            $('#title').html(next_scene);
			updateStory();
        }
        
        $('#story-tab').on('shown.bs.tab', function (e) {
            updateStory();
            saveStory();
        });
        
        $('#load').change(importStory);
        
        updateStory();
	});
})($, scene, {});
