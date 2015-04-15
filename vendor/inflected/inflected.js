(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Inflector = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./lib/Inflector');

},{"./lib/Inflector":3}],2:[function(require,module,exports){
(function (process){
'use strict';

var hasProp = require('./hasProp');
var remove  = require('./remove');
var icPart  = require('./icPart');

function Inflections() {
  this.plurals = [];
  this.singulars = [];
  this.uncountables = [];
  this.humans = [];
  this.acronyms = {};
  this.acronymRegex = /(?=a)b/;
}

Inflections.getInstance = function(locale) {
  process.__Inflector_Inflections = process.__Inflector_Inflections || {};
  process.__Inflector_Inflections[locale] = process.__Inflector_Inflections[locale] || new Inflections();

  return process.__Inflector_Inflections[locale];
};

Inflections.prototype.acronym = function(word) {
  this.acronyms[word.toLowerCase()] = word;

  var values = [];

  for (var key in this.acronyms) {
    if (hasProp(this.acronyms, key)) {
      values.push(this.acronyms[key]);
    }
  }

  this.acronymRegex = new RegExp(values.join('|'));
};

Inflections.prototype.plural = function(rule, replacement) {
  if (typeof rule === 'string') {
    remove(this.uncountables, rule);
  }

  remove(this.uncountables, replacement);
  this.plurals.unshift([rule, replacement]);
};

Inflections.prototype.singular = function(rule, replacement) {
  if (typeof rule === 'string') {
    remove(this.uncountables, rule);
  }

  remove(this.uncountables, replacement);
  this.singulars.unshift([rule, replacement]);
};

Inflections.prototype.irregular = function(singular, plural) {
  remove(this.uncountables, singular);
  remove(this.uncountables, plural);

  var s0 = singular[0];
  var sRest = singular.substr(1);

  var p0 = plural[0];
  var pRest = plural.substr(1);

  if (s0.toUpperCase() === p0.toUpperCase()) {
    this.plural(new RegExp('(' + s0 + ')' + sRest + '$', 'i'), '$1' + pRest);
    this.plural(new RegExp('(' + p0 + ')' + pRest + '$', 'i'), '$1' + pRest);

    this.singular(new RegExp('(' + s0 + ')' + sRest + '$', 'i'), '$1' + sRest);
    this.singular(new RegExp('(' + p0 + ')' + pRest + '$', 'i'), '$1' + sRest);
  } else {
    var sRestIC = icPart(sRest);
    var pRestIC = icPart(pRest);

    this.plural(new RegExp(s0.toUpperCase() + sRestIC + '$'), p0.toUpperCase() + pRest);
    this.plural(new RegExp(s0.toLowerCase() + sRestIC + '$'), p0.toLowerCase() + pRest);
    this.plural(new RegExp(p0.toUpperCase() + pRestIC + '$'), p0.toUpperCase() + pRest);
    this.plural(new RegExp(p0.toLowerCase() + pRestIC + '$'), p0.toLowerCase() + pRest);

    this.singular(new RegExp(s0.toUpperCase() + sRestIC + '$'), s0.toUpperCase() + sRest);
    this.singular(new RegExp(s0.toLowerCase() + sRestIC + '$'), s0.toLowerCase() + sRest);
    this.singular(new RegExp(p0.toUpperCase() + pRestIC + '$'), s0.toUpperCase() + sRest);
    this.singular(new RegExp(p0.toLowerCase() + pRestIC + '$'), s0.toLowerCase() + sRest);
  }
};

Inflections.prototype.uncountable = function() {
  var words = Array.prototype.slice.call(arguments, 0);
  this.uncountables = this.uncountables.concat(words);
};

Inflections.prototype.human = function(rule, replacement) {
  this.humans.unshift([rule, replacement]);
};

Inflections.prototype.clear = function(scope) {
  scope = scope || 'all';

  if (scope === 'all') {
    this.plurals = [];
    this.singulars = [];
    this.uncountables = [];
    this.humans = [];
  } else {
    this[scope] = [];
  }
};

module.exports = Inflections;

}).call(this,require('_process'))
},{"./hasProp":7,"./icPart":8,"./remove":10,"_process":11}],3:[function(require,module,exports){
'use strict';

var Inflections     = require('./Inflections');
var Transliterator  = require('./Transliterator');
var Methods         = require('./Methods');
var defaults        = require('./defaults');
var isFunc          = require('./isFunc');

var Inflector = Methods;

Inflector.inflections = function(locale, fn) {
  if (isFunc(locale)) {
    fn = locale;
    locale = null;
  }

  locale = locale || 'en';

  if (fn) {
    fn(Inflections.getInstance(locale));
  } else {
    return Inflections.getInstance(locale);
  }
};

Inflector.transliterations = function(locale, fn) {
  if (isFunc(locale)) {
    fn = locale;
    locale = null;
  }

  locale = locale || 'en';

  if (fn) {
    fn(Transliterator.getInstance(locale));
  } else {
    return Transliterator.getInstance(locale);
  }
}

for (var locale in defaults) {
  Inflector.inflections(locale, defaults[locale]);
}

module.exports = Inflector;

},{"./Inflections":2,"./Methods":4,"./Transliterator":5,"./defaults":6,"./isFunc":9}],4:[function(require,module,exports){
'use strict';

var Methods = {
  pluralize: function(word, locale) {
    locale = locale || 'en';

    return this._applyInflections(word, this.inflections(locale).plurals);
  },

  singularize: function(word, locale) {
    locale = locale || 'en';

    return this._applyInflections(word, this.inflections(locale).singulars);
  },

  camelize: function(term, uppercaseFirstLetter) {
    if (uppercaseFirstLetter === null || uppercaseFirstLetter === undefined) {
      uppercaseFirstLetter = true;
    }

    var result = '' + term, self = this;

    if (uppercaseFirstLetter) {
      result = result.replace(/^[a-z\d]*/, function(a) {
        return self.inflections().acronyms[a] || self.capitalize(a);
      });
    } else {
      result = result.replace(new RegExp('^(?:' + this.inflections().acronymRegex.source + '(?=\\b|[A-Z_])|\\w)'), function(a) {
        return a.toLowerCase();
      });
    }

    result = result.replace(/(?:_|(\/))([a-z\d]*)/gi, function(match, a, b, idx, string) {
      a || (a = '');
      return '' + a + (self.inflections().acronyms[b] || self.capitalize(b));
    });

    return result;
  },

  underscore: function(camelCasedWord) {
    var result = '' + camelCasedWord;

    result = result.replace(new RegExp('(?:([A-Za-z\\d])|^)(' + this.inflections().acronymRegex.source + ')(?=\\b|[^a-z])', 'g'), function(match, $1, $2) {
      return '' + ($1 || '') + ($1 ? '_' : '') + $2.toLowerCase();
    });

    result = result.replace(/([A-Z\d]+)([A-Z][a-z])/g, '$1_$2');
    result = result.replace(/([a-z\d])([A-Z])/g, '$1_$2');
    result = result.replace(/-/g, '_');

    return result.toLowerCase();
  },

  humanize: function(lowerCaseAndUnderscoredWord, options) {
    var result = '' + lowerCaseAndUnderscoredWord;
    var humans = this.inflections().humans;
    var human, rule, replacement;
    var self = this;

    options = options || {};

    if (options.capitalize === null || options.capitalize === undefined) {
      options.capitalize = true;
    }

    for (var i = 0, ii = humans.length; i < ii; i++) {
      human = humans[i];
      rule = human[0];
      replacement = human[1];

      if (rule.test && rule.test(result) || result.indexOf(rule) > -1) {
        result = result.replace(rule, replacement);
        break;
      }
    }

    result = result.replace(/_id$/, '');
    result = result.replace(/_/g, ' ');

    result = result.replace(/([a-z\d]*)/gi, function(match) {
      return self.inflections().acronyms[match] || match.toLowerCase();
    });

    if (options.capitalize) {
      result = result.replace(/^\w/, function(match) {
        return match.toUpperCase();
      });
    }

    return result;
  },

  capitalize: function(str) {
    var result = str === null || str === undefined ? '' : String(str);
    return result.charAt(0).toUpperCase() + result.slice(1);
  },

  titleize: function(word) {
    return this.humanize(this.underscore(word)).replace(/(^|[\s¿\/]+)([a-z])/g, function(match, boundary, letter, idx, string) {
      return match.replace(letter, letter.toUpperCase());
    });
  },

  tableize: function(className) {
    return this.pluralize(this.underscore(className));
  },

  classify: function(tableName) {
    return this.camelize(this.singularize(tableName.replace(/.*\./g, '')));
  },

  dasherize: function(underscoredWord) {
    return underscoredWord.replace(/_/g, '-');
  },

  foreignKey: function(className, separateWithUnderscore) {
    if (separateWithUnderscore === null || separateWithUnderscore === undefined) {
      separateWithUnderscore = true;
    }

    return this.underscore(className) + (separateWithUnderscore ? '_id' : 'id');
  },

  ordinal: function(number) {
    var absNumber = Math.abs(Number(number));
    var mod100 = absNumber % 100;

    if (mod100 === 11 || mod100 === 12 || mod100 === 13) {
      return 'th';
    } else {
      switch (absNumber % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    }
  },

  ordinalize: function(number) {
    return '' + number + this.ordinal(number);
  },

  transliterate: function(string, options) {
    options = options || {};

    var locale      = options.locale || 'en';
    var replacement = options.replacement || '?';

    return this.transliterations(locale).transliterate(string, replacement);
  },

  parameterize: function(string, options) {
    options = options || {};

    if (options.separator === undefined) {
      options.separator = '-';
    }

    if (options.separator === null) {
      options.separator = '';
    }

    // replace accented chars with their ascii equivalents
    var result = this.transliterate(string, options);

    result = result.replace(/[^a-z0-9\-_]+/ig, options.separator);

    if (options.separator.length) {
      var separatorRegex = new RegExp(options.separator);

      // no more than one of the separator in a row
      result = result.replace(new RegExp(separatorRegex.source + '{2,}'), options.separator);

      // remove leading/trailing separator
      result = result.replace(new RegExp('^' + separatorRegex.source + '|' + separatorRegex.source + '$', 'i'), '');
    }

    return result.toLowerCase();
  },

  _applyInflections: function(word, rules) {
    var result = '' + word, rule, regex, replacement;

    if (result.length === 0) {
      return result;
    } else {
      var match = result.toLowerCase().match(/\b\w+$/);

      if (match && this.inflections().uncountables.indexOf(match[0]) > -1) {
        return result;
      } else {
        for (var i = 0, ii = rules.length; i < ii; i++) {
          rule = rules[i];

          regex = rule[0];
          replacement = rule[1];

          if (result.match(regex)) {
            result = result.replace(regex, replacement);
            break;
          }
        }

        return result;
      }
    }
  }
};

module.exports = Methods;

},{}],5:[function(require,module,exports){
(function (process){
'use strict';

var DEFAULT_APPROXIMATIONS = {
  'À': 'A',   'Á': 'A',   'Â': 'A',   'Ã': 'A',   'Ä': 'A',   'Å': 'A',   'Æ': 'AE',
  'Ç': 'C',   'È': 'E',   'É': 'E',   'Ê': 'E',   'Ë': 'E',   'Ì': 'I',   'Í': 'I',
  'Î': 'I',   'Ï': 'I',   'Ð': 'D',   'Ñ': 'N',   'Ò': 'O',   'Ó': 'O',   'Ô': 'O',
  'Õ': 'O',   'Ö': 'O',   '×': 'x',   'Ø': 'O',   'Ù': 'U',   'Ú': 'U',   'Û': 'U',
  'Ü': 'U',   'Ý': 'Y',   'Þ': 'Th',  'ß': 'ss',  'à': 'a',   'á': 'a',   'â': 'a',
  'ã': 'a',   'ä': 'a',   'å': 'a',   'æ': 'ae',  'ç': 'c',   'è': 'e',   'é': 'e',
  'ê': 'e',   'ë': 'e',   'ì': 'i',   'í': 'i',   'î': 'i',   'ï': 'i',   'ð': 'd',
  'ñ': 'n',   'ò': 'o',   'ó': 'o',   'ô': 'o',   'õ': 'o',   'ö': 'o',   'ø': 'o',
  'ù': 'u',   'ú': 'u',   'û': 'u',   'ü': 'u',   'ý': 'y',   'þ': 'th',  'ÿ': 'y',
  'Ā': 'A',   'ā': 'a',   'Ă': 'A',   'ă': 'a',   'Ą': 'A',   'ą': 'a',   'Ć': 'C',
  'ć': 'c',   'Ĉ': 'C',   'ĉ': 'c',   'Ċ': 'C',   'ċ': 'c',   'Č': 'C',   'č': 'c',
  'Ď': 'D',   'ď': 'd',   'Đ': 'D',   'đ': 'd',   'Ē': 'E',   'ē': 'e',   'Ĕ': 'E',
  'ĕ': 'e',   'Ė': 'E',   'ė': 'e',   'Ę': 'E',   'ę': 'e',   'Ě': 'E',   'ě': 'e',
  'Ĝ': 'G',   'ĝ': 'g',   'Ğ': 'G',   'ğ': 'g',   'Ġ': 'G',   'ġ': 'g',   'Ģ': 'G',
  'ģ': 'g',   'Ĥ': 'H',   'ĥ': 'h',   'Ħ': 'H',   'ħ': 'h',   'Ĩ': 'I',   'ĩ': 'i',
  'Ī': 'I',   'ī': 'i',   'Ĭ': 'I',   'ĭ': 'i',   'Į': 'I',   'į': 'i',   'İ': 'I',
  'ı': 'i',   'Ĳ': 'IJ',  'ĳ': 'ij',  'Ĵ': 'J',   'ĵ': 'j',   'Ķ': 'K',   'ķ': 'k',
  'ĸ': 'k',   'Ĺ': 'L',   'ĺ': 'l',   'Ļ': 'L',   'ļ': 'l',   'Ľ': 'L',   'ľ': 'l',
  'Ŀ': 'L',   'ŀ': 'l',   'Ł': 'L',   'ł': 'l',   'Ń': 'N',   'ń': 'n',   'Ņ': 'N',
  'ņ': 'n',   'Ň': 'N',   'ň': 'n',   'ŉ': '\'n', 'Ŋ': 'NG',  'ŋ': 'ng',
  'Ō': 'O',   'ō': 'o',   'Ŏ': 'O',   'ŏ': 'o',   'Ő': 'O',   'ő': 'o',   'Œ': 'OE',
  'œ': 'oe',  'Ŕ': 'R',   'ŕ': 'r',   'Ŗ': 'R',   'ŗ': 'r',   'Ř': 'R',   'ř': 'r',
  'Ś': 'S',   'ś': 's',   'Ŝ': 'S',   'ŝ': 's',   'Ş': 'S',   'ş': 's',   'Š': 'S',
  'š': 's',   'Ţ': 'T',   'ţ': 't',   'Ť': 'T',   'ť': 't',   'Ŧ': 'T',   'ŧ': 't',
  'Ũ': 'U',   'ũ': 'u',   'Ū': 'U',   'ū': 'u',   'Ŭ': 'U',   'ŭ': 'u',   'Ů': 'U',
  'ů': 'u',   'Ű': 'U',   'ű': 'u',   'Ų': 'U',   'ų': 'u',   'Ŵ': 'W',   'ŵ': 'w',
  'Ŷ': 'Y',   'ŷ': 'y',   'Ÿ': 'Y',   'Ź': 'Z',   'ź': 'z',   'Ż': 'Z',   'ż': 'z',
  'Ž': 'Z',   'ž': 'z'
};

var DEFAULT_REPLACEMENT_CHAR = '?';

function Transliterator() {
  this.approximations = {};

  for (var c in DEFAULT_APPROXIMATIONS) {
    this.approximate(c, DEFAULT_APPROXIMATIONS[c]);
  }
}

Transliterator.getInstance = function(locale) {
  process.__Inflector_Transliterator = process.__Inflector_Transliterator || {};
  process.__Inflector_Transliterator[locale] = process.__Inflector_Transliterator[locale] || new Transliterator();

  return process.__Inflector_Transliterator[locale];
};

Transliterator.prototype.approximate = function(string, replacement) {
  this.approximations[string] = replacement;
};

Transliterator.prototype.transliterate = function(string, replacement) {
  var self = this;

  return string.replace(/[^\u0000-\u007f]/g, function(c) {
    return self.approximations[c] || replacement || DEFAULT_REPLACEMENT_CHAR;
  });
};

module.exports = Transliterator;

}).call(this,require('_process'))
},{"_process":11}],6:[function(require,module,exports){
'use strict';

function enDefaults(inflect) {
  inflect.plural(/$/, 's');
  inflect.plural(/s$/i, 's');
  inflect.plural(/^(ax|test)is$/i, '$1es');
  inflect.plural(/(octop|vir)us$/i, '$1i');
  inflect.plural(/(octop|vir)i$/i, '$1i');
  inflect.plural(/(alias|status)$/i, '$1es');
  inflect.plural(/(bu)s$/i, '$1ses');
  inflect.plural(/(buffal|tomat)o$/i, '$1oes');
  inflect.plural(/([ti])um$/i, '$1a');
  inflect.plural(/([ti])a$/i, '$1a');
  inflect.plural(/sis$/i, 'ses');
  inflect.plural(/(?:([^f])fe|([lr])f)$/i, '$1$2ves');
  inflect.plural(/(hive)$/i, '$1s');
  inflect.plural(/([^aeiouy]|qu)y$/i, '$1ies');
  inflect.plural(/(x|ch|ss|sh)$/i, '$1es');
  inflect.plural(/(matr|vert|ind)(?:ix|ex)$/i, '$1ices');
  inflect.plural(/^(m|l)ouse$/i, '$1ice');
  inflect.plural(/^(m|l)ice$/i, '$1ice');
  inflect.plural(/^(ox)$/i, '$1en');
  inflect.plural(/^(oxen)$/i, '$1');
  inflect.plural(/(quiz)$/i, '$1zes');

  inflect.singular(/s$/i, '');
  inflect.singular(/(ss)$/i, '$1');
  inflect.singular(/(n)ews$/i, '$1ews');
  inflect.singular(/([ti])a$/i, '$1um');
  inflect.singular(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)(sis|ses)$/i, '$1sis');
  inflect.singular(/(^analy)(sis|ses)$/i, '$1sis');
  inflect.singular(/([^f])ves$/i, '$1fe');
  inflect.singular(/(hive)s$/i, '$1');
  inflect.singular(/(tive)s$/i, '$1');
  inflect.singular(/([lr])ves$/i, '$1f');
  inflect.singular(/([^aeiouy]|qu)ies$/i, '$1y');
  inflect.singular(/(s)eries$/i, '$1eries');
  inflect.singular(/(m)ovies$/i, '$1ovie');
  inflect.singular(/(x|ch|ss|sh)es$/i, '$1');
  inflect.singular(/^(m|l)ice$/i, '$1ouse');
  inflect.singular(/(bus)(es)?$/i, '$1');
  inflect.singular(/(o)es$/i, '$1');
  inflect.singular(/(shoe)s$/i, '$1');
  inflect.singular(/(cris|test)(is|es)$/i, '$1is');
  inflect.singular(/^(a)x[ie]s$/i, '$1xis');
  inflect.singular(/(octop|vir)(us|i)$/i, '$1us');
  inflect.singular(/(alias|status)(es)?$/i, '$1');
  inflect.singular(/^(ox)en/i, '$1');
  inflect.singular(/(vert|ind)ices$/i, '$1ex');
  inflect.singular(/(matr)ices$/i, '$1ix');
  inflect.singular(/(quiz)zes$/i, '$1');
  inflect.singular(/(database)s$/i, '$1');

  inflect.irregular('person', 'people');
  inflect.irregular('man', 'men');
  inflect.irregular('child', 'children');
  inflect.irregular('sex', 'sexes');
  inflect.irregular('move', 'moves');
  inflect.irregular('zombie', 'zombies');

  inflect.uncountable('equipment', 'information', 'rice', 'money', 'species', 'series', 'fish', 'sheep', 'jeans', 'police');
}

module.exports = {
  en: enDefaults
};

},{}],7:[function(require,module,exports){
'use strict';

var hasOwnProp = Object.prototype.hasOwnProperty;

function hasProp(obj, key) {
  return hasOwnProp.call(obj, key);
}

module.exports = hasProp;

},{}],8:[function(require,module,exports){
'use strict';

function icPart(str) {
  return str.split('').map(function(c) { return '(?:' + [c.toUpperCase(), c.toLowerCase()].join('|') + ')'; }).join('')
}

module.exports = icPart;

},{}],9:[function(require,module,exports){
'use strict';

var toString = Object.prototype.toString;

function isFunc(obj) {
  return toString.call(obj) === '[object Function]';
}

module.exports = isFunc;

},{}],10:[function(require,module,exports){
'use strict';

var splice = Array.prototype.splice;

function remove(arr, elem) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === elem) {
       splice.call(arr, i, 1);
    }
  }
}

module.exports = remove;

},{}],11:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1])(1)
});