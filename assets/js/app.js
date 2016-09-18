var app = angular.module('sctiApp', ['ngRoute', 'appRoutes', 'MainCtrl', 'UserAreaCtrl', 'HeaderCtrl', 'LoginCtrl', 'SignupCtrl', 'ForgotPasswordCtrl', 'NewPasswordCtrl', 'ScheduleCtrl', 'BugReportCtrl']);

app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});