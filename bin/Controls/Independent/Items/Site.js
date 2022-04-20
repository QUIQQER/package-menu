/**
 * @module package/quiqqer/menu/bin/Controls/Independent/Items/Site
 * @author www.pcsg.de
 */
define('package/quiqqer/menu/bin/Controls/Independent/Items/Site', [

    'qui/QUI',
    'qui/controls/Control',
    'Mustache',

    'text!package/quiqqer/menu/bin/Controls/Independent/Items/Site.html'

], function (QUI, QUIControl, Mustache, template) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Types  : 'package/quiqqer/menu/bin/Controls/Independent/Items/Site',

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
            this.getElm().set('data-qui', this.getType());
            this.getElm().set('html', Mustache.render(template, {}));

            let data = this.getAttribute('data');

            if (typeof data === 'string') {
                try {
                    data = JSON.decode(data);
                } catch (e) {
                }
            }

            if (!data) {
                data = {};
            }

            if (typeof data.site !== 'undefined') {
                this.getElm().getElement('[name="site"]').set('value', data.site);
            }

            QUI.parse(this.getElm()).then(() => {
                this.fireEvent('load');
            });
        },

        save: function () {
            const Form = this.getElm().getElement('form');

            return {
                data: {
                    site: Form.elements.site.value
                }
            };
        }
    });
});
