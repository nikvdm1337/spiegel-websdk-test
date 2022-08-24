(function (window) {
    'use strict';
        // fire-off baseline event
        console.log('baseline');
        let SARAS_data_test = window.SARAS_data_test = []
        let cache = [];
        let pictureInteraction;

        function inArray(elem, array) {
            var i, length;
            for (i = 0, length = array.length; i < length; i++) {
                if (array[i] === elem) {
                    return i;
                }
            }
            return -1;
        }

 
        function each(object, callback) {
            var name;

            for (name in object) {
                if (object.hasOwnProperty(name) && callback.call(object[name], name, object[name]) === false) {
                    break;
                }
            }
        }

        /*
         * Throttle function borrowed from:
         * Underscore.js 1.5.2
         * http://underscorejs.org
         * (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
         * Underscore may be freely distributed under the MIT license.
         */
        function throttle(func, wait) {
            var context, args, result;
            var timeout = null;
            var previous = 0;
            const later = function () {
                previous = new Date;
                timeout = null;
                result = func.apply(context, args);
            };
            return function () {
                let now = new Date;
                if (!previous) {
                    previous = now;
                }
                let remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = func.apply(context, args);
                } else if (!timeout) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        }

        function calculatePercentages(docHeight) {
            return {
                '25%': parseInt(docHeight * 0.25, 10),
                '50%': parseInt(docHeight * 0.50, 10),
                '75%': parseInt(docHeight * 0.75, 10),
                // 1px cushion to trigger 100% event in iOS
                '100%': docHeight - 5
            };
        }

        function checkPercentages(percentages, scrollDistance) {
            each(percentages, function (key, val) {
                if (inArray(key, cache) === -1 && scrollDistance >= val) {
                        console.log('you have scrolled = ' + key);
                    cache.push(key);
                    SARAS_data_test.push({
                        event:{ 
                            info: {
                              action: 'scroll',
                              name: 'editorial - scrollDepth'
                            },
                            attributes: {
                              source:"launch|cc|scroll-track-engagement-tracker",
                              progress: key,
                              type: 'page'
                            }
                          }
                    })
                }
            });
        }

        window.onscroll = throttle(function () {

          /*
           * We calculate document and window height on each scroll event to
           * account for dynamic DOM changes.
           */

            const body = document.body,
                html = document.documentElement,
                docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight),
                winHeight = window.innerHeight || html.clientHeight,
                scrollTop = body.scrollTop || html.scrollTop,

                // recalculate percentages on every scroll
                percentages = calculatePercentages(docHeight),

                // see how far we've scrolled
                scrollDistance = scrollTop + winHeight;

            // if we've fired off all percentages, then return
            if (cache.length >= 4) {
                return;
            }

            // check for percentage scrolled and see if it matches any of our percentages
            checkPercentages(percentages, scrollDistance);

        }, 500);
}(window));
