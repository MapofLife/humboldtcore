angular.module('mol.controllers')
    .controller('molHumboldtCoreHomeCtrl', ['$scope', '$rootScope', '$state',
        function($scope, $rootScope, $state) {
            $rootScope.pagetitle = $state.current.title;

            // Nothing much else here.
        }
    ]);
