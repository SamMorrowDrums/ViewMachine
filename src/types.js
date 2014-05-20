define([
  './core',
  './elements'
],function (viewMachine, document) {

  viewMachine.List = function (values) {
    var parent = 'ul',
        children = values,
        list;

    // Build an HTML UL, with just the values

    if (values.attrs) {
      parent = {type: 'ul', attrs: values.attrs};
      children = values.values;
    }

    // Create list, and extend it's methods

    list = viewMachine.parent(parent, 'li', children);

    viewMachine.extend(list, viewMachine.types.list);
    return list;
  };

  viewMachine.types.list = {
    values: function (values) {
      var temp = viewMachine.parent('ul', 'li', values);

      // Change contents of an exisitng list

      this.empty();
      this.mappend(temp.children());
    }
  };

  viewMachine.Select = function (values) {
    var parent = 'select',
        children = values;

    // Create a select element

    if (values.parent) {
      parent = {type: 'select', attrs: values.parent};
      children = values.children;
    }

    var select = viewMachine.parent(parent, 'option', children);

    viewMachine.extend(select, viewMachine.types.select);
    return select;
  };

  viewMachine.types.select = {
    options: function (values) {
      var temp = viewMachine.parent('select', 'option', values);

      // Change options of an exisitng select

      this.empty();
      this.mappend(temp.children());
    }
  };

  viewMachine.Table = function (data, keys, headings){
    //Constructs an HTML table El, binding to data, via an array key names, and an object/array with repeated keys
    var table = viewMachine('table');
    var header = viewMachine('thead');
    var body = viewMachine('tbody');
    var rows = keys.length;
    var temp, rowdata, text;
    var theHeadings = headings || keys;
    table.currentHeadings = theHeadings;
    header.append(viewMachine.parent('tr', 'th', theHeadings));
    table.append(header);
    for (var row in data) {
      if (data.hasOwnProperty(row)){
        temp = viewMachine('tr');
        for (var i = 0; i < rows; i++) {
          text = data[row][keys[i]];
          if (Array.isArray(text)){
            text = text.join(', ');
          }
          temp.append(viewMachine('td', {text: text } ) );
        }
        body.append(temp);
      }
    }
    table.append(body);
    table.preserve = false;
    table.keys = keys;
    viewMachine.extend(table, viewMachine.types.table);
    table.currentData = {};
    table.currentData = viewMachine.extend(table.currentData, data);
    return table;
  };
  viewMachine.properties.table = ['currentData', 'keys', 'currentHeadings'];
  viewMachine.types.table = {
    data: function (data){
      //Adds a data method, allowing you to update the data for the table automatically
      var rows = this.keys.length;
      var tempData;
      if (Array.isArray(data)) {
        tempData = [];
      } else {
        tempData = {};
      }
      var i = 0, temp, v = 0, text;
      for (var missingrow in this.currentData) {
        if (data[missingrow] === undefined){
          v++;
        } else {
          if (v > 0){
            this.children[1].splice(i, v);
          }
          i++;
          v = 0;
        }
      }
      if (v > 0){
        this.children[1].splice(i, v);
      }
      i = 0;
      for (var row in data) {
        if (data.hasOwnProperty(row)) {
          tempData[row] = data[row];
          if (! this.currentData.hasOwnProperty(row)) {
            temp = viewMachine('tr');
            for (var n = 0; n < rows; n++) {
              if (data[row].hasOwnProperty(this.keys[n])) {
                text = data[row][this.keys[n]];
                if (Array.isArray(text)){
                  text = text.join(', ');
                }
                temp.append(viewMachine('td', {text: text } ) );
              } else {
                temp.append(viewMachine('td') );
              }
            }
            this.children[1].splice(i, 0, temp);
          } else if ((JSON.stringify(this.currentData[row]) !== JSON.stringify(data[row]))) {
             //JSON Stringify is not the way to do this. Need to look at ways that I can tell what has changed
            for (var x = 0; x < rows; x++) {
              if (data[row].hasOwnProperty(this.keys[x])) {
                if (data[row][this.keys[x]] !== this.currentData[row][this.keys[x]]){
                  this.cell(i, x).text(data[row][this.keys[x]]);
                }
              }
            }
          }
          i++;
        }
      }
      this.currentData = tempData;
      return this;
    },
    headings: function (keys, headings) {
      //Change the rows / order of rows for a table, using the current data 
      this.currentHeadings = headings || keys;
      var tempData = {};
      tempData = viewMachine.extend(tempData, this.currentData);
      this.children()[0].splice(0, 1, new viewMachine.parent('tr', 'th', this.currentHeadings));
      this.data([]);
      this.keys = keys;
      this.data(tempData);
      return this;
    },
    cell: function (r, c){
      //Simple way to get access to any cell
      return this.children[1].children[r].children[c];
    }
  };

  viewMachine.Video = function (types, src, attrs) {
    var video = viewMachine('video', attrs);
    for (var type in types) {
      video.append( viewMachine( 'source', {src: src + '.' + types[type], type: 'video/' + types[type]} ) );
    }
    return video;
  };


  viewMachine.Image = function (src, preloadSrc, attrs) {
    var img = viewMachine('img', {src: preloadSrc, 'data-img': src});
    img.preload = preloadSrc;
    img.src = src;
    for (var attr in attrs) {
      img.properties[attr] = attrs[attr];
    }
    var source = new Image();
    source.onload = function () {
      img.properties.src = img.properties['data-img'];
      if (img.drawn) {
        img.draw();
      }
    };
    source.src = src;
    return img;
  };

  viewMachine.properties.img = ['src', 'preload'];

  return viewMachine;
});