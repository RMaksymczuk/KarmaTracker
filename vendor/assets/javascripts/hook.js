/**
 * Hook
 * Version: 1.1
 * Author: Jordan Singer, Brandon Jacoby, Adam Girton
 * Copyright (c) 2013 - Hook.  All rights reserved.
 * http://www.usehook.com
 */

;(function ( $, window, document, undefined ) {
    var win = $(this),
            st = win.scrollTop() || window.pageYOffset,
            called = false;

    var hasTouch = function() {
              return !!('ontouchstart' in window) || !!('onmsgesturechange' in window);
            };


      var methods = {

        init: function(options) {

                return this.each(function() {
                    called = false;
                    var $this = $(this),
                        settings = $this.data('hook');

                        if(typeof(settings) === 'undefined') {

                                var defaults = {
                                    reloadPage: true, // if false will reload element
                                    dynamic: false, // if false Hook elements already there
                                    textRequired: false, // will input loader text if true
                                    scrollWheelSelected: true, // will use scroll wheel events
                                    swipeDistance: 200, // swipe distance for loader to show on touch devices
                                    loaderClass: 'hook-loader',
                                    spinnerClass: 'hook-spinner',
                                    loaderTextClass: 'pulled-alert',
                                    loaderText: 'Refreshing projects could take a few minutes and updated list of projects and tasks should appear shortly.',
                                    reloadEl: function() {}
                                };

                                settings = $.extend({},  defaults, options);

                                $this.data('hook', settings);
                        } else {

                                settings = $.extend({}, settings, options);
                        }
                        if(settings.dynamic === true) {
                             var loaderElem = '<div class=' + settings.loaderClass + '>';
                                     loaderElem += '<div class='+ settings.spinnerClass + '/>';
                                     loaderElem += '</div>';
                             var spinnerTextElem = '<span class='+ settings.loaderTextClass + '>' + settings.loaderText + '</span>';

                             $this
                                     .append(loaderElem);

                             if (settings.textRequired === true) {
                                  $this.addClass('hook-with-text');
                                  $this.append(spinnerTextElem);
                             }
                        }

                        if(!hasTouch()) {
			  
                            if(settings.scrollWheelSelected === true){
                              win.on('mousewheel', function(event, delta) {
                                  methods.onScroll($this, settings, delta);
                              });
                            } else {
                              win.on('scroll', function() {
                                  methods.onScroll($this, settings);
                              });
                            }
                        }  else {

                            var lastY = 0,
                                 swipe = 0;
                            win.on('touchstart', function(e){

                                lastY = e.originalEvent.touches[0].pageY;

                            });

                            win.on('touchmove', function(e) {

                                swipe = e.originalEvent.touches[0].pageY;
                                st = $(this).scrollTop();

                                if(swipe < settings.swipeDistance) {
                                  e.preventDefault();
                                }

                                if(swipe > settings.swipeDistance && swipe > lastY && lastY <= 140) {
                                    methods.onSwipe($this, settings);

                                }
                            });

                            win.on('touchend', function(){
                                swipe = 0;
                            });
                        }
                });
        },

        onScroll: function(el, settings, delta) {
          st = win.scrollTop();

          if(settings.scrollWheelSelected === true && (delta >= 150 && st <= 0)) {
              if(called === false) {
                  methods.reload(el, settings);
                  called = true;
              }
          }

          if(settings.scrollWheelSelected === false && st <= 0) {
            if(called === false) {
                methods.reload(el, settings);
                called = true;
            }
          }
        },

        onSwipe: function(el, settings) {
            if(st <= 0) {
	        if(called == false)
		    methods.reload(el, settings);
		    called = true;
            }
        },

        reload: function(el, settings) {
                el.show();
                el.css("margin-top", "180px");
                el.delay(200).css("margin-top", "120px");
                setTimeout(function () {
                    if(settings.reloadPage) {
                        window.location.reload(true);
                    }
                    if(!settings.reloadPage) {
                        settings.reloadEl();
                    }

                    called = false;
                }, 1000);
                

        },

        destroy: function() {
            return $(this).each(function(){
                var $this = $(this);

                $this.empty();
                $this.removeData('hook');
                called = true;
            });
        }
    };

    $.fn.hook = function () {
        var method = arguments[0];

        if(methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) === 'object' || !method) {
            method = methods.init;
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.pluginName' );
                        return this;
        }

        return method.apply(this, arguments);
    };

})( jQuery, window, document );