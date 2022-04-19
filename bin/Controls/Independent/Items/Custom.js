/**
 * @module package/quiqqer/menu/bin/Controls/Independent/Items/Custom
 * @author www.pcsg.de
 */
define('package/quiqqer/menu/bin/Controls/Independent/Items/Custom', [

    'qui/QUI',
    'qui/controls/Control',
    'Mustache',

    'text!package/quiqqer/menu/bin/Controls/Independent/Items/Custom.html'

], function (QUI, QUIControl, Mustache, template) {
    "use strict";

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
            this.getElm().addClass();
            this.getElm().set('data-qui', this.getType());
            this.getElm().set('html', Mustache.render(template, {}));

            console.log(this.getAttribute('title'));
            console.log(this.getAttribute('icon'));
            console.log(this.getAttribute('data'));

            QUI.parse(this.getElm()).then(() => {
                this.$Title = QUI.Controls.getById(
                    this.getElm().getElement('[name="title"]').get('data-quiid')
                );

                this.$Name = QUI.Controls.getById(
                    this.getElm().getElement('[name="name"]').get('data-quiid')
                );

                this.fireEvent('load');
            });
        },

        save: function () {
            const Form = this.getElm().getElement('form');

            return {
                title: this.$Title.getValue(),
                icon : Form.elements.icon.value,
                data : {
                    name: this.$Name.getValue()
                }
            };
        }
    });
});
