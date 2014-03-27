(function($, markdown, Mustache){
	"use strict";

    var context = {};

	function ISMDParse(text, story){
		// iterate through the tree finding link references
		// parse the markdown into a tree and grab the link references
		var tree = markdown.parse( text );

		( function find_link_refs( jsonml ) {
			if ( jsonml[ 0 ] === "link" ) {
				var href = jsonml[1].href;
				if(href.indexOf('http') !== 0){
					jsonml[1]['class'] = "internal";
                    var scene_name = jsonml[1].href.replace(/\s+/, "_");
					jsonml[1].href = '#' + scene_name;
					if(!story.exists(scene_name)){
						jsonml[2] = jsonml[2] + ' ?';
					    jsonml[1]['class'] += " new";
					}
				}
			}
			else {
                var i=1;
				for ( ; i <= jsonml.length; ++i ) {
					if ( Array.isArray( jsonml[ i ] ) ) {
				    	 find_link_refs(jsonml[i]);
				  	}
				}
			}
        } )( tree );

		// convert the tree into html
		return(markdown.renderJsonML( markdown.toHTMLTree( tree ) ));
	}

	function parseContext(text, context){
		text = text.replace(/\{%\s*([^\}]*)\s*%\}/g, function(match, content) {
			content.replace(/\s*([^\s]+)+\s*/g, function(match, content){
				if(content.charAt(0) === '-'){
					content = content.substr(1);
					context[content] = false;
				}
				else{
					context[content] = true;
				}
			});
			return "";
		});
		return text;
	}

	window.storyMgr = function(){
		var story = {};
		var history = [];
        var current = '';
		return {
            'load': function(new_story){
                story = new_story;
                current = 'Start';
                context = {};
                history = [];
            },
            'dump': function(){
                return story;
            },
            'goto': function(next_scene){
                // Update history
                var found = history.indexOf(current);
                if(found > -1){
                    history.splice(found, 1);
                }
                history.unshift(current);
                if(history.length > 10){
                    history.pop();
                }
                context['visited__' + current] = true;
                current = next_scene;
            },
            'render': function(){
				var output = Mustache.render(story[current], context, story);
				output = ISMDParse(output, this);
				output = parseContext(output, context);
                return output;
            },
			'exists': function(name){
				return (typeof story[name] !== 'undefined');
			},
            'getScene': function(){
                if(!this.exists(current)){
                    return "Empty scene !";
                }
                else{
                    return story[current];
                }
            },
            'setScene': function(text){
                story[current] = text;
            },
            'getHistory': function(){
                return history;
            },
            'getTitle': function(){
                return current;
            },
            'getContext': function(){
                return context;
            }
		}
	}();
})(jQuery, markdown, Mustache);
