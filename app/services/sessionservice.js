angular.module('chatMod').factory('session', function ($http, $rootScope, $location) {
    return {
        check(){
            return $http({
                url: 'user/session',
                method: 'GET'
            }).success(function (result) {
                if (result.code == 0) {
                    $rootScope.user = result.data;
                } else {
                    $location.path('/');
                }
            })
        }
    }
});
