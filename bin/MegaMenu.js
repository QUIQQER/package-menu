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

        options: {
            delay: 500
        },

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onImport: this.$onImport
            });

            this.$liSize  = 0;
            this.$enter   = false;
            this.$visible = false;
            this.$Nav     = null;
            this.$timer   = null;
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

            this.$Nav.getElements('.quiqqer-menu-megaMenu-list-item').addEvents({
                mouseenter: function (event) {
                    var Target = event.target;

                    if (Target.nodeName != 'LI') {
                        Target = Target.getParent('li');
                    }

                    this.$enter = true;

                    if (this.$visible) {
                        this.showMenuFor(Target);
                        return;
                    }

                    this.$timer = (function () {
                        this.showMenuFor(Target);
                    }).delay(this.getAttribute('delay'), this);
                }.bind(this),

                mouseleave: function () {
                    if (this.$timer) {
                        clearTimeout(this.$timer);
                    }

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

            // resize
            this.$liSize = this.getElm().getSize().y;

            QUI.addEvent('resize', function () {
                this.$liSize = this.getElm().getSize().y;
            }.bind(this));
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

            return this.$show();
        },

        /**
         * Show the menu
         * @returns {Promise}
         */
        $show: function () {
            return new Promise(function (resolve) {
                this.$visible = true;
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
                this.$visible = false;
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