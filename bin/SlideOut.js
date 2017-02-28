/**
 * Slideout menu control
 *
 * @module package/quiqqer/menu/bin/js/SlideOut
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require qui/QUI
 * @require qui/utils/Functions
 * @require qui/controls/Control
 * @require URL_OPT_DIR +quiqqer/menu/bin/slideout.min.js
 * @require css!package/quiqqer/menu/bin/SlideOut.css
 */
define('package/quiqqer/menu/bin/SlideOut', [

    'qui/QUI',
    'qui/utils/Functions',
    'qui/controls/Control',

    URL_OPT_DIR + 'quiqqer/menu/bin/slideout.min.js',

    'css!package/quiqqer/menu/bin/SlideOut.css'

], function (QUI, QUIUtilsFunctions, QUIControl, Slideout)
{
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/quiqqer/menu/bin/SlideOut',

        options: {
            top                          : 10,
            left                         : 10,
            bottom                       : false,
            right                        : false,
            'data-show-button-on-desktop': true,
            'menu-width'                 : 256,
            'menu-button'                : true,
            'touch'                      : false,
            'buttonids'                  : false
        },

        Binds: [
            'toggle',
            '$onImport',
            '$onResize'
        ],

        initialize: function (options)
        {
            this.parent(options);

            this.MenuButton = null;
            this.$__hideMenu = false;

            this.addEvents({
                onImport: this.$onImport
            });

            QUI.addEvent('resize', function ()
            {
                if (this.Slideout.isOpen()) {
                    this.Slideout.close();
                }
            }.bind(this));
        },

        /**
         * event : on import
         */
        $onImport: function ()
        {
            var self = this,
                Elm  = this.getElm();

            Elm = Elm.getParent();

            // fix for IE - z-index must have the value 0
            if (navigator.appName == 'Microsoft Internet Explorer' ||
                !!(navigator.userAgent.match(/Trident/) ||
                navigator.userAgent.match(/rv:11/)) ||
                (typeof $.browser !== "undefined" && $.browser.msie == 1))
            {
                Elm.setStyle('z-index', 1);
            }

            // body childrens
            var children = document.body.getChildren();
            var BodyWrapper = new Element('div').inject(document.body);

            children.inject(BodyWrapper);
            Elm.inject(document.body);

            // menu button
            this.MenuButton = new Element('button', {
                'class': 'page-menu-opener',
                html   : '<span class="fa fa-list"></span>' +
                '<span class="page-menu-opener-text">MENU</span>',
                styles : {
                    display : 'none',
                    'float' : 'left',
                    opacity : 0,
                    position: 'fixed'
                },
                events : {
                    click: this.toggle
                }
            }).inject(document.body);

            if (typeOf(Elm.get('data-show-button-on-desktop')) === 'string') {
                this.setAttribute(
                    'show-button-on-desktop',
                    Elm.get('data-show-button-on-desktop').toInt()
                );
            }

            if (typeOf(Elm.get('data-qui-options-buttonids')) === 'string') {
                this.setAttribute('buttonids', Elm.get('data-qui-options-buttonids'));
            }


            if (this.getAttribute('buttonids')) {
                var i, len, Button,
                    ids = this.getAttribute('buttonids').split(',');

                for (i = 0, len = ids.length; i < len; i++) {
                    Button = document.id(ids[i]);

                    if (Button) {
                        Button.addEvent('click', this.toggle);
                    }
                }
            }

            // button position
            if (Elm.get('data-menu-right')) {
                this.setAttribute('left', false);
                this.setAttribute('right', Elm.get('data-menu-right').toInt());
            }

            if (Elm.get('data-menu-left')) {
                this.setAttribute('left', Elm.get('data-menu-left').toInt());
                this.setAttribute('right', false);
            }

            if (Elm.get('data-menu-top')) {
                this.setAttribute('top', Elm.get('data-menu-top').toInt());
                this.setAttribute('bottom', false);
            }

            if (Elm.get('data-menu-bottom')) {
                this.setAttribute('bottom', Elm.get('data-menu-bottom').toInt());
                this.setAttribute('top', false);
            }

            QUI.addEvent('resize', this.$onResize);
            QUI.addEvent('load', this.$onResize);

            if (Elm.get('data-qui-options-menu-button')) {
                this.setAttribute(
                    'menu-button',
                    Elm.get('data-qui-options-menu-button').toInt()
                );
            }


            if (Elm.get('data-qui-options-touch')) {
                this.setAttribute(
                    'touch',
                    Elm.get('data-qui-options-touch').toInt() ? true : false
                );
            }


            // attributes
            if (this.getAttribute('top')) {
                this.MenuButton.setStyle('top', this.getAttribute('top'));
                this.MenuButton.setStyle('bottom', null);
            }

            if (this.getAttribute('left')) {
                this.MenuButton.setStyle('left', this.getAttribute('left'));
                this.MenuButton.setStyle('right', null);
            }

            if (this.getAttribute('right')) {
                this.MenuButton.setStyle('right', this.getAttribute('right'));
                this.MenuButton.setStyle('left', null);
            }

            if (this.getAttribute('bottom')) {
                this.MenuButton.setStyle('bottom', this.getAttribute('bottom'));
                this.MenuButton.setStyle('top', null);
            }

            if (!this.getAttribute('show-button-on-desktop')) {
                this.MenuButton.addClass('hide-on-desktop');
            }

            var computedStyle;

            if ("getComputedStyle" in window) {
                computedStyle = window.getComputedStyle(document.body);
            } else {
                computedStyle = document.body.currentStyle;
            }

            BodyWrapper.setStyle('background', computedStyle.backgroundColor);
            Elm.setStyle('width', this.getAttribute('menu-width'));


            // init slideout and set events
            this.Slideout = new Slideout({
                panel    : BodyWrapper,
                menu     : Elm,
                padding  : this.getAttribute('menu-width'),
                tolerance: 70,
                touch    : this.getAttribute('touch')
            });

            this.Slideout.on('beforeopen', function ()
            {
                self.$onResize();

                self.Slideout._padding = self.getAttribute('menu-width');
                self.Slideout._translateTo = self.getAttribute('menu-width');

                Elm.setStyle('width', self.getAttribute('menu-width'));
                self.getElm().setStyle('display', null);

                BodyWrapper.setStyle('boxShadow', '2px 0 10px 5px rgba(0, 0, 0, 0.3');

                self.hideMenuButton(function ()
                {
                    self.MenuButton.setStyle('display', 'none');
                });
            });

            this.Slideout.on('open', function ()
            {
                self.fireEvent('open');

                var Closer = new Element('div', {
                    html   : '<span class="fa fa-times-thin"></span>',
                    'class': 'page-menu-close',
                    styles : {
                        fontSize  : 40,
                        height    : 45,
                        lineHeight: 45,
                        right     : -20,
                        position  : 'absolute',
                        textAlign : 'center',
                        top       : 10,
                        width     : 45,
                        zIndex    : 1000
                    },
                    events : {
                        click: self.toggle
                    }
                }).inject(Elm);


                moofx(Closer).animate({
                    right  : 10,
                    opacity: 1
                }, {
                    duration: 250,
                    equation: 'cubic-bezier(.42,.4,.46,1.29)'
                });

            });

            this.Slideout.on('close', function ()
            {
                BodyWrapper.setStyle('boxShadow', null);

                self.MenuButton.setStyle('display', null);

                var Closer = document.getElement('.page-menu-close');

                if (Closer) {
                    moofx(Closer).animate({
                        left   : -100,
                        opacity: 0
                    }, {
                        duration: 250,
                        equation: 'cubic-bezier(.42,.4,.46,1.29)',
                        callback: function ()
                        {
                            Closer.destroy();
                        }
                    });
                }


                if (self.$__hideMenu === false) {
                    self.showMenuButton(function ()
                    {
                        self.getElm().setStyle('display', null);
                    });
                }
            });

            this.showMenuButton(function ()
            {
                self.getElm().setStyle('display', null);
            });

            this.$onResize();
        },

        /**
         * event : on resize
         */
        $onResize: function ()
        {
            if (QUI.getWindowSize().x > 500) {
                this.setAttribute('menu-width', 500);
                return;
            }

            this.setAttribute('menu-width', QUI.getWindowSize().x);
        },

        /**
         * Toggle
         */
        toggle: function ()
        {
            this.Slideout.toggle();
        },

        /**
         * Dont show menu button
         */
        disableMenuButton: function ()
        {
            this.$__hideMenu = true;
        },

        /**
         * Show menu button
         */
        enableMenuButton: function ()
        {
            this.$__hideMenu = false;
        },

        /**
         * Hide Menu button
         *
         * @param callback
         */
        hideMenuButton: function (callback)
        {
            moofx(this.MenuButton).animate({
                opacity: 0
            }, {
                duration: 250,
                equation: 'cubic-bezier(.42,.4,.46,1.29)',
                callback: function ()
                {
                    this.MenuButton.setStyle('display', 'none');

                    if (typeof callback === 'function') {
                        callback();
                    }
                }.bind(this)
            });
        },

        /**
         * Show Menu button
         *
         * @param callback
         */
        showMenuButton: function (callback)
        {
            if (this.$__hideMenu) {
                return;
            }

            if (!this.getAttribute('menu-button')) {
                return;
            }

            this.MenuButton.setStyle('display', null);

            moofx(this.MenuButton).animate({
                opacity: 1
            }, {
                duration: 250,
                equation: 'cubic-bezier(.42,.4,.46,1.29)',
                callback: function ()
                {
                    if (typeof callback === 'function') {
                        callback();
                    }
                }.bind(this)
            });
        }
    });

});
