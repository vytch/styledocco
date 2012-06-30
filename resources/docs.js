(function () {

'use strict';

var toArray = function(arr) { return Array.prototype.slice.call(arr); };
var add = function(a, b) { return a + b; };


// Scans your stylesheet for pseudo classes and adds a class with the same name.
// Thanks to Knyle Style Sheets for the idea.

// Compile regular expression.
var pseudos = [ 'link', 'visited', 'hover', 'active', 'focus', 'target',
                'enabled', 'disabled', 'checked' ];
var pseudoRe = new RegExp(":((" + pseudos.join(")|(") + "))", "gi");
var processedPseudoClasses = toArray(document.styleSheets).filter(function(ss) {
  return !(ss.href != null);
}).map(function(ss) {
  return toArray(ss.cssRules).filter(function(rule) {
    // Keep only rules with pseudo classes.
    return rule.selectorText && rule.selectorText.match(pseudoRe);
  }).map(function(rule) {
    // Replace : with . and encoded :
    return rule.cssText.replace(pseudoRe, ".\\3A $1");
  }).reduce(add, '');
}).reduce(add, '');
if (processedPseudoClasses.length) {
  // Add a new style element with the processed pseudo class styles.
  var styleEl = document.createElement('style');
  styleEl.innerText = processedPseudoClasses;
  document.getElementsByTagName('head')[0].appendChild(styleEl);
}


// Adds documentation styles from parent document to example iframes
var iframeStyles = toArray(document.getElementsByTagName('style')).filter(function(el) {
  if (el.getAttribute('type') === 'text/example') return true;
  return false;
}).reduce(function(iframeStyles, el) {
  return iframeStyles += el.innerHTML;
}, '');
iframeStyles = encodeURIComponent('<style>' + iframeStyles + '</style>');

toArray(document.getElementsByClassName('example')).forEach(function(example) {
  example.src += iframeStyles;
  example.addEventListener('load', function() {
    try {
      example.height = example.contentDocument.documentElement.offsetHeight;
    } catch(ex) {
      console.warn('Your browser does not support accessing data URI iframes.');
    }
  });
});


}());
