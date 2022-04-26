<?php

/**
 * This file contains package_quiqqer_menu_ajax_backend_independent_getItemName
 */

/**
 * Return the item name
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_menu_ajax_backend_independent_getItemName',
    function ($item) {
        $item = json_decode($item, true);

        if (!class_exists($item['type'])) {
            return '';
        }

        /* @var $Item \QUI\Menu\Independent\Items\AbstractMenuItem */
        $Item = new $item['type']($item);
        return $Item->getName();
    },
    ['item'],
    'Permission::checkAdminUser'
);
