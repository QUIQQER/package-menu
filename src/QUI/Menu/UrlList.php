<?php

/**
 * This file contains \QUI\Menu\UrlList
 */

namespace QUI\Menu;

use QUI;
use QUI\Projects\Site\Utils;

/**
 * Class UrlList
 *
 * Simple url list.
 *
 * It creates a list of sites.
 * This control is supposed to work with QUI Independent Menu, but you can use it with QUI Site.
 * You have to pass a menu ID or a parent page.
 *
 * Only one level of sub sites will be displayed started from given page (or menu id).
 * This control DO NOT support nested navigation structure.
 *
 * @package QUI\Menu
 * @author www.pcsg.de (Michael Danielczok)
 */
class UrlList extends QUI\Control
{
    /**
     * @param array $attributes
     */
    public function __construct($attributes = [])
    {
        // defaults values
        $this->setAttributes([
            'class'          => 'quiqqer-urlList',
            'headerText'     => '', // title above the url list
            'startId'        => false, // id or site link
            'menuId'         => false, // id of an (independent) menu
            'display'        => 'default',
            'icon'           => '', // only fontawesome icons are supported
            'resetLinkColor' => false // if true, the link inherit color from parent
        ]);

        parent::__construct($attributes);

        $this->setAttribute('cacheable', false);
    }

    /**
     * (non-PHPdoc)
     *
     * @see \QUI\Control::create()
     */
    public function getBody()
    {
        $Engine = QUI::getTemplateManager()->getEngine();

        if (!$this->getAttribute('menuId') && !$this->getAttribute('startId')) {
            return '';
        }

        if ($this->getAttribute('menuId')) {
            // independent menu
            $children = $this->getChildrenForIndependentMenu();
            $template = dirname(__FILE__).'/UrlList.Independent.Default.html';
        } elseif ($this->getAttribute('startId')) {
            // qui site
            $children = $this->getChildrenForQUISite();
            $template = dirname(__FILE__).'/UrlList.Default.html';
        } else {
            $children = [];
        }

        $icon = '';

        if ($this->getAttribute('icon') && strpos($this->getAttribute('icon'), 'fa ') === 0) {
            $icon = $this->getAttribute('icon');
        }

        switch ($this->getAttribute('display')) {
            default:
            case 'default':
                $this->addCSSClass('quiqqer-urlList__default');
                break;
        }

        $restLinkColorCss = '';
        if ($this->getAttribute('resetLinkColor')) {
            $restLinkColorCss = 'quiqqer-urlList-entry-link__resetLinkColor';

        }

        $Engine->assign([
            'this'             => $this,
            'headerText'       => $this->getAttribute('headerText'),
            'children'         => $children,
            'icon'             => $icon,
            'restLinkColorCss' => $restLinkColorCss
        ]);

        $this->addCSSFile(dirname(__FILE__).'/UrlList.Default.css');

        return $Engine->fetch($template);
    }

    /**
     * Get sites for independent menu
     *
     * @return array
     * @throws QUI\Exception
     */
    public function getChildrenForIndependentMenu()
    {
        $IndependentMenu = Independent\Handler::getMenu($this->getAttribute('menuId'));

        return $IndependentMenu->getChildren();
    }

    /**
     * Get sites for QUI site
     *
     * @return array
     * @throws QUI\Exception
     */
    public function getChildrenForQUISite()
    {
        $Project = $this->getProject();

        // start
        try {
            $startId = $this->getAttribute('startId');

            if (Utils::isSiteLink($startId)) {
                $Site = Utils::getSiteByLink($startId);
            } else {
                $Site = $Project->get((int)$startId);
            }
        } catch (QUI\Exception $Exception) {
            QUI\System\Log::addWarning($Exception->getMessage());

            return [];
        }

        return $this->getChildren($Site);
    }

    /**
     * @param QUI\Projects\Site $Site
     * @return array|int
     * @throws QUI\Exception
     */
    public function getChildren(QUI\Projects\Site $Site)
    {
        if (!$this->getAttribute('showAllChildren')) {
            return $Site->getNavigation();
        }

        return $Site->getChildren();
    }
}
