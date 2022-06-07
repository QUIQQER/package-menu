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
            '$onImport',
            '$setMobileBtnStatusToOpen',
            '$setMobileBtnStatusToClose',
            '$toggleNav',
            '$resize'
        ],

        options: {
            pos              : 'right', // right, left
            initanimation    : false,
            animationtype    : 'showAll', // showAll (show entire control), showOneByOne (show each entry one by one)
            animationeasing  : 'easeOutExpo', // see easing names on https://easings.net/
            animationduration: 500, // number
            showopenbutton   : 'mobile' // always / mobile / hide
        },

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onImport: this.$onImport
            });

            this.$Control         = null;
            this.$Nav             = null;
            this.$MobileBtn       = null;
            this.showOpenBtn      = 'mobile';
            this.isBtnOpen        = false;
            this.$entries         = null;
            this.$pos             = 'right';
            this.$animationType   = 'showAll';
            this.$animationEasing = 'easeOutExpo';
            this.isMobile         = QUI.getWindowSize().x < 768;

            QUI.addEvent('resize', this.$resize);
        },

        /**
         * event: on import
         */
        $onImport: function () {
            this.$Control         = this.getElm();
            this.$Nav             = this.getElm().querySelector('nav');
            this.$entries         = this.$Nav.querySelectorAll('.quiqqer-floatedNav-entry');
            this.showOpenBtn      = this.getAttribute('showopenbutton');
            this.$initAnimation   = this.getAttribute('initanimation');
            this.$animationType   = this.getAttribute('animationtype');
            this.$animationEasing = this.getAttribute('animationeasing');

            if (this.$Control.get('data-qui-options-showopenbutton')) {
                this.showOpenBtn = this.$Control.get('data-qui-options-showopenbutton');
            }

            if (this.$Control.get('data-qui-options-initanimation')) {
                this.$initAnimation = this.$Control.get('data-qui-options-initanimation');
            }

            if (this.$Control.get('data-qui-options-animationtype')) {
                this.$animationType = this.$Control.get('data-qui-options-animationtype');
            }

            if (this.$Control.get('data-qui-options-animationeasing')) {
                this.$animationEasing = this.$getEasingName(this.$Control.get('data-qui-options-animationeasing'));
            }

            this.$initMobileBtn();

            if (this.$initAnimation) {
                this.$initStartAnimation();
            } else {
                this.$initWithoutStartAnimation();
            }
        },

        $initMobileBtn: function () {
            this.$MobileBtn = this.$Control.querySelector('.quiqqer-floatedNav-showMobileBtn');

            if (this.$MobileBtn) {
                this.$MobileBtn.addEventListener('click', this.$toggleNav)
            }
        },

        /**
         * Show animation on import
         */
        $initStartAnimation: function () {
            switch (this.$animationType) {
                case 'showAll':
                    this.$Nav.setStyles({
                        visibility: 'visible',
                        transform : 'translateX(100px)'
                    })
                    break;

                case 'showOneByOne':
                    this.$entries.forEach(($Entry) => {
                        $Entry.setStyles({
                            visibility: 'visible',
                            transform : 'translateX(60px)'
                        });
                    })

                    if (this.$MobileBtn) {
                        this.$MobileBtn.setStyles({
                            visibility: 'visible',
                            transform : 'translateX(60px)'
                        });
                    }
                    break;
            }

            if (this.isMobile) {
                if (this.$MobileBtn) {
                    this.$showOneByOne(this.$MobileBtn, 750);
                    this.$Nav.set('data-qui-open', 0);
                } else {
                    this.$showOneByOne(this.$entries, 750);
                    this.$Nav.set('data-qui-open', 1);
                }
            } else {
                switch (this.$animationType) {
                    case 'showAll':
                        this.$show(this.$Nav, 750);
                        this.$Nav.set('data-qui-open', 1);
                        break;

                    case 'showOneByOne':
                        let entries = Array.from(this.$entries);

                        if (this.$MobileBtn && this.showOpenBtn === 'always') {
                            this.$setMobileBtnStatusToClose();
                            entries.unshift(this.$MobileBtn);
                        }

                        this.$showOneByOne(entries, 750);
                        this.$Nav.set('data-qui-open', 1);
                        break;
                }
            }
        },

        $initWithoutStartAnimation: function () {
            if (!this.$MobileBtn) {
                return;
            }

            if (this.isMobile) {
                switch (this.$animationType) {
                    case 'showAll':
                        this.$Nav.setStyles({
                            visibility: 'visible',
                            right     : -this.$Nav.getSize().x - 50
                        })
                        break;

                    case 'showOneByOne':
                        this.$entries.forEach(($Entry) => {
                            $Entry.setStyles({
                                visibility: 'visible',
                                transform : 'translateX(60px)'
                            });
                        })

                        this.$Nav.set('data-qui-open', 0);
                        this.$setMobileBtnStatusToOpen();
                        break;
                }

            } else {
                this.$Nav.set('data-qui-open', 1);
                this.$setMobileBtnStatusToClose();
            }
        },

        $toggleNav: function () {
            if (!this.$MobileBtn) {
                return;
            }

            if (this.$Nav.get('data-qui-open') === '1') {
                this.$Nav.set('data-qui-open', 0);
                this.$animateMobileBtnToClose();

                switch (this.$animationType) {
                    case 'showAll':
                        this.$hide(this.$Nav);
                        break;

                    case 'showOneByOne':
                        this.$hideOneByOne(this.$entries);
                        break;
                }

                return;
            }

            this.$Nav.set('data-qui-open', 1);
            this.$animateMobileBtnToOpen();

            switch (this.$animationType) {
                case 'showAll':
                    this.$show(this.$Nav);
                    break;

                case 'showOneByOne':
                    this.$showOneByOne(this.$entries);
                    break;
            }
        },

        /**
         * Show nav entries one by one
         *
         * @param entries {HTMLCollection|Array}
         * @param delay {number}
         */
        $showOneByOne: function (entries, delay = 0) {
            anime({
                targets   : entries,
                translateX: 0,
                duration  : 500,
                easing    : this.$animationEasing,
                delay     : anime.stagger(100, {start: delay})
            });
        },

        /**
         * Hide nav entries one by one
         *
         * @param entries {HTMLCollection}
         * @param delay {number}
         */
        $hideOneByOne: function (entries, delay = 0) {
            anime({
                targets   : entries,
                translateX: 60,
                duration  : 500,
                easing    : this.$animationEasing,
                delay     : anime.stagger(100, {
                    start: delay,
                    from : 'last'
                })
            });
        },

        /**
         * Show nav
         *
         * @param Elm {HTMLElement}
         * @param delay {number}
         */
        $show: function (Elm, delay = 0) {
            anime({
                targets : Elm,
                translateX: 0,
                delay   : delay,
                duration: 500,
                easing  : this.$animationEasing
            });
        },

        /**
         * Show nav
         *
         * @param Elm {HTMLElement}
         * @param delay {number}
         */
        $hide: function (Elm, delay = 0) {
            anime({
                targets : Elm,
                translateX: 100,
                delay   : delay,
                duration: 500,
                easing  : this.$animationEasing
            });
        },

        $setMobileBtnStatusToOpen: function () {
            if (!this.$MobileBtn) {
                return;
            }

            this.$MobileBtn.querySelector('.fa').setStyle('transform', 'rotate(0)');
        },

        $setMobileBtnStatusToClose: function () {
            if (!this.$MobileBtn) {
                return;
            }

            this.$MobileBtn.querySelector('.fa').setStyle('transform', 'rotate(180deg)');
        },

        $animateMobileBtnToOpen: function () {
            if (!this.$MobileBtn) {
                return;
            }

            this.isBtnOpen = true;

            anime({
                targets: this.$MobileBtn.querySelector('.fa'),
                rotate : 180,
            })
        },

        $animateMobileBtnToClose: function () {
            if (!this.$MobileBtn) {
                return;
            }

            this.isBtnOpen = false;

            anime({
                targets : this.$MobileBtn.querySelector('.fa'),
                rotate  : 360,
                complete: () => {
                    this.$MobileBtn.querySelector('.fa').setStyle('transform', 'rotate(0)');
                }
            })
        },

        $resize: function () {
            if (QUI.getWindowSize().x < 768) {

                if (this.$Nav.get('data-qui-open') === '1') {
                    this.$toggleNav();
                }

                if (!this.isBtnOpen && this.showOpenBtn === 'mobile') {
                    this.$showOneByOne(this.$MobileBtn);
                }

                return;
            }

            if (QUI.getWindowSize().x > 767) {
                if (this.$Nav.get('data-qui-open') === '0') {
                    this.$toggleNav();
                }

                if (this.isBtnOpen && this.showOpenBtn === 'mobile') {
                    this.$hideOneByOne(this.$MobileBtn);
                }
            }
        },

        /**
         * Get correct easing name for animation
         * https://easings.net/
         *
         * @param easingName {string}
         * @return {string}
         */
        $getEasingName: function (easingName) {
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