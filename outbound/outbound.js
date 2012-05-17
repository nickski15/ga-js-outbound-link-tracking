/**
 * A little script to handle outbound link tracking in Google Anlaytics.
 * Links are tracked as events.
 * @author nickski15@ (Nick Mihailovski)
 */

// Namespace.
var _gaq = _gaq || [];

function trackOutboundLinks(options) {
  return function() {
    var debug = options.debug || false;
    var element = options.element || document;
    var eventName = options.eventName || 'click';

    var traverseDepth = 1;
    var anchorUrl = '';
    var anchorTarget = '';
    var cleanUrl = '';

    if (element.addEventListener) {
      element.addEventListener(eventName, checkEvent);
    } else {
      element.attachEvent('on' + eventName, checkEvent);
    }

    function checkEvent(event) {
      var event = event || window.event;
      var targetElement = event.target || event.srcElement;

      var anchor = getParentAnchor(targetElement, traverseDepth);
      if (anchor && isOutbound(anchor)) {

        // prevent default behavior.
        if (event.preventDefault) {
          event.preventDefault();
        } else {
          event.returnValue = false;
        }
        anchorUrl = anchor.href;
        anchorTarget = anchor.target;

        track();
      }
    };

    function getParentAnchor(targetElement, depth) {
      if (targetElement.tagName == 'A')  {
        return targetElement;
      } else if (targetElement.tagName == 'BODY' || depth < 0) {
        return;
      } else {
        targetElement = targetElement.parentNode;
        return getParentAnchor(targetElement, --depth);
      }
    }

    function isOutbound(anchor) {
      var anchorParts = anchor.href.split('//');

      // "//" must be present to continue.
      if (anchorParts.length < 2) {
        return false;
      }
      cleanUrl = anchorParts[1];

      // Remove port, then remove path.
      var hostname = cleanUrl.split(':')[0].split('/')[0];
      if (document.location.hostname != hostname) {
        return true;
      }
      return false;
    }

    function track() {
      window._gaq.push(['_set', {'hitCallback': hitCallback}]);
      var command = ['_trackEvent', 'outboundLink', cleanUrl];
      if (debug) {
        console.log(command);
      } else {
        window._gaq.push(command);
      }
    }

    function hitCallback() {
      if (debug) {
        return;
      }
      if (anchorTarget == '_blank') {
        window.open(anchorUrl);
      } else if (anchorTarget == '_top') {
        window.top.location = anchorUrl;
      } else if (anchorTarget == '_parent') {
        window.parent.location = anchorUrl;
      }
      // If no target or _self.
      window.location = anchorUrl;
    }
  }
};
