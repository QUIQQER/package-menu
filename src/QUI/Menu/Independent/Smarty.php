<?php

namespace QUI\Menu\Independent;

use QUI;

/**
 * Smart function for the smarty {menu} function
 *
 * {menu menuId=ID menuDesign=QUI\Class\Menu\Control}
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
        if (empty($params['menuId']) || empty($params['menuDesign'])) {
            return;
        }

        try {
            $Menu    = QUI\Menu\Independent\Handler::getMenu($params['menuId']);
            $Control = new $params['menuDesign']($Menu);
        } catch (QUI\Exception $Exception) {
            QUI\System\Log::addError($Exception->getMessage());
            return '';
        }

        return $Control->create();
    }
}
