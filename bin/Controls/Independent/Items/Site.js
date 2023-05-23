/**
 * @module package/quiqqer/menu/bin/Controls/Independent/Items/Site
 * @author www.pcsg.de
 */
define('package/quiqqer/menu/bin/Controls/Independent/Items/Site', [

    'qui/QUI',
    'qui/controls/Control',
    'Locale',
    'Mustache',
    'package/quiqqer/menu/bin/classes/IndependentHandler',

    'text!package/quiqqer/menu/bin/Controls/Independent/Items/Site.html'

], function (QUI, QUIControl, QUILocale, Mustache, IndependentHandler, template) {
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
                status           : QUILocale.get('quiqqer/quiqqer', 'status'),
                statusDescription: QUILocale.get(lg, 'tpl.statusDescription'),

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

                target      : QUILocale.get(lg, 'tpl.target'),
                targetNone  : QUILocale.get(lg, 'tpl.target.none'),
                targetSelf  : QUILocale.get(lg, 'tpl.target.self'),
                targetFrame : QUILocale.get(lg, 'tpl.target.frame'),
                targetPopup : QUILocale.get(lg, 'tpl.target.popup'),
                targetBlank : QUILocale.get(lg, 'tpl.target.blank'),
                targetTop   : QUILocale.get(lg, 'tpl.target.top'),
                targetParent: QUILocale.get(lg, 'tpl.target.parent'),

                menuType                : QUILocale.get(lg, 'menu.settings.type'),
                menuTypeStandard        : QUILocale.get(lg, 'menu.settings.Standard'),
                menuTypeIcons           : QUILocale.get(lg, 'menu.settings.Icons'),
                menuTypeIconsDescription: QUILocale.get(lg, 'menu.settings.IconsDescription'),
                menuTypeImage           : QUILocale.get(lg, 'menu.settings.Image'),
                menuTypeSimple          : QUILocale.get(lg, 'menu.settings.Simple'),
                menuTypeNoMenu          : QUILocale.get(lg, 'menu.settings.noMenu'),
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

            if (typeof data.target !== 'undefined') {
                this.getElm().getElement('[name="target"]').set('value', data.target);
            }

            if (typeof data.rel !== 'undefined') {
                this.getElm().getElement('[name="rel"]').set('value', data.rel);
            }

            if (typeof data.status === 'undefined' || data.status) {
                this.getElm().getElement('[name="status"]').set('checked', true);
            }

            this.getElm().getElement('[name="menuType"]').set('value', data.menuType);

            IndependentHandler.getTypeName(this.getAttribute('type')).then((name) => {
                const TH = this.getElm().getElement('th');

                if (TH) {
                    TH.set('html', name);
                }
            });

            QUI.parse(this.getElm()).then(() => {
                this.fireEvent('load');
            });
        },

        save: function () {
            const Form = this.getElm().getElement('form');

            return {
                data: {
                    site    : Form.elements.site.value,
                    target  : Form.elements.target.value,
                    menuType: Form.elements.menuType.value,
                    status  : Form.elements.status.checked ? 1 : 0,
                    rel     : Form.elements.rel.value
                }
            };
        }
    });
});
