<?php

/**
 * This file contains \QUI\Menu\SidebarDropDownMenu
 */

namespace QUI\Menu;

use QUI;
use QUI\Projects\Site\Utils;

/**
 * Class SidebarDropDownMenu
 * Creates on Sidebar Drop Down Menu
 *
 * @package QUI\Menu
 * @author www.pcsg.de (Michael Danielczok, Henning Leutz)
 */
class SidebarDropDownMenu extends QUI\Control
{
    /**
     * @param array $attributes
     */
    public function __construct($attributes = [])
    {
        // defaults values
        $this->setAttributes([
            'startId'             => 1, // id or site link
            'menuId'              => false,
            'parentLink'          => false,
            'levels'              => 0,
            'onlyFirstLevelIcons' => false,
            'listType'            => 'fontAwesome',
            'homeIcon'            => 'fa-home',
            'listIcon'            => 'fa-angle-right',
            'levelIcon'           => 'fa-angle-double-right',
            'qui-class'           => 'package/quiqqer/menu/bin/SidebarDropDownMenu',
            'display'             => 'simple',
            'showAllChildren'     => false
        ]);

        parent::__construct($attributes);

        $this->setAttribute('class', 'quiqqer-sidebar-dropdown-navigation');
        $this->setAttribute('cacheable', false);
    }

    /**
     * (non-PHPdoc)
     *
     * @see \QUI\Control::create()
     */
    public function getBody()
    {
        $Engine   = QUI::getTemplateManager()->getEngine();
        $Project  = $this->getProject();
        $activeId = false;

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

            return '';
        }


        if ($Site->getId() != 1) {
            $FirstPage = $Site->getParent();
        } else {
            $FirstPage = $this->getProject()->firstChild();
        }


        // active site
        $ActiveSite = QUI::getRewrite()->getSite();

        if ($ActiveSite && $ActiveSite->getProject() === $Project) {
            $activeId = $ActiveSite->getId();
        }

        // settings
        $levels = (int)$this->getAttribute('levels');

        if ($levels <= 0 || $this->getAttribute('levels') === false) {
            $levels = false;
        }

        if ($this->getAttribute('menuId')) {
            $IndependentMenu = Independent\Handler::getMenu($this->getAttribute('menuId'));

            $children = $IndependentMenu->getChildren();

            switch ($this->getAttribute('display')) {
                default:
                case 'simple':
                    $css      = dirname(__FILE__).'/SidebarDropDownMenu.Independent.Simple.css';
                    $template = dirname(__FILE__).'/SidebarDropDownMenu.Independent.Simple.html';
                    break;

                case 'advanced':
                    $css      = dirname(__FILE__).'/SidebarDropDownMenu.Independent.Advanced.css';
                    $template = dirname(__FILE__).'/SidebarDropDownMenu.Independent.Advanced.html';
                    break;
            }

            $Engine->assign([
                'this'                => $this,
                'children' => $children,
                'Project'             => $this->getProject(),
                'Site'                => $Site,
                'FirstPage'           => $FirstPage,
                'listType'            => $this->getAttribute('listType'),
                'parentLink'          => $this->getAttribute('parentLink'),
                'activeId'            => $activeId,
                'navTemplate'         => $template,
                'levels'              => $levels,
                'Rewrite'             => QUI::getRewrite(),
                'parentIcon'          => $this->getAttribute('parentIcon'),
                'listIcon'            => $this->getAttribute('listIcon'),
                'levelIcon'           => $this->getAttribute('levelIcon'),
                'onlyFirstLevelIcons' => $this->getAttribute('onlyFirstLevelIcons')
            ]);
        } else {
            switch ($this->getAttribute('display')) {
                default:
                case 'simple':
                    $css      = dirname(__FILE__).'/SidebarDropDownMenu.Simple.css';
                    $template = dirname(__FILE__).'/SidebarDropDownMenu.Simple.html';
                    break;

                case 'advanced':
                    $css      = dirname(__FILE__).'/SidebarDropDownMenu.Advanced.css';
                    $template = dirname(__FILE__).'/SidebarDropDownMenu.Advanced.html';
                    break;
            }

            $Engine->assign([
                'this'                => $this,
                'Project'             => $this->getProject(),
                'Site'                => $Site,
                'FirstPage'           => $FirstPage,
                'listType'            => $this->getAttribute('listType'),
                'parentLink'          => $this->getAttribute('parentLink'),
                'activeId'            => $activeId,
                'navTemplate'         => $template,
                'levels'              => $levels,
                'Rewrite'             => QUI::getRewrite(),
                'parentIcon'          => $this->getAttribute('parentIcon'),
                'listIcon'            => $this->getAttribute('listIcon'),
                'levelIcon'           => $this->getAttribute('levelIcon'),
                'onlyFirstLevelIcons' => $this->getAttribute('onlyFirstLevelIcons')
            ]);
        }


        $this->addCSSFile($css);

        $html = $Engine->fetch($template);
        $html = '<nav>'.$html.'</nav>';

        return $html;
    }

    public function getChildren(QUI\Projects\Site $Site)
    {
        if (!$this->getAttribute('showAllChildren')) {
            return $Site->getNavigation();
        }

        return $Site->getChildren();
    }
}
