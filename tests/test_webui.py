from flask import Flask, Response, jsonify, request, abort


import os
import sys
import cffi

location = os.path.dirname(os.path.realpath(__file__))
sys.path.insert(0, os.path.join(location, "..", "sptrader"))

import sse
import config
from queue import Queue
from sse import ServerSentEvent
import sptrader
import config

sp = None
subscriptions = []
app = Flask(__name__,
            static_url_path="/static",
            static_folder=os.path.join(location, "..",
                                                 "static"))
@app.route("/")
def hello():
    return app.send_static_file("sptrader.html")

@app.route("/logininfo")
def logininfo():
    return jsonify(config.logininfo)

@sptrader.ffi.callback("LoginReplyAddr")
def login_reply(ret_code, ret_msg):
    msg = {
        "id" : "ping",
        "msg" : "%d %s" % (ret_code, sptrader.ffi.string(ret_msg))
        }
    for sub in subscriptions[:]:
        sub.put(msg)

@app.route("/login", methods=['POST'])
def login():
    global sp
    if not request.json:
        abort(400)
    if sp != None:
        abort(400)
    sp = sptrader.SPTrader(request.json["host"],
                           request.json["port"],
                           request.json["license"],
                           request.json["app_id"],
                           request.json["user_id"],
                           request.json["password"])
    return jsonify({"retval" : sp.login(login_reply)})

@app.route("/ping")
def ping():
    msg = {
        "id" : "ping",
        "msg" : "Ping"
        }
    for sub in subscriptions[:]:
        sub.put(msg)
    return "OK"

@app.route("/logout")
def logout():
    global sp
    sp.logout()
    sp = None
    return "OK"
    
@app.route("/subscribe")
def subscribe():
    def gen():
        q = Queue()
        subscriptions.append(q)
        try:
            while True:
                result = q.get()
                id = result['id']
                ev = ServerSentEvent(result, id)
                yield ev.encode()
        except GeneratorExit:  # Or maybe use flask signals
            subscriptions.remove(q)
    return Response(gen(), mimetype="text/event-stream")


if __name__ == "__main__":
    app.debug = True
    app.run(threaded=True)

