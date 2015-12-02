/**
 * Sidebar menu control
 *
 * @module package/quiqqer/menu/bin/SidebarDropDownMenu
 * @author www.pcsg.de (Michael Danielczok, Henning Leutz)
 *
 * @require qui/QUI
 * @require qui/controls/Control
 */
define('package/quiqqer/menu/bin/SidebarDropDownMenu', [

    'qui/QUI',
    'qui/controls/Control'

], function (QUI, QUIControl) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/quiqqer/menu/bin/SidebarDropDownMenu',

        Binds: [
            '$onImport'
        ],

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onImport: this.$onImport
            });
        },

        /**
         * event : on insert
         */
        $onImport: function () {
            var self         = this,
                Parent       = this.getElm(),
                ToggleButton = Parent.getElements(".quiqqer-fa-levels-icon");

            ToggleButton.addEvent("click", function () {
                var LiLeft = this.getParent('li');
                var NavSubLeft = LiLeft.getElement("div");

                if (!NavSubLeft.getSize().y.toInt()) {
                    self.openMenu(NavSubLeft);
                    return;
                }

                self.closeMenu(NavSubLeft);
            });
        },

        /**
         * open the next level of sub menu
         *
         * @param {HTMLLIElement} NavSubLeft
         */
        openMenu: function (NavSubLeft) {

            NavSubLeft.setStyles({
                height  : 0,
                opacity : 0,
                overflow: "hidden",
                display : "block"
            });

            moofx(NavSubLeft).animate({
                height : NavSubLeft.getElement("ul").getSize().y.toInt(),
                opacity: 1
            }, {
                duration: 250,
                callback: function () {
                    moofx(NavSubLeft).animate({
                        height: "100%"
                    });
                }
            });

            var Prev = NavSubLeft.getPrevious('.quiqqer-navigation-entry'),
                Icon = Prev.getChildren('.quiqqer-fa-levels-icon');

            Icon.addClass("fa-nav-levels-rotate");
        },

        /**
         * close the next level of sub menu
         *
         * @param {HTMLLIElement} NavSubLeft
         */
        closeMenu: function (NavSubLeft) {
            NavSubLeft.setStyle("overflow", "hidden");

            moofx(NavSubLeft).animate({
                height : 0,
                opacity: 0
            }, {
                duration: 250,
                callback: function () {
                    moofx(NavSubLeft).animate({
                        height: 0
                    });
                }
            });

            var Prev = NavSubLeft.getPrevious('.quiqqer-navigation-entry'),
                Icon = Prev.getChildren('.quiqqer-fa-levels-icon');

            Icon.removeClass("fa-nav-levels-rotate");
        }
    });
});
