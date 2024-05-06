<?php

/**
 * This file contains package_quiqqer_menu_ajax_backend_independent_getItemName
 */

/**
 * Return the item name
 */

use QUI\Menu\Independent\Items\AbstractMenuItem;

QUI::$Ajax->registerFunction(
    'package_quiqqer_menu_ajax_backend_independent_getItemName',
    function ($item) {
        $item = json_decode($item, true);

        if (!class_exists($item['type'])) {
            return '';
        }

        /* @var $Item AbstractMenuItem */
        $Item = new $item['type']($item);
        return $Item->getName();
    },
    ['item'],
    'Permission::checkAdminUser'
);
