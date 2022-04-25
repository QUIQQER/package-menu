/**
 * @module package/quiqqer/menu/bin/Controls/Independent/Items/Site
 * @author www.pcsg.de
 */
define('package/quiqqer/menu/bin/Controls/Independent/Items/Site', [

    'qui/QUI',
    'qui/controls/Control',
    'Locale',
    'Mustache',

    'text!package/quiqqer/menu/bin/Controls/Independent/Items/Site.html'

], function (QUI, QUIControl, QUILocale, Mustache, template) {
    "use strict";

    const lg = 'quiqqer/menu';

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
            this.getElm().set('html', Mustache.render(template, {
                site          : QUILocale.get(lg, 'tpl.Site'),
                rel           : QUILocale.get(lg, 'tpl.rel'),
                relDescription: QUILocale.get(lg, 'tpl.relDescription'),

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

            let data = this.getAttribute('data');

            try {
                if (typeof data === 'string') {
                    data = JSON.decode(data);
                }
            } catch (e) {
            }

            if (!data) {
                data = {};
            }

            if (typeof data.site !== 'undefined') {
                this.getElm().getElement('[name="site"]').set('value', data.site);
            }

            if (typeof data.rel !== 'undefined') {
                this.getElm().getElement('[name="rel"]').set('value', data.rel);
            }

            QUI.parse(this.getElm()).then(() => {
                this.fireEvent('load');
            });
        },

        save: function () {
            const Form = this.getElm().getElement('form');

            return {
                data: {
                    site: Form.elements.site.value,
                    rel : Form.elements.rel.value
                }
            };
        }
    });
});
