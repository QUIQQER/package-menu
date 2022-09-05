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
            '$setToggleBtnStatusToOpen',
            '$setToggleBtnStatusToClose',
            '$toggleNav',
            '$resize'
        ],

        options: {
            pos                : 'right', // right, left
            initanimation      : false,
            animationtype      : 'showAll', // showAll (show entire control), showOneByOne (show each entry one by one)
            animationeasing    : 'easeOutExpo', // see easing names on https://easings.net/
            animationduration  : 500, // number
            showtogglebutton   : 'mobile', // always / mobile / hide
            forceverticalcenter: false // if true, container will be centered per JS.
                                       // Pure css way (top: 50%; transform: translateY: (-50%);)
                                       // causes jumping effect on mobile, when url bar disappears
        },

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onImport: this.$onImport
            });

            this.$Control            = null;
            this.$Nav                = null;
            this.$ToggleBtn          = null;
            this.showToggleBtn       = 'mobile';
            this.isBtnOpen           = false;
            this.$entries            = null;
            this.$pos                = 'right';
            this.$animationType      = 'showAll';
            this.$animationEasing    = 'easeOutExpo';
            this.isMobile            = QUI.getWindowSize().x < 768;
            this.forceVerticalCenter = false;
            this.winHeight           = window.innerHeight;

            QUI.addEvent('resize', this.$resize);
        },

        /**
         * event: on import
         */
        $onImport: function () {
            this.$Control         = this.getElm();
            this.$Nav             = this.getElm().querySelector('nav');
            this.$entries         = this.$Nav.querySelectorAll('.quiqqer-floatedNav-entry');
            this.showToggleBtn    = this.getAttribute('showtogglebutton');
            this.$initAnimation   = this.getAttribute('initanimation');
            this.$animationType   = this.getAttribute('animationtype');
            this.$animationEasing = this.getAttribute('animationeasing');

            if (this.$Control.get('data-qui-options-showtogglebutton')) {
                this.showToggleBtn = this.$Control.get('data-qui-options-showtogglebutton');
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

            if (this.$Control.get('data-qui-options-forceverticalcenter')) {
                this.forceVerticalCenter = true;
                this.$centerVertical();
            }

            this.$initToggleBtn();

            if (this.$initAnimation) {
                this.$initStartAnimation();
            } else {
                this.$initWithoutStartAnimation();
            }
        },

        $initToggleBtn: function () {
            this.$ToggleBtn = this.$Control.querySelector('.quiqqer-floatedNav-toggleBtn');

            if (this.$ToggleBtn) {
                this.$Nav.set('data-qui-open', 0);
                this.$ToggleBtn.addEventListener('click', this.$toggleNav)
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

                    if (this.$ToggleBtn) {
                        this.$ToggleBtn.setStyles({
                            visibility: 'visible',
                            transform : 'translateX(60px)'
                        });
                    }
                    break;
            }

            if (this.isMobile) {
                if (this.$ToggleBtn) {
                    this.$showOneByOne(this.$ToggleBtn, 750);
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

                        if (this.$ToggleBtn && this.showOpenBtn === 'always') {
                            this.$setToggleBtnStatusToClose();
                            entries.unshift(this.$ToggleBtn);
                        }

                        this.$showOneByOne(entries, 750);
                        this.$Nav.set('data-qui-open', 1);
                        break;
                }
            }
        },

        $initWithoutStartAnimation: function () {
            return;

            if (!this.$ToggleBtn) {
                return;
            }

            if (this.isMobile) {
                switch (this.$animationType) {
                    case 'showAll':
                        /*this.$Nav.setStyles({
                            visibility: 'visible',
                            right     : -this.$Nav.getSize().x - 50
                        })*/

                        break;

                    case 'showOneByOne':
                        this.$entries.forEach(($Entry) => {
                            $Entry.setStyles({
                                visibility: 'visible',
                                transform : 'translateX(60px)'
                            });
                        })

                        this.$Nav.set('data-qui-open', 0);
                        this.$setToggleBtnStatusToOpen();
                        break;
                }

            } else {
                this.$Nav.set('data-qui-open', 1);
                this.$setToggleBtnStatusToClose();
            }
        },

        $toggleNav: function () {
            if (!this.$ToggleBtn) {
                return;
            }


            if (this.$Nav.get('data-qui-open') === '1') {

                this.$Nav.set('data-qui-open', 0);
                this.$animateToggleBtnToClose();

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
            this.$animateToggleBtnToOpen();

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
            Elm.style.transform = 'translateX(100px)';
            anime({
                targets   : Elm,
                translateX: 0,
                delay     : delay,
                duration  : 500,
                easing    : this.$animationEasing
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
                targets   : Elm,
                translateX: 100,
                delay     : delay,
                duration  : 500,
                easing    : this.$animationEasing
            });
        },

        $setToggleBtnStatusToOpen: function () {
            if (!this.$ToggleBtn) {
                return;
            }

            this.$ToggleBtn.querySelector('.fa').setStyle('transform', 'rotate(0)');
        },

        $setToggleBtnStatusToClose: function () {
            if (!this.$ToggleBtn) {
                return;
            }

            this.$ToggleBtn.querySelector('.fa').setStyle('transform', 'rotate(180deg)');
        },

        $animateToggleBtnToOpen: function () {
            if (!this.$ToggleBtn) {
                return;
            }

            this.isBtnOpen = true;

            anime({
                targets: this.$ToggleBtn.querySelector('.fa'),
                rotate : 180,
            })
        },

        $animateToggleBtnToClose: function () {
            if (!this.$ToggleBtn) {
                return;
            }

            this.isBtnOpen = false;

            anime({
                targets : this.$ToggleBtn.querySelector('.fa'),
                rotate  : 360,
                complete: () => {
                    this.$ToggleBtn.querySelector('.fa').setStyle('transform', 'rotate(0)');
                }
            })
        },

        $resize: function () {
            if (QUI.getWindowSize().x < 768) {

                if (this.$Nav.get('data-qui-open') === '1') {
                    this.$toggleNav();
                }

                if (!this.isBtnOpen && this.showOpenBtn === 'mobile') {
                    this.$showOneByOne(this.$ToggleBtn);
                }

                return;
            }

            if (QUI.getWindowSize().x > 767) {
                if (this.$Nav.get('data-qui-open') === '0') {
                    this.$toggleNav();
                }

                if (this.isBtnOpen && this.showOpenBtn === 'mobile') {
                    this.$hideOneByOne(this.$ToggleBtn);
                }
            }

            // recalculate vertical position
            if (this.forceVerticalCenter && this.winHeight !== window.innerHeight) {
                this.winHeight = window.innerHeight;
                this.$centerVertical();
            }
        },

        /**
         * Calculate vertical position of the control
         */
        $centerVertical: function () {
            this.$Control.style.top       = (window.innerHeight / 2) - (this.$Control.offsetHeight / 2) + 'px';
            this.$Control.style.transform = 'initial';
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