/**
 * @module package/quiqqer/menu/bin/Controls/Independent/MenuItemsSorting
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/menu/bin/Controls/Independent/MenuItemsSorting', [

    'qui/QUI',
    'qui/controls/windows/Confirm',
    'Locale',
    'package/quiqqer/menu/bin/classes/Independent/Sortables',

    'css!package/quiqqer/menu/bin/Controls/Independent/MenuItemsSorting.css'

], function (QUI, QUIConfirm, QUILocale, Sortables) {
    "use strict";

    const lg = 'quiqqer/menu';

    return new Class({

        Extends: QUIConfirm,
        Type   : 'package/quiqqer/menu/bin/Controls/Independent/MenuItemsSorting',

        Binds: [
            '$onOpen'
        ],

        options: {
            Item: false
        },

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                icon     : 'fa fa-sort',
                title    : QUILocale.get(lg, 'quiqqer.menu.independent.sort.title'),
                maxHeight: 600,
                maxWidth : 500,
                autoclose: false,
            });

            this.addEvents({
                onOpen: this.$onOpen
            });
        },

        $onOpen: function () {
            this.Loader.show();
            this.getContent().set(
                'html',
                '<p style="text-align: center; margin-bottom: 40px">' +
                '   Per Drag&Drop kannst du die einzelnen Menüeinträge sortieren' +
                '</p>'
            );

            const Item = this.getAttribute('Item');
            const List = new Element('ul.quiqqer-menu-sortingList').inject(this.getContent());
            const children = Item.getChildren();

            children.forEach(function (Item) {
                new Element('li', {
                    'class'       : 'quiqqer-menu-sortingItem',
                    html          : Item.getAttribute('text'),
                    'data-list-id': Item.getId()
                }).inject(List);
            });


            new Sortables(List, {
                revert: {
                    duration  : 500,
                    transition: 'elastic:out'
                },
                clone : function (event) {
                    let Target = event.target;

                    if (Target.nodeName !== 'LI') {
                        Target = Target.getParent('li');
                    }

                    const size = Target.getSize(),
                          pos  = Target.getPosition(Target.getParent('ul'));

                    return new Element('div', {
                        styles: {
                            background: 'rgba(0,0,0,0.5)',
                            height    : size.y,
                            position  : 'absolute',
                            top       : pos.y,
                            width     : size.x,
                            zIndex    : 1000
                        }
                    });
                },

                onStart: function (element) {
                    const Ul = element.getParent('ul');

                    element.addClass('quiqqer-menu-sortingItem-dd-active');

                    Ul.setStyles({
                        height  : Ul.getSize().y,
                        overflow: 'hidden',
                        width   : Ul.getSize().x
                    });
                },

                onComplete: function (element) {
                    const Ul = element.getParent('ul');

                    element.removeClass('quiqqer-menu-sortingItem-dd-active');

                    Ul.setStyles({
                        height  : null,
                        overflow: null,
                        width   : null
                    });
                }
            });

            this.Loader.hide();
        },

        submit: function () {
            const Item = this.getAttribute('Item');
            const children = Item.getChildren();
            const listItems = this.getContent().getElements('li');

            const findInChildren = function (id) {
                for (let i = 0, len = children.length; i < len; i++) {
                    if (children[i].getId() === id) {
                        return children[i];
                    }
                }
            };

            let i, len, id;
            let result = [];

            for (i = 0, len = listItems.length; i < len; i++) {
                id = listItems[i].get('data-list-id');
                result.push(findInChildren(id));
            }

            this.fireEvent('submit', [
                this,
                result
            ]);

            this.close();
        }
    });
});
