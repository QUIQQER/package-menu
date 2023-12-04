<?php

/**
 * This file contains package_quiqqer_menu_ajax_backend_independent_getItemTypes
 */

/**
 * Returns all menus
 *
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_menu_ajax_backend_independent_getItemTypes',
    function () {
        $list = QUI\Menu\Independent\Handler::getItemList();
        $result = [];

        foreach ($list as $class) {
            $result[] = [
                'title' => call_user_func([$class, 'itemTitle']),
                'icon' => call_user_func([$class, 'itemIcon']),
                'jsControl' => call_user_func([$class, 'itemJsControl']),
                'class' => $class
            ];
        }

        return $result;
    },
    false,
    'Permission::checkAdminUser'
);
