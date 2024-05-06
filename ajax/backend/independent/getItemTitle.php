<?php

/**
 * This file contains package_quiqqer_menu_ajax_backend_independent_getItemTitle
 */

/**
 * Return the item name
 */

use QUI\Menu\Independent\Items\AbstractMenuItem;

QUI::$Ajax->registerFunction(
    'package_quiqqer_menu_ajax_backend_independent_getItemTitle',
    function ($item) {
        $item = json_decode($item, true);

        if (!class_exists($item['type'])) {
            return '';
        }

        /* @var $Item AbstractMenuItem */
        $Item = new $item['type']($item);
        return $Item->getTitle();
    },
    ['item'],
    'Permission::checkAdminUser'
);
