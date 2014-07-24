(function (VM) {
  
  module('Elements');

  test('attrs', function () {
    var attrs = {
      id: 'testId',
      'class': 'myClass',
      title: 'testTitle',
      style: 'color: blue;',
      'data-test': 'dataTest'
    };

    if (VM.old) {
      attrs.style = 'COLOR: blue';
    }

    var div = VM('div');

    for (var k in attrs) {
      // Check attr not defined
      ok(!div.attrs(k), k + ' attribute blank by default');

      // Define individual attrs
      div.attrs(k, attrs[k]);

      equal(div.attrs(k), attrs[k], k + ' attribute set and retreived');
    }
    
    // For some reason the below line is failing in certain browsers, and Phantom 
    // deepEqual(VM('div', attrs), div, 'Compare an new element created with the whole list of attrs to the individually built one');


    // alternate approach

    var div2 = VM('div', attrs);
    for (var n in attrs) {
      equal(div2.attrs(n), attrs[n], n + ' data-attribute bulk set on creation and retreived');
    }

  });

  test('getAllAttrs', function () {
    var attrs = {
      id: 'testId',
      'class': 'myClass',
      title: 'testTitle',
      style: 'color: blue;',
      'data-test': 'dataTest'
    };

    if (VM.old) {
      attrs.style = 'COLOR: blue';
    }

    var div = VM('div', attrs);

    deepEqual(div.getAllAttrs(), attrs, 'Check returned attrs are same as originally set');

  });

  test('data', function () {
    var attrs = {
      one: 'testId',
      two: 'myClass',
      three: 'testTitle',
      four: 'More data',
      five: 'dataTest'
    };

    var div = VM('div');

    for (var k in attrs) {
      // Check data-attrs not defined
      ok(!div.data(k), k + ' data-attribute blank by default');

      // Define individual attrs
      div.data(k, attrs[k]);

      equal(div.data(k), attrs[k], k + ' data-attribute set and retreived');
      equal(div.attrs('data-' + k), attrs[k], k + 'Attribute retreived directly');

    }
    var div2 = VM('div').data(attrs);
    for (var n in attrs) {
      equal(div2.data(n), attrs[n], n + ' data-attribute bulk set on creation and retreived');
    }

  });

  test('css', function () {
    var css = {
      color: 'red',
      width: '100px',
      height: '1000px',
      'background-color': 'green'
    };

    var div = VM('div');

    for (var k in css) {

      equal(div.css(k), getComputedStyle(document.createElement('div'))[k], k + ' CSS style blank by default');

      // Define individual attrs
      div.css(k, css[k]);
      if (k === 'color') {
        ok ((div.css(k) === css[k] || div.css(k) === 'rgb(255, 0, 0)'), k + 'CSS style set and retreived');
      } else if (k === 'background-color') {
        ok ((div.css(k) === css[k] || div.css(k) === 'rgb(0, 128, 0)'), k + 'CSS style set and retreived');
      } else {
        equal(div.css(k), css[k], k + 'CSS style set and retreived');
      }
    }

  });

  test('Add / Remove Class', function () {
    div = VM('div', {'class': 'test0'});

    equal(div.attrs('class'), 'test0', 'Initial class added on element');

    div.addClass('test1');

    equal(div.attrs('class'), 'test0 test1', 'Added a class');

    div.removeClass('test0');

    equal(div.attrs('class'), 'test1', 'Added a class');

    div.addClass('test2 test3');

    equal(div.attrs('class'), 'test1 test2 test3', 'Added two classes at once');

    div.removeClass('test1');
    div.removeClass('test2');
    div.removeClass('test3');

    equal(div.attrs('class'), '', 'All classes removed');

  });

})(viewMachine);