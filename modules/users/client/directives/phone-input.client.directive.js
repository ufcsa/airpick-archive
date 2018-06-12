/**
 * author: Yinghan Ma
 */

(function () {
  'use strict';

  angular
    .module('users')
    .directive('phoneInput', phoneInput);

  phoneInput.$inject = ['$filter', '$browser'];

  function phoneInput($filter, $browser) {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function postLink(scope, element, attrs, ngModelCtrl) {
        // Phone input directive logic
        // ...
        var listener = function () {
          var value = element.val().replace(/[^0-9]/g, '');
          element.val($filter('tel')(value, false));
        };

        ngModelCtrl.$parsers.push(function (viewValue) {
          return viewValue.replace(/[^0-9]/g, '').slice(0, 10);
        });

        ngModelCtrl.$render = function () {
          element.val($filter('tel')(ngModelCtrl.$viewValue, false));
        };

        element.bind('change', listener);
        element.bind('keydown', function (event) {
          var key = event.keyCode;
          // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
          // This lets us support copy and paste too
          if (key === 91 || (key > 15 && key < 19) || (key >= 37 && key <= 40)) {
            return;
          }
          $browser.defer(listener); // Have to do this or changes don't get picked up properly
        });

        element.bind('paste cut', function () {
          $browser.defer(listener);
        });
      }
    };
  }
}());
