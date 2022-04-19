/**
 * @module package/quiqqer/menu/bin/Controls/Independent/Items/Anchor
 * @author www.pcsg.de
 */
define('package/quiqqer/menu/bin/Controls/Independent/Items/Anchor', [

    'qui/QUI',
    'qui/controls/Control'

], function (QUI, QUIControl) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Types  : 'package/quiqqer/menu/bin/Controls/Independent/Items/Anchor',

        Binds: [
            '$onInject'
        ],

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onInject: this.$onInject
            });
        },

        $onInject: function () {
            this.getElm().addClass();
            this.getElm().set('data-qui', this.getType());
        }
    });
});