/**
 * @module package/quiqqer/menu/bin/Controls/FloatedNav
 * @author www.pcsg.de (Michael Danielczok)
 *
 * @require qui/QUI
 * @require qui/controls/Control
 */
define('package/quiqqer/menu/bin/Controls/FloatedNav', [

    'qui/QUI',
    'qui/controls/Control',
    URL_OPT_DIR + 'bin/quiqqer-asset/animejs/animejs/lib/anime.min.js',

], function (QUI, QUIControl, anime) {
    'use strict';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/quiqqer/menu/bin/Controls/FloatedNav',

        Binds: [
            '$onImport'
        ],

        options: {
            pos              : 'right', // right, left
            animationtype    : 'showAll', // showAll (show entire control), showOneByOne (show each entry one by one)
            animationeasing  : 'easeOutExpo', // see easing names on https://easings.net/
            animationduration: 500, // number
        },

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onImport: this.$onImport
            });

            this.$Nav             = null;
            this.$entries         = null;
            this.$pos             = 'right';
            this.$animationType   = 'showAll';
            this.$animationEasing = 'easeOutExpo';
        },

        /**
         * event: on import
         */
        $onImport: function () {
            this.$Nav = this.getElm();

            if (this.$Nav.get('data-qui-options-animationtype')) {
                this.$animationType = this.$Nav.get('data-qui-options-animationtype');
            }

            if (this.$Nav.get('data-qui-options-animationeasing')) {
                this.$animationEasing = this.$getAnimationName(this.$Nav.get('data-qui-options-animationeasing'));
            }

            // animation type
            switch (this.$animationType) {
                case 'showAll':
                    this.$Nav.setStyles({
                        visibility: 'visible',
                        right     : -this.$Nav.getSize().x - 50
                    })

                    this.$show(this.$Nav);
                    break;

                case 'showOneByOne':
                    this.$entries = this.$Nav.querySelectorAll('.quiqqer-floatedNav-entry');

                    this.$entries.forEach(($Entry) => {
                        $Entry.setStyles({
                            visibility: 'visible',
                            transform : 'translateX(100px)'
                        });
                    })

                    this.$showOneByOne(this.$entries);
                    break;
            }
        },

        /**
         * Show nav entries one by one
         *
         * @param entries {HTMLCollection}
         */
        $showOneByOne: function (entries) {
            anime({
                targets   : entries,
                translateX: 0,
                duration  : 500,
                easing    : this.$animationEasing,
                delay     : anime.stagger(100, {start: 750})
            });
        },

        /**
         * Show nav
         *
         * @param Elm {HTMLElement}
         */
        $show: function (Elm) {
            anime({
                targets : Elm,
                right   : 0,
                delay   : 750,
                duration: 500,
                easing  : this.$animationEasing
            });
        },

        /**
         * Get correct easing name for animation
         * https://easings.net/
         *
         * @param easingName {string}
         * @return {string}
         */
        $getAnimationName: function (easingName) {
            switch (easingName) {
                case 'easeInQuad':
                case 'easeInCubic':
                case 'easeInQuart':
                case 'easeInQuint':
                case 'easeInSine':
                case 'easeInExpo':
                case 'easeInCirc':
                case 'easeInBack':
                case 'easeOutQuad':
                case 'easeOutCubic':
                case 'easeOutQuart':
                case 'easeOutQuint':
                case 'easeOutSine':
                case 'easeOutExpo':
                case 'easeOutCirc':
                case 'easeOutBack':
                case 'easeInBounce':
                case 'easeInOutQuad':
                case 'easeInOutCubic':
                case 'easeInOutQuart':
                case 'easeInOutQuint':
                case 'easeInOutSine':
                case 'easeInOutExpo':
                case 'easeInOutCirc':
                case 'easeInOutBack':
                case 'easeInOutBounce':
                case 'easeOutBounce':
                case 'easeOutInQuad':
                case 'easeOutInCubic':
                case 'easeOutInQuart':
                case 'easeOutInQuint':
                case 'easeOutInSine':
                case 'easeOutInExpo':
                case 'easeOutInCirc':
                case 'easeOutInBack':
                case 'easeOutInBounce':
                    return easingName;

                default:
                    return 'easeOutExpo';
            }
        }
    });
});