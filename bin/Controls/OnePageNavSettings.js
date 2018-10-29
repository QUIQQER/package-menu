/**
 * @module package/quiqqer/menu/bin/Controls/OnePageNavSettings
 * @author www.pcsg.de (Michael Danielczok)
 */
define('package/quiqqer/menu/bin/Controls/OnePageNavSettings', [

    'qui/controls/elements/FormList',
    'utils/Controls',
    'Locale',

    'css!package/quiqqer/menu/bin/Controls/OnePageNavSettings.css'

], function (QUIFormList, QUIControls, QUILocale) {
    "use strict";

    var lg = 'quiqqer/menu';

    return new Class({

        Extends: QUIFormList,
        Type   : 'package/quiqqer/menu/bin/Controls/OnePageNavSettings',

        Binds: [
            '$onParsed'
        ],

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onParsed  : this.$onParsed
            });

            this.setAttributes({
                buttonText: QUILocale.get(lg, 'menu.control.OnePageNav.addLink'),
                entry: '<div class="quiqqer-bricks-ContentSwitcher-entry" style="display: none;">' +
                            '<label>' +
                               '<span class="entry-title">' +
                                 QUILocale.get(lg, 'menu.control.OnePageNav.entries.linkTitle') +
                               '</span>' +
                               '<input type="text" name="linkTitle" />' +
                            '</label>' +
                            '<label>' +
                                '<span class="entry-title">' +
                                    QUILocale.get(lg, 'menu.control.OnePageNav.entries.linkType') +
                                '</span>' +
                                '<select name="linkType">' +
                                    '<option value="anchor">Anker</option>'+
                                    '<option value="url">Url</option>'+
                                '</select>' +
                            '</label>' +
                            '<label>' +
                                '<span class="entry-title">' +
                                    QUILocale.get(lg, 'menu.control.OnePageNav.entries.link') +
                                '</span>' +
                                '<input type="text" name="link" data-external="1" data-qui="controls/projects/project/site/Input" />' +
                            '</label>' +
                       '</div>'
            });
        },

        /**
         * Parses QUI controls when a new entry is created
         *
         * Fired after (inherited) FormList has parsed the content
         *
         * @param event
         * @param Element - The element that was previously parsed by (inherited) FormList
         */
        $onParsed: function (event, Element) {
            QUIControls.parse(Element).then(function () {
                // Element is fully parsed so we can finally show it
                Element.getElement('.quiqqer-bricks-ContentSwitcher-entry').show();
            });
        }
    });
});

