angular.module('chatMod').controller('RoomCtrl', function ($scope, $routeParams, $http, $rootScope, $location, session) {
    if (!$rootScope.user) {
        session.check();
        return;
    }

    let _id = $routeParams._id;

    let socket = io.connect('/');
    socket.on('message', function (message) {
        $scope.room.messages.push(message);
        $scope.$apply();
    });

    $http({
        url: `/room/${_id}`,
        method: 'GET'
    }).success(function (result) {
        if (result.code == 0) {
            $scope.room = result.data;
            socket.emit('enter room', {_id, user: $rootScope.user._id});
        } else {
            $scope.error = result.error;
        }
    });

    $scope.leaveRoom = function () {
        socket.emit('leave room', {_id, user: $rootScope.user._id});
        $location.path('/rooms');
    };

    $scope.send = function () {
        socket.emit('message', {user: $rootScope.user._id, content: $scope.content, createAt: new Date()});
    };
});

angular.module('chatMod').directive('keyDown', function () {
    return {
        link: function (scope, element, attr) {
            let ctrl = false,
                cancel = null;
            element.on('keydown', function (e) {
                let keyCode = e.keyCode;
                if (keyCode == 17) {
                    ctrl = true;
                    window.clearTimeout(cancel);
                    cancel = window.setTimeout(function () {
                        ctrl = false;
                    }, 500);
                    return;
                }
                if (keyCode == 13) {
                    if (ctrl) {
                        element.val(element.val() + '\n');
                        return;
                    }
                    e.preventDefault();
                    scope.send();
                }
            });
        }
    }
});
