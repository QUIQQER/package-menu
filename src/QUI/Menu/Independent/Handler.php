<?php

namespace QUI\Menu\Independent;

use QUI;

/**
 * Menu handler
 * - get menus
 */
class Handler
{
    /**
     * @return string
     */
    public static function table(): string
    {
        return QUI::getDBTableName('menus');
    }

    /**
     * @param int $menuId
     * @return Menu
     *
     * @throws QUI\Exception
     */
    public static function getMenu(int $menuId): Menu
    {
        return new Menu($menuId);
    }

    /**
     * @param int $menuId
     * @return array
     *
     * @throws QUI\Database\Exception
     * @throws QUI\Exception
     */
    public static function getMenuData(int $menuId): array
    {
        $data = QUI::getDataBase()->fetch([
            'from' => self::table(),
            'where' => [
                'id' => $menuId
            ],
            'limit' => 1
        ]);

        if (isset($data[0])) {
            return $data[0];
        }

        throw new QUI\Exception(
            'Menu not found',
            404,
            [
                'menuId' => $menuId
            ]
        );
    }

    /**
     * @return Menu[]
     * @throws QUI\Database\Exception
     */
    public static function getList(): array
    {
        $data = QUI::getDataBase()->fetch([
            'from' => self::table()
        ]);

        $result = [];

        foreach ($data as $entry) {
            try {
                $result[] = new Menu($entry);
            } catch (QUI\Exception $Exception) {
                QUI\System\Log::addError($Exception->getMessage());
            }
        }

        return $result;
    }

    /**
     * @return string[]
     *
     * @todo Item Class Provider -> API
     */
    public static function getItemList(): array
    {
        return [
            QUI\Menu\Independent\Items\Anchor::class,
            QUI\Menu\Independent\Items\Custom::class,
            QUI\Menu\Independent\Items\Site::class,
            QUI\Menu\Independent\Items\Url::class,
        ];
    }
}
