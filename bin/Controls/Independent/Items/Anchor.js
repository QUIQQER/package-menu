/**
 * @module package/quiqqer/menu/bin/Controls/Independent/Items/Anchor
 * @author www.pcsg.de
 */
define('package/quiqqer/menu/bin/Controls/Independent/Items/Anchor', [

    'qui/QUI',
    'qui/controls/Control',
    'Locale',
    'Mustache',

    'text!package/quiqqer/menu/bin/Controls/Independent/Items/Anchor.html'

], function (QUI, QUIControl, QUILocale, Mustache, template) {
    "use strict";

    const lg = 'quiqqer/menu';

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
            this.getElm().set('data-qui', this.getType());
            this.getElm().set('html', Mustache.render(template, {
                status           : QUILocale.get('quiqqer/quiqqer', 'status'),
                statusDescription: QUILocale.get(lg, 'tpl.statusDescription'),

                title    : QUILocale.get('quiqqer/quiqqer', 'title'),
                linkTitle: QUILocale.get(lg, 'tpl.linkTitle'),
                icon     : QUILocale.get(lg, 'tpl.icon'),
                anchor   : QUILocale.get(lg, 'tpl.anchor'),
            }));

            let title = this.getAttribute('title');
            let icon = this.getAttribute('icon');
            let data = this.getAttribute('data');

            try {
                title = JSON.decode(title);
            } catch (e) {
            }

            try {
                if (typeof data === 'string') {
                    data = JSON.decode(data);
                }
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

            if (typeof data.status === 'undefined' || data.status) {
                this.getElm().getElement('[name="status"]').set('checked', true);
            }

            QUI.parse(this.getElm()).then(() => {
                this.$Title = QUI.Controls.getById(
                    this.getElm().getElement('[name="title"]').get('data-quiid')
                );

                this.$Name = QUI.Controls.getById(
                    this.getElm().getElement('[name="name"]').get('data-quiid')
                );

                this.$Title.setData(title);
                this.$Name.setData(data.name);

                if (this.$Title.isLoaded()) {
                    this.$Title.open();
                } else {
                    this.$Title.addEvent('load', () => {
                        this.$Title.open();
                    });
                }

                if (this.$Name.isLoaded()) {
                    this.$Name.open();
                } else {
                    this.$Name.addEvent('load', () => {
                        this.$Name.open();
                    });
                }

                this.fireEvent('load');
            });
        },

        save: function () {
            const Form = this.getElm().getElement('form');

            return {
                title: this.$Title.getValue(),
                icon : Form.elements.icon.value,
                data : {
                    url   : Form.elements.url.value,
                    status: Form.elements.status.checked ? 1 : 0,
                    name  : this.$Name.getValue()
                }
            };
        }
    });
});