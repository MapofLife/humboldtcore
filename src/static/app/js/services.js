'use strict';

/* Services */


// Service to get Species Info from CartoDB
var molServices = angular.module('mol.services', []);
molServices.factory(
	'molApiVersion', [
		function() {
	     return "0.x"
 	  }
  ]
);
