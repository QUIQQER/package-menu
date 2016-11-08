/**
 * @module package/quiqqer/menu/bin/MegaMenu
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require qui/QUI
 * @require qui/controls/Control
 */
define('package/quiqqer/menu/bin/MegaMenu', [

    'qui/QUI',
    'qui/controls/Control'

], function (QUI, QUIControl) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/quiqqer/menu/bin/MegaMenu',

        Binds: [
            '$onImport'
        ],

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onImport: this.$onImport
            });

            this.$liSize = 0;
            this.$enter  = false;
            this.$Nav    = null;
        },

        /**
         * event: on import
         */
        $onImport: function () {
            this.$Nav = this.getElm().getElement('nav');

            this.$Menu = new Element('div', {
                'class': 'quiqqer-menu-megaMenu-list-item-menu control-background',
                styles : {
                    opacity: 0,
                    top    : 0
                },
                events : {
                    mouseenter: function () {
                        this.$enter = true;
                    }.bind(this),
                    mouseleave: function () {
                        this.$enter = false;
                        this.$hideCheck();
                    }.bind(this)
                }
            }).inject(this.getElm());

            this.$liSize = this.getElm().getSize().y;

            this.$Nav.getElements('.quiqqer-menu-megaMenu-list-item').addEvents({
                mouseenter: function (event) {
                    var Target = event.target;

                    if (Target.nodeName != 'LI') {
                        Target = Target.getParent('li');
                    }

                    this.$enter = true;
                    this.showMenuFor(Target);
                }.bind(this),

                mouseleave: function () {
                    this.$enter = false;
                    this.$hideCheck();
                }.bind(this)
            });

            var SlideNode = document.getElement('[data-qui="package/quiqqer/menu/bin/SlideOut"]'),
                SlideOut  = QUI.Controls.getById(SlideNode.get('data-quiid'));

            this.getElm().getElement('.quiqqer-menu-megaMenu-mobile').addEvents({
                click: function () {
                    if (!SlideOut) {
                        SlideOut = QUI.Controls.getById(SlideNode.get('data-quiid'))
                    }

                    if (SlideOut) {
                        SlideOut.toggle();
                    }
                }
            });
        },

        /**
         * Shows the menu for the li element
         *
         * @param {HTMLLIElement} liElement
         */
        showMenuFor: function (liElement) {
            var Menu = liElement.getElement('.quiqqer-menu-megaMenu-list-item-menu');

            if (!Menu) {
                return this.$hide();
            }

            this.$Menu.set('html', Menu.get('html'));

            this.$Menu.getElements('a').addEvent('click', function (event) {
                var Link = event.target;
                if (Link.nodeName != 'A') {
                    Link = Link.getParent('a');
                }

                event.stop();
                window.location = Link.get('href');
            });

            this.$Menu.getElements('li').addEvent('click', function (event) {
                var List = event.target;
                if (List.nodeName != 'LI') {
                    List = List.getParent('LI');
                }

                var children = List.getChildren('a');

                if (children.length) {
                    event.stop();
                    window.location = children[0].get('href');
                }
            });

            return this.$show();
        },

        /**
         * Show the menu
         * @returns {Promise}
         */
        $show: function () {
            return new Promise(function (resolve) {
                this.$Menu.setStyles({
                    display: 'flex',
                    top    : this.$liSize // vorerst, sonst schauts doof aus
                });

                moofx(this.$Menu).animate({
                    opacity: 1,
                    top    : this.$liSize
                }, {
                    duration: 200,
                    callback: resolve
                });
            }.bind(this));
        },

        /**
         * Show the menu
         * @returns {Promise}
         */
        $hide: function () {
            return new Promise(function (resolve) {
                moofx(this.$Menu).animate({
                    opacity: 0,
                    top    : this.$liSize - 10
                }, {
                    duration: 200,
                    callback: function () {
                        this.$Menu.setStyles({
                            display: 'none'
                        });

                        resolve();
                    }.bind(this)
                });
            }.bind(this));
        },

        /**
         * Checks, if the menu must closed or not
         * the check is after 500ms
         */
        $hideCheck: function () {
            (function () {
                if (this.$enter === false) {
                    this.$hide();
                }
            }).delay(500, this);
        }
    });
});