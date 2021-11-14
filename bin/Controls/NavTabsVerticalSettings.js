/**
 *
 * @module package/quiqqer/menu/bin/Controls/NavTabsVerticalSettings
 *
 * @require qui/controls/elements/FormList
 * @require css!package/quiqqer/menu/bin/Controls/NavTabsVerticalSettings.css
 */
define('package/quiqqer/menu/bin/Controls/NavTabsVerticalSettings', [

    'qui/controls/elements/FormList',
    'utils/Controls',
    'Locale',
    'Mustache',

    'text!package/quiqqer/menu/bin/Controls/NavTabsVerticalSettings.html',
    'css!package/quiqqer/menu/bin/Controls/NavTabsVerticalSettings.css'

], function (QUIFormList, QUIControls, QUILocale, Mustache, template) {
    "use strict";

    var lg = 'quiqqer/menu';

    return new Class({

        Extends: QUIFormList,
        Type   : 'package/quiqqer/menu/bin/Controls/NavTabsVerticalSettings',

        Binds: [
            '$onParsed'
        ],

        initialize: function (options) {
            this.parent(options);

            this.$Project = null;

            this.addEvents({
                onParsed: this.$onParsed
            });

            this.getElm().addClass('qui-controls-formlist-navTabsVerticalSettings');

            this.setAttributes({
                buttonText: QUILocale.get(lg, 'control.navTabsVertical.entries.addButton'),
                entry     : Mustache.render(template, {
                    'title'         : QUILocale.get(lg, 'control.navTabsVertical.entries.entryTitle'),
                    'titleIcon'     : QUILocale.get(lg, 'control.navTabsVertical.entries.entryTitleIcon'),
                    'titleIconColor': QUILocale.get(lg, 'control.navTabsVertical.entries.entryTitleIconColor'),
                    'image'         : QUILocale.get(lg, 'control.navTabsVertical.entries.entryImage'),
                    'content'       : QUILocale.get(lg, 'control.navTabsVertical.entries.entryContent')
                })
            });
        },

        /**
         * set the project to the control
         *
         * @param Project
         */
        setProject: function (Project) {
            this.$Project = Project;
            this.$onParsed(false, this.getElm());
        },

        /**
         * Parses QUI controls when a new entry is created
         *
         * Fired after (inherited) FormList has parsed the content
         *
         * @param event
         * @param Node - The element that was previously parsed by (inherited) FormList
         */
        $onParsed: function (event, Node) {
            if (!this.$Project) {
                return;
            }

            this.$executeParsing(Node);
        },

        /**
         * Parse the editor
         *
         * @param Node
         * @returns {Promise}
         */
        $executeParsing: function (Node) {
            var self = this;

            return QUIControls.parse(Node).then(function () {
                // Element is fully parsed so we can finally show it
                Node.getElements('.quiqqer-menu-navTabsVerticalSettings-entry').show();
                self.getElm().addClass('qui-controls-formlist-navTabsVerticalSettings');

                var inputEditors = Node.getElements('[data-qui="controls/editors/Input"]').map(function (InnerNode) {
                    return QUI.Controls.getById(InnerNode.get('data-quiid'));
                });

                for (var i = 0, len = inputEditors.length; i < len; i++) {
                    if (inputEditors[i]) {
                        inputEditors[i].setProject(self.$Project);
                    }
                }
            });
        }
    });
});
