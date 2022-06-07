/**
 * @module package/quiqqer/menu/bin/Controls/Independent/Input
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/menu/bin/Controls/Independent/Input', [

    'qui/controls/Control',
    'qui/controls/windows/Confirm',
    'package/quiqqer/menu/bin/classes/IndependentHandler',
    'Locale',

    'css!package/quiqqer/menu/bin/Controls/Independent/Input.css'

], function (QUIControl, QUIConfirm, IndependentHandler, QUILocale) {
    "use strict";

    const lg = 'quiqqer/menu';

    /**
     * @class controls/projects/Input
     *
     * @param {Object} options
     * @param {HTMLElement} [Input] - (optional) if no input given, one would be created
     *
     * @memberof! <global>
     */
    return new Class({

        Extends: QUIControl,
        Type   : 'controls/projects/project/media/Input',

        Binds: [
            '$onInject',
            'click'
        ],

        initialize: function (options, Input) {
            this.parent(options);

            this.$Input = Input || null;

            this.addEvents({
                onImport: this.$onImport
            });
        },

        refreshDisplay: function () {
            if (!this.$Display || !this.$Input) {
                return;
            }

            if (this.$Input.value === '') {
                this.$Display.set('html', '');
                return;
            }

            const value = parseInt(this.$Input.value);

            IndependentHandler.getList().then((list) => {
                for (let i = 0, len = list.length; i < len; i++) {
                    if (parseInt(list[i].id) === value) {
                        this.$Display.set('html', '#' + list[i].id + ' ' + list[i].title);
                    }
                }
            });

        },

        create: function () {
            this.$Elm = new Element('div', {
                'class'     : 'quiqqer-menu-independent-input',
                'data-quiid': this.getId(),
                'data-qui'  : 'package/quiqqer/menu/bin/Controls/Independent/Input'
            });

            if (!this.$Input) {
                this.$Input = new Element('input', {
                    name: this.getAttribute('name')
                }).inject(this.$Elm);
            } else {
                this.$Elm.wraps(this.$Input);
            }

            if (this.$Input.hasClass('field-container-field')) {
                this.$Elm.addClass('field-container-field');
                this.$Input.removeClass('field-container-field');
            }

            this.$Input.type = 'hidden';

            this.$Display = new Element('div', {
                'class': 'quiqqer-menu-independent-input-display'
            }).inject(this.$Elm);

            this.$Display.addEvent('click', (e) => {
                e.stop();
                this.click();
            });

            new Element('button', {
                'class': 'button qui-button--no-icon qui-button qui-utils-noselect',
                html   : '<span class="fa fa-bars"></span>',
                title  : QUILocale.get(lg, 'quiqqer.menu.select.win.button'),
                events : {
                    click: (e) => {
                        e.stop();
                        this.click();
                    }
                }
            }).inject(this.$Elm);

            new Element('button', {
                'class': 'button qui-button--no-icon qui-button qui-utils-noselect',
                html   : '<span class="fa fa-remove"></span>',
                title  : QUILocale.get('quiqqer/quiqqer', 'remove'),
                events : {
                    click: (e) => {
                        e.stop();
                        this.$Input.value = '';
                        this.refreshDisplay();
                    }
                }
            }).inject(this.$Elm);

            if (this.$Input.value !== '') {
                this.refreshDisplay();
            }

            return this.$Elm;
        },

        $onImport: function () {
            this.$Input = this.getElm();
            this.create();
        },

        click: function () {
            new QUIConfirm({
                icon     : 'fa fa-bars',
                title    : QUILocale.get(lg, 'quiqqer.menu.select.win.title'),
                maxHeight: 300,
                maxWidth : 500,
                events   : {
                    onOpen  : (Win) => {
                        Win.getContent().set('html', '');
                        Win.getContent().setStyle('textAlign', 'center');
                        Win.Loader.show();

                        IndependentHandler.getList().then((list) => {
                            Win.getContent().set(
                                'html',
                                QUILocale.get(lg, 'quiqqer.menu.select.win.content')
                            );

                            const Select = new Element('select', {
                                styles: {
                                    clear  : 'both',
                                    display: 'inline-block',
                                    margin : '20px 0 0 0',
                                    width  : '50%'
                                }
                            }).inject(Win.getContent());

                            new Element('option', {
                                'html' : '',
                                'value': ''
                            }).inject(Select);

                            for (let i = 0, len = list.length; i < len; i++) {
                                new Element('option', {
                                    'html' : '#' + list[i].id + ' ' + list[i].title,
                                    'value': list[i].id
                                }).inject(Select);
                            }

                            Select.value = this.$Input.value;
                            Win.Loader.hide();
                        });
                    },
                    onSubmit: (Win) => {
                        this.$Input.value = Win.getContent().getElement('select').value;
                        this.refreshDisplay();
                        Win.close();
                    }
                }
            }).open();
        }
    });
});