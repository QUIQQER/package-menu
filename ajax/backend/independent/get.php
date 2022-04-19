<?php

/**
 * This file contains package_quiqqer_menu_ajax_backend_independent_get
 */

/**
 *
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_menu_ajax_backend_independent_get',
    function ($id) {
        $Menu   = QUI\Menu\Independent\Handler::getMenu($id);
        $result = $Menu->toArray();

        function parseChildren(&$data)
        {
            if (!isset($data['children']) || !is_array($data['children'])) {
                return $data;
            }

            foreach ($data['children'] as $key => $entry) {
                $icon = QUI\Menu\Independent\Items\Site::itemIcon();

                if (class_exists($entry['type'])) {
                    $icon = call_user_func([$entry['type'], 'itemIcon']);
                }

                if (isset($entry['children'])) {
                    $data['children'][$key] = parseChildren($entry);
                }

                $data['children'][$key]['icon'] = $icon;
            }

            return $data;
        }

        $result['data'] = parseChildren($result['data']);

        return $result;
    },
    ['id'],
    'Permission::checkAdminUser'
);
