/**
 * @module package/quiqqer/menu/bin/MenuBar
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require qui/QUI
 * @require qui/controls/Control
 * @require css!package/quiqqer/menu/bin/MenuBar.css
 */
define('package/quiqqer/menu/bin/MenuBar', [
    'qui/QUI',
    'qui/controls/Control',

    'css!package/quiqqer/menu/bin/MenuBar.css'
], function (QUI, QUIControl) {
    "use strict";

    return new Class({
        Type   : 'package/quiqqer/menu/bin/MenuBar',
        Extends: QUIControl,

        Binds: [
            'trigger',
            '$onInject'
        ],

        initialize: function (options) {
            this.parent(options);

            this.$children  = [];
            this.$Container = null;
            this.$show      = false;

            this.addEvents({
                onInject: this.$onInject
            });
        },

        /**
         * Create th DOMNode element of the menu
         *
         * @returns {HTMLDivElement}
         */
        create: function () {
            this.$Elm = new Element('div', {
                'class': 'quiqqer-menu-menubar',
                html   : '<div class="grid-container"></div>',
                styles : {
                    opacity: 0,
                    top    : -100
                }
            });

            this.$Container = this.$Elm.getElement('.grid-container');

            for (var i = 0, len = this.$children.length; i < len; i++) {
                this.$createChild(this.$children[i]).inject(this.$Container);
            }

            return this.$Elm;
        },

        /**
         * event: on inject
         */
        $onInject: function () {
            window.addEvent('scroll', this.trigger);
            this.trigger();
        },

        /**
         * display methods
         */

        /**
         * Trigger scroll event
         */
        trigger: function () {
            var scroll = window.getScroll();

            if (scroll.y <= 80) {
                this.hide();
                return;
            }

            this.show();
        },

        /**
         * show the bar
         */
        show: function () {
            if (this.$show) {
                return;
            }

            this.$show = true;
            this.fireEvent('show', [this]);

            moofx(this.$Elm).animate({
                opacity: 1,
                top    : 0
            });
        },

        /**
         * hide the bar
         */
        hide: function () {
            if (this.$show === false) {
                return;
            }

            this.$show = false;
            this.fireEvent('hide', [this]);

            moofx(this.$Elm).animate({
                opacity: 0,
                top    : -100
            });
        },

        /**
         * Children methods
         */

        /**
         * Add a children menu entry
         *
         * @param {Object} Child - {name:'', title: '', icon: ''} || QUI COntrol
         */
        appendChild: function (Child) {
            this.$children.push(Child);

            if (!this.$Elm) {
                return;
            }

            this.$createChild(Child).inject(this.$Container);
        },

        /**
         * Create the DOMNode of the menu item
         *
         * @param {Object} Child
         * @returns {HTMLElement}
         */
        $createChild: function (Child) {
            if ('getType' in Child) {
                Child.addEvent('onInject', function (Child) {
                    Child.getElm().addClass('quiqqer-menu-menubar-item');
                });

                return Child;
            }

            var Node = new Element('div', {
                'class': 'quiqqer-menu-menubar-item button'
            });

            if ("styles" in Child) {
                Node.setStyles(Child.styles);
            }

            if ("events" in Child) {
                Node.addEvents(Child.events);
            }


            if ("icon" in Child) {
                var Icon = new Element('span', {
                    'class': Child.icon
                });

                Icon.addClass('quiqqer-menu-menubar-item-icon');
                Icon.inject(Node);
            }

            if ("title" in Child) {
                var Title = new Element('span', {
                    'html': Child.title
                });

                Title.addClass('quiqqer-menu-menubar-item-title');
                Title.inject(Node);
            }

            return Node;
        }
    });
});