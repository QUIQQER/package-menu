
/**
 * @module package/quiqqer/menu/bin/DropDownMenu
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require qui/QUI
 * @require qui/controls/Control
 */
define('package/quiqqer/menu/bin/DropDownMenu', [

    'qui/QUI',
    'qui/controls/Control',
    'qui/utils/PageVisibility'

], function(QUI, QUIControl, QUIPageVisibilityUtils)
{
    "use strict";

    return new Class({

        Extends : QUIControl,
        Type : 'package/quiqqer/menu/bin/DropDownMenu',

        Binds : [
            '$onMouseEnter',
            '$onMouseLeave',
            '$onParentBlur',
            '$onParentEnter'
        ],

        initialize : function(options)
        {
            this.parent(options);

            this.addEvents({
                onImport : this.$onImport
            });
        },

        /**
         * event : on insert
         */
        $onImport : function()
        {
            var i, len, size, list, level,
                Elm, Parent;

            // parent events
            list = this.getElm().getChildren('ul').getChildren('li').flatten();

            for (i = 0, len = list.length; i < len; i++) {

                Parent = list[i];

                Parent.set({
                    'tabindex' : -1,
                    styles : {
                        outline : 'none'
                    }
                });

                Parent.addEvents({
                    blur : this.$onParentBlur,
                    mouseenter : this.$onParentEnter
                });
            }


            // children dropdown pos
            var getSize = function() {
                return this.getSize();
            };

            var elmMousedown = function(event) {
                event.stop();
            };

            list = this.getElm().getElements('.qui-menu-dropdown-children');

            for (i = 0, len = list.length; i < len; i++) {

                Elm = list[i];
                Parent = Elm.getParent();

                Elm.addEvents({
                    mousedown : elmMousedown
                });

                level = Elm.get('data-level');
                size = Parent.measure(getSize);

                if (level == 1) {

                    Elm.setStyles({
                        left : 0,
                        top : size.y
                    });

                    continue;
                }

                Parent.addEvents({
                    mouseenter : this.$onMouseEnter,
                    mouseleave : this.$onMouseLeave
                });

                Elm.setStyles({
                    left : size.x,
                    top : 0
                });
            }
        },

        /**
         *
         * @param {DOMEvent} event
         */
        $onMouseLeave : function(event)
        {
            var Target = event.target;
            var Children = Target.getElements('.qui-menu-dropdown-children');

            moofx(Children).animate({
                opacity : 0
            }, {
                duration : 250,
                callback : function() {
                    Children.setStyle('display', 'none');
                }
            });
        },

        /**
         *
         * @param {DOMEvent} event
         */
        $onMouseEnter : function(event)
        {
            var Target = event.target;
            var Child = Target.getChildren('.qui-menu-dropdown-children');

            if (Child) {
                Child.setStyle('opacity', 0);
                Child.setStyle('display', 'inline');

                moofx(Child).animate({
                    opacity : 1
                }, {
                    duration : 250
                });
            }
        },

        /**
         *
         * @param {DOMEvent} event
         */
        $onParentEnter : function(event)
        {
            if ("hasFocus" in document && !document.hasFocus()) {
                return;
            }

            this.$onMouseEnter(event);
            event.target.focus();
        },

        /**
         *
         * @param {DOMEvent} event
         */
        $onParentBlur : function(event)
        {
            var Children = event.target.getElements('.qui-menu-dropdown-children');

            moofx(Children).animate({
                opacity : 0
            }, {
                duration : 250,
                callback : function() {
                    Children.setStyle('display', 'none');
                }
            });
        }
    });
});