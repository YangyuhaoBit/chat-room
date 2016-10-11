angular.module('chatMod').controller('RoomsCtrl', function ($scope, $location, $http, $rootScope, session) {
    if (!$rootScope.user) {
        session.check();
    }

    $http({
        url: '/rooms',
        method: 'GET'
    }).success(function (result) {
        if (result.code == 0) {
            $scope.rooms = result.data;
        }
    });

    $scope.createRoom = function () {
        if (!$scope.roomName) {
            return;
        }
        $http({
            url: '/rooms',
            method: 'POST',
            data: {room: $scope.roomName}
        }).success(function (result) {
            if (result.code == 0) {
                $scope.roomName = '';
                $scope.rooms.push(result.data);
            }
        })
    };

    $scope.enterRoom = function (_id) {
        $location.path(`/room/${_id}`);
    }
});
