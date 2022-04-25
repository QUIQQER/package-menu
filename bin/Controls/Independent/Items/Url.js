/**
 * @module package/quiqqer/menu/bin/Controls/Independent/Items/Url
 * @author www.pcsg.de
 */
define('package/quiqqer/menu/bin/Controls/Independent/Items/Url', [

    'qui/QUI',
    'qui/controls/Control',
    'Mustache',

    'text!package/quiqqer/menu/bin/Controls/Independent/Items/Url.html'

], function (QUI, QUIControl, Mustache, template) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Types  : 'package/quiqqer/menu/bin/Controls/Independent/Items/Url',

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

            let title = this.getAttribute('title');
            let icon = this.getAttribute('icon');
            let data = this.getAttribute('data');

            try {
                title = JSON.decode(title);
            } catch (e) {
            }

            try {
                data = JSON.decode(data);
            } catch (e) {
            }

            if (!data) {
                data = {};
            }

            if (typeof data.url === 'undefined') {
                data.url = '';
            }

            if (typeof data.name === 'undefined') {
                data.name = '';
            }

            this.getElm().getElement('[name="icon"]').set('value', icon);
            this.getElm().getElement('[name="url"]').set('value', data.url);

            QUI.parse(this.getElm()).then(() => {
                this.$Title = QUI.Controls.getById(
                    this.getElm().getElement('[name="title"]').get('data-quiid')
                );

                this.$Name = QUI.Controls.getById(
                    this.getElm().getElement('[name="name"]').get('data-quiid')
                );

                this.$Title.setData(title);
                this.$Name.setData(data.name);

                this.fireEvent('load');
            });
        },

        save: function () {
            const Form = this.getElm().getElement('form');

            return {
                title: this.$Title.getValue(),
                icon : Form.elements.icon.value,
                data : {
                    url : Form.elements.url.value,
                    name: this.$Name.getValue()
                }
            };
        }
    });
});