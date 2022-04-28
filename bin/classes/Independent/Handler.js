/**
 * @module package/quiqqer/menu/bin/classes/Independent/Handler
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/menu/bin/classes/Independent/Handler', [

    'qui/QUI',
    'qui/classes/QUI',
    'Ajax'

], function (QUI, QUIDOM, QUIAjax) {
    "use strict";

    let itemTypes = null;

    return new Class({

        Extends: QUIDOM,
        Type   : 'package/quiqqer/menu/bin/classes/Independent/Handler',

        getList: function () {
            return new Promise(function (resolve, reject) {
                QUIAjax.get('package_quiqqer_menu_ajax_backend_independent_list', resolve, {
                    'package': 'quiqqer/menu',
                    onError  : reject
                });
            });
        },

        /**
         * Return all available menu item types
         *
         * @returns {Promise}
         */
        getItemTypes: function () {
            if (itemTypes !== null) {
                return Promise.resolve(itemTypes);
            }

            return new Promise(function (resolve, reject) {
                QUIAjax.get('package_quiqqer_menu_ajax_backend_independent_getItemTypes', function (result) {
                    itemTypes = result;
                    resolve(itemTypes);
                }, {
                    'package': 'quiqqer/menu',
                    onError  : reject
                });
            });
        },

        /**
         * Return the name of the types
         *
         * @returns {Promise}
         */
        getTypeName: function (type) {
            return this.getItemTypes().then((list) => {
                for (let i = 0, len = list.length; i < len; i++) {
                    if (list[i].class === type) {
                        return list[i].title;
                    }
                }

                return '';
            });
        },

        createMenu: function (title, workingTitle) {
            return new Promise(function (resolve, reject) {
                QUIAjax.post('package_quiqqer_menu_ajax_backend_independent_create', resolve, {
                    'package'   : 'quiqqer/menu',
                    title       : title,
                    workingTitle: workingTitle,
                    onError     : reject
                });
            });
        },

        getMenu: function (id) {
            return new Promise(function (resolve, reject) {
                QUIAjax.get('package_quiqqer_menu_ajax_backend_independent_get', resolve, {
                    'package': 'quiqqer/menu',
                    id       : id,
                    onError  : reject
                });
            });
        },

        deleteMenus: function (ids) {
            if (typeOf(ids) !== 'array') {
                return Promise.reject('No array given');
            }

            return new Promise(function (resolve, reject) {
                QUIAjax.post('package_quiqqer_menu_ajax_backend_independent_delete', resolve, {
                    'package': 'quiqqer/menu',
                    ids      : JSON.stringify(ids),
                    onError  : reject
                });
            });
        },

        saveMenu: function (id, title, workingTitle, data) {
            return new Promise(function (resolve, reject) {
                QUIAjax.post('package_quiqqer_menu_ajax_backend_independent_save', resolve, {
                    'package'   : 'quiqqer/menu',
                    id          : id,
                    title       : title,
                    workingTitle: workingTitle,
                    data        : JSON.encode(data),
                    onError     : reject
                });
            });
        }
    });
});