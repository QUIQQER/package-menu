/**
 * @module package/quiqqer/menu/bin/Controls/Independent/MenuPanel
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/menu/bin/Controls/Independent/MenuPanel', [

    'qui/QUI',
    'qui/controls/desktop/Panel',
    'qui/controls/sitemap/Map',
    'qui/controls/sitemap/Item',
    'qui/controls/windows/Confirm',
    'qui/controls/contextmenu/Menu',
    'qui/controls/contextmenu/Item',
    'Locale',
    'package/quiqqer/menu/bin/classes/Independent/Handler',

    'Mustache',
    'text!package/quiqqer/menu/bin/Controls/Independent/MenuPanel.Create.html',
    'css!package/quiqqer/menu/bin/Controls/Independent/MenuPanel.css'

], function (QUI, QUIPanel, QUIMap, QUIMapItem, QUIConfirm, QUIContextMenu, QUIContextMenuItem,
             QUILocale, MenuHandler, Mustache, templateCreate) {
    "use strict";

    const lg = 'quiqqer/menu';
    const Handler = new MenuHandler();

    return new Class({

        Extends: QUIPanel,
        Type   : 'package/quiqqer/menu/bin/Controls/Independent/MenuPanel',

        Binds: [
            '$onShow',
            '$onCreate',
            '$onInject',
            '$openItem',
            '$onContextMenu',
            'addItem',
            'save',
        ],

        options: {
            menuId: false
        },

        initialize: function (options) {
            this.parent(options);

            this.$ActiveItem = null;
            this.$ActiveMapItem = null;

            this.$Map = null;

            this.addEvents({
                onShow  : this.$onShow,
                onInject: this.$onInject,
                onCreate: this.$onCreate
            });
        },

        $onCreate: function () {
            this.getContent().addClass('quiqqer-menu-menuPanel');

            // buttons
            this.addButton({
                name  : 'save',
                text  : QUILocale.get('quiqqer/quiqqer', 'save'),
                events: {
                    click: this.save
                }
            });

            this.addButton({
                type: 'separator'
            });

            this.addButton({
                name  : 'add',
                text  : QUILocale.get('quiqqer/quiqqer', 'add'),
                events: {
                    click: this.addItem
                }
            });

            /*
            this.addButton({
                name    : 'delete',
                disabled: true,
                text    : QUILocale.get('quiqqer/quiqqer', 'remove'),
                events  : {
                    click: this.addItem
                }
            });
            */

            // content
            this.$MapContainer = new Element('div', {
                'class': 'quiqqer-menu-menuPanel-mapContainer'
            }).inject(this.getContent());

            this.$InnerContainer = new Element('div', {
                'class': 'quiqqer-menu-menuPanel-innerContainer'
            }).inject(this.getContent());

            this.$Map = new QUIMap({}).inject(this.$MapContainer);
        },

        $onInject: function () {
            this.Loader.show();

            Handler.getMenu(this.getAttribute('menuId')).then((menuData) => {
                this.setAttribute('title', menuData.title);
                this.setAttribute('icon', 'fa fa-bars');
                this.refresh();
                console.warn('init', menuData);
                // build sitemap
                if (menuData.data !== null &&
                    typeof menuData.data.children !== 'undefined' &&
                    menuData.data.children.length
                ) {
                    const buildChildren = (Parent, children) => {
                        let i, len, data, title, Item;

                        const current = QUILocale.getCurrent();

                        for (i = 0, len = children.length; i < len; i++) {
                            data = children[i];

                            Item = new QUIMapItem({
                                text     : data.titleFrontend,
                                icon     : data.typeIcon,
                                itemTitle: data.title,
                                itemType : data.type,
                                itemIcon : data.icon,
                                itemData : data.data,
                                events   : {
                                    click      : this.$openItem,
                                    contextMenu: this.$onContextMenu
                                }
                            });

                            Parent.appendChild(Item);

                            if (typeof data.children !== 'undefined' && data.children.length) {
                                buildChildren(Item, data.children);
                            }
                        }
                    };

                    buildChildren(this.$Map, menuData.data.children);
                }

                this.Loader.hide();
            });
        },

        $onShow: function () {

        },

        save: function () {
            this.Loader.show();
            this.$unloadCurrentItem();

            // map to array
            const toArray = function (Item) {
                let items = Item.getChildren();

                if (Item.getType() === 'qui/controls/sitemap/Map') {
                    items = Item.$items;
                }

                let children = [];

                for (let i = 0, len = items.length; i < len; i++) {
                    children.push(toArray(items[i]));
                }

                if (Item.getType() === 'qui/controls/sitemap/Map') {
                    return {
                        children: children
                    };
                }

                return {
                    icon    : Item.getAttribute('itemIcon'),
                    title   : Item.getAttribute('itemTitle'),
                    type    : Item.getAttribute('itemType'),
                    data    : Item.getAttribute('itemData'),
                    children: children
                };
            };

            let result = toArray(this.$Map);
            let title = null;
            let workingTitle = null;
            console.log('save', result);
            Handler.saveMenu(
                this.getAttribute('menuId'),
                title,
                workingTitle,
                result
            ).then(() => {
                this.Loader.hide();
            });
        },

        addItem: function (Parent, where) {
            if (typeof where === 'undefined') {
                where = 'bottom';
            }

            if (typeof Parent === 'undefined') {
                const items = this.$Map.getSelectedChildren();

                if (items.length) {
                    Parent = items[0];
                }
            }

            new QUIConfirm({
                title    : QUILocale.get(lg, 'quiqqer.menu.independent.addItem.title'),
                maxHeight: 400,
                maxWidth : 500,
                autoclose: false,
                events   : {
                    onOpen: (Win) => {
                        const Content = Win.getContent();

                        Win.Loader.show();
                        Content.set('html', Mustache.render(templateCreate, {
                            textTitle: QUILocale.get('quiqqer/quiqqer', 'title'),
                            textName : QUILocale.get('quiqqer/quiqqer', 'name'),
                            textType : QUILocale.get('quiqqer/quiqqer', 'type')
                        }));

                        Handler.getItemTypes().then((list) => {
                            const Types = Content.getElement('[name="itemType"]');

                            for (let i = 0, len = list.length; i < len; i++) {
                                new Element('option', {
                                    html       : list[i].title,
                                    value      : list[i].class,
                                    'data-icon': list[i].icon
                                }).inject(Types);
                            }

                            Types.value = 'QUI\\Menu\\Independent\\Items\\Custom';

                            return QUI.parse(Win.getContent());
                        }).then(function () {
                            Win.Loader.hide();
                        });
                    },

                    onSubmit: (Win) => {
                        const Content = Win.getContent();
                        const Form = Content.getElement('form');

                        let current = QUILocale.getCurrent();
                        let title = Form.elements.itemTitle.value;
                        let type = Form.elements.itemType.value;

                        const Option = Form.elements.itemType.getElement(
                            'option[value="' + CSS.escape(type) + '"]'
                        );

                        try {
                            title = JSON.decode(title);

                            if (typeof title[current] !== 'undefined') {
                                title = title[current];
                            }
                        } catch (e) {
                        }

                        let itemAttributes = {
                            text     : title,
                            icon     : Option.get('data-icon'),
                            itemTitle: Form.elements.itemTitle.value,
                            itemType : Form.elements.itemType.value,
                            itemIcon : '',
                            events   : {
                                click      : this.$openItem,
                                contextMenu: this.$onContextMenu
                            }
                        };

                        if (where === 'bottom') {
                            Parent.appendChild(new QUIMapItem(itemAttributes));
                            Parent.open();
                        } else {
                            Parent.appendChild(new QUIMapItem(itemAttributes), where);
                        }

                        Win.close();
                    }
                }
            }).open();
        },

        /**
         * opens the item - display the item data
         *
         * @param Item
         */
        $openItem: function (Item) {
            this.Loader.show();
            this.$unloadCurrentItem();

            this.$InnerContainer.set('html', '');
            this.$ActiveItem = null;
            this.$ActiveMapItem = null;

            Handler.getItemTypes().then((list) => {
                let control = '';
                let type = Item.getAttribute('itemType');

                for (let i = 0, len = list.length; i < len; i++) {
                    if (list[i].class === type) {
                        control = list[i].jsControl;
                        break;
                    }
                }

                if (control === '') {
                    this.Loader.hide();
                    return;
                }

                require([control], (cls) => {
                    const SitemapItem = this.$getActiveSitemapItem();
                    this.$ActiveMapItem = this.$getActiveSitemapItem();

                    this.$ActiveItem = new cls({
                        title : SitemapItem.getAttribute('itemTitle'),
                        type  : SitemapItem.getAttribute('itemType'),
                        icon  : SitemapItem.getAttribute('itemIcon'),
                        data  : SitemapItem.getAttribute('itemData'),
                        events: {
                            load: () => {
                                this.Loader.hide();
                            }
                        }
                    }).inject(this.$InnerContainer);
                }, (err) => {
                    console.error(err);
                    this.Loader.hide();
                });
            });
        },

        $unloadCurrentItem: function () {
            if (!this.$ActiveItem) {
                return;
            }

            if (typeof this.$ActiveItem.save !== 'function') {
                return;
            }

            const data = this.$ActiveItem.save();

            if (!this.$ActiveMapItem) {
                return;
            }

            this.$ActiveMapItem.setAttribute('itemTitle', data.title);
            this.$ActiveMapItem.setAttribute('itemIcon', data.icon);
            this.$ActiveMapItem.setAttribute('itemData', data.data);
        },

        $getActiveSitemapItem: function () {
            const item = this.$Map.getSelectedChildren();

            if (item.length) {
                return item[0];
            }

            return null;
        },

        /**
         * Context menu für a sitemap item
         *
         * @param Item
         * @param event
         */
        $onContextMenu: function (Item, event) {
            event.stop();

            const pos = Item.getElm().getPosition();

            const Menu = new QUIContextMenu({
                events: {
                    onBlur: function (Instance) {
                        Instance.hide();
                        Instance.destroy();
                    }
                }
            });

            // @todo locale
            Menu.appendChild(new QUIContextMenuItem({
                icon  : 'fa fa-arrow-up',
                text  : 'Davor einfügen',
                events: {
                    click: () => {
                        this.addItem(Item, 'before');
                    }
                }
            }));

            Menu.appendChild(new QUIContextMenuItem({
                icon  : 'fa fa-arrow-down',
                text  : 'Danach einfügen',
                events: {
                    click: () => {
                        this.addItem(Item, 'after');
                    }
                }
            }));

            Menu.appendChild(new QUIContextMenuItem({
                icon  : 'fa fa-level-down',
                text  : 'Kind einfügen',
                events: {
                    click: () => {
                        this.addItem(Item);
                    }
                }
            }));

            Menu.appendChild(new QUIContextMenuItem({
                icon  : 'fa fa-trash',
                text  : 'Löschen',
                events: {
                    click: () => {
                        Item.destroy();
                    }
                }
            }));

            Menu.inject(document.body);
            Menu.setPosition(pos.x, pos.y + 30);
            Menu.setTitle(Item.getAttribute('text'));
            Menu.show();
            Menu.focus();
        }
    });
});
