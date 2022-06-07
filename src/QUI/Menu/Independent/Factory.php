<?php

namespace QUI\Menu\Independent;

use QUI;

/**
 *
 */
class Factory
{
    /**
     * @throws QUI\Database\Exception
     * @throws QUI\Exception
     */
    public static function createMenu(): Menu
    {
        QUI\Permissions\Permission::checkPermission('quiqqer.menu.create');

        QUI::getDataBase()->insert(Handler::table(), [
            'title'        => '',
            'workingTitle' => '',
            'data'         => ''
        ]);

        $lastId = QUI::getPDO()->lastInsertId();

        return Handler::getMenu($lastId);
    }

    /**
     * @param int $menuId
     *
     * @throws QUI\Database\Exception
     * @throws QUI\Permissions\Exception
     */
    public static function deleteMenu(int $menuId)
    {
        QUI\Permissions\Permission::checkPermission('quiqqer.menu.delete');

        QUI::getDataBase()->delete(Handler::table(), [
            'id' => $menuId
        ]);
    }
}
