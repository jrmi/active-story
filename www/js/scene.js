(function($, markdown, Mustache){
	"use strict";


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

	function parseContext(text, story){
		text = text.replace(/\{%\s*([^\}]*)\s*%\}/g, function(match, content) {
			content.replace(/\s*([^\s]+)+\s*/g, function(match, content){
				if(content.charAt(0) === '-'){
					content = content.substr(1);
                    story.setContext(content, false);
				}
				else{
                    story.setContext(content, true);
				}
			});
			return "";
		});
		return text;
	}

	window.storyMgr = function(){
		var history = [];
		return {
            'load': function(new_story){
                localStorage.clear();
                for(var key in new_story){
                    localStorage.setItem(key, new_story[key]);
                }
                this.setCurrent('Start');
                this.clearContext();
                history = [];
            },
            'dump': function(){
                var story = {};
                for(var key in localStorage){
                    if(key.charAt(0) !== '_'){
                        story[key] = localStorage[key];
                    } 
                }
                return story;
            },
            'goto': function(next_scene){
                // Update history
                var found = history.indexOf(this.current());
                if(found > -1){
                    history.splice(found, 1);
                }
                history.unshift(this.current());
                if(history.length > 10){
                    history.pop();
                }
                this.setContext(this.current(), true); 
                this.setCurrent(next_scene);
            },
            'render': function(){
				var output = Mustache.render(this.getScene(), this.getContext(), localStorage);
				output = ISMDParse(output, this);
				output = parseContext(output, this);
                return output;
            },
			'exists': function(name){
				return (localStorage.getItem(name) !== null);
			},
            'getScene': function(){
                if(!this.exists(this.current())){
                    return "Empty scene !";
                }
                else{
                    return localStorage[this.current()];
                }
            },
            'setScene': function(text){
                localStorage[this.current()] = text;
            },
            'getHistory': function(){
                return history;
            },
            'getTitle': function(){
                return localStorage['__current'];
            },
            'current': function(){
                return localStorage['__current'];
            },
            'setCurrent': function(name){
                localStorage['__current'] = name;
            },
            'getContext': function(){
                return JSON.parse(localStorage.getItem('__context') || '{}');
            },
            'clearContext': function(){
                localStorage['__context'] = '{}';
            },
            'setContext': function(key, value){
                var context = this.getContext();
                context[key] = value;
                localStorage['__context'] = JSON.stringify(context);
            }
		}
	}();
})(jQuery, markdown, Mustache);
