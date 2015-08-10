
/**
 * Slideout menu control
 *
 * @module package/quiqqer/menu/bin/js/SlideOut
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require qui/QUI
 * @require qui/controls/Control
 * @require URL_OPT_DIR +quiqqer/menu/bin/slideout.min.js
 */
define('package/quiqqer/menu/bin/SlideOut', [

    'qui/QUI',
    'qui/controls/Control',

    URL_OPT_DIR +'quiqqer/menu/bin/slideout.min.js',

    'css!package/quiqqer/menu/bin/SlideOut.css'

], function(QUI, QUIControl, Slideout)
{
    "use strict";

    return new Class({

        Extends : QUIControl,
        Type : 'package/quiqqer/menu/bin/SlideOut',

        Binds : [
            'toggle',
            '$onImport'
        ],

        initialize : function(options)
        {
            this.parent(options);

            this.MenuButton = null;

            this.addEvents({
                onImport : this.$onImport
            });
        },

        /**
         * event : on import
         */
        $onImport : function()
        {
            var self = this,
                Elm  = this.getElm();

            // body childrens
            var children = document.body.getChildren();
            var BodyWrapper = new Element('div').inject(document.body);

            children.inject(BodyWrapper);
            Elm.inject(document.body);

            // menu button
            this.MenuButton = new Element('button', {
                'class' : 'page-menu-opener hide-on-mobile',
                html    : '<span class="fa fa-list"></span>'+
                          '<span class="page-menu-opener-text">MENU</span>',
                styles : {
                    left : 10,
                    opacity : 0,
                    position : 'fixed',
                    top : 10
                },
                events : {
                    click : this.toggle
                }
            }).inject(document.body);


            var computedStyle;
            if ("getComputedStyle" in window) {
                computedStyle = window.getComputedStyle(document.body);
            } else {
                computedStyle = document.body.currentStyle;
            }

            BodyWrapper.setStyle('background', computedStyle.backgroundColor);


            // init slideout and set events
            this.Slideout = new Slideout({
                panel     : BodyWrapper,
                menu      : Elm,
                padding   : 0,
                tolerance : 70
            });

            this.Slideout.on('beforeopen', function() {
                BodyWrapper.setStyle('boxShadow', '2px 0 10px 5px rgba(0, 0, 0, 0.3');
            });

            this.Slideout.on('close', function() {
                BodyWrapper.setStyle('boxShadow', null);
            });

            moofx(this.MenuButton).animate({
                opacity : 1
            }, {
                callback : function() {
                    self.getElm().setStyle('display', null);
                }
            });
        },

        /**
         * Toggle
         */
        toggle : function()
        {
            this.Slideout.toggle();
        }

    });

});