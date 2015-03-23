angular.module('activeStoryApp')
.filter 'inMarkdown', ($sce, $compile, markdown) ->
  return (rawMarkdown) ->
    return $sce.trustAsHtml(markdown.convert(rawMarkdown || ''))


.filter 'parseText', ($sce, $compile, utils) ->
  return (text) ->
    return $sce.trustAsHtml(utils.render(text || ''))