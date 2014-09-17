/**
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
 *
 * @version 1.0.2
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */

/*jslint browser:true, node:true*/
/*global define, Event, Node*/


/**
 * Instantiate fast-clicking listeners on the specified layer.
 *
 * @constructor
 * @param {Element} layer The layer to listen on
 * @param {Object} options The options to override the defaults
 */
function FastClick(layer, options) {
	'use strict';
	var oldOnClick;

	options = options || {};

	/**
	 * Whether a click is currently being tracked.
	 *
	 * @type boolean
	 */
	this.trackingClick = false;


	/**
	 * Timestamp for when click tracking started.
	 *
	 * @type number
	 */
	this.trackingClickStart = 0;


	/**
	 * The element being tracked for a click.
	 *
	 * @type EventTarget
	 */
	this.targetElement = null;


	/**
	 * X-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartX = 0;


	/**
	 * Y-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartY = 0;


	/**
	 * ID of the last touch, retrieved from Touch.identifier.
	 *
	 * @type number
	 */
	this.lastTouchIdentifier = 0;


	/**
	 * Touchmove boundary, beyond which a click will be cancelled.
	 *
	 * @type number
	 */
	this.touchBoundary = options.touchBoundary || 10;


	/**
	 * The FastClick layer.
	 *
	 * @type Element
	 */
	this.layer = layer;

	/**
	 * The minimum time between tap(touchstart and touchend) events
	 *
	 * @type number
	 */
	this.tapDelay = options.tapDelay || 200;

	if (FastClick.notNeeded(layer)) {
		return;
	}

	// Some old versions of Android don't have Function.prototype.bind
	function bind(method, context) {
		return function() { return method.apply(context, arguments); };
	}


	var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
	var context = this;
	for (var i = 0, l = methods.length; i < l; i++) {
		context[methods[i]] = bind(context[methods[i]], context);
	}

	// Set up event handlers as required
	if (deviceIsAndroid) {
		layer.addEventListener('mouseover', this.onMouse, true);
		layer.addEventListener('mousedown', this.onMouse, true);
		layer.addEventListener('mouseup', this.onMouse, true);
	}

	layer.addEventListener('click', this.onClick, true);
	layer.addEventListener('touchstart', this.onTouchStart, false);
	layer.addEventListener('touchmove', this.onTouchMove, false);
	layer.addEventListener('touchend', this.onTouchEnd, false);
	layer.addEventListener('touchcancel', this.onTouchCancel, false);

	// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
	// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
	// layer when they are cancelled.
	if (!Event.prototype.stopImmediatePropagation) {
		layer.removeEventListener = function(type, callback, capture) {
			var rmv = Node.prototype.removeEventListener;
			if (type === 'click') {
				rmv.call(layer, type, callback.hijacked || callback, capture);
			} else {
				rmv.call(layer, type, callback, capture);
			}
		};

		layer.addEventListener = function(type, callback, capture) {
			var adv = Node.prototype.addEventListener;
			if (type === 'click') {
				adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
					if (!event.propagationStopped) {
						callback(event);
					}
				}), capture);
			} else {
				adv.call(layer, type, callback, capture);
			}
		};
	}

	// If a handler is already declared in the element's onclick attribute, it will be fired before
	// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
	// adding it as listener.
	if (typeof layer.onclick === 'function') {

		// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
		// - the old one won't work if passed to addEventListener directly.
		oldOnClick = layer.onclick;
		layer.addEventListener('click', function(event) {
			oldOnClick(event);
		}, false);
		layer.onclick = null;
	}
}


/**
 * Android requires exceptions.
 *
 * @type boolean
 */
var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;


/**
 * iOS requires exceptions.
 *
 * @type boolean
 */
var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);


/**
 * iOS 4 requires an exception for select elements.
 *
 * @type boolean
 */
var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


/**
 * iOS 6.0(+?) requires the target element to be manually derived
 *
 * @type boolean
 */
var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);


/**
 * Determine whether a given element requires a native click.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element needs a native click
 */
FastClick.prototype.needsClick = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {

	// Don't send a synthetic click to disabled inputs (issue #62)
	case 'button':
	case 'select':
	case 'textarea':
		if (target.disabled) {
			return true;
		}

		break;
	case 'input':

		// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
		if ((deviceIsIOS && target.type === 'file') || target.disabled) {
			return true;
		}

		break;
	case 'label':
	case 'video':
		return true;
	}

	return (/\bneedsclick\b/).test(target.className);
};


/**
 * Determine whether a given element requires a call to focus to simulate click into element.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
 */
FastClick.prototype.needsFocus = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {
	case 'textarea':
		return true;
	case 'select':
		return !deviceIsAndroid;
	case 'input':
		switch (target.type) {
		case 'button':
		case 'checkbox':
		case 'file':
		case 'image':
		case 'radio':
		case 'submit':
			return false;
		}

		// No point in attempting to focus disabled inputs
		return !target.disabled && !target.readOnly;
	default:
		return (/\bneedsfocus\b/).test(target.className);
	}
};


/**
 * Send a click event to the specified element.
 *
 * @param {EventTarget|Element} targetElement
 * @param {Event} event
 */
FastClick.prototype.sendClick = function(targetElement, event) {
	'use strict';
	var clickEvent, touch;

	// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
	if (document.activeElement && document.activeElement !== targetElement) {
		document.activeElement.blur();
	}

	touch = event.changedTouches[0];

	// Synthesise a click event, with an extra attribute so it can be tracked
	clickEvent = document.createEvent('MouseEvents');
	clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
	clickEvent.forwardedTouchEvent = true;
	targetElement.dispatchEvent(clickEvent);
};

FastClick.prototype.determineEventType = function(targetElement) {
	'use strict';

	//Issue #159: Android Chrome Select Box does not open with a synthetic click event
	if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
		return 'mousedown';
	}

	return 'click';
};


/**
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.focus = function(targetElement) {
	'use strict';
	var length;

	// Issue #160: on iOS 7, some input elements (e.g. date datetime) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
	if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time') {
		length = targetElement.value.length;
		targetElement.setSelectionRange(length, length);
	} else {
		targetElement.focus();
	}
};


/**
 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
 *
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.updateScrollParent = function(targetElement) {
	'use strict';
	var scrollParent, parentElement;

	scrollParent = targetElement.fastClickScrollParent;

	// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
	// target element was moved to another parent.
	if (!scrollParent || !scrollParent.contains(targetElement)) {
		parentElement = targetElement;
		do {
			if (parentElement.scrollHeight > parentElement.offsetHeight) {
				scrollParent = parentElement;
				targetElement.fastClickScrollParent = parentElement;
				break;
			}

			parentElement = parentElement.parentElement;
		} while (parentElement);
	}

	// Always update the scroll top tracker if possible.
	if (scrollParent) {
		scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
	}
};


/**
 * @param {EventTarget} targetElement
 * @returns {Element|EventTarget}
 */
FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
	'use strict';

	// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
	if (eventTarget.nodeType === Node.TEXT_NODE) {
		return eventTarget.parentNode;
	}

	return eventTarget;
};


/**
 * On touch start, record the position and scroll offset.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchStart = function(event) {
	'use strict';
	var targetElement, touch, selection;

	// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
	if (event.targetTouches.length > 1) {
		return true;
	}

	targetElement = this.getTargetElementFromEventTarget(event.target);
	touch = event.targetTouches[0];

	if (deviceIsIOS) {

		// Only trusted events will deselect text on iOS (issue #49)
		selection = window.getSelection();
		if (selection.rangeCount && !selection.isCollapsed) {
			return true;
		}

		if (!deviceIsIOS4) {

			// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
			// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
			// with the same identifier as the touch event that previously triggered the click that triggered the alert.
			// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
			// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
			if (touch.identifier === this.lastTouchIdentifier) {
				event.preventDefault();
				return false;
			}

			this.lastTouchIdentifier = touch.identifier;

			// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
			// 1) the user does a fling scroll on the scrollable layer
			// 2) the user stops the fling scroll with another tap
			// then the event.target of the last 'touchend' event will be the element that was under the user's finger
			// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
			// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
			this.updateScrollParent(targetElement);
		}
	}

	this.trackingClick = true;
	this.trackingClickStart = event.timeStamp;
	this.targetElement = targetElement;

	this.touchStartX = touch.pageX;
	this.touchStartY = touch.pageY;

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
		event.preventDefault();
	}

	return true;
};


/**
 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.touchHasMoved = function(event) {
	'use strict';
	var touch = event.changedTouches[0], boundary = this.touchBoundary;

	if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
		return true;
	}

	return false;
};


/**
 * Update the last position.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchMove = function(event) {
	'use strict';
	if (!this.trackingClick) {
		return true;
	}

	// If the touch has moved, cancel the click tracking
	if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
		this.trackingClick = false;
		this.targetElement = null;
	}

	return true;
};


/**
 * Attempt to find the labelled control for the given label element.
 *
 * @param {EventTarget|HTMLLabelElement} labelElement
 * @returns {Element|null}
 */
FastClick.prototype.findControl = function(labelElement) {
	'use strict';

	// Fast path for newer browsers supporting the HTML5 control attribute
	if (labelElement.control !== undefined) {
		return labelElement.control;
	}

	// All browsers under test that support touch events also support the HTML5 htmlFor attribute
	if (labelElement.htmlFor) {
		return document.getElementById(labelElement.htmlFor);
	}

	// If no for attribute exists, attempt to retrieve the first labellable descendant element
	// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
	return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
};


/**
 * On touch end, determine whether to send a click event at once.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchEnd = function(event) {
	'use strict';
	var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

	if (!this.trackingClick) {
		return true;
	}

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
		this.cancelNextClick = true;
		return true;
	}

	// Reset to prevent wrong click cancel on input (issue #156).
	this.cancelNextClick = false;

	this.lastClickTime = event.timeStamp;

	trackingClickStart = this.trackingClickStart;
	this.trackingClick = false;
	this.trackingClickStart = 0;

	// On some iOS devices, the targetElement supplied with the event is invalid if the layer
	// is performing a transition or scroll, and has to be re-detected manually. Note that
	// for this to function correctly, it must be called *after* the event target is checked!
	// See issue #57; also filed as rdar://13048589 .
	if (deviceIsIOSWithBadTarget) {
		touch = event.changedTouches[0];

		// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
		targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
		targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
	}

	targetTagName = targetElement.tagName.toLowerCase();
	if (targetTagName === 'label') {
		forElement = this.findControl(targetElement);
		if (forElement) {
			this.focus(targetElement);
			if (deviceIsAndroid) {
				return false;
			}

			targetElement = forElement;
		}
	} else if (this.needsFocus(targetElement)) {

		// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
		// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
		if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
			this.targetElement = null;
			return false;
		}

		this.focus(targetElement);
		this.sendClick(targetElement, event);

		// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
		// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
		if (!deviceIsIOS || targetTagName !== 'select') {
			this.targetElement = null;
			event.preventDefault();
		}

		return false;
	}

	if (deviceIsIOS && !deviceIsIOS4) {

		// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
		// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
		scrollParent = targetElement.fastClickScrollParent;
		if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
			return true;
		}
	}

	// Prevent the actual click from going though - unless the target node is marked as requiring
	// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
	if (!this.needsClick(targetElement)) {
		event.preventDefault();
		this.sendClick(targetElement, event);
	}

	return false;
};


/**
 * On touch cancel, stop tracking the click.
 *
 * @returns {void}
 */
FastClick.prototype.onTouchCancel = function() {
	'use strict';
	this.trackingClick = false;
	this.targetElement = null;
};


/**
 * Determine mouse events which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onMouse = function(event) {
	'use strict';

	// If a target element was never set (because a touch event was never fired) allow the event
	if (!this.targetElement) {
		return true;
	}

	if (event.forwardedTouchEvent) {
		return true;
	}

	// Programmatically generated events targeting a specific element should be permitted
	if (!event.cancelable) {
		return true;
	}

	// Derive and check the target element to see whether the mouse event needs to be permitted;
	// unless explicitly enabled, prevent non-touch click events from triggering actions,
	// to prevent ghost/doubleclicks.
	if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

		// Prevent any user-added listeners declared on FastClick element from being fired.
		if (event.stopImmediatePropagation) {
			event.stopImmediatePropagation();
		} else {

			// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
			event.propagationStopped = true;
		}

		// Cancel the event
		event.stopPropagation();
		event.preventDefault();

		return false;
	}

	// If the mouse event is permitted, return true for the action to go through.
	return true;
};


/**
 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
 * an actual click which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onClick = function(event) {
	'use strict';
	var permitted;

	// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
	if (this.trackingClick) {
		this.targetElement = null;
		this.trackingClick = false;
		return true;
	}

	// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
	if (event.target.type === 'submit' && event.detail === 0) {
		return true;
	}

	permitted = this.onMouse(event);

	// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
	if (!permitted) {
		this.targetElement = null;
	}

	// If clicks are permitted, return true for the action to go through.
	return permitted;
};


/**
 * Remove all FastClick's event listeners.
 *
 * @returns {void}
 */
FastClick.prototype.destroy = function() {
	'use strict';
	var layer = this.layer;

	if (deviceIsAndroid) {
		layer.removeEventListener('mouseover', this.onMouse, true);
		layer.removeEventListener('mousedown', this.onMouse, true);
		layer.removeEventListener('mouseup', this.onMouse, true);
	}

	layer.removeEventListener('click', this.onClick, true);
	layer.removeEventListener('touchstart', this.onTouchStart, false);
	layer.removeEventListener('touchmove', this.onTouchMove, false);
	layer.removeEventListener('touchend', this.onTouchEnd, false);
	layer.removeEventListener('touchcancel', this.onTouchCancel, false);
};


/**
 * Check whether FastClick is needed.
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.notNeeded = function(layer) {
	'use strict';
	var metaViewport;
	var chromeVersion;

	// Devices that don't support touch don't need FastClick
	if (typeof window.ontouchstart === 'undefined') {
		return true;
	}

	// Chrome version - zero for other browsers
	chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

	if (chromeVersion) {

		if (deviceIsAndroid) {
			metaViewport = document.querySelector('meta[name=viewport]');

			if (metaViewport) {
				// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
				if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
					return true;
				}
				// Chrome 32 and above with width=device-width or less don't need FastClick
				if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
					return true;
				}
			}

		// Chrome desktop doesn't need FastClick (issue #15)
		} else {
			return true;
		}
	}

	// IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
	if (layer.style.msTouchAction === 'none') {
		return true;
	}

	return false;
};


/**
 * Factory method for creating a FastClick object
 *
 * @param {Element} layer The layer to listen on
 * @param {Object} options The options to override the defaults
 */
FastClick.attach = function(layer, options) {
	'use strict';
	return new FastClick(layer, options);
};


if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {

	// AMD. Register as an anonymous module.
	define(function() {
		'use strict';
		return FastClick;
	});
} else if (typeof module !== 'undefined' && module.exports) {
	module.exports = FastClick.attach;
	module.exports.FastClick = FastClick;
} else {
	window.FastClick = FastClick;
}
;/*http://sachinchoolur.github.io/lightGallery*/
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('!2(e){"4s 4p";e.4k.7=2(i){4 a,l,t,n,s,o,d,r,c,h,u,v,f,p={X:"k",3n:!0,1b:"4d",U:4a,3l:!0,1m:!1,1B:!1,3k:47,M:1,3g:!0,1g:!1,3f:{3e:"3W 3V"},1r:!1,15:!1,Y:!0,1D:!1,3d:!1,19:!1,1q:!1,1M:!0,33:!1,1P:!1,32:3B,30:2Z,2Y:"3v",1z:!0,2X:4m,11:!1,W:[],2T:2(){},2S:2(){},2R:2(){},2a:2(){},2P:2(){},2O:2(){},2M:2(){}},m=e(3),g=!1,C=\'<6 L="7-2F"><6 L="7-2C"><6 L="7-25"></6><a L="7-1p" j="1p"></a></6></6>\',y=2y 0!==2x.3s||"4n"1T 18||"49"1T 18||2s.3E,b=!1,S=!1,w=!1,x=e.3x(!0,{},p,i),G={1h:2(){m.28(2(){4 i=e(3);1==x.11?(a=x.W,l=0,c=l,q.1h(l)):(a=e(3).1L(),a.13(2(t){B(1==x.1g&&i.12("1g")){4 n=i.12("1g");a=e(\'[12-1g="\'+n+\'"]\').1L()}10 a=i.1L();t.1i(),t.1x(),l=a.15(3),c=l,q.1h(l)}))})}},q={1h:2(){3.2p(),3.2n()},2p:2(){3.2l(),3.2k(),3.2i()},2n:2(){3.2h(),3.2g(),3.2f(),3.1q(),3.2d(),3.2c(),3.2b(),3.k(x.15?x.15:l),3.2J(),3.2Q(),26(2(){t.8("3u")},2Z)},2l:2(){e("1f").O(C).8("7"),n=e("#7-2F"),t=e("#7-2C"),s=t.D("#7-25");4 i="";B(1==x.11)J(4 l=0;l<x.W.9;l++)i+=\'<6 j="7-k"></6>\';10 a.28(2(){i+=\'<6 j="7-k"></6>\'});s.O(i),o=t.D(".7-k")},2i:2(){4 i=3;x.3l&&e(".7-k").Z("13",2(a){4l.3t(a.2e),e(a.2e).4j(".7-k")&&i.1F()}),e("#7-1p").Q("13 1a",2(){i.1F()})},2k:2(){4 i=2(){v=e(18).1C()};e(18).Q("2j.7",i())},F:2(){4 e=2(){J(4 e=["1Z","3w","3y","3z","3I","4g"],i=2x.4h,a=0;a<e.9;a++)B(e[a]1T i.2m)1j!0};1j x.3n&&e()?!0:!1},2Q:2(){4 i=3;B(y){4 a={},l={};e("1f").Z("2o.7",2(e){l=e.1y.1I[0],a.1e=e.1y.1I[0].1e,a.2q=e.1y.1I[0].2q}),e("1f").Z("2r.7",2(e){4 i=e.1y;l=i.1I[0],e.1i()}),e("1f").Z("1a.7",2(){4 e=l.1e-a.1e,t=x.30;e>=t?(i.I(),R(f)):-t>=e&&(i.H(),R(f))})}},2J:2(){4 i,a,l=3;e(".7").Q("2t",2(e){e.1x(),e.1i(),i=e.1e}),e(".7").Q("2u",2(e){e.1x(),e.1i(),a=e.1e,a-i>20?l.I():i-a>20&&l.H()})},2v:2(e){4 i=e.1n(/\\/\\/(?:1o\\.)?2w(?:\\.1K|1K\\.1d)\\/(?:2z\\?v=|1O\\/)?([a-2A-2B\\-]+)/i),a=e.1n(/\\/\\/(?:1o\\.)?24.1d\\/([0-2D-z\\-2E]+)/i);1j i||a?!0:2y 0},23:2(e,i){4 a=e.1n(/\\/\\/(?:1o\\.)?2w(?:\\.1K|1K\\.1d)\\/(?:2z\\?v=|1O\\/)?([a-2A-2B\\-]+)/i),l=e.1n(/\\/\\/(?:1o\\.)?24.1d\\/([0-2D-z\\-2E]+)/i),t="",n="";1j a?(n=x.1z===!0&&g===!1?"?2G=1&1g=0&2H=2I":"?2H=2I",t=\'<17 L="1s\'+i+\'" 1C="29" 2K="2L" T="//1o.3C.1d/1O/\'+a[1]+n+\'" 2N="0" 3G></17>\'):l&&(n=x.1z===!0&&g===!1?"2G=1&1U;":"",t=\'<17 L="1s\'+i+\'" 1C="29" 2K="2L"  T="3J://3K.24.1d/1s/\'+l[1]+"?"+n+"3R=0&1U;3T=0&1U;3U="+x.2Y+\'" 2N="0" 3X 3Y 3Z></17>\'),\'<6 j="43" 2m="44-1C:\'+x.2X+\'46 !48;"><6 j="1s">\'+t+"</6></6>"},P:2(e,i){{4 l,t=3;a.9-e}B(x.M>a.9&&(x.M=a.9),l=x.1P===!0&&v<=x.32?1==x.11?x.W[e].1P:a.5(e).V("12-4i-T"):1==x.11?x.W[e].T:a.5(e).V("12-T"),t.2v(l)){B(o.5(e).K("1v")||(i===!1&&g===!0&&0===x.M?26(2(){o.5(e).1w(t.23(l,e))},x.U):o.5(e).1w(t.23(l,e)),o.5(e).8("1v"),x.1B&&x.1z===!0&&R(f)),i===!1){4 n=!1;B(o.5(e).D("17")[0].2U&&(n=!0),n){J(4 s=e,d=0;d<=x.M;d++)t.P(s+d,!0);J(4 r=0;r<=x.M;r++)t.P(s-r,!0)}10 o.5(e).D("17").Z("2V 2W",2(){J(4 i=e,l=0;l<=x.M&&!(l>=a.9-e);l++)t.P(i+l,!0);J(4 n=0;n<=x.M;n++)t.P(i-n,!0)})}}10 B(o.5(e).K("1v")||(o.5(e).1w(\'<1c T="\'+l+\'" />\'),o.5(e).8("1v")),i===!1){4 n=!1;B(o.5(e).D("1c")[0].2U&&(n=!0),n){J(4 s=e,d=0;d<=x.M&&!(d>=a.9-e);d++)t.P(s+d,!0);J(4 r=0;r<=x.M&&!(0>s-r);r++)t.P(s-r,!0)}10 o.5(e).D("1c").Z("2V 2W",2(){J(4 i=e,l=0;l<=x.M&&!(l>=a.9-e);l++)t.P(i+l,!0);J(4 n=0;n<=x.M&&!(0>i-n);n++)t.P(i-n,!0)})}},2g:2(){B(x.1D===!0){4 e,i=!1;J(e=0;e<a.9;e++)B(i=1==x.11?x.W[e].1D:a.5(e).V("12-1X"),("1E"==1G i||1H==i)&&(i="31 "+e),x.3d===!0){4 l=a.5(e).V("12-3A");l="1E"!=1G l&&""!==l?l:"#",o.5(e).O(\'<6 j="1u 1Q"><a 3D="\'+l+\'" j="1X">\'+i+"</a></6>")}10 o.5(e).O(\'<6 j="1u 1Q"><E j="1X">\'+i+"</E></6>")}},2f:2(){B(x.19===!0){4 e,i=!1;J(e=0;e<a.9;e++)i=1==x.11?x.W[e].19:a.5(e).V("12-19"),("1E"==1G i||1H==i)&&(i="31 "+e),x.1D===!1?o.5(e).O(\'<6 j="1u 1Q"><E j="19">\'+i+"</E></6>"):o.5(e).D(".1u").O(\'<E j="19">\'+i+"</E>")}},1q:2(){B(x.1q===!0){4 i=e("#7-25 > 6").9;t.O("<6 L=\'3F\'><E L=\'34\'></E> / <E L=\'3H\'>"+i+"</E></6>")}},2c:2(){B(x.Y===!0&&a.9>1){4 i=3;t.O(\'<6 j="35"><6 j="36"><E j="1p 3a"><i j="3L-3M-3N-16" 3O-3P="3Q"></i></E></6><6 j="3b"></6></6>\'),h=t.D(".35"),d.3S(\'<a j="3c"></a>\'),t.D(".3c").Q("13 1a",2(){h.8("N"),i.F()&&"k"===x.X&&(o.5(l).1R().A("H").8("I"),o.5(l).22().A("I").8("H"))}),t.D(".1p").Q("13 1a",2(){h.A("N")});4 n,s=t.D(".36"),r=t.D(".3b"),c="";B(1==x.11)J(4 v=0;v<x.W.9;v++)n=x.W[v].1A,c+=\'<6 j="1A"><1c T="\'+n+\'" /></6>\';10 a.28(2(){n=x.1r===!1||"1E"==1G e(3).V(x.1r)||1H==e(3).V(x.1r)?e(3).D("1c").V("T"):e(3).V(x.1r),c+=\'<6 j="1A"><1c T="\'+n+\'" /></6>\'});r.O(c),u=r.D(".1A"),u.Q("13 1a",2(){b=!0;4 a=e(3).15();u.A("1t"),e(3).8("1t"),i.k(a),R(f)}),s.1w(\'<E j="3a 41">\'+x.3f.3e+" ("+u.9+")</E>")}},2d:2(){4 e=3;x.1M===!0&&a.9>1&&(t.O(\'<6 L="7-42"><a L="7-3h"></a><a L="7-3i"></a></6>\'),d=t.D("#7-3h"),r=t.D("#7-3i"),d.Q("13",2(){e.I(),R(f)}),r.Q("13",2(){e.H(),R(f)}))},2h:2(){4 e=3;x.1B===!0&&(f=45(2(){l=l+1<a.9?l:-1,l++,e.k(l)},x.3k))},2b:2(){4 i=3;e(18).Q("3j.7",2(e){e.1i(),e.1x(),37===e.1k&&(i.I(),R(f)),38===e.1k&&x.Y===!0?h.K("N")||(i.F()&&"k"===x.X&&(o.5(l).1R().A("H").8("I"),o.5(l).22().A("I").8("H")),h.8("N")):39===e.1k&&(i.H(),R(f)),40===e.1k&&x.Y===!0?h.K("N")&&h.A("N"):x.3g===!0&&27===e.1k&&(x.Y===!0&&h.K("N")?h.A("N"):i.1F())})},H:2(){4 e=3;l=o.15(o.5(c)),l+1<a.9?(l++,e.k(l)):x.1m?(l=0,e.k(l)):"1S"===x.X&&x.Y===!0&&a.9>1&&h.8("N"),x.2a.14(3)},I:2(){4 e=3;l=o.15(o.5(c)),l>0?(l--,e.k(l)):x.1m?(l=a.9-1,e.k(l)):"1S"===x.X&&x.Y===!0&&a.9>1&&h.8("N"),x.2P.14(3)},k:2(i){B(3.P(i,!1),g&&(s.K("Z")||s.8("Z"),3.F()&&""!==x.U&&(s.K("U")||s.8("U"),w===!1&&(s.1W("1Z-4b",x.U+"4c"),w=!0)),3.F()&&""!==x.1b&&(s.K("1N")||s.8("1N"),S===!1&&(s.1W("1Z-1N-2",x.1b),S=!0)),x.2S.14(3)),"k"===x.X){4 l=1H!=2s.4e.1n(/4f/i);!3.F()||s.K("k")||l?3.F()&&!s.K("3m")&&l&&s.8("3m"):s.8("k"),3.F()||g?!3.F()&&g&&s.1Y({3o:1J*-i+"%"},x.U,x.1b):s.1W({3o:1J*-i+"%"})}10"1S"===x.X&&(3.F()&&!s.K("21")?s.8("21"):3.F()||s.K("1Y")||s.8("1Y"),3.F()||g?!3.F()&&g&&(o.5(c).3p(x.U,x.1b),o.5(i).3q(x.U,x.1b)):(o.3p(1J),o.5(i).3q(1J)));B(i+1>=a.9&&x.1B&&x.1m===!1&&R(f),o.5(c).A("3r"),o.5(i).8("3r"),3.F()&&"k"===x.X&&(b===!1?(e(".I").A("I"),e(".H").A("H"),o.5(i-1).8("I"),o.5(i+1).8("H")):(o.5(i).1R().A("H").8("I"),o.5(i).22().A("I").8("H"))),x.Y===!0&&a.9>1&&(u.A("1t"),u.5(i).8("1t")),x.1M&&x.33&&x.1m===!1&&a.9>1){4 t=a.9;t=4o(t)-1,0===i?(d.8("1l"),r.A("1l")):i===t?(d.A("1l"),r.8("1l")):d.4q(r).A("1l")}c=i,g===!1?x.2T.14(3):x.2R.14(3),g=!0,b=!1,x.1q&&e("#34").4r(i+1)},1F:2(){x.2O.14(3),g=!1,S=!1,w=!1,b=!1,R(f),e(".7").1V("2t 2u"),e("1f").1V("2o.7 2r.7 1a.7"),e(18).1V("2j.7 3j.7"),t.8("21"),26(2(){n.4t(),e("1f").A("7")},4u),x.2M.14(3)}};1j G.1h(),3}}(4v);',62,280,'||function|this|var|eq|div|lightGallery|addClass|length||||||||||class|slide||||||||||||||||removeClass|if||find|span|doCss||nextSlide|prevSlide|for|hasClass|id|preload|open|append|loadContent|bind|clearInterval||src|speed|attr|dynamicEl|mode|thumbnail|on|else|dynamic|data|click|call|index||iframe|window|desc|touchend|easing|img|com|pageX|body|rel|init|preventDefault|return|keyCode|disabled|loop|match|www|close|counter|exThumbImage|video|active|info|loaded|prepend|stopPropagation|originalEvent|videoAutoplay|thumb|auto|width|caption|undefined|destroy|typeof|null|targetTouches|100|be|children|controls|timing|embed|mobileSrc|group|prevAll|fade|in|amp|off|css|title|animate|transition||fadeM|nextAll|loadVideo|vimeo|slider|setTimeout||each|560|onSlideNext|keyPress|buildThumbnail|slideTo|target|addDesc|addCaption|autoStart|closeSlide|resize|getWidth|structure|style|build|touchstart|start|pageY|touchmove|navigator|mousedown|mouseup|isVideo|youtu|document|void|watch|z0|9_|Gallery|9a|_|outer|autoplay|wmode|opaque|touch|height|315|onCloseAfter|frameborder|onBeforeClose|onSlidePrev|enableTouch|onSlideAfter|onSlideBefore|onOpen|complete|load|error|videoMaxWidth|vimeoColor|50|swipeThreshold|image|mobileSrcMaxWidth|hideControlOnEnd|lightGallery_counter_current|thumb_cont|thumb_info||||ib|thumb_inner|cLthumb|captionLink|allPhotos|lang|escKey|prev|next|keyup|pause|closable|useLeft|useCSS|left|fadeOut|fadeIn|current|createTouch|log|opacity|CCCCCC|MozTransition|extend|WebkitTransition|OTransition|link|640|youtube|href|msMaxTouchPoints|lightGallery_counter|allowfullscreen|lightGallery_counter_all|msTransition|http|player|bUi|iCn|rMv|aria|hidden|true|byline|after|portrait|color|photos|All|webkitAllowFullScreen|mozallowfullscreen|allowFullScreen||count|action|video_cont|max|setInterval|px|4e3|important|onmsgesturechange|1e3|duration|ms|ease|userAgent|iPad|KhtmlTransition|documentElement|responsive|is|fn|console|855|ontouchstart|parseInt|strict|add|text|use|remove|500|jQuery'.split('|'),0,{}));(function($){"use strict";$.ajaxChimp={responses:{"We have sent you a confirmation email":0,"Please enter a value":1,"An email address must contain a single @":2,"The domain portion of the email address is invalid (the portion after the @: )":3,"The username portion of the email address is invalid (the portion before the @: )":4,"This email address looks fake or invalid. Please enter a real email address":5},translations:{en:null},init:function(selector,options){$(selector).ajaxChimp(options)}};$.fn.ajaxChimp=function(options){$(this).each(function(i,elem){var form=$(elem);var email=form.find("input[type=email]");var label=form.find("label[for="+email.attr("id")+"]");var settings=$.extend({url:form.attr("action"),language:"en"},options);var url=settings.url.replace("/post?","/post-json?").concat("&c=?");form.attr("novalidate","true");email.attr("name","EMAIL");form.submit(function(){var msg;function successCallback(resp){if(resp.result==="success"){msg="We have sent you a confirmation email";label.removeClass("error").addClass("valid");email.removeClass("error").addClass("valid")}else{email.removeClass("valid").addClass("error");label.removeClass("valid").addClass("error");var index=-1;try{var parts=resp.msg.split(" - ",2);if(parts[1]===undefined){msg=resp.msg}else{var i=parseInt(parts[0],10);if(i.toString()===parts[0]){index=parts[0];msg=parts[1]}else{index=-1;msg=resp.msg}}}catch(e){index=-1;msg=resp.msg}}if(settings.language!=="en"&&$.ajaxChimp.responses[msg]!==undefined&&$.ajaxChimp.translations&&$.ajaxChimp.translations[settings.language]&&$.ajaxChimp.translations[settings.language][$.ajaxChimp.responses[msg]]){msg=$.ajaxChimp.translations[settings.language][$.ajaxChimp.responses[msg]]}label.html(msg);label.show(2e3);if(settings.callback){settings.callback(resp)}}var data={};var dataArray=form.serializeArray();$.each(dataArray,function(index,item){data[item.name]=item.value});$.ajax({url:url,data:data,success:successCallback,dataType:"jsonp",error:function(resp,text){console.log("mailchimp ajax submit error: "+text)}});var submitMsg="Submitting...";if(settings.language!=="en"&&$.ajaxChimp.translations&&$.ajaxChimp.translations[settings.language]&&$.ajaxChimp.translations[settings.language]["submit"]){submitMsg=$.ajaxChimp.translations[settings.language]["submit"]}label.html(submitMsg).show(2e3);return false})});return this}})(jQuery);;window.fbAsyncInit = function() {
  FB.init({
    appId      : '1518724951675226',
    xfbml      : true,
    version    : 'v2.0'
  });
};
(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));;/*
 * Foundation Responsive Library
 * http://foundation.zurb.com
 * Copyright 2014, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/

(function ($, window, document, undefined) {
  'use strict';

  var header_helpers = function (class_array) {
    var i = class_array.length;
    var head = $('head');

    while (i--) {
      if(head.has('.' + class_array[i]).length === 0) {
        head.append('<meta class="' + class_array[i] + '" />');
      }
    }
  };

  header_helpers([
    'foundation-mq-small',
    'foundation-mq-medium',
    'foundation-mq-large',
    'foundation-mq-xlarge',
    'foundation-mq-xxlarge',
    'foundation-data-attribute-namespace']);

  // Enable FastClick if present

  $(function() {
    if (typeof FastClick !== 'undefined') {
      // Don't attach to body if undefined
      if (typeof document.body !== 'undefined') {
        FastClick.attach(document.body);
      }
    }
  });

  // private Fast Selector wrapper,
  // returns jQuery object. Only use where
  // getElementById is not available.
  var S = function (selector, context) {
    if (typeof selector === 'string') {
      if (context) {
        var cont;
        if (context.jquery) {
          cont = context[0];
          if (!cont) return context;
        } else {
          cont = context;
        }
        return $(cont.querySelectorAll(selector));
      }

      return $(document.querySelectorAll(selector));
    }

    return $(selector, context);
  };

  // Namespace functions.

  var attr_name = function (init) {
    var arr = [];
    if (!init) arr.push('data');
    if (this.namespace.length > 0) arr.push(this.namespace);
    arr.push(this.name);

    return arr.join('-');
  };

  var add_namespace = function (str) {
    var parts = str.split('-'),
        i = parts.length,
        arr = [];

    while (i--) {
      if (i !== 0) {
        arr.push(parts[i]);
      } else {
        if (this.namespace.length > 0) {
          arr.push(this.namespace, parts[i]);
        } else {
          arr.push(parts[i]);
        }
      }
    }

    return arr.reverse().join('-');
  };

  // Event binding and data-options updating.

  var bindings = function (method, options) {
    var self = this,
        should_bind_events = !S(this).data(this.attr_name(true));


    if (S(this.scope).is('[' + this.attr_name() +']')) {
      S(this.scope).data(this.attr_name(true) + '-init', $.extend({}, this.settings, (options || method), this.data_options(S(this.scope))));

      if (should_bind_events) {
        this.events(this.scope);
      }

    } else {
      S('[' + this.attr_name() +']', this.scope).each(function () {
        var should_bind_events = !S(this).data(self.attr_name(true) + '-init');
        S(this).data(self.attr_name(true) + '-init', $.extend({}, self.settings, (options || method), self.data_options(S(this))));

        if (should_bind_events) {
          self.events(this);
        }
      });
    }
    // # Patch to fix #5043 to move this *after* the if/else clause in order for Backbone and similar frameworks to have improved control over event binding and data-options updating.
    if (typeof method === 'string') {
      return this[method].call(this, options);
    }

  };

  var single_image_loaded = function (image, callback) {
    function loaded () {
      callback(image[0]);
    }

    function bindLoad () {
      this.one('load', loaded);

      if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
        var src = this.attr( 'src' ),
            param = src.match( /\?/ ) ? '&' : '?';

        param += 'random=' + (new Date()).getTime();
        this.attr('src', src + param);
      }
    }

    if (!image.attr('src')) {
      loaded();
      return;
    }

    if (image[0].complete || image[0].readyState === 4) {
      loaded();
    } else {
      bindLoad.call(image);
    }
  };

  /*
    https://github.com/paulirish/matchMedia.js
  */

  window.matchMedia = window.matchMedia || (function( doc ) {

    "use strict";

    var bool,
        docElem = doc.documentElement,
        refNode = docElem.firstElementChild || docElem.firstChild,
        // fakeBody required for <FF4 when executed in <head>
        fakeBody = doc.createElement( "body" ),
        div = doc.createElement( "div" );

    div.id = "mq-test-1";
    div.style.cssText = "position:absolute;top:-100em";
    fakeBody.style.background = "none";
    fakeBody.appendChild(div);

    return function (q) {

      div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";

      docElem.insertBefore( fakeBody, refNode );
      bool = div.offsetWidth === 42;
      docElem.removeChild( fakeBody );

      return {
        matches: bool,
        media: q
      };

    };

  }( document ));

  /*
   * jquery.requestAnimationFrame
   * https://github.com/gnarf37/jquery-requestAnimationFrame
   * Requires jQuery 1.8+
   *
   * Copyright (c) 2012 Corey Frang
   * Licensed under the MIT license.
   */

  (function($) {

  // requestAnimationFrame polyfill adapted from Erik Möller
  // fixes from Paul Irish and Tino Zijdel
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

  var animating,
      lastTime = 0,
      vendors = ['webkit', 'moz'],
      requestAnimationFrame = window.requestAnimationFrame,
      cancelAnimationFrame = window.cancelAnimationFrame,
      jqueryFxAvailable = 'undefined' !== typeof jQuery.fx;

  for (; lastTime < vendors.length && !requestAnimationFrame; lastTime++) {
    requestAnimationFrame = window[ vendors[lastTime] + "RequestAnimationFrame" ];
    cancelAnimationFrame = cancelAnimationFrame ||
      window[ vendors[lastTime] + "CancelAnimationFrame" ] ||
      window[ vendors[lastTime] + "CancelRequestAnimationFrame" ];
  }

  function raf() {
    if (animating) {
      requestAnimationFrame(raf);

      if (jqueryFxAvailable) {
        jQuery.fx.tick();
      }
    }
  }

  if (requestAnimationFrame) {
    // use rAF
    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;

    if (jqueryFxAvailable) {
      jQuery.fx.timer = function (timer) {
        if (timer() && jQuery.timers.push(timer) && !animating) {
          animating = true;
          raf();
        }
      };

      jQuery.fx.stop = function () {
        animating = false;
      };
    }
  } else {
    // polyfill
    window.requestAnimationFrame = function (callback) {
      var currTime = new Date().getTime(),
        timeToCall = Math.max(0, 16 - (currTime - lastTime)),
        id = window.setTimeout(function () {
          callback(currTime + timeToCall);
        }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };

  }

  }( jQuery ));


  function removeQuotes (string) {
    if (typeof string === 'string' || string instanceof String) {
      string = string.replace(/^['\\/"]+|(;\s?})+|['\\/"]+$/g, '');
    }

    return string;
  }

  window.Foundation = {
    name : 'Foundation',

    version : '5.3.3',

    media_queries : {
      small : S('.foundation-mq-small').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      medium : S('.foundation-mq-medium').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      large : S('.foundation-mq-large').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      xlarge: S('.foundation-mq-xlarge').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      xxlarge: S('.foundation-mq-xxlarge').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, '')
    },

    stylesheet : $('<style></style>').appendTo('head')[0].sheet,

    global: {
      namespace: undefined
    },

    init : function (scope, libraries, method, options, response) {
      var args = [scope, method, options, response],
          responses = [];

      // check RTL
      this.rtl = /rtl/i.test(S('html').attr('dir'));

      // set foundation global scope
      this.scope = scope || this.scope;

      this.set_namespace();

      if (libraries && typeof libraries === 'string' && !/reflow/i.test(libraries)) {
        if (this.libs.hasOwnProperty(libraries)) {
          responses.push(this.init_lib(libraries, args));
        }
      } else {
        for (var lib in this.libs) {
          responses.push(this.init_lib(lib, libraries));
        }
      }

      S(window).load(function(){
        S(window)
          .trigger('resize.fndtn.clearing')
          .trigger('resize.fndtn.dropdown')
          .trigger('resize.fndtn.equalizer')
          .trigger('resize.fndtn.interchange')
          .trigger('resize.fndtn.joyride')
          .trigger('resize.fndtn.magellan')
          .trigger('resize.fndtn.topbar')
          .trigger('resize.fndtn.slider');
      });

      return scope;
    },

    init_lib : function (lib, args) {
      if (this.libs.hasOwnProperty(lib)) {
        this.patch(this.libs[lib]);

        if (args && args.hasOwnProperty(lib)) {
            if (typeof this.libs[lib].settings !== 'undefined') {
                $.extend(true, this.libs[lib].settings, args[lib]);
            }
            else if (typeof this.libs[lib].defaults !== 'undefined') {
                $.extend(true, this.libs[lib].defaults, args[lib]);
            }
          return this.libs[lib].init.apply(this.libs[lib], [this.scope, args[lib]]);
        }

        args = args instanceof Array ? args : new Array(args);    // PATCH: added this line
        return this.libs[lib].init.apply(this.libs[lib], args);
      }

      return function () {};
    },

    patch : function (lib) {
      lib.scope = this.scope;
      lib.namespace = this.global.namespace;
      lib.rtl = this.rtl;
      lib['data_options'] = this.utils.data_options;
      lib['attr_name'] = attr_name;
      lib['add_namespace'] = add_namespace;
      lib['bindings'] = bindings;
      lib['S'] = this.utils.S;
    },

    inherit : function (scope, methods) {
      var methods_arr = methods.split(' '),
          i = methods_arr.length;

      while (i--) {
        if (this.utils.hasOwnProperty(methods_arr[i])) {
          scope[methods_arr[i]] = this.utils[methods_arr[i]];
        }
      }
    },

    set_namespace: function () {

      // Description:
      //    Don't bother reading the namespace out of the meta tag
      //    if the namespace has been set globally in javascript
      //
      // Example:
      //    Foundation.global.namespace = 'my-namespace';
      // or make it an empty string:
      //    Foundation.global.namespace = '';
      //
      //

      // If the namespace has not been set (is undefined), try to read it out of the meta element.
      // Otherwise use the globally defined namespace, even if it's empty ('')
      var namespace = ( this.global.namespace === undefined ) ? $('.foundation-data-attribute-namespace').css('font-family') : this.global.namespace;

      // Finally, if the namsepace is either undefined or false, set it to an empty string.
      // Otherwise use the namespace value.
      this.global.namespace = ( namespace === undefined || /false/i.test(namespace) ) ? '' : namespace;
    },

    libs : {},

    // methods that can be inherited in libraries
    utils : {

      // Description:
      //    Fast Selector wrapper returns jQuery object. Only use where getElementById
      //    is not available.
      //
      // Arguments:
      //    Selector (String): CSS selector describing the element(s) to be
      //    returned as a jQuery object.
      //
      //    Scope (String): CSS selector describing the area to be searched. Default
      //    is document.
      //
      // Returns:
      //    Element (jQuery Object): jQuery object containing elements matching the
      //    selector within the scope.
      S : S,

      // Description:
      //    Executes a function a max of once every n milliseconds
      //
      // Arguments:
      //    Func (Function): Function to be throttled.
      //
      //    Delay (Integer): Function execution threshold in milliseconds.
      //
      // Returns:
      //    Lazy_function (Function): Function with throttling applied.
      throttle : function (func, delay) {
        var timer = null;

        return function () {
          var context = this, args = arguments;

          if (timer == null) {
            timer = setTimeout(function () {
              func.apply(context, args);
              timer = null;
            }, delay);
          }
        };
      },

      // Description:
      //    Executes a function when it stops being invoked for n seconds
      //    Modified version of _.debounce() http://underscorejs.org
      //
      // Arguments:
      //    Func (Function): Function to be debounced.
      //
      //    Delay (Integer): Function execution threshold in milliseconds.
      //
      //    Immediate (Bool): Whether the function should be called at the beginning
      //    of the delay instead of the end. Default is false.
      //
      // Returns:
      //    Lazy_function (Function): Function with debouncing applied.
      debounce : function (func, delay, immediate) {
        var timeout, result;
        return function () {
          var context = this, args = arguments;
          var later = function () {
            timeout = null;
            if (!immediate) result = func.apply(context, args);
          };
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, delay);
          if (callNow) result = func.apply(context, args);
          return result;
        };
      },

      // Description:
      //    Parses data-options attribute
      //
      // Arguments:
      //    El (jQuery Object): Element to be parsed.
      //
      // Returns:
      //    Options (Javascript Object): Contents of the element's data-options
      //    attribute.
      data_options : function (el, data_attr_name) {
        data_attr_name = data_attr_name || 'options';
        var opts = {}, ii, p, opts_arr,
            data_options = function (el) {
              var namespace = Foundation.global.namespace;

              if (namespace.length > 0) {
                return el.data(namespace + '-' + data_attr_name);
              }

              return el.data(data_attr_name);
            };

        var cached_options = data_options(el);

        if (typeof cached_options === 'object') {
          return cached_options;
        }

        opts_arr = (cached_options || ':').split(';');
        ii = opts_arr.length;

        function isNumber (o) {
          return ! isNaN (o-0) && o !== null && o !== "" && o !== false && o !== true;
        }

        function trim (str) {
          if (typeof str === 'string') return $.trim(str);
          return str;
        }

        while (ii--) {
          p = opts_arr[ii].split(':');
          p = [p[0], p.slice(1).join(':')];

          if (/true/i.test(p[1])) p[1] = true;
          if (/false/i.test(p[1])) p[1] = false;
          if (isNumber(p[1])) {
            if (p[1].indexOf('.') === -1) {
              p[1] = parseInt(p[1], 10);
            } else {
              p[1] = parseFloat(p[1]);
            }
          }

          if (p.length === 2 && p[0].length > 0) {
            opts[trim(p[0])] = trim(p[1]);
          }
        }

        return opts;
      },

      // Description:
      //    Adds JS-recognizable media queries
      //
      // Arguments:
      //    Media (String): Key string for the media query to be stored as in
      //    Foundation.media_queries
      //
      //    Class (String): Class name for the generated <meta> tag
      register_media : function (media, media_class) {
        if(Foundation.media_queries[media] === undefined) {
          $('head').append('<meta class="' + media_class + '"/>');
          Foundation.media_queries[media] = removeQuotes($('.' + media_class).css('font-family'));
        }
      },

      // Description:
      //    Add custom CSS within a JS-defined media query
      //
      // Arguments:
      //    Rule (String): CSS rule to be appended to the document.
      //
      //    Media (String): Optional media query string for the CSS rule to be
      //    nested under.
      add_custom_rule : function (rule, media) {
        if (media === undefined && Foundation.stylesheet) {
          Foundation.stylesheet.insertRule(rule, Foundation.stylesheet.cssRules.length);
        } else {
          var query = Foundation.media_queries[media];

          if (query !== undefined) {
            Foundation.stylesheet.insertRule('@media ' +
              Foundation.media_queries[media] + '{ ' + rule + ' }');
          }
        }
      },

      // Description:
      //    Performs a callback function when an image is fully loaded
      //
      // Arguments:
      //    Image (jQuery Object): Image(s) to check if loaded.
      //
      //    Callback (Function): Function to execute when image is fully loaded.
      image_loaded : function (images, callback) {
        var self = this,
            unloaded = images.length;

        if (unloaded === 0) {
          callback(images);
        }

        images.each(function () {
          single_image_loaded(self.S(this), function () {
            unloaded -= 1;
            if (unloaded === 0) {
              callback(images);
            }
          });
        });
      },

      // Description:
      //    Returns a random, alphanumeric string
      //
      // Arguments:
      //    Length (Integer): Length of string to be generated. Defaults to random
      //    integer.
      //
      // Returns:
      //    Rand (String): Pseudo-random, alphanumeric string.
      random_str : function () {
        if (!this.fidx) this.fidx = 0;
        this.prefix = this.prefix || [(this.name || 'F'), (+new Date).toString(36)].join('-');

        return this.prefix + (this.fidx++).toString(36);
      }
    }
  };

  $.fn.foundation = function () {
    var args = Array.prototype.slice.call(arguments, 0);

    return this.each(function () {
      Foundation.init.apply(Foundation, [this].concat(args));
      return this;
    });
  };

}(jQuery, window, window.document));
;;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.reveal = {
    name : 'reveal',

    version : '5.3.3',

    locked : false,

    settings : {
      animation: 'fadeAndPop',
      animation_speed: 250,
      close_on_background_click: true,
      close_on_esc: true,
      dismiss_modal_class: 'close-reveal-modal',
      bg_class: 'reveal-modal-bg',
      root_element: 'body',
      open: function(){},
      opened: function(){},
      close: function(){},
      closed: function(){},
      bg : $('.reveal-modal-bg'),
      css : {
        open : {
          'opacity': 0,
          'visibility': 'visible',
          'display' : 'block'
        },
        close : {
          'opacity': 1,
          'visibility': 'hidden',
          'display': 'none'
        }
      }
    },

    init : function (scope, method, options) {
      $.extend(true, this.settings, method, options);
      this.bindings(method, options);
    },

    events : function (scope) {
      var self = this,
          S = self.S;

      S(this.scope)
        .off('.reveal')
        .on('click.fndtn.reveal', '[' + this.add_namespace('data-reveal-id') + ']:not([disabled])', function (e) {
          e.preventDefault();
        
          if (!self.locked) {
            var element = S(this),
                ajax = element.data(self.data_attr('reveal-ajax'));

            self.locked = true;

            if (typeof ajax === 'undefined') {
              self.open.call(self, element);
            } else {
              var url = ajax === true ? element.attr('href') : ajax;

              self.open.call(self, element, {url: url});
            }
          }
        });

      S(document)
        .on('click.fndtn.reveal', this.close_targets(), function (e) {

          e.preventDefault();

          if (!self.locked) {
            var settings = S('[' + self.attr_name() + '].open').data(self.attr_name(true) + '-init'),
                bg_clicked = S(e.target)[0] === S('.' + settings.bg_class)[0];

            if (bg_clicked) {
              if (settings.close_on_background_click) {
                e.stopPropagation();
              } else {
                return;
              }
            }

            self.locked = true;
            self.close.call(self, bg_clicked ? S('[' + self.attr_name() + '].open') : S(this).closest('[' + self.attr_name() + ']'));
          }
        });

      if(S('[' + self.attr_name() + ']', this.scope).length > 0) {
        S(this.scope)
          // .off('.reveal')
          .on('open.fndtn.reveal', this.settings.open)
          .on('opened.fndtn.reveal', this.settings.opened)
          .on('opened.fndtn.reveal', this.open_video)
          .on('close.fndtn.reveal', this.settings.close)
          .on('closed.fndtn.reveal', this.settings.closed)
          .on('closed.fndtn.reveal', this.close_video);
      } else {
        S(this.scope)
          // .off('.reveal')
          .on('open.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.open)
          .on('opened.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.opened)
          .on('opened.fndtn.reveal', '[' + self.attr_name() + ']', this.open_video)
          .on('close.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.close)
          .on('closed.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.closed)
          .on('closed.fndtn.reveal', '[' + self.attr_name() + ']', this.close_video);
      }

      return true;
    },

    // PATCH #3: turning on key up capture only when a reveal window is open
    key_up_on : function (scope) {
      var self = this;

      // PATCH #1: fixing multiple keyup event trigger from single key press
      self.S('body').off('keyup.fndtn.reveal').on('keyup.fndtn.reveal', function ( event ) {
        var open_modal = self.S('[' + self.attr_name() + '].open'),
            settings = open_modal.data(self.attr_name(true) + '-init') || self.settings ;
        // PATCH #2: making sure that the close event can be called only while unlocked,
        //           so that multiple keyup.fndtn.reveal events don't prevent clean closing of the reveal window.
        if ( settings && event.which === 27  && settings.close_on_esc && !self.locked) { // 27 is the keycode for the Escape key
          self.close.call(self, open_modal);
        }
      });

      return true;
    },

    // PATCH #3: turning on key up capture only when a reveal window is open
    key_up_off : function (scope) {
      this.S('body').off('keyup.fndtn.reveal');
      return true;
    },


    open : function (target, ajax_settings) {
      var self = this,
          modal;

      if (target) {
        if (typeof target.selector !== 'undefined') {
          // Find the named node; only use the first one found, since the rest of the code assumes there's only one node
          modal = self.S('#' + target.data(self.data_attr('reveal-id'))).first();
        } else {
          modal = self.S(this.scope);

          ajax_settings = target;
        }
      } else {
        modal = self.S(this.scope);
      }

      var settings = modal.data(self.attr_name(true) + '-init');
      settings = settings || this.settings;


      if (modal.hasClass('open') && target.attr('data-reveal-id') == modal.attr('id')) {
        return self.close(modal);
      }

      if (!modal.hasClass('open')) {
        var open_modal = self.S('[' + self.attr_name() + '].open');

        if (typeof modal.data('css-top') === 'undefined') {
          modal.data('css-top', parseInt(modal.css('top'), 10))
            .data('offset', this.cache_offset(modal));
        }

        this.key_up_on(modal);    // PATCH #3: turning on key up capture only when a reveal window is open
        modal.trigger('open').trigger('open.fndtn.reveal');

        if (open_modal.length < 1) {
          this.toggle_bg(modal, true);
        }

        if (typeof ajax_settings === 'string') {
          ajax_settings = {
            url: ajax_settings
          };
        }

        if (typeof ajax_settings === 'undefined' || !ajax_settings.url) {
          if (open_modal.length > 0) {
            this.hide(open_modal, settings.css.close);
          }

          this.show(modal, settings.css.open);
        } else {
          var old_success = typeof ajax_settings.success !== 'undefined' ? ajax_settings.success : null;

          $.extend(ajax_settings, {
            success: function (data, textStatus, jqXHR) {
              if ( $.isFunction(old_success) ) {
                old_success(data, textStatus, jqXHR);
              }

              modal.html(data);
              self.S(modal).foundation('section', 'reflow');
              self.S(modal).children().foundation();

              if (open_modal.length > 0) {
                self.hide(open_modal, settings.css.close);
              }
              self.show(modal, settings.css.open);
            }
          });

          $.ajax(ajax_settings);
        }
      }
    },

    close : function (modal) {
      var modal = modal && modal.length ? modal : this.S(this.scope),
          open_modals = this.S('[' + this.attr_name() + '].open'),
          settings = modal.data(this.attr_name(true) + '-init') || this.settings;

      if (open_modals.length > 0) {
        this.locked = true;
        this.key_up_off(modal);   // PATCH #3: turning on key up capture only when a reveal window is open
        modal.trigger('close').trigger('close.fndtn.reveal');
        this.toggle_bg(modal, false);
        this.hide(open_modals, settings.css.close, settings);
      }
    },

    close_targets : function () {
      var base = '.' + this.settings.dismiss_modal_class;

      if (this.settings.close_on_background_click) {
        return base + ', .' + this.settings.bg_class;
      }

      return base;
    },

    toggle_bg : function (modal, state) {
      if (this.S('.' + this.settings.bg_class).length === 0) {
        this.settings.bg = $('<div />', {'class': this.settings.bg_class})
          .appendTo('body').hide();
      }

      var visible = this.settings.bg.filter(':visible').length > 0;
      if ( state != visible ) {
        if ( state == undefined ? visible : !state ) {
          this.hide(this.settings.bg);
        } else {
          this.show(this.settings.bg);
        }
      }
    },

    show : function (el, css) {
      // is modal
      if (css) {
        var settings = el.data(this.attr_name(true) + '-init') || this.settings,
            root_element = settings.root_element;

        if (el.parent(root_element).length === 0) {
          var placeholder = el.wrap('<div style="display: none;" />').parent();

          el.on('closed.fndtn.reveal.wrapped', function() {
            el.detach().appendTo(placeholder);
            el.unwrap().unbind('closed.fndtn.reveal.wrapped');
          });

          el.detach().appendTo(root_element);
        }

        var animData = getAnimationData(settings.animation);
        if (!animData.animate) {
          this.locked = false;
        }
        if (animData.pop) {
          css.top = $(window).scrollTop() - el.data('offset') + 'px';
          var end_css = {
            top: $(window).scrollTop() + el.data('css-top') + 'px',
            opacity: 1
          };

          return setTimeout(function () {
            return el
              .css(css)
              .animate(end_css, settings.animation_speed, 'linear', function () {
                this.locked = false;
                el.trigger('opened').trigger('opened.fndtn.reveal');
              }.bind(this))
              .addClass('open');
          }.bind(this), settings.animation_speed / 2);
        }

        if (animData.fade) {
          css.top = $(window).scrollTop() + el.data('css-top') + 'px';
          var end_css = {opacity: 1};

          return setTimeout(function () {
            return el
              .css(css)
              .animate(end_css, settings.animation_speed, 'linear', function () {
                this.locked = false;
                el.trigger('opened').trigger('opened.fndtn.reveal');
              }.bind(this))
              .addClass('open');
          }.bind(this), settings.animation_speed / 2);
        }

        return el.css(css).show().css({opacity: 1}).addClass('open').trigger('opened').trigger('opened.fndtn.reveal');
      }

      var settings = this.settings;

      // should we animate the background?
      if (getAnimationData(settings.animation).fade) {
        return el.fadeIn(settings.animation_speed / 2);
      }

      this.locked = false;

      return el.show();
    },

    hide : function (el, css) {
      // is modal
      if (css) {
        var settings = el.data(this.attr_name(true) + '-init');
        settings = settings || this.settings;

        var animData = getAnimationData(settings.animation);
        if (!animData.animate) {
          this.locked = false;
        }
        if (animData.pop) {
          var end_css = {
            top: - $(window).scrollTop() - el.data('offset') + 'px',
            opacity: 0
          };

          return setTimeout(function () {
            return el
              .animate(end_css, settings.animation_speed, 'linear', function () {
                this.locked = false;
                el.css(css).trigger('closed').trigger('closed.fndtn.reveal');
              }.bind(this))
              .removeClass('open');
          }.bind(this), settings.animation_speed / 2);
        }

        if (animData.fade) {
          var end_css = {opacity: 0};

          return setTimeout(function () {
            return el
              .animate(end_css, settings.animation_speed, 'linear', function () {
                this.locked = false;
                el.css(css).trigger('closed').trigger('closed.fndtn.reveal');
              }.bind(this))
              .removeClass('open');
          }.bind(this), settings.animation_speed / 2);
        }

        return el.hide().css(css).removeClass('open').trigger('closed').trigger('closed.fndtn.reveal');
      }

      var settings = this.settings;

      // should we animate the background?
      if (getAnimationData(settings.animation).fade) {
        return el.fadeOut(settings.animation_speed / 2);
      }

      return el.hide();
    },

    close_video : function (e) {
      var video = $('.flex-video', e.target),
          iframe = $('iframe', video);

      if (iframe.length > 0) {
        iframe.attr('data-src', iframe[0].src);
        iframe.attr('src', iframe.attr('src'));
        video.hide();
      }
    },

    open_video : function (e) {
      var video = $('.flex-video', e.target),
          iframe = video.find('iframe');

      if (iframe.length > 0) {
        var data_src = iframe.attr('data-src');
        if (typeof data_src === 'string') {
          iframe[0].src = iframe.attr('data-src');
        } else {
          var src = iframe[0].src;
          iframe[0].src = undefined;
          iframe[0].src = src;
        }
        video.show();
      }
    },

    data_attr: function (str) {
      if (this.namespace.length > 0) {
        return this.namespace + '-' + str;
      }

      return str;
    },

    cache_offset : function (modal) {
      var offset = modal.show().height() + parseInt(modal.css('top'), 10);

      modal.hide();

      return offset;
    },

    off : function () {
      $(this.scope).off('.fndtn.reveal');
    },

    reflow : function () {}
  };

  /*
   * getAnimationData('popAndFade') // {animate: true,  pop: true,  fade: true}
   * getAnimationData('fade')       // {animate: true,  pop: false, fade: true}
   * getAnimationData('pop')        // {animate: true,  pop: true,  fade: false}
   * getAnimationData('foo')        // {animate: false, pop: false, fade: false}
   * getAnimationData(null)         // {animate: false, pop: false, fade: false}
   */
  function getAnimationData(str) {
    var fade = /fade/i.test(str);
    var pop = /pop/i.test(str);
    return {
      animate: fade || pop,
      pop: pop,
      fade: fade
    };
  }
}(jQuery, window, window.document));
;jQuery(document).foundation();;$(function() {

  var mq = "small";
  if ( !matchMedia(Foundation.media_queries['medium']).matches ) {
    // Small
    mq = "small";
  } else if ( !matchMedia(Foundation.media_queries['large']).matches ) {
    // Medium
    mq = "medium";
  } else if ( !matchMedia(Foundation.media_queries['xlarge']).matches ) {
    // Large
    mq = "large";
  } else {
    // XLarge
    mq = "xlarge";
  }

  var masonryColumns = function( fn ) {
    // Detemine how many masonry columns to have based on Foundation's MQ
    if ( !matchMedia(Foundation.media_queries['medium']).matches ) {
      // Small
      $(".journal-article").css("width", ($(".journal-wrapper").width()/1-15) );
    } else if ( !matchMedia(Foundation.media_queries['large']).matches ) {
      // Medium
      $(".journal-article").css("width", ($(".journal-wrapper").width()/2-15) );
    } else if ( !matchMedia(Foundation.media_queries['xlarge']).matches ) {
      // Large
      $(".journal-article").css("width", ($(".journal-wrapper").width()/3-15) );
    } else {
      // XLarge
      $(".journal-article").css("width", ($(".journal-wrapper").width()/3-15) );
    }
  };

  // scroll to div ID
  $("a[href*=#]:not([href=#])").click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $("html,body").animate({
          scrollTop: target.offset().top
        }, 400);
        return false;
      }
    }
  });

  // for FB Share
  $(".fb-share").click(function(e){
    e.preventDefault();
    FB.ui({
      method: 'share_open_graph',
      action_type: 'og.likes',
      action_properties: JSON.stringify({
        object: $(location).attr('href')
      })
    }, function(response){});
  });

  // for twitter share
  $(".twitter-share").click(function(e){
    e.preventDefault();
    window.open('https://twitter.com/share?text='+$(document).find("title").text()+'&url='+$(this).attr('href'), "popupWindow", "width=575,height=245,scrollbars=yes");
  });

  var notInHeader = false;
  var notOverlay = true;
  $(".menu-waypoint").waypoint( function(direction){
    if ( direction == "up" && notOverlay ) {
      // scrolling down out of header
      $('.menu-wrapper').removeClass('shaded');
      $('.menu-wrapper').removeClass('closed');
      notInHeader = false;
    } else if ( direction == "down" && notOverlay ) {
      // scrolling up into header and overlay is not open
      $('.menu-wrapper').addClass('closed');
      notInHeader = true;
    }
  }, { offset: 250 });

  // For anything that requires scrolltop value
  var lastST = 0;
  var lastDirection = "down";
  $(window).scroll(function() {
    var ST = $(this).scrollTop();
    var offset = ST/$(this).height();
    var textSpeed = 265 * offset - 40;
    var textOpacity = 1 - ((.2 * offset) + offset);
    var scrollOpacity = offset + .05;
    notOverlay = $(".overlay").hasClass('open') ? false : true;

    // for menu hiding based on scroll direction
    if ( ST > lastST ) {
      // up up..suddenly downscroll
      if ( ST > lastST && lastDirection == "up" && notInHeader && notOverlay ) {
        $(".menu-wrapper").addClass('closed');
      }
      lastDirection = "down";
    } else {
      // down down..suddenly upscroll
      if ( ST < lastST && lastDirection == "down" && notInHeader &&  notOverlay ) {
        $(".menu-wrapper").addClass('shaded');
        $(".menu-wrapper").removeClass('closed');
      }
      lastDirection = "up";
    }
    lastST = ST;

    // for homepage parallax on video thing (Only on S & M)
    if ( mq == "large" || mq == "xlarge" ) {
      $(".hero-action").css({
        transform: "translate3d(0,"+ textSpeed +"%,0)",
        opacity: textOpacity
      });
    }
  });


  // Mobile menu
  $(".nav-toggle-click-area").click(function(e){
    e.preventDefault();
    $(".nav-toggle").toggleClass('active');
    $(".overlay").toggleClass('open');
    $(".nav-text").toggleClass('off');
    $(".menu-wrapper").toggleClass('shaded');
  });

  // Redirect to different category pages
  $(".category-select").change(function(){
    window.location.href = $(this).val();
  });

  // Pause hero video
  $(document).on('open.fndtn.reveal', '[data-reveal]', function () {
    $("#hero-video").get(0).pause();
  });
  $(document).on('close.fndtn.reveal', '[data-reveal]', function () {
    $("#hero-video").get(0).play();
  });

  // If #slideshow exists then set it up
  if( $("#slideshow").length ) {
    $("#slideshow").slick({
      dots: true,
      arrows: false,
      fade: true,
      autoplay: true,
      autoplaySpeed: 5000,
      swipe: true,
      touchMove: true,
      infinite: true,
      speed: 350,
      cssEase: 'ease-in-out'
    });
    // Set up the prev and next arrows
    $(".slideshow-prev").click(function() {
      $("#slideshow").slickPrev();
    });
    $(".slideshow-next").click(function() {
      $("#slideshow").slickNext();
    });
  }

  if( $("#tiles").length ) {
    var $container = $("#tiles");
    // initialize Masonry after all images have loaded
    $container.imagesLoaded( function() {
      $container.masonry({
        gutter: 12,
        itemSelector: '.item'
      });
      $container.lightGallery({
        loop : true
      });
      // remove WP Gallery from the DOM
      $("[id^=gallery-]").remove();
    });
  }

  $( window ).resize(function() {
    console.log("resizing now...");
    masonryColumns();
  });

  if( $(".journal-content").length ) {
    var $journalContainer = $(".journal-content");
    $journalContainer.imagesLoaded( function() {
      masonryColumns();
      $journalContainer.masonry({
        itemSelector: '.journal-article',
        gutter: 20,
        isFitWidth: true
      });
    });
  }

  // Mailchimp submission via AJAX
  $('#subscribe').ajaxChimp({
    url: '//proposalenvy.us9.list-manage.com/subscribe/post?u=ca8ce0af86bcc57be42d033e5&amp;id=569d343fb2',
    callback: subCallbackFunction
  });
  function subCallbackFunction (resp) {
    $('#subscribe button').addClass('disabled');
    if (resp.result === 'success') {
      $('#subscribe-email').css('color', '#aaaaaa');
      $('#subscribe-email').val('Check your email for verification.');
    } else {
      $('#subscribe-email').css('color', '#fc4640');
      $('#subscribe-email').val('Enter a valid email address.');
      $('#subscribe button').removeClass('disabled');
    }
  }
});