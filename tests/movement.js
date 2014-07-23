(function (VM) {

  module('Movement');

  function tests (body) {

    // Test the core functions of ViewMachine
    test('parent', function () {
      ok(body.parent().element === 'HTML', 'Parent element of body is HTML');
    });

    test('children', function () {

      ok(body.children().length === 2, 'Body has 2 children');

      ok('<' + body.children()[0].$.outerHTML
        .substr(0, 16)
        .toLowerCase()
        .split('<')[1]   // Deal with random whitespace in old browsers
        .split('"')      // Deal with lack of quotes in old browsers
        .join('') === '<div id=qunit>', 'First child is as expected');

    });

    test('remove', function () {

      body.$.innerHTML = '<div id="Test"></div>' + body.$.innerHTML;

      var length = body.children().length;
      var el = body.children()[0].remove();

      ok(body.children().length === length - 1, 'Checking length has decreased by 1');

      ok('<' + el.$.outerHTML
        .toLowerCase()
        .split('<')[1]   // Deal with random whitespace in old browsers
        .split('"')      // Deal with lack of quotes in old browsers
        .join('') === '<div id=test>', 'Checking removed element is identical to one added');

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
      body.append(VM('div', {'class':'different'}));
      
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
      body.prepend(VM('div', {'class':'different'}));

      body.prepend(child);

      deepEqual(child, body.children()[0], 'Child is identical to prepended child');

      equal(body.children()[1].attrs('class'), 'different', 'Check second child has class different');

      body.children()[0].remove();
      body.children()[0].remove();

    });

    test('splice', function () {
      var children = [];
      for (var i = 0; i < 100; i++) {
        children.push(VM('li', {id: i}));
      }

      var ul = VM('ul');
      ul.mappend(children);

      // Check children

      deepEqual(ul.children(), children, 'Children mappended are same as children looked up');

      // splice into start

      ul.splice(0, 1, VM('li', {id: 'start'}));

      children.splice(0, 1, VM('li', {id: 'start'}));  // The splice method of this line is the native Array.splice

      equal(ul.children()[0].$.id, 'start', 'Item spliced to start, in correct position');
      equal(ul.children()[1].$.id, 1, 'Item spliced to start, not affecting sibling');
      equal(ul.children().length, children.length, 'Item spliced to start, correct length');

      // splice into end

      ul.splice(children.length - 1, 1, VM('li', {id: 'end'}));

      children.splice(children.length - 1, 1, VM('li', {id: 'end'}));  // The splice method of this line is the native Array.splice

      equal(ul.children()[children.length - 1].$.id, 'end', 'Item spliced to end, in correct position');
      equal(ul.children()[children.length - 2].$.id, 98, 'Item spliced to end, not affecting sibling');
      equal(ul.children().length, children.length, 'Item spliced to end, correct length');

      // splice into middle

      ul.splice(50, 1, VM('li', {id: 'mid'}));

      children.splice(50, 1, VM('li', {id: 'mid'}));  // The splice method of this line is the native Array.splice

      equal(ul.children()[50].$.id, 'mid', 'Item spliced to middle, in correct position');
      equal(ul.children()[49].$.id, 49, 'Item spliced to middle, not affecting previous sibling');
      equal(ul.children()[51].$.id, 51, 'Item spliced to middle, not affecting next sibling');
      equal(ul.children().length, children.length, 'Item spliced to middle, correct length');

      // splice without removing element

      ul.splice(99, 0, VM('li', {id: 'secondLast'}));

      children.splice(99, 0, VM('li', {id: 'secondLast'}));  // The splice method of this line is the native Array.splice

      equal(ul.children()[99].$.id, 'secondLast', 'Item spliced without removing, in correct position');
      equal(ul.children()[100].$.id, 'end', 'Item spliced without removing, not affecting previous sibling');
      equal(ul.children()[98].$.id, 98, 'Item spliced without removing, not affecting next sibling');
      equal(ul.children().length, children.length, 'Item spliced without removing, correct length');

      // splice out single element

      ul.splice(99, 1);

      children.splice(99, 1);  // The splice method of this line is the native Array.splice

      equal(ul.children()[99].$.id, 'end', 'Item spliced without removing, in correct position');
      equal(ul.children()[98].$.id, 98, 'Item spliced without removing, not affecting next sibling');
      equal(ul.children().length, children.length, 'Item spliced without removing, correct length');

      // Splice nothing

      ul.splice(0, 0);
      children.splice(0, 0);

      equal(ul.children().length, 100, 'Nothing spliced, nothing changed');

      // splice out all

      ul.splice(0, children.length);

      children.splice(0, children.length);  // The splice method of this line is the native Array.splice

      equal(ul.children().length, 0, 'All elements spliced out');
    });
  
  }

  window.onload = function (){
    tests(VM(document.body));
  };


})(viewMachine);