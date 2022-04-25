<?php

namespace QUI\Menu\Independent\Items;

use QUI;
use QUI\Locale;

use function is_array;

/**
 * menu item which gets its data from a site
 */
class Site extends AbstractMenuItem
{
    //region type stuff

    /**
     * @return string
     */
    public static function itemTitle(): string
    {
        return QUI::getLocale()->get('quiqqer/menu', 'item.site.title');
    }

    /**
     * @return string
     */
    public static function itemJsControl(): string
    {
        return 'package/quiqqer/menu/bin/Controls/Independent/Items/Site';
    }

    //endregion

    //region frontend item methods

    /**
     * @return QUI\Projects\Site|null
     */
    public function getSite(): ?QUI\Projects\Site
    {
        $data = $this->getCustomData();

        if (!is_array($data) || !isset($data['site'])) {
            return null;
        }

        try {
            $siteUrl = $data['site'];
            $Site    = QUI\Projects\Site\Utils::getSiteByLink($siteUrl);
        } catch (QUI\Exception $Exception) {
            return null;
        }

        if ($Site->getAttribute('active')) {
            return $Site;
        }

        return null;
    }

    /**
     * @param Locale|null $Locale
     * @return string
     */
    public function getName(Locale $Locale = null): string
    {
        $Site = $this->getSite();

        if ($Site) {
            return $Site->getAttribute('name');
        }

        return '';
    }

    /**
     * @param QUI\Locale|null $Locale
     * @return string
     */
    public function getTitle(QUI\Locale $Locale = null): string
    {
        $Site = $this->getSite();

        if ($Site) {
            return $Site->getAttribute('title');
        }

        return '';
    }

    /**
     * @return string
     */
    public function getUrl(): string
    {
        $Site = $this->getSite();

        if ($Site) {
            try {
                return $Site->getUrlRewritten();
            } catch (QUI\Exception $Exception) {
                return '';
            }
        }

        return '';
    }

    //endregion
}
