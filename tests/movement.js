(function (VM) {

  module('Movement');

  function tests (body) {

    // Test the core functions of ViewMachine
    test('parent', function () {
      ok(body.parent().element === 'HTML', 'Parent element of body is HTML');
    });

    test('children', function () {

      ok(body.children().length === 2, 'Body has 2 children');

      ok(body.children()[0].$.outerHTML.substr(0, 16) === '<div id="qunit">', 'First child is as expected');

    });

    test('remove', function () {

      body.$.innerHTML = '<div id="Test"></div>' + body.$.innerHTML;

      var length = body.children().length;
      var el = body.children()[0].remove();

      ok(body.children().length === length - 1, 'Checking length has decreased by 1');

      ok(el.$.outerHTML === '<div id="Test"></div>', 'Checking removed element is identical to one added');

    });

    test('empty', function () {
      body.$.innerHTML = '<ul><li></li><li></li><li></li><li></li></ul>' + body.$.innerHTML;

      equal(body.children()[0].children().length, 4, 'Added 4 LI elements to a UL');
      body.children()[0].empty();
      
      equal(body.children()[0].children().length, 0, 'UL now empty');
      body.children()[0].remove();
    });

    test('replace', function () {
      body.$.innerHTML = '<div></div>' + body.$.innerHTML;
      body.children()[0].replace(VM('div', {id: 'replaced'}));

      equal(body.children()[0].attrs('id'), 'replaced', 'Added item replaced');

      body.children()[0].remove();
    });

    test('append', function() {
      var length = body.children().length;
      var child = VM('div');
      body.append(VM('div', {class:'different'}));
      
      body.append(child);

      deepEqual(child, body.children()[length+1], 'Child is identical to appended child');

      equal(body.children()[length].attrs('class'), 'different', 'Check second child has class different');

      body.children()[length].remove();
      body.children()[length].remove();

    });

    test('mappend', function() {
      var length = body.children().length;
      var children = [];
      for (var i = 0; i < 100; i++) {
        children.push(VM('div', {id: i}));
      }

      body.mappend(children);

      var compare = body.children().slice(length, body.children().length);

      deepEqual(children, compare, 'Children successfully multi-appended');

      for (var n = 0; n < 100; n++) {
        body.children()[length].remove();
      }

    });


    test('prepend', function() {
      var child = VM('div');
      body.prepend(VM('div', {class:'different'}));

      body.prepend(child);

      deepEqual(child, body.children()[0], 'Child is identical to prepended child');

      equal(body.children()[1].attrs('class'), 'different', 'Check second child has class different');

      body.children()[0].remove();
      body.children()[0].remove();

    });

    test('splice', function () {
      var children = [];
      for (var i = 0; i < 99; i++) {
        children.push(VM('li', {id: i}));
      }

      var ul = VM('ul');
      ul.mappend(children);

      // Check children

      deepEqual(ul.children(), children, 'Children mappended are same as children looked up');

      // splice into start

      ul.splice(0, 1, VM('li', {id: 'start'}));

      children.splice(0, 1, VM('li'), {id: 'start'});  // The splice method of this line is the native Array.splice

      console.log(ul.children());
      console.log(children);

      equal(ul.children()[0].$.id, 'start', 'Item spliced to start, in correct position');
      equal(ul.children().length, children.length, 'Item spliced to start, correct length');


      // splice into end

      ul.splice(children.length - 1, 1, VM('li', {id: 'end'}));

      children.splice(children.length - 1, 1, VM('li', {id: 'end'}));  // The splice method of this line is the native Array.splice


      deepEqual(ul.children()[children.length - 1].$.id, 'end', 'Item splced to end, 1 removed');

      // splice into middle

      // splice without removing element

      // splice out single element

      // splice out all
    });
  
  }

  window.onload = function (){
    tests(VM(document.body));
  };


})(viewMachine);