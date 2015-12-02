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
    public function __construct($attributes = array())
    {
        // defaults values
        $this->setAttributes(array(
            'startId' => 1, // id or site link
            'homeLink' => false,
            'levels' => false,
            'homeIcon' => 'fa-home',
            'listIcon' => 'fa-angle-right',
            'levelIcon' => 'fa-angle-double-down',
            'qui-class' => 'package/quiqqer/menu/bin/SidebarDropDownMenu'
        ));

        parent::__construct($attributes);

        $this->addCSSFile(
            dirname(__FILE__) . '/SidebarDropDownMenu.css'
        );

        $this->setAttribute('class', 'quiqqer-sidebar-dropdown-navigation grid-100');
    }

    /**
     * (non-PHPdoc)
     *
     * @see \QUI\Control::create()
     */
    public function getBody()
    {
        $Engine = QUI::getTemplateManager()->getEngine();
        $Project = $this->getProject();
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

        // active site
        $ActiveSite = QUI::getRewrite()->getSite();

        if ($ActiveSite && $ActiveSite->getProject() == $Project) {
            $activeId = $ActiveSite->getId();
        }

        // settings
        $levels = (int)$this->getAttribute('levels');

        if ($levels <= 0 || $this->getAttribute('levels') === false) {
            $levels = false;
        }

        $Engine->assign(array(
            'this' => $this,
            'Project' => $this->getProject(),
            'Site' => $Site,
            'homeLink' => $homeLink = $this->getAttribute('homeLink'),
            'activeId' => $activeId,
            'navTemplate' => dirname(__FILE__) . '/SidebarDropDownMenu.html',
            'levels' => $levels,
            'Rewrite' => QUI::getRewrite(),
            'homeIcon' => $homeIcon = $this->getAttribute('homeIcon'),
            'listIcon' => $listIcon = $this->getAttribute('listIcon'),
            'levelIcon' => $levelIcon = $this->getAttribute('levelIcon')
        ));

        $html = $Engine->fetch(dirname(__FILE__) . '/SidebarDropDownMenu.html');
        $html = '<nav>' . $html . '</nav>';

        return $html;
    }
}
