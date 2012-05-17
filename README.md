ga-js-outbound-link-tracking
============================

A little Google Analytics script to track outbound links on a page using event delegation

Getting Started:
You need to host the file `outbound.js` on your server

Then add the following code to you page:

    <script src="outbound.js"></script>
    <script>
    var _gaq = _gaq || [];
    _gaq.push(trackOutboundLinks());
    </script>


To set debug use:

    _gaq.push(trackOutboundLinks({'debug': true}));

This prevents the outbound links from working and output the command sent to
Google Analytics to the console.
