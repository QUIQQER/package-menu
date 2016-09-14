<?php

/**
 * This file contains QUI\Menu\MegaMenu
 */
namespace QUI\Menu;

use QUI;

/**
 * Class MegaMenu
 *
 * @package QUI\Menu
 */
class MegaMenu extends QUI\Control
{
    /**
     * @param array $attributes
     */
    public function __construct($attributes = array())
    {
        $this->setAttributes(array(
            'showStart' => false,
            'Start'     => false,
            'data-qui'  => 'package/quiqqer/menu/bin/MegaMenu'
        ));

        parent::__construct($attributes);

        $this->addCSSClass('quiqqer-menu-megaMenu');
        $this->addCSSFile(dirname(__FILE__) . '/MegaMenu.css');
    }

    /**
     * @return string
     * @throws QUI\Exception
     */
    public function getBody()
    {
        $Engine = QUI::getTemplateManager()->getEngine();

        $Engine->assign(array(
            'this'      => $this,
            'Site'      => $this->getSite(),
            'Project'   => $this->getProject(),
            'Start'     => $this->getStart(),
            'children'  => $this->getStart()->getNavigation(),
            'Rewrite'   => QUI::getRewrite(),
            'jsControl' => 'package/quiqqer/menu/bin/MegaMenu'
        ));

        return $Engine->fetch(dirname(__FILE__) . '/MegaMenu.html');
    }

    /**
     * @return QUI\Projects\Site
     */
    public function getStart()
    {
        if ($this->getAttribute('Start')) {
            return $this->getAttribute('Start');
        }

        return $this->getProject()->firstChild();
    }

    /**
     * Return the current site
     *
     * @return mixed|QUI\Projects\Site
     */
    protected function getSite()
    {
        if ($this->getAttribute('Site')) {
            return $this->getAttribute('Site');
        }

        return QUI::getRewrite()->getSite();
    }
}
