angular.module('chatMod').controller('LoginCtrl', function ($scope, $rootScope, $location, $http) {
    $scope.login = function () {
        $http({
            url: '/user/login',
            method: 'POST',
            data: {email: $scope.email}
        }).success(function (result) {
            if (result.code == 0) {
                $rootScope.user = result.data;
                $location.path('/rooms');
            } else {
                $rootScope.error = result.error;
            }
        })
    }
});