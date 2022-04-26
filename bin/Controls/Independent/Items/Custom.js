/**
 * @module package/quiqqer/menu/bin/Controls/Independent/Items/Custom
 * @author www.pcsg.de
 *
 * @todo click speichern -> js + textarea
 */
define('package/quiqqer/menu/bin/Controls/Independent/Items/Custom', [

    'qui/QUI',
    'qui/controls/Control',
    'Locale',
    'Mustache',

    'text!package/quiqqer/menu/bin/Controls/Independent/Items/Custom.html'

], function (QUI, QUIControl, QUILocale, Mustache, template) {
    "use strict";

    const lg = 'quiqqer/menu';

    return new Class({

        Extends: QUIControl,
        Types  : 'package/quiqqer/menu/bin/Controls/Independent/Items/Custom',

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
                title         : QUILocale.get('quiqqer/quiqqer', 'title'),
                linkTitle     : QUILocale.get(lg, 'tpl.linkTitle'),
                icon          : QUILocale.get(lg, 'tpl.icon'),
                url           : QUILocale.get(lg, 'tpl.url'),
                rel           : QUILocale.get(lg, 'tpl.rel'),
                relDescription: QUILocale.get(lg, 'tpl.relDescription'),
                click         : QUILocale.get(lg, 'tpl.click'),

                alternate : QUILocale.get(lg, 'tpl.rel.alternate'),
                author    : QUILocale.get(lg, 'tpl.rel.author'),
                bookmark  : QUILocale.get(lg, 'tpl.rel.bookmark'),
                external  : QUILocale.get(lg, 'tpl.rel.external'),
                help      : QUILocale.get(lg, 'tpl.rel.help'),
                license   : QUILocale.get(lg, 'tpl.rel.license'),
                next      : QUILocale.get(lg, 'tpl.rel.next'),
                nofollow  : QUILocale.get(lg, 'tpl.rel.nofollow'),
                noopener  : QUILocale.get(lg, 'tpl.rel.noopener'),
                noreferrer: QUILocale.get(lg, 'tpl.rel.noreferrer'),
                prev      : QUILocale.get(lg, 'tpl.rel.prev'),
                search    : QUILocale.get(lg, 'tpl.rel.search'),
                tag       : QUILocale.get(lg, 'tpl.rel.tag'),
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
            this.getElm().getElement('[name="rel"]').set('value', data.rel);

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
                    url  : Form.elements.url.value,
                    rel  : Form.elements.rel.value,
                    click: Form.elements.click.value,
                    name : this.$Name.getValue()
                }
            };
        }
    });
});
