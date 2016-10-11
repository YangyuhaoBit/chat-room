angular.module('chatMod').controller('LogoutCtrl', function ($rootScope, $http, $location) {
    $rootScope.user = null;
    $http({
        url: '/logout',
        method: 'GET'
    }).then(function () {
        $location.path('/');
    })
});
