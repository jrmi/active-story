(function ($, storyMgr){
	"use strict";

    //storyMgr.load({});
    storyMgr.clearContext();
    storyMgr.setCurrent('Start');
    location.hash = '#' + storyMgr.getTitle();

    function mkDldURL(content, contentType){
        if(!contentType)
            contentType = 'application/octet-stream';
        var blob = new Blob([content], {'type': contentType});
        return(window.URL.createObjectURL(blob));
    };

	$().ready(function(){
		$('#input').val(storyMgr.getScene());

        function saveStory(){
			storyMgr.setScene($('#input').val());
			$('#download').attr('href', mkDldURL(JSON.stringify(storyMgr.dump()), 'application/json'));
        }

        function importStory(e){
            var f = e.target.files[0];
            var reader = new FileReader();
            var history = []; 
            reader.onload = function(e){
                storyMgr.load(JSON.parse(reader.result));
                $('#input').val(storyMgr.getScene());
                location.hash = '#' + storyMgr.getTitle();
                updateStory();
            }
            reader.readAsText(f);
        }

        function updateStory(){
            storyMgr.setScene($("#input").val());
            $("#error").empty();

            try{
                $("#story").html(storyMgr.render());
            }
            catch(exp){
                $("#error").html(exp);
                $("#story").empty().html("<p>Error, go back to see. !</p>");
                return false;
            }
            
        }

        window.onhashchange = function(e){
            var next_scene = location.hash.substr(1);
            next_scene = next_scene ? next_scene : 'Start';
            storyMgr.goto(next_scene);
            
            $('#history').empty();
            $('#history').html(Mustache.render($("#history_tpl").html(), {history: storyMgr.getHistory()}));
            
            $('#input').val(storyMgr.getScene());
            $('#title').html(storyMgr.getTitle());
			updateStory();
        }
        
        $('#story-tab').on('shown.bs.tab', function (e) {
            updateStory();
            saveStory();
        });
        
        $('#load').change(importStory);
        
        updateStory();
	});
})($, storyMgr);
