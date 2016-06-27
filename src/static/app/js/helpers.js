// For convenience...
/**
 * https://gist.github.com/1049426
 *
 * Usage:
 *
 *   "{0} is a {1}".format("Tim", "programmer");
 *
 */
String.prototype.format = function(i, safe, arg) {
  function format() {
      var str = this,
          len = arguments.length+1;

      for (i=0; i < len; arg = arguments[i++]) {
          safe = typeof arg === 'object' ? JSON.stringify(arg) : arg;
          str = str.replace(RegExp('\\{'+(i-1)+'\\}', 'g'), safe);
      }
      return str;
  }
  format.native = String.prototype.format;
  return format;
}();

angular.module('percentage', [])
.filter('percentage', function ($window) {
    return function (input, decimals, suffix) {
        decimals = angular.isNumber(decimals)? decimals :  3;
        suffix = suffix || '%';
        if ($window.isNaN(input)) {
            return '';
        }
        return Math.round(input * Math.pow(10, decimals + 2))/Math.pow(10, decimals) + suffix
    };
});
angular.module('km2', [])
.filter('km2', function ($window) {
    return function (input, decimals, suffix) {
        suffix = suffix || ' km²';
        if ($window.isNaN(parseFloat(input))) {
            return '';
        }
        return input + suffix
    };
});

var map;
var TILE_SIZE = 256;

function bound(value, opt_min, opt_max) {
  if (opt_min != null) value = Math.max(value, opt_min);
  if (opt_max != null) value = Math.min(value, opt_max);
  return value;
}

function degreesToRadians(deg) {
  return deg * (Math.PI / 180);
}

function radiansToDegrees(rad) {
  return rad / (Math.PI / 180);
}

/** @constructor */
function MercatorProjection() {
  this.pixelOrigin_ = new google.maps.Point(TILE_SIZE / 2,
      TILE_SIZE / 2);
  this.pixelsPerLonDegree_ = TILE_SIZE / 360;
  this.pixelsPerLonRadian_ = TILE_SIZE / (2 * Math.PI);
}

MercatorProjection.prototype.fromLatLngToPoint = function(latLng,
    opt_point) {
  var me = this;
  var point = opt_point || new google.maps.Point(0, 0);
  var origin = me.pixelOrigin_;

  point.x = origin.x + latLng.lng() * me.pixelsPerLonDegree_;

  // Truncating to 0.9999 effectively limits latitude to 89.189. This is
  // about a third of a tile past the edge of the world tile.
  var siny = bound(Math.sin(degreesToRadians(latLng.lat())), -0.9999,
      0.9999);
  point.y = origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) *
      -me.pixelsPerLonRadian_;
  return point;
};

MercatorProjection.prototype.fromPointToLatLng = function(point) {
  var me = this;
  var origin = me.pixelOrigin_;
  var lng = (point.x - origin.x) / me.pixelsPerLonDegree_;
  var latRadians = (point.y - origin.y) / -me.pixelsPerLonRadian_;
  var lat = radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) -
      Math.PI / 2);
  return new google.maps.LatLng(lat, lng);
};
