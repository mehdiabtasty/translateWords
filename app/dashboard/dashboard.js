(function(angular) {
  "use strict";

    var app = angular.module('myApp.dashboard', ['firebase.auth', 'firebase', 'firebase.utils', 'ngRoute']);

    app.controller('dashboardCtrl', ['$scope', 'fbutil', 'user', '$firebaseObject', 'FBURL', 'translationCollection', 
        function ($scope, fbutil, user, $firebaseObject, FBURL, translationCollection) {
    // $scope.syncedValue = $firebaseObject(fbutil.ref('syncedValue'));
    // $scope.user = user;
    // $scope.FBURL = FBURL;
        $scope.translations = translationCollection;
        $scope.addTranslation = addTranslation;
        $scope.changePage = changePage;
        // $scope.saveTranslation = saveTranslation;

        function changePage(page) {

            console.log('page:', page)
        }
        function addTranslation(newTraduction) {
            if( newTraduction ) {
                var key =  newTraduction.key;
                var translation = {
                    key : key,
                    values : {
                        'fr': newTraduction.values.fr,
                        'en': newTraduction.values.en,
                        'es': newTraduction.values.es,
                        'de': newTraduction.values.de
                    }
                };
                $scope.translations.$add(translation);
            }
        }
        function saveTranslation(item) {
            $scope.toggleForm = false;
            // $scope.translations.$save(item).then(function(ref) {
            //     console.log(ref.key === $scope.translations[item].$id);
            // }, function(error) {
            //     console.log("Error:", error);
            // });
        }
    }]);

    app.factory('translationCollection', ['fbutil', '$firebaseArray', function(fbutil, $firebaseArray) {
        var ref = fbutil.ref('translation').limitToLast(10);
        return $firebaseArray(ref);
    }]);

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.whenAuthenticated('/dashboard', {
          templateUrl: 'dashboard/dashboard.html',
          controller: 'dashboardCtrl'
        });
    }]);

})(angular);

