(function (VM) {
  
  module('Text');

  test('text', function () {
    var txt = VM('div');
    txt.text('This is some text to be fully escaped  <>!@£$%^&*()_+=-[]}{');
    equal(txt.$.innerHTML, 'This is some text to be fully escaped  &lt;&gt;!@£$%^&amp;*()_+=-[]}{', 'Checking text successfully escaped');

    // Checking reference

    var div = VM('div');

    div.append(txt);

    div.children()[0].text('TEST');

    equal(txt.$.innerHTML, div.children()[0].$.innerHTML, 'Checking DOM element reference is preserved');

  });

  test('HTML', function () {
    var div = VM('div');
    div.HTMLtext('<p>This is a <strong>paragraph</strong></p>');
    
    equal(div.$.innerHTML, '<p>This is a <strong>paragraph</strong></p>', 'checking HTML text is successfully applied');
  });

  // Add test for trim

})(viewMachine);