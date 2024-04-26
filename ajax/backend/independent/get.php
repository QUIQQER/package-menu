<?php

/**
 * This file contains package_quiqqer_menu_ajax_backend_independent_get
 */

use QUI\Menu\Independent\Items\AbstractMenuItem;

QUI::$Ajax->registerFunction(
    'package_quiqqer_menu_ajax_backend_independent_get',
    function ($id) {
        $Menu = QUI\Menu\Independent\Handler::getMenu($id);
        $result = $Menu->toArray();

        function parseChildren(&$data)
        {
            if (!isset($data['children']) || !is_array($data['children'])) {
                return $data;
            }

            foreach ($data['children'] as $key => $entry) {
                if (!class_exists($entry['type'])) {
                    continue;
                }

                /* @var $Item AbstractMenuItem */
                $Item = new $entry['type']($entry);
                $icon = QUI\Menu\Independent\Items\Site::itemIcon(); // default

                if (class_exists($entry['type'])) {
                    $icon = call_user_func([$entry['type'], 'itemIcon']);
                }

                if (isset($entry['children'])) {
                    $data['children'][$key] = parseChildren($entry);
                }

                $data['children'][$key]['typeIcon'] = $icon;
                $data['children'][$key]['titleFrontend'] = $Item->getTitle();
            }

            return $data;
        }

        $result['data'] = parseChildren($result['data']);

        return $result;
    },
    ['id'],
    'Permission::checkAdminUser'
);
