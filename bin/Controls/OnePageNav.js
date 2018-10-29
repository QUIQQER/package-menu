/**
 * One page navigation control.
 *
 * @module package/quiqqer/menu/bin/Controls/OnePageNav
 * @author www.pcsg.de (Michael Danielczok)
 */
define('package/quiqqer/menu/bin/Controls/OnePageNav', [

    'qui/QUI',
    'qui/controls/Control'

], function (QUI, QUIControl) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/quiqqer/menu/bin/Controls/OnePageNav',

        Binds: [
            '$onImport',
            'setMenuPosition',
            'resize',
            'setAnchorPos',
            'checkActiveNavEntry'
        ],

        initialize: function (options) {
            this.parent(options);

            this.Nav = null;
            this.breakPoint = 0;
            this.anchors = null;
            this.anchorPos = {};
            this.CurrentNavEntry = null;
            this.CUrrentNavIndex = null;

            this.addEvents({
                onImport: this.$onImport
            });
        },

        $onImport: function () {
            var self = this;

            this.Nav = this.$Elm.getElement('.onePageNav');
//            var navPos = this.Nav.getPosition().y;
//            console.log(navPos)
//            this.breakPoint = navPos - 60; // 60px nav height
            this.breakPoint = window.getSize().y - 60; // 60px nav height

            QUI.addEvent('scroll', function () {
                self.setNavPosition();
//                self.checkActiveNavEntry();
            });

            QUI.addEvent('resize', this.resize);

            this.anchors = this.$Elm.getElements('.onePageNav-entry-siteAnchor');

            this.anchors.addEvent('click', function (event) {
                event.stop();
                self.scrollToElement(event.target);
            });

            this.resize();
        },

        /**
         * Set position of the nav (fixed / absolute).
         */
        setNavPosition: function () {
            if (QUI.getScroll().y >= this.breakPoint) {

                this.Nav.addClass('fixed');

                this.Nav.setStyles({
                    position: 'fixed',
                    top     : 0
                });
                return;
            }

            this.Nav.removeClass('fixed');
            this.Nav.setStyles({
                position: 'absolute',
                top     : -60
            });
        },

        /**
         * Recalculate some variables on page resize
         */
        resize: function () {
            this.breakPoint = window.getSize().y - 60; // 60px nav height
            this.setNavPosition();
//            this.setAnchorPos();
        },

        /**
         * Scroll page to an element based on the property "data-qui-anchor-name"
         * of the button obtained
         *
         * @param Button DOM Node
         */
        scrollToElement: function (Button) {
            // todo support for name tag: [name="tagName"]
            var anchor    = Button.getProperty('data-qui-anchor-name'),
                TargetElm = document.getElement(anchor);

            new Fx.Scroll(window, {
                offset: {
                    x: 0,
                    y: -59
                }
            }).toElement(TargetElm);
        },

        /**
         * Save position of all anchors in an array
         */
        setAnchorPos: function () {
            var self = this;
            this.anchorPos = [];

            this.anchors.each(function (Anchor) {
                var anchor    = Anchor.getProperty('data-qui-anchor-name'),
                    TargetElm = document.getElement(anchor);

                self.anchorPos.push({
                    Element: Anchor,
                    pos    : TargetElm.getPosition().y
                });
            });
        },

        /**
         * Check witch nav entry should be active
         * depend on the window scroll position.
         */
        checkActiveNavEntry: function () {
            var pos = QUI.getScroll().y;

            if (pos < this.anchorPos[0].pos) {
                return;
            }

            for (var i = 0, len = this.anchorPos.length; i < len; i++) {
                var current = this.anchorPos[i];
                var next = this.anchorPos[i + 1];

                if (pos < current.pos) {
                    continue;
                }

                if (next === undefined || pos < next.pos) {
                    current.Element.addClass('active');

                    if (this.CurrentNavEntry !== null) {
                        this.CurrentNavEntry.removeClass('active');
                    }

                    this.CurrentNavEntry = current.Element;
                }
            }
        }
    });
});

