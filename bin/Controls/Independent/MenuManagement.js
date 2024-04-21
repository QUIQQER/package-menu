/**
 * @module package/quiqqer/menu/bin/Controls/Independent/MenuManagement
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/menu/bin/Controls/Independent/MenuManagement', [

    'qui/QUI',
    'qui/controls/desktop/Panel',
    'qui/controls/windows/Confirm',
    'controls/grid/Grid',
    'Locale',
    'Ajax',
    'Mustache',
    'package/quiqqer/menu/bin/classes/IndependentHandler',

    'text!package/quiqqer/menu/bin/Controls/Independent/MenuManagement.Create.html'

], function (QUI, QUIPanel, QUIConfirm, Grid, QUILocale, QUIAjax, Mustache, Handler, templateCreate) {
    "use strict";

    const lg = 'quiqqer/menu';

    return new Class({

        Extends: QUIPanel,
        Type   : 'package/quiqqer/menu/bin/Controls/Independent/MenuManagement',

        Binds: [
            'refresh',
            '$onCreate',
            '$onInject',
            '$onResize',
            '$onGridClick',
            '$onGridDblClick',
            'openCreationWindow',
            'openDeletionWindow'
        ],

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                icon : 'fa fa-bars',
                title: QUILocale.get(lg, 'menu.panel.management.title')
            });

            this.$Grid = null;

            this.addEvents({
                onCreate: this.$onCreate,
                onInject: this.$onInject,
                onResize: this.$onResize
            });
        },

        /**
         * Refresh the grid
         *
         * @return {Promise}
         */
        refresh: function () {
            this.parent();

            if (!this.$Grid) {
                return Promise.resolve();
            }

            this.Loader.show();

            return Handler.getList().then((result) => {
                this.$Grid.setData({
                    data: result
                });

                this.Loader.hide();
            });
        },

        $onCreate: function () {
            // buttons
            this.addButton({
                name     : 'add',
                text     : QUILocale.get('quiqqer/quiqqer', 'add'),
                textimage: 'fa fa-plus',
                events   : {
                    onClick: this.openCreationWindow
                }
            });

            this.addButton({
                disabled : true,
                name     : 'delete',
                text     : QUILocale.get('quiqqer/quiqqer', 'remove'),
                textimage: 'fa fa-trash',
                events   : {
                    onClick: this.openDeletionWindow
                }
            });

            // grid
            const Container = new Element('div').inject(this.getContent());

            this.$Grid = new Grid(Container, {
                pagination : true,
                columnModel: [
                    {
                        header   : QUILocale.get(lg, 'grid.menuId'),
                        dataIndex: 'id',
                        dataType : 'number',
                        width    : 50
                    },
                    {
                        header   : QUILocale.get(lg, 'menu.title'),
                        dataIndex: 'title',
                        dataType : 'string',
                        width    : 250
                    },
                    {
                        header   : QUILocale.get(lg, 'menu.workingTitle'),
                        dataIndex: 'workingTitle',
                        dataType : 'string',
                        width    : 350
                    }
                ]
            });

            this.$Grid.addEvents({
                onRefresh : this.refresh,
                onClick   : this.$onGridClick,
                onDblClick: this.$onGridDblClick,
            });

            this.$onResize();
        },

        $onInject: function () {
            this.refresh().catch(console.error);
        },

        /**
         * event : on resize
         */
        $onResize: function () {
            if (!this.$Grid) {
                return;
            }

            const Body = this.getContent();

            if (!Body) {
                return;
            }

            const size = Body.getSize();

            this.$Grid.setHeight(size.y - 40);
            this.$Grid.setWidth(size.x - 40);
        },

        $onGridClick: function () {
            const selected = this.$Grid.getSelectedData();

            if (selected.length) {
                this.getButtons('delete').enable();
            } else {
                this.getButtons('delete').disable();
            }
        },

        $onGridDblClick: function () {
            const selected = this.$Grid.getSelectedData();
            const menuId = selected[0].id;

            this.Loader.show();

            require([
                'utils/Panels',
                'package/quiqqer/menu/bin/Controls/Independent/MenuPanel'
            ], (PanelUtils, MenuPanel) => {
                PanelUtils.openPanelInTasks(
                    new MenuPanel({
                        menuId: menuId
                    })
                );

                this.Loader.hide();
            });
        },

        openCreationWindow: function () {
            new QUIConfirm({
                icon     : 'fa fa-plus',
                title    : QUILocale.get(lg, 'creation.window.title'),
                autoclose: false,
                maxHeight: 500,
                maxWidth : 700,
                events   : {
                    onOpen: (Win) => {
                        Win.Loader.show();

                        Win.getContent().set('html', Mustache.render(templateCreate, {
                            textHeader      : QUILocale.get(lg, 'create.window.headerText'),
                            textTitle       : QUILocale.get(lg, 'create.window.titleText'),
                            textWorkingTitle: QUILocale.get(lg, 'create.window.workingTitleText'),
                        }));

                        QUI.parse(Win.getContent()).then(function () {
                            Win.Loader.hide();
                        });
                    },

                    onSubmit: (Win) => {
                        Win.Loader.show();

                        const Title = Win.getContent().getElement('[name="title"]');
                        const WorkingTitle = Win.getContent().getElement('[name="workingTitle"]');

                        Handler.createMenu(
                            Title.value,
                            WorkingTitle.value
                        ).then(() => {
                            Win.close();
                            this.refresh();
                        });
                    }
                }
            }).open();
        },

        openDeletionWindow: function () {
            const selected = this.$Grid.getSelectedData();
            const ids = selected.map(function (entry) {
                return entry.id;
            });

            let list = '<ul>';

            for (let i = 0, len = selected.length; i < len; i++) {
                list += '<li>' + selected[i].id + ' ' + selected[i].title + '</li>';
            }

            list += '</ul>';

            new QUIConfirm({
                icon       : 'fa fa-trash',
                texticon   : 'fa fa-trash',
                title      : QUILocale.get(lg, 'deletion.window.title'),
                text       : QUILocale.get(lg, 'deletion.window.text'),
                information: QUILocale.get(lg, 'deletion.window.information', {
                    list: list
                }),
                autoclose  : false,
                maxHeight  : 400,
                maxWidth   : 600,
                events     : {
                    onSubmit: (Win) => {
                        Win.Loader.show();

                        Handler.deleteMenus(ids).then(() => {
                            Win.close();
                            this.refresh();
                        }).catch(() => {
                            Win.close();
                            this.refresh();
                        });
                    }
                }
            }).open();
        }
    });
});