<?php

namespace QUI\Menu\Independent;

use QUI;

/**
 * Smart function for the smarty {menu} function
 *
 * {menu id=ID control=QUI\Class\Menu\Control}
 */
class Smarty
{
    /**
     * Menu function for smarty
     *
     * @return void
     */
    public static function menu($params, $smarty): string
    {
        if (empty($params['id']) || empty($params['control'])) {
            QUI\System\Log::addError('No menuId or menuDesign param for {menu} smarty function');
            return '';
        }

        try {
            $Project = QUI::getRewrite()->getProject();
        } catch (QUI\Exception $Exception) {
            return '';
        }

        $menuId    = $params['id'];
        $cacheName = Handler::getMenuCacheName($menuId, $Project);

        try {
            return QUI\Cache\Manager::get($cacheName);
        } catch (QUI\Exception $Exception) {
        }

        try {
            $Menu    = QUI\Menu\Independent\Handler::getMenu($params['id']);
            $Control = new $params['control']($Menu);
        } catch (QUI\Exception $Exception) {
            QUI\System\Log::addError($Exception->getMessage());
            return '';
        }

        $html = $Control->create();
        QUI\Cache\Manager::set($cacheName, $html);

        return $html;
    }
}
