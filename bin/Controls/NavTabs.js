/**
 * Navigation tabs control
 *
 * Every nav tab content has an url conform ID (title, it comes from brick entries).
 * You can use it to target and auto open this element. Simply place `#open_` before your title in the url.
 * The page will be scrolled to the element if it is not in viewport.
 *
 * Example: <a href="www.example.com/subpage#open_myTarget">Open "myTarget" element</a>
 *
 * @module package/quiqqer/menu/bin/Controls/NavTabs
 * @author www.pcsg.de (Michael Danielczok)
 */
define('package/quiqqer/menu/bin/Controls/NavTabs', [

    'qui/QUI',
    'qui/controls/Control',
    URL_OPT_DIR + 'bin/quiqqer-asset/animejs/animejs/lib/anime.min.js',

], function (QUI, QUIControl, animejs) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/quiqqer/menu/bin/Controls/NavTabs',

        Binds: [
            '$onImport',
            'toggle'
        ],

        options: {
            animation: 'slide'
        },

        initialize: function (options) {
            this.parent(options);

            this.navTab              = false;
            this.navTabsItems        = false;
            this.navContents         = false;
            this.NavContentContainer = null;
            this.ActiveNavTab        = null;
            this.ActiveContent       = null;
            this.clicked             = false;
            this.animation           = 'slide';

            this.addEvents({
                onImport: this.$onImport
            });
        },

        $onImport: function () {
            var Elm  = this.getElm(),
                self = this;

            this.navTab              = Elm.getElement('.quiqqer-tab-nav');
            this.navTabsItems        = Elm.getElements('.quiqqer-tab-nav-item');
            this.navContents         = Elm.getElements('.quiqqer-tab-content-item');
            this.NavContentContainer = Elm.getElement('.quiqqer-tab-content');

            if (!this.navTabsItems || !this.navContents) {
                return;
            }

            // animation effect
            if (this.getAttribute('animation')) {
                switch (this.getAttribute('animation')) {
                    case 'slide':
                    default:
                        this.animation = 'slide';
                }
            }

            this.ActiveNavTab  = Elm.getElement('.quiqqer-tab-nav-item.active');
            this.ActiveContent = Elm.getElement('.quiqqer-tab-content-item.active');

            let queryString = window.location.hash;

            if (queryString && queryString.substr(0, 6) === '#open_') {
                const target     = decodeURI(queryString.substr(6));
                const NavTabItem = this.navTab.querySelector('[href="#' + target + '"]');

                if (NavTabItem) {
                    if (!this.$isInViewport(Elm)) {
                        new Fx.Scroll(window, {
                            duration: 500
                        }).toElement(Elm);
                    }

                    self.$setNavItemPos(NavTabItem.parentElement);
                    self.toggle(NavTabItem.parentElement, target);
                }
            }

            let clickEvent = function (event) {
                event.stop();

                if (self.clicked) {
                    return;
                }

                self.clicked = true;

                let NavTabItem = event.target;

                if (NavTabItem.nodeName !== 'LI') {
                    NavTabItem = NavTabItem.getParent('li');
                }

                let target = NavTabItem.getElement('a').getAttribute("href");

                if (target.indexOf('#') === 0) {
                    target = target.substring(1);
                }

                if (!target) {
                    self.clicked = false;
                    return;
                }

                self.$setNavItemPos(NavTabItem);
                self.toggle(NavTabItem, target);

                const url    = window.location.href;
                const newUrl = url.split('#')[0] + '#open_' + target;

                history.pushState(null, null, newUrl);
            }

            this.navTabsItems.addEvent('click', clickEvent);
        },

        /**
         * Toggle nav tabs
         *
         * @param NavItem HTMLNode
         * @param target string
         */
        toggle: function (NavItem, target) {
            if (NavItem.hasClass('active')) {
                this.clicked = false;
                return;
            }

            var TabContent = this.getElm().getElement('[id="' + target + '"]');

            if (!TabContent) {
                this.clicked = false;
                return;
            }

            var self = this;

            this.NavContentContainer.setStyle('height', this.NavContentContainer.offsetHeight);

            Promise.all([
                this.disableNavItem(this.ActiveNavTab),
                this.hideContent(this.ActiveContent)
            ]).then(function () {
                TabContent.setStyle('display', null);

                return Promise.all([
                    self.enableNavItem(NavItem),
                    self.showContent(TabContent),
                    self.$setHeight(TabContent.offsetHeight)
                ]);
            }).then(function () {
                self.clicked = false;
                self.NavContentContainer.setStyle('height', null);
            });
        },

        /**
         * Set nav item to inactive
         *
         * @param Item HTMLNode
         * @return Promise
         */
        disableNavItem: function (Item) {
            return new Promise(function (resolve) {
                Item.removeClass('active');

                resolve();
            });
        },

        /**
         * Set nav item to active
         *
         * @param Item HTMLNode
         * @return Promise
         */
        enableNavItem: function (Item) {
            var self = this;

            return new Promise(function (resolve) {
                Item.addClass('active');
                self.ActiveNavTab = Item;

                resolve();
            });
        },

        /**
         * Hide tab content
         *
         * @param Item HTMLNode
         * @return Promise
         */
        hideContent: function (Item) {
            var self = this;

            return new Promise(function (resolve) {
                self.$slideFadeOut(Item).then(function () {
                    Item.removeClass('active');
                    Item.setStyle('display', 'none');

                    resolve();
                });
            });
        },

        /**
         * Show tab content
         *
         * @param Item HTMLNode
         * @return Promise
         */
        showContent: function (Item) {
            var self = this;

            return new Promise(function (resolve) {
                self.$slideFadeIn(Item).then(function () {
                    Item.style.display = null;
                    Item.style.opacity = null;
                    Item.addClass('active');
                    self.ActiveContent = Item;

                    resolve();
                });
            });
        },

        /**
         * Set height of tab content container
         *
         * @param height integer
         * @return Promise
         */
        $setHeight: function (height) {
            return this.$animate(this.NavContentContainer, {
                height: height
            });
        },

        /**
         * Fade out animation (hide)
         *
         * @param Item HTMLNode
         * @return Promise
         */
        $slideFadeOut: function (Item) {
            return this.$animate(Item, {
                opacity  : 0,
                translateX: -5,

            });
        },

        /**
         * Fade in animation (show)
         *
         * @param Item HTMLNode
         * @return Promise
         */
        $slideFadeIn: function (Item) {
            Item.setStyles({
                transform: 'translateX(-5px)',
                opacity  : 0
            });

            return this.$animate(Item, {
                translateX: 0,
                opacity  : 1
            });
        },

        /**
         * Scroll active nav item to the left edge (on mobile)
         *
         * @param Item
         */
        $setNavItemPos: function (Item) {
            if (!Item) {
                return;
            }

            if (QUI.getWindowSize().x > 767) {
                return;
            }

            let paddingLeft = window.getComputedStyle(this.navTab, null).getPropertyValue('padding-left'),
                marginLeft  = window.getComputedStyle(Item, null).getPropertyValue('padding-left');

            new Fx.Scroll(this.navTab).start(Item.offsetLeft - parseInt(paddingLeft) - parseInt(marginLeft), 0);
        },

        /**
         * Check if element is in viewport
         * @param element
         * @return {boolean}
         */
        $isInViewport: function (element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        $animate: function (Target, options) {
            console.log(options)
            return new Promise(function (resolve) {
                options          = options || {};
                options.targets  = Target;
                options.complete = resolve;
                options.duration = options.duration || 250;
                options.easing   = options.easing || 'easeInQuad';

                animejs(options);
            });
        }
    });
});