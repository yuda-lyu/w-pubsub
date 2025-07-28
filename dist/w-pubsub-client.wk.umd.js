(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('worker_threads')) :
	typeof define === 'function' && define.amd ? define(['worker_threads'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.WPubsubClient = factory(global.worker_threads));
})(this, (function (require$$0) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var temp57qHNMCAs3lcen5WPq9uyZ7JOLIMn0QZNw = {exports: {}};

	(function (module, exports) {
	  (function (global, factory) {
	    module.exports = factory(require$$0) ;
	  })(commonjsGlobal, function (worker_threads) {

	    function getDefaultExportFromCjs(x) {
	      return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	    }
	    var eventemitter3 = {
	      exports: {}
	    };
	    (function (module) {
	      var has = Object.prototype.hasOwnProperty,
	        prefix = '~';

	      /**
	       * Constructor to create a storage for our `EE` objects.
	       * An `Events` instance is a plain object whose properties are event names.
	       *
	       * @constructor
	       * @private
	       */
	      function Events() {}

	      //
	      // We try to not inherit from `Object.prototype`. In some engines creating an
	      // instance in this way is faster than calling `Object.create(null)` directly.
	      // If `Object.create(null)` is not supported we prefix the event names with a
	      // character to make sure that the built-in object properties are not
	      // overridden or used as an attack vector.
	      //
	      if (Object.create) {
	        Events.prototype = Object.create(null);

	        //
	        // This hack is needed because the `__proto__` property is still inherited in
	        // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
	        //
	        if (!new Events().__proto__) prefix = false;
	      }

	      /**
	       * Representation of a single event listener.
	       *
	       * @param {Function} fn The listener function.
	       * @param {*} context The context to invoke the listener with.
	       * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
	       * @constructor
	       * @private
	       */
	      function EE(fn, context, once) {
	        this.fn = fn;
	        this.context = context;
	        this.once = once || false;
	      }

	      /**
	       * Add a listener for a given event.
	       *
	       * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	       * @param {(String|Symbol)} event The event name.
	       * @param {Function} fn The listener function.
	       * @param {*} context The context to invoke the listener with.
	       * @param {Boolean} once Specify if the listener is a one-time listener.
	       * @returns {EventEmitter}
	       * @private
	       */
	      function addListener(emitter, event, fn, context, once) {
	        if (typeof fn !== 'function') {
	          throw new TypeError('The listener must be a function');
	        }
	        var listener = new EE(fn, context || emitter, once),
	          evt = prefix ? prefix + event : event;
	        if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);else emitter._events[evt] = [emitter._events[evt], listener];
	        return emitter;
	      }

	      /**
	       * Clear event by name.
	       *
	       * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	       * @param {(String|Symbol)} evt The Event name.
	       * @private
	       */
	      function clearEvent(emitter, evt) {
	        if (--emitter._eventsCount === 0) emitter._events = new Events();else delete emitter._events[evt];
	      }

	      /**
	       * Minimal `EventEmitter` interface that is molded against the Node.js
	       * `EventEmitter` interface.
	       *
	       * @constructor
	       * @public
	       */
	      function EventEmitter() {
	        this._events = new Events();
	        this._eventsCount = 0;
	      }

	      /**
	       * Return an array listing the events for which the emitter has registered
	       * listeners.
	       *
	       * @returns {Array}
	       * @public
	       */
	      EventEmitter.prototype.eventNames = function eventNames() {
	        var names = [],
	          events,
	          name;
	        if (this._eventsCount === 0) return names;
	        for (name in events = this._events) {
	          if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
	        }
	        if (Object.getOwnPropertySymbols) {
	          return names.concat(Object.getOwnPropertySymbols(events));
	        }
	        return names;
	      };

	      /**
	       * Return the listeners registered for a given event.
	       *
	       * @param {(String|Symbol)} event The event name.
	       * @returns {Array} The registered listeners.
	       * @public
	       */
	      EventEmitter.prototype.listeners = function listeners(event) {
	        var evt = prefix ? prefix + event : event,
	          handlers = this._events[evt];
	        if (!handlers) return [];
	        if (handlers.fn) return [handlers.fn];
	        for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
	          ee[i] = handlers[i].fn;
	        }
	        return ee;
	      };

	      /**
	       * Return the number of listeners listening to a given event.
	       *
	       * @param {(String|Symbol)} event The event name.
	       * @returns {Number} The number of listeners.
	       * @public
	       */
	      EventEmitter.prototype.listenerCount = function listenerCount(event) {
	        var evt = prefix ? prefix + event : event,
	          listeners = this._events[evt];
	        if (!listeners) return 0;
	        if (listeners.fn) return 1;
	        return listeners.length;
	      };

	      /**
	       * Calls each of the listeners registered for a given event.
	       *
	       * @param {(String|Symbol)} event The event name.
	       * @returns {Boolean} `true` if the event had listeners, else `false`.
	       * @public
	       */
	      EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
	        var evt = prefix ? prefix + event : event;
	        if (!this._events[evt]) return false;
	        var listeners = this._events[evt],
	          len = arguments.length,
	          args,
	          i;
	        if (listeners.fn) {
	          if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);
	          switch (len) {
	            case 1:
	              return listeners.fn.call(listeners.context), true;
	            case 2:
	              return listeners.fn.call(listeners.context, a1), true;
	            case 3:
	              return listeners.fn.call(listeners.context, a1, a2), true;
	            case 4:
	              return listeners.fn.call(listeners.context, a1, a2, a3), true;
	            case 5:
	              return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
	            case 6:
	              return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
	          }
	          for (i = 1, args = new Array(len - 1); i < len; i++) {
	            args[i - 1] = arguments[i];
	          }
	          listeners.fn.apply(listeners.context, args);
	        } else {
	          var length = listeners.length,
	            j;
	          for (i = 0; i < length; i++) {
	            if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);
	            switch (len) {
	              case 1:
	                listeners[i].fn.call(listeners[i].context);
	                break;
	              case 2:
	                listeners[i].fn.call(listeners[i].context, a1);
	                break;
	              case 3:
	                listeners[i].fn.call(listeners[i].context, a1, a2);
	                break;
	              case 4:
	                listeners[i].fn.call(listeners[i].context, a1, a2, a3);
	                break;
	              default:
	                if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
	                  args[j - 1] = arguments[j];
	                }
	                listeners[i].fn.apply(listeners[i].context, args);
	            }
	          }
	        }
	        return true;
	      };

	      /**
	       * Add a listener for a given event.
	       *
	       * @param {(String|Symbol)} event The event name.
	       * @param {Function} fn The listener function.
	       * @param {*} [context=this] The context to invoke the listener with.
	       * @returns {EventEmitter} `this`.
	       * @public
	       */
	      EventEmitter.prototype.on = function on(event, fn, context) {
	        return addListener(this, event, fn, context, false);
	      };

	      /**
	       * Add a one-time listener for a given event.
	       *
	       * @param {(String|Symbol)} event The event name.
	       * @param {Function} fn The listener function.
	       * @param {*} [context=this] The context to invoke the listener with.
	       * @returns {EventEmitter} `this`.
	       * @public
	       */
	      EventEmitter.prototype.once = function once(event, fn, context) {
	        return addListener(this, event, fn, context, true);
	      };

	      /**
	       * Remove the listeners of a given event.
	       *
	       * @param {(String|Symbol)} event The event name.
	       * @param {Function} fn Only remove the listeners that match this function.
	       * @param {*} context Only remove the listeners that have this context.
	       * @param {Boolean} once Only remove one-time listeners.
	       * @returns {EventEmitter} `this`.
	       * @public
	       */
	      EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
	        var evt = prefix ? prefix + event : event;
	        if (!this._events[evt]) return this;
	        if (!fn) {
	          clearEvent(this, evt);
	          return this;
	        }
	        var listeners = this._events[evt];
	        if (listeners.fn) {
	          if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
	            clearEvent(this, evt);
	          }
	        } else {
	          for (var i = 0, events = [], length = listeners.length; i < length; i++) {
	            if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
	              events.push(listeners[i]);
	            }
	          }

	          //
	          // Reset the array, or remove it completely if we have no more listeners.
	          //
	          if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;else clearEvent(this, evt);
	        }
	        return this;
	      };

	      /**
	       * Remove all listeners, or those of the specified event.
	       *
	       * @param {(String|Symbol)} [event] The event name.
	       * @returns {EventEmitter} `this`.
	       * @public
	       */
	      EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
	        var evt;
	        if (event) {
	          evt = prefix ? prefix + event : event;
	          if (this._events[evt]) clearEvent(this, evt);
	        } else {
	          this._events = new Events();
	          this._eventsCount = 0;
	        }
	        return this;
	      };

	      //
	      // Alias methods names because people roll like that.
	      //
	      EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	      EventEmitter.prototype.addListener = EventEmitter.prototype.on;

	      //
	      // Expose the prefix.
	      //
	      EventEmitter.prefixed = prefix;

	      //
	      // Allow `EventEmitter` to be imported as module namespace.
	      //
	      EventEmitter.EventEmitter = EventEmitter;

	      //
	      // Expose the module.
	      //
	      {
	        module.exports = EventEmitter;
	      }
	    })(eventemitter3);
	    var eventemitter3Exports = eventemitter3.exports;
	    var EventEmitter = /*@__PURE__*/getDefaultExportFromCjs(eventemitter3Exports);
	    function isWindow() {
	      return typeof window !== 'undefined' && typeof window.document !== 'undefined';
	    }

	    //ww
	    let ww;
	    function protectShell() {
	      //cEnv
	      let cEnv = isWindow() ? 'browser' : 'nodejs';

	      //check, 後續會有Nodejs或瀏覽器依賴的API例如window.atob或Buffer, 於import階段時就先行偵測跳出
	      if (cEnv !== 'nodejs') {
	        return null;
	      }
	      function evem() {
	        return new EventEmitter();
	      }
	      function genPm() {
	        let resolve;
	        let reject;
	        let p = new Promise(function () {
	          resolve = arguments[0];
	          reject = arguments[1];
	        });
	        p.resolve = resolve;
	        p.reject = reject;
	        return p;
	      }
	      function genID() {
	        let len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
	        let uuid = [];
	        let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	        let radix = chars.length;
	        for (let i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
	        let r = uuid.join('');
	        return r;
	      }
	      function b642str(b64) {
	        //return b64
	        return Buffer.from(b64, 'base64').toString('utf8'); //Nodejs端使用Buffer解碼 
	      }

	      //codeShow

	      //codeB64, 此處需提供worker執行程式碼, 因有特殊符號轉譯困難, 故需先轉base64再使用
	      let codeB64 = `CgogICAgICAgIC8vaW1wb3J0IHsgcGFyZW50UG9ydCB9IGZyb20gJ3dvcmtlcl90aHJlYWRzJwogICAgICAgIGxldCB7IHBhcmVudFBvcnQgfSA9IHJlcXVpcmUoJ3dvcmtlcl90aHJlYWRzJykgLy/lm6BwYWNrYWdlLmpzb27kuI3ntaZ0eXBlPW1vZHVsZeaVheeEoeazleaUr+aPtGVzNiBpbXBvcnQsIOW+l+S9v+eUqHJlcXVpcmUKICAgICAgICAvL+iLpeimgeaWvG5vZGVqcyB3b3JrZXLlhafkvb/nlKjnhKHms5XovYnora/nmoTljp/nlJ/lpZfku7bkvovlpoJmcywg6YG/5YWN5L2/55So6aCC5bGkaW1wb3J05Yqg6LyJ5L2/55SoLCDlm6DnhKHms5XovYnora/mnIPnm7TmjqXkv53nlZkKICAgICAgICAvL+S4puWboGltcG9ydOS9jeaWvHdvcmtlcuWkluWxpOmZkOWumueCunJlcXVpcmXljYAocGFja2FnZS5qc29u5LiN57WmdHlwZT1tb2R1bGUpLCDmlYXlh7rnj77pjK/oqqTnhKHms5XovYnora8KICAgICAgICAKCid1c2Ugc3RyaWN0JzsKCnZhciBtcXR0ID0gcmVxdWlyZSgnbXF0dCcpOwoKLyoqCiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuCiAqCiAqIEBzdGF0aWMKICogQG1lbWJlck9mIF8KICogQHNpbmNlIDAuMS4wCiAqIEBjYXRlZ29yeSBMYW5nCiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLgogKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSwgZWxzZSBgZmFsc2VgLgogKiBAZXhhbXBsZQogKgogKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTsKICogLy8gPT4gdHJ1ZQogKgogKiBfLmlzQXJyYXkoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7CiAqIC8vID0+IGZhbHNlCiAqCiAqIF8uaXNBcnJheSgnYWJjJyk7CiAqIC8vID0+IGZhbHNlCiAqCiAqIF8uaXNBcnJheShfLm5vb3ApOwogKiAvLyA9PiBmYWxzZQogKi8KdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5Owp2YXIgaXNBcnJheSQxID0gaXNBcnJheTsKCi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovCnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDsKdmFyIGZyZWVHbG9iYWwkMSA9IGZyZWVHbG9iYWw7CgovKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqLwp2YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjsKCi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqLwp2YXIgcm9vdCA9IGZyZWVHbG9iYWwkMSB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpOwp2YXIgcm9vdCQxID0gcm9vdDsKCi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqLwp2YXIgU3ltYm9sID0gcm9vdCQxLlN5bWJvbDsKdmFyIFN5bWJvbCQxID0gU3ltYm9sOwoKLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqLwp2YXIgb2JqZWN0UHJvdG8kNCA9IE9iamVjdC5wcm90b3R5cGU7CgovKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi8KdmFyIGhhc093blByb3BlcnR5JDMgPSBvYmplY3RQcm90byQ0Lmhhc093blByb3BlcnR5OwoKLyoqCiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUKICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpCiAqIG9mIHZhbHVlcy4KICovCnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyQxID0gb2JqZWN0UHJvdG8kNC50b1N0cmluZzsKCi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqLwp2YXIgc3ltVG9TdHJpbmdUYWckMSA9IFN5bWJvbCQxID8gU3ltYm9sJDEudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7CgovKioKICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuCiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLgogKi8KZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7CiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkkMy5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyQxKSwKICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnJDFdOwogIHRyeSB7CiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZyQxXSA9IHVuZGVmaW5lZDsKICAgIHZhciB1bm1hc2tlZCA9IHRydWU7CiAgfSBjYXRjaCAoZSkge30KICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmckMS5jYWxsKHZhbHVlKTsKICBpZiAodW5tYXNrZWQpIHsKICAgIGlmIChpc093bikgewogICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZyQxXSA9IHRhZzsKICAgIH0gZWxzZSB7CiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZyQxXTsKICAgIH0KICB9CiAgcmV0dXJuIHJlc3VsdDsKfQoKLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqLwp2YXIgb2JqZWN0UHJvdG8kMyA9IE9iamVjdC5wcm90b3R5cGU7CgovKioKICogVXNlZCB0byByZXNvbHZlIHRoZQogKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZykKICogb2YgdmFsdWVzLgogKi8KdmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8kMy50b1N0cmluZzsKCi8qKgogKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC4KICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy4KICovCmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7CiAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpOwp9CgovKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovCnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLAogIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nOwoKLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovCnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCQxID8gU3ltYm9sJDEudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7CgovKioKICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldFRhZ2Agd2l0aG91dCBmYWxsYmFja3MgZm9yIGJ1Z2d5IGVudmlyb25tZW50cy4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuCiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuCiAqLwpmdW5jdGlvbiBiYXNlR2V0VGFnKHZhbHVlKSB7CiAgaWYgKHZhbHVlID09IG51bGwpIHsKICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZzsKICB9CiAgcmV0dXJuIHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkgPyBnZXRSYXdUYWcodmFsdWUpIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpOwp9CgovKioKICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgCiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgIm9iamVjdCIuCiAqCiAqIEBzdGF0aWMKICogQG1lbWJlck9mIF8KICogQHNpbmNlIDQuMC4wCiAqIEBjYXRlZ29yeSBMYW5nCiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLgogKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLgogKiBAZXhhbXBsZQogKgogKiBfLmlzT2JqZWN0TGlrZSh7fSk7CiAqIC8vID0+IHRydWUKICoKICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTsKICogLy8gPT4gdHJ1ZQogKgogKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApOwogKiAvLyA9PiBmYWxzZQogKgogKiBfLmlzT2JqZWN0TGlrZShudWxsKTsKICogLy8gPT4gZmFsc2UKICovCmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkgewogIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JzsKfQoKLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqLwp2YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7CgovKioKICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuCiAqCiAqIEBzdGF0aWMKICogQG1lbWJlck9mIF8KICogQHNpbmNlIDQuMC4wCiAqIEBjYXRlZ29yeSBMYW5nCiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLgogKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLgogKiBAZXhhbXBsZQogKgogKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7CiAqIC8vID0+IHRydWUKICoKICogXy5pc1N5bWJvbCgnYWJjJyk7CiAqIC8vID0+IGZhbHNlCiAqLwpmdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkgewogIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHwgaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBzeW1ib2xUYWc7Cn0KCi8qKiBVc2VkIHRvIG1hdGNoIHByb3BlcnR5IG5hbWVzIHdpdGhpbiBwcm9wZXJ0eSBwYXRocy4gKi8KdmFyIHJlSXNEZWVwUHJvcCA9IC9cLnxcWyg/OlteW1xdXSp8KFsiJ10pKD86KD8hXDEpW15cXF18XFwuKSo/XDEpXF0vLAogIHJlSXNQbGFpblByb3AgPSAvXlx3KiQvOwoKLyoqCiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgcHJvcGVydHkgbmFtZSBhbmQgbm90IGEgcHJvcGVydHkgcGF0aC4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suCiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5IGtleXMgb24uCiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcHJvcGVydHkgbmFtZSwgZWxzZSBgZmFsc2VgLgogKi8KZnVuY3Rpb24gaXNLZXkodmFsdWUsIG9iamVjdCkgewogIGlmIChpc0FycmF5JDEodmFsdWUpKSB7CiAgICByZXR1cm4gZmFsc2U7CiAgfQogIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlOwogIGlmICh0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicgfHwgdmFsdWUgPT0gbnVsbCB8fCBpc1N5bWJvbCh2YWx1ZSkpIHsKICAgIHJldHVybiB0cnVlOwogIH0KICByZXR1cm4gcmVJc1BsYWluUHJvcC50ZXN0KHZhbHVlKSB8fCAhcmVJc0RlZXBQcm9wLnRlc3QodmFsdWUpIHx8IG9iamVjdCAhPSBudWxsICYmIHZhbHVlIGluIE9iamVjdChvYmplY3QpOwp9CgovKioKICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlCiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcykKICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKQogKgogKiBAc3RhdGljCiAqIEBtZW1iZXJPZiBfCiAqIEBzaW5jZSAwLjEuMAogKiBAY2F0ZWdvcnkgTGFuZwogKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay4KICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuCiAqIEBleGFtcGxlCiAqCiAqIF8uaXNPYmplY3Qoe30pOwogKiAvLyA9PiB0cnVlCiAqCiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTsKICogLy8gPT4gdHJ1ZQogKgogKiBfLmlzT2JqZWN0KF8ubm9vcCk7CiAqIC8vID0+IHRydWUKICoKICogXy5pc09iamVjdChudWxsKTsKICogLy8gPT4gZmFsc2UKICovCmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7CiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7CiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTsKfQoKLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqLwp2YXIgYXN5bmNUYWcgPSAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScsCiAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsCiAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJywKICBwcm94eVRhZyA9ICdbb2JqZWN0IFByb3h5XSc7CgovKioKICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LgogKgogKiBAc3RhdGljCiAqIEBtZW1iZXJPZiBfCiAqIEBzaW5jZSAwLjEuMAogKiBAY2F0ZWdvcnkgTGFuZwogKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay4KICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLgogKiBAZXhhbXBsZQogKgogKiBfLmlzRnVuY3Rpb24oXyk7CiAqIC8vID0+IHRydWUKICoKICogXy5pc0Z1bmN0aW9uKC9hYmMvKTsKICogLy8gPT4gZmFsc2UKICovCmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHsKICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkgewogICAgcmV0dXJuIGZhbHNlOwogIH0KICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3IKICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheXMgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy4KICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7CiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWcgfHwgdGFnID09IGFzeW5jVGFnIHx8IHRhZyA9PSBwcm94eVRhZzsKfQoKLyoqIFVzZWQgdG8gZGV0ZWN0IG92ZXJyZWFjaGluZyBjb3JlLWpzIHNoaW1zLiAqLwp2YXIgY29yZUpzRGF0YSA9IHJvb3QkMVsnX19jb3JlLWpzX3NoYXJlZF9fJ107CnZhciBjb3JlSnNEYXRhJDEgPSBjb3JlSnNEYXRhOwoKLyoqIFVzZWQgdG8gZGV0ZWN0IG1ldGhvZHMgbWFzcXVlcmFkaW5nIGFzIG5hdGl2ZS4gKi8KdmFyIG1hc2tTcmNLZXkgPSBmdW5jdGlvbiAoKSB7CiAgdmFyIHVpZCA9IC9bXi5dKyQvLmV4ZWMoY29yZUpzRGF0YSQxICYmIGNvcmVKc0RhdGEkMS5rZXlzICYmIGNvcmVKc0RhdGEkMS5rZXlzLklFX1BST1RPIHx8ICcnKTsKICByZXR1cm4gdWlkID8gJ1N5bWJvbChzcmMpXzEuJyArIHVpZCA6ICcnOwp9KCk7CgovKioKICogQ2hlY2tzIGlmIGBmdW5jYCBoYXMgaXRzIHNvdXJjZSBtYXNrZWQuCiAqCiAqIEBwcml2YXRlCiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrLgogKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGZ1bmNgIGlzIG1hc2tlZCwgZWxzZSBgZmFsc2VgLgogKi8KZnVuY3Rpb24gaXNNYXNrZWQoZnVuYykgewogIHJldHVybiAhIW1hc2tTcmNLZXkgJiYgbWFza1NyY0tleSBpbiBmdW5jOwp9CgovKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovCnZhciBmdW5jUHJvdG8kMSA9IEZ1bmN0aW9uLnByb3RvdHlwZTsKCi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi8KdmFyIGZ1bmNUb1N0cmluZyQxID0gZnVuY1Byb3RvJDEudG9TdHJpbmc7CgovKioKICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY29udmVydC4KICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuCiAqLwpmdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7CiAgaWYgKGZ1bmMgIT0gbnVsbCkgewogICAgdHJ5IHsKICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZyQxLmNhbGwoZnVuYyk7CiAgICB9IGNhdGNoIChlKSB7fQogICAgdHJ5IHsKICAgICAgcmV0dXJuIGZ1bmMgKyAnJzsKICAgIH0gY2F0Y2ggKGUpIHt9CiAgfQogIHJldHVybiAnJzsKfQoKLyoqCiAqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGAKICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wYXR0ZXJucykuCiAqLwp2YXIgcmVSZWdFeHBDaGFyID0gL1tcXF4kLiorPygpW1xde318XS9nOwoKLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqLwp2YXIgcmVJc0hvc3RDdG9yID0gL15cW29iamVjdCAuKz9Db25zdHJ1Y3RvclxdJC87CgovKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovCnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsCiAgb2JqZWN0UHJvdG8kMiA9IE9iamVjdC5wcm90b3R5cGU7CgovKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovCnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7CgovKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi8KdmFyIGhhc093blByb3BlcnR5JDIgPSBvYmplY3RQcm90byQyLmhhc093blByb3BlcnR5OwoKLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi8KdmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICsgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkkMikucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXCQmJykucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXCgpfCBmb3IgLis/KD89XFxcXSkvZywgJyQxLio/JykgKyAnJCcpOwoKLyoqCiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmF0aXZlYCB3aXRob3V0IGJhZCBzaGltIGNoZWNrcy4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suCiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLAogKiAgZWxzZSBgZmFsc2VgLgogKi8KZnVuY3Rpb24gYmFzZUlzTmF0aXZlKHZhbHVlKSB7CiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgaXNNYXNrZWQodmFsdWUpKSB7CiAgICByZXR1cm4gZmFsc2U7CiAgfQogIHZhciBwYXR0ZXJuID0gaXNGdW5jdGlvbih2YWx1ZSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yOwogIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTsKfQoKLyoqCiAqIEdldHMgdGhlIHZhbHVlIGF0IGBrZXlgIG9mIGBvYmplY3RgLgogKgogKiBAcHJpdmF0ZQogKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS4KICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuCiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZS4KICovCmZ1bmN0aW9uIGdldFZhbHVlKG9iamVjdCwga2V5KSB7CiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07Cn0KCi8qKgogKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuCiAqCiAqIEBwcml2YXRlCiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS4KICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LgogKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuCiAqLwpmdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHsKICB2YXIgdmFsdWUgPSBnZXRWYWx1ZShvYmplY3QsIGtleSk7CiAgcmV0dXJuIGJhc2VJc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDsKfQoKLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqLwp2YXIgbmF0aXZlQ3JlYXRlID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2NyZWF0ZScpOwp2YXIgbmF0aXZlQ3JlYXRlJDEgPSBuYXRpdmVDcmVhdGU7CgovKioKICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgaGFzaC4KICoKICogQHByaXZhdGUKICogQG5hbWUgY2xlYXIKICogQG1lbWJlck9mIEhhc2gKICovCmZ1bmN0aW9uIGhhc2hDbGVhcigpIHsKICB0aGlzLl9fZGF0YV9fID0gbmF0aXZlQ3JlYXRlJDEgPyBuYXRpdmVDcmVhdGUkMShudWxsKSA6IHt9OwogIHRoaXMuc2l6ZSA9IDA7Cn0KCi8qKgogKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgaGFzaC4KICoKICogQHByaXZhdGUKICogQG5hbWUgZGVsZXRlCiAqIEBtZW1iZXJPZiBIYXNoCiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS4KICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuCiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC4KICovCmZ1bmN0aW9uIGhhc2hEZWxldGUoa2V5KSB7CiAgdmFyIHJlc3VsdCA9IHRoaXMuaGFzKGtleSkgJiYgZGVsZXRlIHRoaXMuX19kYXRhX19ba2V5XTsKICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7CiAgcmV0dXJuIHJlc3VsdDsKfQoKLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqLwp2YXIgSEFTSF9VTkRFRklORUQkMSA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJzsKCi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi8KdmFyIG9iamVjdFByb3RvJDEgPSBPYmplY3QucHJvdG90eXBlOwoKLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovCnZhciBoYXNPd25Qcm9wZXJ0eSQxID0gb2JqZWN0UHJvdG8kMS5oYXNPd25Qcm9wZXJ0eTsKCi8qKgogKiBHZXRzIHRoZSBoYXNoIHZhbHVlIGZvciBga2V5YC4KICoKICogQHByaXZhdGUKICogQG5hbWUgZ2V0CiAqIEBtZW1iZXJPZiBIYXNoCiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LgogKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuCiAqLwpmdW5jdGlvbiBoYXNoR2V0KGtleSkgewogIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXzsKICBpZiAobmF0aXZlQ3JlYXRlJDEpIHsKICAgIHZhciByZXN1bHQgPSBkYXRhW2tleV07CiAgICByZXR1cm4gcmVzdWx0ID09PSBIQVNIX1VOREVGSU5FRCQxID8gdW5kZWZpbmVkIDogcmVzdWx0OwogIH0KICByZXR1cm4gaGFzT3duUHJvcGVydHkkMS5jYWxsKGRhdGEsIGtleSkgPyBkYXRhW2tleV0gOiB1bmRlZmluZWQ7Cn0KCi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi8KdmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTsKCi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqLwp2YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTsKCi8qKgogKiBDaGVja3MgaWYgYSBoYXNoIHZhbHVlIGZvciBga2V5YCBleGlzdHMuCiAqCiAqIEBwcml2YXRlCiAqIEBuYW1lIGhhcwogKiBAbWVtYmVyT2YgSGFzaAogKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLgogKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLgogKi8KZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHsKICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187CiAgcmV0dXJuIG5hdGl2ZUNyZWF0ZSQxID8gZGF0YVtrZXldICE9PSB1bmRlZmluZWQgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSk7Cn0KCi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi8KdmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nOwoKLyoqCiAqIFNldHMgdGhlIGhhc2ggYGtleWAgdG8gYHZhbHVlYC4KICoKICogQHByaXZhdGUKICogQG5hbWUgc2V0CiAqIEBtZW1iZXJPZiBIYXNoCiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LgogKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuCiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGhhc2ggaW5zdGFuY2UuCiAqLwpmdW5jdGlvbiBoYXNoU2V0KGtleSwgdmFsdWUpIHsKICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187CiAgdGhpcy5zaXplICs9IHRoaXMuaGFzKGtleSkgPyAwIDogMTsKICBkYXRhW2tleV0gPSBuYXRpdmVDcmVhdGUkMSAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gSEFTSF9VTkRFRklORUQgOiB2YWx1ZTsKICByZXR1cm4gdGhpczsKfQoKLyoqCiAqIENyZWF0ZXMgYSBoYXNoIG9iamVjdC4KICoKICogQHByaXZhdGUKICogQGNvbnN0cnVjdG9yCiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLgogKi8KZnVuY3Rpb24gSGFzaChlbnRyaWVzKSB7CiAgdmFyIGluZGV4ID0gLTEsCiAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7CiAgdGhpcy5jbGVhcigpOwogIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7CiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTsKICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7CiAgfQp9CgovLyBBZGQgbWV0aG9kcyB0byBgSGFzaGAuCkhhc2gucHJvdG90eXBlLmNsZWFyID0gaGFzaENsZWFyOwpIYXNoLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBoYXNoRGVsZXRlOwpIYXNoLnByb3RvdHlwZS5nZXQgPSBoYXNoR2V0OwpIYXNoLnByb3RvdHlwZS5oYXMgPSBoYXNoSGFzOwpIYXNoLnByb3RvdHlwZS5zZXQgPSBoYXNoU2V0OwoKLyoqCiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGxpc3QgY2FjaGUuCiAqCiAqIEBwcml2YXRlCiAqIEBuYW1lIGNsZWFyCiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGUKICovCmZ1bmN0aW9uIGxpc3RDYWNoZUNsZWFyKCkgewogIHRoaXMuX19kYXRhX18gPSBbXTsKICB0aGlzLnNpemUgPSAwOwp9CgovKioKICogUGVyZm9ybXMgYQogKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKQogKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC4KICoKICogQHN0YXRpYwogKiBAbWVtYmVyT2YgXwogKiBAc2luY2UgNC4wLjAKICogQGNhdGVnb3J5IExhbmcKICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS4KICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS4KICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC4KICogQGV4YW1wbGUKICoKICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07CiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07CiAqCiAqIF8uZXEob2JqZWN0LCBvYmplY3QpOwogKiAvLyA9PiB0cnVlCiAqCiAqIF8uZXEob2JqZWN0LCBvdGhlcik7CiAqIC8vID0+IGZhbHNlCiAqCiAqIF8uZXEoJ2EnLCAnYScpOwogKiAvLyA9PiB0cnVlCiAqCiAqIF8uZXEoJ2EnLCBPYmplY3QoJ2EnKSk7CiAqIC8vID0+IGZhbHNlCiAqCiAqIF8uZXEoTmFOLCBOYU4pOwogKiAvLyA9PiB0cnVlCiAqLwpmdW5jdGlvbiBlcSh2YWx1ZSwgb3RoZXIpIHsKICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8IHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXI7Cn0KCi8qKgogKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgYGtleWAgaXMgZm91bmQgaW4gYGFycmF5YCBvZiBrZXktdmFsdWUgcGFpcnMuCiAqCiAqIEBwcml2YXRlCiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LgogKiBAcGFyYW0geyp9IGtleSBUaGUga2V5IHRvIHNlYXJjaCBmb3IuCiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuCiAqLwpmdW5jdGlvbiBhc3NvY0luZGV4T2YoYXJyYXksIGtleSkgewogIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7CiAgd2hpbGUgKGxlbmd0aC0tKSB7CiAgICBpZiAoZXEoYXJyYXlbbGVuZ3RoXVswXSwga2V5KSkgewogICAgICByZXR1cm4gbGVuZ3RoOwogICAgfQogIH0KICByZXR1cm4gLTE7Cn0KCi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi8KdmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7CgovKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi8KdmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlOwoKLyoqCiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBsaXN0IGNhY2hlLgogKgogKiBAcHJpdmF0ZQogKiBAbmFtZSBkZWxldGUKICogQG1lbWJlck9mIExpc3RDYWNoZQogKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS4KICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLgogKi8KZnVuY3Rpb24gbGlzdENhY2hlRGVsZXRlKGtleSkgewogIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXywKICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7CiAgaWYgKGluZGV4IDwgMCkgewogICAgcmV0dXJuIGZhbHNlOwogIH0KICB2YXIgbGFzdEluZGV4ID0gZGF0YS5sZW5ndGggLSAxOwogIGlmIChpbmRleCA9PSBsYXN0SW5kZXgpIHsKICAgIGRhdGEucG9wKCk7CiAgfSBlbHNlIHsKICAgIHNwbGljZS5jYWxsKGRhdGEsIGluZGV4LCAxKTsKICB9CiAgLS10aGlzLnNpemU7CiAgcmV0dXJuIHRydWU7Cn0KCi8qKgogKiBHZXRzIHRoZSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YC4KICoKICogQHByaXZhdGUKICogQG5hbWUgZ2V0CiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGUKICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuCiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS4KICovCmZ1bmN0aW9uIGxpc3RDYWNoZUdldChrZXkpIHsKICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sCiAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpOwogIHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiBkYXRhW2luZGV4XVsxXTsKfQoKLyoqCiAqIENoZWNrcyBpZiBhIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy4KICoKICogQHByaXZhdGUKICogQG5hbWUgaGFzCiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGUKICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay4KICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC4KICovCmZ1bmN0aW9uIGxpc3RDYWNoZUhhcyhrZXkpIHsKICByZXR1cm4gYXNzb2NJbmRleE9mKHRoaXMuX19kYXRhX18sIGtleSkgPiAtMTsKfQoKLyoqCiAqIFNldHMgdGhlIGxpc3QgY2FjaGUgYGtleWAgdG8gYHZhbHVlYC4KICoKICogQHByaXZhdGUKICogQG5hbWUgc2V0CiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGUKICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuCiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC4KICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbGlzdCBjYWNoZSBpbnN0YW5jZS4KICovCmZ1bmN0aW9uIGxpc3RDYWNoZVNldChrZXksIHZhbHVlKSB7CiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLAogICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTsKICBpZiAoaW5kZXggPCAwKSB7CiAgICArK3RoaXMuc2l6ZTsKICAgIGRhdGEucHVzaChba2V5LCB2YWx1ZV0pOwogIH0gZWxzZSB7CiAgICBkYXRhW2luZGV4XVsxXSA9IHZhbHVlOwogIH0KICByZXR1cm4gdGhpczsKfQoKLyoqCiAqIENyZWF0ZXMgYW4gbGlzdCBjYWNoZSBvYmplY3QuCiAqCiAqIEBwcml2YXRlCiAqIEBjb25zdHJ1Y3RvcgogKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS4KICovCmZ1bmN0aW9uIExpc3RDYWNoZShlbnRyaWVzKSB7CiAgdmFyIGluZGV4ID0gLTEsCiAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7CiAgdGhpcy5jbGVhcigpOwogIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7CiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTsKICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7CiAgfQp9CgovLyBBZGQgbWV0aG9kcyB0byBgTGlzdENhY2hlYC4KTGlzdENhY2hlLnByb3RvdHlwZS5jbGVhciA9IGxpc3RDYWNoZUNsZWFyOwpMaXN0Q2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IGxpc3RDYWNoZURlbGV0ZTsKTGlzdENhY2hlLnByb3RvdHlwZS5nZXQgPSBsaXN0Q2FjaGVHZXQ7Ckxpc3RDYWNoZS5wcm90b3R5cGUuaGFzID0gbGlzdENhY2hlSGFzOwpMaXN0Q2FjaGUucHJvdG90eXBlLnNldCA9IGxpc3RDYWNoZVNldDsKCi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi8KdmFyIE1hcCA9IGdldE5hdGl2ZShyb290JDEsICdNYXAnKTsKdmFyIE1hcCQxID0gTWFwOwoKLyoqCiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC4KICoKICogQHByaXZhdGUKICogQG5hbWUgY2xlYXIKICogQG1lbWJlck9mIE1hcENhY2hlCiAqLwpmdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkgewogIHRoaXMuc2l6ZSA9IDA7CiAgdGhpcy5fX2RhdGFfXyA9IHsKICAgICdoYXNoJzogbmV3IEhhc2goKSwKICAgICdtYXAnOiBuZXcgKE1hcCQxIHx8IExpc3RDYWNoZSkoKSwKICAgICdzdHJpbmcnOiBuZXcgSGFzaCgpCiAgfTsKfQoKLyoqCiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuCiAqCiAqIEBwcml2YXRlCiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLgogKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSwgZWxzZSBgZmFsc2VgLgogKi8KZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7CiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7CiAgcmV0dXJuIHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nID8gdmFsdWUgIT09ICdfX3Byb3RvX18nIDogdmFsdWUgPT09IG51bGw7Cn0KCi8qKgogKiBHZXRzIHRoZSBkYXRhIGZvciBgbWFwYC4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIHF1ZXJ5LgogKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSByZWZlcmVuY2Uga2V5LgogKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWFwIGRhdGEuCiAqLwpmdW5jdGlvbiBnZXRNYXBEYXRhKG1hcCwga2V5KSB7CiAgdmFyIGRhdGEgPSBtYXAuX19kYXRhX187CiAgcmV0dXJuIGlzS2V5YWJsZShrZXkpID8gZGF0YVt0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8gJ3N0cmluZycgOiAnaGFzaCddIDogZGF0YS5tYXA7Cn0KCi8qKgogKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbWFwLgogKgogKiBAcHJpdmF0ZQogKiBAbmFtZSBkZWxldGUKICogQG1lbWJlck9mIE1hcENhY2hlCiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLgogKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuCiAqLwpmdW5jdGlvbiBtYXBDYWNoZURlbGV0ZShrZXkpIHsKICB2YXIgcmVzdWx0ID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpWydkZWxldGUnXShrZXkpOwogIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDsKICByZXR1cm4gcmVzdWx0Owp9CgovKioKICogR2V0cyB0aGUgbWFwIHZhbHVlIGZvciBga2V5YC4KICoKICogQHByaXZhdGUKICogQG5hbWUgZ2V0CiAqIEBtZW1iZXJPZiBNYXBDYWNoZQogKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC4KICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLgogKi8KZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7CiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5nZXQoa2V5KTsKfQoKLyoqCiAqIENoZWNrcyBpZiBhIG1hcCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLgogKgogKiBAcHJpdmF0ZQogKiBAbmFtZSBoYXMKICogQG1lbWJlck9mIE1hcENhY2hlCiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suCiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuCiAqLwpmdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHsKICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmhhcyhrZXkpOwp9CgovKioKICogU2V0cyB0aGUgbWFwIGBrZXlgIHRvIGB2YWx1ZWAuCiAqCiAqIEBwcml2YXRlCiAqIEBuYW1lIHNldAogKiBAbWVtYmVyT2YgTWFwQ2FjaGUKICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuCiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC4KICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbWFwIGNhY2hlIGluc3RhbmNlLgogKi8KZnVuY3Rpb24gbWFwQ2FjaGVTZXQoa2V5LCB2YWx1ZSkgewogIHZhciBkYXRhID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLAogICAgc2l6ZSA9IGRhdGEuc2l6ZTsKICBkYXRhLnNldChrZXksIHZhbHVlKTsKICB0aGlzLnNpemUgKz0gZGF0YS5zaXplID09IHNpemUgPyAwIDogMTsKICByZXR1cm4gdGhpczsKfQoKLyoqCiAqIENyZWF0ZXMgYSBtYXAgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy4KICoKICogQHByaXZhdGUKICogQGNvbnN0cnVjdG9yCiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLgogKi8KZnVuY3Rpb24gTWFwQ2FjaGUoZW50cmllcykgewogIHZhciBpbmRleCA9IC0xLAogICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoOwogIHRoaXMuY2xlYXIoKTsKICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkgewogICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07CiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pOwogIH0KfQoKLy8gQWRkIG1ldGhvZHMgdG8gYE1hcENhY2hlYC4KTWFwQ2FjaGUucHJvdG90eXBlLmNsZWFyID0gbWFwQ2FjaGVDbGVhcjsKTWFwQ2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IG1hcENhY2hlRGVsZXRlOwpNYXBDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbWFwQ2FjaGVHZXQ7Ck1hcENhY2hlLnByb3RvdHlwZS5oYXMgPSBtYXBDYWNoZUhhczsKTWFwQ2FjaGUucHJvdG90eXBlLnNldCA9IG1hcENhY2hlU2V0OwoKLyoqIEVycm9yIG1lc3NhZ2UgY29uc3RhbnRzLiAqLwp2YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nOwoKLyoqCiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IG1lbW9pemVzIHRoZSByZXN1bHQgb2YgYGZ1bmNgLiBJZiBgcmVzb2x2ZXJgIGlzCiAqIHByb3ZpZGVkLCBpdCBkZXRlcm1pbmVzIHRoZSBjYWNoZSBrZXkgZm9yIHN0b3JpbmcgdGhlIHJlc3VsdCBiYXNlZCBvbiB0aGUKICogYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbi4gQnkgZGVmYXVsdCwgdGhlIGZpcnN0IGFyZ3VtZW50CiAqIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbiBpcyB1c2VkIGFzIHRoZSBtYXAgY2FjaGUga2V5LiBUaGUgYGZ1bmNgCiAqIGlzIGludm9rZWQgd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgdGhlIG1lbW9pemVkIGZ1bmN0aW9uLgogKgogKiAqKk5vdGU6KiogVGhlIGNhY2hlIGlzIGV4cG9zZWQgYXMgdGhlIGBjYWNoZWAgcHJvcGVydHkgb24gdGhlIG1lbW9pemVkCiAqIGZ1bmN0aW9uLiBJdHMgY3JlYXRpb24gbWF5IGJlIGN1c3RvbWl6ZWQgYnkgcmVwbGFjaW5nIHRoZSBgXy5tZW1vaXplLkNhY2hlYAogKiBjb25zdHJ1Y3RvciB3aXRoIG9uZSB3aG9zZSBpbnN0YW5jZXMgaW1wbGVtZW50IHRoZQogKiBbYE1hcGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXByb3BlcnRpZXMtb2YtdGhlLW1hcC1wcm90b3R5cGUtb2JqZWN0KQogKiBtZXRob2QgaW50ZXJmYWNlIG9mIGBjbGVhcmAsIGBkZWxldGVgLCBgZ2V0YCwgYGhhc2AsIGFuZCBgc2V0YC4KICoKICogQHN0YXRpYwogKiBAbWVtYmVyT2YgXwogKiBAc2luY2UgMC4xLjAKICogQGNhdGVnb3J5IEZ1bmN0aW9uCiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGhhdmUgaXRzIG91dHB1dCBtZW1vaXplZC4KICogQHBhcmFtIHtGdW5jdGlvbn0gW3Jlc29sdmVyXSBUaGUgZnVuY3Rpb24gdG8gcmVzb2x2ZSB0aGUgY2FjaGUga2V5LgogKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXplZCBmdW5jdGlvbi4KICogQGV4YW1wbGUKICoKICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxLCAnYic6IDIgfTsKICogdmFyIG90aGVyID0geyAnYyc6IDMsICdkJzogNCB9OwogKgogKiB2YXIgdmFsdWVzID0gXy5tZW1vaXplKF8udmFsdWVzKTsKICogdmFsdWVzKG9iamVjdCk7CiAqIC8vID0+IFsxLCAyXQogKgogKiB2YWx1ZXMob3RoZXIpOwogKiAvLyA9PiBbMywgNF0KICoKICogb2JqZWN0LmEgPSAyOwogKiB2YWx1ZXMob2JqZWN0KTsKICogLy8gPT4gWzEsIDJdCiAqCiAqIC8vIE1vZGlmeSB0aGUgcmVzdWx0IGNhY2hlLgogKiB2YWx1ZXMuY2FjaGUuc2V0KG9iamVjdCwgWydhJywgJ2InXSk7CiAqIHZhbHVlcyhvYmplY3QpOwogKiAvLyA9PiBbJ2EnLCAnYiddCiAqCiAqIC8vIFJlcGxhY2UgYF8ubWVtb2l6ZS5DYWNoZWAuCiAqIF8ubWVtb2l6ZS5DYWNoZSA9IFdlYWtNYXA7CiAqLwpmdW5jdGlvbiBtZW1vaXplKGZ1bmMsIHJlc29sdmVyKSB7CiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicgfHwgcmVzb2x2ZXIgIT0gbnVsbCAmJiB0eXBlb2YgcmVzb2x2ZXIgIT0gJ2Z1bmN0aW9uJykgewogICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpOwogIH0KICB2YXIgbWVtb2l6ZWQgPSBmdW5jdGlvbiAoKSB7CiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cywKICAgICAga2V5ID0gcmVzb2x2ZXIgPyByZXNvbHZlci5hcHBseSh0aGlzLCBhcmdzKSA6IGFyZ3NbMF0sCiAgICAgIGNhY2hlID0gbWVtb2l6ZWQuY2FjaGU7CiAgICBpZiAoY2FjaGUuaGFzKGtleSkpIHsKICAgICAgcmV0dXJuIGNhY2hlLmdldChrZXkpOwogICAgfQogICAgdmFyIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpcywgYXJncyk7CiAgICBtZW1vaXplZC5jYWNoZSA9IGNhY2hlLnNldChrZXksIHJlc3VsdCkgfHwgY2FjaGU7CiAgICByZXR1cm4gcmVzdWx0OwogIH07CiAgbWVtb2l6ZWQuY2FjaGUgPSBuZXcgKG1lbW9pemUuQ2FjaGUgfHwgTWFwQ2FjaGUpKCk7CiAgcmV0dXJuIG1lbW9pemVkOwp9CgovLyBFeHBvc2UgYE1hcENhY2hlYC4KbWVtb2l6ZS5DYWNoZSA9IE1hcENhY2hlOwoKLyoqIFVzZWQgYXMgdGhlIG1heGltdW0gbWVtb2l6ZSBjYWNoZSBzaXplLiAqLwp2YXIgTUFYX01FTU9JWkVfU0laRSA9IDUwMDsKCi8qKgogKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ubWVtb2l6ZWAgd2hpY2ggY2xlYXJzIHRoZSBtZW1vaXplZCBmdW5jdGlvbidzCiAqIGNhY2hlIHdoZW4gaXQgZXhjZWVkcyBgTUFYX01FTU9JWkVfU0laRWAuCiAqCiAqIEBwcml2YXRlCiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGhhdmUgaXRzIG91dHB1dCBtZW1vaXplZC4KICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgbWVtb2l6ZWQgZnVuY3Rpb24uCiAqLwpmdW5jdGlvbiBtZW1vaXplQ2FwcGVkKGZ1bmMpIHsKICB2YXIgcmVzdWx0ID0gbWVtb2l6ZShmdW5jLCBmdW5jdGlvbiAoa2V5KSB7CiAgICBpZiAoY2FjaGUuc2l6ZSA9PT0gTUFYX01FTU9JWkVfU0laRSkgewogICAgICBjYWNoZS5jbGVhcigpOwogICAgfQogICAgcmV0dXJuIGtleTsKICB9KTsKICB2YXIgY2FjaGUgPSByZXN1bHQuY2FjaGU7CiAgcmV0dXJuIHJlc3VsdDsKfQoKLyoqIFVzZWQgdG8gbWF0Y2ggcHJvcGVydHkgbmFtZXMgd2l0aGluIHByb3BlcnR5IHBhdGhzLiAqLwp2YXIgcmVQcm9wTmFtZSA9IC9bXi5bXF1dK3xcWyg/OigtP1xkKyg/OlwuXGQrKT8pfChbIiddKSgoPzooPyFcMilbXlxcXXxcXC4pKj8pXDIpXF18KD89KD86XC58XFtcXSkoPzpcLnxcW1xdfCQpKS9nOwoKLyoqIFVzZWQgdG8gbWF0Y2ggYmFja3NsYXNoZXMgaW4gcHJvcGVydHkgcGF0aHMuICovCnZhciByZUVzY2FwZUNoYXIgPSAvXFwoXFwpPy9nOwoKLyoqCiAqIENvbnZlcnRzIGBzdHJpbmdgIHRvIGEgcHJvcGVydHkgcGF0aCBhcnJheS4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIGNvbnZlcnQuCiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgcHJvcGVydHkgcGF0aCBhcnJheS4KICovCnZhciBzdHJpbmdUb1BhdGggPSBtZW1vaXplQ2FwcGVkKGZ1bmN0aW9uIChzdHJpbmcpIHsKICB2YXIgcmVzdWx0ID0gW107CiAgaWYgKHN0cmluZy5jaGFyQ29kZUF0KDApID09PSA0NiAvKiAuICovKSB7CiAgICByZXN1bHQucHVzaCgnJyk7CiAgfQogIHN0cmluZy5yZXBsYWNlKHJlUHJvcE5hbWUsIGZ1bmN0aW9uIChtYXRjaCwgbnVtYmVyLCBxdW90ZSwgc3ViU3RyaW5nKSB7CiAgICByZXN1bHQucHVzaChxdW90ZSA/IHN1YlN0cmluZy5yZXBsYWNlKHJlRXNjYXBlQ2hhciwgJyQxJykgOiBudW1iZXIgfHwgbWF0Y2gpOwogIH0pOwogIHJldHVybiByZXN1bHQ7Cn0pOwp2YXIgc3RyaW5nVG9QYXRoJDEgPSBzdHJpbmdUb1BhdGg7CgovKioKICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLm1hcGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlCiAqIHNob3J0aGFuZHMuCiAqCiAqIEBwcml2YXRlCiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci4KICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi4KICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgbWFwcGVkIGFycmF5LgogKi8KZnVuY3Rpb24gYXJyYXlNYXAoYXJyYXksIGl0ZXJhdGVlKSB7CiAgdmFyIGluZGV4ID0gLTEsCiAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aCwKICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7CiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHsKICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSk7CiAgfQogIHJldHVybiByZXN1bHQ7Cn0KCi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqLwp2YXIgSU5GSU5JVFkkMiA9IDEgLyAwOwoKLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovCnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCQxID8gU3ltYm9sJDEucHJvdG90eXBlIDogdW5kZWZpbmVkLAogIHN5bWJvbFRvU3RyaW5nID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by50b1N0cmluZyA6IHVuZGVmaW5lZDsKCi8qKgogKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50b1N0cmluZ2Agd2hpY2ggZG9lc24ndCBjb252ZXJ0IG51bGxpc2gKICogdmFsdWVzIHRvIGVtcHR5IHN0cmluZ3MuCiAqCiAqIEBwcml2YXRlCiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuCiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy4KICovCmZ1bmN0aW9uIGJhc2VUb1N0cmluZyh2YWx1ZSkgewogIC8vIEV4aXQgZWFybHkgZm9yIHN0cmluZ3MgdG8gYXZvaWQgYSBwZXJmb3JtYW5jZSBoaXQgaW4gc29tZSBlbnZpcm9ubWVudHMuCiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykgewogICAgcmV0dXJuIHZhbHVlOwogIH0KICBpZiAoaXNBcnJheSQxKHZhbHVlKSkgewogICAgLy8gUmVjdXJzaXZlbHkgY29udmVydCB2YWx1ZXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS4KICAgIHJldHVybiBhcnJheU1hcCh2YWx1ZSwgYmFzZVRvU3RyaW5nKSArICcnOwogIH0KICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7CiAgICByZXR1cm4gc3ltYm9sVG9TdHJpbmcgPyBzeW1ib2xUb1N0cmluZy5jYWxsKHZhbHVlKSA6ICcnOwogIH0KICB2YXIgcmVzdWx0ID0gdmFsdWUgKyAnJzsKICByZXR1cm4gcmVzdWx0ID09ICcwJyAmJiAxIC8gdmFsdWUgPT0gLUlORklOSVRZJDIgPyAnLTAnIDogcmVzdWx0Owp9CgovKioKICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZy4gQW4gZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkIGZvciBgbnVsbGAKICogYW5kIGB1bmRlZmluZWRgIHZhbHVlcy4gVGhlIHNpZ24gb2YgYC0wYCBpcyBwcmVzZXJ2ZWQuCiAqCiAqIEBzdGF0aWMKICogQG1lbWJlck9mIF8KICogQHNpbmNlIDQuMC4wCiAqIEBjYXRlZ29yeSBMYW5nCiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuCiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuCiAqIEBleGFtcGxlCiAqCiAqIF8udG9TdHJpbmcobnVsbCk7CiAqIC8vID0+ICcnCiAqCiAqIF8udG9TdHJpbmcoLTApOwogKiAvLyA9PiAnLTAnCiAqCiAqIF8udG9TdHJpbmcoWzEsIDIsIDNdKTsKICogLy8gPT4gJzEsMiwzJwogKi8KZnVuY3Rpb24gdG9TdHJpbmcodmFsdWUpIHsKICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogYmFzZVRvU3RyaW5nKHZhbHVlKTsKfQoKLyoqCiAqIENhc3RzIGB2YWx1ZWAgdG8gYSBwYXRoIGFycmF5IGlmIGl0J3Mgbm90IG9uZS4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC4KICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkga2V5cyBvbi4KICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBjYXN0IHByb3BlcnR5IHBhdGggYXJyYXkuCiAqLwpmdW5jdGlvbiBjYXN0UGF0aCh2YWx1ZSwgb2JqZWN0KSB7CiAgaWYgKGlzQXJyYXkkMSh2YWx1ZSkpIHsKICAgIHJldHVybiB2YWx1ZTsKICB9CiAgcmV0dXJuIGlzS2V5KHZhbHVlLCBvYmplY3QpID8gW3ZhbHVlXSA6IHN0cmluZ1RvUGF0aCQxKHRvU3RyaW5nKHZhbHVlKSk7Cn0KCi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqLwp2YXIgSU5GSU5JVFkkMSA9IDEgLyAwOwoKLyoqCiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcga2V5IGlmIGl0J3Mgbm90IGEgc3RyaW5nIG9yIHN5bWJvbC4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC4KICogQHJldHVybnMge3N0cmluZ3xzeW1ib2x9IFJldHVybnMgdGhlIGtleS4KICovCmZ1bmN0aW9uIHRvS2V5KHZhbHVlKSB7CiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCBpc1N5bWJvbCh2YWx1ZSkpIHsKICAgIHJldHVybiB2YWx1ZTsKICB9CiAgdmFyIHJlc3VsdCA9IHZhbHVlICsgJyc7CiAgcmV0dXJuIHJlc3VsdCA9PSAnMCcgJiYgMSAvIHZhbHVlID09IC1JTkZJTklUWSQxID8gJy0wJyA6IHJlc3VsdDsKfQoKLyoqCiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmdldGAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWZhdWx0IHZhbHVlcy4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LgogKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LgogKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzb2x2ZWQgdmFsdWUuCiAqLwpmdW5jdGlvbiBiYXNlR2V0KG9iamVjdCwgcGF0aCkgewogIHBhdGggPSBjYXN0UGF0aChwYXRoLCBvYmplY3QpOwogIHZhciBpbmRleCA9IDAsCiAgICBsZW5ndGggPSBwYXRoLmxlbmd0aDsKICB3aGlsZSAob2JqZWN0ICE9IG51bGwgJiYgaW5kZXggPCBsZW5ndGgpIHsKICAgIG9iamVjdCA9IG9iamVjdFt0b0tleShwYXRoW2luZGV4KytdKV07CiAgfQogIHJldHVybiBpbmRleCAmJiBpbmRleCA9PSBsZW5ndGggPyBvYmplY3QgOiB1bmRlZmluZWQ7Cn0KCi8qKgogKiBHZXRzIHRoZSB2YWx1ZSBhdCBgcGF0aGAgb2YgYG9iamVjdGAuIElmIHRoZSByZXNvbHZlZCB2YWx1ZSBpcwogKiBgdW5kZWZpbmVkYCwgdGhlIGBkZWZhdWx0VmFsdWVgIGlzIHJldHVybmVkIGluIGl0cyBwbGFjZS4KICoKICogQHN0YXRpYwogKiBAbWVtYmVyT2YgXwogKiBAc2luY2UgMy43LjAKICogQGNhdGVnb3J5IE9iamVjdAogKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuCiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuCiAqIEBwYXJhbSB7Kn0gW2RlZmF1bHRWYWx1ZV0gVGhlIHZhbHVlIHJldHVybmVkIGZvciBgdW5kZWZpbmVkYCByZXNvbHZlZCB2YWx1ZXMuCiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXNvbHZlZCB2YWx1ZS4KICogQGV4YW1wbGUKICoKICogdmFyIG9iamVjdCA9IHsgJ2EnOiBbeyAnYic6IHsgJ2MnOiAzIH0gfV0gfTsKICoKICogXy5nZXQob2JqZWN0LCAnYVswXS5iLmMnKTsKICogLy8gPT4gMwogKgogKiBfLmdldChvYmplY3QsIFsnYScsICcwJywgJ2InLCAnYyddKTsKICogLy8gPT4gMwogKgogKiBfLmdldChvYmplY3QsICdhLmIuYycsICdkZWZhdWx0Jyk7CiAqIC8vID0+ICdkZWZhdWx0JwogKi8KZnVuY3Rpb24gZ2V0KG9iamVjdCwgcGF0aCwgZGVmYXVsdFZhbHVlKSB7CiAgdmFyIHJlc3VsdCA9IG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogYmFzZUdldChvYmplY3QsIHBhdGgpOwogIHJldHVybiByZXN1bHQgPT09IHVuZGVmaW5lZCA/IGRlZmF1bHRWYWx1ZSA6IHJlc3VsdDsKfQoKLyoqDQogKiDliKTmlrfmmK/lkKbngrrlrZfkuLINCiAqDQogKiBVbml0IFRlc3Q6IHtAbGluayBodHRwczovL2dpdGh1Yi5jb20veXVkYS1seXUvd3NlbWkvYmxvYi9tYXN0ZXIvdGVzdC9pc3N0ci50ZXN0Lm1qcyBHaXRodWJ9DQogKiBAbWVtYmVyT2Ygd3NlbWkNCiAqIEBwYXJhbSB7Kn0gdiDovLjlhaXku7vmhI/os4fmlpkNCiAqIEByZXR1cm5zIHtCb29sZWFufSDlm57lgrPliKTmlrfluIPmnpflgLwNCiAqIEBleGFtcGxlDQogKg0KICogY29uc29sZS5sb2coaXNzdHIoMCkpDQogKiAvLyA9PiBmYWxzZQ0KICoNCiAqIGNvbnNvbGUubG9nKGlzc3RyKCcwJykpDQogKiAvLyA9PiB0cnVlDQogKg0KICogY29uc29sZS5sb2coaXNzdHIoJycpKQ0KICogLy8gPT4gdHJ1ZQ0KICoNCiAqLwpmdW5jdGlvbiBpc3N0cih2KSB7CiAgbGV0IGMgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodik7CiAgcmV0dXJuIGMgPT09ICdbb2JqZWN0IFN0cmluZ10nOwp9CgovKioNCiAqIOWIpOaWt+aYr+WQpueCuuacieaViOWtl+S4sg0KICoNCiAqIFVuaXQgVGVzdDoge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS95dWRhLWx5dS93c2VtaS9ibG9iL21hc3Rlci90ZXN0L2lzZXN0ci50ZXN0Lm1qcyBHaXRodWJ9DQogKiBAbWVtYmVyT2Ygd3NlbWkNCiAqIEBwYXJhbSB7Kn0gdiDovLjlhaXku7vmhI/os4fmlpkNCiAqIEByZXR1cm5zIHtCb29sZWFufSDlm57lgrPliKTmlrfluIPmnpflgLwNCiAqIEBleGFtcGxlDQogKg0KICogY29uc29sZS5sb2coaXNlc3RyKCcxLjI1JykpDQogKiAvLyA9PiB0cnVlDQogKg0KICogY29uc29sZS5sb2coaXNlc3RyKDEyNSkpDQogKiAvLyA9PiBmYWxzZQ0KICoNCiAqIGNvbnNvbGUubG9nKGlzZXN0cignJykpDQogKiAvLyA9PiBmYWxzZQ0KICoNCiAqLwpmdW5jdGlvbiBpc2VzdHIodikgewogIC8vY2hlY2sKICBpZiAoaXNzdHIodikpIHsKICAgIGlmICh2ICE9PSAnJykgewogICAgICByZXR1cm4gdHJ1ZTsKICAgIH0KICB9CiAgcmV0dXJuIGZhbHNlOwp9CgovKiogVXNlZCB0byBtYXRjaCBhIHNpbmdsZSB3aGl0ZXNwYWNlIGNoYXJhY3Rlci4gKi8KdmFyIHJlV2hpdGVzcGFjZSA9IC9ccy87CgovKioKICogVXNlZCBieSBgXy50cmltYCBhbmQgYF8udHJpbUVuZGAgdG8gZ2V0IHRoZSBpbmRleCBvZiB0aGUgbGFzdCBub24td2hpdGVzcGFjZQogKiBjaGFyYWN0ZXIgb2YgYHN0cmluZ2AuCiAqCiAqIEBwcml2YXRlCiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBpbnNwZWN0LgogKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbGFzdCBub24td2hpdGVzcGFjZSBjaGFyYWN0ZXIuCiAqLwpmdW5jdGlvbiB0cmltbWVkRW5kSW5kZXgoc3RyaW5nKSB7CiAgdmFyIGluZGV4ID0gc3RyaW5nLmxlbmd0aDsKICB3aGlsZSAoaW5kZXgtLSAmJiByZVdoaXRlc3BhY2UudGVzdChzdHJpbmcuY2hhckF0KGluZGV4KSkpIHt9CiAgcmV0dXJuIGluZGV4Owp9CgovKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIHdoaXRlc3BhY2UuICovCnZhciByZVRyaW1TdGFydCA9IC9eXHMrLzsKCi8qKgogKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50cmltYC4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIHRyaW0uCiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHRyaW1tZWQgc3RyaW5nLgogKi8KZnVuY3Rpb24gYmFzZVRyaW0oc3RyaW5nKSB7CiAgcmV0dXJuIHN0cmluZyA/IHN0cmluZy5zbGljZSgwLCB0cmltbWVkRW5kSW5kZXgoc3RyaW5nKSArIDEpLnJlcGxhY2UocmVUcmltU3RhcnQsICcnKSA6IHN0cmluZzsKfQoKLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovCnZhciBOQU4gPSAwIC8gMDsKCi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovCnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7CgovKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovCnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pOwoKLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovCnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pOwoKLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi8KdmFyIGZyZWVQYXJzZUludCA9IHBhcnNlSW50OwoKLyoqCiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBudW1iZXIuCiAqCiAqIEBzdGF0aWMKICogQG1lbWJlck9mIF8KICogQHNpbmNlIDQuMC4wCiAqIEBjYXRlZ29yeSBMYW5nCiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuCiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci4KICogQGV4YW1wbGUKICoKICogXy50b051bWJlcigzLjIpOwogKiAvLyA9PiAzLjIKICoKICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTsKICogLy8gPT4gNWUtMzI0CiAqCiAqIF8udG9OdW1iZXIoSW5maW5pdHkpOwogKiAvLyA9PiBJbmZpbml0eQogKgogKiBfLnRvTnVtYmVyKCczLjInKTsKICogLy8gPT4gMy4yCiAqLwpmdW5jdGlvbiB0b051bWJlcih2YWx1ZSkgewogIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHsKICAgIHJldHVybiB2YWx1ZTsKICB9CiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkgewogICAgcmV0dXJuIE5BTjsKICB9CiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkgewogICAgdmFyIG90aGVyID0gdHlwZW9mIHZhbHVlLnZhbHVlT2YgPT0gJ2Z1bmN0aW9uJyA/IHZhbHVlLnZhbHVlT2YoKSA6IHZhbHVlOwogICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyBvdGhlciArICcnIDogb3RoZXI7CiAgfQogIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHsKICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogK3ZhbHVlOwogIH0KICB2YWx1ZSA9IGJhc2VUcmltKHZhbHVlKTsKICB2YXIgaXNCaW5hcnkgPSByZUlzQmluYXJ5LnRlc3QodmFsdWUpOwogIHJldHVybiBpc0JpbmFyeSB8fCByZUlzT2N0YWwudGVzdCh2YWx1ZSkgPyBmcmVlUGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIGlzQmluYXJ5ID8gMiA6IDgpIDogcmVJc0JhZEhleC50ZXN0KHZhbHVlKSA/IE5BTiA6ICt2YWx1ZTsKfQoKLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovCnZhciBJTkZJTklUWSA9IDEgLyAwLAogIE1BWF9JTlRFR0VSID0gMS43OTc2OTMxMzQ4NjIzMTU3ZSszMDg7CgovKioKICogQ29udmVydHMgYHZhbHVlYCB0byBhIGZpbml0ZSBudW1iZXIuCiAqCiAqIEBzdGF0aWMKICogQG1lbWJlck9mIF8KICogQHNpbmNlIDQuMTIuMAogKiBAY2F0ZWdvcnkgTGFuZwogKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LgogKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgbnVtYmVyLgogKiBAZXhhbXBsZQogKgogKiBfLnRvRmluaXRlKDMuMik7CiAqIC8vID0+IDMuMgogKgogKiBfLnRvRmluaXRlKE51bWJlci5NSU5fVkFMVUUpOwogKiAvLyA9PiA1ZS0zMjQKICoKICogXy50b0Zpbml0ZShJbmZpbml0eSk7CiAqIC8vID0+IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4CiAqCiAqIF8udG9GaW5pdGUoJzMuMicpOwogKiAvLyA9PiAzLjIKICovCmZ1bmN0aW9uIHRvRmluaXRlKHZhbHVlKSB7CiAgaWYgKCF2YWx1ZSkgewogICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiAwOwogIH0KICB2YWx1ZSA9IHRvTnVtYmVyKHZhbHVlKTsKICBpZiAodmFsdWUgPT09IElORklOSVRZIHx8IHZhbHVlID09PSAtSU5GSU5JVFkpIHsKICAgIHZhciBzaWduID0gdmFsdWUgPCAwID8gLTEgOiAxOwogICAgcmV0dXJuIHNpZ24gKiBNQVhfSU5URUdFUjsKICB9CiAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZSA/IHZhbHVlIDogMDsKfQoKLyoqCiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYW4gaW50ZWdlci4KICoKICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb24KICogW2BUb0ludGVnZXJgXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9pbnRlZ2VyKS4KICoKICogQHN0YXRpYwogKiBAbWVtYmVyT2YgXwogKiBAc2luY2UgNC4wLjAKICogQGNhdGVnb3J5IExhbmcKICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC4KICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgY29udmVydGVkIGludGVnZXIuCiAqIEBleGFtcGxlCiAqCiAqIF8udG9JbnRlZ2VyKDMuMik7CiAqIC8vID0+IDMKICoKICogXy50b0ludGVnZXIoTnVtYmVyLk1JTl9WQUxVRSk7CiAqIC8vID0+IDAKICoKICogXy50b0ludGVnZXIoSW5maW5pdHkpOwogKiAvLyA9PiAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOAogKgogKiBfLnRvSW50ZWdlcignMy4yJyk7CiAqIC8vID0+IDMKICovCmZ1bmN0aW9uIHRvSW50ZWdlcih2YWx1ZSkgewogIHZhciByZXN1bHQgPSB0b0Zpbml0ZSh2YWx1ZSksCiAgICByZW1haW5kZXIgPSByZXN1bHQgJSAxOwogIHJldHVybiByZXN1bHQgPT09IHJlc3VsdCA/IHJlbWFpbmRlciA/IHJlc3VsdCAtIHJlbWFpbmRlciA6IHJlc3VsdCA6IDA7Cn0KCi8qKgogKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhbiBpbnRlZ2VyLgogKgogKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgYmFzZWQgb24KICogW2BOdW1iZXIuaXNJbnRlZ2VyYF0oaHR0cHM6Ly9tZG4uaW8vTnVtYmVyL2lzSW50ZWdlcikuCiAqCiAqIEBzdGF0aWMKICogQG1lbWJlck9mIF8KICogQHNpbmNlIDQuMC4wCiAqIEBjYXRlZ29yeSBMYW5nCiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLgogKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBpbnRlZ2VyLCBlbHNlIGBmYWxzZWAuCiAqIEBleGFtcGxlCiAqCiAqIF8uaXNJbnRlZ2VyKDMpOwogKiAvLyA9PiB0cnVlCiAqCiAqIF8uaXNJbnRlZ2VyKE51bWJlci5NSU5fVkFMVUUpOwogKiAvLyA9PiBmYWxzZQogKgogKiBfLmlzSW50ZWdlcihJbmZpbml0eSk7CiAqIC8vID0+IGZhbHNlCiAqCiAqIF8uaXNJbnRlZ2VyKCczJyk7CiAqIC8vID0+IGZhbHNlCiAqLwpmdW5jdGlvbiBpc0ludGVnZXIodmFsdWUpIHsKICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmIHZhbHVlID09IHRvSW50ZWdlcih2YWx1ZSk7Cn0KCi8qKg0KICog5Yik5pa35piv5ZCm54K65pW45a2XDQogKg0KICogVW5pdCBUZXN0OiB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL3l1ZGEtbHl1L3dzZW1pL2Jsb2IvbWFzdGVyL3Rlc3QvaXNuYnIudGVzdC5tanMgR2l0aHVifQ0KICogQG1lbWJlck9mIHdzZW1pDQogKiBAcGFyYW0geyp9IHYg6Ly45YWl5Lu75oSP6LOH5paZDQogKiBAcmV0dXJucyB7Qm9vbGVhbn0g5Zue5YKz5Yik5pa35biD5p6X5YC8DQogKiBAZXhhbXBsZQ0KICoNCiAqIGNvbnNvbGUubG9nKGlzbmJyKDEuMjUpKQ0KICogLy8gPT4gdHJ1ZQ0KICoNCiAqIGNvbnNvbGUubG9nKGlzbmJyKCcxLjI1JykpDQogKiAvLyA9PiBmYWxzZQ0KICoNCiAqLwpmdW5jdGlvbiBpc25icih2KSB7CiAgbGV0IGMgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodik7CiAgcmV0dXJuIGMgPT09ICdbb2JqZWN0IE51bWJlcl0nOwp9CgovLyBpbXBvcnQgaXNOYU4gZnJvbSAnbG9kYXNoLWVzL2lzTmFOLmpzJwoKLyoqDQogKiDliKTmlrfmmK/lkKbngrpOYU4NCiAqDQogKiBVbml0IFRlc3Q6IHtAbGluayBodHRwczovL2dpdGh1Yi5jb20veXVkYS1seXUvd3NlbWkvYmxvYi9tYXN0ZXIvdGVzdC9pc25hbi50ZXN0Lm1qcyBHaXRodWJ9DQogKiBAbWVtYmVyT2Ygd3NlbWkNCiAqIEBwYXJhbSB7Kn0gdiDovLjlhaXku7vmhI/os4fmlpkNCiAqIEByZXR1cm5zIHtCb29sZWFufSDlm57lgrPliKTmlrfluIPmnpflgLwNCiAqIEBleGFtcGxlDQogKg0KICogY29uc29sZS5sb2coaXNuYW4oTmFOKSkNCiAqIC8vID0+IHRydWUNCiAqDQogKi8KZnVuY3Rpb24gaXNuYW4odikgewogIC8vIHJldHVybiBpc05hTih2KQogIHJldHVybiB2ICE9PSB2Owp9CgovKioNCiAqIOWIpOaWt+aYr+WQpueCuuaVuOWtlw0KICoNCiAqIFVuaXQgVGVzdDoge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS95dWRhLWx5dS93c2VtaS9ibG9iL21hc3Rlci90ZXN0L2lzbnVtLnRlc3QubWpzIEdpdGh1Yn0NCiAqIEBtZW1iZXJPZiB3c2VtaQ0KICogQHBhcmFtIHsqfSB2IOi8uOWFpeS7u+aEj+izh+aWmQ0KICogQHJldHVybnMge0Jvb2xlYW59IOWbnuWCs+WIpOaWt+W4g+ael+WAvA0KICogQGV4YW1wbGUNCiAqDQogKiBjb25zb2xlLmxvZyhpc251bSgwKSkNCiAqIC8vID0+IHRydWUNCiAqDQogKiBjb25zb2xlLmxvZyhpc251bSgxLjI1KSkNCiAqIC8vID0+IHRydWUNCiAqDQogKiBjb25zb2xlLmxvZyhpc251bSgnLTEyNScpKQ0KICogLy8gPT4gdHJ1ZQ0KICoNCiAqLwpmdW5jdGlvbiBpc251bSh2KSB7CiAgbGV0IGIgPSBmYWxzZTsKICBpZiAoaXNlc3RyKHYpKSB7CiAgICBiID0gIWlzTmFOKE51bWJlcih2KSk7CiAgfSBlbHNlIGlmIChpc25icih2KSkgewogICAgLy/ms6jmhI9OYU7ngrpOdW1iZXIsIOaVhWlzbmJy5Zue5YKzdHJ1ZQogICAgaWYgKGlzbmFuKHYpKSB7CiAgICAgIHJldHVybiBmYWxzZTsgLy/mraTomZXliKTlrprngrrmnInmlYjmlbjlrZcsIOaVhU5hTumgiOWJlOmZpAogICAgfSBlbHNlIHsKICAgICAgYiA9IHRydWU7CiAgICB9CiAgfQogIHJldHVybiBiOwp9CgovKioNCiAqIOaVuOWtl+aIluWtl+S4sui9iea1rum7nuaVuA0KICog6Iul6Ly45YWl6Z2e5pW45a2X5YmH5Zue5YKzMA0KICoNCiAqIFVuaXQgVGVzdDoge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS95dWRhLWx5dS93c2VtaS9ibG9iL21hc3Rlci90ZXN0L2NkYmwudGVzdC5tanMgR2l0aHVifQ0KICogQG1lbWJlck9mIHdzZW1pDQogKiBAcGFyYW0ge051bWJlcnxTdHJpbmd9IHYg6Ly45YWl5pW45a2X5oiW5a2X5LiyDQogKiBAcmV0dXJucyB7TnVtYmVyfSDlm57lgrPmlbjlrZcNCiAqIEBleGFtcGxlDQogKg0KICogY29uc29sZS5sb2coY2RibCgnMjUnKSkNCiAqIC8vID0+IDI1DQogKg0KICovCmZ1bmN0aW9uIGNkYmwodikgewogIC8vY2hlY2sKICBpZiAoIWlzbnVtKHYpKSB7CiAgICByZXR1cm4gMDsKICB9CiAgbGV0IHIgPSB0b0Zpbml0ZSh2KTsKICByZXR1cm4gcjsKfQoKLyoqDQogKiDliKTmlrfmmK/lkKbngrrmlbTmlbgNCiAqDQogKiBVbml0IFRlc3Q6IHtAbGluayBodHRwczovL2dpdGh1Yi5jb20veXVkYS1seXUvd3NlbWkvYmxvYi9tYXN0ZXIvdGVzdC9pc2ludC50ZXN0Lm1qcyBHaXRodWJ9DQogKiBAbWVtYmVyT2Ygd3NlbWkNCiAqIEBwYXJhbSB7Kn0gdiDovLjlhaXku7vmhI/os4fmlpkNCiAqIEByZXR1cm5zIHtCb29sZWFufSDlm57lgrPliKTmlrfluIPmnpflgLwNCiAqIEBleGFtcGxlDQogKg0KICogY29uc29sZS5sb2coaXNpbnQoJzEuMjUnKSkNCiAqIC8vID0+IGZhbHNlDQogKg0KICogY29uc29sZS5sb2coaXNpbnQoJzEyNScpKQ0KICogLy8gPT4gdHJ1ZQ0KICoNCiAqIGNvbnNvbGUubG9nKGlzaW50KDEuMjUpKQ0KICogLy8gPT4gZmFsc2UNCiAqDQogKiBjb25zb2xlLmxvZyhpc2ludCgxMjUpKQ0KICogLy8gPT4gdHJ1ZQ0KICoNCiAqLwpmdW5jdGlvbiBpc2ludCh2KSB7CiAgaWYgKGlzbnVtKHYpKSB7CiAgICB2ID0gY2RibCh2KTsKICAgIHJldHVybiBpc0ludGVnZXIodik7CiAgfSBlbHNlIHsKICAgIHJldHVybiBmYWxzZTsKICB9Cn0KCi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi8KdmFyIG5hdGl2ZUlzRmluaXRlID0gcm9vdCQxLmlzRmluaXRlLAogIG5hdGl2ZU1pbiA9IE1hdGgubWluOwoKLyoqCiAqIENyZWF0ZXMgYSBmdW5jdGlvbiBsaWtlIGBfLnJvdW5kYC4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZE5hbWUgVGhlIG5hbWUgb2YgdGhlIGBNYXRoYCBtZXRob2QgdG8gdXNlIHdoZW4gcm91bmRpbmcuCiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHJvdW5kIGZ1bmN0aW9uLgogKi8KZnVuY3Rpb24gY3JlYXRlUm91bmQobWV0aG9kTmFtZSkgewogIHZhciBmdW5jID0gTWF0aFttZXRob2ROYW1lXTsKICByZXR1cm4gZnVuY3Rpb24gKG51bWJlciwgcHJlY2lzaW9uKSB7CiAgICBudW1iZXIgPSB0b051bWJlcihudW1iZXIpOwogICAgcHJlY2lzaW9uID0gcHJlY2lzaW9uID09IG51bGwgPyAwIDogbmF0aXZlTWluKHRvSW50ZWdlcihwcmVjaXNpb24pLCAyOTIpOwogICAgaWYgKHByZWNpc2lvbiAmJiBuYXRpdmVJc0Zpbml0ZShudW1iZXIpKSB7CiAgICAgIC8vIFNoaWZ0IHdpdGggZXhwb25lbnRpYWwgbm90YXRpb24gdG8gYXZvaWQgZmxvYXRpbmctcG9pbnQgaXNzdWVzLgogICAgICAvLyBTZWUgW01ETl0oaHR0cHM6Ly9tZG4uaW8vcm91bmQjRXhhbXBsZXMpIGZvciBtb3JlIGRldGFpbHMuCiAgICAgIHZhciBwYWlyID0gKHRvU3RyaW5nKG51bWJlcikgKyAnZScpLnNwbGl0KCdlJyksCiAgICAgICAgdmFsdWUgPSBmdW5jKHBhaXJbMF0gKyAnZScgKyAoK3BhaXJbMV0gKyBwcmVjaXNpb24pKTsKICAgICAgcGFpciA9ICh0b1N0cmluZyh2YWx1ZSkgKyAnZScpLnNwbGl0KCdlJyk7CiAgICAgIHJldHVybiArKHBhaXJbMF0gKyAnZScgKyAoK3BhaXJbMV0gLSBwcmVjaXNpb24pKTsKICAgIH0KICAgIHJldHVybiBmdW5jKG51bWJlcik7CiAgfTsKfQoKLyoqCiAqIENvbXB1dGVzIGBudW1iZXJgIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAuCiAqCiAqIEBzdGF0aWMKICogQG1lbWJlck9mIF8KICogQHNpbmNlIDMuMTAuMAogKiBAY2F0ZWdvcnkgTWF0aAogKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIFRoZSBudW1iZXIgdG8gcm91bmQuCiAqIEBwYXJhbSB7bnVtYmVyfSBbcHJlY2lzaW9uPTBdIFRoZSBwcmVjaXNpb24gdG8gcm91bmQgdG8uCiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHJvdW5kZWQgbnVtYmVyLgogKiBAZXhhbXBsZQogKgogKiBfLnJvdW5kKDQuMDA2KTsKICogLy8gPT4gNAogKgogKiBfLnJvdW5kKDQuMDA2LCAyKTsKICogLy8gPT4gNC4wMQogKgogKiBfLnJvdW5kKDQwNjAsIC0yKTsKICogLy8gPT4gNDEwMAogKi8KdmFyIHJvdW5kID0gY3JlYXRlUm91bmQoJ3JvdW5kJyk7CnZhciByb3VuZCQxID0gcm91bmQ7CgovKioNCiAqIOaVuOWtl+aIluWtl+S4suWbm+aNqOS6lOWFpei9ieaVtOaVuA0KICog6Iul6Ly45YWl6Z2e5pW45a2X5YmH5Zue5YKzMA0KICoNCiAqIFVuaXQgVGVzdDoge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS95dWRhLWx5dS93c2VtaS9ibG9iL21hc3Rlci90ZXN0L2NpbnQudGVzdC5tanMgR2l0aHVifQ0KICogQG1lbWJlck9mIHdzZW1pDQogKiBAcGFyYW0ge051bWJlcnxTdHJpbmd9IHYg6Ly45YWl5pW45a2X5oiW5a2X5LiyDQogKiBAcmV0dXJucyB7SW50ZWdlcn0g5Zue5YKz5Zub5o2o5LqU5YWl5b6M5pW05pW4DQogKiBAZXhhbXBsZQ0KICoNCiAqIGNvbnNvbGUubG9nKGNpbnQoJzEuNScpKQ0KICogLy8gPT4gMg0KICoNCiAqIGNvbnNvbGUubG9nKGNpbnQoJy0xLjUnKSkNCiAqIC8vID0+IC0xDQogKg0KICovCmZ1bmN0aW9uIGNpbnQodikgewogIC8vY2hlY2sKICBpZiAoIWlzbnVtKHYpKSB7CiAgICByZXR1cm4gMDsKICB9CiAgdiA9IGNkYmwodik7CiAgbGV0IHIgPSByb3VuZCQxKHYpOwoKICAvL2NoZWNrIC0wCiAgaWYgKFN0cmluZyhyKSA9PT0gJzAnKSB7CiAgICByZXR1cm4gMDsKICB9CiAgcmV0dXJuIHI7Cn0KCi8qKg0KICog5Yik5pa35piv5ZCm54K65q2j5pW05pW4DQogKiDmraPmlbTmlbjkuI3ljIXlkKsw77yM54K65aSn5pa8MOeahOaVtOaVuA0KICoNCiAqIFVuaXQgVGVzdDoge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS95dWRhLWx5dS93c2VtaS9ibG9iL21hc3Rlci90ZXN0L2lzcGludC50ZXN0Lm1qcyBHaXRodWJ9DQogKiBAbWVtYmVyT2Ygd3NlbWkNCiAqIEBwYXJhbSB7Kn0gdiDovLjlhaXku7vmhI/os4fmlpkNCiAqIEByZXR1cm5zIHtCb29sZWFufSDlm57lgrPliKTmlrfluIPmnpflgLwNCiAqIEBleGFtcGxlDQogKg0KICogY29uc29sZS5sb2coaXNwaW50KDApKQ0KICogLy8gPT4gZmFsc2UNCiAqDQogKiBjb25zb2xlLmxvZyhpc3BpbnQoJzAnKSkNCiAqIC8vID0+IGZhbHNlDQogKg0KICogY29uc29sZS5sb2coaXNwaW50KDEyNSkpDQogKiAvLyA9PiB0cnVlDQogKg0KICogY29uc29sZS5sb2coaXNwaW50KDEuMjUpKQ0KICogLy8gPT4gZmFsc2UNCiAqDQogKiBjb25zb2xlLmxvZyhpc3BpbnQoJzEyNScpKQ0KICogLy8gPT4gdHJ1ZQ0KICoNCiAqIGNvbnNvbGUubG9nKGlzcGludCgnMS4yNScpKQ0KICogLy8gPT4gZmFsc2UNCg0KICogY29uc29sZS5sb2coaXNwaW50KC0xMjUpKQ0KICogLy8gPT4gZmFsc2UNCiAqDQogKiBjb25zb2xlLmxvZyhpc3BpbnQoLTEuMjUpKQ0KICogLy8gPT4gZmFsc2UNCiAqDQogKiBjb25zb2xlLmxvZyhpc3BpbnQoJy0xMjUnKSkNCiAqIC8vID0+IGZhbHNlDQogKg0KICogY29uc29sZS5sb2coaXNwaW50KCctMS4yNScpKQ0KICogLy8gPT4gZmFsc2UNCiAqDQogKi8KZnVuY3Rpb24gaXNwaW50KHYpIHsKICAvL2NoZWNrCiAgaWYgKCFpc2ludCh2KSkgewogICAgcmV0dXJuIGZhbHNlOwogIH0KICBsZXQgciA9IGNpbnQodikgPiAwOwogIHJldHVybiByOwp9CgovKioNCiAqIGpzb27mloflrZfovYnku7vmhI/os4fmlpkNCiAqDQogKiBVbml0IFRlc3Q6IHtAbGluayBodHRwczovL2dpdGh1Yi5jb20veXVkYS1seXUvd3NlbWkvYmxvYi9tYXN0ZXIvdGVzdC9qMm8udGVzdC5tanMgR2l0aHVifQ0KICogQG1lbWJlck9mIHdzZW1pDQogKiBAcGFyYW0ge1N0cmluZ30gdiDovLjlhaVqc29u5qC85byP5a2X5LiyDQogKiBAcmV0dXJucyB7Kn0g5Zue5YKz5Lu75oSP6LOH5paZDQogKiBAZXhhbXBsZQ0KICoNCiAqIGNvbnNvbGUubG9nKGoybygnWzEsIjMiLCJhYmMiXScpKQ0KICogLy8gPT4gWzEsICczJywgJ2FiYyddDQogKg0KICogY29uc29sZS5sb2coajJvKCd7ImEiOjEyLjM0LCJiIjoiYWJjIn0nKSkNCiAqIC8vID0+IHsgYTogMTIuMzQsIGI6ICdhYmMnIH0NCiAqDQogKi8KZnVuY3Rpb24gajJvKHYpIHsKICAvL2NoZWNrCiAgaWYgKCFpc2VzdHIodikpIHsKICAgIHJldHVybiB7fTsKICB9CiAgbGV0IGMgPSB7fTsKICB0cnkgewogICAgYyA9IEpTT04ucGFyc2Uodik7CiAgfSBjYXRjaCAoZXJyKSB7CiAgICBjID0ge307CiAgfQogIHJldHVybiBjOwp9CgpmdW5jdGlvbiBnZXREZWZhdWx0RXhwb3J0RnJvbUNqcyAoeCkgewoJcmV0dXJuIHggJiYgeC5fX2VzTW9kdWxlICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh4LCAnZGVmYXVsdCcpID8geFsnZGVmYXVsdCddIDogeDsKfQoKdmFyIGV2ZW50ZW1pdHRlcjMgPSB7ZXhwb3J0czoge319OwoKKGZ1bmN0aW9uIChtb2R1bGUpIHsKCiAgdmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksCiAgICBwcmVmaXggPSAnfic7CgogIC8qKgogICAqIENvbnN0cnVjdG9yIHRvIGNyZWF0ZSBhIHN0b3JhZ2UgZm9yIG91ciBgRUVgIG9iamVjdHMuCiAgICogQW4gYEV2ZW50c2AgaW5zdGFuY2UgaXMgYSBwbGFpbiBvYmplY3Qgd2hvc2UgcHJvcGVydGllcyBhcmUgZXZlbnQgbmFtZXMuCiAgICoKICAgKiBAY29uc3RydWN0b3IKICAgKiBAcHJpdmF0ZQogICAqLwogIGZ1bmN0aW9uIEV2ZW50cygpIHt9CgogIC8vCiAgLy8gV2UgdHJ5IHRvIG5vdCBpbmhlcml0IGZyb20gYE9iamVjdC5wcm90b3R5cGVgLiBJbiBzb21lIGVuZ2luZXMgY3JlYXRpbmcgYW4KICAvLyBpbnN0YW5jZSBpbiB0aGlzIHdheSBpcyBmYXN0ZXIgdGhhbiBjYWxsaW5nIGBPYmplY3QuY3JlYXRlKG51bGwpYCBkaXJlY3RseS4KICAvLyBJZiBgT2JqZWN0LmNyZWF0ZShudWxsKWAgaXMgbm90IHN1cHBvcnRlZCB3ZSBwcmVmaXggdGhlIGV2ZW50IG5hbWVzIHdpdGggYQogIC8vIGNoYXJhY3RlciB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYnVpbHQtaW4gb2JqZWN0IHByb3BlcnRpZXMgYXJlIG5vdAogIC8vIG92ZXJyaWRkZW4gb3IgdXNlZCBhcyBhbiBhdHRhY2sgdmVjdG9yLgogIC8vCiAgaWYgKE9iamVjdC5jcmVhdGUpIHsKICAgIEV2ZW50cy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG51bGwpOwoKICAgIC8vCiAgICAvLyBUaGlzIGhhY2sgaXMgbmVlZGVkIGJlY2F1c2UgdGhlIGBfX3Byb3RvX19gIHByb3BlcnR5IGlzIHN0aWxsIGluaGVyaXRlZCBpbgogICAgLy8gc29tZSBvbGQgYnJvd3NlcnMgbGlrZSBBbmRyb2lkIDQsIGlQaG9uZSA1LjEsIE9wZXJhIDExIGFuZCBTYWZhcmkgNS4KICAgIC8vCiAgICBpZiAoIW5ldyBFdmVudHMoKS5fX3Byb3RvX18pIHByZWZpeCA9IGZhbHNlOwogIH0KCiAgLyoqCiAgICogUmVwcmVzZW50YXRpb24gb2YgYSBzaW5nbGUgZXZlbnQgbGlzdGVuZXIuCiAgICoKICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgbGlzdGVuZXIgZnVuY3Rpb24uCiAgICogQHBhcmFtIHsqfSBjb250ZXh0IFRoZSBjb250ZXh0IHRvIGludm9rZSB0aGUgbGlzdGVuZXIgd2l0aC4KICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvbmNlPWZhbHNlXSBTcGVjaWZ5IGlmIHRoZSBsaXN0ZW5lciBpcyBhIG9uZS10aW1lIGxpc3RlbmVyLgogICAqIEBjb25zdHJ1Y3RvcgogICAqIEBwcml2YXRlCiAgICovCiAgZnVuY3Rpb24gRUUoZm4sIGNvbnRleHQsIG9uY2UpIHsKICAgIHRoaXMuZm4gPSBmbjsKICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7CiAgICB0aGlzLm9uY2UgPSBvbmNlIHx8IGZhbHNlOwogIH0KCiAgLyoqCiAgICogQWRkIGEgbGlzdGVuZXIgZm9yIGEgZ2l2ZW4gZXZlbnQuCiAgICoKICAgKiBAcGFyYW0ge0V2ZW50RW1pdHRlcn0gZW1pdHRlciBSZWZlcmVuY2UgdG8gdGhlIGBFdmVudEVtaXR0ZXJgIGluc3RhbmNlLgogICAqIEBwYXJhbSB7KFN0cmluZ3xTeW1ib2wpfSBldmVudCBUaGUgZXZlbnQgbmFtZS4KICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgbGlzdGVuZXIgZnVuY3Rpb24uCiAgICogQHBhcmFtIHsqfSBjb250ZXh0IFRoZSBjb250ZXh0IHRvIGludm9rZSB0aGUgbGlzdGVuZXIgd2l0aC4KICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9uY2UgU3BlY2lmeSBpZiB0aGUgbGlzdGVuZXIgaXMgYSBvbmUtdGltZSBsaXN0ZW5lci4KICAgKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfQogICAqIEBwcml2YXRlCiAgICovCiAgZnVuY3Rpb24gYWRkTGlzdGVuZXIoZW1pdHRlciwgZXZlbnQsIGZuLCBjb250ZXh0LCBvbmNlKSB7CiAgICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7CiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTsKICAgIH0KICAgIHZhciBsaXN0ZW5lciA9IG5ldyBFRShmbiwgY29udGV4dCB8fCBlbWl0dGVyLCBvbmNlKSwKICAgICAgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDsKICAgIGlmICghZW1pdHRlci5fZXZlbnRzW2V2dF0pIGVtaXR0ZXIuX2V2ZW50c1tldnRdID0gbGlzdGVuZXIsIGVtaXR0ZXIuX2V2ZW50c0NvdW50Kys7ZWxzZSBpZiAoIWVtaXR0ZXIuX2V2ZW50c1tldnRdLmZuKSBlbWl0dGVyLl9ldmVudHNbZXZ0XS5wdXNoKGxpc3RlbmVyKTtlbHNlIGVtaXR0ZXIuX2V2ZW50c1tldnRdID0gW2VtaXR0ZXIuX2V2ZW50c1tldnRdLCBsaXN0ZW5lcl07CiAgICByZXR1cm4gZW1pdHRlcjsKICB9CgogIC8qKgogICAqIENsZWFyIGV2ZW50IGJ5IG5hbWUuCiAgICoKICAgKiBAcGFyYW0ge0V2ZW50RW1pdHRlcn0gZW1pdHRlciBSZWZlcmVuY2UgdG8gdGhlIGBFdmVudEVtaXR0ZXJgIGluc3RhbmNlLgogICAqIEBwYXJhbSB7KFN0cmluZ3xTeW1ib2wpfSBldnQgVGhlIEV2ZW50IG5hbWUuCiAgICogQHByaXZhdGUKICAgKi8KICBmdW5jdGlvbiBjbGVhckV2ZW50KGVtaXR0ZXIsIGV2dCkgewogICAgaWYgKC0tZW1pdHRlci5fZXZlbnRzQ291bnQgPT09IDApIGVtaXR0ZXIuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtlbHNlIGRlbGV0ZSBlbWl0dGVyLl9ldmVudHNbZXZ0XTsKICB9CgogIC8qKgogICAqIE1pbmltYWwgYEV2ZW50RW1pdHRlcmAgaW50ZXJmYWNlIHRoYXQgaXMgbW9sZGVkIGFnYWluc3QgdGhlIE5vZGUuanMKICAgKiBgRXZlbnRFbWl0dGVyYCBpbnRlcmZhY2UuCiAgICoKICAgKiBAY29uc3RydWN0b3IKICAgKiBAcHVibGljCiAgICovCiAgZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkgewogICAgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpOwogICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwOwogIH0KCiAgLyoqCiAgICogUmV0dXJuIGFuIGFycmF5IGxpc3RpbmcgdGhlIGV2ZW50cyBmb3Igd2hpY2ggdGhlIGVtaXR0ZXIgaGFzIHJlZ2lzdGVyZWQKICAgKiBsaXN0ZW5lcnMuCiAgICoKICAgKiBAcmV0dXJucyB7QXJyYXl9CiAgICogQHB1YmxpYwogICAqLwogIEV2ZW50RW1pdHRlci5wcm90b3R5cGUuZXZlbnROYW1lcyA9IGZ1bmN0aW9uIGV2ZW50TmFtZXMoKSB7CiAgICB2YXIgbmFtZXMgPSBbXSwKICAgICAgZXZlbnRzLAogICAgICBuYW1lOwogICAgaWYgKHRoaXMuX2V2ZW50c0NvdW50ID09PSAwKSByZXR1cm4gbmFtZXM7CiAgICBmb3IgKG5hbWUgaW4gZXZlbnRzID0gdGhpcy5fZXZlbnRzKSB7CiAgICAgIGlmIChoYXMuY2FsbChldmVudHMsIG5hbWUpKSBuYW1lcy5wdXNoKHByZWZpeCA/IG5hbWUuc2xpY2UoMSkgOiBuYW1lKTsKICAgIH0KICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7CiAgICAgIHJldHVybiBuYW1lcy5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhldmVudHMpKTsKICAgIH0KICAgIHJldHVybiBuYW1lczsKICB9OwoKICAvKioKICAgKiBSZXR1cm4gdGhlIGxpc3RlbmVycyByZWdpc3RlcmVkIGZvciBhIGdpdmVuIGV2ZW50LgogICAqCiAgICogQHBhcmFtIHsoU3RyaW5nfFN5bWJvbCl9IGV2ZW50IFRoZSBldmVudCBuYW1lLgogICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIHJlZ2lzdGVyZWQgbGlzdGVuZXJzLgogICAqIEBwdWJsaWMKICAgKi8KICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uIGxpc3RlbmVycyhldmVudCkgewogICAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQsCiAgICAgIGhhbmRsZXJzID0gdGhpcy5fZXZlbnRzW2V2dF07CiAgICBpZiAoIWhhbmRsZXJzKSByZXR1cm4gW107CiAgICBpZiAoaGFuZGxlcnMuZm4pIHJldHVybiBbaGFuZGxlcnMuZm5dOwogICAgZm9yICh2YXIgaSA9IDAsIGwgPSBoYW5kbGVycy5sZW5ndGgsIGVlID0gbmV3IEFycmF5KGwpOyBpIDwgbDsgaSsrKSB7CiAgICAgIGVlW2ldID0gaGFuZGxlcnNbaV0uZm47CiAgICB9CiAgICByZXR1cm4gZWU7CiAgfTsKCiAgLyoqCiAgICogUmV0dXJuIHRoZSBudW1iZXIgb2YgbGlzdGVuZXJzIGxpc3RlbmluZyB0byBhIGdpdmVuIGV2ZW50LgogICAqCiAgICogQHBhcmFtIHsoU3RyaW5nfFN5bWJvbCl9IGV2ZW50IFRoZSBldmVudCBuYW1lLgogICAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBudW1iZXIgb2YgbGlzdGVuZXJzLgogICAqIEBwdWJsaWMKICAgKi8KICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbiBsaXN0ZW5lckNvdW50KGV2ZW50KSB7CiAgICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudCwKICAgICAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW2V2dF07CiAgICBpZiAoIWxpc3RlbmVycykgcmV0dXJuIDA7CiAgICBpZiAobGlzdGVuZXJzLmZuKSByZXR1cm4gMTsKICAgIHJldHVybiBsaXN0ZW5lcnMubGVuZ3RoOwogIH07CgogIC8qKgogICAqIENhbGxzIGVhY2ggb2YgdGhlIGxpc3RlbmVycyByZWdpc3RlcmVkIGZvciBhIGdpdmVuIGV2ZW50LgogICAqCiAgICogQHBhcmFtIHsoU3RyaW5nfFN5bWJvbCl9IGV2ZW50IFRoZSBldmVudCBuYW1lLgogICAqIEByZXR1cm5zIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlIGV2ZW50IGhhZCBsaXN0ZW5lcnMsIGVsc2UgYGZhbHNlYC4KICAgKiBAcHVibGljCiAgICovCiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdChldmVudCwgYTEsIGEyLCBhMywgYTQsIGE1KSB7CiAgICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDsKICAgIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHJldHVybiBmYWxzZTsKICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbZXZ0XSwKICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aCwKICAgICAgYXJncywKICAgICAgaTsKICAgIGlmIChsaXN0ZW5lcnMuZm4pIHsKICAgICAgaWYgKGxpc3RlbmVycy5vbmNlKSB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcnMuZm4sIHVuZGVmaW5lZCwgdHJ1ZSk7CiAgICAgIHN3aXRjaCAobGVuKSB7CiAgICAgICAgY2FzZSAxOgogICAgICAgICAgcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0KSwgdHJ1ZTsKICAgICAgICBjYXNlIDI6CiAgICAgICAgICByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExKSwgdHJ1ZTsKICAgICAgICBjYXNlIDM6CiAgICAgICAgICByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiksIHRydWU7CiAgICAgICAgY2FzZSA0OgogICAgICAgICAgcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIsIGEzKSwgdHJ1ZTsKICAgICAgICBjYXNlIDU6CiAgICAgICAgICByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMsIGE0KSwgdHJ1ZTsKICAgICAgICBjYXNlIDY6CiAgICAgICAgICByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMsIGE0LCBhNSksIHRydWU7CiAgICAgIH0KICAgICAgZm9yIChpID0gMSwgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTsgaSA8IGxlbjsgaSsrKSB7CiAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07CiAgICAgIH0KICAgICAgbGlzdGVuZXJzLmZuLmFwcGx5KGxpc3RlbmVycy5jb250ZXh0LCBhcmdzKTsKICAgIH0gZWxzZSB7CiAgICAgIHZhciBsZW5ndGggPSBsaXN0ZW5lcnMubGVuZ3RoLAogICAgICAgIGo7CiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykgewogICAgICAgIGlmIChsaXN0ZW5lcnNbaV0ub25jZSkgdGhpcy5yZW1vdmVMaXN0ZW5lcihldmVudCwgbGlzdGVuZXJzW2ldLmZuLCB1bmRlZmluZWQsIHRydWUpOwogICAgICAgIHN3aXRjaCAobGVuKSB7CiAgICAgICAgICBjYXNlIDE6CiAgICAgICAgICAgIGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0KTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICBjYXNlIDI6CiAgICAgICAgICAgIGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0LCBhMSk7CiAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgY2FzZSAzOgogICAgICAgICAgICBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEsIGEyKTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICBjYXNlIDQ6CiAgICAgICAgICAgIGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0LCBhMSwgYTIsIGEzKTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICBkZWZhdWx0OgogICAgICAgICAgICBpZiAoIWFyZ3MpIGZvciAoaiA9IDEsIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7IGogPCBsZW47IGorKykgewogICAgICAgICAgICAgIGFyZ3NbaiAtIDFdID0gYXJndW1lbnRzW2pdOwogICAgICAgICAgICB9CiAgICAgICAgICAgIGxpc3RlbmVyc1tpXS5mbi5hcHBseShsaXN0ZW5lcnNbaV0uY29udGV4dCwgYXJncyk7CiAgICAgICAgfQogICAgICB9CiAgICB9CiAgICByZXR1cm4gdHJ1ZTsKICB9OwoKICAvKioKICAgKiBBZGQgYSBsaXN0ZW5lciBmb3IgYSBnaXZlbiBldmVudC4KICAgKgogICAqIEBwYXJhbSB7KFN0cmluZ3xTeW1ib2wpfSBldmVudCBUaGUgZXZlbnQgbmFtZS4KICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgbGlzdGVuZXIgZnVuY3Rpb24uCiAgICogQHBhcmFtIHsqfSBbY29udGV4dD10aGlzXSBUaGUgY29udGV4dCB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguCiAgICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gYHRoaXNgLgogICAqIEBwdWJsaWMKICAgKi8KICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gb24oZXZlbnQsIGZuLCBjb250ZXh0KSB7CiAgICByZXR1cm4gYWRkTGlzdGVuZXIodGhpcywgZXZlbnQsIGZuLCBjb250ZXh0LCBmYWxzZSk7CiAgfTsKCiAgLyoqCiAgICogQWRkIGEgb25lLXRpbWUgbGlzdGVuZXIgZm9yIGEgZ2l2ZW4gZXZlbnQuCiAgICoKICAgKiBAcGFyYW0geyhTdHJpbmd8U3ltYm9sKX0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuCiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLgogICAqIEBwYXJhbSB7Kn0gW2NvbnRleHQ9dGhpc10gVGhlIGNvbnRleHQgdG8gaW52b2tlIHRoZSBsaXN0ZW5lciB3aXRoLgogICAqIEByZXR1cm5zIHtFdmVudEVtaXR0ZXJ9IGB0aGlzYC4KICAgKiBAcHVibGljCiAgICovCiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZShldmVudCwgZm4sIGNvbnRleHQpIHsKICAgIHJldHVybiBhZGRMaXN0ZW5lcih0aGlzLCBldmVudCwgZm4sIGNvbnRleHQsIHRydWUpOwogIH07CgogIC8qKgogICAqIFJlbW92ZSB0aGUgbGlzdGVuZXJzIG9mIGEgZ2l2ZW4gZXZlbnQuCiAgICoKICAgKiBAcGFyYW0geyhTdHJpbmd8U3ltYm9sKX0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuCiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gT25seSByZW1vdmUgdGhlIGxpc3RlbmVycyB0aGF0IG1hdGNoIHRoaXMgZnVuY3Rpb24uCiAgICogQHBhcmFtIHsqfSBjb250ZXh0IE9ubHkgcmVtb3ZlIHRoZSBsaXN0ZW5lcnMgdGhhdCBoYXZlIHRoaXMgY29udGV4dC4KICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9uY2UgT25seSByZW1vdmUgb25lLXRpbWUgbGlzdGVuZXJzLgogICAqIEByZXR1cm5zIHtFdmVudEVtaXR0ZXJ9IGB0aGlzYC4KICAgKiBAcHVibGljCiAgICovCiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKGV2ZW50LCBmbiwgY29udGV4dCwgb25jZSkgewogICAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7CiAgICBpZiAoIXRoaXMuX2V2ZW50c1tldnRdKSByZXR1cm4gdGhpczsKICAgIGlmICghZm4pIHsKICAgICAgY2xlYXJFdmVudCh0aGlzLCBldnQpOwogICAgICByZXR1cm4gdGhpczsKICAgIH0KICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbZXZ0XTsKICAgIGlmIChsaXN0ZW5lcnMuZm4pIHsKICAgICAgaWYgKGxpc3RlbmVycy5mbiA9PT0gZm4gJiYgKCFvbmNlIHx8IGxpc3RlbmVycy5vbmNlKSAmJiAoIWNvbnRleHQgfHwgbGlzdGVuZXJzLmNvbnRleHQgPT09IGNvbnRleHQpKSB7CiAgICAgICAgY2xlYXJFdmVudCh0aGlzLCBldnQpOwogICAgICB9CiAgICB9IGVsc2UgewogICAgICBmb3IgKHZhciBpID0gMCwgZXZlbnRzID0gW10sIGxlbmd0aCA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykgewogICAgICAgIGlmIChsaXN0ZW5lcnNbaV0uZm4gIT09IGZuIHx8IG9uY2UgJiYgIWxpc3RlbmVyc1tpXS5vbmNlIHx8IGNvbnRleHQgJiYgbGlzdGVuZXJzW2ldLmNvbnRleHQgIT09IGNvbnRleHQpIHsKICAgICAgICAgIGV2ZW50cy5wdXNoKGxpc3RlbmVyc1tpXSk7CiAgICAgICAgfQogICAgICB9CgogICAgICAvLwogICAgICAvLyBSZXNldCB0aGUgYXJyYXksIG9yIHJlbW92ZSBpdCBjb21wbGV0ZWx5IGlmIHdlIGhhdmUgbm8gbW9yZSBsaXN0ZW5lcnMuCiAgICAgIC8vCiAgICAgIGlmIChldmVudHMubGVuZ3RoKSB0aGlzLl9ldmVudHNbZXZ0XSA9IGV2ZW50cy5sZW5ndGggPT09IDEgPyBldmVudHNbMF0gOiBldmVudHM7ZWxzZSBjbGVhckV2ZW50KHRoaXMsIGV2dCk7CiAgICB9CiAgICByZXR1cm4gdGhpczsKICB9OwoKICAvKioKICAgKiBSZW1vdmUgYWxsIGxpc3RlbmVycywgb3IgdGhvc2Ugb2YgdGhlIHNwZWNpZmllZCBldmVudC4KICAgKgogICAqIEBwYXJhbSB7KFN0cmluZ3xTeW1ib2wpfSBbZXZlbnRdIFRoZSBldmVudCBuYW1lLgogICAqIEByZXR1cm5zIHtFdmVudEVtaXR0ZXJ9IGB0aGlzYC4KICAgKiBAcHVibGljCiAgICovCiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbiByZW1vdmVBbGxMaXN0ZW5lcnMoZXZlbnQpIHsKICAgIHZhciBldnQ7CiAgICBpZiAoZXZlbnQpIHsKICAgICAgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDsKICAgICAgaWYgKHRoaXMuX2V2ZW50c1tldnRdKSBjbGVhckV2ZW50KHRoaXMsIGV2dCk7CiAgICB9IGVsc2UgewogICAgICB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRzKCk7CiAgICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDsKICAgIH0KICAgIHJldHVybiB0aGlzOwogIH07CgogIC8vCiAgLy8gQWxpYXMgbWV0aG9kcyBuYW1lcyBiZWNhdXNlIHBlb3BsZSByb2xsIGxpa2UgdGhhdC4KICAvLwogIEV2ZW50RW1pdHRlci5wcm90b3R5cGUub2ZmID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lcjsKICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbjsKCiAgLy8KICAvLyBFeHBvc2UgdGhlIHByZWZpeC4KICAvLwogIEV2ZW50RW1pdHRlci5wcmVmaXhlZCA9IHByZWZpeDsKCiAgLy8KICAvLyBBbGxvdyBgRXZlbnRFbWl0dGVyYCB0byBiZSBpbXBvcnRlZCBhcyBtb2R1bGUgbmFtZXNwYWNlLgogIC8vCiAgRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjsKCiAgLy8KICAvLyBFeHBvc2UgdGhlIG1vZHVsZS4KICAvLwogIHsKICAgIG1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyOwogIH0KfSkoZXZlbnRlbWl0dGVyMyk7CnZhciBldmVudGVtaXR0ZXIzRXhwb3J0cyA9IGV2ZW50ZW1pdHRlcjMuZXhwb3J0czsKdmFyIEV2ZW50RW1pdHRlciA9IC8qQF9fUFVSRV9fKi9nZXREZWZhdWx0RXhwb3J0RnJvbUNqcyhldmVudGVtaXR0ZXIzRXhwb3J0cyk7CgovKioNCiAqIEV2ZW50RW1pdHRlciBmcm9tIGV2ZW50ZW1pdHRlcjMNCiAqDQogKiBTZWU6IHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vcHJpbXVzL2V2ZW50ZW1pdHRlcjMgZXZlbnRlbWl0dGVyM30NCiAqDQogKiBVbml0IFRlc3Q6IHtAbGluayBodHRwczovL2dpdGh1Yi5jb20veXVkYS1seXUvd3NlbWkvYmxvYi9tYXN0ZXIvdGVzdC9ldmVtLnRlc3QubWpzIEdpdGh1Yn0NCiAqIEBtZW1iZXJPZiB3c2VtaQ0KICogQGV4YW1wbGUNCiAqDQogKiBsZXQgZXYgPSB3c2VtaS5ldmVtKCkNCiAqIGV2Lm9uKCdldk5hbWUnLGZ1bmN0aW9uKG1zZyl7DQogKiAgICAgY29uc29sZS5sb2cobXNnKQ0KICogICAgIC8vID0+IHthYmM6IDEyLjM0fQ0KICogfSkNCiAqIGxldCBkYXRhID0ge2FiYzoxMi4zNH0NCiAqIGV2LmVtaXQoJ2V2TmFtZScsZGF0YSkNCiAqDQogKi8KZnVuY3Rpb24gZXZlbSgpIHsKICByZXR1cm4gbmV3IEV2ZW50RW1pdHRlcigpOwp9CgpsZXQgY2hhcnMgPSAnMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonLnNwbGl0KCcnKTsKbGV0IHJhZGl4ID0gY2hhcnMubGVuZ3RoOwoKLyoqDQogKiDnlKLnlJ/pmqjmqZ9pZA0KICoNCiAqIFVuaXQgVGVzdDoge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS95dWRhLWx5dS93c2VtaS9ibG9iL21hc3Rlci90ZXN0L2dlbklELnRlc3QubWpzIEdpdGh1Yn0NCiAqIEBtZW1iZXJPZiB3c2VtaQ0KICogQHBhcmFtIHtJbnRlZ2VyfSBbbGVuPTMyXSDovLjlhaV1dWlk6ZW35bqm77yM54K65q2j5pW05pW477yM6aCQ6KitMzINCiAqIEByZXR1cm5zIHtTdHJpbmd9IOWbnuWCs3V1aWTlrZfkuLINCiAqIEBleGFtcGxlDQogKg0KICogY29uc29sZS5sb2coZ2VuSUQoKSkNCiAqIC8vID0+IElzMU55SW1VM0E5ZnlxRnlZQld1SnU0aXZYWGNHWkFiIChpcyByYW5kb20pDQogKg0KICovCmZ1bmN0aW9uIGdlbklEKGxlbiA9IDMyKSB7CiAgbGV0IHV1aWQgPSBbXTsKCiAgLy9jaGVjawogIGlmIChpc3BpbnQobGVuKSkgewogICAgbGVuID0gY2ludChsZW4pOwogIH0gZWxzZSB7CiAgICBsZW4gPSAzMjsKICB9CgogIC8vdXVpZAogIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHV1aWRbaV0gPSBjaGFyc1swIHwgTWF0aC5yYW5kb20oKSAqIHJhZGl4XTsKCiAgLy9yZmM0MTIyLCB2ZXJzaW9uIDQgZm9ybQogIC8vIC8vcmVxdWlyZXMgdGhlc2UgY2hhcmFjdGVycwogIC8vIHV1aWRbOF0gPSB1dWlkWzEzXSA9IHV1aWRbMThdID0gdXVpZFsyM10gPSAnLScKICAvLyB1dWlkWzE0XSA9ICc0JwogIC8vIC8vZmlsbCBpbiByYW5kb20gZGF0YS4gIEF0IGk9PTE5IHNldCB0aGUgaGlnaCBiaXRzIG9mIGNsb2NrIHNlcXVlbmNlIGFzIHBlciByZmM0MTIyLCBzZWMuIDQuMS41CiAgLy8gbGV0IHIKICAvLyBmb3IgKGkgPSAwOyBpIDwgMzY7IGkrKykgewogIC8vICAgICBpZiAoIXV1aWRbaV0pIHsKICAvLyAgICAgICAgIHIgPSAwIHwgTWF0aC5yYW5kb20oKSAqIDE2CiAgLy8gICAgICAgICB1dWlkW2ldID0gY2hhcnNbKGkgPT09IDE5KSA/IChyICYgMHgzKSB8IDB4OCA6IHJdCiAgLy8gICAgIH0KICAvLyB9CgogIGxldCByID0gdXVpZC5qb2luKCcnKTsKICByZXR1cm4gcjsKfQoKLyoqDQogKiDnlKLnlJ9Qcm9taXNl54mp5Lu277yM5YW35YKZ6Y+I5byPcmVzb2x2ZeiIh3JlamVjdA0KICog5Li76KaB5Y+XalF1ZXJ5IERlZmVycmVk5qaC5b+15ZWf55m8DQogKg0KICogVW5pdCBUZXN0OiB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL3l1ZGEtbHl1L3dzZW1pL2Jsb2IvbWFzdGVyL3Rlc3QvZ2VuUG0udGVzdC5tanMgR2l0aHVifQ0KICogQG1lbWJlck9mIHdzZW1pDQogKiBAcmV0dXJucyB7T2JqZWN0fSDlm57lgrNQcm9taXNl54mp5Lu2DQogKiBAZXhhbXBsZQ0KICoNCiAqIGFzeW5jIGZ1bmN0aW9uIHRvcEFzeW5jKCkgew0KICoNCiAqICAgICBmdW5jdGlvbiB0ZXN0MSgpIHsNCiAqICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHsNCiAqICAgICAgICAgICAgIGxldCBtcyA9IFtdDQogKg0KICogICAgICAgICAgICAgbGV0IGZuID0gZnVuY3Rpb24obmFtZSkgew0KICogICAgICAgICAgICAgICAgIGxldCBwbSA9IGdlblBtKCkNCiAqICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgew0KICogICAgICAgICAgICAgICAgICAgICBtcy5wdXNoKCdyZXNvbHZlOiAnICsgbmFtZSkNCiAqICAgICAgICAgICAgICAgICAgICAgcG0ucmVzb2x2ZSgncmVzb2x2ZTogJyArIG5hbWUpDQogKiAgICAgICAgICAgICAgICAgfSwgMSkNCiAqICAgICAgICAgICAgICAgICByZXR1cm4gcG0NCiAqICAgICAgICAgICAgIH0NCiAqDQogKiAgICAgICAgICAgICBmbignYWJjJykNCiAqICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihtc2cpIHsNCiAqICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3QxIHRoZW4nLCBtc2cpDQogKiAgICAgICAgICAgICAgICAgICAgIG1zLnB1c2goJ3QxIHRoZW46ICcgKyBtc2cpDQogKiAgICAgICAgICAgICAgICAgfSkNCiAqICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24obXNnKSB7DQogKiAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0MSBjYXRjaCcsIG1zZykNCiAqICAgICAgICAgICAgICAgICAgICAgbXMucHVzaCgndDEgY2F0Y2g6ICcgKyBtc2cpDQogKiAgICAgICAgICAgICAgICAgfSkNCiAqICAgICAgICAgICAgICAgICAuZmluYWxseSgoKSA9PiB7DQogKiAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobXMpDQogKiAgICAgICAgICAgICAgICAgfSkNCiAqDQogKiAgICAgICAgIH0pDQogKiAgICAgfQ0KICogICAgIGNvbnNvbGUubG9nKCd0ZXN0MScpDQogKiAgICAgbGV0IHIxID0gYXdhaXQgdGVzdDEoKQ0KICogICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHIxKSkNCiAqICAgICAvLyB0ZXN0MQ0KICogICAgIC8vIHQxIHRoZW4gcmVzb2x2ZTogYWJjDQogKiAgICAgLy8gWyJyZXNvbHZlOiBhYmMiLCJ0MSB0aGVuOiByZXNvbHZlOiBhYmMiXQ0KICoNCiAqICAgICBmdW5jdGlvbiB0ZXN0MigpIHsNCiAqICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHsNCiAqICAgICAgICAgICAgIGxldCBtcyA9IFtdDQogKg0KICogICAgICAgICAgICAgbGV0IGZuID0gZnVuY3Rpb24obmFtZSkgew0KICogICAgICAgICAgICAgICAgIGxldCBwbSA9IGdlblBtKCkNCiAqICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgew0KICogICAgICAgICAgICAgICAgICAgICBtcy5wdXNoKCdyZWplY3Q6ICcgKyBuYW1lKQ0KICogICAgICAgICAgICAgICAgICAgICBwbS5yZWplY3QoJ3JlamVjdDogJyArIG5hbWUpDQogKiAgICAgICAgICAgICAgICAgfSwgMSkNCiAqICAgICAgICAgICAgICAgICByZXR1cm4gcG0NCiAqICAgICAgICAgICAgIH0NCiAqDQogKiAgICAgICAgICAgICBmbignYWJjJykNCiAqICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihtc2cpIHsNCiAqICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3QxIHRoZW4nLCBtc2cpDQogKiAgICAgICAgICAgICAgICAgICAgIG1zLnB1c2goJ3QxIHRoZW46ICcgKyBtc2cpDQogKiAgICAgICAgICAgICAgICAgfSkNCiAqICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24obXNnKSB7DQogKiAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0MSBjYXRjaCcsIG1zZykNCiAqICAgICAgICAgICAgICAgICAgICAgbXMucHVzaCgndDEgY2F0Y2g6ICcgKyBtc2cpDQogKiAgICAgICAgICAgICAgICAgfSkNCiAqICAgICAgICAgICAgICAgICAuZmluYWxseSgoKSA9PiB7DQogKiAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobXMpDQogKiAgICAgICAgICAgICAgICAgfSkNCiAqDQogKiAgICAgICAgIH0pDQogKiAgICAgfQ0KICogICAgIGNvbnNvbGUubG9nKCd0ZXN0MicpDQogKiAgICAgbGV0IHIyID0gYXdhaXQgdGVzdDIoKQ0KICogICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHIyKSkNCiAqICAgICAvLyB0ZXN0Mg0KICogICAgIC8vIHQxIGNhdGNoIHJlamVjdDogYWJjDQogKiAgICAgLy8gWyJyZWplY3Q6IGFiYyIsInQxIGNhdGNoOiByZWplY3Q6IGFiYyJdDQogKg0KICogfQ0KICogdG9wQXN5bmMoKS5jYXRjaCgoKSA9PiB7fSkNCiAqDQogKi8KZnVuY3Rpb24gZ2VuUG0oKSB7CiAgbGV0IHJlc29sdmU7CiAgbGV0IHJlamVjdDsKICBsZXQgcCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uICgpIHsKICAgIHJlc29sdmUgPSBhcmd1bWVudHNbMF07CiAgICByZWplY3QgPSBhcmd1bWVudHNbMV07CiAgfSk7CiAgcC5yZXNvbHZlID0gcmVzb2x2ZTsKICBwLnJlamVjdCA9IHJlamVjdDsKICByZXR1cm4gcDsKfQoKLyoqDQogKiDliKTmlrfmmK/lkKbngrrlh73mlbgNCiAqDQogKiBVbml0IFRlc3Q6IHtAbGluayBodHRwczovL2dpdGh1Yi5jb20veXVkYS1seXUvd3NlbWkvYmxvYi9tYXN0ZXIvdGVzdC9pc2Z1bi50ZXN0Lm1qcyBHaXRodWJ9DQogKiBAbWVtYmVyT2Ygd3NlbWkNCiAqIEBwYXJhbSB7Kn0gdiDovLjlhaXku7vmhI/os4fmlpkNCiAqIEByZXR1cm5zIHtCb29sZWFufSDlm57lgrPliKTmlrfluIPmnpflgLwNCiAqIEBleGFtcGxlDQogKg0KICogY29uc29sZS5sb2coaXNmdW4oJzEuMjUnKSkNCiAqIC8vID0+IGZhbHNlDQogKg0KICogY29uc29sZS5sb2coaXNmdW4oZnVuY3Rpb24oKSB7fSkpDQogKiAvLyA9PiB0cnVlDQogKg0KICovCmZ1bmN0aW9uIGlzZnVuKHYpIHsKICBsZXQgYyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2KTsKICByZXR1cm4gYyA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJyB8fCBjID09PSAnW29iamVjdCBBc3luY0Z1bmN0aW9uXSc7Cn0KCi8qKg0KICog5Yik5pa35piv5ZCm54K6UHJvbWlzZQ0KICoNCiAqIFVuaXQgVGVzdDoge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS95dWRhLWx5dS93c2VtaS9ibG9iL21hc3Rlci90ZXN0L2lzcG0udGVzdC5tanMgR2l0aHVifQ0KICogQG1lbWJlck9mIHdzZW1pDQogKiBAcGFyYW0geyp9IHYg6Ly45YWl5Lu75oSP6LOH5paZDQogKiBAcmV0dXJucyB7Qm9vbGVhbn0g5Zue5YKz5Yik5pa35biD5p6X5YC8DQogKiBAZXhhbXBsZQ0KICoNCiAqIGNvbnNvbGUubG9nKGlzcG0oJzEuMjUnKSkNCiAqIC8vID0+IGZhbHNlDQogKg0KICogY29uc29sZS5sb2coaXNwbShuZXcgUHJvbWlzZShmdW5jdGlvbigpIHt9KSkpDQogKiAvLyA9PiB0cnVlDQogKg0KICovCmZ1bmN0aW9uIGlzcG0odikgewogIGxldCBiOwogIGxldCBjID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHYpOwogIGIgPSBjID09PSAnW29iamVjdCBQcm9taXNlXSc7CiAgaWYgKGIpIHsKICAgIHJldHVybiB0cnVlOyAvL+iLpeeCultvYmplY3QgUHJvbWlzZV3liYfnm7TmjqXlm57lgrN0cnVlCiAgfQogIGlmIChjICE9PSAnW29iamVjdCBGdW5jdGlvbl0nKSB7CiAgICByZXR1cm4gZmFsc2U7IC8v6Iul5LiN5pivW29iamVjdCBQcm9taXNlXeS5n+S4jeaYr1tvYmplY3QgRnVuY3Rpb25d5YmH55u05o6l5Zue5YKzZmFsc2UKICB9CiAgdHJ5IHsKICAgIGIgPSB0eXBlb2Ygdi5zdWJzY3JpYmUgIT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHYudGhlbiA9PT0gJ2Z1bmN0aW9uJzsgLy/lj6/lgbXmuKxhc3luYyBmdW5jdGlvbgogIH0gY2F0Y2ggKGVycikge30KICByZXR1cm4gYjsKfQoKLyoqDQogKiDnrYnlvoVm5Ye95pW45Zue5YKzdHJ1ZQ0KICoNCiAqIFVuaXQgVGVzdDoge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS95dWRhLWx5dS93c2VtaS9ibG9iL21hc3Rlci90ZXN0L3dhaXRGdW4udGVzdC5tanMgR2l0aHVifQ0KICogQG1lbWJlck9mIHdzZW1pDQogKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW4g6Ly45YWl5Yik5pa355So5Ye95pW4DQogKiBAcGFyYW0ge09iamVjdH0gb3B0IOi8uOWFpeioreWumueJqeS7tu+8jOmgkOiorXt9DQogKiBAcGFyYW0ge0ludGVnZXJ9IFtvcHQuYXR0ZW1wdE51bT0yMDBdIOi8uOWFpeacgOWkp+WYl+ippuasoeaVuO+8jOeCuuato+aVtOaVuO+8jOmgkOiorTIwMA0KICogQHBhcmFtIHtJbnRlZ2VyfSBbb3B0LnRpbWVJbnRlcnZhbD0xMDAwXSDovLjlhaXlmJfoqabmmYLplpPpgLHmnJ/vvIzngrrmraPmlbTmlbjvvIzllq7kvY3ngrptc++8jOmgkOiorTEwMDANCiAqIEByZXR1cm5zIHtQcm9taXNlfSDlm57lgrNQcm9taXNl77yMcmVzb2x2ZeWbnuWCs+eCuuepuuS7o+ihqGblh73mlbjlm57lgrN0cnVl5oiW6LaF6YGO5pyA5aSn5ZiX6Kmm5qyh5pW477yMcmVqZWN05Zue5YKz6Yyv6Kqk6KiK5oGvDQogKiBAZXhhbXBsZQ0KICoNCiAqIGFzeW5jIGZ1bmN0aW9uIHRvcEFzeW5jKCkgew0KICoNCiAqICAgICBmdW5jdGlvbiB0ZXN0MSgpIHsNCiAqICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHsNCiAqICAgICAgICAgICAgIGxldCBtcyA9IFtdDQogKg0KICogICAgICAgICAgICAgbGV0IGkgPSAwDQogKiAgICAgICAgICAgICB3YWl0RnVuKGZ1bmN0aW9uKCkgew0KICogICAgICAgICAgICAgICAgIGkrKw0KICogICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3YWl0aW5nOiAnICsgaSkNCiAqICAgICAgICAgICAgICAgICBtcy5wdXNoKCd3YWl0aW5nOiAnICsgaSkNCiAqICAgICAgICAgICAgICAgICByZXR1cm4gaSA+PSAyDQogKiAgICAgICAgICAgICB9KQ0KICogICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkgew0KICogICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGVzdDEgdGhlbicpDQogKiAgICAgICAgICAgICAgICAgICAgIG1zLnB1c2goJ3Rlc3QxIHRoZW4nKQ0KICogICAgICAgICAgICAgICAgIH0pDQogKg0KICogICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsNCiAqICAgICAgICAgICAgICAgICByZXNvbHZlKG1zKQ0KICogICAgICAgICAgICAgfSwgMTEwMCkNCiAqDQogKiAgICAgICAgIH0pDQogKiAgICAgfQ0KICogICAgIGNvbnNvbGUubG9nKCd0ZXN0MScpDQogKiAgICAgbGV0IHIxID0gYXdhaXQgdGVzdDEoKQ0KICogICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHIxKSkNCiAqICAgICAvLyB0ZXN0MQ0KICogICAgIC8vIHdhaXRpbmc6IDENCiAqICAgICAvLyB3YWl0aW5nOiAyDQogKiAgICAgLy8gdGVzdDEgdGhlbg0KICogICAgIC8vIFsid2FpdGluZzogMSIsIndhaXRpbmc6IDIiLCJ0ZXN0MSB0aGVuIl0NCiAqDQogKiAgICAgZnVuY3Rpb24gdGVzdDIoKSB7DQogKiAgICAgICAgIGxldCBtcyA9IFtdDQogKiAgICAgICAgIGxldCBpID0gMA0KICoNCiAqICAgICAgICAgbGV0IGYgPSAoKSA9PiB7DQogKiAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gew0KICogICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7DQogKiAgICAgICAgICAgICAgICAgICAgIGkrKw0KICogICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnd2FpdGluZzogJyArIGkpDQogKiAgICAgICAgICAgICAgICAgICAgIG1zLnB1c2goJ3dhaXRpbmc6ICcgKyBpKQ0KICogICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGkgPj0gMikNCiAqICAgICAgICAgICAgICAgICB9LCAxMTAwKQ0KICogICAgICAgICAgICAgfSkNCiAqICAgICAgICAgfQ0KICoNCiAqICAgICAgICAgcmV0dXJuIHdhaXRGdW4oZikNCiAqICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkgew0KICogICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0ZXN0MiB0aGVuJykNCiAqICAgICAgICAgICAgICAgICBtcy5wdXNoKCd0ZXN0MiB0aGVuJykNCiAqICAgICAgICAgICAgICAgICByZXR1cm4gbXMNCiAqICAgICAgICAgICAgIH0pDQogKg0KICogICAgIH0NCiAqICAgICBjb25zb2xlLmxvZygndGVzdDInKQ0KICogICAgIGxldCByMiA9IGF3YWl0IHRlc3QyKCkNCiAqICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyMikpDQogKiAgICAgLy8gdGVzdDINCiAqICAgICAvLyB3YWl0aW5nOiAxDQogKiAgICAgLy8gd2FpdGluZzogMg0KICogICAgIC8vIHRlc3QyIHRoZW4NCiAqICAgICAvLyBbIndhaXRpbmc6IDEiLCJ3YWl0aW5nOiAyIiwidGVzdDIgdGhlbiJdDQogKiAgICAgLy8gd2FpdGluZzogMw0KICoNCiAqIH0NCiAqIHRvcEFzeW5jKCkuY2F0Y2goKCkgPT4ge30pDQogKg0KICovCmFzeW5jIGZ1bmN0aW9uIHdhaXRGdW4oZnVuLCBvcHQgPSB7fSkgewogIGxldCByID0gbnVsbDsKCiAgLy9wbQogIGxldCBwbSA9IGdlblBtKCk7CgogIC8vY2hlY2sKICBpZiAoIWlzZnVuKGZ1bikpIHsKICAgIHBtLnJlamVjdCgnd2FpdGZ1bmN0aW9u6ZyA6Ly45YWl5Ye95pW4ZicpOwogICAgcmV0dXJuIHBtOwogIH0KCiAgLy9mdW5jCiAgbGV0IGZ1bmMgPSBhc3luYyAoKSA9PiB7CiAgICBsZXQgciA9IGZ1bigpOwogICAgaWYgKGlzcG0ocikpIHsKICAgICAgciA9IGF3YWl0IHI7CiAgICB9CiAgICByZXR1cm4gcjsKICB9OwoKICAvL2ltbWVkaWF0ZSBjYWxsCiAgciA9IGF3YWl0IGZ1bmMoKTsKICBpZiAociA9PT0gdHJ1ZSkgewogICAgcG0ucmVzb2x2ZSgpOwogICAgcmV0dXJuIHBtOwogIH0KCiAgLy9hdHRlbXB0TnVtCiAgbGV0IGF0dGVtcHROdW0gPSBnZXQob3B0LCAnYXR0ZW1wdE51bScsIG51bGwpOwogIGlmICghaXNwaW50KGF0dGVtcHROdW0pKSB7CiAgICBhdHRlbXB0TnVtID0gMjAwOwogIH0KCiAgLy90aW1lSW50ZXJ2YWwKICBsZXQgdGltZUludGVydmFsID0gZ2V0KG9wdCwgJ3RpbWVJbnRlcnZhbCcsIG51bGwpOwogIGlmICghaXNwaW50KHRpbWVJbnRlcnZhbCkpIHsKICAgIHRpbWVJbnRlcnZhbCA9IDEwMDA7CiAgfQoKICAvL3NldEludGVydmFsCiAgbGV0IG4gPSAwOwogIGxldCB0ID0gc2V0SW50ZXJ2YWwoYXN5bmMgKCkgPT4gewogICAgbiArPSAxOwogICAgLy9jb25zb2xlLmxvZygnd2FpdEZ1bjogJywgbikKCiAgICByID0gYXdhaXQgZnVuYygpOwogICAgaWYgKHIgPT09IHRydWUpIHsKICAgICAgLy9jb25zb2xlLmxvZygncmVzb2x2ZScsIG4pCiAgICAgIGNsZWFySW50ZXJ2YWwodCk7CiAgICAgIHBtLnJlc29sdmUoKTsKICAgIH0KICAgIGlmIChuID4gYXR0ZW1wdE51bSkgewogICAgICAvL2NvbnNvbGUubG9nKCdyZWplY3QnLCBuLCBhdHRlbXB0TnVtKQogICAgICBjbGVhckludGVydmFsKHQpOwogICAgICBwbS5yZWplY3QoYGV4Y2VlZGVkIGF0dGVtcHROdW1bJHthdHRlbXB0TnVtfV1gKTsgLy/lt7LotoXpgY7mnIDlpKfmrKHmlbgKICAgIH0KICB9LCB0aW1lSW50ZXJ2YWwpOwogIHJldHVybiBwbTsKfQoKLyoqDQogKiDlu7rnq4vkuIDlgIsgTVFUVCDlrqLmiLbnq6/vvIzmlK/mj7TmjIHkuYXpgKPnt5rjgIFUb2tlbiDpqZforYnjgIHoh6rli5Xph43pgKPjgIHoqILplrHoiIfnmbzkvYjlip/og70NCiAqDQogKiBAcGFyYW0ge09iamVjdH0gW29wdD17fV0gLSDoqK3lrprpgbjpoIUNCiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0LnVybD0nbXF0dDovL2xvY2FsaG9zdCddIC0gTVFUVCBicm9rZXIg6YCj57eaIFVSTA0KICogQHBhcmFtIHtOdW1iZXJ9IFtvcHQucG9ydD04MDgwXSAtIEJyb2tlciDpgKPnt5ogcG9ydA0KICogQHBhcmFtIHtTdHJpbmd9IFtvcHQudG9rZW49JyddIC0g6YCj57ea5pmC55So5L6G6amX6K2J55qEIFRva2VuDQogKiBAcGFyYW0ge1N0cmluZ30gW29wdC5jbGllbnRJZF0gLSDmjIflrpogQ2xpZW50IElE77yM6Iul5pyq5oyH5a6a5YmH6Ieq5YuV55Si55SfDQogKiBAcGFyYW0ge051bWJlcn0gW29wdC50aW1lUmVjb25uZWN0PTIwMDBdIC0g5pa357ea5b6M6YeN5paw6YCj57ea55qE6ZaT6ZqU5pmC6ZaT77yI5q+r56eS77yJDQogKiBAcmV0dXJucyB7T2JqZWN0fSAtIOWCs+WbnuS4gOWAi+WFt+aciSBgc3Vic2NyaWJlYOOAgWB1bnN1YnNjcmliZWDjgIFgcHVibGlzaGDjgIFgY2xlYXJgIOaWueazleeahOS6i+S7tueJqeS7tg0KICogQGV4YW1wbGUNCiAqDQogKiBpbXBvcnQgdyBmcm9tICd3c2VtaScNCiAqIGltcG9ydCBXUHVic3ViQ2xpZW50IGZyb20gJy4vc3JjL1dQdWJzdWJDbGllbnQubWpzJw0KICogLy8gaW1wb3J0IFdQdWJzdWJDbGllbnQgZnJvbSAnLi9kaXN0L3ctcHVic3ViLWNsaWVudC51bWQuanMnDQogKiAvLyBpbXBvcnQgV1B1YnN1YkNsaWVudCBmcm9tICcuL2Rpc3Qvdy1wdWJzdWItY2xpZW50LndrLnVtZC5qcycNCiAqDQogKiBsZXQgdGVzdCA9IGFzeW5jICgpID0+IHsNCiAqICAgICBsZXQgcG0gPSB3LmdlblBtKCkNCiAqDQogKiAgICAgbGV0IG1zID0gW10NCiAqDQogKiAgICAgbGV0IGNsaWVudElkID0gJ2lkLWZvci1jbGllbnQnDQogKg0KICogICAgIGxldCBvcHQgPSB7DQogKiAgICAgICAgIHBvcnQ6IDgwODAsDQogKiAgICAgICAgIHRva2VuOiAndG9rZW4tZm9yLXRlc3QnLA0KICogICAgICAgICBjbGllbnRJZCwNCiAqICAgICB9DQogKiAgICAgbGV0IHdwYyA9IG5ldyBXUHVic3ViQ2xpZW50KG9wdCkNCiAqICAgICAvLyBjb25zb2xlLmxvZygnd3BjJywgd3BjKQ0KICoNCiAqICAgICBsZXQgdG9waWMgPSAndGFzaycNCiAqDQogKiAgICAgd3BjLm9uKCdjb25uZWN0JywgKCkgPT4gew0KICogICAgICAgICBjb25zb2xlLmxvZygnY29ubmVjdCcpDQogKiAgICAgICAgIG1zLnB1c2goeyBjbGllbnRJZDogYGNvbm5lY3RgIH0pDQogKiAgICAgfSkNCiAqICAgICB3cGMub24oJ3JlY29ubmVjdCcsICgpID0+IHsNCiAqICAgICAgICAgY29uc29sZS5sb2coJ3JlY29ubmVjdCcpDQogKiAgICAgfSkNCiAqICAgICB3cGMub24oJ29mZmxpbmUnLCAoKSA9PiB7DQogKiAgICAgICAgIGNvbnNvbGUubG9nKCdvZmZsaW5lJykNCiAqICAgICB9KQ0KICogICAgIHdwYy5vbignbWVzc2FnZScsICh7IHRvcGljLCBtZXNzYWdlIH0pID0+IHsNCiAqICAgICAgICAgY29uc29sZS5sb2coYG1lc3NhZ2VgLCB0b3BpYywgbWVzc2FnZSkNCiAqICAgICAgICAgbXMucHVzaCh7IGNsaWVudElkOiBgcmVjZWl2ZSB0b3BpY1ske3RvcGljfV0sIG1lc3NhZ2VbJHttZXNzYWdlfV1gIH0pDQogKiAgICAgfSkNCiAqICAgICB3cGMub24oJ2Nsb3NlJywgKCkgPT4gew0KICogICAgICAgICBjb25zb2xlLmxvZygnY2xvc2UnKQ0KICogICAgICAgICBtcy5wdXNoKHsgY2xpZW50SWQ6IGBjbG9zZWAgfSkNCiAqICAgICB9KQ0KICogICAgIHdwYy5vbignZW5kJywgKCkgPT4gew0KICogICAgICAgICBjb25zb2xlLmxvZygnZW5kJykNCiAqICAgICB9KQ0KICogICAgIHdwYy5vbignZXJyb3InLCAoZXJyKSA9PiB7DQogKiAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicsIGVycikNCiAqICAgICB9KQ0KICoNCiAqICAgICBhd2FpdCB3cGMuc3Vic2NyaWJlKHRvcGljLCAyKQ0KICogICAgICAgICAudGhlbigocmVzKSA9PiB7DQogKiAgICAgICAgICAgICBjb25zb2xlLmxvZygnc3Vic2NyaWJlIHRoZW4nLCByZXMpDQogKiAgICAgICAgICAgICBtcy5wdXNoKHsgY2xpZW50SWQ6IGBzdWJzY3JpYmVgLCBzdWJzY3JpcHRpb25zOiBKU09OLnN0cmluZ2lmeShyZXMpIH0pDQogKiAgICAgICAgIH0pDQogKiAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7DQogKiAgICAgICAgICAgICBjb25zb2xlLmxvZygnc3Vic2NyaWJlIGNhdGNoJywgZXJyKQ0KICogICAgICAgICB9KQ0KICoNCiAqICAgICBhd2FpdCB3cGMucHVibGlzaCh0b3BpYywgJ3Jlc3VsdCcsIDIpDQogKiAgICAgICAgIC50aGVuKChyZXMpID0+IHsNCiAqICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwdWJsaXNoIHRoZW4nLCByZXMpDQogKiAgICAgICAgICAgICBtcy5wdXNoKHsgY2xpZW50SWQ6IGBwdWJsaXNoYCwgcmVzIH0pDQogKiAgICAgICAgIH0pDQogKiAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7DQogKiAgICAgICAgICAgICBjb25zb2xlLmxvZygncHVibGlzaCBjYXRjaCcsIGVycikNCiAqICAgICAgICAgfSkNCiAqDQogKiAgICAgc2V0VGltZW91dChhc3luYygpID0+IHsNCiAqICAgICAgICAgYXdhaXQgd3BjLmNsZWFyKCkNCiAqICAgICAgICAgdHJ5IHsgLy/kvb/nlKh3b3JrZXLniYjmmYLopoHlj6blpJblkbzlj6t0ZXJtaW5hdGXkuK3mraINCiAqICAgICAgICAgICAgIHdwYy50ZXJtaW5hdGUoKQ0KICogICAgICAgICB9DQogKiAgICAgICAgIGNhdGNoIChlcnIpIHt9DQogKiAgICAgICAgIGNvbnNvbGUubG9nKCdtcycsIG1zKQ0KICogICAgICAgICBwbS5yZXNvbHZlKG1zKQ0KICogICAgIH0sIDUwMDApDQogKg0KICogICAgIHJldHVybiBwbQ0KICogfQ0KICogYXdhaXQgdGVzdCgpDQogKiAgICAgLmNhdGNoKChlcnIpID0+IHsNCiAqICAgICAgICAgY29uc29sZS5sb2coZXJyKQ0KICogICAgIH0pDQogKiAvLyA9PiBtcyBbDQogKiAvLyAgIHsgY2xpZW50SWQ6ICdjb25uZWN0JyB9LA0KICogLy8gICB7DQogKiAvLyAgICAgY2xpZW50SWQ6ICdzdWJzY3JpYmUnLA0KICogLy8gICAgIHN1YnNjcmlwdGlvbnM6ICdbeyJ0b3BpYyI6InRhc2siLCJxb3MiOjJ9XScNCiAqIC8vICAgfSwNCiAqIC8vICAgeyBjbGllbnRJZDogJ3B1Ymxpc2gnLCByZXM6ICdkb25lJyB9LA0KICogLy8gICB7IGNsaWVudElkOiAncmVjZWl2ZSB0b3BpY1t0YXNrXScgfSwNCiAqIC8vICAgeyBjbGllbnRJZDogJ2Nsb3NlJyB9DQogKiAvLyBdDQogKg0KICovCmZ1bmN0aW9uIFdQdWJzdWJDbGllbnQob3B0ID0ge30pIHsKICAvL2tleU1zZwogIGxldCBrZXlNc2cgPSAnX19tc2dfXyc7CgogIC8vdXJsCiAgbGV0IHVybCA9IGdldChvcHQsICd1cmwnKTsKICBpZiAoIWlzZXN0cih1cmwpKSB7CiAgICB1cmwgPSAnbXF0dDovL2xvY2FsaG9zdCc7CiAgfQoKICAvL3BvcnQKICBsZXQgcG9ydCA9IGdldChvcHQsICdwb3J0Jyk7CiAgaWYgKCFpc3BpbnQocG9ydCkpIHsKICAgIHBvcnQgPSA4MDgwOwogIH0KICBwb3J0ID0gY2ludChwb3J0KTsKCiAgLy90b2tlbgogIGxldCB0b2tlbiA9IGdldChvcHQsICd0b2tlbicpOwogIGlmICghaXNlc3RyKHRva2VuKSkgewogICAgdG9rZW4gPSAnJzsKICB9CgogIC8vY2xpZW50SWQKICBsZXQgY2xpZW50SWQgPSBnZXQob3B0LCAnY2xpZW50SWQnKTsKICBpZiAoIWlzZXN0cihjbGllbnRJZCkpIHsKICAgIGNsaWVudElkID0gYGNsLSR7Z2VuSUQoKX1gOwogIH0KCiAgLy90aW1lUmVjb25uZWN0CiAgbGV0IHRpbWVSZWNvbm5lY3QgPSBnZXQob3B0LCAndGltZVJlY29ubmVjdCcpOwogIGlmICghaXNwaW50KHRpbWVSZWNvbm5lY3QpKSB7CiAgICB0aW1lUmVjb25uZWN0ID0gMjAwMDsKICB9CiAgdGltZVJlY29ubmVjdCA9IGNpbnQodGltZVJlY29ubmVjdCk7CgogIC8vdXJsQnJva2VyCiAgbGV0IHVybEJyb2tlciA9IGAke3VybH06JHtwb3J0fWA7CgogIC8vY2xpZW50CiAgbGV0IGNsaWVudCA9IG1xdHQuY29ubmVjdCh1cmxCcm9rZXIsIHsKICAgIGNsaWVudElkLAogICAgdXNlcm5hbWU6IHRva2VuLAogICAgLy/mj5Dkvpt0b2tlbumpl+itiQogICAgcGFzc3dvcmQ6ICcnLAogICAgLy/kuI3mj5DkvpsKICAgIGNsZWFuOiBmYWxzZSwKICAgIC8v6Kit5a6a5oyB5LmFU2Vzc2lvbijpm6Lnt5roo5zmlLYpCiAgICByZWNvbm5lY3RQZXJpb2Q6IHRpbWVSZWNvbm5lY3QgLy/mlrfnt5rlvozoh6rli5Xph43pgKPmmYLplpMKICB9KTsKCiAgLy9ldgogIGxldCBldiA9IGV2ZW0oKTsKCiAgLy9vbmxpbmUKICBsZXQgb25saW5lID0gZmFsc2U7CgogIC8vY29ubmVjdAogIGNsaWVudC5vbignY29ubmVjdCcsICgpID0+IHsKICAgIC8vIGNvbnNvbGUubG9nKGBjbGllbnQgaW5gLCBjbGllbnRJZCkKICAgIG9ubGluZSA9IHRydWU7CiAgICBldi5lbWl0KCdjb25uZWN0Jyk7CiAgfSk7CgogIC8vcmVjb25uZWN0LCDoh6rli5Xph43pgKPmnJ/plpPmr4/mrKFyZXRyeemDveacg+inuOeZvOS4gOasoQogIGNsaWVudC5vbigncmVjb25uZWN0JywgKCkgPT4gewogICAgLy8gY29uc29sZS5sb2coYGNsaWVudCByZWNvbm5lY3RgLCBjbGllbnRJZCkKICAgIGV2LmVtaXQoJ3JlY29ubmVjdCcpOwogIH0pOwoKICAvL3N1YnNjcmliZQogIGxldCBzdWJzY3JpYmUgPSBhc3luYyAodG9waWMsIHFvcyA9IDIpID0+IHsKICAgIC8vcW9zOgogICAgLy8wLCDmnIDlpJrpgIHkuIDmrKEKICAgIC8vMSwg6Iez5bCR6YCB5LiA5qyhLCDkv53orYnpgIHliLDkvYblj6/og73ph43opIfpgIEKICAgIC8vMiwg5Ymb5aW96YCB5LiA5qyhLCDkv53orYnlj6rpgIHkuIDmrKHkuJTkuI3ph43opIcKCiAgICAvL3BtCiAgICBsZXQgcG0gPSBnZW5QbSgpOwoKICAgIC8vd2FpdCBvbmxpbmUKICAgIGF3YWl0IHdhaXRGdW4oKCkgPT4gewogICAgICByZXR1cm4gb25saW5lOwogICAgfSk7CgogICAgLy/oqILplrHkuLvpoYwKICAgIGNsaWVudC5zdWJzY3JpYmUodG9waWMsIHsKICAgICAgcW9zCiAgICB9LCAoZXJyLCBncmFudGVkKSA9PiB7CiAgICAgIC8vIGdyYW50ZWQgPT4gWwogICAgICAvLyAgIHsgdG9waWM6ICdnZW5lcmF0ZS9yZXBvcnQnLCBxb3M6IDIgfSwKICAgICAgLy8gICB7IHRvcGljOiAnbmV3cy91cGRhdGUnLCBxb3M6IDEgfQogICAgICAvLyBdCiAgICAgIGlmIChlcnIpIHsKICAgICAgICBwbS5yZWplY3QoZXJyKTsKICAgICAgfSBlbHNlIHsKICAgICAgICBwbS5yZXNvbHZlKGdyYW50ZWQpOwogICAgICB9CiAgICB9KTsKICAgIHJldHVybiBwbTsKICB9OwoKICAvL3Vuc3Vic2NyaWJlCiAgbGV0IHVuc3Vic2NyaWJlID0gYXN5bmMgdG9waWMgPT4gewogICAgLy9wbQogICAgbGV0IHBtID0gZ2VuUG0oKTsKCiAgICAvL3dhaXQgb25saW5lCiAgICBhd2FpdCB3YWl0RnVuKCgpID0+IHsKICAgICAgcmV0dXJuIG9ubGluZTsKICAgIH0pOwoKICAgIC8v5Y+W5raI6KiC6Zax5Li76aGMCiAgICBjbGllbnQudW5zdWJzY3JpYmUodG9waWMsIGVyciA9PiB7CiAgICAgIGlmIChlcnIpIHsKICAgICAgICBwbS5yZWplY3QoZXJyKTsKICAgICAgfSBlbHNlIHsKICAgICAgICBwbS5yZXNvbHZlKCk7CiAgICAgIH0KICAgIH0pOwogICAgcmV0dXJuIHBtOwogIH07CgogIC8vcHVibGlzaAogIGxldCBwdWJsaXNoID0gYXN5bmMgKHRvcGljLCBtc2csIHFvcyA9IDIpID0+IHsKICAgIC8vcW9zOgogICAgLy8wLCDmnIDlpJrpgIHkuIDmrKEKICAgIC8vMSwg6Iez5bCR6YCB5LiA5qyhLCDkv53orYnpgIHliLDkvYblj6/og73ph43opIfpgIEKICAgIC8vMiwg5Ymb5aW96YCB5LiA5qyhLCDkv53orYnlj6rpgIHkuIDmrKHkuJTkuI3ph43opIcKCiAgICAvL3dhaXQgb25saW5lCiAgICBhd2FpdCB3YWl0RnVuKCgpID0+IHsKICAgICAgcmV0dXJuIG9ubGluZTsKICAgIH0pOwoKICAgIC8vcGF5bG9hZCwg5Z6L5Yil5Y+v5pSv5o+0OiBTdHJpbmcsIEJ1ZmZlciwgVWludDhBcnJheSwgTnVtYmVyLCBPYmplY3Qo6KaBSlNPTi5zdHJpbmdpZnkpCiAgICBsZXQgcGF5bG9hZCA9IEpTT04uc3RyaW5naWZ5KHsKICAgICAgW2tleU1zZ106IG1zZwogICAgfSk7IC8v5bCB6KOd6IezbXNn5Y+v57Ch5YyW5L2/55So5Z6L5YilLCDlg4XmlK/mj7RPYmplY3QsIFN0cmluZywgTnVtYmVyLCBCb29sZWFuCiAgICAvLyBjb25zb2xlLmxvZygnbXNnJywgbXNnKQogICAgLy8gY29uc29sZS5sb2coJ3BheWxvYWQnLCBwYXlsb2FkKQoKICAgIC8vcG0KICAgIGxldCBwbSA9IGdlblBtKCk7CgogICAgLy/nmbzluIPkuLvpoYwKICAgIGNsaWVudC5wdWJsaXNoKHRvcGljLCBwYXlsb2FkLCB7CiAgICAgIHFvcwogICAgfSwgZXJyID0+IHsKICAgICAgaWYgKGVycikgewogICAgICAgIHBtLnJlamVjdChlcnIpOwogICAgICB9IGVsc2UgewogICAgICAgIHBtLnJlc29sdmUoJ2RvbmUnKTsKICAgICAgfQogICAgfSk7CiAgICByZXR1cm4gcG07CiAgfTsKCiAgLy9tZXNzYWdlCiAgY2xpZW50Lm9uKCdtZXNzYWdlJywgKHRvcGljLCBtZXNzYWdlKSA9PiB7CiAgICAvLyBjb25zb2xlLmxvZyhgY2xpZW50IHJlY2VpdmVgLCBjbGllbnRJZCwgdG9waWMsIG1lc3NhZ2UpCiAgICBsZXQgX21lc3NhZ2UgPSAnJzsKICAgIHRyeSB7CiAgICAgIGxldCBqID0gbWVzc2FnZS50b1N0cmluZygpOyAvL21xdHTmjqXmlLZtZXNzYWdl5pmC5pyD6K6K5oiQQnVmZmVyLCDlvpfovYltZXNzYWdlLnRvU3RyaW5nKCkKICAgICAgLy8gY29uc29sZS5sb2coJ21lc3NhZ2UgaicsIGopCiAgICAgIGxldCBvID0gajJvKGopOwogICAgICAvLyBjb25zb2xlLmxvZygnbWVzc2FnZSBvJywgbykKICAgICAgX21lc3NhZ2UgPSBnZXQobywga2V5TXNnLCAnJyk7CiAgICB9IGNhdGNoIChlcnIpIHsKICAgICAgY29uc29sZS5sb2coZXJyKTsKICAgIH0KICAgIGV2LmVtaXQoJ21lc3NhZ2UnLCB7CiAgICAgIHRvcGljLAogICAgICBtZXNzYWdlOiBfbWVzc2FnZQogICAgfSk7CiAgfSk7CgogIC8vIC8vc2ltcGxpZnlFcnJvcgogIC8vIGxldCBzaW1wbGlmeUVycm9yID0gKGVycikgPT4gewogIC8vICAgICBpZiAoZXJyIGluc3RhbmNlb2YgQWdncmVnYXRlRXJyb3IgJiYgQXJyYXkuaXNBcnJheShlcnIuZXJyb3JzKSkgewogIC8vICAgICAgICAgcmV0dXJuIGVyci5lcnJvcnMubWFwKGUgPT4gYFske2UuYWRkcmVzc306JHtlLnBvcnR9XSAke2UuY29kZX1gKS5qb2luKCcgfCAnKQogIC8vICAgICB9CiAgLy8gICAgIGlmIChlcnIgaW5zdGFuY2VvZiBFcnJvcikgewogIC8vICAgICAgICAgcmV0dXJuIGVyci5tZXNzYWdlIHx8IFN0cmluZyhlcnIpCiAgLy8gICAgIH0KICAvLyAgICAgcmV0dXJuIFN0cmluZyhlcnIpCiAgLy8gfQoKICAvL2Vycm9yCiAgY2xpZW50Lm9uKCdlcnJvcicsIGVyciA9PiB7CiAgICAvLyBjb25zb2xlLmxvZyhgY2xpZW50IGVycm9yYCwgY2xpZW50SWQsIGVyci5tZXNzYWdlKQogICAgZXYuZW1pdCgnZXJyb3InLCBlcnIpOwogICAgLy8gZXYuZW1pdCgnZXJyb3InLCBzaW1wbGlmeUVycm9yKGVyciksIGVycikKICB9KTsKCiAgLy9vZmZsaW5lLCBjbGllbnTliKTlrprlt7Lpm6Lnt5rnhKHms5Xlho3oiIdicm9rZXLmup3pgJrmmYLop7jnmbwKICBjbGllbnQub24oJ29mZmxpbmUnLCAoKSA9PiB7CiAgICAvLyBjb25zb2xlLmxvZyhgY2xpZW50IG9mZmxpbmVgLCBjbGllbnRJZCkKICAgIG9ubGluZSA9IGZhbHNlOwogICAgZXYuZW1pdCgnb2ZmbGluZScpOwogIH0pOwoKICAvL2Nsb3NlCiAgY2xpZW50Lm9uKCdjbG9zZScsICgpID0+IHsKICAgIC8vIGNvbnNvbGUubG9nKGBjbGllbnQgY2xvc2VgLCBjbGllbnRJZCkKICAgIG9ubGluZSA9IGZhbHNlOwogICAgZXYuZW1pdCgnY2xvc2UnKTsKICB9KTsKCiAgLy9lbmQsIOWRvOWPq2NsaWVudC5lbmQoKeW+jOinuOeZvAogIGNsaWVudC5vbignZW5kJywgKCkgPT4gewogICAgLy8gY29uc29sZS5sb2coYGNsaWVudCBlbmRgLCBjbGllbnRJZCkKICAgIG9ubGluZSA9IGZhbHNlOwogICAgZXYuZW1pdCgnZW5kJyk7CiAgfSk7CgogIC8vY2xlYXIKICBsZXQgY2xlYXIgPSAoKSA9PiB7CiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gewogICAgICBjbGllbnQuZW5kKGZhbHNlLCB7fSwgZXJyID0+IHsKICAgICAgICBpZiAoZXJyKSB7CiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycik7CiAgICAgICAgfQogICAgICAgIHJlc29sdmUoKTsKICAgICAgfSk7CiAgICB9KTsKICB9OwoKICAvL3NhdmUKICBldi5zdWJzY3JpYmUgPSBzdWJzY3JpYmU7CiAgZXYudW5zdWJzY3JpYmUgPSB1bnN1YnNjcmliZTsKICBldi5wdWJsaXNoID0gcHVibGlzaDsKICBldi5jbGVhciA9IGNsZWFyOwogIHJldHVybiBldjsKfQoKCgpsZXQgaW5zdGFuY2UgPSBudWxsCmZ1bmN0aW9uIGluaXQoaW5wdXQpewoKICAgIC8vaW5pdAogICAgbGV0IHIKICAgIAogICAgICAgIHIgPSBXUHVic3ViQ2xpZW50KC4uLmlucHV0KQogICAgICAgIAoKICAgIC8vb24KICAgIAoKICAgIHIub24oJ2Nvbm5lY3QnLChtc2cpID0+IHsKCiAgICAgICAgLy9zZW5kTWVzc2FnZQogICAgICAgIGxldCByZXMgPSB7CiAgICAgICAgICAgIG1vZGU6ICdlbWl0JywKICAgICAgICAgICAgZXZOYW1lOiAnY29ubmVjdCcsCiAgICAgICAgICAgIG1zZywKICAgICAgICB9CiAgICAgICAgc2VuZE1lc3NhZ2UocmVzKQoKICAgIH0pCgoKCiAgICByLm9uKCdyZWNvbm5lY3QnLChtc2cpID0+IHsKCiAgICAgICAgLy9zZW5kTWVzc2FnZQogICAgICAgIGxldCByZXMgPSB7CiAgICAgICAgICAgIG1vZGU6ICdlbWl0JywKICAgICAgICAgICAgZXZOYW1lOiAncmVjb25uZWN0JywKICAgICAgICAgICAgbXNnLAogICAgICAgIH0KICAgICAgICBzZW5kTWVzc2FnZShyZXMpCgogICAgfSkKCgoKICAgIHIub24oJ21lc3NhZ2UnLChtc2cpID0+IHsKCiAgICAgICAgLy9zZW5kTWVzc2FnZQogICAgICAgIGxldCByZXMgPSB7CiAgICAgICAgICAgIG1vZGU6ICdlbWl0JywKICAgICAgICAgICAgZXZOYW1lOiAnbWVzc2FnZScsCiAgICAgICAgICAgIG1zZywKICAgICAgICB9CiAgICAgICAgc2VuZE1lc3NhZ2UocmVzKQoKICAgIH0pCgoKCiAgICByLm9uKCdlcnJvcicsKG1zZykgPT4gewoKICAgICAgICAvL3NlbmRNZXNzYWdlCiAgICAgICAgbGV0IHJlcyA9IHsKICAgICAgICAgICAgbW9kZTogJ2VtaXQnLAogICAgICAgICAgICBldk5hbWU6ICdlcnJvcicsCiAgICAgICAgICAgIG1zZywKICAgICAgICB9CiAgICAgICAgc2VuZE1lc3NhZ2UocmVzKQoKICAgIH0pCgoKCiAgICByLm9uKCdvZmZsaW5lJywobXNnKSA9PiB7CgogICAgICAgIC8vc2VuZE1lc3NhZ2UKICAgICAgICBsZXQgcmVzID0gewogICAgICAgICAgICBtb2RlOiAnZW1pdCcsCiAgICAgICAgICAgIGV2TmFtZTogJ29mZmxpbmUnLAogICAgICAgICAgICBtc2csCiAgICAgICAgfQogICAgICAgIHNlbmRNZXNzYWdlKHJlcykKCiAgICB9KQoKCgogICAgci5vbignY2xvc2UnLChtc2cpID0+IHsKCiAgICAgICAgLy9zZW5kTWVzc2FnZQogICAgICAgIGxldCByZXMgPSB7CiAgICAgICAgICAgIG1vZGU6ICdlbWl0JywKICAgICAgICAgICAgZXZOYW1lOiAnY2xvc2UnLAogICAgICAgICAgICBtc2csCiAgICAgICAgfQogICAgICAgIHNlbmRNZXNzYWdlKHJlcykKCiAgICB9KQoKCgogICAgci5vbignZW5kJywobXNnKSA9PiB7CgogICAgICAgIC8vc2VuZE1lc3NhZ2UKICAgICAgICBsZXQgcmVzID0gewogICAgICAgICAgICBtb2RlOiAnZW1pdCcsCiAgICAgICAgICAgIGV2TmFtZTogJ2VuZCcsCiAgICAgICAgICAgIG1zZywKICAgICAgICB9CiAgICAgICAgc2VuZE1lc3NhZ2UocmVzKQoKICAgIH0pCgoKCiAgICAvL3NhdmUKICAgIGluc3RhbmNlID0gcgoKfQoKZnVuY3Rpb24gc2VuZE1lc3NhZ2UoZGF0YSkgewogICAgCiAgICAgICAgcGFyZW50UG9ydC5wb3N0TWVzc2FnZShkYXRhKQogICAgICAgIAp9Cgphc3luYyBmdW5jdGlvbiBydW4oZGF0YSkgewogICAgLy8gY29uc29sZS5sb2coJ2lubmVyIHdvcmtlciBydW4nLGRhdGEpCgogICAgLy9tb2RlCiAgICBsZXQgbW9kZSA9IGRhdGEubW9kZQoKICAgIC8vY2hlY2sKICAgIGlmKG1vZGUgIT09ICdpbml0JyAmJiBtb2RlICE9PSAnY2FsbCcpewogICAgICAgIHJldHVybgogICAgfQoKICAgIC8vaW5pdAogICAgaWYobW9kZSA9PT0gJ2luaXQnKXsKICAgICAgICAKICAgICAgICB0cnl7CgogICAgICAgICAgICAvL3R5cGUKICAgICAgICAgICAgbGV0IHR5cGUgPSBkYXRhLnR5cGUKCiAgICAgICAgICAgIC8vaW5wdXQKICAgICAgICAgICAgbGV0IGlucHV0ID0gZGF0YS5pbnB1dAogICAgCiAgICAgICAgICAgIC8vaW5zdGFuY2UKICAgICAgICAgICAgaWYodHlwZSA9PT0gJ2Z1bmN0aW9uJyl7CiAgICAgICAgICAgICAgICBpbml0KC4uLmlucHV0KQogICAgICAgICAgICB9CiAgICAgICAgICAgIGVsc2UgaWYodHlwZSA9PT0gJ29iamVjdCcpewogICAgICAgICAgICAgICAgaW5zdGFuY2UgPSBXUHVic3ViQ2xpZW50CiAgICAgICAgICAgIH0KCiAgICAgICAgfQogICAgICAgIGNhdGNoKGVycil7CiAgICAgICAgCiAgICAgICAgICAgIC8vc2VuZE1lc3NhZ2UKICAgICAgICAgICAgbGV0IHJlcyA9IHsKICAgICAgICAgICAgICAgIG1vZGU6ICdlbWl0JywKICAgICAgICAgICAgICAgIGV2TmFtZTogJ2Vycm9yJywKICAgICAgICAgICAgICAgIG1zZzogZXJyLAogICAgICAgICAgICB9CiAgICAgICAgICAgIHNlbmRNZXNzYWdlKHJlcykKCiAgICAgICAgfQogICAgICAgICAgICAKICAgIH0KCiAgICAvL2NoZWNrCiAgICBpZihtb2RlID09PSAnY2FsbCcpewogICAgICAgIGxldCBzdGF0ZSA9ICcnCiAgICAgICAgbGV0IG1zZyA9IG51bGwKCiAgICAgICAgdHJ5ewoKICAgICAgICAgICAgLy9mdW4KICAgICAgICAgICAgbGV0IGZ1biA9IGluc3RhbmNlW2RhdGEuZnVuXQoKICAgICAgICAgICAgLy9pbnB1dAogICAgICAgICAgICBsZXQgaW5wdXQgPSBkYXRhLmlucHV0CgogICAgICAgICAgICAvL2V4ZWMKICAgICAgICAgICAgYXdhaXQgZnVuKC4uLmlucHV0KQogICAgICAgICAgICAgICAgLnRoZW4oKHN1YykgPT4gewogICAgICAgICAgICAgICAgICAgIHN0YXRlPSdzdWNjZXNzJwogICAgICAgICAgICAgICAgICAgIG1zZz1zdWMKICAgICAgICAgICAgICAgIH0pCiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gewogICAgICAgICAgICAgICAgICAgIHN0YXRlPSdlcnJvcicKICAgICAgICAgICAgICAgICAgICBtc2c9ZXJyCiAgICAgICAgICAgICAgICB9KQoKICAgICAgICB9CiAgICAgICAgY2F0Y2goZXJyKXsKICAgICAgICAgICAgc3RhdGUgPSAnZXJyb3InCiAgICAgICAgICAgIG1zZyA9IGVycgogICAgICAgIH0KICAgICAgICAKICAgICAgICAvL3NlbmRNZXNzYWdlCiAgICAgICAgbGV0IHJlcyA9IHsKICAgICAgICAgICAgbW9kZTogJ3JldHVybicsCiAgICAgICAgICAgIGlkOiBkYXRhLmlkLAogICAgICAgICAgICBmdW46IGRhdGEuZnVuLAogICAgICAgICAgICBzdGF0ZSwKICAgICAgICAgICAgbXNnLAogICAgICAgIH0KICAgICAgICBzZW5kTWVzc2FnZShyZXMpCgogICAgfQoKfQoKZnVuY3Rpb24gcmVjdk1lc3NhZ2UoZGF0YSkgewogICAgLy8gY29uc29sZS5sb2coJ2lubmVyIHdvcmtlciByZWN2OicsIGRhdGEpCgogICAgLy9kYXRhUmVjdgogICAgbGV0IGRhdGFSZWN2ID0gZGF0YQoKICAgIC8vcnVuCiAgICBydW4oZGF0YVJlY3YpCgp9CgoKICAgICAgICBwYXJlbnRQb3J0Lm9uKCdtZXNzYWdlJywgcmVjdk1lc3NhZ2UpCiAgICAgICAgCgp0cnl7CiAgICBwcm9jZXNzLm9uKCd1bmhhbmRsZWRSZWplY3Rpb24nLCAoZXJyKSA9PiB7CiAgICAgICAgY29uc29sZS5sb2coJ2lubmVyOnVuaGFuZGxlZFJlamVjdGlvbicsIGVycikKICAgIH0pCiAgICBwcm9jZXNzLm9uKCd1bmNhdWdodEV4Y2VwdGlvbicsIChlcnIpID0+IHsKICAgICAgICBjb25zb2xlLmxvZygnaW5uZXI6dW5jYXVnaHRFeGNlcHRpb24nLCBlcnIpCiAgICB9KQogICAgcHJvY2Vzcy5vbigndW5jYXVnaHRFeGNlcHRpb25Nb25pdG9yJywgKGVycikgPT4gewogICAgICAgIGNvbnNvbGUubG9nKCdpbm5lcjp1bmNhdWdodEV4Y2VwdGlvbk1vbml0b3InLCBlcnIpCiAgICB9KQp9CmNhdGNoKGVycil7fQoK`;

	      //code
	      let code = b642str(codeB64);
	      function wrapWorker() {
	        //evem
	        let ev = evem();
	        function genWorker(code) {
	          //new Worker
	          try {
	            return new worker_threads.Worker(code, {
	              eval: true
	            });
	          } catch (err) {
	            emitError(err);
	          }
	        }

	        //genWorker
	        let wk = genWorker(code);

	        //check, 於瀏覽器端可能會遭遇IE11安全性問題, 或被CSP的worker-src或script-src設定阻擋
	        if (!wk) {
	          emitError('invalid worker');
	          return null;
	        }
	        function terminate() {
	          if (wk) {
	            wk.terminate();
	            wk = undefined;
	          } else {
	            emitError('worker has been terminated');
	          }
	        }
	        function init() {
	          //dataSend
	          let dataSend = {
	            mode: 'init',
	            type: 'function',
	            input: [...arguments] //若直接用arguments會無法轉譯
	          };

	          //postMessage
	          wk.postMessage(dataSend);
	        }
	        function subscribe() {
	          //pm
	          let pm = genPm();

	          //id
	          let id = genID();

	          //dataSend
	          let dataSend = {
	            mode: 'call',
	            id,
	            fun: 'subscribe',
	            input: [...arguments] //若直接用arguments會無法轉譯
	          };

	          //postMessage
	          wk.postMessage(dataSend);

	          //once
	          ev.once(id, res => {
	            if (res.state === 'success') {
	              pm.resolve(res.msg);
	            } else {
	              pm.reject(res.msg);
	            }
	          });
	          return pm;
	        }
	        function unsubscribe() {
	          //pm
	          let pm = genPm();

	          //id
	          let id = genID();

	          //dataSend
	          let dataSend = {
	            mode: 'call',
	            id,
	            fun: 'unsubscribe',
	            input: [...arguments] //若直接用arguments會無法轉譯
	          };

	          //postMessage
	          wk.postMessage(dataSend);

	          //once
	          ev.once(id, res => {
	            if (res.state === 'success') {
	              pm.resolve(res.msg);
	            } else {
	              pm.reject(res.msg);
	            }
	          });
	          return pm;
	        }
	        function publish() {
	          //pm
	          let pm = genPm();

	          //id
	          let id = genID();

	          //dataSend
	          let dataSend = {
	            mode: 'call',
	            id,
	            fun: 'publish',
	            input: [...arguments] //若直接用arguments會無法轉譯
	          };

	          //postMessage
	          wk.postMessage(dataSend);

	          //once
	          ev.once(id, res => {
	            if (res.state === 'success') {
	              pm.resolve(res.msg);
	            } else {
	              pm.reject(res.msg);
	            }
	          });
	          return pm;
	        }
	        function clear() {
	          //pm
	          let pm = genPm();

	          //id
	          let id = genID();

	          //dataSend
	          let dataSend = {
	            mode: 'call',
	            id,
	            fun: 'clear',
	            input: [...arguments] //若直接用arguments會無法轉譯
	          };

	          //postMessage
	          wk.postMessage(dataSend);

	          //once
	          ev.once(id, res => {
	            if (res.state === 'success') {
	              pm.resolve(res.msg);
	            } else {
	              pm.reject(res.msg);
	            }
	          });
	          return pm;
	        }
	        function recvMessage(data) {
	          // console.log('outer worker recv:', data)

	          //dataRecv
	          let dataRecv = data;

	          //mode
	          let mode = dataRecv.mode;

	          //check
	          if (mode !== 'emit' && mode !== 'return') {
	            return;
	          }

	          //emit
	          if (mode === 'emit') {
	            //emit
	            ev.emit(dataRecv.evName, dataRecv.msg);
	          }

	          //return
	          if (mode === 'return') {
	            //emit
	            ev.emit(dataRecv.id, dataRecv);
	          }
	        }

	        //bind recvMessage

	        wk.on('message', recvMessage);
	        function emitError(err) {
	          ev.emit('error', err);
	        }

	        //bind emitError

	        wk.on('error', emitError);

	        //bind emitError for special condition

	        wk.on('exit', code => {
	          //The 'exit' event is emitted once the worker has stopped. If the worker exited by calling process.exit(), the exitCode parameter is the passed exit code. If the worker was terminated, the exitCode parameter is 1.
	          if (code !== 1) {
	            emitError('exit code[' + code + '] !== 1');
	          }
	        });

	        //init
	        init([...arguments]); //若直接用arguments會無法轉譯

	        ev.subscribe = subscribe;
	        ev.unsubscribe = unsubscribe;
	        ev.publish = publish;
	        ev.clear = clear;
	        ev.terminate = terminate;
	        return ev;
	      }

	      //set ww

	      ww = wrapWorker;
	    }
	    protectShell();
	    try {
	      process.on('unhandledRejection', err => {
	        console.log('outer:unhandledRejection', err);
	      });
	      process.on('uncaughtException', err => {
	        console.log('outer:uncaughtException', err);
	      });
	      process.on('uncaughtExceptionMonitor', err => {
	        console.log('outer:uncaughtExceptionMonitor', err);
	      });
	    } catch (err) {}
	    var ww$1 = ww;
	    return ww$1;
	  });
	})(temp57qHNMCAs3lcen5WPq9uyZ7JOLIMn0QZNw);
	var temp57qHNMCAs3lcen5WPq9uyZ7JOLIMn0QZNwExports = temp57qHNMCAs3lcen5WPq9uyZ7JOLIMn0QZNw.exports;
	var nw = /*@__PURE__*/getDefaultExportFromCjs(temp57qHNMCAs3lcen5WPq9uyZ7JOLIMn0QZNwExports);

	return nw;

}));
