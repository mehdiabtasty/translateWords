(function (angular) {
  "use strict";

  var app = angular.module('myApp.account', ['firebase', 'firebase.utils', 'firebase.auth', 'ngRoute']);

  app.controller('AccountCtrl', ['$scope', 'Auth', 'fbutil', 'user', '$location', '$firebaseObject', '$routeParams',
    function($scope, Auth, fbutil, user, $location, $firebaseObject, $routeParams) {
        var unbind;
        // create a 3-way binding with the user profile object in Firebase
        var profile = $firebaseObject(fbutil.ref('users', user.uid));
        profile.$bindTo($scope, 'profile').then(function(ub) { unbind = ub; });

        if ($routeParams.logout && $routeParams.logout === 'logout') {
            logout();
        }
        $scope.logout = logout;
    
        // expose logout function to scope
        function logout() {
        if( unbind ) { unbind(); }
            profile.$destroy();
            Auth.$signOut();
            $location.path('/login');
        };
    
        $scope.changePassword = function(pass, confirm, newPass) {
        resetMessages();
        if( !pass || !confirm || !newPass ) {
          $scope.err = 'Please fill in all password fields';
        }
        else if( newPass !== confirm ) {
          $scope.err = 'New pass and confirm do not match';
        }
        else {
          Auth.$updatePassword(newPass)
            .then(function() {
              $scope.msg = 'Password changed';
            }, function(err) {
              $scope.err = err;
            })
        }
        };
    
        $scope.clear = resetMessages;
    
        $scope.changeEmail = function(newEmail) {
        resetMessages();
        Auth.$updateEmail(newEmail)
          .then(function() {
            // store the new email address in the user's profile
            return fbutil.handler(function(done) {
              fbutil.ref('users', user.uid, 'email').set(newEmail, done);
            });
          })
          .then(function() {
            $scope.emailmsg = 'Email changed';
          }, function(err) {
            $scope.emailerr = err;
          });
        };
    
        function resetMessages() {
            $scope.err = null;
            $scope.msg = null;
            $scope.emailerr = null;
            $scope.emailmsg = null;
        }
    }
  ]);

  app.config(['$routeProvider', function($routeProvider) {
    // require user to be authenticated before they can access this page
    // this is handled by the .whenAuthenticated method declared in
    // components/router/router.js
    $routeProvider.whenAuthenticated('/account/:logout?', {
      templateUrl: 'account/account.html',
      controller: 'AccountCtrl'
    })
  }]);

})(angular);