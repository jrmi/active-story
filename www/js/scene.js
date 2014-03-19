(function($, markdown, Mustache){
	"use strict";

    var context = {};

	function ISMDParse(text, scene){
		// iterate through the tree finding link references
		// parse the markdown into a tree and grab the link references
		var tree = markdown.parse( text );

		( function find_link_refs( jsonml ) {
			if ( jsonml[ 0 ] === "link" ) {
				var href = jsonml[1].href;
				if(href.indexOf('http') !== 0){
					jsonml[1]['class'] = "internal";
                    var scene_name = jsonml[1].href.replace(/\s+/, "_");
					jsonml[1].href = scene_name;
					if(!scene.exists(scene_name)){
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

	window.scene = function(){
		var scenes = {};
		var current_scene = '';
		return {
			'current_scene': function(){
				return current_scene;
			},
			'add': function(name, text){
				scenes[name] = text;
			},
            'load': function(story){
                scenes = story;
            },
			'exists': function(name){
				return (typeof scenes[name] !== 'undefined');
			},
			'get': function(name){
				current_scene = name;
				if(!this.exists(name)){
					return "Empty scene !";
				}
				return scenes[name];
			},
			'save': function(text){
				scenes[current_scene] = text;
			},
            'render': function(text){
				var output = Mustache.render(text, context);
				//output = markdown.toHTML(output);
				output = ISMDParse(output, this);
				output = parseContext(output, context);
                return output;
            },
            'renderCurrent': function(){
                return this.render(this.get(this.current_scene()));
            },
            'export': function(){
                return JSON.stringify(scenes);
            }
		}
	}();
})(jQuery, markdown, Mustache);
