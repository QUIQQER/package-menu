/**
 * Elastic menu control
 *
 * @module package/quiqqer/menu/bin/js/ElasticMenu
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require qui/QUI
 * @require qui/controls/Control
 * @require URL_OPT_DIR +bin/js/snap.svg-min.js
 * @require css!package/quiqqer/template-qui/bin/js/ElasticMenu.css
 */
define('package/quiqqer/menu/bin/ElasticMenu', [

    'qui/QUI',
    'qui/controls/Control',

    URL_OPT_DIR + 'quiqqer/menu/bin/snap.svg-min.js',

    'css!package/quiqqer/menu/bin/ElasticMenu.css'

], function (QUI, QUIControl) {
    "use strict";


    return new Class({

        Extends: QUIControl,
        Type   : 'package/quiqqer/menu/bin/ElasticMenu',

        Binds: [
            '$onImport',
            '$mouseenter',
            '$mouseleave',
            'toggle',
            'resize'
        ],

        options: {
            headerMenu     : true,
            moveCointainer : false,  // [optional] html element which move with the menu
            mouseenter     : false,  // use mouseenter and mouseleave
            mouseleave     : false,  // use mouseleave and mouseleave
            mouseOpenDelay : 750,    // delay for the open event
            mouseCloseDelay: 250     // delay for the close event
        },

        initialize: function (options) {
            this.parent(options);

            this.$open       = false;
            this.$animate    = false;
            this.$mouseDelay = false;

            this.MenuButton = false;

            this.$NavElm      = false;
            this.$Shape       = false;
            this.$SVG         = false;
            this.$Path        = false;
            this.$MobileClose = false;
            this.$pathReset   = false;

            this.addEvents({
                onImport: this.$onImport
            });
        },

        /**
         * event : on import
         */
        $onImport: function () {
            var self = this,
                Elm  = this.getElm();

            Elm.set({
                tabindex: -1,
                styles  : {
                    outline       : 'none',
                    '-moz-outline': 'none'
                },
                events  : {
                    blur: this.$mouseleave
                }
            });

            Elm.addClass('hide-on-mobile');

            window.addEvent('resize', this.resize);

            this.$NavElm = Elm.getElement('.page-navigation');

            // header menu
            new Element('div', {
                'class': 'page-menu-mobile hide-on-desktop',
                html   : '<span class="fa fa-list"></span>' +
                         '<span>MENU</span>',
                events : {
                    click: function () {
                        self.toggle();
                    }
                }
            }).inject(document.body, 'top');

            // mobile header
            this.$MobileClose = new Element('div', {
                'class': 'hide-on-desktop',
                html   : 'Menü schließen',
                styles : {
                    background: '#dddddd',
                    cursor    : 'pointer',
                    textAlign : 'center',
                    padding   : 10
                },
                events : {
                    click: function () {
                        self.close();
                    }
                }
            }).inject(Elm, 'top');


            // menu button
            this.MenuButton = new Element('button', {
                'class': 'page-menu-opener hide-on-mobile',
                html   : '<span class="fa fa-list"></span>' +
                         '<span class="page-menu-opener-text">MENU</span>',
                styles : {
                    left    : 10,
                    opacity : 0,
                    position: 'fixed',
                    top     : 10
                },
                events : {
                    click: this.toggle
                }
            }).inject(document.body);

            // svg element
            this.$Shape = new Element('div', {
                'class'           : 'page-menu-morph hide-on-mobile',
                'data-morph-open' : "M300-10c0,0,295,164,295,410c0,232-295,410-295,410",
                'data-morph-close': "M300-10C300-10,5,154,5,400c0,232,295,410,295,410",
                html              : '<svg width="100%" height="100%" viewBox="0 0 600 800" preserveAspectRatio="none">' +
                                    '<path fill="none" d="M250-10c0,0,0,164,0,410c0,232,0,410,0,410" />' +
                                    '</svg>'
            }).inject(Elm);

            this.$SVG       = Snap(this.$Shape.getElement('svg'));
            this.$Path      = this.$SVG.select('path');
            this.$pathReset = this.$Path.attr('d');

            // mouseenter / leave
            if (this.getAttribute('mouseenter')) {
                Elm.addEvents({
                    mouseenter: this.$mouseenter
                });
            }

            if (this.getAttribute('mouseleave')) {
                Elm.addEvents({
                    mouseleave: this.$mouseleave
                });
            }

            this.resize();

            Elm.setStyle('display', null);


            moofx(this.MenuButton).animate({
                opacity: 1
            });
        },

        /**
         * resize the menu -> mobile menu
         */
        resize: function () {
            if (!this.$Elm) {
                return;
            }

            if (this.$open) {
                this.close();
            }
        },

        /**
         * toggle the menu, open or close the menu
         */
        toggle: function () {
            if (this.$animate) {
                return;
            }

            if (this.$open) {
                this.close();
                return;
            }

            this.open();
        },

        /**
         * Opens the menu
         */
        open: function () {
            if (this.$animate) {
                return;
            }

            if (this.$open) {
                return;
            }

            var self = this;

            this.$open    = true;
            this.$animate = true;

            this.$Elm.removeClass('hide-on-mobile');
            this.$MobileClose.removeClass('hide-on-mobile');

            var maxSize  = document.body.getSize(),
                maxWidth = maxSize.x;

            if (maxWidth <= 510) {
                document.body.setStyles({
                    overflow: 'hidden'
                });
            }

            this.$calcMenu();

            (function () {
                moofx(self.getElm()).style({
                    transform: 'translate3d(0, 0, 0)'
                });

                self.getElm().addClass('menu-open');

            }).delay(300);


            moofx(this.MenuButton).animate({
                opacity: 0
            }, {
                callback: function () {
                    this.MenuButton.setStyle('display', 'none');
                }.bind(this)
            });


            this.$Path.stop().animate({
                path: this.$Shape.getAttribute('data-morph-open')
            }, 350, mina.easeout, function () {
                self.$Path.stop().animate({
                    path: self.$pathReset
                }, 800, mina.elastic);

                self.$animate = false;

                self.getElm().focus();

                // move container
                if (self.getAttribute('moveCointainer')) {
                    moofx(self.getAttribute('moveCointainer')).animate({
                        width: document.body.getSize().x - self.getElm().getSize().x,
                        left : self.getElm().getSize().x
                    });
                }
            });
        },

        /**
         * Close the menu
         */
        close: function () {
            if (this.$open === false) {
                return;
            }

            var self = this;

            if (this.getAttribute('moveCointainer')) {
                moofx(this.getAttribute('moveCointainer')).animate({
                    width: '100%',
                    left : 0
                }, {
                    callback: function () {
                        self.getAttribute('moveCointainer').setStyles({
                            width: null,
                            left : null
                        });
                    }
                });
            }


            (function () {
                self.getElm().removeClass('menu-open');
                self.$calcMenu();
            }).delay(250);

            this.MenuButton.setStyle('display', null);

            moofx(this.MenuButton).animate({
                opacity: 1
            });

            document.body.setStyles({
                overflow: null
            });

            this.$Path.stop().animate({
                path: this.$Shape.getAttribute('data-morph-close')
            }, 300, mina.easeout, function () {
                self.$Path.stop().animate({
                    path: self.$pathReset
                }, 10, mina.elastic, function () {
                    self.$animate = false;
                    self.$open    = false;

                    self.$Elm.addClass('hide-on-mobile');
                    self.$MobileClose.addClass('hide-on-mobile');
                });
            });
        },

        /**
         * event - mouseenter
         */
        $mouseenter: function () {
            if (this.$mouseDelay) {
                clearTimeout(this.$mouseDelay);
            }

            if (this.$open) {
                return;
            }

            this.$mouseDelay = (function () {
                this.open();
            }).delay(this.getAttribute('mouseOpenDelay'), this);
        },

        /**
         * event - mouseleave
         */
        $mouseleave: function () {
            if (this.$mouseDelay) {
                clearTimeout(this.$mouseDelay);
            }

            if (this.$open === false) {
                return;
            }

            this.$mouseDelay = (function () {
                this.close();
            }).delay(this.getAttribute('mouseCloseDelay'), this);
        },

        /**
         * calcuation of the menu nodes
         */
        $calcMenu: function () {
            var maxSize   = document.body.getSize(),
                maxWidth  = maxSize.x,
                maxHeight = maxSize.y,
                navSize   = this.$NavElm.getSize();

            if (navSize.y > maxHeight) {
                this.$Shape.setStyle('height', navSize.y - 10);

            } else {
                this.$Shape.setStyle('height', maxHeight - 10);
            }


            if (maxWidth > 510) {
                moofx(this.$Elm).style({
                    transform: null
                });

                return;
            }

            moofx(this.$Elm).style({
                transform: 'translate3d(-' + maxWidth + 'px, 0, 0)',
                width    : maxWidth
            });

            this.$NavElm.setStyle('width', maxWidth);
        }
    });
});
