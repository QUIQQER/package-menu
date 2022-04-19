<?php

/**
 * This file contains package_quiqqer_menu_ajax_backend_independent_list
 */

/**
 * Returns all menus
 *
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_menu_ajax_backend_independent_list',
    function ($page, $limit) {
        $result = QUI\Menu\Independent\Handler::getList();

        return array_map(function ($Menu) {
            return $Menu->toArray();
        }, $result);
    },
    ['page', 'limit'],
    'Permission::checkAdminUser'
);
