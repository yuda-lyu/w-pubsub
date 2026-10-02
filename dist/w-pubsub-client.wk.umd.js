(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('worker_threads')) :
	typeof define === 'function' && define.amd ? define(['worker_threads'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.WPubsubClient = factory(global.worker_threads));
})(this, (function (require$$0) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var tempLZsi9uOmuqW3l5OHCy2HWtsywCUo9SJrNw = {exports: {}};

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
	      let codeB64 = `CgogICAgICAgIC8vaW1wb3J0IHsgcGFyZW50UG9ydCB9IGZyb20gJ3dvcmtlcl90aHJlYWRzJwogICAgICAgIGxldCB7IHBhcmVudFBvcnQgfSA9IHJlcXVpcmUoJ3dvcmtlcl90aHJlYWRzJykgLy/lm6BwYWNrYWdlLmpzb27kuI3ntaZ0eXBlPW1vZHVsZeaVheeEoeazleaUr+aPtGVzNiBpbXBvcnQsIOW+l+S9v+eUqHJlcXVpcmUKICAgICAgICAvL+iLpeimgeaWvG5vZGVqcyB3b3JrZXLlhafkvb/nlKjnhKHms5XovYnora/nmoTljp/nlJ/lpZfku7bkvovlpoJmcywg6YG/5YWN5L2/55So6aCC5bGkaW1wb3J05Yqg6LyJ5L2/55SoLCDlm6DnhKHms5XovYnora/mnIPnm7TmjqXkv53nlZkKICAgICAgICAvL+S4puWboGltcG9ydOS9jeaWvHdvcmtlcuWkluWxpOmZkOWumueCunJlcXVpcmXljYAocGFja2FnZS5qc29u5LiN57WmdHlwZT1tb2R1bGUpLCDmlYXlh7rnj77pjK/oqqTnhKHms5XovYnora8KICAgICAgICAKCid1c2Ugc3RyaWN0JzsKCnZhciBtcXR0ID0gcmVxdWlyZSgnbXF0dCcpOwoKLyoqCiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuCiAqCiAqIEBzdGF0aWMKICogQG1lbWJlck9mIF8KICogQHNpbmNlIDAuMS4wCiAqIEBjYXRlZ29yeSBMYW5nCiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLgogKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSwgZWxzZSBgZmFsc2VgLgogKiBAZXhhbXBsZQogKgogKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTsKICogLy8gPT4gdHJ1ZQogKgogKiBfLmlzQXJyYXkoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7CiAqIC8vID0+IGZhbHNlCiAqCiAqIF8uaXNBcnJheSgnYWJjJyk7CiAqIC8vID0+IGZhbHNlCiAqCiAqIF8uaXNBcnJheShfLm5vb3ApOwogKiAvLyA9PiBmYWxzZQogKi8KdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5Owp2YXIgaXNBcnJheSQxID0gaXNBcnJheTsKCi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovCnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDsKdmFyIGZyZWVHbG9iYWwkMSA9IGZyZWVHbG9iYWw7CgovKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqLwp2YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjsKCi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqLwp2YXIgcm9vdCA9IGZyZWVHbG9iYWwkMSB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpOwp2YXIgcm9vdCQxID0gcm9vdDsKCi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqLwp2YXIgU3ltYm9sID0gcm9vdCQxLlN5bWJvbDsKdmFyIFN5bWJvbCQxID0gU3ltYm9sOwoKLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqLwp2YXIgb2JqZWN0UHJvdG8kNCA9IE9iamVjdC5wcm90b3R5cGU7CgovKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi8KdmFyIGhhc093blByb3BlcnR5JDMgPSBvYmplY3RQcm90byQ0Lmhhc093blByb3BlcnR5OwoKLyoqCiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUKICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpCiAqIG9mIHZhbHVlcy4KICovCnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyQxID0gb2JqZWN0UHJvdG8kNC50b1N0cmluZzsKCi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqLwp2YXIgc3ltVG9TdHJpbmdUYWckMSA9IFN5bWJvbCQxID8gU3ltYm9sJDEudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7CgovKioKICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuCiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLgogKi8KZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7CiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkkMy5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyQxKSwKICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnJDFdOwogIHRyeSB7CiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZyQxXSA9IHVuZGVmaW5lZDsKICAgIHZhciB1bm1hc2tlZCA9IHRydWU7CiAgfSBjYXRjaCAoZSkge30KICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmckMS5jYWxsKHZhbHVlKTsKICBpZiAodW5tYXNrZWQpIHsKICAgIGlmIChpc093bikgewogICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZyQxXSA9IHRhZzsKICAgIH0gZWxzZSB7CiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZyQxXTsKICAgIH0KICB9CiAgcmV0dXJuIHJlc3VsdDsKfQoKLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqLwp2YXIgb2JqZWN0UHJvdG8kMyA9IE9iamVjdC5wcm90b3R5cGU7CgovKioKICogVXNlZCB0byByZXNvbHZlIHRoZQogKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZykKICogb2YgdmFsdWVzLgogKi8KdmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8kMy50b1N0cmluZzsKCi8qKgogKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC4KICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy4KICovCmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7CiAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpOwp9CgovKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovCnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLAogIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nOwoKLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovCnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCQxID8gU3ltYm9sJDEudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7CgovKioKICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldFRhZ2Agd2l0aG91dCBmYWxsYmFja3MgZm9yIGJ1Z2d5IGVudmlyb25tZW50cy4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuCiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuCiAqLwpmdW5jdGlvbiBiYXNlR2V0VGFnKHZhbHVlKSB7CiAgaWYgKHZhbHVlID09IG51bGwpIHsKICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZzsKICB9CiAgcmV0dXJuIHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkgPyBnZXRSYXdUYWcodmFsdWUpIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpOwp9CgovKioKICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgCiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgIm9iamVjdCIuCiAqCiAqIEBzdGF0aWMKICogQG1lbWJlck9mIF8KICogQHNpbmNlIDQuMC4wCiAqIEBjYXRlZ29yeSBMYW5nCiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLgogKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLgogKiBAZXhhbXBsZQogKgogKiBfLmlzT2JqZWN0TGlrZSh7fSk7CiAqIC8vID0+IHRydWUKICoKICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTsKICogLy8gPT4gdHJ1ZQogKgogKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApOwogKiAvLyA9PiBmYWxzZQogKgogKiBfLmlzT2JqZWN0TGlrZShudWxsKTsKICogLy8gPT4gZmFsc2UKICovCmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkgewogIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JzsKfQoKLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqLwp2YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7CgovKioKICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuCiAqCiAqIEBzdGF0aWMKICogQG1lbWJlck9mIF8KICogQHNpbmNlIDQuMC4wCiAqIEBjYXRlZ29yeSBMYW5nCiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLgogKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLgogKiBAZXhhbXBsZQogKgogKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7CiAqIC8vID0+IHRydWUKICoKICogXy5pc1N5bWJvbCgnYWJjJyk7CiAqIC8vID0+IGZhbHNlCiAqLwpmdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkgewogIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHwgaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBzeW1ib2xUYWc7Cn0KCi8qKiBVc2VkIHRvIG1hdGNoIHByb3BlcnR5IG5hbWVzIHdpdGhpbiBwcm9wZXJ0eSBwYXRocy4gKi8KdmFyIHJlSXNEZWVwUHJvcCA9IC9cLnxcWyg/OlteW1xdXSp8KFsiJ10pKD86KD8hXDEpW15cXF18XFwuKSo/XDEpXF0vLAogIHJlSXNQbGFpblByb3AgPSAvXlx3KiQvOwoKLyoqCiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgcHJvcGVydHkgbmFtZSBhbmQgbm90IGEgcHJvcGVydHkgcGF0aC4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suCiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5IGtleXMgb24uCiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcHJvcGVydHkgbmFtZSwgZWxzZSBgZmFsc2VgLgogKi8KZnVuY3Rpb24gaXNLZXkodmFsdWUsIG9iamVjdCkgewogIGlmIChpc0FycmF5JDEodmFsdWUpKSB7CiAgICByZXR1cm4gZmFsc2U7CiAgfQogIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlOwogIGlmICh0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicgfHwgdmFsdWUgPT0gbnVsbCB8fCBpc1N5bWJvbCh2YWx1ZSkpIHsKICAgIHJldHVybiB0cnVlOwogIH0KICByZXR1cm4gcmVJc1BsYWluUHJvcC50ZXN0KHZhbHVlKSB8fCAhcmVJc0RlZXBQcm9wLnRlc3QodmFsdWUpIHx8IG9iamVjdCAhPSBudWxsICYmIHZhbHVlIGluIE9iamVjdChvYmplY3QpOwp9CgovKioKICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlCiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcykKICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKQogKgogKiBAc3RhdGljCiAqIEBtZW1iZXJPZiBfCiAqIEBzaW5jZSAwLjEuMAogKiBAY2F0ZWdvcnkgTGFuZwogKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay4KICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuCiAqIEBleGFtcGxlCiAqCiAqIF8uaXNPYmplY3Qoe30pOwogKiAvLyA9PiB0cnVlCiAqCiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTsKICogLy8gPT4gdHJ1ZQogKgogKiBfLmlzT2JqZWN0KF8ubm9vcCk7CiAqIC8vID0+IHRydWUKICoKICogXy5pc09iamVjdChudWxsKTsKICogLy8gPT4gZmFsc2UKICovCmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7CiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7CiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTsKfQoKLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqLwp2YXIgYXN5bmNUYWcgPSAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScsCiAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsCiAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJywKICBwcm94eVRhZyA9ICdbb2JqZWN0IFByb3h5XSc7CgovKioKICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LgogKgogKiBAc3RhdGljCiAqIEBtZW1iZXJPZiBfCiAqIEBzaW5jZSAwLjEuMAogKiBAY2F0ZWdvcnkgTGFuZwogKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay4KICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLgogKiBAZXhhbXBsZQogKgogKiBfLmlzRnVuY3Rpb24oXyk7CiAqIC8vID0+IHRydWUKICoKICogXy5pc0Z1bmN0aW9uKC9hYmMvKTsKICogLy8gPT4gZmFsc2UKICovCmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHsKICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkgewogICAgcmV0dXJuIGZhbHNlOwogIH0KICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3IKICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheXMgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy4KICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7CiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWcgfHwgdGFnID09IGFzeW5jVGFnIHx8IHRhZyA9PSBwcm94eVRhZzsKfQoKLyoqIFVzZWQgdG8gZGV0ZWN0IG92ZXJyZWFjaGluZyBjb3JlLWpzIHNoaW1zLiAqLwp2YXIgY29yZUpzRGF0YSA9IHJvb3QkMVsnX19jb3JlLWpzX3NoYXJlZF9fJ107CnZhciBjb3JlSnNEYXRhJDEgPSBjb3JlSnNEYXRhOwoKLyoqIFVzZWQgdG8gZGV0ZWN0IG1ldGhvZHMgbWFzcXVlcmFkaW5nIGFzIG5hdGl2ZS4gKi8KdmFyIG1hc2tTcmNLZXkgPSBmdW5jdGlvbiAoKSB7CiAgdmFyIHVpZCA9IC9bXi5dKyQvLmV4ZWMoY29yZUpzRGF0YSQxICYmIGNvcmVKc0RhdGEkMS5rZXlzICYmIGNvcmVKc0RhdGEkMS5rZXlzLklFX1BST1RPIHx8ICcnKTsKICByZXR1cm4gdWlkID8gJ1N5bWJvbChzcmMpXzEuJyArIHVpZCA6ICcnOwp9KCk7CgovKioKICogQ2hlY2tzIGlmIGBmdW5jYCBoYXMgaXRzIHNvdXJjZSBtYXNrZWQuCiAqCiAqIEBwcml2YXRlCiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrLgogKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGZ1bmNgIGlzIG1hc2tlZCwgZWxzZSBgZmFsc2VgLgogKi8KZnVuY3Rpb24gaXNNYXNrZWQoZnVuYykgewogIHJldHVybiAhIW1hc2tTcmNLZXkgJiYgbWFza1NyY0tleSBpbiBmdW5jOwp9CgovKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovCnZhciBmdW5jUHJvdG8kMSA9IEZ1bmN0aW9uLnByb3RvdHlwZTsKCi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi8KdmFyIGZ1bmNUb1N0cmluZyQxID0gZnVuY1Byb3RvJDEudG9TdHJpbmc7CgovKioKICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY29udmVydC4KICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuCiAqLwpmdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7CiAgaWYgKGZ1bmMgIT0gbnVsbCkgewogICAgdHJ5IHsKICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZyQxLmNhbGwoZnVuYyk7CiAgICB9IGNhdGNoIChlKSB7fQogICAgdHJ5IHsKICAgICAgcmV0dXJuIGZ1bmMgKyAnJzsKICAgIH0gY2F0Y2ggKGUpIHt9CiAgfQogIHJldHVybiAnJzsKfQoKLyoqCiAqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGAKICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wYXR0ZXJucykuCiAqLwp2YXIgcmVSZWdFeHBDaGFyID0gL1tcXF4kLiorPygpW1xde318XS9nOwoKLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqLwp2YXIgcmVJc0hvc3RDdG9yID0gL15cW29iamVjdCAuKz9Db25zdHJ1Y3RvclxdJC87CgovKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovCnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsCiAgb2JqZWN0UHJvdG8kMiA9IE9iamVjdC5wcm90b3R5cGU7CgovKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovCnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7CgovKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi8KdmFyIGhhc093blByb3BlcnR5JDIgPSBvYmplY3RQcm90byQyLmhhc093blByb3BlcnR5OwoKLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi8KdmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICsgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkkMikucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXCQmJykucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXCgpfCBmb3IgLis/KD89XFxcXSkvZywgJyQxLio/JykgKyAnJCcpOwoKLyoqCiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmF0aXZlYCB3aXRob3V0IGJhZCBzaGltIGNoZWNrcy4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suCiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLAogKiAgZWxzZSBgZmFsc2VgLgogKi8KZnVuY3Rpb24gYmFzZUlzTmF0aXZlKHZhbHVlKSB7CiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgaXNNYXNrZWQodmFsdWUpKSB7CiAgICByZXR1cm4gZmFsc2U7CiAgfQogIHZhciBwYXR0ZXJuID0gaXNGdW5jdGlvbih2YWx1ZSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yOwogIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTsKfQoKLyoqCiAqIEdldHMgdGhlIHZhbHVlIGF0IGBrZXlgIG9mIGBvYmplY3RgLgogKgogKiBAcHJpdmF0ZQogKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS4KICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuCiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZS4KICovCmZ1bmN0aW9uIGdldFZhbHVlKG9iamVjdCwga2V5KSB7CiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07Cn0KCi8qKgogKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuCiAqCiAqIEBwcml2YXRlCiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS4KICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LgogKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuCiAqLwpmdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHsKICB2YXIgdmFsdWUgPSBnZXRWYWx1ZShvYmplY3QsIGtleSk7CiAgcmV0dXJuIGJhc2VJc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDsKfQoKLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqLwp2YXIgbmF0aXZlQ3JlYXRlID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2NyZWF0ZScpOwp2YXIgbmF0aXZlQ3JlYXRlJDEgPSBuYXRpdmVDcmVhdGU7CgovKioKICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgaGFzaC4KICoKICogQHByaXZhdGUKICogQG5hbWUgY2xlYXIKICogQG1lbWJlck9mIEhhc2gKICovCmZ1bmN0aW9uIGhhc2hDbGVhcigpIHsKICB0aGlzLl9fZGF0YV9fID0gbmF0aXZlQ3JlYXRlJDEgPyBuYXRpdmVDcmVhdGUkMShudWxsKSA6IHt9OwogIHRoaXMuc2l6ZSA9IDA7Cn0KCi8qKgogKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgaGFzaC4KICoKICogQHByaXZhdGUKICogQG5hbWUgZGVsZXRlCiAqIEBtZW1iZXJPZiBIYXNoCiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS4KICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuCiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC4KICovCmZ1bmN0aW9uIGhhc2hEZWxldGUoa2V5KSB7CiAgdmFyIHJlc3VsdCA9IHRoaXMuaGFzKGtleSkgJiYgZGVsZXRlIHRoaXMuX19kYXRhX19ba2V5XTsKICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7CiAgcmV0dXJuIHJlc3VsdDsKfQoKLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqLwp2YXIgSEFTSF9VTkRFRklORUQkMSA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJzsKCi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi8KdmFyIG9iamVjdFByb3RvJDEgPSBPYmplY3QucHJvdG90eXBlOwoKLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovCnZhciBoYXNPd25Qcm9wZXJ0eSQxID0gb2JqZWN0UHJvdG8kMS5oYXNPd25Qcm9wZXJ0eTsKCi8qKgogKiBHZXRzIHRoZSBoYXNoIHZhbHVlIGZvciBga2V5YC4KICoKICogQHByaXZhdGUKICogQG5hbWUgZ2V0CiAqIEBtZW1iZXJPZiBIYXNoCiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LgogKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuCiAqLwpmdW5jdGlvbiBoYXNoR2V0KGtleSkgewogIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXzsKICBpZiAobmF0aXZlQ3JlYXRlJDEpIHsKICAgIHZhciByZXN1bHQgPSBkYXRhW2tleV07CiAgICByZXR1cm4gcmVzdWx0ID09PSBIQVNIX1VOREVGSU5FRCQxID8gdW5kZWZpbmVkIDogcmVzdWx0OwogIH0KICByZXR1cm4gaGFzT3duUHJvcGVydHkkMS5jYWxsKGRhdGEsIGtleSkgPyBkYXRhW2tleV0gOiB1bmRlZmluZWQ7Cn0KCi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi8KdmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTsKCi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqLwp2YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTsKCi8qKgogKiBDaGVja3MgaWYgYSBoYXNoIHZhbHVlIGZvciBga2V5YCBleGlzdHMuCiAqCiAqIEBwcml2YXRlCiAqIEBuYW1lIGhhcwogKiBAbWVtYmVyT2YgSGFzaAogKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLgogKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLgogKi8KZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHsKICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187CiAgcmV0dXJuIG5hdGl2ZUNyZWF0ZSQxID8gZGF0YVtrZXldICE9PSB1bmRlZmluZWQgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSk7Cn0KCi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi8KdmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nOwoKLyoqCiAqIFNldHMgdGhlIGhhc2ggYGtleWAgdG8gYHZhbHVlYC4KICoKICogQHByaXZhdGUKICogQG5hbWUgc2V0CiAqIEBtZW1iZXJPZiBIYXNoCiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LgogKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuCiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGhhc2ggaW5zdGFuY2UuCiAqLwpmdW5jdGlvbiBoYXNoU2V0KGtleSwgdmFsdWUpIHsKICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187CiAgdGhpcy5zaXplICs9IHRoaXMuaGFzKGtleSkgPyAwIDogMTsKICBkYXRhW2tleV0gPSBuYXRpdmVDcmVhdGUkMSAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gSEFTSF9VTkRFRklORUQgOiB2YWx1ZTsKICByZXR1cm4gdGhpczsKfQoKLyoqCiAqIENyZWF0ZXMgYSBoYXNoIG9iamVjdC4KICoKICogQHByaXZhdGUKICogQGNvbnN0cnVjdG9yCiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLgogKi8KZnVuY3Rpb24gSGFzaChlbnRyaWVzKSB7CiAgdmFyIGluZGV4ID0gLTEsCiAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7CiAgdGhpcy5jbGVhcigpOwogIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7CiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTsKICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7CiAgfQp9CgovLyBBZGQgbWV0aG9kcyB0byBgSGFzaGAuCkhhc2gucHJvdG90eXBlLmNsZWFyID0gaGFzaENsZWFyOwpIYXNoLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBoYXNoRGVsZXRlOwpIYXNoLnByb3RvdHlwZS5nZXQgPSBoYXNoR2V0OwpIYXNoLnByb3RvdHlwZS5oYXMgPSBoYXNoSGFzOwpIYXNoLnByb3RvdHlwZS5zZXQgPSBoYXNoU2V0OwoKLyoqCiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGxpc3QgY2FjaGUuCiAqCiAqIEBwcml2YXRlCiAqIEBuYW1lIGNsZWFyCiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGUKICovCmZ1bmN0aW9uIGxpc3RDYWNoZUNsZWFyKCkgewogIHRoaXMuX19kYXRhX18gPSBbXTsKICB0aGlzLnNpemUgPSAwOwp9CgovKioKICogUGVyZm9ybXMgYQogKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKQogKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC4KICoKICogQHN0YXRpYwogKiBAbWVtYmVyT2YgXwogKiBAc2luY2UgNC4wLjAKICogQGNhdGVnb3J5IExhbmcKICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS4KICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS4KICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC4KICogQGV4YW1wbGUKICoKICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07CiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07CiAqCiAqIF8uZXEob2JqZWN0LCBvYmplY3QpOwogKiAvLyA9PiB0cnVlCiAqCiAqIF8uZXEob2JqZWN0LCBvdGhlcik7CiAqIC8vID0+IGZhbHNlCiAqCiAqIF8uZXEoJ2EnLCAnYScpOwogKiAvLyA9PiB0cnVlCiAqCiAqIF8uZXEoJ2EnLCBPYmplY3QoJ2EnKSk7CiAqIC8vID0+IGZhbHNlCiAqCiAqIF8uZXEoTmFOLCBOYU4pOwogKiAvLyA9PiB0cnVlCiAqLwpmdW5jdGlvbiBlcSh2YWx1ZSwgb3RoZXIpIHsKICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8IHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXI7Cn0KCi8qKgogKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgYGtleWAgaXMgZm91bmQgaW4gYGFycmF5YCBvZiBrZXktdmFsdWUgcGFpcnMuCiAqCiAqIEBwcml2YXRlCiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LgogKiBAcGFyYW0geyp9IGtleSBUaGUga2V5IHRvIHNlYXJjaCBmb3IuCiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuCiAqLwpmdW5jdGlvbiBhc3NvY0luZGV4T2YoYXJyYXksIGtleSkgewogIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7CiAgd2hpbGUgKGxlbmd0aC0tKSB7CiAgICBpZiAoZXEoYXJyYXlbbGVuZ3RoXVswXSwga2V5KSkgewogICAgICByZXR1cm4gbGVuZ3RoOwogICAgfQogIH0KICByZXR1cm4gLTE7Cn0KCi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi8KdmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7CgovKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi8KdmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlOwoKLyoqCiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBsaXN0IGNhY2hlLgogKgogKiBAcHJpdmF0ZQogKiBAbmFtZSBkZWxldGUKICogQG1lbWJlck9mIExpc3RDYWNoZQogKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS4KICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLgogKi8KZnVuY3Rpb24gbGlzdENhY2hlRGVsZXRlKGtleSkgewogIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXywKICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7CiAgaWYgKGluZGV4IDwgMCkgewogICAgcmV0dXJuIGZhbHNlOwogIH0KICB2YXIgbGFzdEluZGV4ID0gZGF0YS5sZW5ndGggLSAxOwogIGlmIChpbmRleCA9PSBsYXN0SW5kZXgpIHsKICAgIGRhdGEucG9wKCk7CiAgfSBlbHNlIHsKICAgIHNwbGljZS5jYWxsKGRhdGEsIGluZGV4LCAxKTsKICB9CiAgLS10aGlzLnNpemU7CiAgcmV0dXJuIHRydWU7Cn0KCi8qKgogKiBHZXRzIHRoZSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YC4KICoKICogQHByaXZhdGUKICogQG5hbWUgZ2V0CiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGUKICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuCiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS4KICovCmZ1bmN0aW9uIGxpc3RDYWNoZUdldChrZXkpIHsKICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sCiAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpOwogIHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiBkYXRhW2luZGV4XVsxXTsKfQoKLyoqCiAqIENoZWNrcyBpZiBhIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy4KICoKICogQHByaXZhdGUKICogQG5hbWUgaGFzCiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGUKICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay4KICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC4KICovCmZ1bmN0aW9uIGxpc3RDYWNoZUhhcyhrZXkpIHsKICByZXR1cm4gYXNzb2NJbmRleE9mKHRoaXMuX19kYXRhX18sIGtleSkgPiAtMTsKfQoKLyoqCiAqIFNldHMgdGhlIGxpc3QgY2FjaGUgYGtleWAgdG8gYHZhbHVlYC4KICoKICogQHByaXZhdGUKICogQG5hbWUgc2V0CiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGUKICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuCiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC4KICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbGlzdCBjYWNoZSBpbnN0YW5jZS4KICovCmZ1bmN0aW9uIGxpc3RDYWNoZVNldChrZXksIHZhbHVlKSB7CiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLAogICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTsKICBpZiAoaW5kZXggPCAwKSB7CiAgICArK3RoaXMuc2l6ZTsKICAgIGRhdGEucHVzaChba2V5LCB2YWx1ZV0pOwogIH0gZWxzZSB7CiAgICBkYXRhW2luZGV4XVsxXSA9IHZhbHVlOwogIH0KICByZXR1cm4gdGhpczsKfQoKLyoqCiAqIENyZWF0ZXMgYW4gbGlzdCBjYWNoZSBvYmplY3QuCiAqCiAqIEBwcml2YXRlCiAqIEBjb25zdHJ1Y3RvcgogKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS4KICovCmZ1bmN0aW9uIExpc3RDYWNoZShlbnRyaWVzKSB7CiAgdmFyIGluZGV4ID0gLTEsCiAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7CiAgdGhpcy5jbGVhcigpOwogIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7CiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTsKICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7CiAgfQp9CgovLyBBZGQgbWV0aG9kcyB0byBgTGlzdENhY2hlYC4KTGlzdENhY2hlLnByb3RvdHlwZS5jbGVhciA9IGxpc3RDYWNoZUNsZWFyOwpMaXN0Q2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IGxpc3RDYWNoZURlbGV0ZTsKTGlzdENhY2hlLnByb3RvdHlwZS5nZXQgPSBsaXN0Q2FjaGVHZXQ7Ckxpc3RDYWNoZS5wcm90b3R5cGUuaGFzID0gbGlzdENhY2hlSGFzOwpMaXN0Q2FjaGUucHJvdG90eXBlLnNldCA9IGxpc3RDYWNoZVNldDsKCi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi8KdmFyIE1hcCA9IGdldE5hdGl2ZShyb290JDEsICdNYXAnKTsKdmFyIE1hcCQxID0gTWFwOwoKLyoqCiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC4KICoKICogQHByaXZhdGUKICogQG5hbWUgY2xlYXIKICogQG1lbWJlck9mIE1hcENhY2hlCiAqLwpmdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkgewogIHRoaXMuc2l6ZSA9IDA7CiAgdGhpcy5fX2RhdGFfXyA9IHsKICAgICdoYXNoJzogbmV3IEhhc2goKSwKICAgICdtYXAnOiBuZXcgKE1hcCQxIHx8IExpc3RDYWNoZSkoKSwKICAgICdzdHJpbmcnOiBuZXcgSGFzaCgpCiAgfTsKfQoKLyoqCiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuCiAqCiAqIEBwcml2YXRlCiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLgogKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSwgZWxzZSBgZmFsc2VgLgogKi8KZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7CiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7CiAgcmV0dXJuIHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nID8gdmFsdWUgIT09ICdfX3Byb3RvX18nIDogdmFsdWUgPT09IG51bGw7Cn0KCi8qKgogKiBHZXRzIHRoZSBkYXRhIGZvciBgbWFwYC4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIHF1ZXJ5LgogKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSByZWZlcmVuY2Uga2V5LgogKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWFwIGRhdGEuCiAqLwpmdW5jdGlvbiBnZXRNYXBEYXRhKG1hcCwga2V5KSB7CiAgdmFyIGRhdGEgPSBtYXAuX19kYXRhX187CiAgcmV0dXJuIGlzS2V5YWJsZShrZXkpID8gZGF0YVt0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8gJ3N0cmluZycgOiAnaGFzaCddIDogZGF0YS5tYXA7Cn0KCi8qKgogKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbWFwLgogKgogKiBAcHJpdmF0ZQogKiBAbmFtZSBkZWxldGUKICogQG1lbWJlck9mIE1hcENhY2hlCiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLgogKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuCiAqLwpmdW5jdGlvbiBtYXBDYWNoZURlbGV0ZShrZXkpIHsKICB2YXIgcmVzdWx0ID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpWydkZWxldGUnXShrZXkpOwogIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDsKICByZXR1cm4gcmVzdWx0Owp9CgovKioKICogR2V0cyB0aGUgbWFwIHZhbHVlIGZvciBga2V5YC4KICoKICogQHByaXZhdGUKICogQG5hbWUgZ2V0CiAqIEBtZW1iZXJPZiBNYXBDYWNoZQogKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC4KICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLgogKi8KZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7CiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5nZXQoa2V5KTsKfQoKLyoqCiAqIENoZWNrcyBpZiBhIG1hcCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLgogKgogKiBAcHJpdmF0ZQogKiBAbmFtZSBoYXMKICogQG1lbWJlck9mIE1hcENhY2hlCiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suCiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuCiAqLwpmdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHsKICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmhhcyhrZXkpOwp9CgovKioKICogU2V0cyB0aGUgbWFwIGBrZXlgIHRvIGB2YWx1ZWAuCiAqCiAqIEBwcml2YXRlCiAqIEBuYW1lIHNldAogKiBAbWVtYmVyT2YgTWFwQ2FjaGUKICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuCiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC4KICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbWFwIGNhY2hlIGluc3RhbmNlLgogKi8KZnVuY3Rpb24gbWFwQ2FjaGVTZXQoa2V5LCB2YWx1ZSkgewogIHZhciBkYXRhID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLAogICAgc2l6ZSA9IGRhdGEuc2l6ZTsKICBkYXRhLnNldChrZXksIHZhbHVlKTsKICB0aGlzLnNpemUgKz0gZGF0YS5zaXplID09IHNpemUgPyAwIDogMTsKICByZXR1cm4gdGhpczsKfQoKLyoqCiAqIENyZWF0ZXMgYSBtYXAgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy4KICoKICogQHByaXZhdGUKICogQGNvbnN0cnVjdG9yCiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLgogKi8KZnVuY3Rpb24gTWFwQ2FjaGUoZW50cmllcykgewogIHZhciBpbmRleCA9IC0xLAogICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoOwogIHRoaXMuY2xlYXIoKTsKICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkgewogICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07CiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pOwogIH0KfQoKLy8gQWRkIG1ldGhvZHMgdG8gYE1hcENhY2hlYC4KTWFwQ2FjaGUucHJvdG90eXBlLmNsZWFyID0gbWFwQ2FjaGVDbGVhcjsKTWFwQ2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IG1hcENhY2hlRGVsZXRlOwpNYXBDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbWFwQ2FjaGVHZXQ7Ck1hcENhY2hlLnByb3RvdHlwZS5oYXMgPSBtYXBDYWNoZUhhczsKTWFwQ2FjaGUucHJvdG90eXBlLnNldCA9IG1hcENhY2hlU2V0OwoKLyoqIEVycm9yIG1lc3NhZ2UgY29uc3RhbnRzLiAqLwp2YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nOwoKLyoqCiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IG1lbW9pemVzIHRoZSByZXN1bHQgb2YgYGZ1bmNgLiBJZiBgcmVzb2x2ZXJgIGlzCiAqIHByb3ZpZGVkLCBpdCBkZXRlcm1pbmVzIHRoZSBjYWNoZSBrZXkgZm9yIHN0b3JpbmcgdGhlIHJlc3VsdCBiYXNlZCBvbiB0aGUKICogYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbi4gQnkgZGVmYXVsdCwgdGhlIGZpcnN0IGFyZ3VtZW50CiAqIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbiBpcyB1c2VkIGFzIHRoZSBtYXAgY2FjaGUga2V5LiBUaGUgYGZ1bmNgCiAqIGlzIGludm9rZWQgd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgdGhlIG1lbW9pemVkIGZ1bmN0aW9uLgogKgogKiAqKk5vdGU6KiogVGhlIGNhY2hlIGlzIGV4cG9zZWQgYXMgdGhlIGBjYWNoZWAgcHJvcGVydHkgb24gdGhlIG1lbW9pemVkCiAqIGZ1bmN0aW9uLiBJdHMgY3JlYXRpb24gbWF5IGJlIGN1c3RvbWl6ZWQgYnkgcmVwbGFjaW5nIHRoZSBgXy5tZW1vaXplLkNhY2hlYAogKiBjb25zdHJ1Y3RvciB3aXRoIG9uZSB3aG9zZSBpbnN0YW5jZXMgaW1wbGVtZW50IHRoZQogKiBbYE1hcGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXByb3BlcnRpZXMtb2YtdGhlLW1hcC1wcm90b3R5cGUtb2JqZWN0KQogKiBtZXRob2QgaW50ZXJmYWNlIG9mIGBjbGVhcmAsIGBkZWxldGVgLCBgZ2V0YCwgYGhhc2AsIGFuZCBgc2V0YC4KICoKICogQHN0YXRpYwogKiBAbWVtYmVyT2YgXwogKiBAc2luY2UgMC4xLjAKICogQGNhdGVnb3J5IEZ1bmN0aW9uCiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGhhdmUgaXRzIG91dHB1dCBtZW1vaXplZC4KICogQHBhcmFtIHtGdW5jdGlvbn0gW3Jlc29sdmVyXSBUaGUgZnVuY3Rpb24gdG8gcmVzb2x2ZSB0aGUgY2FjaGUga2V5LgogKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXplZCBmdW5jdGlvbi4KICogQGV4YW1wbGUKICoKICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxLCAnYic6IDIgfTsKICogdmFyIG90aGVyID0geyAnYyc6IDMsICdkJzogNCB9OwogKgogKiB2YXIgdmFsdWVzID0gXy5tZW1vaXplKF8udmFsdWVzKTsKICogdmFsdWVzKG9iamVjdCk7CiAqIC8vID0+IFsxLCAyXQogKgogKiB2YWx1ZXMob3RoZXIpOwogKiAvLyA9PiBbMywgNF0KICoKICogb2JqZWN0LmEgPSAyOwogKiB2YWx1ZXMob2JqZWN0KTsKICogLy8gPT4gWzEsIDJdCiAqCiAqIC8vIE1vZGlmeSB0aGUgcmVzdWx0IGNhY2hlLgogKiB2YWx1ZXMuY2FjaGUuc2V0KG9iamVjdCwgWydhJywgJ2InXSk7CiAqIHZhbHVlcyhvYmplY3QpOwogKiAvLyA9PiBbJ2EnLCAnYiddCiAqCiAqIC8vIFJlcGxhY2UgYF8ubWVtb2l6ZS5DYWNoZWAuCiAqIF8ubWVtb2l6ZS5DYWNoZSA9IFdlYWtNYXA7CiAqLwpmdW5jdGlvbiBtZW1vaXplKGZ1bmMsIHJlc29sdmVyKSB7CiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicgfHwgcmVzb2x2ZXIgIT0gbnVsbCAmJiB0eXBlb2YgcmVzb2x2ZXIgIT0gJ2Z1bmN0aW9uJykgewogICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpOwogIH0KICB2YXIgbWVtb2l6ZWQgPSBmdW5jdGlvbiAoKSB7CiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cywKICAgICAga2V5ID0gcmVzb2x2ZXIgPyByZXNvbHZlci5hcHBseSh0aGlzLCBhcmdzKSA6IGFyZ3NbMF0sCiAgICAgIGNhY2hlID0gbWVtb2l6ZWQuY2FjaGU7CiAgICBpZiAoY2FjaGUuaGFzKGtleSkpIHsKICAgICAgcmV0dXJuIGNhY2hlLmdldChrZXkpOwogICAgfQogICAgdmFyIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpcywgYXJncyk7CiAgICBtZW1vaXplZC5jYWNoZSA9IGNhY2hlLnNldChrZXksIHJlc3VsdCkgfHwgY2FjaGU7CiAgICByZXR1cm4gcmVzdWx0OwogIH07CiAgbWVtb2l6ZWQuY2FjaGUgPSBuZXcgKG1lbW9pemUuQ2FjaGUgfHwgTWFwQ2FjaGUpKCk7CiAgcmV0dXJuIG1lbW9pemVkOwp9CgovLyBFeHBvc2UgYE1hcENhY2hlYC4KbWVtb2l6ZS5DYWNoZSA9IE1hcENhY2hlOwoKLyoqIFVzZWQgYXMgdGhlIG1heGltdW0gbWVtb2l6ZSBjYWNoZSBzaXplLiAqLwp2YXIgTUFYX01FTU9JWkVfU0laRSA9IDUwMDsKCi8qKgogKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ubWVtb2l6ZWAgd2hpY2ggY2xlYXJzIHRoZSBtZW1vaXplZCBmdW5jdGlvbidzCiAqIGNhY2hlIHdoZW4gaXQgZXhjZWVkcyBgTUFYX01FTU9JWkVfU0laRWAuCiAqCiAqIEBwcml2YXRlCiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGhhdmUgaXRzIG91dHB1dCBtZW1vaXplZC4KICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgbWVtb2l6ZWQgZnVuY3Rpb24uCiAqLwpmdW5jdGlvbiBtZW1vaXplQ2FwcGVkKGZ1bmMpIHsKICB2YXIgcmVzdWx0ID0gbWVtb2l6ZShmdW5jLCBmdW5jdGlvbiAoa2V5KSB7CiAgICBpZiAoY2FjaGUuc2l6ZSA9PT0gTUFYX01FTU9JWkVfU0laRSkgewogICAgICBjYWNoZS5jbGVhcigpOwogICAgfQogICAgcmV0dXJuIGtleTsKICB9KTsKICB2YXIgY2FjaGUgPSByZXN1bHQuY2FjaGU7CiAgcmV0dXJuIHJlc3VsdDsKfQoKLyoqIFVzZWQgdG8gbWF0Y2ggcHJvcGVydHkgbmFtZXMgd2l0aGluIHByb3BlcnR5IHBhdGhzLiAqLwp2YXIgcmVQcm9wTmFtZSA9IC9bXi5bXF1dK3xcWyg/OigtP1xkKyg/OlwuXGQrKT8pfChbIiddKSgoPzooPyFcMilbXlxcXXxcXC4pKj8pXDIpXF18KD89KD86XC58XFtcXSkoPzpcLnxcW1xdfCQpKS9nOwoKLyoqIFVzZWQgdG8gbWF0Y2ggYmFja3NsYXNoZXMgaW4gcHJvcGVydHkgcGF0aHMuICovCnZhciByZUVzY2FwZUNoYXIgPSAvXFwoXFwpPy9nOwoKLyoqCiAqIENvbnZlcnRzIGBzdHJpbmdgIHRvIGEgcHJvcGVydHkgcGF0aCBhcnJheS4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIGNvbnZlcnQuCiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgcHJvcGVydHkgcGF0aCBhcnJheS4KICovCnZhciBzdHJpbmdUb1BhdGggPSBtZW1vaXplQ2FwcGVkKGZ1bmN0aW9uIChzdHJpbmcpIHsKICB2YXIgcmVzdWx0ID0gW107CiAgaWYgKHN0cmluZy5jaGFyQ29kZUF0KDApID09PSA0NiAvKiAuICovKSB7CiAgICByZXN1bHQucHVzaCgnJyk7CiAgfQogIHN0cmluZy5yZXBsYWNlKHJlUHJvcE5hbWUsIGZ1bmN0aW9uIChtYXRjaCwgbnVtYmVyLCBxdW90ZSwgc3ViU3RyaW5nKSB7CiAgICByZXN1bHQucHVzaChxdW90ZSA/IHN1YlN0cmluZy5yZXBsYWNlKHJlRXNjYXBlQ2hhciwgJyQxJykgOiBudW1iZXIgfHwgbWF0Y2gpOwogIH0pOwogIHJldHVybiByZXN1bHQ7Cn0pOwp2YXIgc3RyaW5nVG9QYXRoJDEgPSBzdHJpbmdUb1BhdGg7CgovKioKICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLm1hcGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlCiAqIHNob3J0aGFuZHMuCiAqCiAqIEBwcml2YXRlCiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci4KICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi4KICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgbWFwcGVkIGFycmF5LgogKi8KZnVuY3Rpb24gYXJyYXlNYXAoYXJyYXksIGl0ZXJhdGVlKSB7CiAgdmFyIGluZGV4ID0gLTEsCiAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aCwKICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7CiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHsKICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSk7CiAgfQogIHJldHVybiByZXN1bHQ7Cn0KCi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqLwp2YXIgSU5GSU5JVFkkMiA9IDEgLyAwOwoKLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovCnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCQxID8gU3ltYm9sJDEucHJvdG90eXBlIDogdW5kZWZpbmVkLAogIHN5bWJvbFRvU3RyaW5nID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by50b1N0cmluZyA6IHVuZGVmaW5lZDsKCi8qKgogKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50b1N0cmluZ2Agd2hpY2ggZG9lc24ndCBjb252ZXJ0IG51bGxpc2gKICogdmFsdWVzIHRvIGVtcHR5IHN0cmluZ3MuCiAqCiAqIEBwcml2YXRlCiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuCiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy4KICovCmZ1bmN0aW9uIGJhc2VUb1N0cmluZyh2YWx1ZSkgewogIC8vIEV4aXQgZWFybHkgZm9yIHN0cmluZ3MgdG8gYXZvaWQgYSBwZXJmb3JtYW5jZSBoaXQgaW4gc29tZSBlbnZpcm9ubWVudHMuCiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykgewogICAgcmV0dXJuIHZhbHVlOwogIH0KICBpZiAoaXNBcnJheSQxKHZhbHVlKSkgewogICAgLy8gUmVjdXJzaXZlbHkgY29udmVydCB2YWx1ZXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS4KICAgIHJldHVybiBhcnJheU1hcCh2YWx1ZSwgYmFzZVRvU3RyaW5nKSArICcnOwogIH0KICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7CiAgICByZXR1cm4gc3ltYm9sVG9TdHJpbmcgPyBzeW1ib2xUb1N0cmluZy5jYWxsKHZhbHVlKSA6ICcnOwogIH0KICB2YXIgcmVzdWx0ID0gdmFsdWUgKyAnJzsKICByZXR1cm4gcmVzdWx0ID09ICcwJyAmJiAxIC8gdmFsdWUgPT0gLUlORklOSVRZJDIgPyAnLTAnIDogcmVzdWx0Owp9CgovKioKICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZy4gQW4gZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkIGZvciBgbnVsbGAKICogYW5kIGB1bmRlZmluZWRgIHZhbHVlcy4gVGhlIHNpZ24gb2YgYC0wYCBpcyBwcmVzZXJ2ZWQuCiAqCiAqIEBzdGF0aWMKICogQG1lbWJlck9mIF8KICogQHNpbmNlIDQuMC4wCiAqIEBjYXRlZ29yeSBMYW5nCiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuCiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuCiAqIEBleGFtcGxlCiAqCiAqIF8udG9TdHJpbmcobnVsbCk7CiAqIC8vID0+ICcnCiAqCiAqIF8udG9TdHJpbmcoLTApOwogKiAvLyA9PiAnLTAnCiAqCiAqIF8udG9TdHJpbmcoWzEsIDIsIDNdKTsKICogLy8gPT4gJzEsMiwzJwogKi8KZnVuY3Rpb24gdG9TdHJpbmcodmFsdWUpIHsKICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogYmFzZVRvU3RyaW5nKHZhbHVlKTsKfQoKLyoqCiAqIENhc3RzIGB2YWx1ZWAgdG8gYSBwYXRoIGFycmF5IGlmIGl0J3Mgbm90IG9uZS4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC4KICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkga2V5cyBvbi4KICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBjYXN0IHByb3BlcnR5IHBhdGggYXJyYXkuCiAqLwpmdW5jdGlvbiBjYXN0UGF0aCh2YWx1ZSwgb2JqZWN0KSB7CiAgaWYgKGlzQXJyYXkkMSh2YWx1ZSkpIHsKICAgIHJldHVybiB2YWx1ZTsKICB9CiAgcmV0dXJuIGlzS2V5KHZhbHVlLCBvYmplY3QpID8gW3ZhbHVlXSA6IHN0cmluZ1RvUGF0aCQxKHRvU3RyaW5nKHZhbHVlKSk7Cn0KCi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqLwp2YXIgSU5GSU5JVFkkMSA9IDEgLyAwOwoKLyoqCiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcga2V5IGlmIGl0J3Mgbm90IGEgc3RyaW5nIG9yIHN5bWJvbC4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC4KICogQHJldHVybnMge3N0cmluZ3xzeW1ib2x9IFJldHVybnMgdGhlIGtleS4KICovCmZ1bmN0aW9uIHRvS2V5KHZhbHVlKSB7CiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCBpc1N5bWJvbCh2YWx1ZSkpIHsKICAgIHJldHVybiB2YWx1ZTsKICB9CiAgdmFyIHJlc3VsdCA9IHZhbHVlICsgJyc7CiAgcmV0dXJuIHJlc3VsdCA9PSAnMCcgJiYgMSAvIHZhbHVlID09IC1JTkZJTklUWSQxID8gJy0wJyA6IHJlc3VsdDsKfQoKLyoqCiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmdldGAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWZhdWx0IHZhbHVlcy4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LgogKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LgogKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzb2x2ZWQgdmFsdWUuCiAqLwpmdW5jdGlvbiBiYXNlR2V0KG9iamVjdCwgcGF0aCkgewogIHBhdGggPSBjYXN0UGF0aChwYXRoLCBvYmplY3QpOwogIHZhciBpbmRleCA9IDAsCiAgICBsZW5ndGggPSBwYXRoLmxlbmd0aDsKICB3aGlsZSAob2JqZWN0ICE9IG51bGwgJiYgaW5kZXggPCBsZW5ndGgpIHsKICAgIG9iamVjdCA9IG9iamVjdFt0b0tleShwYXRoW2luZGV4KytdKV07CiAgfQogIHJldHVybiBpbmRleCAmJiBpbmRleCA9PSBsZW5ndGggPyBvYmplY3QgOiB1bmRlZmluZWQ7Cn0KCi8qKgogKiBHZXRzIHRoZSB2YWx1ZSBhdCBgcGF0aGAgb2YgYG9iamVjdGAuIElmIHRoZSByZXNvbHZlZCB2YWx1ZSBpcwogKiBgdW5kZWZpbmVkYCwgdGhlIGBkZWZhdWx0VmFsdWVgIGlzIHJldHVybmVkIGluIGl0cyBwbGFjZS4KICoKICogQHN0YXRpYwogKiBAbWVtYmVyT2YgXwogKiBAc2luY2UgMy43LjAKICogQGNhdGVnb3J5IE9iamVjdAogKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuCiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuCiAqIEBwYXJhbSB7Kn0gW2RlZmF1bHRWYWx1ZV0gVGhlIHZhbHVlIHJldHVybmVkIGZvciBgdW5kZWZpbmVkYCByZXNvbHZlZCB2YWx1ZXMuCiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXNvbHZlZCB2YWx1ZS4KICogQGV4YW1wbGUKICoKICogdmFyIG9iamVjdCA9IHsgJ2EnOiBbeyAnYic6IHsgJ2MnOiAzIH0gfV0gfTsKICoKICogXy5nZXQob2JqZWN0LCAnYVswXS5iLmMnKTsKICogLy8gPT4gMwogKgogKiBfLmdldChvYmplY3QsIFsnYScsICcwJywgJ2InLCAnYyddKTsKICogLy8gPT4gMwogKgogKiBfLmdldChvYmplY3QsICdhLmIuYycsICdkZWZhdWx0Jyk7CiAqIC8vID0+ICdkZWZhdWx0JwogKi8KZnVuY3Rpb24gZ2V0KG9iamVjdCwgcGF0aCwgZGVmYXVsdFZhbHVlKSB7CiAgdmFyIHJlc3VsdCA9IG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogYmFzZUdldChvYmplY3QsIHBhdGgpOwogIHJldHVybiByZXN1bHQgPT09IHVuZGVmaW5lZCA/IGRlZmF1bHRWYWx1ZSA6IHJlc3VsdDsKfQoKLyoqDQogKiDliKTmlrfmmK/lkKbngrrlrZfkuLINCiAqDQogKiBVbml0IFRlc3Q6IHtAbGluayBodHRwczovL2dpdGh1Yi5jb20veXVkYS1seXUvd3NlbWkvYmxvYi9tYXN0ZXIvdGVzdC9pc3N0ci50ZXN0Lm1qcyBHaXRodWJ9DQogKiBAbWVtYmVyT2Ygd3NlbWkNCiAqIEBwYXJhbSB7Kn0gdiDovLjlhaXku7vmhI/os4fmlpkNCiAqIEByZXR1cm5zIHtCb29sZWFufSDlm57lgrPliKTmlrfluIPmnpflgLwNCiAqIEBleGFtcGxlDQogKg0KICogY29uc29sZS5sb2coaXNzdHIoMCkpDQogKiAvLyA9PiBmYWxzZQ0KICoNCiAqIGNvbnNvbGUubG9nKGlzc3RyKCcwJykpDQogKiAvLyA9PiB0cnVlDQogKg0KICogY29uc29sZS5sb2coaXNzdHIoJycpKQ0KICogLy8gPT4gdHJ1ZQ0KICoNCiAqLwpmdW5jdGlvbiBpc3N0cih2KSB7CiAgbGV0IGMgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodik7CiAgcmV0dXJuIGMgPT09ICdbb2JqZWN0IFN0cmluZ10nOwp9CgovKioNCiAqIOWIpOaWt+aYr+WQpueCuuacieaViOWtl+S4sg0KICoNCiAqIFVuaXQgVGVzdDoge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS95dWRhLWx5dS93c2VtaS9ibG9iL21hc3Rlci90ZXN0L2lzZXN0ci50ZXN0Lm1qcyBHaXRodWJ9DQogKiBAbWVtYmVyT2Ygd3NlbWkNCiAqIEBwYXJhbSB7Kn0gdiDovLjlhaXku7vmhI/os4fmlpkNCiAqIEByZXR1cm5zIHtCb29sZWFufSDlm57lgrPliKTmlrfluIPmnpflgLwNCiAqIEBleGFtcGxlDQogKg0KICogY29uc29sZS5sb2coaXNlc3RyKCcxLjI1JykpDQogKiAvLyA9PiB0cnVlDQogKg0KICogY29uc29sZS5sb2coaXNlc3RyKDEyNSkpDQogKiAvLyA9PiBmYWxzZQ0KICoNCiAqIGNvbnNvbGUubG9nKGlzZXN0cignJykpDQogKiAvLyA9PiBmYWxzZQ0KICoNCiAqLwpmdW5jdGlvbiBpc2VzdHIodikgewogIC8vY2hlY2sKICBpZiAoaXNzdHIodikpIHsKICAgIGlmICh2ICE9PSAnJykgewogICAgICByZXR1cm4gdHJ1ZTsKICAgIH0KICB9CiAgcmV0dXJuIGZhbHNlOwp9CgovKiogVXNlZCB0byBtYXRjaCBhIHNpbmdsZSB3aGl0ZXNwYWNlIGNoYXJhY3Rlci4gKi8KdmFyIHJlV2hpdGVzcGFjZSA9IC9ccy87CgovKioKICogVXNlZCBieSBgXy50cmltYCBhbmQgYF8udHJpbUVuZGAgdG8gZ2V0IHRoZSBpbmRleCBvZiB0aGUgbGFzdCBub24td2hpdGVzcGFjZQogKiBjaGFyYWN0ZXIgb2YgYHN0cmluZ2AuCiAqCiAqIEBwcml2YXRlCiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBpbnNwZWN0LgogKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbGFzdCBub24td2hpdGVzcGFjZSBjaGFyYWN0ZXIuCiAqLwpmdW5jdGlvbiB0cmltbWVkRW5kSW5kZXgoc3RyaW5nKSB7CiAgdmFyIGluZGV4ID0gc3RyaW5nLmxlbmd0aDsKICB3aGlsZSAoaW5kZXgtLSAmJiByZVdoaXRlc3BhY2UudGVzdChzdHJpbmcuY2hhckF0KGluZGV4KSkpIHt9CiAgcmV0dXJuIGluZGV4Owp9CgovKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIHdoaXRlc3BhY2UuICovCnZhciByZVRyaW1TdGFydCA9IC9eXHMrLzsKCi8qKgogKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50cmltYC4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIHRyaW0uCiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHRyaW1tZWQgc3RyaW5nLgogKi8KZnVuY3Rpb24gYmFzZVRyaW0oc3RyaW5nKSB7CiAgcmV0dXJuIHN0cmluZyA/IHN0cmluZy5zbGljZSgwLCB0cmltbWVkRW5kSW5kZXgoc3RyaW5nKSArIDEpLnJlcGxhY2UocmVUcmltU3RhcnQsICcnKSA6IHN0cmluZzsKfQoKLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovCnZhciBOQU4gPSAwIC8gMDsKCi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovCnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7CgovKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovCnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pOwoKLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovCnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pOwoKLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi8KdmFyIGZyZWVQYXJzZUludCA9IHBhcnNlSW50OwoKLyoqCiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBudW1iZXIuCiAqCiAqIEBzdGF0aWMKICogQG1lbWJlck9mIF8KICogQHNpbmNlIDQuMC4wCiAqIEBjYXRlZ29yeSBMYW5nCiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuCiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci4KICogQGV4YW1wbGUKICoKICogXy50b051bWJlcigzLjIpOwogKiAvLyA9PiAzLjIKICoKICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTsKICogLy8gPT4gNWUtMzI0CiAqCiAqIF8udG9OdW1iZXIoSW5maW5pdHkpOwogKiAvLyA9PiBJbmZpbml0eQogKgogKiBfLnRvTnVtYmVyKCczLjInKTsKICogLy8gPT4gMy4yCiAqLwpmdW5jdGlvbiB0b051bWJlcih2YWx1ZSkgewogIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHsKICAgIHJldHVybiB2YWx1ZTsKICB9CiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkgewogICAgcmV0dXJuIE5BTjsKICB9CiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkgewogICAgdmFyIG90aGVyID0gdHlwZW9mIHZhbHVlLnZhbHVlT2YgPT0gJ2Z1bmN0aW9uJyA/IHZhbHVlLnZhbHVlT2YoKSA6IHZhbHVlOwogICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyBvdGhlciArICcnIDogb3RoZXI7CiAgfQogIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHsKICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogK3ZhbHVlOwogIH0KICB2YWx1ZSA9IGJhc2VUcmltKHZhbHVlKTsKICB2YXIgaXNCaW5hcnkgPSByZUlzQmluYXJ5LnRlc3QodmFsdWUpOwogIHJldHVybiBpc0JpbmFyeSB8fCByZUlzT2N0YWwudGVzdCh2YWx1ZSkgPyBmcmVlUGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIGlzQmluYXJ5ID8gMiA6IDgpIDogcmVJc0JhZEhleC50ZXN0KHZhbHVlKSA/IE5BTiA6ICt2YWx1ZTsKfQoKLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovCnZhciBJTkZJTklUWSA9IDEgLyAwLAogIE1BWF9JTlRFR0VSID0gMS43OTc2OTMxMzQ4NjIzMTU3ZSszMDg7CgovKioKICogQ29udmVydHMgYHZhbHVlYCB0byBhIGZpbml0ZSBudW1iZXIuCiAqCiAqIEBzdGF0aWMKICogQG1lbWJlck9mIF8KICogQHNpbmNlIDQuMTIuMAogKiBAY2F0ZWdvcnkgTGFuZwogKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LgogKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgbnVtYmVyLgogKiBAZXhhbXBsZQogKgogKiBfLnRvRmluaXRlKDMuMik7CiAqIC8vID0+IDMuMgogKgogKiBfLnRvRmluaXRlKE51bWJlci5NSU5fVkFMVUUpOwogKiAvLyA9PiA1ZS0zMjQKICoKICogXy50b0Zpbml0ZShJbmZpbml0eSk7CiAqIC8vID0+IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4CiAqCiAqIF8udG9GaW5pdGUoJzMuMicpOwogKiAvLyA9PiAzLjIKICovCmZ1bmN0aW9uIHRvRmluaXRlKHZhbHVlKSB7CiAgaWYgKCF2YWx1ZSkgewogICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiAwOwogIH0KICB2YWx1ZSA9IHRvTnVtYmVyKHZhbHVlKTsKICBpZiAodmFsdWUgPT09IElORklOSVRZIHx8IHZhbHVlID09PSAtSU5GSU5JVFkpIHsKICAgIHZhciBzaWduID0gdmFsdWUgPCAwID8gLTEgOiAxOwogICAgcmV0dXJuIHNpZ24gKiBNQVhfSU5URUdFUjsKICB9CiAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZSA/IHZhbHVlIDogMDsKfQoKLyoqCiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYW4gaW50ZWdlci4KICoKICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb24KICogW2BUb0ludGVnZXJgXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9pbnRlZ2VyKS4KICoKICogQHN0YXRpYwogKiBAbWVtYmVyT2YgXwogKiBAc2luY2UgNC4wLjAKICogQGNhdGVnb3J5IExhbmcKICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC4KICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgY29udmVydGVkIGludGVnZXIuCiAqIEBleGFtcGxlCiAqCiAqIF8udG9JbnRlZ2VyKDMuMik7CiAqIC8vID0+IDMKICoKICogXy50b0ludGVnZXIoTnVtYmVyLk1JTl9WQUxVRSk7CiAqIC8vID0+IDAKICoKICogXy50b0ludGVnZXIoSW5maW5pdHkpOwogKiAvLyA9PiAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOAogKgogKiBfLnRvSW50ZWdlcignMy4yJyk7CiAqIC8vID0+IDMKICovCmZ1bmN0aW9uIHRvSW50ZWdlcih2YWx1ZSkgewogIHZhciByZXN1bHQgPSB0b0Zpbml0ZSh2YWx1ZSksCiAgICByZW1haW5kZXIgPSByZXN1bHQgJSAxOwogIHJldHVybiByZXN1bHQgPT09IHJlc3VsdCA/IHJlbWFpbmRlciA/IHJlc3VsdCAtIHJlbWFpbmRlciA6IHJlc3VsdCA6IDA7Cn0KCi8qKgogKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhbiBpbnRlZ2VyLgogKgogKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgYmFzZWQgb24KICogW2BOdW1iZXIuaXNJbnRlZ2VyYF0oaHR0cHM6Ly9tZG4uaW8vTnVtYmVyL2lzSW50ZWdlcikuCiAqCiAqIEBzdGF0aWMKICogQG1lbWJlck9mIF8KICogQHNpbmNlIDQuMC4wCiAqIEBjYXRlZ29yeSBMYW5nCiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLgogKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBpbnRlZ2VyLCBlbHNlIGBmYWxzZWAuCiAqIEBleGFtcGxlCiAqCiAqIF8uaXNJbnRlZ2VyKDMpOwogKiAvLyA9PiB0cnVlCiAqCiAqIF8uaXNJbnRlZ2VyKE51bWJlci5NSU5fVkFMVUUpOwogKiAvLyA9PiBmYWxzZQogKgogKiBfLmlzSW50ZWdlcihJbmZpbml0eSk7CiAqIC8vID0+IGZhbHNlCiAqCiAqIF8uaXNJbnRlZ2VyKCczJyk7CiAqIC8vID0+IGZhbHNlCiAqLwpmdW5jdGlvbiBpc0ludGVnZXIodmFsdWUpIHsKICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmIHZhbHVlID09IHRvSW50ZWdlcih2YWx1ZSk7Cn0KCi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi8KdmFyIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXSc7CgovKioKICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGJvb2xlYW4gcHJpbWl0aXZlIG9yIG9iamVjdC4KICoKICogQHN0YXRpYwogKiBAbWVtYmVyT2YgXwogKiBAc2luY2UgMC4xLjAKICogQGNhdGVnb3J5IExhbmcKICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suCiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgYm9vbGVhbiwgZWxzZSBgZmFsc2VgLgogKiBAZXhhbXBsZQogKgogKiBfLmlzQm9vbGVhbihmYWxzZSk7CiAqIC8vID0+IHRydWUKICoKICogXy5pc0Jvb2xlYW4obnVsbCk7CiAqIC8vID0+IGZhbHNlCiAqLwpmdW5jdGlvbiBpc0Jvb2xlYW4odmFsdWUpIHsKICByZXR1cm4gdmFsdWUgPT09IHRydWUgfHwgdmFsdWUgPT09IGZhbHNlIHx8IGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gYm9vbFRhZzsKfQoKLyoqDQogKiDliKTmlrfmmK/lkKbngrpib29sZWFuDQogKg0KICogVW5pdCBUZXN0OiB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL3l1ZGEtbHl1L3dzZW1pL2Jsb2IvbWFzdGVyL3Rlc3QvaXNib2wudGVzdC5tanMgR2l0aHVifQ0KICogQG1lbWJlck9mIHdzZW1pDQogKiBAcGFyYW0geyp9IHYg6Ly45YWl5Lu75oSP6LOH5paZDQogKiBAcmV0dXJucyB7Qm9vbGVhbn0g5Zue5YKz5Yik5pa35biD5p6X5YC8DQogKiBAZXhhbXBsZQ0KICoNCiAqIGNvbnNvbGUubG9nKGlzYm9sKGZhbHNlKSkNCiAqIC8vID0+IHRydWUNCiAqDQogKi8KZnVuY3Rpb24gaXNib2wodikgewogIHJldHVybiBpc0Jvb2xlYW4odik7Cn0KCi8qKg0KICog5Yik5pa35piv5ZCm54K65pW45a2XDQogKg0KICogVW5pdCBUZXN0OiB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL3l1ZGEtbHl1L3dzZW1pL2Jsb2IvbWFzdGVyL3Rlc3QvaXNuYnIudGVzdC5tanMgR2l0aHVifQ0KICogQG1lbWJlck9mIHdzZW1pDQogKiBAcGFyYW0geyp9IHYg6Ly45YWl5Lu75oSP6LOH5paZDQogKiBAcmV0dXJucyB7Qm9vbGVhbn0g5Zue5YKz5Yik5pa35biD5p6X5YC8DQogKiBAZXhhbXBsZQ0KICoNCiAqIGNvbnNvbGUubG9nKGlzbmJyKDEuMjUpKQ0KICogLy8gPT4gdHJ1ZQ0KICoNCiAqIGNvbnNvbGUubG9nKGlzbmJyKCcxLjI1JykpDQogKiAvLyA9PiBmYWxzZQ0KICoNCiAqLwpmdW5jdGlvbiBpc25icih2KSB7CiAgbGV0IGMgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodik7CiAgcmV0dXJuIGMgPT09ICdbb2JqZWN0IE51bWJlcl0nOwp9CgovLyBpbXBvcnQgaXNOYU4gZnJvbSAnbG9kYXNoLWVzL2lzTmFOLmpzJwoKLyoqDQogKiDliKTmlrfmmK/lkKbngrpOYU4NCiAqDQogKiBVbml0IFRlc3Q6IHtAbGluayBodHRwczovL2dpdGh1Yi5jb20veXVkYS1seXUvd3NlbWkvYmxvYi9tYXN0ZXIvdGVzdC9pc25hbi50ZXN0Lm1qcyBHaXRodWJ9DQogKiBAbWVtYmVyT2Ygd3NlbWkNCiAqIEBwYXJhbSB7Kn0gdiDovLjlhaXku7vmhI/os4fmlpkNCiAqIEByZXR1cm5zIHtCb29sZWFufSDlm57lgrPliKTmlrfluIPmnpflgLwNCiAqIEBleGFtcGxlDQogKg0KICogY29uc29sZS5sb2coaXNuYW4oTmFOKSkNCiAqIC8vID0+IHRydWUNCiAqDQogKi8KZnVuY3Rpb24gaXNuYW4odikgewogIC8vIHJldHVybiBpc05hTih2KQogIHJldHVybiB2ICE9PSB2Owp9CgovKioNCiAqIOWIpOaWt+aYr+WQpueCuuaVuOWtlw0KICoNCiAqIOWPquacieaVuOWtlyhOYU7pmaTlpJYp6IiH5pW45a2X5a2X5Liy5Zue5YKzdHJ1Ze+8m+epuuWtl+S4suiIh+e0lOepuueZveWtl+S4sijlkKvlpJrlgIvnqbrnmb3jgIF0YWLjgIHmj5vooYwp5Zue5YKzZmFsc2XvvIzkuI3lm6BKU+S5i051bWJlcignICcp54K6MOiAjOimlueCuuaVuOWtl+OAguaVuOWtl+Wtl+S4suS5i+WJjeW+jOepuueZveWPr+aOpeWPlyjkvovlpoInIDUgJ++8jOe2sumggei8uOWFpeW4uOimiykNCiAqDQogKiDms6jmhI/vvJrmnKzlh73lvI/kuI3mlK/mj7RCaWdJbnTvvIx0eXBlb2YgQmlnSW505YC854K6J2JpZ2ludCfogIzpnZ4nbnVtYmVyJ+aVhWlzbmJy5Yik5a6a54K6ZmFsc2XjgIINCiAqIEJpZ0ludOiIh051bWJlcuWcqEpT54K65LqS5LiN55u45a6555qE566X6KGT5Z+fKGAxbiArIDFg44CBYE1hdGguZmxvb3IoMW4pYCDnmobmk7JUeXBlRXJyb3Ip77yMDQogKiDogIxpc251beeahOmaseWQq+Wlkee0hOaYr+OAjOmAmumBjuW+jOWPr+WBmk51bWJlcueul+ihk+mBi+eul+OAje+8jHdzZW1p5YWn6YC+NjDomZVjYWxsc2l0ZeS+neiztOatpOWlkee0hA0KICogKOWmgmFyck1heC9hcnJNaW4vcm91bmQvcmFuZG9tUmFuZ2XnrYkp77yM6Iul5pS+5a+saXNudW3oqo1CaWdJbnTlsIflsI7oh7TpgJnkuptjYWxsc2l0ZeWft+ihjOacn+mMr+iqpOOAgg0KICog5q2k6Kit6KiI6IiHbG9kYXNoIGBfLmlzTnVtYmVyYCDlsIdCaWdJbnTmjpLpmaTnmoTomZXnkIbkuIDoh7TjgIJCaWdJbnToq4vlj6bkvZznjajnq4vliKTmlrfjgIINCiAqDQogKiBVbml0IFRlc3Q6IHtAbGluayBodHRwczovL2dpdGh1Yi5jb20veXVkYS1seXUvd3NlbWkvYmxvYi9tYXN0ZXIvdGVzdC9pc251bS50ZXN0Lm1qcyBHaXRodWJ9DQogKiBAbWVtYmVyT2Ygd3NlbWkNCiAqIEBwYXJhbSB7Kn0gdiDovLjlhaXku7vmhI/os4fmlpkNCiAqIEByZXR1cm5zIHtCb29sZWFufSDlm57lgrPliKTmlrfluIPmnpflgLwNCiAqIEBleGFtcGxlDQogKg0KICogY29uc29sZS5sb2coaXNudW0oMCkpDQogKiAvLyA9PiB0cnVlDQogKg0KICogY29uc29sZS5sb2coaXNudW0oMS4yNSkpDQogKiAvLyA9PiB0cnVlDQogKg0KICogY29uc29sZS5sb2coaXNudW0oJy0xMjUnKSkNCiAqIC8vID0+IHRydWUNCiAqDQogKiBjb25zb2xlLmxvZyhpc251bSgnICcpKQ0KICogLy8gPT4gZmFsc2UgKOe0lOepuueZveWtl+S4suS4jeeCuuaVuOWtlykNCiAqDQogKiBjb25zb2xlLmxvZyhpc251bSgxMjNuKSkNCiAqIC8vID0+IGZhbHNlIChCaWdJbnTkuI3ooqvoppbngrrmlbjlrZcsIOips+imi+S4iuaWueiqquaYjikNCiAqDQogKi8KZnVuY3Rpb24gaXNudW0odikgewogIGxldCBiID0gZmFsc2U7CiAgaWYgKGlzZXN0cih2KSkgewogICAgaWYgKHYudHJpbSgpID09PSAnJykgewogICAgICByZXR1cm4gZmFsc2U7IC8v57SU56m655m95a2X5LiyLCBOdW1iZXIoJyAnKeeCujDkvYbpnZ7mlbjlrZflrZfkuLIKICAgIH0KICAgIGIgPSAhaXNOYU4oTnVtYmVyKHYpKTsKICB9IGVsc2UgaWYgKGlzbmJyKHYpKSB7CiAgICAvL+azqOaEj05hTueCuk51bWJlciwg5pWFaXNuYnLlm57lgrN0cnVlCiAgICBpZiAoaXNuYW4odikpIHsKICAgICAgcmV0dXJuIGZhbHNlOyAvL+atpOiZleWIpOWumueCuuacieaViOaVuOWtlywg5pWFTmFO6aCI5YmU6ZmkCiAgICB9IGVsc2UgewogICAgICBiID0gdHJ1ZTsKICAgIH0KICB9CiAgcmV0dXJuIGI7Cn0KCi8qKg0KICog5pW45a2X5oiW5a2X5Liy6L2J5rWu6bue5pW4DQogKiDoi6XovLjlhaXpnZ7mlbjlrZfliYflm57lgrMwDQogKg0KICogVW5pdCBUZXN0OiB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL3l1ZGEtbHl1L3dzZW1pL2Jsb2IvbWFzdGVyL3Rlc3QvY2RibC50ZXN0Lm1qcyBHaXRodWJ9DQogKiBAbWVtYmVyT2Ygd3NlbWkNCiAqIEBwYXJhbSB7TnVtYmVyfFN0cmluZ30gdiDovLjlhaXmlbjlrZfmiJblrZfkuLINCiAqIEByZXR1cm5zIHtOdW1iZXJ9IOWbnuWCs+aVuOWtlw0KICogQGV4YW1wbGUNCiAqDQogKiBjb25zb2xlLmxvZyhjZGJsKCcyNScpKQ0KICogLy8gPT4gMjUNCiAqDQogKi8KZnVuY3Rpb24gY2RibCh2KSB7CiAgLy9jaGVjawogIGlmICghaXNudW0odikpIHsKICAgIHJldHVybiAwOwogIH0KICBsZXQgciA9IHRvRmluaXRlKHYpOwogIHJldHVybiByOwp9CgovKioNCiAqIOWIpOaWt+aYr+WQpueCuuaVtOaVuA0KICoNCiAqIFVuaXQgVGVzdDoge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS95dWRhLWx5dS93c2VtaS9ibG9iL21hc3Rlci90ZXN0L2lzaW50LnRlc3QubWpzIEdpdGh1Yn0NCiAqIEBtZW1iZXJPZiB3c2VtaQ0KICogQHBhcmFtIHsqfSB2IOi8uOWFpeS7u+aEj+izh+aWmQ0KICogQHBhcmFtIHtPYmplY3R9IFtvcHQ9e31dIOi8uOWFpeioreWumueJqeS7tu+8jOmgkOiorXt9DQogKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHQudXNlTGltaXRTYWZlPWZhbHNlXSDovLjlhaXmmK/lkKbpmZDliLbpoIjngrrlronlhajmlbTmlbjluIPmnpflgLzvvIzoi6Xngrp0cnVl5YmH6LaF5Ye65a6J5YWo5pW05pW456+E5ZyN6ICFKOWNs051bWJlci5pc1NhZmVJbnRlZ2Vy54K6ZmFsc2XvvIzlkKtJbmZpbml0eeOAgS1JbmZpbml0eeiIh+e1leWwjeWAvOWkp+aWvE51bWJlci5NQVhfU0FGRV9JTlRFR0VS6ICFKeWIpOWumueCumZhbHNl77yM6aCQ6KitZmFsc2UNCiAqIEByZXR1cm5zIHtCb29sZWFufSDlm57lgrPliKTmlrfluIPmnpflgLwNCiAqIEBleGFtcGxlDQogKg0KICogY29uc29sZS5sb2coaXNpbnQoJzEuMjUnKSkNCiAqIC8vID0+IGZhbHNlDQogKg0KICogY29uc29sZS5sb2coaXNpbnQoJzEyNScpKQ0KICogLy8gPT4gdHJ1ZQ0KICoNCiAqIGNvbnNvbGUubG9nKGlzaW50KDEuMjUpKQ0KICogLy8gPT4gZmFsc2UNCiAqDQogKiBjb25zb2xlLmxvZyhpc2ludCgxMjUpKQ0KICogLy8gPT4gdHJ1ZQ0KICoNCiAqIGNvbnNvbGUubG9nKGlzaW50KEluZmluaXR5KSkNCiAqIC8vID0+IHRydWUNCiAqDQogKiBjb25zb2xlLmxvZyhpc2ludChJbmZpbml0eSwgeyB1c2VMaW1pdFNhZmU6IHRydWUgfSkpDQogKiAvLyA9PiBmYWxzZQ0KICoNCiAqLwpmdW5jdGlvbiBpc2ludCh2LCBvcHQgPSB7fSkgewogIC8vdXNlTGltaXRTYWZlCiAgbGV0IHVzZUxpbWl0U2FmZSA9IGdldChvcHQsICd1c2VMaW1pdFNhZmUnLCBudWxsKTsKICBpZiAoIWlzYm9sKHVzZUxpbWl0U2FmZSkpIHsKICAgIHVzZUxpbWl0U2FmZSA9IGZhbHNlOwogIH0KICBpZiAoaXNudW0odikpIHsKICAgIHYgPSBjZGJsKHYpOwogICAgaWYgKHVzZUxpbWl0U2FmZSkgewogICAgICAvL+WboGNkYmzlsI1JbmZpbml0eeiIh+i2heWHuuevhOWcjeaVuOWAvOacg+i9ieeCuk51bWJlci5NQVhfVkFMVUUsIOiAjOWFtueCumxvZGFzaOS5i+aVtOaVuOaVhWlzSW50ZWdlcuS7jeeCunRydWUsIOmgiOaUueeUqE51bWJlci5pc1NhZmVJbnRlZ2Vy5pa56IO95o6S6ZmkCiAgICAgIHJldHVybiBOdW1iZXIuaXNTYWZlSW50ZWdlcih2KTsKICAgIH0gZWxzZSB7CiAgICAgIHJldHVybiBpc0ludGVnZXIodik7CiAgICB9CiAgfSBlbHNlIHsKICAgIHJldHVybiBmYWxzZTsKICB9Cn0KCi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi8KdmFyIG5hdGl2ZUlzRmluaXRlID0gcm9vdCQxLmlzRmluaXRlLAogIG5hdGl2ZU1pbiA9IE1hdGgubWluOwoKLyoqCiAqIENyZWF0ZXMgYSBmdW5jdGlvbiBsaWtlIGBfLnJvdW5kYC4KICoKICogQHByaXZhdGUKICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZE5hbWUgVGhlIG5hbWUgb2YgdGhlIGBNYXRoYCBtZXRob2QgdG8gdXNlIHdoZW4gcm91bmRpbmcuCiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHJvdW5kIGZ1bmN0aW9uLgogKi8KZnVuY3Rpb24gY3JlYXRlUm91bmQobWV0aG9kTmFtZSkgewogIHZhciBmdW5jID0gTWF0aFttZXRob2ROYW1lXTsKICByZXR1cm4gZnVuY3Rpb24gKG51bWJlciwgcHJlY2lzaW9uKSB7CiAgICBudW1iZXIgPSB0b051bWJlcihudW1iZXIpOwogICAgcHJlY2lzaW9uID0gcHJlY2lzaW9uID09IG51bGwgPyAwIDogbmF0aXZlTWluKHRvSW50ZWdlcihwcmVjaXNpb24pLCAyOTIpOwogICAgaWYgKHByZWNpc2lvbiAmJiBuYXRpdmVJc0Zpbml0ZShudW1iZXIpKSB7CiAgICAgIC8vIFNoaWZ0IHdpdGggZXhwb25lbnRpYWwgbm90YXRpb24gdG8gYXZvaWQgZmxvYXRpbmctcG9pbnQgaXNzdWVzLgogICAgICAvLyBTZWUgW01ETl0oaHR0cHM6Ly9tZG4uaW8vcm91bmQjRXhhbXBsZXMpIGZvciBtb3JlIGRldGFpbHMuCiAgICAgIHZhciBwYWlyID0gKHRvU3RyaW5nKG51bWJlcikgKyAnZScpLnNwbGl0KCdlJyksCiAgICAgICAgdmFsdWUgPSBmdW5jKHBhaXJbMF0gKyAnZScgKyAoK3BhaXJbMV0gKyBwcmVjaXNpb24pKTsKICAgICAgcGFpciA9ICh0b1N0cmluZyh2YWx1ZSkgKyAnZScpLnNwbGl0KCdlJyk7CiAgICAgIHJldHVybiArKHBhaXJbMF0gKyAnZScgKyAoK3BhaXJbMV0gLSBwcmVjaXNpb24pKTsKICAgIH0KICAgIHJldHVybiBmdW5jKG51bWJlcik7CiAgfTsKfQoKLyoqCiAqIENvbXB1dGVzIGBudW1iZXJgIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAuCiAqCiAqIEBzdGF0aWMKICogQG1lbWJlck9mIF8KICogQHNpbmNlIDMuMTAuMAogKiBAY2F0ZWdvcnkgTWF0aAogKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIFRoZSBudW1iZXIgdG8gcm91bmQuCiAqIEBwYXJhbSB7bnVtYmVyfSBbcHJlY2lzaW9uPTBdIFRoZSBwcmVjaXNpb24gdG8gcm91bmQgdG8uCiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHJvdW5kZWQgbnVtYmVyLgogKiBAZXhhbXBsZQogKgogKiBfLnJvdW5kKDQuMDA2KTsKICogLy8gPT4gNAogKgogKiBfLnJvdW5kKDQuMDA2LCAyKTsKICogLy8gPT4gNC4wMQogKgogKiBfLnJvdW5kKDQwNjAsIC0yKTsKICogLy8gPT4gNDEwMAogKi8KdmFyIHJvdW5kID0gY3JlYXRlUm91bmQoJ3JvdW5kJyk7CnZhciByb3VuZCQxID0gcm91bmQ7CgovKioNCiAqIOaVuOWtl+aIluWtl+S4suWbm+aNqOS6lOWFpei9ieaVtOaVuA0KICog6Iul6Ly45YWl6Z2e5pW45a2X5YmH5Zue5YKzMA0KICoNCiAqIFVuaXQgVGVzdDoge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS95dWRhLWx5dS93c2VtaS9ibG9iL21hc3Rlci90ZXN0L2NpbnQudGVzdC5tanMgR2l0aHVifQ0KICogQG1lbWJlck9mIHdzZW1pDQogKiBAcGFyYW0ge051bWJlcnxTdHJpbmd9IHYg6Ly45YWl5pW45a2X5oiW5a2X5LiyDQogKiBAcGFyYW0ge09iamVjdH0gW29wdD17fV0g6Ly45YWl6Kit5a6a54mp5Lu277yM6aCQ6Kite30NCiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdC51c2VDbGFtcFNhZmU9ZmFsc2VdIOi8uOWFpeaYr+WQpumJl+WItuiHs+WuieWFqOaVtOaVuOevhOWcjeW4g+ael+WAvO+8jOiLpeeCunRydWXliYflm5vmjajkupTlhaXlvozkuYvmlbTmlbjotoXlh7rlronlhajmlbTmlbjnr4TlnI3mmYLlj5bpgornlYzlgLzvvIzlpKfmlrxOdW1iZXIuTUFYX1NBRkVfSU5URUdFUuiAheWPlk51bWJlci5NQVhfU0FGRV9JTlRFR0VS44CB5bCP5pa8TnVtYmVyLk1JTl9TQUZFX0lOVEVHRVLogIXlj5ZOdW1iZXIuTUlOX1NBRkVfSU5URUdFUu+8jOmgkOiorWZhbHNlDQogKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHQudXNlTGltaXRTYWZlPWZhbHNlXSDovLjlhaXmmK/lkKbpmZDliLbpoIjngrrlronlhajmlbTmlbjluIPmnpflgLzvvIzoi6Xngrp0cnVl5YmH5Zub5o2o5LqU5YWl5b6M5LmL5pW05pW46LaF5Ye65a6J5YWo5pW05pW456+E5ZyNKOWNs051bWJlci5pc1NhZmVJbnRlZ2Vy54K6ZmFsc2XvvIzlkKtJbmZpbml0eeOAgS1JbmZpbml0eeiIh+e1leWwjeWAvOWkp+aWvE51bWJlci5NQVhfU0FGRV9JTlRFR0VS6ICFKeaZguimlueCuumMr+iqpO+8jOmgkOiorWZhbHNl44CC6IiHb3B0LnVzZUNsYW1wU2FmZeWQjOaZgueCunRydWXmmYLlm6Dlt7LlhYjpiZfliLboh7PlronlhajmlbTmlbjnr4TlnI3mlYXkuI3mnIPop7jnmbwNCiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdC5yZXR1cm5XaXRoU3RhdGVBbmRNc2c9ZmFsc2VdIOi8uOWFpeaYr+WQpuWbnuWCs+WQq+eLgOaFi+iIh+ioiuaBr+eJqeS7tuW4g+ael+WAvO+8jOiLpeeCunRydWXliYflm57lgrN7IHN0YXRlLCBtc2cgfeeJqeS7tu+8jHN0YXRl54K6J3N1Y2Nlc3Mn5oiWJ2Vycm9yJ++8jG1zZ+aWvHN1Y2Nlc3PmmYLngrrlm57lgrPntZDmnpzjgIHmlrxlcnJvcuaZgueCuumMr+iqpOioiuaBr+Wtl+S4su+8jOmgkOiorWZhbHNl44CC6aCQ6KitZmFsc2XmmYLpjK/oqqTku43ku6Xmi4vlh7rpjK/oqqTooajpgZTvvIzooYzngrrkuI3orooNCiAqIEByZXR1cm5zIHtJbnRlZ2VyfSDlm57lgrPlm5vmjajkupTlhaXlvozmlbTmlbjvvJvoi6VvcHQucmV0dXJuV2l0aFN0YXRlQW5kTXNn54K6dHJ1ZeWJh+WbnuWCs3sgc3RhdGUsIG1zZyB954mp5Lu2DQogKiBAZXhhbXBsZQ0KICoNCiAqIGNvbnNvbGUubG9nKGNpbnQoJzEuNScpKQ0KICogLy8gPT4gMg0KICoNCiAqIGNvbnNvbGUubG9nKGNpbnQoJy0xLjUnKSkNCiAqIC8vID0+IC0xDQogKg0KICogY29uc29sZS5sb2coY2ludChJbmZpbml0eSkpDQogKiAvLyA9PiAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOA0KICoNCiAqIGNvbnNvbGUubG9nKGNpbnQoSW5maW5pdHksIHsgdXNlQ2xhbXBTYWZlOiB0cnVlIH0pKQ0KICogLy8gPT4gOTAwNzE5OTI1NDc0MDk5MQ0KICoNCiAqIGNvbnNvbGUubG9nKGNpbnQoLUluZmluaXR5LCB7IHVzZUNsYW1wU2FmZTogdHJ1ZSB9KSkNCiAqIC8vID0+IC05MDA3MTk5MjU0NzQwOTkxDQogKg0KICogdHJ5IHsNCiAqICAgICBjaW50KEluZmluaXR5LCB7IHVzZUxpbWl0U2FmZTogdHJ1ZSB9KQ0KICogfQ0KICogY2F0Y2ggKGVycikgew0KICogICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKQ0KICogICAgIC8vID0+IHZbMS43OTc2OTMxMzQ4NjIzMTU3ZSszMDhdIGlzIG5vdCBhIHNhZmUgaW50ZWdlcg0KICogfQ0KICoNCiAqIGNvbnNvbGUubG9nKGNpbnQoSW5maW5pdHksIHsgdXNlTGltaXRTYWZlOiB0cnVlLCByZXR1cm5XaXRoU3RhdGVBbmRNc2c6IHRydWUgfSkpDQogKiAvLyA9PiB7IHN0YXRlOiAnZXJyb3InLCBtc2c6ICd2WzEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4XSBpcyBub3QgYSBzYWZlIGludGVnZXInIH0NCiAqDQogKiBjb25zb2xlLmxvZyhjaW50KCcxLjUnLCB7IHJldHVybldpdGhTdGF0ZUFuZE1zZzogdHJ1ZSB9KSkNCiAqIC8vID0+IHsgc3RhdGU6ICdzdWNjZXNzJywgbXNnOiAyIH0NCiAqDQogKi8KZnVuY3Rpb24gY2ludCh2LCBvcHQgPSB7fSkgewogIC8vdXNlQ2xhbXBTYWZlCiAgbGV0IHVzZUNsYW1wU2FmZSA9IGdldChvcHQsICd1c2VDbGFtcFNhZmUnLCBudWxsKTsKICBpZiAoIWlzYm9sKHVzZUNsYW1wU2FmZSkpIHsKICAgIHVzZUNsYW1wU2FmZSA9IGZhbHNlOwogIH0KCiAgLy91c2VMaW1pdFNhZmUKICBsZXQgdXNlTGltaXRTYWZlID0gZ2V0KG9wdCwgJ3VzZUxpbWl0U2FmZScsIG51bGwpOwogIGlmICghaXNib2wodXNlTGltaXRTYWZlKSkgewogICAgdXNlTGltaXRTYWZlID0gZmFsc2U7CiAgfQoKICAvL3JldHVybldpdGhTdGF0ZUFuZE1zZwogIGxldCByZXR1cm5XaXRoU3RhdGVBbmRNc2cgPSBnZXQob3B0LCAncmV0dXJuV2l0aFN0YXRlQW5kTXNnJywgbnVsbCk7CiAgaWYgKCFpc2JvbChyZXR1cm5XaXRoU3RhdGVBbmRNc2cpKSB7CiAgICByZXR1cm5XaXRoU3RhdGVBbmRNc2cgPSBmYWxzZTsKICB9CgogIC8vcmV0U3VjY2VzcwogIGxldCByZXRTdWNjZXNzID0gdiA9PiB7CiAgICBpZiAocmV0dXJuV2l0aFN0YXRlQW5kTXNnKSB7CiAgICAgIHJldHVybiB7CiAgICAgICAgc3RhdGU6ICdzdWNjZXNzJywKICAgICAgICBtc2c6IHYKICAgICAgfTsKICAgIH0gZWxzZSB7CiAgICAgIHJldHVybiB2OwogICAgfQogIH07CgogIC8vcmV0RXJyb3IsIOmgkOioreaooeW8j+ayv+eUqOaXouacieS5i+aLi+WHuumMr+iqpCwg5LiN5pS56K6K5pei5pyJ6KGM54K6CiAgbGV0IHJldEVycm9yID0gbXNnID0+IHsKICAgIGlmIChyZXR1cm5XaXRoU3RhdGVBbmRNc2cpIHsKICAgICAgcmV0dXJuIHsKICAgICAgICBzdGF0ZTogJ2Vycm9yJywKICAgICAgICBtc2cKICAgICAgfTsKICAgIH0gZWxzZSB7CiAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpOwogICAgfQogIH07CgogIC8vY2hlY2sKICBpZiAoIWlzbnVtKHYpKSB7CiAgICByZXR1cm4gcmV0U3VjY2VzcygwKTsKICB9CgogIC8vciwg6aCI5pSU5oiqY2RibOiIh3JvdW5k5LmL6Z2e6aCQ5pyf6Yyv6KqkLCDlkKbliYdyZXR1cm5XaXRoU3RhdGVBbmRNc2fngrp0cnVl5pmC5LuN5pyD5aSW5ouL6Iez5ZG85Y+r56uvCiAgbGV0IHIgPSBudWxsOwogIHRyeSB7CiAgICB2ID0gY2RibCh2KTsKICAgIHIgPSByb3VuZCQxKHYpOwoKICAgIC8vY2xhbXAsIOmgiOaWvHJvdW5k5LmL5b6M6YmX5Yi2LCDlm6BjZGJs5bCNSW5maW5pdHnoiIfotoXlh7rnr4TlnI3mlbjlgLzmnIPovYnngrpOdW1iZXIuTUFYX1ZBTFVFLCDlhbblv4XotoXlh7rlronlhajmlbTmlbjnr4TlnI3ogIzlj5blvpfpgornlYzlgLwKICAgIGlmICh1c2VDbGFtcFNhZmUpIHsKICAgICAgaWYgKHIgPiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUikgewogICAgICAgIHIgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjsKICAgICAgfSBlbHNlIGlmIChyIDwgTnVtYmVyLk1JTl9TQUZFX0lOVEVHRVIpIHsKICAgICAgICByID0gTnVtYmVyLk1JTl9TQUZFX0lOVEVHRVI7CiAgICAgIH0KICAgIH0KICB9IGNhdGNoIChlcnIpIHsKICAgIHJldHVybiByZXRFcnJvcihlcnIudG9TdHJpbmcoKSk7CiAgfQoKICAvL2NoZWNrLCDpoIjmlrxyb3VuZOS5i+W+jOaqouafpXLogIzpnZ7kuYvliY3mqqLmn6V2LCDlm6B254K65Zub5o2o5LqU5YWl5YmN5LmL5pW45YC85Y+v54K65bCP5pW4KOWmgjEuNSksIOWwjeWFtuWPlk51bWJlci5pc1NhZmVJbnRlZ2Vy5b+F54K6ZmFsc2XogIzoqqTloLE7IOS4lHVzZUNsYW1wU2FmZeeCunRydWXmmYJy5bey6KKr6YmX5Yi26Iez5a6J5YWo5pW05pW456+E5ZyNLCDmlYXmraTomZXkuI3mnIPop7jnmbwKICBpZiAodXNlTGltaXRTYWZlKSB7CiAgICBpZiAoIU51bWJlci5pc1NhZmVJbnRlZ2VyKE51bWJlcihyKSkpIHsKICAgICAgcmV0dXJuIHJldEVycm9yKGB2WyR7dn1dIGlzIG5vdCBhIHNhZmUgaW50ZWdlcmApOwogICAgfQogIH0KCiAgLy9jaGVjayAtMAogIGlmIChTdHJpbmcocikgPT09ICcwJykgewogICAgciA9IDA7CiAgfQogIHJldHVybiByZXRTdWNjZXNzKHIpOwp9CgovKioNCiAqIOWIpOaWt+aYr+WQpueCuuato+aVtOaVuA0KICog5q2j5pW05pW45LiN5YyF5ZCrMO+8jOeCuuWkp+aWvDDnmoTmlbTmlbgNCiAqDQogKiBVbml0IFRlc3Q6IHtAbGluayBodHRwczovL2dpdGh1Yi5jb20veXVkYS1seXUvd3NlbWkvYmxvYi9tYXN0ZXIvdGVzdC9pc3BpbnQudGVzdC5tanMgR2l0aHVifQ0KICogQG1lbWJlck9mIHdzZW1pDQogKiBAcGFyYW0geyp9IHYg6Ly45YWl5Lu75oSP6LOH5paZDQogKiBAcGFyYW0ge09iamVjdH0gW29wdD17fV0g6Ly45YWl6Kit5a6a54mp5Lu277yM6aCQ6Kite30NCiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdC51c2VMaW1pdFNhZmU9ZmFsc2VdIOi8uOWFpeaYr+WQpumZkOWItumgiOeCuuWuieWFqOaVtOaVuOW4g+ael+WAvO+8jOWOn+aoo+WCs+mBnue1pmlzaW5077yM6Iul54K6dHJ1ZeWJh+i2heWHuuWuieWFqOaVtOaVuOevhOWcjeiAhSjljbNOdW1iZXIuaXNTYWZlSW50ZWdlcueCumZhbHNl77yM5ZCrSW5maW5pdHnjgIEtSW5maW5pdHnoiIfntZXlsI3lgLzlpKfmlrxOdW1iZXIuTUFYX1NBRkVfSU5URUdFUuiAhSnliKTlrprngrpmYWxzZe+8jOmgkOiorWZhbHNlDQogKiBAcmV0dXJucyB7Qm9vbGVhbn0g5Zue5YKz5Yik5pa35biD5p6X5YC8DQogKiBAZXhhbXBsZQ0KICoNCiAqIGNvbnNvbGUubG9nKGlzcGludCgwKSkNCiAqIC8vID0+IGZhbHNlDQogKg0KICogY29uc29sZS5sb2coaXNwaW50KCcwJykpDQogKiAvLyA9PiBmYWxzZQ0KICoNCiAqIGNvbnNvbGUubG9nKGlzcGludCgxMjUpKQ0KICogLy8gPT4gdHJ1ZQ0KICoNCiAqIGNvbnNvbGUubG9nKGlzcGludCgxLjI1KSkNCiAqIC8vID0+IGZhbHNlDQogKg0KICogY29uc29sZS5sb2coaXNwaW50KCcxMjUnKSkNCiAqIC8vID0+IHRydWUNCiAqDQogKiBjb25zb2xlLmxvZyhpc3BpbnQoJzEuMjUnKSkNCiAqIC8vID0+IGZhbHNlDQoNCiAqIGNvbnNvbGUubG9nKGlzcGludCgtMTI1KSkNCiAqIC8vID0+IGZhbHNlDQogKg0KICogY29uc29sZS5sb2coaXNwaW50KC0xLjI1KSkNCiAqIC8vID0+IGZhbHNlDQogKg0KICogY29uc29sZS5sb2coaXNwaW50KCctMTI1JykpDQogKiAvLyA9PiBmYWxzZQ0KICoNCiAqIGNvbnNvbGUubG9nKGlzcGludCgnLTEuMjUnKSkNCiAqIC8vID0+IGZhbHNlDQogKg0KICovCmZ1bmN0aW9uIGlzcGludCh2LCBvcHQgPSB7fSkgewogIC8vY2hlY2ssIG9wdOWOn+aoo+WCs+mBniwg5a6J5YWo5pW05pW45LmL5Yik5a6a57Wx5LiA55SxaXNpbnTosqDosqwsIOS4jeaWvOatpOmHjeikh+WvpuS9nAogIGlmICghaXNpbnQodiwgb3B0KSkgewogICAgcmV0dXJuIGZhbHNlOwogIH0KCiAgLy9jaW5054Sh6aCI5YKz5YWlb3B0LCDlm6Dlt7LpgJrpgY5pc2ludOS5i+aqouafpSwg5q2k6JmVduW/heeCuuWuieWFqOaVtOaVuCwgY2ludOS4jeacg+aciei2heWHuuWuieWFqOaVtOaVuOevhOWcjeS5i+aDheW9ogogIGxldCByID0gY2ludCh2KSA+IDA7CiAgcmV0dXJuIHI7Cn0KCi8qKg0KICoganNvbuaWh+Wtl+i9ieS7u+aEj+izh+aWmQ0KICoNCiAqIFVuaXQgVGVzdDoge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS95dWRhLWx5dS93c2VtaS9ibG9iL21hc3Rlci90ZXN0L2oyby50ZXN0Lm1qcyBHaXRodWJ9DQogKiBAbWVtYmVyT2Ygd3NlbWkNCiAqIEBwYXJhbSB7U3RyaW5nfSB2IOi8uOWFpWpzb27moLzlvI/lrZfkuLINCiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0PXt9XSDovLjlhaXoqK3lrprnianku7bvvIzpoJDoqK17fQ0KICogQHBhcmFtIHtCb29sZWFufSBbb3B0LnJldHVybldpdGhTdGF0ZUFuZE1zZz1mYWxzZV0g6Ly45YWl5piv5ZCm5Zue5YKz5ZCr54uA5oWL6IiH6KiK5oGv54mp5Lu25biD5p6X5YC877yM6Iul54K6dHJ1ZeWJh+WbnuWCs3sgc3RhdGUsIG1zZyB954mp5Lu277yMc3RhdGXngronc3VjY2VzcyfmiJYnZXJyb3In77yMbXNn5pa8c3VjY2Vzc+aZgueCuuWbnuWCs+e1kOaenOOAgeaWvGVycm9y5pmC54K66Yyv6Kqk6KiK5oGv5a2X5Liy77yM6aCQ6KitZmFsc2UNCiAqIEByZXR1cm5zIHsqfSDlm57lgrPku7vmhI/os4fmlpnvvIzovLjlhaXpnZ7mnInmlYjlrZfkuLLmiJbop6PmnpDlpLHmlZfmmYLlm57lgrPnqbrnianku7bvvJvoi6VvcHQucmV0dXJuV2l0aFN0YXRlQW5kTXNn54K6dHJ1ZeWJh+WbnuWCs3sgc3RhdGUsIG1zZyB954mp5Lu2DQogKiBAZXhhbXBsZQ0KICoNCiAqIGNvbnNvbGUubG9nKGoybygnWzEsIjMiLCJhYmMiXScpKQ0KICogLy8gPT4gWzEsICczJywgJ2FiYyddDQogKg0KICogY29uc29sZS5sb2coajJvKCd7ImEiOjEyLjM0LCJiIjoiYWJjIn0nKSkNCiAqIC8vID0+IHsgYTogMTIuMzQsIGI6ICdhYmMnIH0NCiAqDQogKi8KZnVuY3Rpb24gajJvKHYsIG9wdCA9IHt9KSB7CiAgLy9yZXR1cm5XaXRoU3RhdGVBbmRNc2cKICBsZXQgcmV0dXJuV2l0aFN0YXRlQW5kTXNnID0gZ2V0KG9wdCwgJ3JldHVybldpdGhTdGF0ZUFuZE1zZycsIG51bGwpOwogIGlmICghaXNib2wocmV0dXJuV2l0aFN0YXRlQW5kTXNnKSkgewogICAgcmV0dXJuV2l0aFN0YXRlQW5kTXNnID0gZmFsc2U7CiAgfQoKICAvL3JldEVycm9yCiAgbGV0IHJldEVycm9yID0gbXNnID0+IHsKICAgIGlmIChyZXR1cm5XaXRoU3RhdGVBbmRNc2cpIHsKICAgICAgcmV0dXJuIHsKICAgICAgICBzdGF0ZTogJ2Vycm9yJywKICAgICAgICBtc2cKICAgICAgfTsKICAgIH0gZWxzZSB7CiAgICAgIHJldHVybiB7fTsKICAgIH0KICB9OwoKICAvL2NoZWNrCiAgaWYgKCFpc2VzdHIodikpIHsKICAgIHJldHVybiByZXRFcnJvcignaW52YWxpZCB2Jyk7CiAgfQoKICAvL2MsIOino+aekOWkseaVl+WOn+eCumNhdGNo5ZCe5o6J5Zuee30sIOiIh+OAjOi8uOWFpeacrOWwseaYr3t944CN54Sh5b6e5YiG6L6oCiAgbGV0IGMgPSB7fTsKICB0cnkgewogICAgYyA9IEpTT04ucGFyc2Uodik7CiAgfSBjYXRjaCAoZXJyKSB7CiAgICByZXR1cm4gcmV0RXJyb3IoZXJyLnRvU3RyaW5nKCkpOwogIH0KICBpZiAocmV0dXJuV2l0aFN0YXRlQW5kTXNnKSB7CiAgICByZXR1cm4gewogICAgICBzdGF0ZTogJ3N1Y2Nlc3MnLAogICAgICBtc2c6IGMKICAgIH07CiAgfSBlbHNlIHsKICAgIHJldHVybiBjOwogIH0KfQoKZnVuY3Rpb24gZ2V0RGVmYXVsdEV4cG9ydEZyb21DanMgKHgpIHsKCXJldHVybiB4ICYmIHguX19lc01vZHVsZSAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoeCwgJ2RlZmF1bHQnKSA/IHhbJ2RlZmF1bHQnXSA6IHg7Cn0KCnZhciBldmVudGVtaXR0ZXIzID0ge2V4cG9ydHM6IHt9fTsKCihmdW5jdGlvbiAobW9kdWxlKSB7CgogIHZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LAogICAgcHJlZml4ID0gJ34nOwoKICAvKioKICAgKiBDb25zdHJ1Y3RvciB0byBjcmVhdGUgYSBzdG9yYWdlIGZvciBvdXIgYEVFYCBvYmplY3RzLgogICAqIEFuIGBFdmVudHNgIGluc3RhbmNlIGlzIGEgcGxhaW4gb2JqZWN0IHdob3NlIHByb3BlcnRpZXMgYXJlIGV2ZW50IG5hbWVzLgogICAqCiAgICogQGNvbnN0cnVjdG9yCiAgICogQHByaXZhdGUKICAgKi8KICBmdW5jdGlvbiBFdmVudHMoKSB7fQoKICAvLwogIC8vIFdlIHRyeSB0byBub3QgaW5oZXJpdCBmcm9tIGBPYmplY3QucHJvdG90eXBlYC4gSW4gc29tZSBlbmdpbmVzIGNyZWF0aW5nIGFuCiAgLy8gaW5zdGFuY2UgaW4gdGhpcyB3YXkgaXMgZmFzdGVyIHRoYW4gY2FsbGluZyBgT2JqZWN0LmNyZWF0ZShudWxsKWAgZGlyZWN0bHkuCiAgLy8gSWYgYE9iamVjdC5jcmVhdGUobnVsbClgIGlzIG5vdCBzdXBwb3J0ZWQgd2UgcHJlZml4IHRoZSBldmVudCBuYW1lcyB3aXRoIGEKICAvLyBjaGFyYWN0ZXIgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGJ1aWx0LWluIG9iamVjdCBwcm9wZXJ0aWVzIGFyZSBub3QKICAvLyBvdmVycmlkZGVuIG9yIHVzZWQgYXMgYW4gYXR0YWNrIHZlY3Rvci4KICAvLwogIGlmIChPYmplY3QuY3JlYXRlKSB7CiAgICBFdmVudHMucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShudWxsKTsKCiAgICAvLwogICAgLy8gVGhpcyBoYWNrIGlzIG5lZWRlZCBiZWNhdXNlIHRoZSBgX19wcm90b19fYCBwcm9wZXJ0eSBpcyBzdGlsbCBpbmhlcml0ZWQgaW4KICAgIC8vIHNvbWUgb2xkIGJyb3dzZXJzIGxpa2UgQW5kcm9pZCA0LCBpUGhvbmUgNS4xLCBPcGVyYSAxMSBhbmQgU2FmYXJpIDUuCiAgICAvLwogICAgaWYgKCFuZXcgRXZlbnRzKCkuX19wcm90b19fKSBwcmVmaXggPSBmYWxzZTsKICB9CgogIC8qKgogICAqIFJlcHJlc2VudGF0aW9uIG9mIGEgc2luZ2xlIGV2ZW50IGxpc3RlbmVyLgogICAqCiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLgogICAqIEBwYXJhbSB7Kn0gY29udGV4dCBUaGUgY29udGV4dCB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguCiAgICogQHBhcmFtIHtCb29sZWFufSBbb25jZT1mYWxzZV0gU3BlY2lmeSBpZiB0aGUgbGlzdGVuZXIgaXMgYSBvbmUtdGltZSBsaXN0ZW5lci4KICAgKiBAY29uc3RydWN0b3IKICAgKiBAcHJpdmF0ZQogICAqLwogIGZ1bmN0aW9uIEVFKGZuLCBjb250ZXh0LCBvbmNlKSB7CiAgICB0aGlzLmZuID0gZm47CiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0OwogICAgdGhpcy5vbmNlID0gb25jZSB8fCBmYWxzZTsKICB9CgogIC8qKgogICAqIEFkZCBhIGxpc3RlbmVyIGZvciBhIGdpdmVuIGV2ZW50LgogICAqCiAgICogQHBhcmFtIHtFdmVudEVtaXR0ZXJ9IGVtaXR0ZXIgUmVmZXJlbmNlIHRvIHRoZSBgRXZlbnRFbWl0dGVyYCBpbnN0YW5jZS4KICAgKiBAcGFyYW0geyhTdHJpbmd8U3ltYm9sKX0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuCiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLgogICAqIEBwYXJhbSB7Kn0gY29udGV4dCBUaGUgY29udGV4dCB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguCiAgICogQHBhcmFtIHtCb29sZWFufSBvbmNlIFNwZWNpZnkgaWYgdGhlIGxpc3RlbmVyIGlzIGEgb25lLXRpbWUgbGlzdGVuZXIuCiAgICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0KICAgKiBAcHJpdmF0ZQogICAqLwogIGZ1bmN0aW9uIGFkZExpc3RlbmVyKGVtaXR0ZXIsIGV2ZW50LCBmbiwgY29udGV4dCwgb25jZSkgewogICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykgewogICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7CiAgICB9CiAgICB2YXIgbGlzdGVuZXIgPSBuZXcgRUUoZm4sIGNvbnRleHQgfHwgZW1pdHRlciwgb25jZSksCiAgICAgIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7CiAgICBpZiAoIWVtaXR0ZXIuX2V2ZW50c1tldnRdKSBlbWl0dGVyLl9ldmVudHNbZXZ0XSA9IGxpc3RlbmVyLCBlbWl0dGVyLl9ldmVudHNDb3VudCsrO2Vsc2UgaWYgKCFlbWl0dGVyLl9ldmVudHNbZXZ0XS5mbikgZW1pdHRlci5fZXZlbnRzW2V2dF0ucHVzaChsaXN0ZW5lcik7ZWxzZSBlbWl0dGVyLl9ldmVudHNbZXZ0XSA9IFtlbWl0dGVyLl9ldmVudHNbZXZ0XSwgbGlzdGVuZXJdOwogICAgcmV0dXJuIGVtaXR0ZXI7CiAgfQoKICAvKioKICAgKiBDbGVhciBldmVudCBieSBuYW1lLgogICAqCiAgICogQHBhcmFtIHtFdmVudEVtaXR0ZXJ9IGVtaXR0ZXIgUmVmZXJlbmNlIHRvIHRoZSBgRXZlbnRFbWl0dGVyYCBpbnN0YW5jZS4KICAgKiBAcGFyYW0geyhTdHJpbmd8U3ltYm9sKX0gZXZ0IFRoZSBFdmVudCBuYW1lLgogICAqIEBwcml2YXRlCiAgICovCiAgZnVuY3Rpb24gY2xlYXJFdmVudChlbWl0dGVyLCBldnQpIHsKICAgIGlmICgtLWVtaXR0ZXIuX2V2ZW50c0NvdW50ID09PSAwKSBlbWl0dGVyLl9ldmVudHMgPSBuZXcgRXZlbnRzKCk7ZWxzZSBkZWxldGUgZW1pdHRlci5fZXZlbnRzW2V2dF07CiAgfQoKICAvKioKICAgKiBNaW5pbWFsIGBFdmVudEVtaXR0ZXJgIGludGVyZmFjZSB0aGF0IGlzIG1vbGRlZCBhZ2FpbnN0IHRoZSBOb2RlLmpzCiAgICogYEV2ZW50RW1pdHRlcmAgaW50ZXJmYWNlLgogICAqCiAgICogQGNvbnN0cnVjdG9yCiAgICogQHB1YmxpYwogICAqLwogIGZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHsKICAgIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTsKICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDsKICB9CgogIC8qKgogICAqIFJldHVybiBhbiBhcnJheSBsaXN0aW5nIHRoZSBldmVudHMgZm9yIHdoaWNoIHRoZSBlbWl0dGVyIGhhcyByZWdpc3RlcmVkCiAgICogbGlzdGVuZXJzLgogICAqCiAgICogQHJldHVybnMge0FycmF5fQogICAqIEBwdWJsaWMKICAgKi8KICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmV2ZW50TmFtZXMgPSBmdW5jdGlvbiBldmVudE5hbWVzKCkgewogICAgdmFyIG5hbWVzID0gW10sCiAgICAgIGV2ZW50cywKICAgICAgbmFtZTsKICAgIGlmICh0aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgcmV0dXJuIG5hbWVzOwogICAgZm9yIChuYW1lIGluIGV2ZW50cyA9IHRoaXMuX2V2ZW50cykgewogICAgICBpZiAoaGFzLmNhbGwoZXZlbnRzLCBuYW1lKSkgbmFtZXMucHVzaChwcmVmaXggPyBuYW1lLnNsaWNlKDEpIDogbmFtZSk7CiAgICB9CiAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykgewogICAgICByZXR1cm4gbmFtZXMuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZXZlbnRzKSk7CiAgICB9CiAgICByZXR1cm4gbmFtZXM7CiAgfTsKCiAgLyoqCiAgICogUmV0dXJuIHRoZSBsaXN0ZW5lcnMgcmVnaXN0ZXJlZCBmb3IgYSBnaXZlbiBldmVudC4KICAgKgogICAqIEBwYXJhbSB7KFN0cmluZ3xTeW1ib2wpfSBldmVudCBUaGUgZXZlbnQgbmFtZS4KICAgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSByZWdpc3RlcmVkIGxpc3RlbmVycy4KICAgKiBAcHVibGljCiAgICovCiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbiBsaXN0ZW5lcnMoZXZlbnQpIHsKICAgIHZhciBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50LAogICAgICBoYW5kbGVycyA9IHRoaXMuX2V2ZW50c1tldnRdOwogICAgaWYgKCFoYW5kbGVycykgcmV0dXJuIFtdOwogICAgaWYgKGhhbmRsZXJzLmZuKSByZXR1cm4gW2hhbmRsZXJzLmZuXTsKICAgIGZvciAodmFyIGkgPSAwLCBsID0gaGFuZGxlcnMubGVuZ3RoLCBlZSA9IG5ldyBBcnJheShsKTsgaSA8IGw7IGkrKykgewogICAgICBlZVtpXSA9IGhhbmRsZXJzW2ldLmZuOwogICAgfQogICAgcmV0dXJuIGVlOwogIH07CgogIC8qKgogICAqIFJldHVybiB0aGUgbnVtYmVyIG9mIGxpc3RlbmVycyBsaXN0ZW5pbmcgdG8gYSBnaXZlbiBldmVudC4KICAgKgogICAqIEBwYXJhbSB7KFN0cmluZ3xTeW1ib2wpfSBldmVudCBUaGUgZXZlbnQgbmFtZS4KICAgKiBAcmV0dXJucyB7TnVtYmVyfSBUaGUgbnVtYmVyIG9mIGxpc3RlbmVycy4KICAgKiBAcHVibGljCiAgICovCiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24gbGlzdGVuZXJDb3VudChldmVudCkgewogICAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQsCiAgICAgIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1tldnRdOwogICAgaWYgKCFsaXN0ZW5lcnMpIHJldHVybiAwOwogICAgaWYgKGxpc3RlbmVycy5mbikgcmV0dXJuIDE7CiAgICByZXR1cm4gbGlzdGVuZXJzLmxlbmd0aDsKICB9OwoKICAvKioKICAgKiBDYWxscyBlYWNoIG9mIHRoZSBsaXN0ZW5lcnMgcmVnaXN0ZXJlZCBmb3IgYSBnaXZlbiBldmVudC4KICAgKgogICAqIEBwYXJhbSB7KFN0cmluZ3xTeW1ib2wpfSBldmVudCBUaGUgZXZlbnQgbmFtZS4KICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gYHRydWVgIGlmIHRoZSBldmVudCBoYWQgbGlzdGVuZXJzLCBlbHNlIGBmYWxzZWAuCiAgICogQHB1YmxpYwogICAqLwogIEV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQoZXZlbnQsIGExLCBhMiwgYTMsIGE0LCBhNSkgewogICAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7CiAgICBpZiAoIXRoaXMuX2V2ZW50c1tldnRdKSByZXR1cm4gZmFsc2U7CiAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW2V2dF0sCiAgICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGgsCiAgICAgIGFyZ3MsCiAgICAgIGk7CiAgICBpZiAobGlzdGVuZXJzLmZuKSB7CiAgICAgIGlmIChsaXN0ZW5lcnMub25jZSkgdGhpcy5yZW1vdmVMaXN0ZW5lcihldmVudCwgbGlzdGVuZXJzLmZuLCB1bmRlZmluZWQsIHRydWUpOwogICAgICBzd2l0Y2ggKGxlbikgewogICAgICAgIGNhc2UgMToKICAgICAgICAgIHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCksIHRydWU7CiAgICAgICAgY2FzZSAyOgogICAgICAgICAgcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSksIHRydWU7CiAgICAgICAgY2FzZSAzOgogICAgICAgICAgcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIpLCB0cnVlOwogICAgICAgIGNhc2UgNDoKICAgICAgICAgIHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMyksIHRydWU7CiAgICAgICAgY2FzZSA1OgogICAgICAgICAgcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIsIGEzLCBhNCksIHRydWU7CiAgICAgICAgY2FzZSA2OgogICAgICAgICAgcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIsIGEzLCBhNCwgYTUpLCB0cnVlOwogICAgICB9CiAgICAgIGZvciAoaSA9IDEsIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7IGkgPCBsZW47IGkrKykgewogICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldOwogICAgICB9CiAgICAgIGxpc3RlbmVycy5mbi5hcHBseShsaXN0ZW5lcnMuY29udGV4dCwgYXJncyk7CiAgICB9IGVsc2UgewogICAgICB2YXIgbGVuZ3RoID0gbGlzdGVuZXJzLmxlbmd0aCwKICAgICAgICBqOwogICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHsKICAgICAgICBpZiAobGlzdGVuZXJzW2ldLm9uY2UpIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyc1tpXS5mbiwgdW5kZWZpbmVkLCB0cnVlKTsKICAgICAgICBzd2l0Y2ggKGxlbikgewogICAgICAgICAgY2FzZSAxOgogICAgICAgICAgICBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCk7CiAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgY2FzZSAyOgogICAgICAgICAgICBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEpOwogICAgICAgICAgICBicmVhazsKICAgICAgICAgIGNhc2UgMzoKICAgICAgICAgICAgbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQsIGExLCBhMik7CiAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgY2FzZSA0OgogICAgICAgICAgICBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEsIGEyLCBhMyk7CiAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgZGVmYXVsdDoKICAgICAgICAgICAgaWYgKCFhcmdzKSBmb3IgKGogPSAxLCBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpOyBqIDwgbGVuOyBqKyspIHsKICAgICAgICAgICAgICBhcmdzW2ogLSAxXSA9IGFyZ3VtZW50c1tqXTsKICAgICAgICAgICAgfQogICAgICAgICAgICBsaXN0ZW5lcnNbaV0uZm4uYXBwbHkobGlzdGVuZXJzW2ldLmNvbnRleHQsIGFyZ3MpOwogICAgICAgIH0KICAgICAgfQogICAgfQogICAgcmV0dXJuIHRydWU7CiAgfTsKCiAgLyoqCiAgICogQWRkIGEgbGlzdGVuZXIgZm9yIGEgZ2l2ZW4gZXZlbnQuCiAgICoKICAgKiBAcGFyYW0geyhTdHJpbmd8U3ltYm9sKX0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuCiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLgogICAqIEBwYXJhbSB7Kn0gW2NvbnRleHQ9dGhpc10gVGhlIGNvbnRleHQgdG8gaW52b2tlIHRoZSBsaXN0ZW5lciB3aXRoLgogICAqIEByZXR1cm5zIHtFdmVudEVtaXR0ZXJ9IGB0aGlzYC4KICAgKiBAcHVibGljCiAgICovCiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIG9uKGV2ZW50LCBmbiwgY29udGV4dCkgewogICAgcmV0dXJuIGFkZExpc3RlbmVyKHRoaXMsIGV2ZW50LCBmbiwgY29udGV4dCwgZmFsc2UpOwogIH07CgogIC8qKgogICAqIEFkZCBhIG9uZS10aW1lIGxpc3RlbmVyIGZvciBhIGdpdmVuIGV2ZW50LgogICAqCiAgICogQHBhcmFtIHsoU3RyaW5nfFN5bWJvbCl9IGV2ZW50IFRoZSBldmVudCBuYW1lLgogICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBsaXN0ZW5lciBmdW5jdGlvbi4KICAgKiBAcGFyYW0geyp9IFtjb250ZXh0PXRoaXNdIFRoZSBjb250ZXh0IHRvIGludm9rZSB0aGUgbGlzdGVuZXIgd2l0aC4KICAgKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuCiAgICogQHB1YmxpYwogICAqLwogIEV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uIG9uY2UoZXZlbnQsIGZuLCBjb250ZXh0KSB7CiAgICByZXR1cm4gYWRkTGlzdGVuZXIodGhpcywgZXZlbnQsIGZuLCBjb250ZXh0LCB0cnVlKTsKICB9OwoKICAvKioKICAgKiBSZW1vdmUgdGhlIGxpc3RlbmVycyBvZiBhIGdpdmVuIGV2ZW50LgogICAqCiAgICogQHBhcmFtIHsoU3RyaW5nfFN5bWJvbCl9IGV2ZW50IFRoZSBldmVudCBuYW1lLgogICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIE9ubHkgcmVtb3ZlIHRoZSBsaXN0ZW5lcnMgdGhhdCBtYXRjaCB0aGlzIGZ1bmN0aW9uLgogICAqIEBwYXJhbSB7Kn0gY29udGV4dCBPbmx5IHJlbW92ZSB0aGUgbGlzdGVuZXJzIHRoYXQgaGF2ZSB0aGlzIGNvbnRleHQuCiAgICogQHBhcmFtIHtCb29sZWFufSBvbmNlIE9ubHkgcmVtb3ZlIG9uZS10aW1lIGxpc3RlbmVycy4KICAgKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuCiAgICogQHB1YmxpYwogICAqLwogIEV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcihldmVudCwgZm4sIGNvbnRleHQsIG9uY2UpIHsKICAgIHZhciBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50OwogICAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XSkgcmV0dXJuIHRoaXM7CiAgICBpZiAoIWZuKSB7CiAgICAgIGNsZWFyRXZlbnQodGhpcywgZXZ0KTsKICAgICAgcmV0dXJuIHRoaXM7CiAgICB9CiAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW2V2dF07CiAgICBpZiAobGlzdGVuZXJzLmZuKSB7CiAgICAgIGlmIChsaXN0ZW5lcnMuZm4gPT09IGZuICYmICghb25jZSB8fCBsaXN0ZW5lcnMub25jZSkgJiYgKCFjb250ZXh0IHx8IGxpc3RlbmVycy5jb250ZXh0ID09PSBjb250ZXh0KSkgewogICAgICAgIGNsZWFyRXZlbnQodGhpcywgZXZ0KTsKICAgICAgfQogICAgfSBlbHNlIHsKICAgICAgZm9yICh2YXIgaSA9IDAsIGV2ZW50cyA9IFtdLCBsZW5ndGggPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHsKICAgICAgICBpZiAobGlzdGVuZXJzW2ldLmZuICE9PSBmbiB8fCBvbmNlICYmICFsaXN0ZW5lcnNbaV0ub25jZSB8fCBjb250ZXh0ICYmIGxpc3RlbmVyc1tpXS5jb250ZXh0ICE9PSBjb250ZXh0KSB7CiAgICAgICAgICBldmVudHMucHVzaChsaXN0ZW5lcnNbaV0pOwogICAgICAgIH0KICAgICAgfQoKICAgICAgLy8KICAgICAgLy8gUmVzZXQgdGhlIGFycmF5LCBvciByZW1vdmUgaXQgY29tcGxldGVseSBpZiB3ZSBoYXZlIG5vIG1vcmUgbGlzdGVuZXJzLgogICAgICAvLwogICAgICBpZiAoZXZlbnRzLmxlbmd0aCkgdGhpcy5fZXZlbnRzW2V2dF0gPSBldmVudHMubGVuZ3RoID09PSAxID8gZXZlbnRzWzBdIDogZXZlbnRzO2Vsc2UgY2xlYXJFdmVudCh0aGlzLCBldnQpOwogICAgfQogICAgcmV0dXJuIHRoaXM7CiAgfTsKCiAgLyoqCiAgICogUmVtb3ZlIGFsbCBsaXN0ZW5lcnMsIG9yIHRob3NlIG9mIHRoZSBzcGVjaWZpZWQgZXZlbnQuCiAgICoKICAgKiBAcGFyYW0geyhTdHJpbmd8U3ltYm9sKX0gW2V2ZW50XSBUaGUgZXZlbnQgbmFtZS4KICAgKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuCiAgICogQHB1YmxpYwogICAqLwogIEV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24gcmVtb3ZlQWxsTGlzdGVuZXJzKGV2ZW50KSB7CiAgICB2YXIgZXZ0OwogICAgaWYgKGV2ZW50KSB7CiAgICAgIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7CiAgICAgIGlmICh0aGlzLl9ldmVudHNbZXZ0XSkgY2xlYXJFdmVudCh0aGlzLCBldnQpOwogICAgfSBlbHNlIHsKICAgICAgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpOwogICAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7CiAgICB9CiAgICByZXR1cm4gdGhpczsKICB9OwoKICAvLwogIC8vIEFsaWFzIG1ldGhvZHMgbmFtZXMgYmVjYXVzZSBwZW9wbGUgcm9sbCBsaWtlIHRoYXQuCiAgLy8KICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9mZiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXI7CiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUub247CgogIC8vCiAgLy8gRXhwb3NlIHRoZSBwcmVmaXguCiAgLy8KICBFdmVudEVtaXR0ZXIucHJlZml4ZWQgPSBwcmVmaXg7CgogIC8vCiAgLy8gQWxsb3cgYEV2ZW50RW1pdHRlcmAgdG8gYmUgaW1wb3J0ZWQgYXMgbW9kdWxlIG5hbWVzcGFjZS4KICAvLwogIEV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7CgogIC8vCiAgLy8gRXhwb3NlIHRoZSBtb2R1bGUuCiAgLy8KICB7CiAgICBtb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjsKICB9Cn0pKGV2ZW50ZW1pdHRlcjMpOwp2YXIgZXZlbnRlbWl0dGVyM0V4cG9ydHMgPSBldmVudGVtaXR0ZXIzLmV4cG9ydHM7CnZhciBFdmVudEVtaXR0ZXIgPSAvKkBfX1BVUkVfXyovZ2V0RGVmYXVsdEV4cG9ydEZyb21DanMoZXZlbnRlbWl0dGVyM0V4cG9ydHMpOwoKLyoqCiAqIOW7uueri+S6i+S7tueJqeS7tihFdmVudEVtaXR0ZXIgZnJvbSBldmVudGVtaXR0ZXIzKQogKgogKiDmnKzlh73mlbjlg4Xlm57lgrPljp/nlJ9ldmVudGVtaXR0ZXIz5a+m5L6LLCDkuI3lgZrku7vkvZXljIXoo50sIOaVheWFtuihjOeCuuWujOWFqOmBteW+qkV2ZW50RW1pdHRlcuS5i+imj+evhOiqnuaEjzoKICog55uj6IG95Zmo5ZCM5q2l5ouL6Yyv5pmC55SxZW1pdOWkluaLi+iHs2VtaXTkuYvlkbzlj6vnq68o5LiU6Kmy5qyh5rS+55m85LmL5b6M57qM55uj6IG95Zmo5LiN5YaN6KKr5ZG85Y+rKTsgZW1pdOeCuuWQjOatpeS4lOWbnuWCs+W4g+ael+WAvCwKICog55uj6IG95Zmo5omA5Zue5YKz5LmL5YC8KOWQq1Byb21pc2Up5LiA5b6L5Lif5qOE44CCCiAqCiAqIOmXnOaWvGFzeW5j55uj6IG95ZmoOiBub2RlanPmlofku7bmmI7ovInjgIzkvb/nlKhhc3luY+WHveaVuOS9nOeCuuS6i+S7tuiZleeQhuWZqOacieWVj+mhjCwg5pyD5bCO6Ie0dW5oYW5kbGVkIHJlamVjdGlvbuOAjSwKICog5Lim5bCHY2FwdHVyZVJlamVjdGlvbnPoqK3oqIjngrpvcHQtaW7ogIzpnZ7poJDoqK07IGV2ZW50ZW1pdHRlcjPoiIfngI/opr3lmajnq6/kuYtldmVudHMgcG9seWZpbGznmobmnKrmj5DkvpvoqbLpgbjpoIXjgIIKICog5pWFYXN5bmPnm6Pogb3lmajmh4noh6rooYzomZXnkIblhbbpjK/oqqQo5aaC5Luld3NlbWnkuYtwbTJyZXNvbHZl5YyF6KOd5b6F5Z+36KGM5Ye95pW4KSwg5pys5Ye95pW45LiN5Luj54K65pSU5oiqLCDkuqbkuI3mh4nku6PngrrmlJTmiKoKICog4oCU4oCUIOS4gOaXpueCuuatpOWMheijneebo+iBveWZqCwg5bCx5b+F6aCI57at6K2344CM5YyF6KOd5Ye95pW44oaU5Y6f5Ye95pW444CN5LmL5bCN5oeJ6KGoLCDogIzoqbLlsI3mh4nooajmnIPkvb9vbi9vZmYvb25jZS9saXN0ZW5lcnMKICog5LmL6KGM54K65YGP6Zui6KaP56+EKOS6i+S7tuWQjeWei+WIpeWIpeWQjeOAgeS7peeVsOeJqeenu+mZpOOAgW9uY2Xoh6rli5Xnp7vpmaTnrYkpLCDkvb/lsIHoo53lsaToh6rouqvmiJDngrrjgIzoqr/nlKjmlrnmi7/liLDpnZ7poJDmnJ/jgI3kuYvkvobmupDjgIIKICoKICog6Iul5qih57WE5pa8dGltZXLjgIFzdHJlYW3jgIF3YXRjaGVy562J5Zue5ZG85YWn5rS+55m85LqL5Lu2LCDnm6Pogb3lmajkuYvlkIzmraXmi4vpjK/ljbPmiJB1bmNhdWdodEV4Y2VwdGlvbuiAjOauuuihjOeoiyDigJTigJQKICog6Kmy5oOF5b2i5bGs44CM5rS+55m85L2N572u44CN5LmL5ZWP6aGM6ICM6Z2eZW1pdHRlcuWlkee0hOS5i+WVj+mhjCwg5oeJ5pa85rS+55m86JmV6Ieq6KGM5LuldHJ5IGNhdGNo5pSU5oiqKHdzZW1p5o+Q5L6bZXZFbWl06IiHZXZFbWl0RGVsYXnngrrkuYsp44CCCiAqCiAqIFNlZToge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9wcmltdXMvZXZlbnRlbWl0dGVyMyBldmVudGVtaXR0ZXIzfQogKgogKiBVbml0IFRlc3Q6IHtAbGluayBodHRwczovL2dpdGh1Yi5jb20veXVkYS1seXUvd3NlbWkvYmxvYi9tYXN0ZXIvdGVzdC9ldmVtLnRlc3QubWpzIEdpdGh1Yn0KICogQG1lbWJlck9mIHdzZW1pCiAqIEByZXR1cm5zIHtPYmplY3R9IOWbnuWCs2V2ZW50ZW1pdHRlcjPlr6bkvosKICogQGV4YW1wbGUKICoKICogbGV0IGV2ID0gZXZlbSgpCiAqCiAqIGV2Lm9uKCdldk5hbWUnLCBmdW5jdGlvbihtc2cpIHsKICogICAgIGNvbnNvbGUubG9nKG1zZykKICogICAgIC8vID0+IHthYmM6IDEyLjM0fQogKiB9KQogKgogKiBsZXQgZGF0YSA9IHsgYWJjOiAxMi4zNCB9CiAqIGV2LmVtaXQoJ2V2TmFtZScsIGRhdGEpCiAqCiAqLwpmdW5jdGlvbiBldmVtKCkgewogIHJldHVybiBuZXcgRXZlbnRFbWl0dGVyKCk7Cn0KCmxldCBjaGFycyA9ICcwMTIzNDU2Nzg5QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eicuc3BsaXQoJycpOwpsZXQgcmFkaXggPSBjaGFycy5sZW5ndGg7CgovKioNCiAqIOeUoueUn+maqOapn2lkDQogKg0KICogVW5pdCBUZXN0OiB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL3l1ZGEtbHl1L3dzZW1pL2Jsb2IvbWFzdGVyL3Rlc3QvZ2VuSUQudGVzdC5tanMgR2l0aHVifQ0KICogQG1lbWJlck9mIHdzZW1pDQogKiBAcGFyYW0ge0ludGVnZXJ9IFtsZW49MzJdIOi8uOWFpXV1aWTplbfluqbvvIzngrrmraPmlbTmlbjvvIzpoJDoqK0zMg0KICogQHJldHVybnMge1N0cmluZ30g5Zue5YKzdXVpZOWtl+S4sg0KICogQGV4YW1wbGUNCiAqDQogKiBjb25zb2xlLmxvZyhnZW5JRCgpKQ0KICogLy8gPT4gSXMxTnlJbVUzQTlmeXFGeVlCV3VKdTRpdlhYY0daQWIgKGlzIHJhbmRvbSkNCiAqDQogKi8KZnVuY3Rpb24gZ2VuSUQobGVuID0gMzIpIHsKICBsZXQgdXVpZCA9IFtdOwoKICAvL2NoZWNrCiAgaWYgKGlzcGludChsZW4pKSB7CiAgICBsZW4gPSBjaW50KGxlbik7CiAgfSBlbHNlIHsKICAgIGxlbiA9IDMyOwogIH0KCiAgLy91dWlkCiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykgdXVpZFtpXSA9IGNoYXJzWzAgfCBNYXRoLnJhbmRvbSgpICogcmFkaXhdOwoKICAvL3JmYzQxMjIsIHZlcnNpb24gNCBmb3JtCiAgLy8gLy9yZXF1aXJlcyB0aGVzZSBjaGFyYWN0ZXJzCiAgLy8gdXVpZFs4XSA9IHV1aWRbMTNdID0gdXVpZFsxOF0gPSB1dWlkWzIzXSA9ICctJwogIC8vIHV1aWRbMTRdID0gJzQnCiAgLy8gLy9maWxsIGluIHJhbmRvbSBkYXRhLiAgQXQgaT09MTkgc2V0IHRoZSBoaWdoIGJpdHMgb2YgY2xvY2sgc2VxdWVuY2UgYXMgcGVyIHJmYzQxMjIsIHNlYy4gNC4xLjUKICAvLyBsZXQgcgogIC8vIGZvciAoaSA9IDA7IGkgPCAzNjsgaSsrKSB7CiAgLy8gICAgIGlmICghdXVpZFtpXSkgewogIC8vICAgICAgICAgciA9IDAgfCBNYXRoLnJhbmRvbSgpICogMTYKICAvLyAgICAgICAgIHV1aWRbaV0gPSBjaGFyc1soaSA9PT0gMTkpID8gKHIgJiAweDMpIHwgMHg4IDogcl0KICAvLyAgICAgfQogIC8vIH0KCiAgbGV0IHIgPSB1dWlkLmpvaW4oJycpOwogIHJldHVybiByOwp9CgovKioNCiAqIOeUoueUn1Byb21pc2Xnianku7bvvIzlhbflgpnpj4jlvI9yZXNvbHZl6IiHcmVqZWN0DQogKiDkuLvopoHlj5dqUXVlcnkgRGVmZXJyZWTmpoLlv7XllZ/nmbwNCiAqDQogKiBVbml0IFRlc3Q6IHtAbGluayBodHRwczovL2dpdGh1Yi5jb20veXVkYS1seXUvd3NlbWkvYmxvYi9tYXN0ZXIvdGVzdC9nZW5QbS50ZXN0Lm1qcyBHaXRodWJ9DQogKiBAbWVtYmVyT2Ygd3NlbWkNCiAqIEByZXR1cm5zIHtPYmplY3R9IOWbnuWCs1Byb21pc2Xnianku7YNCiAqIEBleGFtcGxlDQogKg0KICogYXN5bmMgZnVuY3Rpb24gdG9wQXN5bmMoKSB7DQogKg0KICogICAgIGZ1bmN0aW9uIHRlc3QxKCkgew0KICogICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gew0KICogICAgICAgICAgICAgbGV0IG1zID0gW10NCiAqDQogKiAgICAgICAgICAgICBsZXQgZm4gPSBmdW5jdGlvbihuYW1lKSB7DQogKiAgICAgICAgICAgICAgICAgbGV0IHBtID0gZ2VuUG0oKQ0KICogICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7DQogKiAgICAgICAgICAgICAgICAgICAgIG1zLnB1c2goJ3Jlc29sdmU6ICcgKyBuYW1lKQ0KICogICAgICAgICAgICAgICAgICAgICBwbS5yZXNvbHZlKCdyZXNvbHZlOiAnICsgbmFtZSkNCiAqICAgICAgICAgICAgICAgICB9LCAxKQ0KICogICAgICAgICAgICAgICAgIHJldHVybiBwbQ0KICogICAgICAgICAgICAgfQ0KICoNCiAqICAgICAgICAgICAgIGZuKCdhYmMnKQ0KICogICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKG1zZykgew0KICogICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndDEgdGhlbicsIG1zZykNCiAqICAgICAgICAgICAgICAgICAgICAgbXMucHVzaCgndDEgdGhlbjogJyArIG1zZykNCiAqICAgICAgICAgICAgICAgICB9KQ0KICogICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihtc2cpIHsNCiAqICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3QxIGNhdGNoJywgbXNnKQ0KICogICAgICAgICAgICAgICAgICAgICBtcy5wdXNoKCd0MSBjYXRjaDogJyArIG1zZykNCiAqICAgICAgICAgICAgICAgICB9KQ0KICogICAgICAgICAgICAgICAgIC5maW5hbGx5KCgpID0+IHsNCiAqICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShtcykNCiAqICAgICAgICAgICAgICAgICB9KQ0KICoNCiAqICAgICAgICAgfSkNCiAqICAgICB9DQogKiAgICAgY29uc29sZS5sb2coJ3Rlc3QxJykNCiAqICAgICBsZXQgcjEgPSBhd2FpdCB0ZXN0MSgpDQogKiAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocjEpKQ0KICogICAgIC8vIHRlc3QxDQogKiAgICAgLy8gdDEgdGhlbiByZXNvbHZlOiBhYmMNCiAqICAgICAvLyBbInJlc29sdmU6IGFiYyIsInQxIHRoZW46IHJlc29sdmU6IGFiYyJdDQogKg0KICogICAgIGZ1bmN0aW9uIHRlc3QyKCkgew0KICogICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gew0KICogICAgICAgICAgICAgbGV0IG1zID0gW10NCiAqDQogKiAgICAgICAgICAgICBsZXQgZm4gPSBmdW5jdGlvbihuYW1lKSB7DQogKiAgICAgICAgICAgICAgICAgbGV0IHBtID0gZ2VuUG0oKQ0KICogICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7DQogKiAgICAgICAgICAgICAgICAgICAgIG1zLnB1c2goJ3JlamVjdDogJyArIG5hbWUpDQogKiAgICAgICAgICAgICAgICAgICAgIHBtLnJlamVjdCgncmVqZWN0OiAnICsgbmFtZSkNCiAqICAgICAgICAgICAgICAgICB9LCAxKQ0KICogICAgICAgICAgICAgICAgIHJldHVybiBwbQ0KICogICAgICAgICAgICAgfQ0KICoNCiAqICAgICAgICAgICAgIGZuKCdhYmMnKQ0KICogICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKG1zZykgew0KICogICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndDEgdGhlbicsIG1zZykNCiAqICAgICAgICAgICAgICAgICAgICAgbXMucHVzaCgndDEgdGhlbjogJyArIG1zZykNCiAqICAgICAgICAgICAgICAgICB9KQ0KICogICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihtc2cpIHsNCiAqICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3QxIGNhdGNoJywgbXNnKQ0KICogICAgICAgICAgICAgICAgICAgICBtcy5wdXNoKCd0MSBjYXRjaDogJyArIG1zZykNCiAqICAgICAgICAgICAgICAgICB9KQ0KICogICAgICAgICAgICAgICAgIC5maW5hbGx5KCgpID0+IHsNCiAqICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShtcykNCiAqICAgICAgICAgICAgICAgICB9KQ0KICoNCiAqICAgICAgICAgfSkNCiAqICAgICB9DQogKiAgICAgY29uc29sZS5sb2coJ3Rlc3QyJykNCiAqICAgICBsZXQgcjIgPSBhd2FpdCB0ZXN0MigpDQogKiAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocjIpKQ0KICogICAgIC8vIHRlc3QyDQogKiAgICAgLy8gdDEgY2F0Y2ggcmVqZWN0OiBhYmMNCiAqICAgICAvLyBbInJlamVjdDogYWJjIiwidDEgY2F0Y2g6IHJlamVjdDogYWJjIl0NCiAqDQogKiB9DQogKiB0b3BBc3luYygpLmNhdGNoKCgpID0+IHt9KQ0KICoNCiAqLwpmdW5jdGlvbiBnZW5QbSgpIHsKICBsZXQgcmVzb2x2ZTsKICBsZXQgcmVqZWN0OwogIGxldCBwID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKCkgewogICAgcmVzb2x2ZSA9IGFyZ3VtZW50c1swXTsKICAgIHJlamVjdCA9IGFyZ3VtZW50c1sxXTsKICB9KTsKICBwLnJlc29sdmUgPSByZXNvbHZlOwogIHAucmVqZWN0ID0gcmVqZWN0OwogIHJldHVybiBwOwp9CgovL+acrOaqlOeCuuWFp+mDqOS9v+eUqOS5i+W4uOaVuCwg5LiN55SxaW5kZXjljK/lh7oKCi8qKgogKiDoqIjmmYLlmagoc2V0VGltZW91dOOAgXNldEludGVydmFsKeS5i+W7tumBsuavq+enkuS4iumZkAogKgogKiDlgLzngrogMl4zMSAtIDEgPSAyMTQ3NDgzNjQ3IOavq+enkiwg57SEIDI0Ljgg5aSp44CCCiAqCiAqCiAqIOOAkOeCuuS9lemcgOimgeatpOS4iumZkCDigJTigJQgbm9kZWpz6IiH54CP6Ka95Zmo5LmL6KGM54K65LiN5ZCMLCDkuJTnmobngrrpnZzpu5jlpLHmlYjjgJEKICoKICog5YWp55Kw5aKD5bCN6LaF55WM5YC85LmL6JmV55CG5qmf5Yi25LiN5ZCMLCDlr6bmuKwobm9kZWpzIHYyNCAvIGNocm9taXVtKeWmguS4izoKICoKICogICDovLjlhaVtcyAgICAgICAgICBub2RlanMgICAgICAgICAgICAgICAgICAgIGNocm9taXVtCiAqICAgLS0tLS0tLS0tLS0tLS0gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQogKiAgIDIxNDc0ODM2NDcgICAgIOato+W4uOaOkueoiyAgICAgICAgICAgICAgICAgICAg5q2j5bi45o6S56iLCiAqICAgMl4zMSAgICAgICAgICAg56uL5Y2z6Ke455m8KDFtcykr6K2m5ZGKICAgICAgICAgIOeri+WNs+inuOeZvChUb0ludDMy54K6LTIxNDc0ODM2NDgpCiAqICAgMl4zMiAtIDUwMDAgICAg56uL5Y2z6Ke455m8KDFtcykr6K2m5ZGKICAgICAgICAgIOeri+WNs+inuOeZvChUb0ludDMy54K6LTUwMDApCiAqICAgMl4zMiArIDUwMDAgICAg56uL5Y2z6Ke455m8KDFtcykr6K2m5ZGKICAgICAgICAgIOOAkOe0hDXnp5Llvozop7jnmbzjgJEoVG9JbnQzMueCujUwMDApCiAqICAgMl4zMiArIDEwMCAgICAg56uL5Y2z6Ke455m8KDFtcykr6K2m5ZGKICAgICAgICAgIOOAkOe0hDEwMG1z5b6M6Ke455m844CRKFRvSW50MzLngroxMDApCiAqICAgSW5maW5pdHkgICAgICAg56uL5Y2z6Ke455m8KDFtcykr6K2m5ZGKICAgICAgICAgIOeri+WNs+inuOeZvChUb0ludDMy54K6MCkKICogICBOYU4gICAgICAgICAgICDnq4vljbPop7jnmbwoMW1zKSvorablkYogICAgICAgICAg56uL5Y2z6Ke455m8KFRvSW50MzLngrowKQogKiAgIC0xICAgICAgICAgICAgIOeri+WNs+inuOeZvCgxbXMpK+itpuWRiiAgICAgICAgICDnq4vljbPop7jnmbwKICoKICogbm9kZWpz54K66Ieq5a625a+m5L2cOiDotoXpgY4gMl4zMS0xIOS4gOW+i+WkvueCuiAxbXMsIOS4puS7pSBwcm9jZXNzLm9uKCd3YXJuaW5nJykg55m85Ye6CiAqIFRpbWVvdXRPdmVyZmxvd1dhcm5pbmcoTmFO54K6VGltZW91dE5hTldhcm5pbmfjgIHosqDmlbjngrpUaW1lb3V0TmVnYXRpdmVXYXJuaW5nKSwg5LiN5ouL6Yyv44CCCiAqCiAqIOeAj+imveWZqOWJh+S+nSBXZWJJREwg5LmLIGxvbmcg5Z6L5Yil6L2J5o+bKOWNsyBUb0ludDMyKSwg5bCN6LaF55WM5YC85YGaIG1vZHVsbyAyXjMyIOS5i+OAkOeSsOe5nuOAkeiAjOmdnuWkvuWItiwKICog5LiU44CQ5a6M5YWo5rKS5pyJ6K2m5ZGK44CR44CC5pWFIDJeMzIgKyA1MDAwIOaWvOeAj+imveWZqOS4jeaYr+eri+WNs+inuOeZvCwg6ICM5pivIDUg56eS5b6M6Ke455m8IOKAlOKAlAogKiDooajpnaLkuIrnnIvotbfkvobmraPluLjpgYvkvZwsIOWPquaYr+aZgumWk+WujOWFqOmMr+S6hig0OS435aSp6K6K5oiQNeenkiksIOavlG5vZGVqc+S5i+eri+WNs+inuOeZvOabtOmbo+Wvn+imuuOAggogKiDnkrDnuZ7kuqbpnZ7llq7oqr86IOi8uOWFpei2iuWkp+S4jeS7o+ihqOW7tumBsui2iumVtywg54Sh5rOV55Sx6KGM54K65Y+N5o6o6Ly45YWl44CCCiAqCiAqIHdzZW1p54K65ZCM5qeL5aWX5Lu2KOWJjeW+jOerr+eahueUqCksIOaVheS4jeWPr+S+neiztHJ1bnRpbWXkuYvooYzngrosIOW/hemgiOaWvOmAsuWFpXNldFRpbWVvdXTkuYvliY3oh6rooYzlpL7liLbjgIIKICog5aS+5Yi25b6M5YWp55Kw5aKD6KGM54K65LiA6Ie0KOeahueCuuato+W4uOaOkueoi+iHs+S4iumZkCksIOeSsOWig+W3rueVsOa2iOWkseOAggogKgogKgogKiDjgJDngrrkvZXmmK/lpL7liLbogIzpnZ7pgIDlm57poJDoqK3lgLzmiJbmi4vpjK/jgJEKICoKICog5ZG85Y+r56uv57Wm5Ye66LaF5aSn5YC85pmCLCDlhbbmhI/lnJbpoa/nhLbmmK/jgIzlvojkuYXjgI3miJbjgIzlub7kuY7kuI3op7jnmbzjgI0sIOWkvuiHsyAyNC44IOWkqeacgOaOpei/keipsuaEj+WcljsKICog6YCA5Zue6aCQ6Kit5YC8KOWmgjUwbXMp5pyD6K6K5oiQ6auY6aC76Lyq6KmiLCDoiIfmhI/lnJblrozlhajnm7jlj43kuJTmm7TljbHpmqo7IOaLi+mMr+WJh+WwjeaXouacieWRvOWPq+err+eCuuegtOWjnuaAp+iuiuabtOOAggogKgogKgogKiDjgJDoiIflronlhajmlbTmlbjnlYznt5rkuYvljYDliKUg4oCU4oCUIOWFqeiAhemgiOWIhumWi+aqouaguOOAkQogKgogKiBpc3BpbnQodiwgeyB1c2VMaW1pdFNhZmU6IHRydWUgfSkg5pOL55qE5piv44CM6Z2e5a6J5YWo5pW05pW444CNKEluZmluaXR544CBMWUzMDDjgIHotoXlh7oKICogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIg6ICFKSwg5L2GIDJeMzEg5pys6Lqr44CQ5piv44CR5ZCI5rOV55qE5a6J5YWo5pW05pW4LCDlj6rmmK/otoXpgY7oqIjmmYLlmajkuYszMuS9jeWFg+S4iumZkOOAggogKiDmlYXlnovliKXoiIflronlhajmlbTmlbjkuYvmqqLmoLjjgJDmk4vkuI3kvY/jgJHmnKzkuIrpmZAsIOWFqeWxpOeVjOe3muW/hemgiOWQhOiHquiZleeQhjoKICogICDnrKzkuIDlsaQgaXNwaW50IC8gaXNwMGludCDnrYk6IOaTi+Wei+WIpemMr+iqpOiIh+mdnuWuieWFqOaVtOaVuAogKiAgIOesrOS6jOWxpCDmnKzluLjmlbjkuYvlpL7liLY6ICAgICAgIOaTi+i2hemBjuioiOaZguWZqOS4iumZkOiAhQogKgogKgogKiDjgJDnlKjms5XjgJEKICoKICogICBpbXBvcnQgY3N0IGZyb20gJy4vX2NvbnN0Lm1qcycKICogICB0aW1lQWxpdmUgPSBNYXRoLm1pbih0aW1lQWxpdmUsIGNzdC5USU1FUl9USU1FX01BWCkgLy/poIjnlKhtaW4sIOeUqG1heOacg+aKiuato+W4uOWAvOaUvuWkp+eCuuS4iumZkAogKgogKiBAdHlwZSB7SW50ZWdlcn0KICovCmxldCBUSU1FUl9USU1FX01BWCA9IDIxNDc0ODM2NDc7CmxldCBjc3QgPSB7CiAgVElNRVJfVElNRV9NQVgKfTsKCi8qKg0KICog5Yik5pa35piv5ZCm54K65Ye95pW4DQogKg0KICog5aeU5rS+bG9kYXNo5LmLaXNGdW5jdGlvbu+8jOS4gOiIrOWHveaVuOOAgeeuremgreWHveaVuOOAgWFzeW5j5Ye95pW444CBZ2VuZXJhdG9y5Ye95pW46IiHY2xhc3Pnmobngrp0cnVl77ybYXN5bmMgZ2VuZXJhdG9y5Ye95pW4KGFzeW5jIGZ1bmN0aW9uKinmlrxsb2Rhc2ggNOWIpOeCumZhbHNl77yM5bGs5YW25bey55+l6ZmQ5Yi2DQogKg0KICogVW5pdCBUZXN0OiB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL3l1ZGEtbHl1L3dzZW1pL2Jsb2IvbWFzdGVyL3Rlc3QvaXNmdW4udGVzdC5tanMgR2l0aHVifQ0KICogQG1lbWJlck9mIHdzZW1pDQogKiBAcGFyYW0geyp9IHYg6Ly45YWl5Lu75oSP6LOH5paZDQogKiBAcmV0dXJucyB7Qm9vbGVhbn0g5Zue5YKz5Yik5pa35biD5p6X5YC8DQogKiBAZXhhbXBsZQ0KICoNCiAqIGNvbnNvbGUubG9nKGlzZnVuKCcxLjI1JykpDQogKiAvLyA9PiBmYWxzZQ0KICoNCiAqIGNvbnNvbGUubG9nKGlzZnVuKGZ1bmN0aW9uKCkge30pKQ0KICogLy8gPT4gdHJ1ZQ0KICoNCiAqLwpmdW5jdGlvbiBpc2Z1bih2KSB7CiAgcmV0dXJuIGlzRnVuY3Rpb24odik7Cn0KCi8qKg0KICog5Yik5pa35piv5ZCm54K6UHJvbWlzZQ0KICoNCiAqIFVuaXQgVGVzdDoge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS95dWRhLWx5dS93c2VtaS9ibG9iL21hc3Rlci90ZXN0L2lzcG0udGVzdC5tanMgR2l0aHVifQ0KICogQG1lbWJlck9mIHdzZW1pDQogKiBAcGFyYW0geyp9IHYg6Ly45YWl5Lu75oSP6LOH5paZDQogKiBAcmV0dXJucyB7Qm9vbGVhbn0g5Zue5YKz5Yik5pa35biD5p6X5YC8DQogKiBAZXhhbXBsZQ0KICoNCiAqIGNvbnNvbGUubG9nKGlzcG0oJzEuMjUnKSkNCiAqIC8vID0+IGZhbHNlDQogKg0KICogY29uc29sZS5sb2coaXNwbShuZXcgUHJvbWlzZShmdW5jdGlvbigpIHt9KSkpDQogKiAvLyA9PiB0cnVlDQogKg0KICovCmZ1bmN0aW9uIGlzcG0odikgewogIGxldCBiOwogIGxldCBjID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHYpOwogIGIgPSBjID09PSAnW29iamVjdCBQcm9taXNlXSc7CiAgaWYgKGIpIHsKICAgIHJldHVybiB0cnVlOyAvL+iLpeeCultvYmplY3QgUHJvbWlzZV3liYfnm7TmjqXlm57lgrN0cnVlCiAgfQogIGlmIChjICE9PSAnW29iamVjdCBGdW5jdGlvbl0nKSB7CiAgICByZXR1cm4gZmFsc2U7IC8v6Iul5LiN5pivW29iamVjdCBQcm9taXNlXeS5n+S4jeaYr1tvYmplY3QgRnVuY3Rpb25d5YmH55u05o6l5Zue5YKzZmFsc2UKICB9CiAgdHJ5IHsKICAgIGIgPSB0eXBlb2Ygdi5zdWJzY3JpYmUgIT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHYudGhlbiA9PT0gJ2Z1bmN0aW9uJzsgLy/lj6/lgbXmuKxhc3luYyBmdW5jdGlvbgogIH0gY2F0Y2ggKGVycikge30KICByZXR1cm4gYjsKfQoKLyoqDQogKiDnrYnlvoVm5Ye95pW45Zue5YKzdHJ1ZQ0KICoNCiAqIFVuaXQgVGVzdDoge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS95dWRhLWx5dS93c2VtaS9ibG9iL21hc3Rlci90ZXN0L3dhaXRGdW4udGVzdC5tanMgR2l0aHVifQ0KICogQG1lbWJlck9mIHdzZW1pDQogKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW4g6Ly45YWl5Yik5pa355So5Ye95pW4DQogKiBAcGFyYW0ge09iamVjdH0gb3B0IOi8uOWFpeioreWumueJqeS7tu+8jOmgkOiorXt9DQogKiBAcGFyYW0ge0ludGVnZXJ9IFtvcHQuYXR0ZW1wdE51bT0yMDBdIOi8uOWFpeacgOWkp+WYl+ippuasoeaVuO+8jOeCuuato+aVtOaVuO+8jOmgkOiorTIwMA0KICogQHBhcmFtIHtJbnRlZ2VyfSBbb3B0LnRpbWVJbnRlcnZhbD0xMDAwXSDovLjlhaXlmJfoqabmmYLplpPpgLHmnJ/vvIzngrrmraPmlbTmlbjvvIzllq7kvY3ngrptc++8jOmgkOiorTEwMDANCiAqIEByZXR1cm5zIHtQcm9taXNlfSDlm57lgrNQcm9taXNl77yMcmVzb2x2ZeWbnuWCs+eCuuepuuS7o+ihqGblh73mlbjlm57lgrN0cnVl5oiW6LaF6YGO5pyA5aSn5ZiX6Kmm5qyh5pW477yMcmVqZWN05Zue5YKz6Yyv6Kqk6KiK5oGvDQogKiBAZXhhbXBsZQ0KICoNCiAqIGFzeW5jIGZ1bmN0aW9uIHRvcEFzeW5jKCkgew0KICoNCiAqICAgICBmdW5jdGlvbiB0ZXN0MSgpIHsNCiAqICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHsNCiAqICAgICAgICAgICAgIGxldCBtcyA9IFtdDQogKg0KICogICAgICAgICAgICAgbGV0IGkgPSAwDQogKiAgICAgICAgICAgICB3YWl0RnVuKGZ1bmN0aW9uKCkgew0KICogICAgICAgICAgICAgICAgIGkrKw0KICogICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3YWl0aW5nOiAnICsgaSkNCiAqICAgICAgICAgICAgICAgICBtcy5wdXNoKCd3YWl0aW5nOiAnICsgaSkNCiAqICAgICAgICAgICAgICAgICByZXR1cm4gaSA+PSAyDQogKiAgICAgICAgICAgICB9KQ0KICogICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkgew0KICogICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGVzdDEgdGhlbicpDQogKiAgICAgICAgICAgICAgICAgICAgIG1zLnB1c2goJ3Rlc3QxIHRoZW4nKQ0KICogICAgICAgICAgICAgICAgIH0pDQogKg0KICogICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsNCiAqICAgICAgICAgICAgICAgICByZXNvbHZlKG1zKQ0KICogICAgICAgICAgICAgfSwgMTEwMCkNCiAqDQogKiAgICAgICAgIH0pDQogKiAgICAgfQ0KICogICAgIGNvbnNvbGUubG9nKCd0ZXN0MScpDQogKiAgICAgbGV0IHIxID0gYXdhaXQgdGVzdDEoKQ0KICogICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHIxKSkNCiAqICAgICAvLyB0ZXN0MQ0KICogICAgIC8vIHdhaXRpbmc6IDENCiAqICAgICAvLyB3YWl0aW5nOiAyDQogKiAgICAgLy8gdGVzdDEgdGhlbg0KICogICAgIC8vIFsid2FpdGluZzogMSIsIndhaXRpbmc6IDIiLCJ0ZXN0MSB0aGVuIl0NCiAqDQogKiAgICAgZnVuY3Rpb24gdGVzdDIoKSB7DQogKiAgICAgICAgIGxldCBtcyA9IFtdDQogKiAgICAgICAgIGxldCBpID0gMA0KICoNCiAqICAgICAgICAgbGV0IGYgPSAoKSA9PiB7DQogKiAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gew0KICogICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7DQogKiAgICAgICAgICAgICAgICAgICAgIGkrKw0KICogICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnd2FpdGluZzogJyArIGkpDQogKiAgICAgICAgICAgICAgICAgICAgIG1zLnB1c2goJ3dhaXRpbmc6ICcgKyBpKQ0KICogICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGkgPj0gMikNCiAqICAgICAgICAgICAgICAgICB9LCAxMTAwKQ0KICogICAgICAgICAgICAgfSkNCiAqICAgICAgICAgfQ0KICoNCiAqICAgICAgICAgcmV0dXJuIHdhaXRGdW4oZikNCiAqICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkgew0KICogICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0ZXN0MiB0aGVuJykNCiAqICAgICAgICAgICAgICAgICBtcy5wdXNoKCd0ZXN0MiB0aGVuJykNCiAqICAgICAgICAgICAgICAgICByZXR1cm4gbXMNCiAqICAgICAgICAgICAgIH0pDQogKg0KICogICAgIH0NCiAqICAgICBjb25zb2xlLmxvZygndGVzdDInKQ0KICogICAgIGxldCByMiA9IGF3YWl0IHRlc3QyKCkNCiAqICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyMikpDQogKiAgICAgLy8gdGVzdDINCiAqICAgICAvLyB3YWl0aW5nOiAxDQogKiAgICAgLy8gd2FpdGluZzogMg0KICogICAgIC8vIHRlc3QyIHRoZW4NCiAqICAgICAvLyBbIndhaXRpbmc6IDEiLCJ3YWl0aW5nOiAyIiwidGVzdDIgdGhlbiJdDQogKiAgICAgLy8gd2FpdGluZzogMw0KICoNCiAqIH0NCiAqIHRvcEFzeW5jKCkuY2F0Y2goKCkgPT4ge30pDQogKg0KICovCmFzeW5jIGZ1bmN0aW9uIHdhaXRGdW4oZnVuLCBvcHQgPSB7fSkgewogIGxldCByID0gbnVsbDsKCiAgLy9wbQogIGxldCBwbSA9IGdlblBtKCk7CgogIC8vY2hlY2sKICBpZiAoIWlzZnVuKGZ1bikpIHsKICAgIHBtLnJlamVjdCgnd2FpdGZ1bmN0aW9u6ZyA6Ly45YWl5Ye95pW4ZicpOwogICAgcmV0dXJuIHBtOwogIH0KCiAgLy9mdW5jCiAgbGV0IGZ1bmMgPSBhc3luYyAoKSA9PiB7CiAgICBsZXQgciA9IGZ1bigpOwogICAgaWYgKGlzcG0ocikpIHsKICAgICAgciA9IGF3YWl0IHI7CiAgICB9CiAgICByZXR1cm4gcjsKICB9OwoKICAvL2ltbWVkaWF0ZSBjYWxsCiAgciA9IGF3YWl0IGZ1bmMoKTsKICBpZiAociA9PT0gdHJ1ZSkgewogICAgcG0ucmVzb2x2ZSgpOwogICAgcmV0dXJuIHBtOwogIH0KCiAgLy9hdHRlbXB0TnVtCiAgbGV0IGF0dGVtcHROdW0gPSBnZXQob3B0LCAnYXR0ZW1wdE51bScsIG51bGwpOwogIGlmICghaXNwaW50KGF0dGVtcHROdW0pKSB7CiAgICBhdHRlbXB0TnVtID0gMjAwOwogIH0KCiAgLy90aW1lSW50ZXJ2YWwKICBsZXQgdGltZUludGVydmFsID0gZ2V0KG9wdCwgJ3RpbWVJbnRlcnZhbCcsIG51bGwpOwogIGlmICghaXNwaW50KHRpbWVJbnRlcnZhbCkpIHsKICAgIHRpbWVJbnRlcnZhbCA9IDEwMDA7CiAgfQogIHRpbWVJbnRlcnZhbCA9IE1hdGgubWluKHRpbWVJbnRlcnZhbCwgY3N0LlRJTUVSX1RJTUVfTUFYKTsgLy/lpL7oh7PoqIjmmYLlmajkuIrpmZAsIOimi19jb25zdC5tanMKCiAgLy9zZXRJbnRlcnZhbAogIGxldCBuID0gMDsKICBsZXQgdCA9IHNldEludGVydmFsKGFzeW5jICgpID0+IHsKICAgIG4gKz0gMTsKICAgIC8vY29uc29sZS5sb2coJ3dhaXRGdW46ICcsIG4pCgogICAgciA9IGF3YWl0IGZ1bmMoKTsKICAgIGlmIChyID09PSB0cnVlKSB7CiAgICAgIC8vY29uc29sZS5sb2coJ3Jlc29sdmUnLCBuKQogICAgICBjbGVhckludGVydmFsKHQpOwogICAgICBwbS5yZXNvbHZlKCk7CiAgICB9CiAgICBpZiAobiA+IGF0dGVtcHROdW0pIHsKICAgICAgLy9jb25zb2xlLmxvZygncmVqZWN0JywgbiwgYXR0ZW1wdE51bSkKICAgICAgY2xlYXJJbnRlcnZhbCh0KTsKICAgICAgcG0ucmVqZWN0KGBleGNlZWRlZCBhdHRlbXB0TnVtWyR7YXR0ZW1wdE51bX1dYCk7IC8v5bey6LaF6YGO5pyA5aSn5qyh5pW4CiAgICB9CiAgfSwgdGltZUludGVydmFsKTsKICByZXR1cm4gcG07Cn0KCi8qKg0KICog5bu656uL5LiA5YCLIE1RVFQg5a6i5oi256uv77yM5pSv5o+05oyB5LmF6YCj57ea44CBVG9rZW4g6amX6K2J44CB6Ieq5YuV6YeN6YCj44CB6KiC6Zax6IiH55m85L2I5Yqf6IO9DQogKg0KICogQHBhcmFtIHtPYmplY3R9IFtvcHQ9e31dIC0g6Kit5a6a6YG46aCFDQogKiBAcGFyYW0ge1N0cmluZ30gW29wdC51cmw9J21xdHQ6Ly9sb2NhbGhvc3QnXSAtIE1RVFQgYnJva2VyIOmAo+e3miBVUkwNCiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0LnBvcnQ9ODA4MF0gLSBCcm9rZXIg6YCj57eaIHBvcnQNCiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0LnRva2VuPScnXSAtIOmAo+e3muaZgueUqOS+humpl+itieeahCBUb2tlbg0KICogQHBhcmFtIHtTdHJpbmd9IFtvcHQuY2xpZW50SWRdIC0g5oyH5a6aIENsaWVudCBJRO+8jOiLpeacquaMh+WumuWJh+iHquWLleeUoueUnw0KICogQHBhcmFtIHtOdW1iZXJ9IFtvcHQudGltZVJlY29ubmVjdD0yMDAwXSAtIOaWt+e3muW+jOmHjeaWsOmAo+e3mueahOmWk+malOaZgumWk++8iOavq+enku+8iQ0KICogQHJldHVybnMge09iamVjdH0gLSDlgrPlm57kuIDlgIvlhbfmnIkgYHN1YnNjcmliZWDjgIFgdW5zdWJzY3JpYmVg44CBYHB1Ymxpc2hg44CBYGNsZWFyYCDmlrnms5XnmoTkuovku7bnianku7YNCiAqIEBleGFtcGxlDQogKg0KICogaW1wb3J0IHcgZnJvbSAnd3NlbWknDQogKiBpbXBvcnQgV1B1YnN1YkNsaWVudCBmcm9tICcuL3NyYy9XUHVic3ViQ2xpZW50Lm1qcycNCiAqIC8vIGltcG9ydCBXUHVic3ViQ2xpZW50IGZyb20gJy4vZGlzdC93LXB1YnN1Yi1jbGllbnQudW1kLmpzJw0KICogLy8gaW1wb3J0IFdQdWJzdWJDbGllbnQgZnJvbSAnLi9kaXN0L3ctcHVic3ViLWNsaWVudC53ay51bWQuanMnDQogKg0KICogbGV0IHRlc3QgPSBhc3luYyAoKSA9PiB7DQogKiAgICAgbGV0IHBtID0gdy5nZW5QbSgpDQogKg0KICogICAgIGxldCBtcyA9IFtdDQogKg0KICogICAgIGxldCBjbGllbnRJZCA9ICdpZC1mb3ItY2xpZW50Jw0KICoNCiAqICAgICBsZXQgb3B0ID0gew0KICogICAgICAgICBwb3J0OiA4MDgwLA0KICogICAgICAgICB0b2tlbjogJ3Rva2VuLWZvci10ZXN0JywNCiAqICAgICAgICAgY2xpZW50SWQsDQogKiAgICAgfQ0KICogICAgIGxldCB3cGMgPSBuZXcgV1B1YnN1YkNsaWVudChvcHQpDQogKiAgICAgLy8gY29uc29sZS5sb2coJ3dwYycsIHdwYykNCiAqDQogKiAgICAgbGV0IHRvcGljID0gJ3Rhc2snDQogKg0KICogICAgIHdwYy5vbignY29ubmVjdCcsICgpID0+IHsNCiAqICAgICAgICAgY29uc29sZS5sb2coJ2Nvbm5lY3QnKQ0KICogICAgICAgICBtcy5wdXNoKHsgY2xpZW50SWQ6IGBjb25uZWN0YCB9KQ0KICogICAgIH0pDQogKiAgICAgd3BjLm9uKCdyZWNvbm5lY3QnLCAoKSA9PiB7DQogKiAgICAgICAgIGNvbnNvbGUubG9nKCdyZWNvbm5lY3QnKQ0KICogICAgIH0pDQogKiAgICAgd3BjLm9uKCdvZmZsaW5lJywgKCkgPT4gew0KICogICAgICAgICBjb25zb2xlLmxvZygnb2ZmbGluZScpDQogKiAgICAgfSkNCiAqICAgICB3cGMub24oJ21lc3NhZ2UnLCAoeyB0b3BpYywgbWVzc2FnZSB9KSA9PiB7DQogKiAgICAgICAgIGNvbnNvbGUubG9nKGBtZXNzYWdlYCwgdG9waWMsIG1lc3NhZ2UpDQogKiAgICAgICAgIG1zLnB1c2goeyBjbGllbnRJZDogYHJlY2VpdmUgdG9waWNbJHt0b3BpY31dLCBtZXNzYWdlWyR7bWVzc2FnZX1dYCB9KQ0KICogICAgIH0pDQogKiAgICAgd3BjLm9uKCdjbG9zZScsICgpID0+IHsNCiAqICAgICAgICAgY29uc29sZS5sb2coJ2Nsb3NlJykNCiAqICAgICAgICAgbXMucHVzaCh7IGNsaWVudElkOiBgY2xvc2VgIH0pDQogKiAgICAgfSkNCiAqICAgICB3cGMub24oJ2VuZCcsICgpID0+IHsNCiAqICAgICAgICAgY29uc29sZS5sb2coJ2VuZCcpDQogKiAgICAgfSkNCiAqICAgICB3cGMub24oJ2Vycm9yJywgKGVycikgPT4gew0KICogICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InLCBlcnIpDQogKiAgICAgfSkNCiAqDQogKiAgICAgYXdhaXQgd3BjLnN1YnNjcmliZSh0b3BpYywgMikNCiAqICAgICAgICAgLnRoZW4oKHJlcykgPT4gew0KICogICAgICAgICAgICAgY29uc29sZS5sb2coJ3N1YnNjcmliZSB0aGVuJywgcmVzKQ0KICogICAgICAgICAgICAgbXMucHVzaCh7IGNsaWVudElkOiBgc3Vic2NyaWJlYCwgc3Vic2NyaXB0aW9uczogSlNPTi5zdHJpbmdpZnkocmVzKSB9KQ0KICogICAgICAgICB9KQ0KICogICAgICAgICAuY2F0Y2goKGVycikgPT4gew0KICogICAgICAgICAgICAgY29uc29sZS5sb2coJ3N1YnNjcmliZSBjYXRjaCcsIGVycikNCiAqICAgICAgICAgfSkNCiAqDQogKiAgICAgYXdhaXQgd3BjLnB1Ymxpc2godG9waWMsICdyZXN1bHQnLCAyKQ0KICogICAgICAgICAudGhlbigocmVzKSA9PiB7DQogKiAgICAgICAgICAgICBjb25zb2xlLmxvZygncHVibGlzaCB0aGVuJywgcmVzKQ0KICogICAgICAgICAgICAgbXMucHVzaCh7IGNsaWVudElkOiBgcHVibGlzaGAsIHJlcyB9KQ0KICogICAgICAgICB9KQ0KICogICAgICAgICAuY2F0Y2goKGVycikgPT4gew0KICogICAgICAgICAgICAgY29uc29sZS5sb2coJ3B1Ymxpc2ggY2F0Y2gnLCBlcnIpDQogKiAgICAgICAgIH0pDQogKg0KICogICAgIHNldFRpbWVvdXQoYXN5bmMoKSA9PiB7DQogKiAgICAgICAgIGF3YWl0IHdwYy5jbGVhcigpDQogKiAgICAgICAgIHRyeSB7IC8v5L2/55Sod29ya2Vy54mI5pmC6KaB5Y+m5aSW5ZG85Y+rdGVybWluYXRl5Lit5q2iDQogKiAgICAgICAgICAgICB3cGMudGVybWluYXRlKCkNCiAqICAgICAgICAgfQ0KICogICAgICAgICBjYXRjaCAoZXJyKSB7fQ0KICogICAgICAgICBjb25zb2xlLmxvZygnbXMnLCBtcykNCiAqICAgICAgICAgcG0ucmVzb2x2ZShtcykNCiAqICAgICB9LCA1MDAwKQ0KICoNCiAqICAgICByZXR1cm4gcG0NCiAqIH0NCiAqIGF3YWl0IHRlc3QoKQ0KICogICAgIC5jYXRjaCgoZXJyKSA9PiB7DQogKiAgICAgICAgIGNvbnNvbGUubG9nKGVycikNCiAqICAgICB9KQ0KICogLy8gPT4gbXMgWw0KICogLy8gICB7IGNsaWVudElkOiAnY29ubmVjdCcgfSwNCiAqIC8vICAgew0KICogLy8gICAgIGNsaWVudElkOiAnc3Vic2NyaWJlJywNCiAqIC8vICAgICBzdWJzY3JpcHRpb25zOiAnW3sidG9waWMiOiJ0YXNrIiwicW9zIjoyfV0nDQogKiAvLyAgIH0sDQogKiAvLyAgIHsgY2xpZW50SWQ6ICdwdWJsaXNoJywgcmVzOiAnZG9uZScgfSwNCiAqIC8vICAgeyBjbGllbnRJZDogJ3JlY2VpdmUgdG9waWNbdGFza10nIH0sDQogKiAvLyAgIHsgY2xpZW50SWQ6ICdjbG9zZScgfQ0KICogLy8gXQ0KICoNCiAqLwpmdW5jdGlvbiBXUHVic3ViQ2xpZW50KG9wdCA9IHt9KSB7CiAgLy9rZXlNc2cKICBsZXQga2V5TXNnID0gJ19fbXNnX18nOwoKICAvL3VybAogIGxldCB1cmwgPSBnZXQob3B0LCAndXJsJyk7CiAgaWYgKCFpc2VzdHIodXJsKSkgewogICAgdXJsID0gJ21xdHQ6Ly9sb2NhbGhvc3QnOwogIH0KCiAgLy9wb3J0CiAgbGV0IHBvcnQgPSBnZXQob3B0LCAncG9ydCcpOwogIGlmICghaXNwaW50KHBvcnQpKSB7CiAgICBwb3J0ID0gODA4MDsKICB9CiAgcG9ydCA9IGNpbnQocG9ydCk7CgogIC8vdG9rZW4KICBsZXQgdG9rZW4gPSBnZXQob3B0LCAndG9rZW4nKTsKICBpZiAoIWlzZXN0cih0b2tlbikpIHsKICAgIHRva2VuID0gJyc7CiAgfQoKICAvL2NsaWVudElkCiAgbGV0IGNsaWVudElkID0gZ2V0KG9wdCwgJ2NsaWVudElkJyk7CiAgaWYgKCFpc2VzdHIoY2xpZW50SWQpKSB7CiAgICBjbGllbnRJZCA9IGBjbC0ke2dlbklEKCl9YDsKICB9CgogIC8vdGltZVJlY29ubmVjdAogIGxldCB0aW1lUmVjb25uZWN0ID0gZ2V0KG9wdCwgJ3RpbWVSZWNvbm5lY3QnKTsKICBpZiAoIWlzcGludCh0aW1lUmVjb25uZWN0KSkgewogICAgdGltZVJlY29ubmVjdCA9IDIwMDA7CiAgfQogIHRpbWVSZWNvbm5lY3QgPSBjaW50KHRpbWVSZWNvbm5lY3QpOwoKICAvL3VybEJyb2tlcgogIGxldCB1cmxCcm9rZXIgPSBgJHt1cmx9OiR7cG9ydH1gOwoKICAvL2NsaWVudAogIGxldCBjbGllbnQgPSBtcXR0LmNvbm5lY3QodXJsQnJva2VyLCB7CiAgICBjbGllbnRJZCwKICAgIHVzZXJuYW1lOiB0b2tlbiwKICAgIC8v5o+Q5L6bdG9rZW7pqZforYkKICAgIHBhc3N3b3JkOiAnJywKICAgIC8v5LiN5o+Q5L6bCiAgICBjbGVhbjogZmFsc2UsCiAgICAvL+ioreWumuaMgeS5hVNlc3Npb24o6Zui57ea6KOc5pS2KQogICAgcmVjb25uZWN0UGVyaW9kOiB0aW1lUmVjb25uZWN0IC8v5pa357ea5b6M6Ieq5YuV6YeN6YCj5pmC6ZaTCiAgfSk7CgogIC8vZXYKICBsZXQgZXYgPSBldmVtKCk7CgogIC8vb25saW5lCiAgbGV0IG9ubGluZSA9IGZhbHNlOwoKICAvL2Nvbm5lY3QKICBjbGllbnQub24oJ2Nvbm5lY3QnLCAoKSA9PiB7CiAgICAvLyBjb25zb2xlLmxvZyhgY2xpZW50IGluYCwgY2xpZW50SWQpCiAgICBvbmxpbmUgPSB0cnVlOwogICAgZXYuZW1pdCgnY29ubmVjdCcpOwogIH0pOwoKICAvL3JlY29ubmVjdCwg6Ieq5YuV6YeN6YCj5pyf6ZaT5q+P5qyhcmV0cnnpg73mnIPop7jnmbzkuIDmrKEKICBjbGllbnQub24oJ3JlY29ubmVjdCcsICgpID0+IHsKICAgIC8vIGNvbnNvbGUubG9nKGBjbGllbnQgcmVjb25uZWN0YCwgY2xpZW50SWQpCiAgICBldi5lbWl0KCdyZWNvbm5lY3QnKTsKICB9KTsKCiAgLy9zdWJzY3JpYmUKICBsZXQgc3Vic2NyaWJlID0gYXN5bmMgKHRvcGljLCBxb3MgPSAyKSA9PiB7CiAgICAvL3FvczoKICAgIC8vMCwg5pyA5aSa6YCB5LiA5qyhCiAgICAvLzEsIOiHs+WwkemAgeS4gOasoSwg5L+d6K2J6YCB5Yiw5L2G5Y+v6IO96YeN6KSH6YCBCiAgICAvLzIsIOWJm+WlvemAgeS4gOasoSwg5L+d6K2J5Y+q6YCB5LiA5qyh5LiU5LiN6YeN6KSHCgogICAgLy9wbQogICAgbGV0IHBtID0gZ2VuUG0oKTsKCiAgICAvL3dhaXQgb25saW5lCiAgICBhd2FpdCB3YWl0RnVuKCgpID0+IHsKICAgICAgcmV0dXJuIG9ubGluZTsKICAgIH0pOwoKICAgIC8v6KiC6Zax5Li76aGMCiAgICBjbGllbnQuc3Vic2NyaWJlKHRvcGljLCB7CiAgICAgIHFvcwogICAgfSwgKGVyciwgZ3JhbnRlZCkgPT4gewogICAgICAvLyBncmFudGVkID0+IFsKICAgICAgLy8gICB7IHRvcGljOiAnZ2VuZXJhdGUvcmVwb3J0JywgcW9zOiAyIH0sCiAgICAgIC8vICAgeyB0b3BpYzogJ25ld3MvdXBkYXRlJywgcW9zOiAxIH0KICAgICAgLy8gXQogICAgICBpZiAoZXJyKSB7CiAgICAgICAgcG0ucmVqZWN0KGVycik7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgcG0ucmVzb2x2ZShncmFudGVkKTsKICAgICAgfQogICAgfSk7CiAgICByZXR1cm4gcG07CiAgfTsKCiAgLy91bnN1YnNjcmliZQogIGxldCB1bnN1YnNjcmliZSA9IGFzeW5jIHRvcGljID0+IHsKICAgIC8vcG0KICAgIGxldCBwbSA9IGdlblBtKCk7CgogICAgLy93YWl0IG9ubGluZQogICAgYXdhaXQgd2FpdEZ1bigoKSA9PiB7CiAgICAgIHJldHVybiBvbmxpbmU7CiAgICB9KTsKCiAgICAvL+WPlua2iOiogumWseS4u+mhjAogICAgY2xpZW50LnVuc3Vic2NyaWJlKHRvcGljLCBlcnIgPT4gewogICAgICBpZiAoZXJyKSB7CiAgICAgICAgcG0ucmVqZWN0KGVycik7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgcG0ucmVzb2x2ZSgpOwogICAgICB9CiAgICB9KTsKICAgIHJldHVybiBwbTsKICB9OwoKICAvL3B1Ymxpc2gKICBsZXQgcHVibGlzaCA9IGFzeW5jICh0b3BpYywgbXNnLCBxb3MgPSAyKSA9PiB7CiAgICAvL3FvczoKICAgIC8vMCwg5pyA5aSa6YCB5LiA5qyhCiAgICAvLzEsIOiHs+WwkemAgeS4gOasoSwg5L+d6K2J6YCB5Yiw5L2G5Y+v6IO96YeN6KSH6YCBCiAgICAvLzIsIOWJm+WlvemAgeS4gOasoSwg5L+d6K2J5Y+q6YCB5LiA5qyh5LiU5LiN6YeN6KSHCgogICAgLy93YWl0IG9ubGluZQogICAgYXdhaXQgd2FpdEZ1bigoKSA9PiB7CiAgICAgIHJldHVybiBvbmxpbmU7CiAgICB9KTsKCiAgICAvL3BheWxvYWQsIOWei+WIpeWPr+aUr+aPtDogU3RyaW5nLCBCdWZmZXIsIFVpbnQ4QXJyYXksIE51bWJlciwgT2JqZWN0KOimgUpTT04uc3RyaW5naWZ5KQogICAgbGV0IHBheWxvYWQgPSBKU09OLnN0cmluZ2lmeSh7CiAgICAgIFtrZXlNc2ddOiBtc2cKICAgIH0pOyAvL+WwgeijneiHs21zZ+WPr+ewoeWMluS9v+eUqOWei+WIpSwg5YOF5pSv5o+0T2JqZWN0LCBTdHJpbmcsIE51bWJlciwgQm9vbGVhbgogICAgLy8gY29uc29sZS5sb2coJ21zZycsIG1zZykKICAgIC8vIGNvbnNvbGUubG9nKCdwYXlsb2FkJywgcGF5bG9hZCkKCiAgICAvL3BtCiAgICBsZXQgcG0gPSBnZW5QbSgpOwoKICAgIC8v55m85biD5Li76aGMCiAgICBjbGllbnQucHVibGlzaCh0b3BpYywgcGF5bG9hZCwgewogICAgICBxb3MKICAgIH0sIGVyciA9PiB7CiAgICAgIGlmIChlcnIpIHsKICAgICAgICBwbS5yZWplY3QoZXJyKTsKICAgICAgfSBlbHNlIHsKICAgICAgICBwbS5yZXNvbHZlKCdkb25lJyk7CiAgICAgIH0KICAgIH0pOwogICAgcmV0dXJuIHBtOwogIH07CgogIC8vbWVzc2FnZQogIGNsaWVudC5vbignbWVzc2FnZScsICh0b3BpYywgbWVzc2FnZSkgPT4gewogICAgLy8gY29uc29sZS5sb2coYGNsaWVudCByZWNlaXZlYCwgY2xpZW50SWQsIHRvcGljLCBtZXNzYWdlKQogICAgbGV0IF9tZXNzYWdlID0gJyc7CiAgICB0cnkgewogICAgICBsZXQgaiA9IG1lc3NhZ2UudG9TdHJpbmcoKTsgLy9tcXR05o6l5pS2bWVzc2FnZeaZguacg+iuiuaIkEJ1ZmZlciwg5b6X6L2JbWVzc2FnZS50b1N0cmluZygpCiAgICAgIC8vIGNvbnNvbGUubG9nKCdtZXNzYWdlIGonLCBqKQogICAgICBsZXQgbyA9IGoybyhqKTsKICAgICAgLy8gY29uc29sZS5sb2coJ21lc3NhZ2UgbycsIG8pCiAgICAgIF9tZXNzYWdlID0gZ2V0KG8sIGtleU1zZywgJycpOwogICAgfSBjYXRjaCAoZXJyKSB7CiAgICAgIGNvbnNvbGUubG9nKGVycik7CiAgICB9CiAgICBldi5lbWl0KCdtZXNzYWdlJywgewogICAgICB0b3BpYywKICAgICAgbWVzc2FnZTogX21lc3NhZ2UKICAgIH0pOwogIH0pOwoKICAvLyAvL3NpbXBsaWZ5RXJyb3IKICAvLyBsZXQgc2ltcGxpZnlFcnJvciA9IChlcnIpID0+IHsKICAvLyAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEFnZ3JlZ2F0ZUVycm9yICYmIEFycmF5LmlzQXJyYXkoZXJyLmVycm9ycykpIHsKICAvLyAgICAgICAgIHJldHVybiBlcnIuZXJyb3JzLm1hcChlID0+IGBbJHtlLmFkZHJlc3N9OiR7ZS5wb3J0fV0gJHtlLmNvZGV9YCkuam9pbignIHwgJykKICAvLyAgICAgfQogIC8vICAgICBpZiAoZXJyIGluc3RhbmNlb2YgRXJyb3IpIHsKICAvLyAgICAgICAgIHJldHVybiBlcnIubWVzc2FnZSB8fCBTdHJpbmcoZXJyKQogIC8vICAgICB9CiAgLy8gICAgIHJldHVybiBTdHJpbmcoZXJyKQogIC8vIH0KCiAgLy9lcnJvcgogIGNsaWVudC5vbignZXJyb3InLCBlcnIgPT4gewogICAgLy8gY29uc29sZS5sb2coYGNsaWVudCBlcnJvcmAsIGNsaWVudElkLCBlcnIubWVzc2FnZSkKICAgIGV2LmVtaXQoJ2Vycm9yJywgZXJyKTsKICAgIC8vIGV2LmVtaXQoJ2Vycm9yJywgc2ltcGxpZnlFcnJvcihlcnIpLCBlcnIpCiAgfSk7CgogIC8vb2ZmbGluZSwgY2xpZW505Yik5a6a5bey6Zui57ea54Sh5rOV5YaN6IiHYnJva2Vy5rqd6YCa5pmC6Ke455m8CiAgY2xpZW50Lm9uKCdvZmZsaW5lJywgKCkgPT4gewogICAgLy8gY29uc29sZS5sb2coYGNsaWVudCBvZmZsaW5lYCwgY2xpZW50SWQpCiAgICBvbmxpbmUgPSBmYWxzZTsKICAgIGV2LmVtaXQoJ29mZmxpbmUnKTsKICB9KTsKCiAgLy9jbG9zZQogIGNsaWVudC5vbignY2xvc2UnLCAoKSA9PiB7CiAgICAvLyBjb25zb2xlLmxvZyhgY2xpZW50IGNsb3NlYCwgY2xpZW50SWQpCiAgICBvbmxpbmUgPSBmYWxzZTsKICAgIGV2LmVtaXQoJ2Nsb3NlJyk7CiAgfSk7CgogIC8vZW5kLCDlkbzlj6tjbGllbnQuZW5kKCnlvozop7jnmbwKICBjbGllbnQub24oJ2VuZCcsICgpID0+IHsKICAgIC8vIGNvbnNvbGUubG9nKGBjbGllbnQgZW5kYCwgY2xpZW50SWQpCiAgICBvbmxpbmUgPSBmYWxzZTsKICAgIGV2LmVtaXQoJ2VuZCcpOwogIH0pOwoKICAvL2NsZWFyCiAgbGV0IGNsZWFyID0gKCkgPT4gewogICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHsKICAgICAgY2xpZW50LmVuZChmYWxzZSwge30sIGVyciA9PiB7CiAgICAgICAgaWYgKGVycikgewogICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpOwogICAgICAgIH0KICAgICAgICByZXNvbHZlKCk7CiAgICAgIH0pOwogICAgfSk7CiAgfTsKCiAgLy9zYXZlCiAgZXYuc3Vic2NyaWJlID0gc3Vic2NyaWJlOwogIGV2LnVuc3Vic2NyaWJlID0gdW5zdWJzY3JpYmU7CiAgZXYucHVibGlzaCA9IHB1Ymxpc2g7CiAgZXYuY2xlYXIgPSBjbGVhcjsKICByZXR1cm4gZXY7Cn0KCgoKbGV0IGluc3RhbmNlID0gbnVsbApmdW5jdGlvbiBpbml0KGlucHV0KXsKCiAgICAvL2luaXQKICAgIGxldCByCiAgICAKICAgICAgICByID0gV1B1YnN1YkNsaWVudCguLi5pbnB1dCkKICAgICAgICAKCiAgICAvL29uCiAgICAKCiAgICByLm9uKCdjb25uZWN0JywobXNnKSA9PiB7CgogICAgICAgIC8vc2VuZE1lc3NhZ2UKICAgICAgICBsZXQgcmVzID0gewogICAgICAgICAgICBtb2RlOiAnZW1pdCcsCiAgICAgICAgICAgIGV2TmFtZTogJ2Nvbm5lY3QnLAogICAgICAgICAgICBtc2csCiAgICAgICAgfQogICAgICAgIHNlbmRNZXNzYWdlKHJlcykKCiAgICB9KQoKCgogICAgci5vbigncmVjb25uZWN0JywobXNnKSA9PiB7CgogICAgICAgIC8vc2VuZE1lc3NhZ2UKICAgICAgICBsZXQgcmVzID0gewogICAgICAgICAgICBtb2RlOiAnZW1pdCcsCiAgICAgICAgICAgIGV2TmFtZTogJ3JlY29ubmVjdCcsCiAgICAgICAgICAgIG1zZywKICAgICAgICB9CiAgICAgICAgc2VuZE1lc3NhZ2UocmVzKQoKICAgIH0pCgoKCiAgICByLm9uKCdtZXNzYWdlJywobXNnKSA9PiB7CgogICAgICAgIC8vc2VuZE1lc3NhZ2UKICAgICAgICBsZXQgcmVzID0gewogICAgICAgICAgICBtb2RlOiAnZW1pdCcsCiAgICAgICAgICAgIGV2TmFtZTogJ21lc3NhZ2UnLAogICAgICAgICAgICBtc2csCiAgICAgICAgfQogICAgICAgIHNlbmRNZXNzYWdlKHJlcykKCiAgICB9KQoKCgogICAgci5vbignZXJyb3InLChtc2cpID0+IHsKCiAgICAgICAgLy9zZW5kTWVzc2FnZQogICAgICAgIGxldCByZXMgPSB7CiAgICAgICAgICAgIG1vZGU6ICdlbWl0JywKICAgICAgICAgICAgZXZOYW1lOiAnZXJyb3InLAogICAgICAgICAgICBtc2csCiAgICAgICAgfQogICAgICAgIHNlbmRNZXNzYWdlKHJlcykKCiAgICB9KQoKCgogICAgci5vbignb2ZmbGluZScsKG1zZykgPT4gewoKICAgICAgICAvL3NlbmRNZXNzYWdlCiAgICAgICAgbGV0IHJlcyA9IHsKICAgICAgICAgICAgbW9kZTogJ2VtaXQnLAogICAgICAgICAgICBldk5hbWU6ICdvZmZsaW5lJywKICAgICAgICAgICAgbXNnLAogICAgICAgIH0KICAgICAgICBzZW5kTWVzc2FnZShyZXMpCgogICAgfSkKCgoKICAgIHIub24oJ2Nsb3NlJywobXNnKSA9PiB7CgogICAgICAgIC8vc2VuZE1lc3NhZ2UKICAgICAgICBsZXQgcmVzID0gewogICAgICAgICAgICBtb2RlOiAnZW1pdCcsCiAgICAgICAgICAgIGV2TmFtZTogJ2Nsb3NlJywKICAgICAgICAgICAgbXNnLAogICAgICAgIH0KICAgICAgICBzZW5kTWVzc2FnZShyZXMpCgogICAgfSkKCgoKICAgIHIub24oJ2VuZCcsKG1zZykgPT4gewoKICAgICAgICAvL3NlbmRNZXNzYWdlCiAgICAgICAgbGV0IHJlcyA9IHsKICAgICAgICAgICAgbW9kZTogJ2VtaXQnLAogICAgICAgICAgICBldk5hbWU6ICdlbmQnLAogICAgICAgICAgICBtc2csCiAgICAgICAgfQogICAgICAgIHNlbmRNZXNzYWdlKHJlcykKCiAgICB9KQoKCgogICAgLy9zYXZlCiAgICBpbnN0YW5jZSA9IHIKCn0KCmZ1bmN0aW9uIHNlbmRNZXNzYWdlKGRhdGEpIHsKICAgIAogICAgICAgIHBhcmVudFBvcnQucG9zdE1lc3NhZ2UoZGF0YSkKICAgICAgICAKfQoKYXN5bmMgZnVuY3Rpb24gcnVuKGRhdGEpIHsKICAgIC8vIGNvbnNvbGUubG9nKCdpbm5lciB3b3JrZXIgcnVuJyxkYXRhKQoKICAgIC8vbW9kZQogICAgbGV0IG1vZGUgPSBkYXRhLm1vZGUKCiAgICAvL2NoZWNrCiAgICBpZihtb2RlICE9PSAnaW5pdCcgJiYgbW9kZSAhPT0gJ2NhbGwnKXsKICAgICAgICByZXR1cm4KICAgIH0KCiAgICAvL2luaXQKICAgIGlmKG1vZGUgPT09ICdpbml0Jyl7CiAgICAgICAgCiAgICAgICAgdHJ5ewoKICAgICAgICAgICAgLy90eXBlCiAgICAgICAgICAgIGxldCB0eXBlID0gZGF0YS50eXBlCgogICAgICAgICAgICAvL2lucHV0CiAgICAgICAgICAgIGxldCBpbnB1dCA9IGRhdGEuaW5wdXQKICAgIAogICAgICAgICAgICAvL2luc3RhbmNlCiAgICAgICAgICAgIGlmKHR5cGUgPT09ICdmdW5jdGlvbicpewogICAgICAgICAgICAgICAgaW5pdCguLi5pbnB1dCkKICAgICAgICAgICAgfQogICAgICAgICAgICBlbHNlIGlmKHR5cGUgPT09ICdvYmplY3QnKXsKICAgICAgICAgICAgICAgIGluc3RhbmNlID0gV1B1YnN1YkNsaWVudAogICAgICAgICAgICB9CgogICAgICAgIH0KICAgICAgICBjYXRjaChlcnIpewogICAgICAgIAogICAgICAgICAgICAvL3NlbmRNZXNzYWdlCiAgICAgICAgICAgIGxldCByZXMgPSB7CiAgICAgICAgICAgICAgICBtb2RlOiAnZW1pdCcsCiAgICAgICAgICAgICAgICBldk5hbWU6ICdlcnJvcicsCiAgICAgICAgICAgICAgICBtc2c6IGVyciwKICAgICAgICAgICAgfQogICAgICAgICAgICBzZW5kTWVzc2FnZShyZXMpCgogICAgICAgIH0KICAgICAgICAgICAgCiAgICB9CgogICAgLy9jaGVjawogICAgaWYobW9kZSA9PT0gJ2NhbGwnKXsKICAgICAgICBsZXQgc3RhdGUgPSAnJwogICAgICAgIGxldCBtc2cgPSBudWxsCgogICAgICAgIHRyeXsKCiAgICAgICAgICAgIC8vZnVuCiAgICAgICAgICAgIGxldCBmdW4gPSBpbnN0YW5jZVtkYXRhLmZ1bl0KCiAgICAgICAgICAgIC8vaW5wdXQKICAgICAgICAgICAgbGV0IGlucHV0ID0gZGF0YS5pbnB1dAoKICAgICAgICAgICAgLy9leGVjCiAgICAgICAgICAgIGF3YWl0IGZ1biguLi5pbnB1dCkKICAgICAgICAgICAgICAgIC50aGVuKChzdWMpID0+IHsKICAgICAgICAgICAgICAgICAgICBzdGF0ZT0nc3VjY2VzcycKICAgICAgICAgICAgICAgICAgICBtc2c9c3VjCiAgICAgICAgICAgICAgICB9KQogICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHsKICAgICAgICAgICAgICAgICAgICBzdGF0ZT0nZXJyb3InCiAgICAgICAgICAgICAgICAgICAgbXNnPWVycgogICAgICAgICAgICAgICAgfSkKCiAgICAgICAgfQogICAgICAgIGNhdGNoKGVycil7CiAgICAgICAgICAgIHN0YXRlID0gJ2Vycm9yJwogICAgICAgICAgICBtc2cgPSBlcnIKICAgICAgICB9CiAgICAgICAgCiAgICAgICAgLy9zZW5kTWVzc2FnZQogICAgICAgIGxldCByZXMgPSB7CiAgICAgICAgICAgIG1vZGU6ICdyZXR1cm4nLAogICAgICAgICAgICBpZDogZGF0YS5pZCwKICAgICAgICAgICAgZnVuOiBkYXRhLmZ1biwKICAgICAgICAgICAgc3RhdGUsCiAgICAgICAgICAgIG1zZywKICAgICAgICB9CiAgICAgICAgc2VuZE1lc3NhZ2UocmVzKQoKICAgIH0KCn0KCmZ1bmN0aW9uIHJlY3ZNZXNzYWdlKGRhdGEpIHsKICAgIC8vIGNvbnNvbGUubG9nKCdpbm5lciB3b3JrZXIgcmVjdjonLCBkYXRhKQoKICAgIC8vZGF0YVJlY3YKICAgIGxldCBkYXRhUmVjdiA9IGRhdGEKCiAgICAvL3J1bgogICAgcnVuKGRhdGFSZWN2KQoKfQoKCiAgICAgICAgcGFyZW50UG9ydC5vbignbWVzc2FnZScsIHJlY3ZNZXNzYWdlKQogICAgICAgIAoKdHJ5ewoKICAgIC8v5YOF5LuldW5jYXVnaHRFeGNlcHRpb25Nb25pdG9y6KiY6YyELCDkuI3lj6/oqLvlhop1bmNhdWdodEV4Y2VwdGlvbuiIh3VuaGFuZGxlZFJlamVjdGlvbuebo+iBvToKICAgIC8v5pa8d29ya2Vy5YWn6Ki75YaK5q2k5LqM55uj6IG95pyD6Zi75q2iTm9kZemgkOioreeahHdvcmtlcue1guatouihjOeCuiwg5L2/d29ya2Vy5bSp5r2w5b6M5LuN5a2Y5rS756m66L2JLAogICAgLy/lpJblsaTmlLbkuI3liLBlcnJvci9leGl05LqL5Lu2LCBwZW5kaW5nIHByb21pc2XmsLjkuYXmh7jnva4sIOS4lOWtmOa0u+aureWxjXdvcmtlcuacg+S7pOWuv+S4u+eoi+W6j+eEoeazlemAgOWHujsKICAgIC8v56e76Zmk5b6Md29ya2Vy5L6d6aCQ6Kit6KGM54K65q275LqhLCBlcnJvcuS6i+S7tuWCs+iHs+WkluWxpCwg55Sx5aSW5bGk5pW05om5cmVqZWN0IHBlbmRpbmcKICAgIC8vIHByb2Nlc3Mub24oJ3VuaGFuZGxlZFJlamVjdGlvbicsIChlcnIpID0+IHsKICAgIC8vICAgICBjb25zb2xlLmxvZygnaW5uZXI6dW5oYW5kbGVkUmVqZWN0aW9uJywgZXJyKQogICAgLy8gfSkKICAgIC8vIHByb2Nlc3Mub24oJ3VuY2F1Z2h0RXhjZXB0aW9uJywgKGVycikgPT4gewogICAgLy8gICAgIGNvbnNvbGUubG9nKCdpbm5lcjp1bmNhdWdodEV4Y2VwdGlvbicsIGVycikKICAgIC8vIH0pCiAgICBwcm9jZXNzLm9uKCd1bmNhdWdodEV4Y2VwdGlvbk1vbml0b3InLCAoZXJyKSA9PiB7CiAgICAgICAgY29uc29sZS5sb2coJ2lubmVyOnVuY2F1Z2h0RXhjZXB0aW9uTW9uaXRvcicsIGVycikKICAgIH0pCgp9CmNhdGNoKGVycil7fQoK`;

	      //code
	      let code = b642str(codeB64);
	      function wrapWorker() {
	        //evem
	        let ev = evem();

	        //pendings, 呼叫中promise登記表; bDead, worker已死標記(死後呼叫立即reject); bTerminated, 由terminate()主動中止標記(exit事件不視為異常)
	        let pendings = {};
	        let bDead = false;
	        let bTerminated = false;
	        function emitError(err) {
	          //先整批reject pending: 錯誤發生時呼叫端不得永久懸置(pending promise之settle僅靠worker回傳return訊息, worker崩潰即永無回音)
	          for (let id in pendings) {
	            let pm = pendings[id];
	            delete pendings[id];
	            ev.removeAllListeners(id); //清除genOuterWebWorkerCodeFun內對應once監聽, 避免監聽器殘留
	            pm.reject(err);
	          }
	          ev.emit('error', err);
	        }
	        function emitFatal(err) {
	          //致命錯誤: worker已無法再服務(崩潰,異常退出,建立失敗), 標記死亡使後續呼叫立即reject; 已標記則不重複發送
	          if (bDead) {
	            return;
	          }
	          bDead = true;
	          emitError(err);
	        }
	        function genWorker(code) {
	          //new Worker
	          try {
	            return new worker_threads.Worker(code, {
	              eval: true
	            });
	          } catch (err) {
	            emitFatal(err);
	          }
	        }

	        //genWorker
	        let wk = genWorker(code);

	        //check, 於瀏覽器端可能會遭遇IE11安全性問題, 或被CSP的worker-src或script-src設定阻擋
	        if (!wk) {
	          emitFatal('invalid worker');
	          return null;
	        }
	        function terminate() {
	          if (wk) {
	            bTerminated = true; //先標記再中止, 使exit事件不被視為異常
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

	          //check, worker已死(崩潰或異常退出)後之呼叫立即reject, 不得懸置
	          if (bDead) {
	            pm.reject('worker is dead');
	            return pm;
	          }

	          //id
	          let id = genID();

	          //pendings, 登記pending promise, 供worker崩潰或異常退出時整批reject
	          pendings[id] = pm;

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
	            delete pendings[id];
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

	          //check, worker已死(崩潰或異常退出)後之呼叫立即reject, 不得懸置
	          if (bDead) {
	            pm.reject('worker is dead');
	            return pm;
	          }

	          //id
	          let id = genID();

	          //pendings, 登記pending promise, 供worker崩潰或異常退出時整批reject
	          pendings[id] = pm;

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
	            delete pendings[id];
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

	          //check, worker已死(崩潰或異常退出)後之呼叫立即reject, 不得懸置
	          if (bDead) {
	            pm.reject('worker is dead');
	            return pm;
	          }

	          //id
	          let id = genID();

	          //pendings, 登記pending promise, 供worker崩潰或異常退出時整批reject
	          pendings[id] = pm;

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
	            delete pendings[id];
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

	          //check, worker已死(崩潰或異常退出)後之呼叫立即reject, 不得懸置
	          if (bDead) {
	            pm.reject('worker is dead');
	            return pm;
	          }

	          //id
	          let id = genID();

	          //pendings, 登記pending promise, 供worker崩潰或異常退出時整批reject
	          pendings[id] = pm;

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
	            delete pendings[id];
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

	        //bind emitFatal

	        wk.on('error', emitFatal);

	        //bind emitFatal(nodejs exit)或emitError(browser messageerror) for special condition

	        wk.on('exit', code => {
	          //worker停止(崩潰後exit code 1, 或worker內process.exit之任意code): 凡非由terminate()主動中止一律視為異常,
	          //標記死亡並整批reject pending; 崩潰時error事件先行已標記死亡, 此處emitFatal因bDead為true而不重複發送
	          if (!bTerminated) {
	            emitFatal('worker exit, code[' + code + ']');
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
	      //此段為outer層程式碼, 運行於引用打包產物之宿主(app)主程序, 不可註冊uncaughtException與unhandledRejection監聽:
	      //註冊後宿主整個程序的未捕捉錯誤都會被改成[只印log不終止], 覆蓋Node預設的崩潰行為,
	      //等於函式庫劫持了所有下游app的全域錯誤語意, 錯誤被靜默吞掉難以察覺;
	      //與inner層worker內移除同名監聽屬同族修正(inner層吞噬會阻止worker死亡, 使外層收不到error/exit而令pending懸置),
	      //故僅保留uncaughtExceptionMonitor, 其只觀測記錄, 不影響預設終止行為
	      // process.on('unhandledRejection', (err) => {
	      //     console.log('outer:unhandledRejection', err)
	      // })
	      // process.on('uncaughtException', (err) => {
	      //     console.log('outer:uncaughtException', err)
	      // })
	      process.on('uncaughtExceptionMonitor', err => {
	        console.log('outer:uncaughtExceptionMonitor', err);
	      });
	    } catch (err) {}
	    var ww$1 = ww;
	    return ww$1;
	  });
	})(tempLZsi9uOmuqW3l5OHCy2HWtsywCUo9SJrNw);
	var tempLZsi9uOmuqW3l5OHCy2HWtsywCUo9SJrNwExports = tempLZsi9uOmuqW3l5OHCy2HWtsywCUo9SJrNw.exports;
	var nw = /*@__PURE__*/getDefaultExportFromCjs(tempLZsi9uOmuqW3l5OHCy2HWtsywCUo9SJrNwExports);

	return nw;

}));
