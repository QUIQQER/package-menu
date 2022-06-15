/**
 * Navigation tabs control
 *
 * @module package/quiqqer/menu/bin/Controls/NavTabs
 * @author www.pcsg.de (Michael Danielczok)
 */
define('package/quiqqer/menu/bin/Controls/NavTabs', [

    'qui/QUI',
    'qui/controls/Control'

], function (QUI, QUIControl) {
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

            if (queryString) {
                queryString      = decodeURI(queryString);
                const NavTabItem = this.navTab.querySelector('[href="' + queryString + '"]');
                const target     = queryString.substr(1);

                if (NavTabItem) {
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
                    target = target.substring(1)
                }

                if (!target) {
                    self.clicked = false;
                    return;
                }

                self.$setNavItemPos(NavTabItem);
                self.toggle(NavTabItem, target);
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
                    Item.addClass('active');
                    Item.setStyle('display', null);
                    self.ActiveContent = Item;

                    resolve();
                });
            });
        },

        /**
         * Set heigt of tab content container
         *
         * @param height integer
         * @return Promise
         */
        $setHeight: function (height) {
            var self = this;

            return new Promise(function (resolve) {
                moofx(self.NavContentContainer).animate({
                    height: height
                }, {
                    duration: 250,
                    callback: resolve
                });
            });
        },

        /**
         * Fade out animation (hide)
         *
         * @param Item HTMLNode
         * @return Promise
         */
        $slideFadeOut: function (Item) {
            this.NavContentContainer.setStyle('height', Item.offsetHeight)

            return new Promise(function (resolve) {
                moofx(Item).animate({
                    transform: 'translateX(-10px)',
                    opacity  : 0
                }, {
                    duration: 250,
                    callback: resolve
                });
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
                transform: 'translateX(-10px)',
                opacity  : 0
            });

            return new Promise(function (resolve) {
                moofx(Item).animate({
                    transform: 'translateX(0)',
                    opacity  : 1
                }, {
                    duration: 250,
                    callback: resolve
                });
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
        }
    });
});