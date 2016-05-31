#!/bin/env node
//  toolitup application
var express = require('express');
var fs      = require('fs');


/**
 *  Define the sample application.
 */
var ToolItUp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
        self.zcache['cubic-bezier.html'] = fs.readFileSync('./cubic-bezier.html');
        self.zcache['circular-slider.html'] = fs.readFileSync('./circular-slider.html');
 		self.zcache['minimap.html'] = fs.readFileSync('./minimap.html');
   };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };

        self.routes['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html') );
        };

        self.routes['css/cubic-bezier.html'] = self.routes['/cubic-bezier.html'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('cubic-bezier.html') );
        };

		self.routes['css/circular-slider.html'] = self.routes['/circular-slider.html'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('circular-slider.html') );
        };

        self.routes['/minimap.html'] = function(req, res) {
                res.setHeader('Content-Type', 'text/html');
                res.send(self.cache_get('minimap.html') );
        };

    };


    /**
     *  Plugin middlewares like logging etc..
     * 
     */

    self.pluginMiddleware = function() {
        var app = self.app;

        app.use(express.compress());
        app.use(app.router);
        //app.use(express.logger());
        app.use(express.static(__dirname + '/public'));
        app.use(express.cookieParser('TopSecret+DoNotRevealIt+Promise!!!+:-)'));
        
         // when page not found
        app.use(function(req, res, next) {
            res.setHeader('Content-Type', 'text/html');            
            res.send(self.cache_get('404.html'));
        });
    }


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express();

        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }

        // middleware
        self.pluginMiddleware();
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  toolitup Application.  */



/**
 *  main():  Main code.
 */
var toolitup = new ToolItUp();
toolitup.initialize();
toolitup.start();

