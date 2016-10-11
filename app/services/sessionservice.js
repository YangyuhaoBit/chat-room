angular.module('chatMod').factory('session', function ($http, $rootScope,$location) {
    return {
        check(){
            return $http({
                url: '/session',
                method: 'GET'
            }).success(function (data) {
                if(!data){
                    $location.path('/');
                    return;
                }
                $rootScope.user = data;
            })
        }
    }
});
