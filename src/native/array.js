/**
 * The Array class extentions
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(Array.prototype, {
  /**
   * returns the index of the value in the array
   *
   * @param mixed value
   * @param Integer optional offset
   * @return Integer index or -1 if not found
   */
  indexOf: Array.prototype.indexOf || function(value, from) {
    for (var i=(from<0) ? Math.max(0, this.length+from) : from || 0; i < this.length; i++)
      if (this[i] === value)
        return i;
    return -1;
  },
  
  /**
   * returns the last index of the value in the array
   *
   * @param mixed value
   * @return Integer index or -1 if not found
   */
  lastIndexOf: Array.prototype.lastIndexOf || function(value) {
    for (var i=this.length-1; i >=0; i--)
      if (this[i] === value)
        return i;
    return -1;
  },
  
  /**
   * calls the given callback function in the given scope for each element of the array
   *
   * NOTE: it return the array by itself
   *
   * @param Function callback
   * @param Object scope
   * @return Array this
   */
  each: function(callback, scope) {
    try {
      this.forEach(callback, scope);
    } catch(e) { if (!(e instanceof Break)) throw(e); }
    
    return this;
  },
  // recatching the original JS 1.6 method 
  forEach: Array.prototype.forEach || function(callback, scope) {
    for (var i=0; i < this.length; i++)
      callback.apply(scope, [this[i], i, this]);
  },
  
  /**
   * returns the first element of the array
   *
   * @return mixed first element of the array
   */
  first: function() {
    return this[0];
  },
  
  /**
   * returns the last element of the array
   *
   * @return mixed last element of the array
   */
  last: function() {
    return this[this.length-1];
  },
  
  /**
   * returns a random item of the array
   *
   * @return mixed a random item
   */
  random: function() {
    return this.length ? this[Math.random(this.length-1)] : null;
  },
  
  /**
   * returns the array size
   *
   * @return Integer the array size
   */
  size: function() {
    return this.length;
  },
  
  /**
   * cleans the array
   * @return Array this
   */
  clean: function() {
    this.length = 0;
    return this;
  },
  
  /**
   * checks if the array has no elements in it
   *
   * @return boolean check result
   */
  empty: function() {
    return !this.length;
  },
  
  /**
   * creates a copy of the given array
   *
   * @return Array copy of the array
   */
  clone: function() {
    return [].concat(this);
  },
  
  /**
   * applies the given lambda to each element in the array
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array self
   */
  walk: function(callback, scope) {
    var func = function(value, i) {
      this[i] = callback.apply(scope, [value, i, this]);
    };
    if (isString(callback)) {
      var args = $A(arguments).slice(1), func = function(value, i) {
        this[i] = this._call(callback, args, i);
      };
    }
    this.each(func, this)
      
    return this;
  },
  
  /**
   * creates a list of the array items which are matched in the given callback function
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array filtered copy
   */
  select: function(callback, scope) {
    var collection = [], func = function(value, i) {
      if (callback.apply(scope, [value, i, this]))
        collection.push(value);
    };
    if (isString(callback)) {
      var args = $A(arguments).slice(1), func = function(value, i) {
        if (this._call(callback, args, i))
          collection.push(value);
      };
    }
    this.each(func, this);
    
    return collection;
  },
  
  /**
   * creates a list of the array items converted in the given callback function
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array collected
   */
  collect: function(callback, scope) {
    var collection = [], func = function(value, i) {
      collection.push(callback.apply(scope, [value, i, this]));
    };
    if (isString(callback)) {
      var args = $A(arguments).slice(1), func = function(value, i) {
        collection.push(this._call(callback, args, i));
      };
    }
    this.each(func, this);
    
    return collection;
  },
  
  /**
   * concats all the arrays passed as the arguments
   * NOTE: this method _will_change_ the array by itself
   *
   * @param Array to concat
   * ....................
   * @return Array this
   */
  concat: function() {
    for (var i=0; i < arguments.length; i++) {
      if (isArray(arguments[i])) {
        for (var j=0; j < arguments[i].length; j++) {
          this.push(arguments[i][j]);
        }
      } else {
        this.push(arguments[i]);
      }
    }
    return this;
  },
  
  /**
   * similar to the concat function but it adds only the values which are not on the list yet
   * NOTE: this method _will_change_ the array by itself
   *
   * @param Array to merge
   * ....................
   * @return Array self
   */
  merge: function() {
    for (var i=0; i < arguments.length; i++) {
      if (isArray(arguments[i])) {
        for (var j=0; j < arguments[i].length; j++) {
          if (!this.includes(arguments[i][j]))
            this.push(arguments[i][j]);
        }
      } else {
        this.merge([arguments[i]]);
      }
    }
    return this;
  },
  
  /**
   * flats out complex array into a single dimension array
   *
   * @return Array flatten copy
   */
  flatten: function() {
    for (var copy = [], i=0; i < this.length; i++) {
      if (this[i] instanceof Array) {
        var flat = this[i].flatten();
        for (var j=0; j < flat.length; j++) {
          copy.push(flat[j]);
        }
      } else {
        copy.push(this[i]);
      }
    }
    return copy;
  },
  
  /**
   * returns a copy of the array whithout any null or undefined values
   *
   * @return Array filtered version
   */
  compact: function() {
    for (var copy = [], i=0; i < this.length; i++)
      if (this[i] != null && this[i] !== undefined)
        copy.push(this[i]);
    return copy;
  },
  
  /**
   * returns a copy of the array which contains only the unique values
   *
   * @return Array filtered copy
   */
  uniq: function() {
    for (var copy = [], i=0; i < this.length; i++)
      if (!copy.includes(this[i]))
        copy.push(this[i]);
    return copy;
  },
  
  /**
   * checks if all of the given values
   * exists in the given array
   *
   * @param mixed value
   * ....
   * @return boolean check result
   */
  includes: function() {
    for (var i=0; i < arguments.length; i++)
      if (this.indexOf(arguments[i]) == -1)
        return false;
    return true;
  },
  
  /**
   * returns a copy of the array without the items passed as the arguments
   *
   * @param mixed value
   * ......
   * @return Array filtered copy
   */
  without: function() {
    for (var filter = $A(arguments), copy = [], i=0; i < this.length; i++)
      if (!filter.includes(this[i]))
        copy.push(this[i]);
    return copy;
  },
  
  /**
   * checks if any of the array elements is logically true
   *
   * @param Function optional callback for checks
   * @param Object optional scope for the callback
   * @return Boolean check result
   */
  any: function(callback, scope) {
    var func = function(value) { return !!value; };
    if (isString(callback)) {
      var args = $A(arguments).slice(1), func = function(value, i) {
        return this._call(callback, args, i);
      };
    } else if (callback) {
      func = callback;
    }
    for (var i=0; i < this.length; i++) {
      if (func.apply(this, [this[i], i, this]))
        return true;
    }
    return false;
  },
  
  /**
   * checks if all the array elements are logically true
   *
   * @param Function optional callback for checks
   * @param Object optional scope for the callback
   * @return Boolean check result
   */
  all: function(callback, scope) {
    var func = function(value) { return !!value; };
    if (isString(callback)) {
      var args = $A(arguments).slice(1), func = function(value, i) {
        return this._call(callback, args, i);
      };
    } else if (callback) {
      func = callback;
    }
    for (var i=0; i < this.length; i++) {
      if (!func.apply(this, [this[i], i, this]))
        return false;
    }
    
    return true;
  },
  
// private
  _call: function(attr, args, i) {
    return isFunction(this[i][attr]) ? this[i][attr].apply(this[i], [].merge(args).merge([this[i], i, this])) : this[i][attr];
  }
});