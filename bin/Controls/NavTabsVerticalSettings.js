/**
 * @module package/quiqqer/menu/bin/Controls/NavTabsVertical
 * @author Dominik Chrzanowski
 *
 */
define('package/quiqqer/menu/bin/Controls/NavTabsVerticalSettings', [

    'qui/QUI',
    'qui/controls/Control',
    'qui/controls/windows/Confirm',
    'qui/controls/buttons/Button',
    'qui/controls/buttons/Switch',
    'Locale',
    'Mustache',
    'controls/grid/Grid',
    'utils/Controls',

    'text!package/quiqqer/menu/bin/Controls/NavTabsVerticalSettings.html',
    'css!package/quiqqer/menu/bin/Controls/NavTabsVerticalSettings.css'

], function (
    QUI,
    QUIControl,
    QUIConfirm,
    QUIButton,
    QUISwitch,
    QUILocale,
    Mustache,
    Grid,
    ControlsUtils,
    templateEntry
) {
    "use strict";

    var lg = 'quiqqer/menu';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/quiqqer/menu/bin/Controls/NavTabsVerticalSettings',

        Binds: [
            '$onImport',
            '$openAddDialog',
            '$openDeleteDialog',
            '$openEditDialog',
            '$toggleSlideStatus',
            'update'
        ],

        initialize: function (options) {
            this.parent(options);

            this.$Input = null;
            this.$Grid  = null;

            this.$data = [];

            this.addEvents({
                onImport: this.$onImport
            });
        },

        /**
         * event: on import
         */
        $onImport: function () {
            this.$Input = this.getElm();

            this.$Elm = new Element('div', {
                'class': 'quiqqer-menu-navTabsVertival-settings',
                styles : {
                    clear   : 'both',
                    'float' : 'left',
                    height  : 400,
                    overflow: 'hidden',
                    position: 'relative',
                    margin  : '10px 0 0 0',
                    width   : '100%'
                }
            }).wraps(this.$Input);

            // grid and sizes
            var size = this.$Elm.getSize();

            var Desktop = new Element('div', {
                styles: {
                    width: size.x
                }
            }).inject(this.$Elm);

            this.$Grid = new Grid(Desktop, {
                height     : 400,
                width      : size.x,
                buttons    : [
                    {
                        name    : 'up',
                        icon    : 'fa fa-angle-up',
                        disabled: true,
                        events  : {
                            onClick: function () {
                                this.$Grid.moveup();
                                this.$refreshSorting();
                            }.bind(this)
                        }
                    }, {
                        name    : 'down',
                        icon    : 'fa fa-angle-down',
                        disabled: true,
                        events  : {
                            onClick: function () {
                                this.$Grid.movedown();
                                this.$refreshSorting();
                            }.bind(this)
                        }
                    }, {
                        type: 'separator'
                    }, {
                        name     : 'add',
                        textimage: 'fa fa-plus',
                        text     : QUILocale.get('quiqqer/core', 'add'),
                        events   : {
                            onClick: this.$openAddDialog
                        }
                    }, {
                        type: 'separator'
                    }, {
                        name     : 'edit',
                        textimage: 'fa fa-edit',
                        text     : QUILocale.get('quiqqer/core', 'edit'),
                        disabled : true,
                        events   : {
                            onClick: this.$openEditDialog
                        }
                    }, {
                        name     : 'delete',
                        textimage: 'fa fa-trash',
                        text     : QUILocale.get('quiqqer/core', 'delete'),
                        disabled : true,
                        events   : {
                            onClick: this.$openDeleteDialog
                        }
                    }
                ],
                columnModel: [
                    {
                        header   : QUILocale.get(lg, 'control.navTabsVertical.entries.isDisable'),
                        dataIndex: 'isDisabledDisplay',
                        dataType : 'QUI',
                        width    : 80
                    }, {
                        dataIndex: 'isDisabled',
                        hidden   : true
                    }, {
                        header   : QUILocale.get(lg, 'control.navTabsVertical.entries.entryTitleIcon'),
                        dataIndex: 'titleIconPreview',
                        dataType : 'node',
                        width    : 120
                    },
                    {
                        header   : QUILocale.get(lg, 'control.navTabsVertical.entries.entryTitle'),
                        dataIndex: 'entryTitle',
                        dataType : 'code',
                        width    : 120
                    },
                    {
                        header   : QUILocale.get(lg, 'control.navTabsVertical.entries.entryImage'),
                        dataIndex: 'entryImagePreview',
                        dataType : 'node',
                        width    : 60
                    },
                    {
                        header   : QUILocale.get(lg, 'control.navTabsVertical.entries.entryContent'),
                        dataIndex: 'entryContent',
                        dataType : 'code',
                        width    : 250
                    },
                    {
                        dataIndex: 'newTab',
                        hidden   : true
                    }, {
                        dataIndex: 'image',
                        dataType : 'string',
                        hidden   : true
                    }
                ]
            });

            this.$Grid.addEvents({
                onClick: function () {
                    var buttons = this.$Grid.getButtons(),

                        Edit    = buttons.filter(function (Btn) {
                            return Btn.getAttribute('name') === 'edit';
                        })[0],

                        Up      = buttons.filter(function (Btn) {
                            return Btn.getAttribute('name') === 'up';
                        })[0],

                        Down    = buttons.filter(function (Btn) {
                            return Btn.getAttribute('name') === 'down';
                        })[0],

                        Delete  = buttons.filter(function (Btn) {
                            return Btn.getAttribute('name') === 'delete';
                        })[0];

                    Up.enable();
                    Down.enable();
                    Edit.enable();
                    Delete.enable();
                }.bind(this),

                onDblClick: this.$openEditDialog
            });

            this.$Grid.getElm().setStyles({
                position: 'absolute'
            });


            try {
                this.$data = JSON.decode(this.$Input.value);

                if (typeOf(this.$data) !== 'array') {
                    this.$data = [];
                }

                this.refresh();
            } catch (e) {
            }
        },

        /**
         * Toggles the slide's status between enabled and disabled
         *
         * @param {Object} [Caller] - the object calling this event
         */
        $toggleSlideStatus: function (Caller) {
            if (!Caller) {
                return;
            }

            // get cell number
            var row = Caller.getElm().getParent('li').get('data-row');

            this.$data[row].isDisabled = Caller.getStatus();
            this.update();
        },

        /**
         * Resize the control
         *
         * @return {Promise}
         */
        resize: function () {
            var size = this.getElm().getSize();

            return this.$Grid.setWidth(size.x).then(function () {
                this.$Grid.resize();
            }.bind(this));
        },

        /**
         * refresh the display
         */
        refresh: function () {
            var i, len, entry, insert;
            var data = [];

            for (i = 0, len = this.$data.length; i < len; i++) {
                entry  = this.$data[i];
                insert = {
                    titleIcon        : '',
                    entryImage       : '',
                    titleIconPreview : new Element('span', {html: '&nbsp;'}),
                    entryImagePreview: new Element('span', {html: '&nbsp;'})
                };

                entry.isDisabled = parseInt(entry.isDisabled);

                insert.isDisabledDisplay = new QUISwitch({
                    status: entry.isDisabled,
                    name  : i,
                    uid   : i,
                    events: {
                        onChange: this.$toggleSlideStatus
                    }
                });

                if ("titleIcon" in entry && entry.titleIcon !== '') {
                    insert.titleIcon = entry.titleIcon;

                    if (entry.titleIcon.includes('fa ')) {
                        insert.titleIconPreview = new Element('span', {
                            'class': insert.titleIcon
                        });
                    } else {
                        insert.titleIconPreview = new Element('img', {
                            src   : URL_DIR + insert.titleIcon + '&maxwidth=50&maxheight=50',
                            width : 50,
                            height: 50
                        });
                    }
                }

                if ("entryTitle" in entry) {
                    insert.entryTitle = entry.entryTitle;
                }

                if ("entryImage" in entry && entry.entryImage !== '') {
                    insert.entryImage = entry.entryImage;

                    insert.entryImagePreview = new Element('img', {
                        src   : URL_DIR + insert.entryImage + '&maxwidth=50&maxheight=50',
                        width : 50,
                        height: 50
                    });
                }

                if ("entryContent" in entry) {
                    insert.entryContent = entry.entryContent;
                }

                data.push(insert);
            }

            this.$Grid.setData({
                data: data
            });

            var buttons = this.$Grid.getButtons(),

                Edit    = buttons.filter(function (Btn) {
                    return Btn.getAttribute('name') === 'edit';
                })[0],

                Up      = buttons.filter(function (Btn) {
                    return Btn.getAttribute('name') === 'up';
                })[0],

                Down    = buttons.filter(function (Btn) {
                    return Btn.getAttribute('name') === 'down';
                })[0],

                Delete  = buttons.filter(function (Btn) {
                    return Btn.getAttribute('name') === 'delete';
                })[0];

            Up.disable();
            Down.disable();
            Edit.disable();
            Delete.disable();
        },

        /**
         * Update the field
         */
        update: function () {
            this.$Input.value = JSON.encode(this.$data);
        },

        /**
         * Add an entry
         *
         * @param {Object} params
         */
        add: function (params) {
            var entry = {
                titleIcon   : '',
                entryTitle  : '',
                entryImage  : '',
                entryContent: '',
                isDisabled  : 0
            };

            if ("isDisabled" in params) {
                entry.isDisabled = parseInt(params.isDisabled);
            }

            if ("titleIcon" in params && params.titleIcon !== '') {
                entry.titleIcon = params.titleIcon;
            }

            if ("entryTitle" in params) {
                entry.entryTitle = params.entryTitle;
            }

            if ("entryImage" in params) {
                entry.entryImage = params.entryImage;
            }

            if ("entryContent" in params) {
                entry.entryContent = params.entryContent;
            }

            this.$data.push(entry);
            this.refresh();
            this.update();
        },

        /**
         * Edit an entry
         *
         * @param {number} index
         * @param {object} params
         */
        edit: function (index, params) {

            if (typeof index === 'undefined') {
                return;
            }

            var entry = {
                titleIcon   : '',
                entryTitle  : '',
                entryImage  : '',
                entryContent: '',
                isDisabled  : 0
            };

            if ("isDisabled" in params) {
                entry.isDisabled = parseInt(params.isDisabled);
            }

            if ("titleIcon" in params) {
                entry.titleIcon = params.titleIcon;
            }

            if ("entryTitle" in params) {
                entry.entryTitle = params.entryTitle;
            }

            if ("entryImage" in params) {
                entry.entryImage = params.entryImage;
            }

            if ("entryContent" in params) {
                entry.entryContent = params.entryContent;
            }

            this.$data[index] = entry;

            this.refresh();
            this.update();
        },

        /**
         * Delete one entry or multiple entries
         *
         * @param {number|array} index
         */
        del: function (index) {
            var newList = [];

            if (typeOf(index) !== 'array') {
                index = [index];
            }

            for (var i = 0, len = this.$data.length; i < len; i++) {
                if (!index.contains(i)) {
                    newList.push(this.$data[i]);
                }
            }

            this.$data = newList;
        },

        /**
         * Set the used project
         *
         * @param {string|object} Project
         */
        setProject: function (Project) {
            this.setAttribute('project', Project);

            var controls = QUI.Controls.getControlsInElement(this.getElm());

            controls.each(function (Control) {
                if (Control === this) {
                    return;
                }

                if ("setProject" in Control) {
                    Control.setProject(Project);
                }
            }.bind(this));
        },

        /**
         * Refresh the data sorting in dependence of the grid
         */
        $refreshSorting: function () {
            var gridData = this.$Grid.getData(),
                data     = [];

            for (var i = 0, len = gridData.length; i < len; i++) {
                data.push({
                    isDisabled  : parseInt(gridData[i].isDisabled),
                    titleIcon   : gridData[i].titleIcon,
                    entryTitle  : gridData[i].entryTitle,
                    entryImage  : gridData[i].entryImage,
                    entryContent: gridData[i].entryContent
                });
            }

            this.$data = data;
            this.update();
        },

        /**
         * Dialogs
         */

        /**
         * opens the delete dialog
         *
         * @return {Promise}
         */
        $openDeleteDialog: function () {
            new QUIConfirm({
                icon       : 'fa fa-icon',
                text       : QUILocale.get(lg, 'control.navTabsVertical.entries.delete.title'),
                information: QUILocale.get(lg, 'control.navTabsVertical.entries.delete.information'),
                texticon   : false,
                maxWidth   : 600,
                maxHeight  : 400,
                ok_button  : {
                    text     : QUILocale.get('quiqqer/core', 'delete'),
                    textimage: 'fa fa-trash'
                },
                events     : {
                    onSubmit: function () {
                        var selected = this.$Grid.getSelectedIndices();

                        this.$Grid.deleteRows(selected);
                        this.del(selected);
                        this.update();
                    }.bind(this)
                }
            }).open();
        },

        /**
         * Open edit dialog
         *
         * @retrun {Promise}
         */
        $openEditDialog: function () {
            var self  = this,
                data  = this.$Grid.getSelectedData(),
                index = this.$Grid.getSelectedIndices();

            if (!data.length) {
                return Promise.resolve();
            }

            data  = data[0];
            index = index[0];

            return this.$createDialog().then(function (Dialog) {

                Dialog.addEvent('onSubmit', function () {
                    Dialog.Loader.show();

                    var Content = Dialog.getContent();
                    var Form    = Content.getElement('form');

                    var Image        = Form.elements.titleIcon;
                    var entryTitle   = Form.elements.entryTitle;
                    var entryImage   = Form.elements.entryImage;
                    var entryContent = Form.elements.entryContent;

                    self.edit(index, {
                        titleIcon   : Image.value,
                        entryTitle  : entryTitle.value,
                        entryImage  : entryImage.value,
                        entryContent: entryContent.value,
                        isDisabled  : Dialog.IsDisabledSwitch.getStatus()
                    });

                    Dialog.close();
                });


                Dialog.addEvent('onOpenAfterCreate', function () {

                    var Content = Dialog.getContent();
                    var Form    = Content.getElement('form');

                    var Image        = Form.elements.titleIcon;
                    var entryTitle   = Form.elements.entryTitle;
                    var entryImage   = Form.elements.entryImage;
                    var entryContent = Form.elements.entryContent;

                    if (data.isDisabled) {
                        Dialog.IsDisabledSwitch.on();
                    } else {
                        Dialog.IsDisabledSwitch.off();
                    }

                    Image.value        = data.titleIcon;
                    entryTitle.value   = data.entryTitle;
                    entryImage.value   = data.entryImage;
                    entryContent.value = data.entryContent;

                    if (data.newTab && data.newTab.getAttribute('data-enabled') === "1") {
                        Dialog.NewTabSwitch.on();
                    } else {
                        Dialog.NewTabSwitch.off();
                    }

                    Image.fireEvent('change');
                    entryTitle.fireEvent('change');
                    entryImage.fireEvent('change');
                    entryContent.fireEvent('change');
                });

                Dialog.setAttribute('title', QUILocale.get(lg, 'control.navTabsVertical.entries.edit.title'));
                Dialog.open();
            });
        },

        /**
         * opens the add dialog
         *
         * @return {Promise}
         */
        $openAddDialog: function () {
            var self = this;

            return this.$createDialog().then(function (Dialog) {
                Dialog.addEvent('onSubmit', function () {
                    Dialog.Loader.show();

                    var Content = Dialog.getContent();
                    var Form    = Content.getElement('form');

                    var Image        = Form.elements.titleIcon;
                    var entryTitle   = Form.elements.entryTitle;
                    var entryImage   = Form.elements.entryImage;
                    var entryContent = Form.elements.entryContent;

                    self.add({
                        titleIcon   : Image.value,
                        entryTitle  : entryTitle.value,
                        entryImage  : entryImage.value,
                        entryContent: entryContent.value,
                        isDisabled  : Dialog.IsDisabledSwitch.getStatus()
                    });

                    Dialog.close();
                });

                Dialog.open();
            });
        },

        /**
         * Create a edit / add entry dialog
         *
         * @return {Promise}
         */
        $createDialog: function () {
            var self = this;

            return new Promise(function (resolve) {
                var Dialog = new QUIConfirm({
                    title           : QUILocale.get(lg, 'control.navTabsVertical.entries.add.title'),
                    icon            : 'fa fa-edit',
                    maxWidth        : 800,
                    maxHeight       : 600,
                    autoclose       : false,
                    IsDisabledSwitch: false,
                    NewTabSwitch    : false,
                    events          : {
                        onOpen: function (Win) {
                            Win.Loader.show();
                            Win.getContent().set('html', '');


                            var prefix    = 'control.navTabsVertical.entries.',
                                Container = new Element('div', {
                                    html   : Mustache.render(templateEntry, {
                                        fieldIsDisabled  : QUILocale.get(lg, prefix + 'isDisable'),
                                        fieldTitleIcon   : QUILocale.get(lg, prefix + 'entryTitleIcon'),
                                        fieldEntryTitle  : QUILocale.get(lg, prefix + 'entryTitle'),
                                        fieldEntryImage  : QUILocale.get(lg, prefix + 'entryImage'),
                                        fieldEntryContent: QUILocale.get(lg, prefix + 'entryContent')
                                    }),
                                    'class': 'quiqqer-menu-navTabsVertival-settings'
                                }).inject(Win.getContent());

                            var Text = Container.getElement('.field-entryContent');

                            Text.getParent().setStyles({
                                height: 100
                            });

                            Win.IsDisabledSwitch = new QUISwitch({
                                name  : 'isDisabled',
                                status: false
                            }).inject(Container.getElement('#isDisabledWrapper'));

                            Win.NewTabSwitch = new QUISwitch({
                                name: 'newTab'
                            }).inject(Container.getElement('#newTabWrapper'));


                            QUI.parse(Container).then(function () {
                                return ControlsUtils.parse(Container);
                            }).then(function () {
                                var controls = QUI.Controls.getControlsInElement(Container),
                                    project  = self.getAttribute('project');

                                controls.each(function (Control) {
                                    if (Control === self) {
                                        return;
                                    }

                                    if ("setProject" in Control) {
                                        Control.setProject(project);
                                    }
                                });

                                Win.fireEvent('openAfterCreate', [Win]);

                                moofx(Container).animate({
                                    opacity: 1,
                                    top    : 0
                                }, {
                                    duration: 250,
                                    callback: function () {
                                        resolve(Container);
                                        Win.Loader.hide();
                                    }
                                });
                            });
                        }
                    }
                });

                resolve(Dialog);
            });
        }
    });
});
