<?php

namespace QUI\Menu\Independent\Items;

use QUI;

use function is_array;

/**
 * Custom item
 * - flexible menu item
 */
class Custom extends AbstractMenuItem
{
    //region frontend item methods

    /**
     * @return string
     */
    public function getUrl(): string
    {
        $data = $this->getCustomData();

        if (is_array($data) && isset($data['url'])) {
            return $data['url'];
        }

        return '';
    }

    //endregion

    //region type stuff

    /**
     * return the item type title
     *
     * @return string
     */
    public static function itemTitle(): string
    {
        return QUI::getLocale()->get('quiqqer/menu', 'item.custom.title');
    }

    /**
     * Short description of the menu types
     *
     * @return string
     */
    public static function itemShort(): string
    {
        return QUI::getLocale()->get('quiqqer/menu', 'item.custom.short');
    }

    /**
     * return the item type icon
     *
     * @return string
     */
    public static function itemIcon(): string
    {
        return 'fa fa-keyboard-o';
    }

    /**
     * return the type js admin control
     *
     * @return string
     */
    public static function itemJsControl(): string
    {
        return 'package/quiqqer/menu/bin/Controls/Independent/Items/Custom';
    }

    //endregion
}
