/*
 * Copyright 2009, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


/**
 * @fileoverview Base for all o3d sample utilties.
 *    For more information about o3d see
 *    http://code.google.com/p/o3d.
 *
 *
 * The main point of this module is to provide a central place to
 * have an init function to register an o3d namespace object because many other
 * modules need access to it.
 */

/**
 * A namespace for all the o3djs utility libraries.
 * @namespace
 */
var o3djs = o3djs || {};

/**
 * Define this because the Google internal JSCompiler needs goog.typedef below.
 */
var goog = goog || {};

/**
 * A macro for defining composite types.
 *
 * By assigning goog.typedef to a name, this tells Google internal JSCompiler
 * that this is not the name of a class, but rather it's the name of a composite
 * type.
 *
 * For example,
 * /** @type {Array|NodeList} / goog.ArrayLike = goog.typedef;
 * will tell JSCompiler to replace all appearances of goog.ArrayLike in type
 * definitions with the union of Array and NodeList.
 *
 * Does nothing in uncompiled code.
 */
goog.typedef = true;

/**
 * Reference to the global context.  In most cases this will be 'window'.
 */
o3djs.global = this;

/**
 * Flag used to force a function to run in the browser when it is called
 * from V8.
 * @type {boolean}
 */
o3djs.BROWSER_ONLY = true;

/**
 * Array of namespaces that have been provided.
 * @private
 * @type {!Array.<string>}
 */
o3djs.provided_ = [];

/**
 * Creates object stubs for a namespace. When present in a file,
 * o3djs.provide also indicates that the file defines the indicated
 * object.
 * @param {string} name name of the object that this file defines.
 */
o3djs.provide = function(name) {
  // Ensure that the same namespace isn't provided twice.
  if (o3djs.getObjectByName(name) &&
      !o3djs.implicitNamespaces_[name]) {
    throw 'Namespace "' + name + '" already declared.';
  }

  var namespace = name;
  while ((namespace = namespace.substring(0, namespace.lastIndexOf('.')))) {
    o3djs.implicitNamespaces_[namespace] = true;
  }

  o3djs.exportPath_(name);
  o3djs.provided_.push(name);
};


/**
 * Namespaces implicitly defined by o3djs.provide. For example,
 * o3djs.provide('o3djs.events.Event') implicitly declares
 * that 'o3djs' and 'o3djs.events' must be namespaces.
 *
 * @type {Object}
 * @private
 */
o3djs.implicitNamespaces_ = {};

/**
 * Builds an object structure for the provided namespace path,
 * ensuring that names that already exist are not overwritten. For
 * example:
 * "a.b.c" -> a = {};a.b={};a.b.c={};
 * Used by o3djs.provide and o3djs.exportSymbol.
 * @param {string} name name of the object that this file defines.
 * @param {Object} opt_object the object to expose at the end of the path.
 * @param {Object} opt_objectToExportTo The object to add the path to; default
 *     is |o3djs.global|.
 * @private
 */
o3djs.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split('.');
  var cur = opt_objectToExportTo || o3djs.global;
  var part;

  // Internet Explorer exhibits strange behavior when throwing errors from
  // methods externed in this manner.  See the testExportSymbolExceptions in
  // base_test.html for an example.
  if (!(parts[0] in cur) && cur.execScript) {
    cur.execScript('var ' + parts[0]);
  }

  // Parentheses added to eliminate strict JS warning in Firefox.
  while (parts.length && (part = parts.shift())) {
    if (!parts.length && o3djs.isDef(opt_object)) {
      // last part and we have an object; use it.
      cur[part] = opt_object;
    } else if (cur[part]) {
      cur = cur[part];
    } else {
      cur = cur[part] = {};
    }
  }
};


/**
 * Returns an object based on its fully qualified external name.  If you are
 * using a compilation pass that renames property names beware that using this
 * function will not find renamed properties.
 *
 * @param {string} name The fully qualified name.
 * @param {Object} opt_obj The object within which to look; default is
 *     |o3djs.global|.
 * @return {Object} The object or, if not found, null.
 */
o3djs.getObjectByName = function(name, opt_obj) {
  var parts = name.split('.');
  var cur = opt_obj || o3djs.global;
  for (var pp = 0; pp < parts.length; ++pp) {
    var part = parts[pp];
    if (cur[part]) {
      cur = cur[part];
    } else {
      return null;
    }
  }
  return cur;
};


/**
 * Implements a system for the dynamic resolution of dependencies.
 * @param {string} rule Rule to include, in the form o3djs.package.part.
 */
o3djs.require = function(rule) {
  // TODO(gman): For some unknown reason, when we call
  // o3djs.util.getScriptTagText_ it calls
  // document.getElementsByTagName('script') and for some reason the scripts do
  // not always show up. Calling it here seems to fix that as long as we
  // actually ask for the length, at least in FF 3.5.1 It would be nice to
  // figure out why.
  var dummy = document.getElementsByTagName('script').length;
  console.log('rule',rule);
  // if the object already exists we do not need do do anything
  if (o3djs.getObjectByName(rule)) {
    return;
  }
  var path = o3djs.getPathFromRule_(rule);
  if (path) {
    o3djs.included_[path] = true;
    o3djs.writeScripts_();
  } else {
    throw new Error('o3djs.require could not find: ' + rule);
  }
};


/**
 * Path for included scripts.
 * @type {string}
 */
o3djs.basePath = '';


/**
 * Object used to keep track of urls that have already been added. This
 * record allows the prevention of circular dependencies.
 * @type {Object}
 * @private
 */
o3djs.included_ = {};


/**
 * This object is used to keep track of dependencies and other data that is
 * used for loading scripts.
 * @private
 * @type {Object}
 */
o3djs.dependencies_ = {
  visited: {},  // used when resolving dependencies to prevent us from
                // visiting the file twice.
  written: {}  // used to keep track of script files we have written.
};


/**
 * Tries to detect the base path of the o3djs-base.js script that
 * bootstraps the o3djs libraries.
 * @private
 */
o3djs.findBasePath_ = function() {
  var doc = o3djs.global.document;
  if (typeof doc == 'undefined') {
    return;
  }
  if (o3djs.global.BASE_PATH) {
    o3djs.basePath = o3djs.global.BASE_PATH;
    return;
  } else {
    // HACKHACK to hide compiler warnings :(
    o3djs.global.BASE_PATH = null;
  }
  var scripts = doc.getElementsByTagName('script');
  for (var script, i = 0; script = scripts[i]; i++) {
    var src = script.src;
    var l = src.length;
    if (src.substr(l - 13) == 'o3djs/base.js') {
      o3djs.basePath = src.substr(0, l - 13);
      return;
    }
  }
};


/**
 * Writes a script tag if, and only if, that script hasn't already been added
 * to the document.  (Must be called at execution time.)
 * @param {string} src Script source.
 * @private
 */
o3djs.writeScriptTag_ = function(src) {
  var doc = o3djs.global.document;
  if (typeof doc != 'undefined' &&
      !o3djs.dependencies_.written[src]) {
    o3djs.dependencies_.written[src] = true;
    doc.write('<script type="text/javascript" src="' +
              src + '"></' + 'script>');
  }
};


/**
 * Resolves dependencies based on the dependencies added using addDependency
 * and calls writeScriptTag_ in the correct order.
 * @private
 */
o3djs.writeScripts_ = function() {
  // the scripts we need to write this time.
  var scripts = [];
  var seenScript = {};
  var deps = o3djs.dependencies_;

  function visitNode(path) {
    if (path in deps.written) {
      return;
    }

    // we have already visited this one. We can get here if we have cyclic
    // dependencies.
    if (path in deps.visited) {
      if (!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path);
      }
      return;
    }

    deps.visited[path] = true;

    if (!(path in seenScript)) {
      seenScript[path] = true;
      scripts.push(path);
    }
  }

  for (var path in o3djs.included_) {
    if (!deps.written[path]) {
      visitNode(path);
    }
  }

  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i]) {
      o3djs.writeScriptTag_(o3djs.basePath + scripts[i]);
    } else {
      throw Error('Undefined script input');
    }
  }
};


/**
 * Looks at the dependency rules and tries to determine the script file that
 * fulfills a particular rule.
 * @param {string} rule In the form o3djs.namespace.Class or
 *     project.script.
 * @return {string?} Url corresponding to the rule, or null.
 * @private
 */
o3djs.getPathFromRule_ = function(rule) {
  var parts = rule.split('.');
  return parts.join('/') + '.js';
};

o3djs.findBasePath_();

/**
 * Returns true if the specified value is not |undefined|.
 * WARNING: Do not use this to test if an object has a property. Use the in
 * operator instead.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is defined.
 */
o3djs.isDef = function(val) {
  return typeof val != 'undefined';
};


/**
 * Exposes an unobfuscated global namespace path for the given object.
 * Note that fields of the exported object *will* be obfuscated,
 * unless they are exported in turn via this function or
 * o3djs.exportProperty.
 *
 * <p>Also handy for making public items that are defined in anonymous
 * closures.
 *
 * ex. o3djs.exportSymbol('Foo', Foo);
 *
 * ex. o3djs.exportSymbol('public.path.Foo.staticFunction',
 *                        Foo.staticFunction);
 *     public.path.Foo.staticFunction();
 *
 * ex. o3djs.exportSymbol('public.path.Foo.prototype.myMethod',
 *                        Foo.prototype.myMethod);
 *     new public.path.Foo().myMethod();
 *
 * @param {string} publicPath Unobfuscated name to export.
 * @param {Object} object Object the name should point to.
 * @param {Object} opt_objectToExportTo The object to add the path to; default
 *     is |o3djs.global|.
 */
o3djs.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  o3djs.exportPath_(publicPath, object, opt_objectToExportTo);
};

/**
 * This string contains JavaScript code to initialize a new V8 instance.
 * @private
 * @type {string}
 */
o3djs.v8Initializer_ = '';

/**
 * This array contains references to objects that v8 needs to bind to when
 * it initializes.
 * @private
 * @type {!Array.<Object>}
 */
o3djs.v8InitializerArgs_ = [];

/**
 * Converts any JavaScript value to a string representation that when evaluated
 * will result in an equal value.
 * @param {*} value Any value.
 * @return {string} A string representation for the value.
 * @private
 */
o3djs.valueToString_ = function(value) {
  switch (typeof(value)) {
    case 'undefined':
      return 'undefined';
    case 'string':
      var escaped = escape(value);
      if (escaped === value) {
        return '"' + value + '"';
      } else {
        return 'unescape("' + escaped + '")';
      }
    case 'object':
      if (value === null) {
        return 'null';
      } else {
        // TODO: all the other builtin JavaScript objects like Date,
        // Number, Boolean, etc.
        if (value instanceof RegExp) {
          var result =
              'new RegExp(' + o3djs.valueToString_(value.source) + ', "';
          if (value.global) {
            result += 'g';
          }
          if (value.ignoreCase) {
            result += 'i';
          }
          if (value.multiline) {
            result += 'm';
          }
          result += '")';
          return result;
        } else if (o3djs.base.isArray(value)) {
          var valueAsArray = /** @type {!Array} */ (value);
          var result = '[';
          var separator = '';
          for (var i = 0; i < valueAsArray.length; ++i) {
            result += separator + o3djs.valueToString_(valueAsArray[i]);
            separator = ',';
          }
          result += ']\n';
          return result;
        } else {
          var valueAsObject = /** @type {!Object} */ (value);
          var result = '{\n';
          var separator = '';
          for (var propertyName in valueAsObject) {
            result += separator + '"' + propertyName + '": ' +
              o3djs.valueToString_(valueAsObject[propertyName]);
            separator = ',';
          }
          result += '}\n';
          return result;
        }
      }
    default:
      return value.toString()
  }
};

/**
 * Given an object holding a namespace and the name of that namespace,
 * generates a string that when evaluated will populate the namespace.
 * @param {!Object} namespaceObject An object holding a namespace.
 * @param {string} namespaceName The name of the namespace.
 * @param {!Array.<Object>} opt_args An array of objects that will be used
 *     together with the initializer string to populate a namespace. The args
 *     may be referenced from initializer code as args_[i] where i is the index
 *     in the array.
 * @return {string} A string that will populate the namespace.
 * @private
 */
o3djs.namespaceInitializer_ = function(namespaceObject,
                                       namespaceName,
                                       opt_args) {
  var result = namespaceName + ' = {};\n';
  for (var propertyName in namespaceObject) {
    var propertyNamespaceName = namespaceName + '.' + propertyName;
    var propertyValue = namespaceObject[propertyName];
    if (typeof(propertyValue) === 'object' && propertyValue !== null &&
        !o3djs.base.isArray(propertyValue) &&
        !(propertyValue instanceof RegExp)) {
      result += o3djs.namespaceInitializer_(propertyValue,
                                            propertyNamespaceName);
    } else {
      var valueAsString = o3djs.valueToString_(propertyValue);

      // If this is a browser only function then bind to the browser version
      // of the function rather than create a new function in V8.
      if (typeof(propertyValue) == 'function' &&
          valueAsString.indexOf('o3djs.BROWSER_ONLY') != -1) {
        valueAsString = 'args_[' + opt_args.length + ']';
        opt_args.push(propertyValue);
      }
      result += propertyNamespaceName + ' = ' + valueAsString + ';\n';

      if (typeof(propertyValue) === 'function' && propertyValue.prototype) {
        result += o3djs.namespaceInitializer_(
            propertyValue.prototype,
            propertyNamespaceName + '.prototype');
      }
    }
  }
  return result;
};

o3djs.provide('o3djs.base');

/**
 * The base module for o3djs.
 * @namespace
 */
o3djs.base = o3djs.base || {};

/**
 * The a Javascript copy of the o3d namespace object. (holds constants, enums,
 * etc...)
 * @type {o3d.o3d}
 */
o3djs.base.o3d = null;

/**
 * Snapshots the current state of all provided namespaces. This state will be
 * used to initialize future V8 instances. It is automatically
 * called by o3djs.util.makeClients.
 */
o3djs.base.snapshotProvidedNamespaces = function()  {
  // Snapshot the V8 initializer string from the current state of browser
  // JavaScript the first time this is called.
  o3djs.v8Initializer_ = 'function(args_) {\n';
  o3djs.v8InitializerArgs_ = [];
  for (var i = 0; i < o3djs.provided_.length; ++i) {
    var object = o3djs.getObjectByName(o3djs.provided_[i]);
    o3djs.v8Initializer_ += o3djs.namespaceInitializer_(
        /** @type {!Object} */ (object),
        o3djs.provided_[i],
        o3djs.v8InitializerArgs_);
  }

  o3djs.v8Initializer_ += '}\n';
};

/**
 * Initializes the o3djs.sample library in a v8 instance. This should be called
 * for every V8 instance that uses the sample library. It is automatically
 * called by o3djs.util.makeClients.
 * @param {!o3d.plugin} clientObject O3D.Plugin Object.
 */
o3djs.base.initV8 = function(clientObject)  {
  var v8Init = function(initializer, args) {
    // Set up the o3djs namespace.
    var o3djsBrowser = o3djs;
    o3djs = {};
    o3djs.browser = o3djsBrowser;
    o3djs.global = (function() { return this; })();

    o3djs.require = function(rule) {}
    o3djs.provide = function(rule) {}

    // Evaluate the initializer string with the arguments containing bindings
    // to browser side objects.
    eval('(' + initializer + ')')(args);

    // Make sure this points to the o3d namespace for this particular
    // instance of the plugin.
    o3djs.base.o3d = plugin.o3d;
  };

  clientObject.eval(v8Init.toString())(o3djs.v8Initializer_,
                                       o3djs.v8InitializerArgs_);
};

/**
 * Initializes the o3djs.sample library.
 * Basically all it does is record the o3djs.namespace object which is used by
 * other functions to look up o3d constants.
 *
 * @param {!Element} clientObject O3D.Plugin Object.
 */
o3djs.base.init = function(clientObject)  {
  function recursivelyCopyProperties(object) {
    var copy = {};
    var hasProperties = false;
    for (var key in object) {
      var property = object[key];
      if (typeof property == 'object' || typeof property == 'function') {
        property = recursivelyCopyProperties(property);
      }
      if (typeof property != 'undefined') {
        copy[key] = property;
        hasProperties = true;
      }
    }
    return hasProperties ? copy : undefined;
  }
  try {
    o3djs.base.o3d = recursivelyCopyProperties(clientObject.o3d);
  } catch (e) {
    // Firefox 2 raises an exception when trying to enumerate a NPObject
    o3djs.base.o3d = clientObject.o3d;
  }
  // Because of a bug in chrome, it is not possible for the browser to enumerate
  // the properties of an NPObject.
  // Chrome bug: http://code.google.com/p/chromium/issues/detail?id=5743
  o3djs.base.o3d = o3djs.base.o3d || clientObject.o3d;
};

/**
 * Determine whether a value is an array. Do not use instanceof because that
 * will not work for V8 arrays (the browser thinks they are Objects).
 * @param {*} value A value.
 * @return {boolean} Whether the value is an array.
 */
o3djs.base.isArray = function(value) {
  var valueAsObject = /** @type {!Object} */ (value);
  return typeof(value) === 'object' && value !== null &&
      'length' in valueAsObject && 'splice' in valueAsObject;
};

/**
 * Check if the o3djs library has been initialized.
 * @return {boolean} true if ready, false if not.
 */
o3djs.base.ready = function() {
  return o3djs.base.o3d != null;
};

/**
 * A stub for later optionally converting obfuscated names
 * @private
 * @param {string} name Name to un-obfuscate.
 * @return {string} un-obfuscated name.
 */
o3djs.base.maybeDeobfuscateFunctionName_ = function(name) {
  return name;
};

/**
 * Makes one class inherit from another.
 * @param {!Object} subClass Class that wants to inherit.
 * @param {!Object} superClass Class to inherit from.
 */
o3djs.base.inherit = function(subClass, superClass) {
  /**
   * TmpClass.
   * @ignore
   * @constructor
   */
  var TmpClass = function() { };
  TmpClass.prototype = superClass.prototype;
  subClass.prototype = new TmpClass();
};

/**
 * Parses an error stack from an exception
 * @param {!Exception} excp The exception to get a stack trace from.
 * @return {!Array.<string>} An array of strings of the stack trace.
 */
o3djs.base.parseErrorStack = function(excp) {
  var stack = [];
  var name;
  var line;

  if (!excp || !excp.stack) {
    return stack;
  }

  var stacklist = excp.stack.split('\n');

  for (var i = 0; i < stacklist.length - 1; i++) {
    var framedata = stacklist[i];

    name = framedata.match(/^([a-zA-Z0-9_$]*)/)[1];
    if (name) {
      name = o3djs.base.maybeDeobfuscateFunctionName_(name);
    } else {
      name = 'anonymous';
    }

    var result = framedata.match(/(.*:[0-9]+)$/);
    line = result && result[1];

    if (!line) {
      line = '(unknown)';
    }

    stack[stack.length] = name + ' : ' + line
  }

  // remove top level anonymous functions to match IE
  var omitRegexp = /^anonymous :/;
  while (stack.length && omitRegexp.exec(stack[stack.length - 1])) {
    stack.length = stack.length - 1;
  }

  return stack;
};

/**
 * Gets a function name from a function object.
 * @param {!function(...): *} aFunction The function object to try to get a
 *      name from.
 * @return {string} function name or 'anonymous' if not found.
 */
o3djs.base.getFunctionName = function(aFunction) {
  var regexpResult = aFunction.toString().match(/function(\s*)(\w*)/);
  if (regexpResult && regexpResult.length >= 2 && regexpResult[2]) {
    return o3djs.base.maybeDeobfuscateFunctionName_(regexpResult[2]);
  }
  return 'anonymous';
};

/**
 * Pretty prints an exception's stack, if it has one.
 * @param {Array.<string>} stack An array of errors.
 * @return {string} The pretty stack.
 */
o3djs.base.formatErrorStack = function(stack) {
  var result = '';
  for (var i = 0; i < stack.length; i++) {
    result += '> ' + stack[i] + '\n';
  }
  return result;
};

/**
 * Gets a stack trace as a string.
 * @param {number} stripCount The number of entries to strip from the top of the
 *     stack. Example: Pass in 1 to remove yourself from the stack trace.
 * @return {string} The stack trace.
 */
o3djs.base.getStackTrace = function(stripCount) {
  var result = '';

  if (typeof(arguments.caller) != 'undefined') { // IE, not ECMA
    for (var a = arguments.caller; a != null; a = a.caller) {
      result += '> ' + o3djs.base.getFunctionName(a.callee) + '\n';
      if (a.caller == a) {
        result += '*';
        break;
      }
    }
  } else { // Mozilla, not ECMA
    // fake an exception so we can get Mozilla's error stack
    var testExcp;
    try {
      eval('var var;');
    } catch (testExcp) {
      var stack = o3djs.base.parseErrorStack(testExcp);
      result += o3djs.base.formatErrorStack(stack.slice(3 + stripCount,
                                                        stack.length));
    }
  }

  return result;
};

/**
 * Sets the error handler on a client to a handler that displays an alert on the
 * first error.
 * @param {!o3d.Client} client The client object of the plugin.
 */
o3djs.base.setErrorHandler = function(client) {
  client.setErrorCallback(
      function(msg) {
        // Clear the error callback. Otherwise if the callback is happening
        // during rendering it's possible the user will not be able to
        // get out of an infinite loop of alerts.
        client.clearErrorCallback();
        alert('ERROR: ' + msg + '\n' + o3djs.base.getStackTrace(1));
      });
};

/**
 * Returns true if the user's browser is Microsoft IE.
 * @return {boolean} true if the user's browser is Microsoft IE.
 */
o3djs.base.IsMSIE = function() {
  var ua = navigator.userAgent.toLowerCase();
  var msie = /msie/.test(ua) && !/opera/.test(ua);
  return msie;
};
/**
 * Returns true if the user's browser is Chrome 1.0, that requires a workaround
 * to create the plugin.
 * @return {boolean} true if the user's browser is Chrome 1.0.
 */
o3djs.base.IsChrome10 = function() {
  return navigator.userAgent.indexOf('Chrome/1.0') >= 0;
};
/*
 * Copyright 2009, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


/**
 * @fileoverview This file contains matrix/vector math functions.
 * It adds them to the "math" module on the o3djs object.
 *
 * o3djs.math supports a row-major and a column-major mode.  In both
 * modes, vectors are stored as arrays of numbers, and matrices are stored as
 * arrays of arrays of numbers.
 *
 * In row-major mode:
 *
 * - Rows of a matrix are sub-arrays.
 * - Individual entries of a matrix M get accessed in M[row][column] fashion.
 * - Tuples of coordinates are interpreted as row-vectors.
 * - A vector v gets transformed by a matrix M by multiplying in the order v*M.
 *
 * In column-major mode:
 *
 * - Columns of a matrix are sub-arrays.
 * - Individual entries of a matrix M get accessed in M[column][row] fashion.
 * - Tuples of coordinates are interpreted as column-vectors.
 * - A matrix M transforms a vector v by multiplying in the order M*v.
 *
 * When a function in o3djs.math requires separate row-major and
 * column-major versions, a function with the same name gets added to each of
 * the namespaces o3djs.math.rowMajor and o3djs.math.columnMajor. The
 * function installRowMajorFunctions() or the function
 * installColumnMajorFunctions() should get called during initialization to
 * establish the mode.  installRowMajorFunctions() works by iterating through
 * the o3djs.math.rowMajor namespace and for each function foo, setting
 * o3djs.math.foo equal to o3djs.math.rowMajor.foo.
 * installRowMajorFunctions() works the same way, iterating over the columnMajor
 * namespace.  At the end of this file, we call installRowMajorFunctions().
 *
 * Switching modes changes two things.  It changes how a matrix is encoded as an
 * array, and it changes how the entries of a matrix get interpreted.  Because
 * those two things change together, the matrix representing a given
 * transformation of space is the same JavaScript object in either mode.
 * One consequence of this is that very few functions require separate row-major
 * and column-major versions.  Typically, a function requires separate versions
 * only if it makes matrix multiplication order explicit, like
 * mulMatrixMatrix(), mulMatrixVector(), or mulVectorMatrix().  Functions which
 * create a new matrix, like scaling(), rotationZYX(), and translation() return
 * the same JavaScript object in either mode, and functions which implicitly
 * multiply like scale(), rotateZYX() and translate() modify the matrix in the
 * same way in either mode.
 *
 * The convention choice made for math functions in this library is independent
 * of the convention choice for how matrices get loaded into shaders.  That
 * convention is determined on a per-shader basis.
 *
 * Other utilities in o3djs should avoid making calls to functions that make
 * multiplication order explicit.  Instead they should appeal to functions like:
 *
 * o3djs.math.matrix4.transformPoint
 * o3djs.math.matrix4.transformDirection
 * o3djs.math.matrix4.transformNormal
 * o3djs.math.matrix4.transformVector4
 * o3djs.math.matrix4.composition
 * o3djs.math.matrix4.compose
 *
 * These functions multiply matrices implicitly and internally choose the
 * multiplication order to get the right result.  That way, utilities which use
 * o3djs.math work in either major mode.  Note that this does not necessarily
 * mean all sample code will work even if a line is added which switches major
 * modes, but it does mean that calls to o3djs still do what they are supposed
 * to.
 *
 */

o3djs.provide('o3djs.math');

/**
 * A module for math for o3djs.math.
 * @namespace
 */
o3djs.math = o3djs.math || {};

/**
 * A random seed for the pseudoRandom function.
 * @private
 * @type {number}
 */
o3djs.math.randomSeed_ = 0;

/**
 * A constant for the pseudoRandom function
 * @private
 * @type {number}
 */
o3djs.math.RANDOM_RANGE_ = Math.pow(2, 32);

/**
 * Functions which deal with 4-by-4 transformation matrices are kept in their
 * own namespsace.
 * @namespace
 */
o3djs.math.matrix4 = o3djs.math.matrix4 || {};

/**
 * Functions that are specifically row major are kept in their own namespace.
 * @namespace
 */
o3djs.math.rowMajor = o3djs.math.rowMajor || {};

/**
 * Functions that are specifically column major are kept in their own namespace.
 * @namespace
 */
o3djs.math.columnMajor = o3djs.math.columnMajor || {};

/**
 * Functions that do error checking are stored in their own namespace.
 * @namespace
 */
o3djs.math.errorCheck = o3djs.math.errorCheck || {};

/**
 * Functions that do no error checking and have a separate version that does in
 * o3djs.math.errorCheck are stored in their own namespace.
 * @namespace
 */
o3djs.math.errorCheckFree = o3djs.math.errorCheckFree || {};

/**
 * An Array of 2 floats
 * @type {(!Array.<number>|!o3d.Float2)}
 */
o3djs.math.Vector2 = goog.typedef;

/**
 * An Array of 3 floats
 * @type {(!Array.<number>|!o3d.Float3)}
 */
o3djs.math.Vector3 = goog.typedef;

/**
 * An Array of 4 floats
 * @type {(!Array.<number>|!o3d.Float4)}
 */
o3djs.math.Vector4 = goog.typedef;

/**
 * An Array of floats.
 * @type {!Array.<number>}
 */
o3djs.math.Vector = goog.typedef;

/**
 * A 1x1 Matrix of floats
 * @type {!Array.<!Array.<number>>}
 */
o3djs.math.Matrix1 = goog.typedef;

/**
 * A 2x2 Matrix of floats
 * @type {!Array.<!Array.<number>>}
 */
o3djs.math.Matrix2 = goog.typedef;

/**
 * A 3x3 Matrix of floats
 * @type {!Array.<!Array.<number>>}
 */
o3djs.math.Matrix3 = goog.typedef;

/**
 * A 4x4 Matrix of floats
 * @type {(!Array.<!Array.<number>>|!o3d.Matrix4)}
 */
o3djs.math.Matrix4 = goog.typedef;

/**
 * A arbitrary size Matrix of floats
 * @type {(!Array.<!Array.<number>>|!o3d.Matrix4)}
 */
o3djs.math.Matrix = goog.typedef;

/**
 * Returns a deterministic pseudorandom number between 0 and 1
 * @return {number} a random number between 0 and 1
 */
o3djs.math.pseudoRandom = function() {
  var math = o3djs.math;
  return (math.randomSeed_ = 
          (134775813 * math.randomSeed_ + 1) % 
          math.RANDOM_RANGE_) / math.RANDOM_RANGE_;
};

/**
 * Resets the pseudoRandom function sequence.
 */
o3djs.math.resetPseudoRandom = function() {
  o3djs.math.randomSeed_ = 0;
};

/**
 * Converts degrees to radians.
 * @param {number} degrees A value in degrees.
 * @return {number} the value in radians.
 */
o3djs.math.degToRad = function(degrees) {
  return degrees * Math.PI / 180;
};

/**
 * Converts radians to degrees.
 * @param {number} radians A value in radians.
 * @return {number} the value in degrees.
 */
o3djs.math.radToDeg = function(radians) {
  return radians * 180 / Math.PI;
};

/**
 * Performs linear interpolation on two scalars.
 * Given scalars a and b and interpolation coefficient t, returns
 * (1 - t) * a + t * b.
 * @param {number} a Operand scalar.
 * @param {number} b Operand scalar.
 * @param {number} t Interpolation coefficient.
 * @return {number} The weighted sum of a and b.
 */
o3djs.math.lerpScalar = function(a, b, t) {
  return (1 - t) * a + t * b;
};

/**
 * Adds two vectors; assumes a and b have the same dimension.
 * @param {!o3djs.math.Vector} a Operand vector.
 * @param {!o3djs.math.Vector} b Operand vector.
 * @return {!o3djs.math.Vector} The sum of a and b.
 */
o3djs.math.addVector = function(a, b) {
  var r = [];
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    r[i] = a[i] + b[i];
  return r;
};

/**
 * Subtracts two vectors.
 * @param {!o3djs.math.Vector} a Operand vector.
 * @param {!o3djs.math.Vector} b Operand vector.
 * @return {!o3djs.math.Vector} The difference of a and b.
 */
o3djs.math.subVector = function(a, b) {
  var r = [];
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    r[i] = a[i] - b[i];
  return r;
};

/**
 * Performs linear interpolation on two vectors.
 * Given vectors a and b and interpolation coefficient t, returns
 * (1 - t) * a + t * b.
 * @param {!o3djs.math.Vector} a Operand vector.
 * @param {!o3djs.math.Vector} b Operand vector.
 * @param {number} t Interpolation coefficient.
 * @return {!o3djs.math.Vector} The weighted sum of a and b.
 */
o3djs.math.lerpVector = function(a, b, t) {
  var r = [];
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    r[i] = (1 - t) * a[i] + t * b[i];
  return r;
};

/**
 * Clamps a value between 0 and range using a modulo.
 * @param {number} v Value to clamp mod.
 * @param {number} range Range to clamp to.
 * @param {number} opt_rangeStart start of range. Default = 0.
 * @return {number} Clamp modded value.
 */
o3djs.math.modClamp = function(v, range, opt_rangeStart) {
  var start = opt_rangeStart || 0;
  if (range < 0.00001) {
    return start;
  }
  v -= start;
  if (v < 0) {
    v -= Math.floor(v / range) * range;
  } else {
    v = v % range;
  }
  return v + start;
};

/**
 * Lerps in a circle.
 * Does a lerp between a and b but inside range so for example if
 * range is 100, a is 95 and b is 5 lerping will go in the positive direction.
 * @param {number} a Start value.
 * @param {number} b Target value.
 * @param {number} t Amount to lerp (0 to 1).
 * @param {number} range Range of circle.
 * @return {number} lerped result.
 */
o3djs.math.lerpCircular = function(a, b, t, range) {
  a = o3djs.math.modClamp(a, range);
  b = o3djs.math.modClamp(b, range);
  var delta = b - a;
  if (Math.abs(delta) > range * 0.5) {
    if (delta > 0) {
      b -= range;
    } else {
      b += range;
    }
  }
  return o3djs.math.modClamp(o3djs.math.lerpScalar(a, b, t), range);
};

/**
 * Lerps radians.
 * @param {number} a Start value.
 * @param {number} b Target value.
 * @param {number} t Amount to lerp (0 to 1).
 * @return {number} lerped result.
 */
o3djs.math.lerpRadian = function(a, b, t) {
  return o3djs.math.lerpCircular(a, b, t, Math.PI * 2);
};

/**
 * Divides a vector by a scalar.
 * @param {!o3djs.math.Vector} v The vector.
 * @param {number} k The scalar.
 * @return {!o3djs.math.Vector} v The vector v divided by k.
 */
o3djs.math.divVectorScalar = function(v, k) {
  var r = [];
  var vLength = v.length;
  for (var i = 0; i < vLength; ++i)
    r[i] = v[i] / k;
  return r;
};

/**
 * Computes the dot product of two vectors; assumes that a and b have
 * the same dimension.
 * @param {!o3djs.math.Vector} a Operand vector.
 * @param {!o3djs.math.Vector} b Operand vector.
 * @return {number} The dot product of a and b.
 */
o3djs.math.dot = function(a, b) {
  var r = 0.0;
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    r += a[i] * b[i];
  return r;
};

/**
 * Computes the cross product of two vectors; assumes both vectors have
 * three entries.
 * @param {!o3djs.math.Vector} a Operand vector.
 * @param {!o3djs.math.Vector} b Operand vector.
 * @return {!o3djs.math.Vector} The vector a cross b.
 */
o3djs.math.cross = function(a, b) {
  return [a[1] * b[2] - a[2] * b[1],
          a[2] * b[0] - a[0] * b[2],
          a[0] * b[1] - a[1] * b[0]];
};

/**
 * Computes the Euclidean length of a vector, i.e. the square root of the
 * sum of the squares of the entries.
 * @param {!o3djs.math.Vector} a The vector.
 * @return {number} The length of a.
 */
o3djs.math.length = function(a) {
  var r = 0.0;
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    r += a[i] * a[i];
  return Math.sqrt(r);
};

/**
 * Computes the square of the Euclidean length of a vector, i.e. the sum
 * of the squares of the entries.
 * @param {!o3djs.math.Vector} a The vector.
 * @return {number} The square of the length of a.
 */
o3djs.math.lengthSquared = function(a) {
  var r = 0.0;
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    r += a[i] * a[i];
  return r;
};

/**
 * Computes the Euclidean distance between two vectors.
 * @param {!o3djs.math.Vector} a A vector.
 * @param {!o3djs.math.Vector} b A vector.
 * @return {number} The distance between a and b.
 */
o3djs.math.distance = function(a, b) {
  var r = 0.0;
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i) {
    var t = a[i] - b[i];
    r += t * t;
  }
  return Math.sqrt(r);
};

/**
 * Computes the square of the Euclidean distance between two vectors.
 * @param {!o3djs.math.Vector} a A vector.
 * @param {!o3djs.math.Vector} b A vector.
 * @return {number} The distance between a and b.
 */
o3djs.math.distanceSquared = function(a, b) {
  var r = 0.0;
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i) {
    var t = a[i] - b[i];
    r += t * t;
  }
  return r;
};

/**
 * Divides a vector by its Euclidean length and returns the quotient.
 * @param {!o3djs.math.Vector} a The vector.
 * @return {!o3djs.math.Vector} The normalized vector.
 */
o3djs.math.normalize = function(a) {
  var r = [];
  var n = 0.0;
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    n += a[i] * a[i];
  n = Math.sqrt(n);
  for (var i = 0; i < aLength; ++i)
    r[i] = a[i] / n;
  return r;
};

/**
 * Adds two matrices; assumes a and b are the same size.
 * @param {!o3djs.math.Matrix} a Operand matrix.
 * @param {!o3djs.math.Matrix} b Operand matrix.
 * @return {!o3djs.math.Matrix} The sum of a and b.
 */
o3djs.math.addMatrix = function(a, b) {
  var r = [];
  var aLength = a.length;
  var a0Length = a[0].length;
  for (var i = 0; i < aLength; ++i) {
    var row = [];
    var ai = a[i];
    var bi = b[i];
    for (var j = 0; j < a0Length; ++j)
      row[j] = ai[j] + bi[j];
    r[i] = row;
  }
  return r;
};

/**
 * Subtracts two matrices; assumes a and b are the same size.
 * @param {!o3djs.math.Matrix} a Operand matrix.
 * @param {!o3djs.math.Matrix} b Operand matrix.
 * @return {!o3djs.math.Matrix} The sum of a and b.
 */
o3djs.math.subMatrix = function(a, b) {
  var r = [];
  var aLength = a.length;
  var a0Length = a[0].length;
  for (var i = 0; i < aLength; ++i) {
    var row = [];
    var ai = a[i];
    var bi = b[i];
    for (var j = 0; j < a0Length; ++j)
      row[j] = ai[j] - bi[j];
    r[i] = row;
  }
  return r;
};

/**
 * Performs linear interpolation on two matrices.
 * Given matrices a and b and interpolation coefficient t, returns
 * (1 - t) * a + t * b.
 * @param {!o3djs.math.Matrix} a Operand matrix.
 * @param {!o3djs.math.Matrix} b Operand matrix.
 * @param {number} t Interpolation coefficient.
 * @return {!o3djs.math.Matrix} The weighted of a and b.
 */
o3djs.math.lerpMatrix = function(a, b, t) {
  var r = [];
  var aLength = a.length;
  var a0Length = a[0].length;
  for (var i = 0; i < aLength; ++i) {
    var row = [];
    var ai = a[i];
    var bi = b[i];
    for (var j = 0; j < a0Length; ++j)
      row[j] = (1 - t) * ai[j] + t * bi[j];
    r[i] = row;
  }
  return r;
};

/**
 * Divides a matrix by a scalar.
 * @param {!o3djs.math.Matrix} m The matrix.
 * @param {number} k The scalar.
 * @return {!o3djs.math.Matrix} The matrix m divided by k.
 */
o3djs.math.divMatrixScalar = function(m, k) {
  var r = [];
  var mLength = m.length;
  var m0Length = m[0].length;
  for (var i = 0; i < mLength; ++i) {
    r[i] = [];
    for (var j = 0; j < m0Length; ++j)
      r[i][j] = m[i][j] / k;
  }
  return r;
};

/**
 * Negates a scalar.
 * @param {number} a The scalar.
 * @return {number} -a.
 */
o3djs.math.negativeScalar = function(a) {
 return -a;
};

/**
 * Negates a vector.
 * @param {!o3djs.math.Vector} v The vector.
 * @return {!o3djs.math.Vector} -v.
 */
o3djs.math.negativeVector = function(v) {
 var r = [];
 var vLength = v.length;
 for (var i = 0; i < vLength; ++i) {
   r[i] = -v[i];
 }
 return r;
};

/**
 * Negates a matrix.
 * @param {!o3djs.math.Matrix} m The matrix.
 * @return {!o3djs.math.Matrix} -m.
 */
o3djs.math.negativeMatrix = function(m) {
 var r = [];
 var mLength = m.length;
 var m0Length = m[0].length;
 for (var i = 0; i < mLength; ++i) {
   r[i] = [];
   for (var j = 0; j < m0Length; ++j)
     r[i][j] = -m[i][j];
 }
 return r;
};

/**
 * Copies a scalar.
 * @param {number} a The scalar.
 * @return {number} a.
 */
o3djs.math.copyScalar = function(a) {
  return a;
};

/**
 * Copies a vector.
 * @param {!o3djs.math.Vector} v The vector.
 * @return {!o3djs.math.Vector} A copy of v.
 */
o3djs.math.copyVector = function(v) {
  var r = [];
  for (var i = 0; i < v.length; i++)
    r[i] = v[i];
  return r;
};

/**
 * Copies a matrix.
 * @param {!o3djs.math.Matrix} m The matrix.
 * @return {!o3djs.math.Matrix} A copy of m.
 */
o3djs.math.copyMatrix = function(m) {
  var r = [];
  var mLength = m.length;
  for (var i = 0; i < mLength; ++i) {
    r[i] = [];
    for (var j = 0; j < m[i].length; j++) {
      r[i][j] = m[i][j];
    }
  }
  return r;
};

/**
 * Returns the elements of a matrix as a one-dimensional array. The
 * rows or columns (depending on whether the matrix is row-major or
 * column-major) are concatenated.
 * @param {!o3djs.math.Matrix} m The matrix.
 * @return {!Array.<number>} The matrix's elements as a one-dimensional array.
 */
o3djs.math.getMatrixElements = function(m) {
  var r = [];
  var mLength = m.length;
  var k = 0;
  for (var i = 0; i < mLength; i++) {
    for (var j = 0; j < m[i].length; j++) {
      r[k++] = m[i][j];
    }
  }
  return r;
};

/**
 * Multiplies two scalars.
 * @param {number} a Operand scalar.
 * @param {number} b Operand scalar.
 * @return {number} The product of a and b.
 */
o3djs.math.mulScalarScalar = function(a, b) {
  return a * b;
};

/**
 * Multiplies a scalar by a vector.
 * @param {number} k The scalar.
 * @param {!o3djs.math.Vector} v The vector.
 * @return {!o3djs.math.Vector} The product of k and v.
 */
o3djs.math.mulScalarVector = function(k, v) {
  var r = [];
  var vLength = v.length;
  for (var i = 0; i < vLength; ++i) {
    r[i] = k * v[i];
  }
  return r;
};

/**
 * Multiplies a vector by a scalar.
 * @param {!o3djs.math.Vector} v The vector.
 * @param {number} k The scalar.
 * @return {!o3djs.math.Vector} The product of k and v.
 */
o3djs.math.mulVectorScalar = function(v, k) {
  return o3djs.math.mulScalarVector(k, v);
};

/**
 * Multiplies a scalar by a matrix.
 * @param {number} k The scalar.
 * @param {!o3djs.math.Matrix} m The matrix.
 * @return {!o3djs.math.Matrix} The product of m and k.
 */
o3djs.math.mulScalarMatrix = function(k, m) {
  var r = [];
  var mLength = m.length;
  var m0Length = m[0].length;
  for (var i = 0; i < mLength; ++i) {
    r[i] = [];
    for (var j = 0; j < m0Length; ++j)
      r[i][j] = k * m[i][j];
  }
  return r;
};

/**
 * Multiplies a matrix by a scalar.
 * @param {!o3djs.math.Matrix} m The matrix.
 * @param {number} k The scalar.
 * @return {!o3djs.math.Matrix} The product of m and k.
 */
o3djs.math.mulMatrixScalar = function(m, k) {
  return o3djs.math.mulScalarMatrix(k, m);
};

/**
 * Multiplies a vector by another vector (component-wise); assumes a and
 * b have the same length.
 * @param {!o3djs.math.Vector} a Operand vector.
 * @param {!o3djs.math.Vector} b Operand vector.
 * @return {!o3djs.math.Vector} The vector of products of entries of a and
 *     b.
 */
o3djs.math.mulVectorVector = function(a, b) {
  var r = [];
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    r[i] = a[i] * b[i];
  return r;
};

/**
 * Divides a vector by another vector (component-wise); assumes a and
 * b have the same length.
 * @param {!o3djs.math.Vector} a Operand vector.
 * @param {!o3djs.math.Vector} b Operand vector.
 * @return {!o3djs.math.Vector} The vector of quotients of entries of a and
 *     b.
 */
o3djs.math.divVectorVector = function(a, b) {
  var r = [];
  var aLength = a.length;
  for (var i = 0; i < aLength; ++i)
    r[i] = a[i] / b[i];
  return r;
};

/**
 * Multiplies a vector by a matrix; treats the vector as a row vector; assumes
 * matrix entries are accessed in [row][column] fashion.
 * @param {!o3djs.math.Vector} v The vector.
 * @param {!o3djs.math.Matrix} m The matrix.
 * @return {!o3djs.math.Vector} The product of v and m as a row vector.
 */
o3djs.math.rowMajor.mulVectorMatrix = function(v, m) {
  var r = [];
  var m0Length = m[0].length;
  var vLength = v.length;
  for (var i = 0; i < m0Length; ++i) {
    r[i] = 0.0;
    for (var j = 0; j < vLength; ++j)
      r[i] += v[j] * m[j][i];
  }
  return r;
};

/**
 * Multiplies a vector by a matrix; treats the vector as a row vector; assumes
 * matrix entries are accessed in [column][row] fashion.
 * @param {!o3djs.math.Vector} v The vector.
 * @param {!o3djs.math.Matrix} m The matrix.
 * @return {!o3djs.math.Vector} The product of v and m as a row vector.
 */
o3djs.math.columnMajor.mulVectorMatrix = function(v, m) {
  var r = [];
  var mLength = m.length;
  var vLength = v.length;
  for (var i = 0; i < mLength; ++i) {
    r[i] = 0.0;
    var column = m[i];
    for (var j = 0; j < vLength; ++j)
      r[i] += v[j] * column[j];
  }
  return r;
};

/**
 * Multiplies a vector by a matrix; treats the vector as a row vector.
 * @param {!o3djs.math.Matrix} m The matrix.
 * @param {!o3djs.math.Vector} v The vector.
 * @return {!o3djs.math.Vector} The product of m and v as a row vector.
 */
o3djs.math.mulVectorMatrix = null;

/**
 * Multiplies a matrix by a vector; treats the vector as a column vector.
 * assumes matrix entries are accessed in [row][column] fashion.
 * @param {!o3djs.math.Matrix} m The matrix.
 * @param {!o3djs.math.Vector} v The vector.
 * @return {!o3djs.math.Vector} The product of m and v as a column vector.
 */
o3djs.math.rowMajor.mulMatrixVector = function(m, v) {
  var r = [];
  var mLength = m.length;
  var m0Length = m[0].length;
  for (var i = 0; i < mLength; ++i) {
    r[i] = 0.0;
    var row = m[i];
    for (var j = 0; j < m0Length; ++j)
      r[i] += row[j] * v[j];
  }
  return r;
};

/**
 * Multiplies a matrix by a vector; treats the vector as a column vector;
 * assumes matrix entries are accessed in [column][row] fashion.
 * @param {!o3djs.math.Matrix} m The matrix.
 * @param {!o3djs.math.Vector} v The vector.
 * @return {!o3djs.math.Vector} The product of m and v as a column vector.
 */
o3djs.math.columnMajor.mulMatrixVector = function(m, v) {
  var r = [];
  var m0Length = m[0].length;
  var vLength = v.length;
  for (var i = 0; i < m0Length; ++i) {
    r[i] = 0.0;
    for (var j = 0; j < vLength; ++j)
      r[i] += v[j] * m[j][i];
  }
  return r;
};

/**
 * Multiplies a matrix by a vector; treats the vector as a column vector.
 * @param {!o3djs.math.Matrix} m The matrix.
 * @param {!o3djs.math.Vector} v The vector.
 * @return {!o3djs.math.Vector} The product of m and v as a column vector.
 */
o3djs.math.mulMatrixVector = null;

/**
 * Multiplies two 2-by-2 matrices; assumes that the given matrices are 2-by-2;
 * assumes matrix entries are accessed in [row][column] fashion.
 * @param {!o3djs.math.Matrix2} a The matrix on the left.
 * @param {!o3djs.math.Matrix2} b The matrix on the right.
 * @return {!o3djs.math.Matrix2} The matrix product of a and b.
 */
o3djs.math.rowMajor.mulMatrixMatrix2 = function(a, b) {
  var a0 = a[0];
  var a1 = a[1];
  var b0 = b[0];
  var b1 = b[1];
  var a00 = a0[0];
  var a01 = a0[1];
  var a10 = a1[0];
  var a11 = a1[1];
  var b00 = b0[0];
  var b01 = b0[1];
  var b10 = b1[0];
  var b11 = b1[1];
  return [[a00 * b00 + a01 * b10, a00 * b01 + a01 * b11],
          [a10 * b00 + a11 * b10, a10 * b01 + a11 * b11]];
};

/**
 * Multiplies two 2-by-2 matrices; assumes that the given matrices are 2-by-2;
 * assumes matrix entries are accessed in [column][row] fashion.
 * @param {!o3djs.math.Matrix2} a The matrix on the left.
 * @param {!o3djs.math.Matrix2} b The matrix on the right.
 * @return {!o3djs.math.Matrix2} The matrix product of a and b.
 */
o3djs.math.columnMajor.mulMatrixMatrix2 = function(a, b) {
  var a0 = a[0];
  var a1 = a[1];
  var b0 = b[0];
  var b1 = b[1];
  var a00 = a0[0];
  var a01 = a0[1];
  var a10 = a1[0];
  var a11 = a1[1];
  var b00 = b0[0];
  var b01 = b0[1];
  var b10 = b1[0];
  var b11 = b1[1];
  return [[a00 * b00 + a10 * b01, a01 * b00 + a11 * b01],
          [a00 * b10 + a10 * b11, a01 * b10 + a11 * b11]];
};

/**
 * Multiplies two 2-by-2 matrices.
 * @param {!o3djs.math.Matrix2} a The matrix on the left.
 * @param {!o3djs.math.Matrix2} b The matrix on the right.
 * @return {!o3djs.math.Matrix2} The matrix product of a and b.
 */
o3djs.math.mulMatrixMatrix2 = null;


/**
 * Multiplies two 3-by-3 matrices; assumes that the given matrices are 3-by-3;
 * assumes matrix entries are accessed in [row][column] fashion.
 * @param {!o3djs.math.Matrix3} a The matrix on the left.
 * @param {!o3djs.math.Matrix3} b The matrix on the right.
 * @return {!o3djs.math.Matrix3} The matrix product of a and b.
 */
o3djs.math.rowMajor.mulMatrixMatrix3 = function(a, b) {
  var a0 = a[0];
  var a1 = a[1];
  var a2 = a[2];
  var b0 = b[0];
  var b1 = b[1];
  var b2 = b[2];
  var a00 = a0[0];
  var a01 = a0[1];
  var a02 = a0[2];
  var a10 = a1[0];
  var a11 = a1[1];
  var a12 = a1[2];
  var a20 = a2[0];
  var a21 = a2[1];
  var a22 = a2[2];
  var b00 = b0[0];
  var b01 = b0[1];
  var b02 = b0[2];
  var b10 = b1[0];
  var b11 = b1[1];
  var b12 = b1[2];
  var b20 = b2[0];
  var b21 = b2[1];
  var b22 = b2[2];
  return [[a00 * b00 + a01 * b10 + a02 * b20,
           a00 * b01 + a01 * b11 + a02 * b21,
           a00 * b02 + a01 * b12 + a02 * b22],
          [a10 * b00 + a11 * b10 + a12 * b20,
           a10 * b01 + a11 * b11 + a12 * b21,
           a10 * b02 + a11 * b12 + a12 * b22],
          [a20 * b00 + a21 * b10 + a22 * b20,
           a20 * b01 + a21 * b11 + a22 * b21,
           a20 * b02 + a21 * b12 + a22 * b22]];
};

/**
 * Multiplies two 3-by-3 matrices; assumes that the given matrices are 3-by-3;
 * assumes matrix entries are accessed in [column][row] fashion.
 * @param {!o3djs.math.Matrix3} a The matrix on the left.
 * @param {!o3djs.math.Matrix3} b The matrix on the right.
 * @return {!o3djs.math.Matrix3} The matrix product of a and b.
 */
o3djs.math.columnMajor.mulMatrixMatrix3 = function(a, b) {
  var a0 = a[0];
  var a1 = a[1];
  var a2 = a[2];
  var b0 = b[0];
  var b1 = b[1];
  var b2 = b[2];
  var a00 = a0[0];
  var a01 = a0[1];
  var a02 = a0[2];
  var a10 = a1[0];
  var a11 = a1[1];
  var a12 = a1[2];
  var a20 = a2[0];
  var a21 = a2[1];
  var a22 = a2[2];
  var b00 = b0[0];
  var b01 = b0[1];
  var b02 = b0[2];
  var b10 = b1[0];
  var b11 = b1[1];
  var b12 = b1[2];
  var b20 = b2[0];
  var b21 = b2[1];
  var b22 = b2[2];
  return [[a00 * b00 + a10 * b01 + a20 * b02,
           a01 * b00 + a11 * b01 + a21 * b02,
           a02 * b00 + a12 * b01 + a22 * b02],
          [a00 * b10 + a10 * b11 + a20 * b12,
           a01 * b10 + a11 * b11 + a21 * b12,
           a02 * b10 + a12 * b11 + a22 * b12],
          [a00 * b20 + a10 * b21 + a20 * b22,
           a01 * b20 + a11 * b21 + a21 * b22,
           a02 * b20 + a12 * b21 + a22 * b22]];
};

/**
 * Multiplies two 3-by-3 matrices; assumes that the given matrices are 3-by-3.
 * @param {!o3djs.math.Matrix3} a The matrix on the left.
 * @param {!o3djs.math.Matrix3} b The matrix on the right.
 * @return {!o3djs.math.Matrix3} The matrix product of a and b.
 */
o3djs.math.mulMatrixMatrix3 = null;

/**
 * Multiplies two 4-by-4 matrices; assumes that the given matrices are 4-by-4;
 * assumes matrix entries are accessed in [row][column] fashion.
 * @param {!o3djs.math.Matrix4} a The matrix on the left.
 * @param {!o3djs.math.Matrix4} b The matrix on the right.
 * @return {!o3djs.math.Matrix4} The matrix product of a and b.
 */
o3djs.math.rowMajor.mulMatrixMatrix4 = function(a, b) {
  var a0 = a[0];
  var a1 = a[1];
  var a2 = a[2];
  var a3 = a[3];
  var b0 = b[0];
  var b1 = b[1];
  var b2 = b[2];
  var b3 = b[3];
  var a00 = a0[0];
  var a01 = a0[1];
  var a02 = a0[2];
  var a03 = a0[3];
  var a10 = a1[0];
  var a11 = a1[1];
  var a12 = a1[2];
  var a13 = a1[3];
  var a20 = a2[0];
  var a21 = a2[1];
  var a22 = a2[2];
  var a23 = a2[3];
  var a30 = a3[0];
  var a31 = a3[1];
  var a32 = a3[2];
  var a33 = a3[3];
  var b00 = b0[0];
  var b01 = b0[1];
  var b02 = b0[2];
  var b03 = b0[3];
  var b10 = b1[0];
  var b11 = b1[1];
  var b12 = b1[2];
  var b13 = b1[3];
  var b20 = b2[0];
  var b21 = b2[1];
  var b22 = b2[2];
  var b23 = b2[3];
  var b30 = b3[0];
  var b31 = b3[1];
  var b32 = b3[2];
  var b33 = b3[3];
  return [[a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
           a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
           a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
           a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33],
          [a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
           a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
           a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
           a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33],
          [a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
           a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
           a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
           a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33],
          [a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,
           a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,
           a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,
           a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33]];
};

/**
 * Multiplies two 4-by-4 matrices; assumes that the given matrices are 4-by-4;
 * assumes matrix entries are accessed in [column][row] fashion.
 * @param {!o3djs.math.Matrix4} a The matrix on the left.
 * @param {!o3djs.math.Matrix4} b The matrix on the right.
 * @return {!o3djs.math.Matrix4} The matrix product of a and b.
 */
o3djs.math.columnMajor.mulMatrixMatrix4 = function(a, b) {
  var a0 = a[0];
  var a1 = a[1];
  var a2 = a[2];
  var a3 = a[3];
  var b0 = b[0];
  var b1 = b[1];
  var b2 = b[2];
  var b3 = b[3];
  var a00 = a0[0];
  var a01 = a0[1];
  var a02 = a0[2];
  var a03 = a0[3];
  var a10 = a1[0];
  var a11 = a1[1];
  var a12 = a1[2];
  var a13 = a1[3];
  var a20 = a2[0];
  var a21 = a2[1];
  var a22 = a2[2];
  var a23 = a2[3];
  var a30 = a3[0];
  var a31 = a3[1];
  var a32 = a3[2];
  var a33 = a3[3];
  var b00 = b0[0];
  var b01 = b0[1];
  var b02 = b0[2];
  var b03 = b0[3];
  var b10 = b1[0];
  var b11 = b1[1];
  var b12 = b1[2];
  var b13 = b1[3];
  var b20 = b2[0];
  var b21 = b2[1];
  var b22 = b2[2];
  var b23 = b2[3];
  var b30 = b3[0];
  var b31 = b3[1];
  var b32 = b3[2];
  var b33 = b3[3];
  return [[a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03,
           a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03,
           a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03,
           a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03],
          [a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13,
           a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13,
           a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13,
           a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13],
          [a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23,
           a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23,
           a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23,
           a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23],
          [a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33,
           a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33,
           a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33,
           a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33]];
};

/**
 * Multiplies two 4-by-4 matrices; assumes that the given matrices are 4-by-4.
 * @param {!o3djs.math.Matrix4} a The matrix on the left.
 * @param {!o3djs.math.Matrix4} b The matrix on the right.
 * @return {!o3djs.math.Matrix4} The matrix product of a and b.
 */
o3djs.math.mulMatrixMatrix4 = null;

/**
 * Multiplies two matrices; assumes that the sizes of the matrices are
 * appropriately compatible; assumes matrix entries are accessed in
 * [row][column] fashion.
 * @param {!o3djs.math.Matrix} a The matrix on the left.
 * @param {!o3djs.math.Matrix} b The matrix on the right.
 * @return {!o3djs.math.Matrix} The matrix product of a and b.
 */
o3djs.math.rowMajor.mulMatrixMatrix = function(a, b) {
  var r = [];
  var aRows = a.length;
  var bColumns = b[0].length;
  var bRows = b.length;
  for (var i = 0; i < aRows; ++i) {
    var v = [];    // v becomes a row of the answer.
    var ai = a[i]; // ith row of a.
    for (var j = 0; j < bColumns; ++j) {
      v[j] = 0.0;
      for (var k = 0; k < bRows; ++k)
        v[j] += ai[k] * b[k][j]; // kth row, jth column.
    }
    r[i] = v;
  }
  return r;
};

/**
 * Multiplies two matrices; assumes that the sizes of the matrices are
 * appropriately compatible; assumes matrix entries are accessed in
 * [row][column] fashion.
 * @param {!o3djs.math.Matrix} a The matrix on the left.
 * @param {!o3djs.math.Matrix} b The matrix on the right.
 * @return {!o3djs.math.Matrix} The matrix product of a and b.
 */
o3djs.math.columnMajor.mulMatrixMatrix = function(a, b) {
  var r = [];
  var bColumns = b.length;
  var aRows = a[0].length;
  var aColumns = a.length;
  for (var i = 0; i < bColumns; ++i) {
    var v = [];    // v becomes a column of the answer.
    var bi = b[i]; // ith column of b.
    for (var j = 0; j < aRows; ++j) {
      v[j] = 0.0;
      for (var k = 0; k < aColumns; ++k)
        v[j] += bi[k] * a[k][j]; // kth column, jth row.
    }
    r[i] = v;
  }
  return r;
};

/**
 * Multiplies two matrices; assumes that the sizes of the matrices are
 * appropriately compatible.
 * @param {!o3djs.math.Matrix} a The matrix on the left.
 * @param {!o3djs.math.Matrix} b The matrix on the right.
 * @return {!o3djs.math.Matrix} The matrix product of a and b.
 */
o3djs.math.mulMatrixMatrix = null;

/**
 * Gets the jth column of the given matrix m; assumes matrix entries are
 * accessed in [row][column] fashion.
 * @param {!o3djs.math.Matrix} m The matrix.
 * @param {number} j The index of the desired column.
 * @return {!o3djs.math.Vector} The jth column of m as a vector.
 */
o3djs.math.rowMajor.column = function(m, j) {
  var r = [];
  var mLength = m.length;
  for (var i = 0; i < mLength; ++i) {
    r[i] = m[i][j];
  }
  return r;
};

/**
 * Gets the jth column of the given matrix m; assumes matrix entries are
 * accessed in [column][row] fashion.
 * @param {!o3djs.math.Matrix} m The matrix.
 * @param {number} j The index of the desired column.
 * @return {!o3djs.math.Vector} The jth column of m as a vector.
 */
o3djs.math.columnMajor.column = function(m, j) {
  return m[j].slice();
};

/**
 * Gets the jth column of the given matrix m.
 * @param {!o3djs.math.Matrix} m The matrix.
 * @param {number} j The index of the desired column.
 * @return {!o3djs.math.Vector} The jth column of m as a vector.
 */
o3djs.math.column = null;

/**
 * Gets the ith row of the given matrix m; assumes matrix entries are
 * accessed in [row][column] fashion.
 * @param {!o3djs.math.Matrix} m The matrix.
 * @param {number} i The index of the desired row.
 * @return {!o3djs.math.Vector} The ith row of m.
 */
o3djs.math.rowMajor.row = function(m, i) {
  return m[i].slice();
};

/**
 * Gets the ith row of the given matrix m; assumes matrix entries are
 * accessed in [column][row] fashion.
 * @param {!o3djs.math.Matrix} m The matrix.
 * @param {number} i The index of the desired row.
 * @return {!o3djs.math.Vector} The ith row of m.
 */
o3djs.math.columnMajor.row = function(m, i) {
  var r = [];
  var mLength = m.length;
  for (var j = 0; j < mLength; ++j) {
    r[j] = m[j][i];
  }
  return r;
};

/**
 * Gets the ith row of the given matrix m.
 * @param {!o3djs.math.Matrix} m The matrix.
 * @param {number} i The index of the desired row.
 * @return {!o3djs.math.Vector} The ith row of m.
 */
o3djs.math.row = null;

/**
 * Creates an n-by-n identity matrix.
 * @param {number} n The dimension of the identity matrix required.
 * @return {!o3djs.math.Matrix} An n-by-n identity matrix.
 */
o3djs.math.identity = function(n) {
  var r = [];
  for (var j = 0; j < n; ++j) {
    r[j] = [];
    for (var i = 0; i < n; ++i)
      r[j][i] = (i == j) ? 1 : 0;
  }
  return r;
};

/**
 * Takes the transpose of a matrix.
 * @param {!o3djs.math.Matrix} m The matrix.
 * @return {!o3djs.math.Matrix} The transpose of m.
 */
o3djs.math.transpose = function(m) {
  var r = [];
  var m0Length = m[0].length;
  var mLength = m.length;
  for (var j = 0; j < m0Length; ++j) {
    r[j] = [];
    for (var i = 0; i < mLength; ++i)
      r[j][i] = m[i][j];
  }
  return r;
};

/**
 * Computes the trace (sum of the diagonal entries) of a square matrix;
 * assumes m is square.
 * @param {!o3djs.math.Matrix} m The matrix.
 * @return {number} The trace of m.
 */
o3djs.math.trace = function(m) {
  var r = 0.0;
  var mLength = m.length;
  for (var i = 0; i < mLength; ++i)
    r += m[i][i];
  return r;
};

/**
 * Computes the determinant of a 1-by-1 matrix.
 * @param {!o3djs.math.Matrix1} m The matrix.
 * @return {number} The determinant of m.
 */
o3djs.math.det1 = function(m) {
  return m[0][0];
};

/**
 * Computes the determinant of a 2-by-2 matrix.
 * @param {!o3djs.math.Matrix2} m The matrix.
 * @return {number} The determinant of m.
 */
o3djs.math.det2 = function(m) {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
};

/**
 * Computes the determinant of a 3-by-3 matrix.
 * @param {!o3djs.math.Matrix3} m The matrix.
 * @return {number} The determinant of m.
 */
o3djs.math.det3 = function(m) {
  return m[2][2] * (m[0][0] * m[1][1] - m[0][1] * m[1][0]) -
         m[2][1] * (m[0][0] * m[1][2] - m[0][2] * m[1][0]) +
         m[2][0] * (m[0][1] * m[1][2] - m[0][2] * m[1][1]);
};

/**
 * Computes the determinant of a 4-by-4 matrix.
 * @param {!o3djs.math.Matrix4} m The matrix.
 * @return {number} The determinant of m.
 */
o3djs.math.det4 = function(m) {
  var t01 = m[0][0] * m[1][1] - m[0][1] * m[1][0];
  var t02 = m[0][0] * m[1][2] - m[0][2] * m[1][0];
  var t03 = m[0][0] * m[1][3] - m[0][3] * m[1][0];
  var t12 = m[0][1] * m[1][2] - m[0][2] * m[1][1];
  var t13 = m[0][1] * m[1][3] - m[0][3] * m[1][1];
  var t23 = m[0][2] * m[1][3] - m[0][3] * m[1][2];
  return m[3][3] * (m[2][2] * t01 - m[2][1] * t02 + m[2][0] * t12) -
         m[3][2] * (m[2][3] * t01 - m[2][1] * t03 + m[2][0] * t13) +
         m[3][1] * (m[2][3] * t02 - m[2][2] * t03 + m[2][0] * t23) -
         m[3][0] * (m[2][3] * t12 - m[2][2] * t13 + m[2][1] * t23);
};

/**
 * Computes the inverse of a 1-by-1 matrix.
 * @param {!o3djs.math.Matrix1} m The matrix.
 * @return {!o3djs.math.Matrix1} The inverse of m.
 */
o3djs.math.inverse1 = function(m) {
  return [[1.0 / m[0][0]]];
};

/**
 * Computes the inverse of a 2-by-2 matrix.
 * @param {!o3djs.math.Matrix2} m The matrix.
 * @return {!o3djs.math.Matrix2} The inverse of m.
 */
o3djs.math.inverse2 = function(m) {
  var d = 1.0 / (m[0][0] * m[1][1] - m[0][1] * m[1][0]);
  return [[d * m[1][1], -d * m[0][1]], [-d * m[1][0], d * m[0][0]]];
};

/**
 * Computes the inverse of a 3-by-3 matrix.
 * @param {!o3djs.math.Matrix3} m The matrix.
 * @return {!o3djs.math.Matrix3} The inverse of m.
 */
o3djs.math.inverse3 = function(m) {
  var t00 = m[1][1] * m[2][2] - m[1][2] * m[2][1];
  var t10 = m[0][1] * m[2][2] - m[0][2] * m[2][1];
  var t20 = m[0][1] * m[1][2] - m[0][2] * m[1][1];
  var d = 1.0 / (m[0][0] * t00 - m[1][0] * t10 + m[2][0] * t20);
  return [[d * t00, -d * t10, d * t20],
          [-d * (m[1][0] * m[2][2] - m[1][2] * m[2][0]),
            d * (m[0][0] * m[2][2] - m[0][2] * m[2][0]),
           -d * (m[0][0] * m[1][2] - m[0][2] * m[1][0])],
          [d * (m[1][0] * m[2][1] - m[1][1] * m[2][0]),
          -d * (m[0][0] * m[2][1] - m[0][1] * m[2][0]),
           d * (m[0][0] * m[1][1] - m[0][1] * m[1][0])]];
};

/**
 * Computes the inverse of a 4-by-4 matrix.
 * @param {!o3djs.math.Matrix4} m The matrix.
 * @return {!o3djs.math.Matrix4} The inverse of m.
 */
o3djs.math.inverse4 = function(m) {
  var tmp_0 = m[2][2] * m[3][3];
  var tmp_1 = m[3][2] * m[2][3];
  var tmp_2 = m[1][2] * m[3][3];
  var tmp_3 = m[3][2] * m[1][3];
  var tmp_4 = m[1][2] * m[2][3];
  var tmp_5 = m[2][2] * m[1][3];
  var tmp_6 = m[0][2] * m[3][3];
  var tmp_7 = m[3][2] * m[0][3];
  var tmp_8 = m[0][2] * m[2][3];
  var tmp_9 = m[2][2] * m[0][3];
  var tmp_10 = m[0][2] * m[1][3];
  var tmp_11 = m[1][2] * m[0][3];
  var tmp_12 = m[2][0] * m[3][1];
  var tmp_13 = m[3][0] * m[2][1];
  var tmp_14 = m[1][0] * m[3][1];
  var tmp_15 = m[3][0] * m[1][1];
  var tmp_16 = m[1][0] * m[2][1];
  var tmp_17 = m[2][0] * m[1][1];
  var tmp_18 = m[0][0] * m[3][1];
  var tmp_19 = m[3][0] * m[0][1];
  var tmp_20 = m[0][0] * m[2][1];
  var tmp_21 = m[2][0] * m[0][1];
  var tmp_22 = m[0][0] * m[1][1];
  var tmp_23 = m[1][0] * m[0][1];

  var t0 = (tmp_0 * m[1][1] + tmp_3 * m[2][1] + tmp_4 * m[3][1]) -
      (tmp_1 * m[1][1] + tmp_2 * m[2][1] + tmp_5 * m[3][1]);
  var t1 = (tmp_1 * m[0][1] + tmp_6 * m[2][1] + tmp_9 * m[3][1]) -
      (tmp_0 * m[0][1] + tmp_7 * m[2][1] + tmp_8 * m[3][1]);
  var t2 = (tmp_2 * m[0][1] + tmp_7 * m[1][1] + tmp_10 * m[3][1]) -
      (tmp_3 * m[0][1] + tmp_6 * m[1][1] + tmp_11 * m[3][1]);
  var t3 = (tmp_5 * m[0][1] + tmp_8 * m[1][1] + tmp_11 * m[2][1]) -
      (tmp_4 * m[0][1] + tmp_9 * m[1][1] + tmp_10 * m[2][1]);

  var d = 1.0 / (m[0][0] * t0 + m[1][0] * t1 + m[2][0] * t2 + m[3][0] * t3);

  return [[d * t0, d * t1, d * t2, d * t3],
      [d * ((tmp_1 * m[1][0] + tmp_2 * m[2][0] + tmp_5 * m[3][0]) -
          (tmp_0 * m[1][0] + tmp_3 * m[2][0] + tmp_4 * m[3][0])),
       d * ((tmp_0 * m[0][0] + tmp_7 * m[2][0] + tmp_8 * m[3][0]) -
          (tmp_1 * m[0][0] + tmp_6 * m[2][0] + tmp_9 * m[3][0])),
       d * ((tmp_3 * m[0][0] + tmp_6 * m[1][0] + tmp_11 * m[3][0]) -
          (tmp_2 * m[0][0] + tmp_7 * m[1][0] + tmp_10 * m[3][0])),
       d * ((tmp_4 * m[0][0] + tmp_9 * m[1][0] + tmp_10 * m[2][0]) -
          (tmp_5 * m[0][0] + tmp_8 * m[1][0] + tmp_11 * m[2][0]))],
      [d * ((tmp_12 * m[1][3] + tmp_15 * m[2][3] + tmp_16 * m[3][3]) -
          (tmp_13 * m[1][3] + tmp_14 * m[2][3] + tmp_17 * m[3][3])),
       d * ((tmp_13 * m[0][3] + tmp_18 * m[2][3] + tmp_21 * m[3][3]) -
          (tmp_12 * m[0][3] + tmp_19 * m[2][3] + tmp_20 * m[3][3])),
       d * ((tmp_14 * m[0][3] + tmp_19 * m[1][3] + tmp_22 * m[3][3]) -
          (tmp_15 * m[0][3] + tmp_18 * m[1][3] + tmp_23 * m[3][3])),
       d * ((tmp_17 * m[0][3] + tmp_20 * m[1][3] + tmp_23 * m[2][3]) -
          (tmp_16 * m[0][3] + tmp_21 * m[1][3] + tmp_22 * m[2][3]))],
      [d * ((tmp_14 * m[2][2] + tmp_17 * m[3][2] + tmp_13 * m[1][2]) -
          (tmp_16 * m[3][2] + tmp_12 * m[1][2] + tmp_15 * m[2][2])),
       d * ((tmp_20 * m[3][2] + tmp_12 * m[0][2] + tmp_19 * m[2][2]) -
          (tmp_18 * m[2][2] + tmp_21 * m[3][2] + tmp_13 * m[0][2])),
       d * ((tmp_18 * m[1][2] + tmp_23 * m[3][2] + tmp_15 * m[0][2]) -
          (tmp_22 * m[3][2] + tmp_14 * m[0][2] + tmp_19 * m[1][2])),
       d * ((tmp_22 * m[2][2] + tmp_16 * m[0][2] + tmp_21 * m[1][2]) -
          (tmp_20 * m[1][2] + tmp_23 * m[2][2] + tmp_17 * m[0][2]))]];
};

/**
 * Computes the determinant of the cofactor matrix obtained by removal
 * of a specified row and column.  This is a helper function for the general
 * determinant and matrix inversion functions.
 * @param {!o3djs.math.Matrix} a The original matrix.
 * @param {number} x The row to be removed.
 * @param {number} y The column to be removed.
 * @return {number} The determinant of the matrix obtained by removing
 *     row x and column y from a.
 */
o3djs.math.codet = function(a, x, y) {
  var size = a.length;
  var b = [];
  var ai = 0;
  for (var bi = 0; bi < size - 1; ++bi) {
    if (ai == x)
      ai++;
    b[bi] = [];
    var aj = 0;
    for (var bj = 0; bj < size - 1; ++bj) {
      if (aj == y)
        aj++;
      b[bi][bj] = a[ai][aj];
      aj++;
    }
    ai++;
  }
  return o3djs.math.det(b);
};

/**
 * Computes the determinant of an arbitrary square matrix.
 * @param {!o3djs.math.Matrix} m The matrix.
 * @return {number} the determinant of m.
 */
o3djs.math.det = function(m) {
  var d = m.length;
  if (d <= 4) {
    return o3djs.math['det' + d](m);
  }
  var r = 0.0;
  var sign = 1;
  var row = m[0];
  var mLength = m.length;
  for (var y = 0; y < mLength; y++) {
    r += sign * row[y] * o3djs.math.codet(m, 0, y);
    sign *= -1;
  }
  return r;
};

/**
 * Computes the inverse of an arbitrary square matrix.
 * @param {!o3djs.math.Matrix} m The matrix.
 * @return {!o3djs.math.Matrix} The inverse of m.
 */
o3djs.math.inverse = function(m) {
  var d = m.length;
  if (d <= 4) {
    return o3djs.math['inverse' + d](m);
  }
  var r = [];
  var size = m.length;
  for (var j = 0; j < size; ++j) {
    r[j] = [];
    for (var i = 0; i < size; ++i)
      r[j][i] = ((i + j) % 2 ? -1 : 1) * o3djs.math.codet(m, i, j);
  }
  return o3djs.math.divMatrixScalar(r, o3djs.math.det(m));
};

/**
 * Performs Graham-Schmidt orthogonalization on the vectors which make up the
 * given matrix and returns the result in the rows of a new matrix.  When
 * multiplying many orthogonal matrices together, errors can accumulate causing
 * the product to fail to be orthogonal.  This function can be used to correct
 * that.
 * @param {!o3djs.math.Matrix} m The matrix.
 * @return {!o3djs.math.Matrix} A matrix whose rows are obtained from the
 *     rows of m by the Graham-Schmidt process.
 */
o3djs.math.orthonormalize = function(m) {
  var r = [];
  var mLength = m.length;
  for (var i = 0; i < mLength; ++i) {
    var v = m[i];
    for (var j = 0; j < i; ++j) {
      v = o3djs.math.subVector(v, o3djs.math.mulScalarVector(
          o3djs.math.dot(r[j], m[i]), r[j]));
    }
    r[i] = o3djs.math.normalize(v);
  }
  return r;
};

/**
 * Computes the inverse of a 4-by-4 matrix.
 * Note: It is faster to call this than o3djs.math.inverse.
 * @param {!o3djs.math.Matrix4} m The matrix.
 * @return {!o3djs.math.Matrix4} The inverse of m.
 */
o3djs.math.matrix4.inverse = function(m) {
  return o3djs.math.inverse4(m);
};

/**
 * Multiplies two 4-by-4 matrices; assumes that the given matrices are 4-by-4.
 * Note: It is faster to call this than o3djs.math.mul.
 * @param {!o3djs.math.Matrix4} a The matrix on the left.
 * @param {!o3djs.math.Matrix4} b The matrix on the right.
 * @return {!o3djs.math.Matrix4} The matrix product of a and b.
 */
o3djs.math.matrix4.mul = function(a, b) {
  return o3djs.math.mulMatrixMatrix4(a, b);
};

/**
 * Computes the determinant of a 4-by-4 matrix.
 * Note: It is faster to call this than o3djs.math.det.
 * @param {!o3djs.math.Matrix4} m The matrix.
 * @return {number} The determinant of m.
 */
o3djs.math.matrix4.det = function(m) {
  return o3djs.math.det4(m);
};

/**
 * Copies a Matrix4.
 * Note: It is faster to call this than o3djs.math.copy.
 * @param {!o3djs.math.Matrix4} m The matrix.
 * @return {!o3djs.math.Matrix4} A copy of m.
 */
o3djs.math.matrix4.copy = function(m) {
  return o3djs.math.copyMatrix(m);
};

/**
 * Sets the upper 3-by-3 block of matrix a to the upper 3-by-3 block of matrix
 * b; assumes that a and b are big enough to contain an upper 3-by-3 block.
 * @param {!o3djs.math.Matrix4} a A matrix.
 * @param {!o3djs.math.Matrix3} b A 3-by-3 matrix.
 * @return {!o3djs.math.Matrix4} a once modified.
 */
o3djs.math.matrix4.setUpper3x3 = function(a, b) {
  var b0 = b[0];
  var b1 = b[1];
  var b2 = b[2];

  a[0].splice(0, 3, b0[0], b0[1], b0[2]);
  a[1].splice(0, 3, b1[0], b1[1], b1[2]);
  a[2].splice(0, 3, b2[0], b2[1], b2[2]);

  return a;
};

/**
 * Returns a 3-by-3 matrix mimicking the upper 3-by-3 block of m; assumes m
 * is big enough to contain an upper 3-by-3 block.
 * @param {!o3djs.math.Matrix4} m The matrix.
 * @return {!o3djs.math.Matrix3} The upper 3-by-3 block of m.
 */
o3djs.math.matrix4.getUpper3x3 = function(m) {
  return [m[0].slice(0, 3), m[1].slice(0, 3), m[2].slice(0, 3)];
};

/**
 * Sets the translation component of a 4-by-4 matrix to the given
 * vector.
 * @param {!o3djs.math.Matrix4} a The matrix.
 * @param {(!o3djs.math.Vector3|!o3djs.math.Vector4)} v The vector.
 * @return {!o3djs.math.Matrix4} a once modified.
 */
o3djs.math.matrix4.setTranslation = function(a, v) {
  a[3].splice(0, 4, v[0], v[1], v[2], 1);
  return a;
};

/**
 * Returns the translation component of a 4-by-4 matrix as a vector with 3
 * entries.
 * @param {!o3djs.math.Matrix4} m The matrix.
 * @return {!o3djs.math.Vector3} The translation component of m.
 */
o3djs.math.matrix4.getTranslation = function(m) {
  return m[3].slice(0, 3);
};

/**
 * Takes a 4-by-4 matrix and a vector with 3 entries,
 * interprets the vector as a point, transforms that point by the matrix, and
 * returns the result as a vector with 3 entries.
 * @param {!o3djs.math.Matrix4} m The matrix.
 * @param {!o3djs.math.Vector3} v The point.
 * @return {!o3djs.math.Vector3} The transformed point.
 */
o3djs.math.matrix4.transformPoint = function(m, v) {
  var v0 = v[0];
  var v1 = v[1];
  var v2 = v[2];
  var m0 = m[0];
  var m1 = m[1];
  var m2 = m[2];
  var m3 = m[3];

  var d = v0 * m0[3] + v1 * m1[3] + v2 * m2[3] + m3[3];
  return [(v0 * m0[0] + v1 * m1[0] + v2 * m2[0] + m3[0]) / d,
          (v0 * m0[1] + v1 * m1[1] + v2 * m2[1] + m3[1]) / d,
          (v0 * m0[2] + v1 * m1[2] + v2 * m2[2] + m3[2]) / d];
};

/**
 * Takes a 4-by-4 matrix and a vector with 4 entries, transforms that vector by
 * the matrix, and returns the result as a vector with 4 entries.
 * @param {!o3djs.math.Matrix4} m The matrix.
 * @param {!o3djs.math.Vector4} v The point in homogenous coordinates.
 * @return {!o3djs.math.Vector4} The transformed point in homogenous
 *     coordinates.
 */
o3djs.math.matrix4.transformVector4 = function(m, v) {
  var v0 = v[0];
  var v1 = v[1];
  var v2 = v[2];
  var v3 = v[3];
  var m0 = m[0];
  var m1 = m[1];
  var m2 = m[2];
  var m3 = m[3];

  return [v0 * m0[0] + v1 * m1[0] + v2 * m2[0] + v3 * m3[0],
          v0 * m0[1] + v1 * m1[1] + v2 * m2[1] + v3 * m3[1],
          v0 * m0[2] + v1 * m1[2] + v2 * m2[2] + v3 * m3[2],
          v0 * m0[3] + v1 * m1[3] + v2 * m2[3] + v3 * m3[3]];
};

/**
 * Takes a 4-by-4 matrix and a vector with 3 entries, interprets the vector as a
 * direction, transforms that direction by the matrix, and returns the result;
 * assumes the transformation of 3-dimensional space represented by the matrix
 * is parallel-preserving, i.e. any combination of rotation, scaling and
 * translation, but not a perspective distortion. Returns a vector with 3
 * entries.
 * @param {!o3djs.math.Matrix4} m The matrix.
 * @param {!o3djs.math.Vector3} v The direction.
 * @return {!o3djs.math.Vector3} The transformed direction.
 */
o3djs.math.matrix4.transformDirection = function(m, v) {
  var v0 = v[0];
  var v1 = v[1];
  var v2 = v[2];
  var m0 = m[0];
  var m1 = m[1];
  var m2 = m[2];
  var m3 = m[3];

  return [v0 * m0[0] + v1 * m1[0] + v2 * m2[0],
          v0 * m0[1] + v1 * m1[1] + v2 * m2[1],
          v0 * m0[2] + v1 * m1[2] + v2 * m2[2]];
};

/**
 * Takes a 4-by-4 matrix m and a vector v with 3 entries, interprets the vector
 * as a normal to a surface, and computes a vector which is normal upon
 * transforming that surface by the matrix. The effect of this function is the
 * same as transforming v (as a direction) by the inverse-transpose of m.  This
 * function assumes the transformation of 3-dimensional space represented by the
 * matrix is parallel-preserving, i.e. any combination of rotation, scaling and
 * translation, but not a perspective distortion.  Returns a vector with 3
 * entries.
 * @param {!o3djs.math.Matrix4} m The matrix.
 * @param {!o3djs.math.Vector3} v The normal.
 * @return {!o3djs.math.Vector3} The transformed normal.
 */
o3djs.math.matrix4.transformNormal = function(m, v) {
  var mInverse = o3djs.math.inverse4(m);
  var v0 = v[0];
  var v1 = v[1];
  var v2 = v[2];
  var mi0 = mInverse[0];
  var mi1 = mInverse[1];
  var mi2 = mInverse[2];
  var mi3 = mInverse[3];

  return [v0 * mi0[0] + v1 * mi0[1] + v2 * mi0[2],
          v0 * mi1[0] + v1 * mi1[1] + v2 * mi1[2],
          v0 * mi2[0] + v1 * mi2[1] + v2 * mi2[2]];
};

/**
 * Creates a 4-by-4 identity matrix.
 * @return {!o3djs.math.Matrix4} The 4-by-4 identity.
 */
o3djs.math.matrix4.identity = function() {
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];
};

/**
 * Sets the given 4-by-4 matrix to the identity matrix.
 * @param {!o3djs.math.Matrix4} m The matrix to set to identity.
 * @return {!o3djs.math.Matrix4} m once modified.
 */
o3djs.math.matrix4.setIdentity = function(m) {
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (i == j) {
        m[i][j] = 1;
      } else {
        m[i][j] = 0;
      }
    }
  }
  return m;
};

/**
 * Computes a 4-by-4 perspective transformation matrix given the angular height
 * of the frustum, the aspect ratio, and the near and far clipping planes.  The
 * arguments define a frustum extending in the negative z direction.  The given
 * angle is the vertical angle of the frustum, and the horizontal angle is
 * determined to produce the given aspect ratio.  The arguments near and far are
 * the distances to the near and far clipping planes.  Note that near and far
 * are not z coordinates, but rather they are distances along the negative
 * z-axis.  The matrix generated sends the viewing frustum to the unit box.
 * We assume a unit box extending from -1 to 1 in the x and y dimensions and
 * from 0 to 1 in the z dimension.
 * @param {number} angle The camera angle from top to bottom (in radians).
 * @param {number} aspect The aspect ratio width / height.
 * @param {number} near The depth (negative z coordinate)
 *     of the near clipping plane.
 * @param {number} far The depth (negative z coordinate)
 *     of the far clipping plane.
 * @return {!o3djs.math.Matrix4} The perspective matrix.
 */
o3djs.math.matrix4.perspective = function(angle, aspect, near, far) {
  var f = Math.tan(0.5 * (Math.PI - angle));
  var range = near - far;

  return [
    [f / aspect, 0, 0, 0],
    [0, f, 0, 0],
    [0, 0, far / range, -1],
    [0, 0, near * far / range, 0]
  ];
};

/**
 * Computes a 4-by-4 orthographic projection matrix given the coordinates of the
 * planes defining the axis-aligned, box-shaped viewing volume.  The matrix
 * generated sends that box to the unit box.  Note that although left and right
 * are x coordinates and bottom and top are y coordinates, near and far
 * are not z coordinates, but rather they are distances along the negative
 * z-axis.  We assume a unit box extending from -1 to 1 in the x and y
 * dimensions and from 0 to 1 in the z dimension.
 * @param {number} left The x coordinate of the left plane of the box.
 * @param {number} right The x coordinate of the right plane of the box.
 * @param {number} bottom The y coordinate of the bottom plane of the box.
 * @param {number} top The y coordinate of the right plane of the box.
 * @param {number} near The negative z coordinate of the near plane of the box.
 * @param {number} far The negative z coordinate of the far plane of the box.
 * @return {!o3djs.math.Matrix4} The orthographic projection matrix.
 */
o3djs.math.matrix4.orthographic =
    function(left, right, bottom, top, near, far) {
  return [
    [2 / (right - left), 0, 0, 0],
    [0, 2 / (top - bottom), 0, 0],
    [0, 0, 1 / (near - far), 0],
    [(left + right) / (left - right),
     (bottom + top) / (bottom - top),
     near / (near - far), 1]
  ];
};

/**
 * Computes a 4-by-4 perspective transformation matrix given the left, right,
 * top, bottom, near and far clipping planes. The arguments define a frustum
 * extending in the negative z direction. The arguments near and far are the
 * distances to the near and far clipping planes. Note that near and far are not
 * z coordinates, but rather they are distances along the negative z-axis. The
 * matrix generated sends the viewing frustum to the unit box. We assume a unit
 * box extending from -1 to 1 in the x and y dimensions and from 0 to 1 in the z
 * dimension.
 * @param {number} left The x coordinate of the left plane of the box.
 * @param {number} right The x coordinate of the right plane of the box.
 * @param {number} bottom The y coordinate of the bottom plane of the box.
 * @param {number} top The y coordinate of the right plane of the box.
 * @param {number} near The negative z coordinate of the near plane of the box.
 * @param {number} far The negative z coordinate of the far plane of the box.
 * @return {!o3djs.math.Matrix4} The perspective projection matrix.
 */
o3djs.math.matrix4.frustum = function(left, right, bottom, top, near, far) {
  var dx = (right - left);
  var dy = (top - bottom);
  var dz = (near - far);
  return [
    [2 * near / dx, 0, 0, 0],
    [0, 2 * near / dy, 0, 0],
    [(left + right) / dx, (top + bottom) / dy, far / dz, -1],
    [0, 0, near * far / dz, 0]];
};

/**
 * Computes a 4-by-4 look-at transformation.  The transformation generated is
 * an orthogonal rotation matrix with translation component.  The translation
 * component sends the eye to the origin.  The rotation component sends the
 * vector pointing from the eye to the target to a vector pointing in the
 * negative z direction, and also sends the up vector into the upper half of
 * the yz plane.
 * @param {(!o3djs.math.Vector3|!o3djs.math.Vector4)} eye The position
 *     of the eye.
 * @param {(!o3djs.math.Vector3|!o3djs.math.Vector4)} target The
 *     position meant to be viewed.
 * @param {(!o3djs.math.Vector3|!o3djs.math.Vector4)} up A vector
 *     pointing up.
 * @return {!o3djs.math.Matrix4} The look-at matrix.
 */
o3djs.math.matrix4.lookAt = function(eye, target, up) {
  var vz = o3djs.math.normalize(
      o3djs.math.subVector(eye, target).slice(0, 3)).concat(0);
  var vx = o3djs.math.normalize(
      o3djs.math.cross(up, vz)).concat(0);
  var vy = o3djs.math.cross(vz, vx).concat(0);

  return o3djs.math.inverse([vx, vy, vz, eye.concat(1)]);
};

/**
 * Takes two 4-by-4 matrices, a and b, and computes the product in the order
 * that pre-composes b with a.  In other words, the matrix returned will
 * transform by b first and then a.  Note this is subtly different from just
 * multiplying the matrices together.  For given a and b, this function returns
 * the same object in both row-major and column-major mode.
 * @param {!o3djs.math.Matrix4} a A 4-by-4 matrix.
 * @param {!o3djs.math.Matrix4} b A 4-by-4 matrix.
 * @return {!o3djs.math.Matrix4} the composition of a and b, b first then a.
 */
o3djs.math.matrix4.composition = function(a, b) {
  var a0 = a[0];
  var a1 = a[1];
  var a2 = a[2];
  var a3 = a[3];
  var b0 = b[0];
  var b1 = b[1];
  var b2 = b[2];
  var b3 = b[3];
  var a00 = a0[0];
  var a01 = a0[1];
  var a02 = a0[2];
  var a03 = a0[3];
  var a10 = a1[0];
  var a11 = a1[1];
  var a12 = a1[2];
  var a13 = a1[3];
  var a20 = a2[0];
  var a21 = a2[1];
  var a22 = a2[2];
  var a23 = a2[3];
  var a30 = a3[0];
  var a31 = a3[1];
  var a32 = a3[2];
  var a33 = a3[3];
  var b00 = b0[0];
  var b01 = b0[1];
  var b02 = b0[2];
  var b03 = b0[3];
  var b10 = b1[0];
  var b11 = b1[1];
  var b12 = b1[2];
  var b13 = b1[3];
  var b20 = b2[0];
  var b21 = b2[1];
  var b22 = b2[2];
  var b23 = b2[3];
  var b30 = b3[0];
  var b31 = b3[1];
  var b32 = b3[2];
  var b33 = b3[3];
  return [[a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03,
           a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03,
           a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03,
           a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03],
          [a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13,
           a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13,
           a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13,
           a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13],
          [a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23,
           a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23,
           a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23,
           a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23],
          [a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33,
           a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33,
           a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33,
           a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33]];
};

/**
 * Takes two 4-by-4 matrices, a and b, and modifies a to be the product in the
 * order that pre-composes b with a.  The matrix a, upon modification will
 * transform by b first and then a.  Note this is subtly different from just
 * multiplying the matrices together.  For given a and b, a, upon modification,
 * will be the same object in both row-major and column-major mode.
 * @param {!o3djs.math.Matrix4} a A 4-by-4 matrix.
 * @param {!o3djs.math.Matrix4} b A 4-by-4 matrix.
 * @return {!o3djs.math.Matrix4} a once modified.
 */
o3djs.math.matrix4.compose = function(a, b) {
  var a0 = a[0];
  var a1 = a[1];
  var a2 = a[2];
  var a3 = a[3];
  var b0 = b[0];
  var b1 = b[1];
  var b2 = b[2];
  var b3 = b[3];
  var a00 = a0[0];
  var a01 = a0[1];
  var a02 = a0[2];
  var a03 = a0[3];
  var a10 = a1[0];
  var a11 = a1[1];
  var a12 = a1[2];
  var a13 = a1[3];
  var a20 = a2[0];
  var a21 = a2[1];
  var a22 = a2[2];
  var a23 = a2[3];
  var a30 = a3[0];
  var a31 = a3[1];
  var a32 = a3[2];
  var a33 = a3[3];
  var b00 = b0[0];
  var b01 = b0[1];
  var b02 = b0[2];
  var b03 = b0[3];
  var b10 = b1[0];
  var b11 = b1[1];
  var b12 = b1[2];
  var b13 = b1[3];
  var b20 = b2[0];
  var b21 = b2[1];
  var b22 = b2[2];
  var b23 = b2[3];
  var b30 = b3[0];
  var b31 = b3[1];
  var b32 = b3[2];
  var b33 = b3[3];
  a[0].splice(0, 4, a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03,
                    a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03,
                    a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03,
                    a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03);
  a[1].splice(0, 4, a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13,
                    a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13,
                    a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13,
                    a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13);
  a[2].splice(0, 4, a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23,
                    a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23,
                    a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23,
                    a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23),
  a[3].splice(0, 4, a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33,
                    a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33,
                    a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33,
                    a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33);
  return a;
};

/**
 * Creates a 4-by-4 matrix which translates by the given vector v.
 * @param {(!o3djs.math.Vector3|!o3djs.math.Vector4)} v The vector by
 *     which to translate.
 * @return {!o3djs.math.Matrix4} The translation matrix.
 */
o3djs.math.matrix4.translation = function(v) {
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [v[0], v[1], v[2], 1]
  ];
};

/**
 * Modifies the given 4-by-4 matrix by translation by the given vector v.
 * @param {!o3djs.math.Matrix4} m The matrix.
 * @param {(!o3djs.math.Vector3|!o3djs.math.Vector4)} v The vector by
 *     which to translate.
 * @return {!o3djs.math.Matrix4} m once modified.
 */
o3djs.math.matrix4.translate = function(m, v) {
  var v0 = v[0];
  var v1 = v[1];
  var v2 = v[2];
  var m0 = m[0];
  var m1 = m[1];
  var m2 = m[2];
  var m3 = m[3];
  var m00 = m0[0];
  var m01 = m0[1];
  var m02 = m0[2];
  var m03 = m0[3];
  var m10 = m1[0];
  var m11 = m1[1];
  var m12 = m1[2];
  var m13 = m1[3];
  var m20 = m2[0];
  var m21 = m2[1];
  var m22 = m2[2];
  var m23 = m2[3];
  var m30 = m3[0];
  var m31 = m3[1];
  var m32 = m3[2];
  var m33 = m3[3];

  m3.splice(0, 4, m00 * v0 + m10 * v1 + m20 * v2 + m30,
                  m01 * v0 + m11 * v1 + m21 * v2 + m31,
                  m02 * v0 + m12 * v1 + m22 * v2 + m32,
                  m03 * v0 + m13 * v1 + m23 * v2 + m33);

  return m;
};

/**
 * Creates a 4-by-4 matrix which scales in each dimension by an amount given by
 * the corresponding entry in the given vector; assumes the vector has three
 * entries.
 * @param {!o3djs.math.Vector3} v A vector of
 *     three entries specifying the factor by which to scale in each dimension.
 * @return {!o3djs.math.Matrix4} The scaling matrix.
 */
o3djs.math.matrix4.scaling = function(v) {
  return [
    [v[0], 0, 0, 0],
    [0, v[1], 0, 0],
    [0, 0, v[2], 0],
    [0, 0, 0, 1]
  ];
};

/**
 * Modifies the given 4-by-4 matrix, scaling in each dimension by an amount
 * given by the corresponding entry in the given vector; assumes the vector has
 * three entries.
 * @param {!o3djs.math.Matrix4} m The matrix to be modified.
 * @param {!o3djs.math.Vector3} v A vector of three entries specifying the
 *     factor by which to scale in each dimension.
 * @return {!o3djs.math.Matrix4} m once modified.
 */
o3djs.math.matrix4.scale = function(m, v) {
  var v0 = v[0];
  var v1 = v[1];
  var v2 = v[2];

  var m0 = m[0];
  var m1 = m[1];
  var m2 = m[2];
  var m3 = m[3];

  m0.splice(0, 4, v0 * m0[0], v0 * m0[1], v0 * m0[2], v0 * m0[3]);
  m1.splice(0, 4, v1 * m1[0], v1 * m1[1], v1 * m1[2], v1 * m1[3]);
  m2.splice(0, 4, v2 * m2[0], v2 * m2[1], v2 * m2[2], v2 * m2[3]);

  return m;
};

/**
 * Creates a 4-by-4 matrix which rotates around the x-axis by the given angle.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {!o3djs.math.Matrix4} The rotation matrix.
 */
o3djs.math.matrix4.rotationX = function(angle) {
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  return [
    [1, 0, 0, 0],
    [0, c, s, 0],
    [0, -s, c, 0],
    [0, 0, 0, 1]
  ];
};

/**
 * Modifies the given 4-by-4 matrix by a rotation around the x-axis by the given
 * angle.
 * @param {!o3djs.math.Matrix4} m The matrix.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {!o3djs.math.Matrix4} m once modified.
 */
o3djs.math.matrix4.rotateX = function(m, angle) {
  var m0 = m[0];
  var m1 = m[1];
  var m2 = m[2];
  var m3 = m[3];
  var m10 = m1[0];
  var m11 = m1[1];
  var m12 = m1[2];
  var m13 = m1[3];
  var m20 = m2[0];
  var m21 = m2[1];
  var m22 = m2[2];
  var m23 = m2[3];
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  m1.splice(0, 4, c * m10 + s * m20,
                  c * m11 + s * m21,
                  c * m12 + s * m22,
                  c * m13 + s * m23);
  m2.splice(0, 4, c * m20 - s * m10,
                  c * m21 - s * m11,
                  c * m22 - s * m12,
                  c * m23 - s * m13);

  return m;
};

/**
 * Creates a 4-by-4 matrix which rotates around the y-axis by the given angle.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {!o3djs.math.Matrix4} The rotation matrix.
 */
o3djs.math.matrix4.rotationY = function(angle) {
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  return [
    [c, 0, -s, 0],
    [0, 1, 0, 0],
    [s, 0, c, 0],
    [0, 0, 0, 1]
  ];
};

/**
 * Modifies the given 4-by-4 matrix by a rotation around the y-axis by the given
 * angle.
 * @param {!o3djs.math.Matrix4} m The matrix.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {!o3djs.math.Matrix4} m once modified.
 */
o3djs.math.matrix4.rotateY = function(m, angle) {
  var m0 = m[0];
  var m1 = m[1];
  var m2 = m[2];
  var m3 = m[3];
  var m00 = m0[0];
  var m01 = m0[1];
  var m02 = m0[2];
  var m03 = m0[3];
  var m20 = m2[0];
  var m21 = m2[1];
  var m22 = m2[2];
  var m23 = m2[3];
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  m0.splice(0, 4, c * m00 - s * m20,
                  c * m01 - s * m21,
                  c * m02 - s * m22,
                  c * m03 - s * m23);
  m2.splice(0, 4, c * m20 + s * m00,
                  c * m21 + s * m01,
                  c * m22 + s * m02,
                  c * m23 + s * m03);

  return m;
};

/**
 * Creates a 4-by-4 matrix which rotates around the z-axis by the given angle.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {!o3djs.math.Matrix4} The rotation matrix.
 */
o3djs.math.matrix4.rotationZ = function(angle) {
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  return [
    [c, s, 0, 0],
    [-s, c, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];
};

/**
 * Modifies the given 4-by-4 matrix by a rotation around the z-axis by the given
 * angle.
 * @param {!o3djs.math.Matrix4} m The matrix.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {!o3djs.math.Matrix4} m once modified.
 */
o3djs.math.matrix4.rotateZ = function(m, angle) {
  var m0 = m[0];
  var m1 = m[1];
  var m2 = m[2];
  var m3 = m[3];
  var m00 = m0[0];
  var m01 = m0[1];
  var m02 = m0[2];
  var m03 = m0[3];
  var m10 = m1[0];
  var m11 = m1[1];
  var m12 = m1[2];
  var m13 = m1[3];
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  m0.splice(0, 4, c * m00 + s * m10,
                  c * m01 + s * m11,
                  c * m02 + s * m12,
                  c * m03 + s * m13);
  m1.splice(0, 4, c * m10 - s * m00,
                  c * m11 - s * m01,
                  c * m12 - s * m02,
                  c * m13 - s * m03);

  return m;
};

/**
 * Creates a 4-by-4 rotation matrix.  Interprets the entries of the given
 * vector as angles by which to rotate around the x, y and z axes, returns a
 * a matrix which rotates around the x-axis first, then the y-axis, then the
 * z-axis.
 * @param {!o3djs.math.Vector3} v A vector of angles (in radians).
 * @return {!o3djs.math.Matrix4} The rotation matrix.
 */
o3djs.math.matrix4.rotationZYX = function(v) {
  var sinx = Math.sin(v[0]);
  var cosx = Math.cos(v[0]);
  var siny = Math.sin(v[1]);
  var cosy = Math.cos(v[1]);
  var sinz = Math.sin(v[2]);
  var cosz = Math.cos(v[2]);

  var coszsiny = cosz * siny;
  var sinzsiny = sinz * siny;

  return [
    [cosz * cosy, sinz * cosy, -siny, 0],
    [coszsiny * sinx - sinz * cosx,
     sinzsiny * sinx + cosz * cosx,
     cosy * sinx,
     0],
    [coszsiny * cosx + sinz * sinx,
     sinzsiny * cosx - cosz * sinx,
     cosy * cosx,
     0],
    [0, 0, 0, 1]
  ];
};

/**
 * Modifies a 4-by-4 matrix by a rotation.  Interprets the coordinates of the
 * given vector as angles by which to rotate around the x, y and z axes, rotates
 * around the x-axis first, then the y-axis, then the z-axis.
 * @param {!o3djs.math.Matrix4} m The matrix.
 * @param {!o3djs.math.Vector3} v A vector of angles (in radians).
 * @return {!o3djs.math.Matrix4} m once modified.
 */
o3djs.math.matrix4.rotateZYX = function(m, v) {
  var sinX = Math.sin(v[0]);
  var cosX = Math.cos(v[0]);
  var sinY = Math.sin(v[1]);
  var cosY = Math.cos(v[1]);
  var sinZ = Math.sin(v[2]);
  var cosZ = Math.cos(v[2]);

  var cosZSinY = cosZ * sinY;
  var sinZSinY = sinZ * sinY;

  var r00 = cosZ * cosY;
  var r01 = sinZ * cosY;
  var r02 = -sinY;
  var r10 = cosZSinY * sinX - sinZ * cosX;
  var r11 = sinZSinY * sinX + cosZ * cosX;
  var r12 = cosY * sinX;
  var r20 = cosZSinY * cosX + sinZ * sinX;
  var r21 = sinZSinY * cosX - cosZ * sinX;
  var r22 = cosY * cosX;

  var m0 = m[0];
  var m1 = m[1];
  var m2 = m[2];
  var m3 = m[3];

  var m00 = m0[0];
  var m01 = m0[1];
  var m02 = m0[2];
  var m03 = m0[3];
  var m10 = m1[0];
  var m11 = m1[1];
  var m12 = m1[2];
  var m13 = m1[3];
  var m20 = m2[0];
  var m21 = m2[1];
  var m22 = m2[2];
  var m23 = m2[3];
  var m30 = m3[0];
  var m31 = m3[1];
  var m32 = m3[2];
  var m33 = m3[3];

  m0.splice(0, 4,
      r00 * m00 + r01 * m10 + r02 * m20,
      r00 * m01 + r01 * m11 + r02 * m21,
      r00 * m02 + r01 * m12 + r02 * m22,
      r00 * m03 + r01 * m13 + r02 * m23);

  m1.splice(0, 4,
      r10 * m00 + r11 * m10 + r12 * m20,
      r10 * m01 + r11 * m11 + r12 * m21,
      r10 * m02 + r11 * m12 + r12 * m22,
      r10 * m03 + r11 * m13 + r12 * m23);

  m2.splice(0, 4,
      r20 * m00 + r21 * m10 + r22 * m20,
      r20 * m01 + r21 * m11 + r22 * m21,
      r20 * m02 + r21 * m12 + r22 * m22,
      r20 * m03 + r21 * m13 + r22 * m23);

  return m;
};

/**
 * Creates a 4-by-4 matrix which rotates around the given axis by the given
 * angle.
 * @param {(!o3djs.math.Vector3|!o3djs.math.Vector4)} axis The axis
 *     about which to rotate.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {!o3djs.math.Matrix4} A matrix which rotates angle radians
 *     around the axis.
 */
o3djs.math.matrix4.axisRotation = function(axis, angle) {
  var x = axis[0];
  var y = axis[1];
  var z = axis[2];
  var n = Math.sqrt(x * x + y * y + z * z);
  x /= n;
  y /= n;
  z /= n;
  var xx = x * x;
  var yy = y * y;
  var zz = z * z;
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  var oneMinusCosine = 1 - c;

  return [
    [xx + (1 - xx) * c,
     x * y * oneMinusCosine + z * s,
     x * z * oneMinusCosine - y * s,
     0],
    [x * y * oneMinusCosine - z * s,
     yy + (1 - yy) * c,
     y * z * oneMinusCosine + x * s,
     0],
    [x * z * oneMinusCosine + y * s,
     y * z * oneMinusCosine - x * s,
     zz + (1 - zz) * c,
     0],
    [0, 0, 0, 1]
  ];
};

/**
 * Modifies the given 4-by-4 matrix by rotation around the given axis by the
 * given angle.
 * @param {!o3djs.math.Matrix4} m The matrix.
 * @param {(!o3djs.math.Vector3|!o3djs.math.Vector4)} axis The axis
 *     about which to rotate.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {!o3djs.math.Matrix4} m once modified.
 */
o3djs.math.matrix4.axisRotate = function(m, axis, angle) {
  var x = axis[0];
  var y = axis[1];
  var z = axis[2];
  var n = Math.sqrt(x * x + y * y + z * z);
  x /= n;
  y /= n;
  z /= n;
  var xx = x * x;
  var yy = y * y;
  var zz = z * z;
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  var oneMinusCosine = 1 - c;

  var r00 = xx + (1 - xx) * c;
  var r01 = x * y * oneMinusCosine + z * s;
  var r02 = x * z * oneMinusCosine - y * s;
  var r10 = x * y * oneMinusCosine - z * s;
  var r11 = yy + (1 - yy) * c;
  var r12 = y * z * oneMinusCosine + x * s;
  var r20 = x * z * oneMinusCosine + y * s;
  var r21 = y * z * oneMinusCosine - x * s;
  var r22 = zz + (1 - zz) * c;

  var m0 = m[0];
  var m1 = m[1];
  var m2 = m[2];
  var m3 = m[3];

  var m00 = m0[0];
  var m01 = m0[1];
  var m02 = m0[2];
  var m03 = m0[3];
  var m10 = m1[0];
  var m11 = m1[1];
  var m12 = m1[2];
  var m13 = m1[3];
  var m20 = m2[0];
  var m21 = m2[1];
  var m22 = m2[2];
  var m23 = m2[3];
  var m30 = m3[0];
  var m31 = m3[1];
  var m32 = m3[2];
  var m33 = m3[3];

  m0.splice(0, 4,
      r00 * m00 + r01 * m10 + r02 * m20,
      r00 * m01 + r01 * m11 + r02 * m21,
      r00 * m02 + r01 * m12 + r02 * m22,
      r00 * m03 + r01 * m13 + r02 * m23);

  m1.splice(0, 4,
      r10 * m00 + r11 * m10 + r12 * m20,
      r10 * m01 + r11 * m11 + r12 * m21,
      r10 * m02 + r11 * m12 + r12 * m22,
      r10 * m03 + r11 * m13 + r12 * m23);

  m2.splice(0, 4,
      r20 * m00 + r21 * m10 + r22 * m20,
      r20 * m01 + r21 * m11 + r22 * m21,
      r20 * m02 + r21 * m12 + r22 * m22,
      r20 * m03 + r21 * m13 + r22 * m23);

  return m;
};

/**
 * Sets each function in the namespace o3djs.math to the row major
 * version in o3djs.math.rowMajor (provided such a function exists in
 * o3djs.math.rowMajor).  Call this function to establish the row major
 * convention.
 */
o3djs.math.installRowMajorFunctions = function() {
  for (var f in o3djs.math.rowMajor) {
    o3djs.math[f] = o3djs.math.rowMajor[f];
  }
};

/**
 * Sets each function in the namespace o3djs.math to the column major
 * version in o3djs.math.columnMajor (provided such a function exists in
 * o3djs.math.columnMajor).  Call this function to establish the column
 * major convention.
 */
o3djs.math.installColumnMajorFunctions = function() {
  for (var f in o3djs.math.columnMajor) {
    o3djs.math[f] = o3djs.math.columnMajor[f];
  }
};

/**
 * Sets each function in the namespace o3djs.math to the error checking
 * version in o3djs.math.errorCheck (provided such a function exists in
 * o3djs.math.errorCheck).
 */
o3djs.math.installErrorCheckFunctions = function() {
  for (var f in o3djs.math.errorCheck) {
    o3djs.math[f] = o3djs.math.errorCheck[f];
  }
};

/**
 * Sets each function in the namespace o3djs.math to the error checking free
 * version in o3djs.math.errorCheckFree (provided such a function exists in
 * o3djs.math.errorCheckFree).
 */
o3djs.math.installErrorCheckFreeFunctions = function() {
  for (var f in o3djs.math.errorCheckFree) {
    o3djs.math[f] = o3djs.math.errorCheckFree[f];
  }
}

// By default, install the row-major functions.
o3djs.math.installRowMajorFunctions();

// By default, install prechecking.
o3djs.math.installErrorCheckFunctions();

/*
 * Copyright 2009, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @fileoverview This file contains various functions for quaternion arithmetic
 * and converting between rotation matrices and quaternions.  It adds them to
 * the "quaternions" module on the o3djs object.  Javascript arrays with
 * four entries are used to represent quaternions, and functions are provided
 * for doing operations on those.
 *
 * Operations are done assuming quaternions are of the form:
 * q[0] + q[1]i + q[2]j + q[3]k and using the hamiltonian rules for
 * multiplication as described on Brougham Bridge:
 * i^2 = j^2 = k^2 = ijk = -1.
 *
 */

o3djs.provide('o3djs.quaternions');

/**
 * A Module for quaternion math.
 * @namespace
 */
o3djs.quaternions = o3djs.quaternions || {};

/**
 * A Quaternion.
 * @type {!Array.<number>}
 */
o3djs.quaternions.Quaterion = goog.typedef;

/**
 * Quickly determines if the object a is a scalar or a quaternion;
 * assumes that the argument is either a number (scalar), or an array of
 * numbers.
 * @param {(number|!o3djs.quaternions.Quaterion)} a A number or array the type
 *     of which is in question.
 * @return {string} Either the string 'Scalar' or 'Quaternion'.
 */
o3djs.quaternions.mathType = function(a) {
  if (typeof(a) === 'number')
    return 'Scalar';
  return 'Quaternion';
};

/**
 * Copies a quaternion.
 * @param {!o3djs.quaternions.Quaterion} q The quaternion.
 * @return {!o3djs.quaternions.Quaterion} A new quaternion identical to q.
 */
o3djs.quaternions.copy = function(q) {
  return q.slice();
};

/**
 * Negates a quaternion.
 * @param {!o3djs.quaternions.Quaterion} q The quaternion.
 * @return {!o3djs.quaternions.Quaterion} -q.
 */
o3djs.quaternions.negative = function(q) {
  return [-q[0], -q[1], -q[2], -q[3]];
};

/**
 * Adds two Quaternions.
 * @param {!o3djs.quaternions.Quaterion} a Operand Quaternion.
 * @param {!o3djs.quaternions.Quaterion} b Operand Quaternion.
 * @return {!o3djs.quaternions.Quaterion} The sum of a and b.
 */
o3djs.quaternions.addQuaternionQuaternion = function(a, b) {
  return [a[0] + b[0],
          a[1] + b[1],
          a[2] + b[2],
          a[3] + b[3]];
};

/**
 * Adds a quaternion to a scalar.
 * @param {!o3djs.quaternions.Quaterion} a Operand Quaternion.
 * @param {number} b Operand Scalar.
 * @return {!o3djs.quaternions.Quaterion} The sum of a and b.
 */
o3djs.quaternions.addQuaternionScalar = function(a, b) {
  return a.slice(0, 3).concat(a[3] + b);
};

/**
 * Adds a scalar to a quaternion.
 * @param {number} a Operand scalar.
 * @param {!o3djs.quaternions.Quaterion} b Operand quaternion.
 * @return {!o3djs.quaternions.Quaterion} The sum of a and b.
 */
o3djs.quaternions.addScalarQuaternion = function(a, b) {
  return b.slice(0, 3).concat(a + b[3]);
};

/**
 * Subtracts two quaternions.
 * @param {!o3djs.quaternions.Quaterion} a Operand quaternion.
 * @param {!o3djs.quaternions.Quaterion} b Operand quaternion.
 * @return {!o3djs.quaternions.Quaterion} The difference a - b.
 */
o3djs.quaternions.subQuaternionQuaternion = function(a, b) {
  return [a[0] - b[0],
          a[1] - b[1],
          a[2] - b[2],
          a[3] - b[3]];
};

/**
 * Subtracts a scalar from a quaternion.
 * @param {!o3djs.quaternions.Quaterion} a Operand quaternion.
 * @param {number} b Operand scalar.
 * @return {!o3djs.quaternions.Quaterion} The difference a - b.
 */
o3djs.quaternions.subQuaternionScalar = function(a, b) {
  return a.slice(0, 3).concat(a[3] - b);
};

/**
 * Subtracts a quaternion from a scalar.
 * @param {number} a Operand scalar.
 * @param {!o3djs.quaternions.Quaterion} b Operand quaternion.
 * @return {!o3djs.quaternions.Quaterion} The difference a - b.
 */
o3djs.quaternions.subScalarQuaternion = function(a, b) {
  return [-b[0], -b[1], -b[2], a - b[3]];
};

/**
 * Multiplies a scalar by a quaternion.
 * @param {number} k The scalar.
 * @param {!o3djs.quaternions.Quaternion} q The quaternion.
 * @return {!o3djs.quaternions.Quaternion} The product of k and q.
 */
o3djs.quaternions.mulScalarQuaternion = function(k, q) {
  return [k * q[0], k * q[1], k * q[2], k * q[3]];
};

/**
 * Multiplies a quaternion by a scalar.
 * @param {!o3djs.quaternions.Quaterion} q The Quaternion.
 * @param {number} k The scalar.
 * @return {!o3djs.quaternions.Quaterion} The product of k and v.
 */
o3djs.quaternions.mulQuaternionScalar = function(q, k) {
  return [k * q[0], k * q[1], k * q[2], k * q[3]];
};

/**
 * Multiplies two quaternions.
 * @param {!o3djs.quaternions.Quaterion} a Operand quaternion.
 * @param {!o3djs.quaternions.Quaterion} b Operand quaternion.
 * @return {!o3djs.quaternions.Quaterion} The quaternion product a * b.
 */
o3djs.quaternions.mulQuaternionQuaternion = function(a, b) {
  var aX = a[0];
  var aY = a[1];
  var aZ = a[2];
  var aW = a[3];
  var bX = b[0];
  var bY = b[1];
  var bZ = b[2];
  var bW = b[3];

  return [
      aW * bX + aX * bW + aY * bZ - aZ * bY,
      aW * bY + aY * bW + aZ * bX - aX * bZ,
      aW * bZ + aZ * bW + aX * bY - aY * bX,
      aW * bW - aX * bX - aY * bY - aZ * bZ];
};

/**
 * Divides two quaternions; assumes the convention that a/b = a*(1/b).
 * @param {!o3djs.quaternions.Quaterion} a Operand quaternion.
 * @param {!o3djs.quaternions.Quaterion} b Operand quaternion.
 * @return {!o3djs.quaternions.Quaterion} The quaternion quotient a / b.
 */
o3djs.quaternions.divQuaternionQuaternion = function(a, b) {
  var aX = a[0];
  var aY = a[1];
  var aZ = a[2];
  var aW = a[3];
  var bX = b[0];
  var bY = b[1];
  var bZ = b[2];
  var bW = b[3];

  var d = 1 / (bW * bW + bX * bX + bY * bY + bZ * bZ);
  return [
      (aX * bW - aW * bX - aY * bZ + aZ * bY) * d,
      (aX * bZ - aW * bY + aY * bW - aZ * bX) * d,
      (aY * bX + aZ * bW - aW * bZ - aX * bY) * d,
      (aW * bW + aX * bX + aY * bY + aZ * bZ) * d];
};

/**
 * Divides a Quaternion by a scalar.
 * @param {!o3djs.quaternions.Quaterion} q The quaternion.
 * @param {number} k The scalar.
 * @return {!o3djs.quaternions.Quaterion} q The quaternion q divided by k.
 */
o3djs.quaternions.divQuaternionScalar = function(q, k) {
  return [q[0] / k, q[1] / k, q[2] / k, q[3] / k];
};

/**
 * Divides a scalar by a quaternion.
 * @param {number} a Operand scalar.
 * @param {!o3djs.quaternions.Quaterion} b Operand quaternion.
 * @return {!o3djs.quaternions.Quaterion} The quaternion product.
 */
o3djs.quaternions.divScalarQuaternion = function(a, b) {
  var b0 = b[0];
  var b1 = b[1];
  var b2 = b[2];
  var b3 = b[3];

  var d = 1 / (b0 * b0 + b1 * b1 + b2 * b2 + b3 * b3);
  return [-a * b0 * d, -a * b1 * d, -a * b2 * d, a * b3 * d];
};

/**
 * Computes the multiplicative inverse of a quaternion.
 * @param {!o3djs.quaternions.Quaterion} q The quaternion.
 * @return {!o3djs.quaternions.Quaterion} The multiplicative inverse of q.
 */
o3djs.quaternions.inverse = function(q) {
  var q0 = q[0];
  var q1 = q[1];
  var q2 = q[2];
  var q3 = q[3];

  var d = 1 / (q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3);
  return [-q0 * d, -q1 * d, -q2 * d, q3 * d];
};

/**
 * Multiplies two objects which are either scalars or quaternions.
 * @param {(!o3djs.quaternions.Quaterion|number)} a Operand.
 * @param {(!o3djs.quaternions.Quaterion|number)} b Operand.
 * @return {(!o3djs.quaternions.Quaterion|number)} The product of a and b.
 */
o3djs.quaternions.mul = function(a, b) {
  return o3djs.quaternions['mul' + o3djs.quaternions.mathType(a) +
      o3djs.quaternions.mathType(b)](a, b);
};

/**
 * Divides two objects which are either scalars or quaternions.
 * @param {(!o3djs.quaternions.Quaterion|number)} a Operand.
 * @param {(!o3djs.quaternions.Quaterion|number)} b Operand.
 * @return {(!o3djs.quaternions.Quaterion|number)} The quotient of a and b.
 */
o3djs.quaternions.div = function(a, b) {
  return o3djs.quaternions['div' + o3djs.quaternions.mathType(a) +
      o3djs.quaternions.mathType(b)](a, b);
};

/**
 * Adds two objects which are either scalars or quaternions.
 * @param {(!o3djs.quaternions.Quaterion|number)} a Operand.
 * @param {(!o3djs.quaternions.Quaterion|number)} b Operand.
 * @return {(!o3djs.quaternions.Quaterion|number)} The sum of a and b.
 */
o3djs.quaternions.add = function(a, b) {
  return o3djs.quaternions['add' + o3djs.quaternions.mathType(a) +
      o3djs.quaternions.mathType(b)](a, b);
};

/**
 * Subtracts two objects which are either scalars or quaternions.
 * @param {(!o3djs.quaternions.Quaterion|number)} a Operand.
 * @param {(!o3djs.quaternions.Quaterion|number)} b Operand.
 * @return {(!o3djs.quaternions.Quaterion|number)} The difference of a and b.
 */
o3djs.quaternions.sub = function(a, b) {
  return o3djs.quaternions['sub' + o3djs.quaternions.mathType(a) +
      o3djs.quaternions.mathType(b)](a, b);
};

/**
 * Computes the length of a Quaternion, i.e. the square root of the
 * sum of the squares of the coefficients.
 * @param {!o3djs.quaternions.Quaterion} a The Quaternion.
 * @return {number} The length of a.
 */
o3djs.quaternions.length = function(a) {
  return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]);
};

/**
 * Computes the square of the length of a quaternion, i.e. the sum of the
 * squares of the coefficients.
 * @param {!o3djs.quaternions.Quaterion} a The quaternion.
 * @return {number} The square of the length of a.
 */
o3djs.quaternions.lengthSquared = function(a) {
  return a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3];
};

/**
 * Divides a Quaternion by its length and returns the quotient.
 * @param {!o3djs.quaternions.Quaterion} a The Quaternion.
 * @return {!o3djs.quaternions.Quaterion} A unit length quaternion pointing in
 *     the same direction as a.
 */
o3djs.quaternions.normalize = function(a) {
  var d = 1 / Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]);
  return [a[0] * d, a[1] * d, a[2] * d, a[3] * d];
};

/**
 * Computes the conjugate of the given quaternion.
 * @param {!o3djs.quaternions.Quaterion} q The quaternion.
 * @return {!o3djs.quaternions.Quaterion} The conjugate of q.
 */
o3djs.quaternions.conjugate = function(q) {
  return [-q[0], -q[1], -q[2], q[3]];
};


/**
 * Creates a quaternion which rotates around the x-axis by the given angle.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {!o3djs.quaternions.Quaterion} The quaternion.
 */
o3djs.quaternions.rotationX = function(angle) {
  return [Math.sin(angle / 2), 0, 0, Math.cos(angle / 2)];
};

/**
 * Creates a quaternion which rotates around the y-axis by the given angle.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {!o3djs.quaternions.Quaterion} The quaternion.
 */
o3djs.quaternions.rotationY = function(angle) {
  return [0, Math.sin(angle / 2), 0, Math.cos(angle / 2)];
};

/**
 * Creates a quaternion which rotates around the z-axis by the given angle.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {!o3djs.quaternions.Quaterion} The quaternion.
 */
o3djs.quaternions.rotationZ = function(angle) {
  return [0, 0, Math.sin(angle / 2), Math.cos(angle / 2)];
};

/**
 * Creates a quaternion which rotates around the given axis by the given
 * angle.
 * @param {!o3djs.math.Vector3} axis The axis about which to rotate.
 * @param {number} angle The angle by which to rotate (in radians).
 * @return {!o3djs.quaternions.Quaterion} A quaternion which rotates angle
 *     radians around the axis.
 */
o3djs.quaternions.axisRotation = function(axis, angle) {
  var d = 1 / Math.sqrt(axis[0] * axis[0] +
                        axis[1] * axis[1] +
                        axis[2] * axis[2]);
  var sin = Math.sin(angle / 2);
  var cos = Math.cos(angle / 2);
  return [sin * axis[0] * d, sin * axis[1] * d, sin * axis[2] * d, cos];
};

/**
 * Computes a 4-by-4 rotation matrix (with trivial translation component)
 * given a quaternion.  We assume the convention that to rotate a vector v by
 * a quaternion r means to express that vector as a quaternion q by letting
 * q = [v[0], v[1], v[2], 0] and then obtain the rotated vector by evaluating
 * the expression (r * q) / r.
 * @param {!o3djs.quaternions.Quaterion} q The quaternion.
 * @return {!o3djs.math.Matrix4} A 4-by-4 rotation matrix.
 */
o3djs.quaternions.quaternionToRotation = function(q) {
  var qX = q[0];
  var qY = q[1];
  var qZ = q[2];
  var qW = q[3];

  var qWqW = qW * qW;
  var qWqX = qW * qX;
  var qWqY = qW * qY;
  var qWqZ = qW * qZ;
  var qXqW = qX * qW;
  var qXqX = qX * qX;
  var qXqY = qX * qY;
  var qXqZ = qX * qZ;
  var qYqW = qY * qW;
  var qYqX = qY * qX;
  var qYqY = qY * qY;
  var qYqZ = qY * qZ;
  var qZqW = qZ * qW;
  var qZqX = qZ * qX;
  var qZqY = qZ * qY;
  var qZqZ = qZ * qZ;

  var d = qWqW + qXqX + qYqY + qZqZ;

  return [
    [(qWqW + qXqX - qYqY - qZqZ) / d,
     2 * (qWqZ + qXqY) / d,
     2 * (qXqZ - qWqY) / d, 0],
    [2 * (qXqY - qWqZ) / d,
     (qWqW - qXqX + qYqY - qZqZ) / d,
     2 * (qWqX + qYqZ) / d, 0],
    [2 * (qWqY + qXqZ) / d,
     2 * (qYqZ - qWqX) / d,
     (qWqW - qXqX - qYqY + qZqZ) / d, 0],
    [0, 0, 0, 1]];
};

/**
 * Computes a quaternion whose rotation is equivalent to the given matrix.
 * @param {(!o3djs.math.Matrix4|!o3djs.math.Matrix3)} m A 3-by-3 or 4-by-4
 *     rotation matrix.
 * @return {!o3djs.quaternions.Quaterion} A quaternion q such that
 *     quaternions.quaternionToRotation(q) is m.
 */
o3djs.quaternions.rotationToQuaternion = function(m) {
  var u;
  var v;
  var w;

  // Choose u, v, and w such that u is the index of the biggest diagonal entry
  // of m, and u v w is an even permutation of 0 1 and 2.
  if (m[0][0] > m[1][1] && m[0][0] > m[2][2]) {
    u = 0;
    v = 1;
    w = 2;
  } else if (m[1][1] > m[0][0] && m[1][1] > m[2][2]) {
    u = 1;
    v = 2;
    w = 0;
  } else {
    u = 2;
    v = 0;
    w = 1;
  }

  var r = Math.sqrt(1 + m[u][u] - m[v][v] - m[w][w]);
  var q = [];
  q[u] = 0.5 * r;
  q[v] = 0.5 * (m[v][u] + m[u][v]) / r;
  q[w] = 0.5 * (m[u][w] + m[w][u]) / r;
  q[3] = 0.5 * (m[v][w] - m[w][v]) / r;

  return q;
};


/*
 * Copyright 2009, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


/**
 * @fileoverview This file contains a class which assists with the
 * loading of GLSL shaders.
 */

o3djs.provide('o3djs.shader');

/**
 * A module for shaders.
 * @namespace
 */
o3djs.shader = o3djs.shader || {};

/**

 * Loads a shader from vertex and fragment programs specified in
 * "script" nodes in the HTML page. This provides a convenient
 * mechanism for writing GLSL snippets without the burden of
 * additional syntax like per-line quotation marks.
 * @param {!WebGLRenderingContext} gl The WebGLRenderingContext
 *     into which the shader will be loaded.
 * @param {!string} vertexScriptName The name of the HTML Script node
 *     containing the vertex program.
 * @param {!string} fragmentScriptName The name of the HTML Script node
 *     containing the fragment program.
 */
o3djs.shader.loadFromScriptNodes = function(gl,
                                            vertexScriptName,
                                            fragmentScriptName) {
  var vertexScript = document.getElementById(vertexScriptName);
  var fragmentScript = document.getElementById(fragmentScriptName);
  if (!vertexScript || !fragmentScript)
    return null;
  return new o3djs.shader.Shader(gl,
                                 vertexScript.text,
                                 fragmentScript.text);
}


/**
 * Loads text from an external file. This function is synchronous.
 * @param {string} url The url of the external file.
 * @return {string} the loaded text if the request is synchronous.
 */
o3djs.shader.loadTextFileSynchronous = function(url) {
  var error = 'loadTextFileSynchronous failed to load url "' + url + '"';
  var request;

  request = new XMLHttpRequest();
  if (request.overrideMimeType) {
    request.overrideMimeType('text/plain');
  }

  request.open('GET', url, false);
  request.send(null);
  if (request.readyState != 4) {
    throw error;
  }
  return request.responseText;
};


o3djs.shader.loadFromURL = function(gl,
                                    vertexURL,
                                    fragmentURL) {

  var vertexText = o3djs.shader.loadTextFileSynchronous(vertexURL);
  var fragmentText = o3djs.shader.loadTextFileSynchronous(fragmentURL);

  if (!vertexText || !fragmentText)
    return null;
  return new o3djs.shader.Shader(gl,
                                 vertexText,
                                 fragmentText);
}


/**
 * Helper which convers GLSL names to JavaScript names.
 * @private
 */
o3djs.shader.glslNameToJs_ = function(name) {
  return name.replace(/_(.)/g, function(_, p1) { return p1.toUpperCase(); });
}

/**
 * Creates a new Shader object, loading and linking the given vertex
 * and fragment shaders into a program.
 * @param {!WebGLRenderingContext} gl The WebGLRenderingContext
 *     into which the shader will be loaded.
 * @param {!string} vertex The vertex shader.
 * @param {!string} fragment The fragment shader.
 */
o3djs.shader.Shader = function(gl, vertex, fragment) {
  this.program = gl.createProgram();
  this.gl = gl;

  var vs = this.loadShader(this.gl.VERTEX_SHADER, vertex);
  if (vs == null) {
    return;
  }
  this.gl.attachShader(this.program, vs);
  this.gl.deleteShader(vs);

  var fs = this.loadShader(this.gl.FRAGMENT_SHADER, fragment);
  if (fs == null) {
    return;
  }
  this.gl.attachShader(this.program, fs);
  this.gl.deleteShader(fs);

  this.gl.linkProgram(this.program);
  this.gl.useProgram(this.program);

  // Check the link status
  var linked = this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS);
  if (!linked) {
    var infoLog = this.gl.getProgramInfoLog(this.program);
    output("Error linking program:\n" + infoLog);
    this.gl.deleteProgram(this.program);
    this.program = null;
    return;
  }

  // find uniforms and attributes
  var re = /(uniform|attribute)\s+\S+\s+(\S+)\s*;/g;
  var match = null;
  while ((match = re.exec(vertex + '\n' + fragment)) != null) {
    var glslName = match[2];
    var jsName = o3djs.shader.glslNameToJs_(glslName);
    var loc = -1;
    if (match[1] == "uniform") {
      this[jsName + "Loc"] = this.getUniform(glslName);
    } else if (match[1] == "attribute") {
      this[jsName + "Loc"] = this.getAttribute(glslName);
    }
    if (loc >= 0) {
      this[jsName + "Loc"] = loc;
    }
  }
}

/**
 * Binds the shader's program.
 */
o3djs.shader.Shader.prototype.bind = function() {
  this.gl.useProgram(this.program);
}

/**
 * Helper for loading a shader.
 * @private
 */
o3djs.shader.Shader.prototype.loadShader = function(type, shaderSrc) {
  var shader = this.gl.createShader(type);
  if (shader == null) {
    return null;
  }

  // Load the shader source
  this.gl.shaderSource(shader, shaderSrc);
  // Compile the shader
  this.gl.compileShader(shader);
  // Check the compile status
  if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
    var infoLog = this.gl.getShaderInfoLog(shader);
    output("Error compiling shader:\n" + infoLog);
    this.gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Helper for looking up an attribute's location.
 * @private
 */
o3djs.shader.Shader.prototype.getAttribute = function(name) {
  return this.gl.getAttribLocation(this.program, name);
};

/**
 * Helper for looking up an attribute's location.
 * @private
 */
o3djs.shader.Shader.prototype.getUniform = function(name) {
  return this.gl.getUniformLocation(this.program, name);
}
