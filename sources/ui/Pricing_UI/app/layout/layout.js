'use strict';

angular
  .module('app.layout').directive('smartMenu', function ($rootScope) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var $body = $('body');

        var $collapsible = element.find('li[data-menu-collapse]');
        $collapsible.each(function (idx, li) {
          var $li = $(li);
          $li
            .on('click', '>a', function (e) {

              // collapse all open siblings
              $li.siblings('.open').smartCollapseToggle();

              // toggle element
              $li.smartCollapseToggle();

              // add active marker to collapsed element if it has active childs
              if (!$li.hasClass('open') && $li.find('li.active').length > 0) {
                $li.addClass('active');
              }

              e.preventDefault();
            })
            .find('>a').append('<b class="collapse-sign"><em class="fa fa-plus-square-o"></em></b>');

          // initialization toggle
          if ($li.find('li.active').length) {
            $li.smartCollapseToggle();
            $li.find('li.active').parents('li').addClass('active');
          }
        });

        // click on route link
        element.on('click', 'a[data-ui-sref]', function (e) {
          // collapse all siblings to element parents and remove active markers
          $(this)
            .parents('li').addClass('active')
            .each(function () {
              $(this).siblings('li.open').smartCollapseToggle();
              $(this).siblings('li').removeClass('active');
            });

          if ($body.hasClass('mobile-view-activated')) {
            $rootScope.$broadcast('requestToggleMenu');
          }
        });


        scope.$on('$smartLayoutMenuOnTop', function (event, menuOnTop) {
          if (menuOnTop) {
            $collapsible.filter('.open').smartCollapseToggle();
          }
        });

      }
    };
  });

angular.module('app.layout').directive('minifyMenu', function () {
  return {
    restrict: 'A',
    link: function (scope, element) {
      var $body = $('body');
      var minifyMenu = function () {
        /*
         alert($body.hasClass("menu-on-top"));
         alert($body.hasClass("minified"));
         alert($body.hasClass("hidden-menu"));
         */
        /*        if (!$body.hasClass("minified")) {
         $body.toggleClass("minified");
         $body.removeClass("hidden-menu");
         $('html').removeClass("hidden-menu-mobile-lock");
         }*/

        if (!$body.hasClass("menu-on-top")) {
          // alert("inside if");
          $body.toggleClass("minified");
          $body.removeClass("hidden-menu");
          $('html').removeClass("hidden-menu-mobile-lock");
        }
      };

      element.on('click', minifyMenu);
    }
  };
});

angular.module('app.layout').directive('toggleMenu', function () {
  return {
    restrict: 'A',
    link: function (scope, element) {
      var $body = $('body');

      var toggleMenu = function () {
        if (!$body.hasClass("menu-on-top")) {
          $('html').toggleClass("hidden-menu-mobile-lock");
          $body.toggleClass("hidden-menu");
          $body.removeClass("minified");
        } else if ($body.hasClass("menu-on-top") && $body.hasClass("mobile-view-activated")) {
          $('html').toggleClass("hidden-menu-mobile-lock");
          $body.toggleClass("hidden-menu");
          $body.removeClass("minified");
        }
      };

      element.on('click', toggleMenu);

      scope.$on('requestToggleMenu', function () {
        toggleMenu();
      });
    }
  };
});

angular.module('app.layout').directive('smartDatepicker', [ '$parse', function($parse) {
  return {
    restrict: 'A',
    link: function (scope, tElement, tAttributes) {
      tElement.removeAttr('smartDatepicker');

      var ngModel = $parse(tAttributes.ngModel);

      var onSelectCallbacks = [];
      if (tAttributes.minRestrict) {
        onSelectCallbacks.push(function (selectedDate) {
          $(tAttributes.minRestrict).datepicker('option', 'minDate', selectedDate);
        });
      }
      if (tAttributes.maxRestrict) {
        onSelectCallbacks.push(function (selectedDate) {
          $(tAttributes.maxRestrict).datepicker('option', 'maxDate', selectedDate);
        });
      }

      var options = {
        prevText: '<i class="fa fa-chevron-left"></i>',
        nextText: '<i class="fa fa-chevron-right"></i>',
        onSelect: function (selectedDate) {

          scope.$apply(function(scope){
            // Change binded variable
            ngModel.assign(scope, selectedDate);
          });

          angular.forEach(onSelectCallbacks, function (callback) {
            callback.call(this, selectedDate)
          })
        }
      };


      if (tAttributes.numberOfMonths) options.numberOfMonths = parseInt(tAttributes.numberOfMonths);

      if (tAttributes.dateFormat) options.dateFormat = tAttributes.dateFormat;

      if (tAttributes.defaultDate) options.defaultDate = tAttributes.defaultDate;

      if (tAttributes.changeMonth) options.changeMonth = tAttributes.changeMonth == "true";


      tElement.datepicker(options)
    }
  };
}]);
