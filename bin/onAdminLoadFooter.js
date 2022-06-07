window.addEvent('domready', function () {
    require([
        'qui/QUI',
        'qui/controls/buttons/Button',
        'Ajax',
        'Locale'
    ], function (QUI, QUIButton, QUIAjax, QUILocale) {
        QUI.addEvent('onQuiqqerCacheClearPanel', function (Setting) {
            const lg = 'quiqqer/menu';
            const Content = Setting.getElm();

            const Table = new Element('table', {
                'class': 'data-table data-table-flexbox quiqqer-settings-cache-table quiqqer-settings-cache-container',
                html   : '<thead>' +
                         '  <tr>' +
                         '      <th>' + QUILocale.get(lg, 'cache.clear.title') + '</th>' +
                         '  </tr>' +
                         '</thead>' +
                         '<tbody>' +
                         '  <tr>' +
                         '      <td>' +
                         '          ' +
                         '      </td>' +
                         '  </tr>' +
                         '</tbody>'
            }).inject(Content);

            new QUIButton({
                textimage: 'fa fa-bars',
                text     : QUILocale.get(lg, 'cache.clear.button.title'),
                styles   : {
                    width: '100%'
                },
                events   : {
                    click: function (Btn) {
                        Btn.disable();
                        Btn.setAttribute('textimage', 'fa fa-spinner fa-spin');
                        QUIAjax.post('package_quiqqer_menu_ajax_backend_independent_clearCache', function () {
                            Btn.setAttribute('textimage', 'fa fa-bars');
                            Btn.enable();

                            QUI.getMessageHandler(function (QUI) {
                                QUI.addSuccess(
                                    QUILocale.get('quiqqer/quiqqer', 'message.clear.cache.successful')
                                );
                            });
                        }, {
                            'package': 'quiqqer/menu'
                        });
                    }
                }
            }).inject(Table.getElement('tbody tr td'));
        });
    });
});
