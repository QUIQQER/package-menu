<?php

namespace QUI\Menu\Independent\Items;

use QUI;

use function is_array;

/**
 * menu item to an external url
 */
class Url extends AbstractMenuItem
{
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

    //region type stuff

    /**
     * @return string
     */
    public static function itemTitle(): string
    {
        return QUI::getLocale()->get('quiqqer/menu', 'item.url.title');
    }

    /**
     * @return string
     */
    public static function itemIcon(): string
    {
        return 'fa fa-globe';
    }

    /**
     * @return string
     */
    public static function itemJsControl(): string
    {
        return 'package/quiqqer/menu/bin/Controls/Independent/Items/Url';
    }

    //endregion type stuff
}
