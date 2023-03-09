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

        $current = QUI::getLocale()->getCurrent();

        // if current language is another language as the site
        if ($current !== $Site->getAttribute('lang')) {
            try {
                $Project     = $Site->getProject();
                $langId      = $Site->getId($current);
                $LangProject = QUI::getProject($Project->getName(), $current);

                return $LangProject->get($langId);
            } catch (QUI\Exception $exception) {
                return null;
            }
        }

        if ($Site->getAttribute('active')) {
            return $Site;
        }

        return null;
    }

    /**
     * @return string
     */
    public function getIcon(): string
    {
        $Site = $this->getSite();

        if ($Site) {
            return $Site->getAttribute('image_site');
        }

        return '';
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

        try {
            $data = $this->getCustomData();

            if ($data || isset($data['site'])) {
                return '';
            }

            $siteUrl = $data['site'];
            $Site    = QUI\Projects\Site\Utils::getSiteByLink($siteUrl);

            return $Site->getAttribute('title');
        } catch (QUI\Exception $Exception) {
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
