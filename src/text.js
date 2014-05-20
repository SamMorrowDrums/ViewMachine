define([
  './core'
], function (viewMachine) {

  viewMachine.prototype.text = function (text) {

    // Completely escaped text function

    this.$.innerHTML = viewMachine.escape(text);

    return this;
  };

  viewMachine.escape = function (text) {
    var div = document.createElement('div');

    // Use native browser HTML escaping;

    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  };

  viewMachine.prototype.HTMLtext = function (text) {
    var output = [],
        substr,
        reTags = /<([^>]+)>/gm,
        reOnEvent = /<\w+(?=\s)[^>]*?\s(on\w+)[\s\S]+?>/gm,
        matches = text.match(reTags);

    // Take a string, including HTML, HTML escape body text and exclude script tags 

    if (matches) {
      for (var i = 0; i < matches.length; i++) {

        // Take lump of text before any HTML tags

        substr = text.substring(0, text.indexOf(matches[i]));

        // Use Native browser HTML excaping
        output.push(viewMachine.escape(substr));

        // Filter JS for security (script an onEvent tags)

        if (matches[i].toLowerCase().indexOf('script') < 0 && matches[i].match(reOnEvent) === null) {
          output.push(matches[i]);
        }

        // Crop remaining text to parse

        text = text.substring(text.indexOf(matches[i])+matches[i].length);
      }
    }

    // If any remaining text, HTML escape all characters
    output.push(viewMachine.escape(text));

    this.$.innerHTML = output.join('');

    return this;
  };

  viewMachine.trim = function (str, max, suffix) {

    // Trim text to a certain max length, or less with optional suffix

    if (str.length >= max) {
      str = str.substring(0, max);
    }
    return suffix ? str + suffix : str;
  };

  return viewMachine;
});