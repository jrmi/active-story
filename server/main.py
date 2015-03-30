import json
from json import JSONEncoder
from bottle import route, run, request, abort
from pymongo import Connection
from pymongo.collection import ObjectId

class MongoEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return JSONEncoder.default(self, obj)

connection = Connection('localhost', 27017)
db = connection.interactiveStories


@route('/stories')
def stories():
    res = []
    for st in db['stories'].find():
        st['canEdit'] = True
        res.append(st)

    return json.dumps(res, cls=MongoEncoder)


@route('/stories/<uid>', method='GET')
def story_show(uid):
    entity = db['stories'].find_one({'_id': ObjectId(uid)})
    if not entity:
        abort(404, 'No document with id %s' % id)
    entity['_id'] = str(entity['_id'])
    entity['canEdit'] = True
    return entity


@route('/stories', method='POST')
def story_save():
    data = request.body.readline()
    entity = json.loads(data)
    if '_id' in entity:
        entity['_id'] = ObjectId(entity['_id'])
    new_id = db['stories'].save(entity)
    entity['_id'] = str(new_id)
    return entity


# Pages services

@route('/pages')
def pages():
    pages_list = db['pages'].find(dict(request.query))
    res = []
    for st in pages_list:
        res.append(st)

    return json.dumps(res, cls=MongoEncoder)


@route('/pages/<uid>', method='GET')
def page_show(uid):
    entity = db['pages'].find_one({'_id': ObjectId(uid)})
    if not entity:
        abort(404, 'No document with id %s' % id)
    entity['_id'] = str(entity['_id'])
    return entity


@route('/pages', method='POST')
def page_save():
    data = request.body.readline()
    entity = json.loads(data)
    if '_id' in entity:
        entity['_id'] = ObjectId(entity['_id'])
    new_id = db['pages'].save(entity)
    entity['_id'] = str(new_id)
    return entity


@route('/pages/<uid>', method='DELETE')
def page_delete(uid):
    result = db['pages'].remove({'_id': ObjectId(uid)})
    return result



run(host='localhost', port=8080, debug=True, reloader=True)
