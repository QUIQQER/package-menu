<?php

/**
 * This file contains package_quiqqer_menu_ajax_backend_independent_clearCache
 */

/**
 * Clears the menu cache
 */

use QUI\Menu\Independent\Handler;

QUI::$Ajax->registerFunction(
    'package_quiqqer_menu_ajax_backend_independent_clearCache',
    function ($menuId) {
        QUI\Cache\Manager::clear(
            Handler::getMenuCacheName($menuId)
        );
    },
    ['menuId'],
    'Permission::checkAdminUser'
);
