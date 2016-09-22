<?php

/**
 * This file contains QUI\Menu\Mega\Icons
 */
namespace QUI\Menu\Mega;

use QUI;

/**
 * Class Icons
 *
 * @package QUI\Menu
 */
class Icons extends AbstractChild
{
    /**
     * @var null
     */
    protected $children = null;

    /**
     * Standard constructor.
     *
     * @param array $params
     */
    public function __construct(array $params = array())
    {
        parent::__construct($params);

        $this->addCSSClass('quiqqer-menu-megaMenu-children-icons');
        $this->addCSSFile(dirname(__FILE__) . '/Icons.css');
    }

    /**
     * Return the html body
     *
     * @return string
     * @throws QUI\Exception
     */
    public function getBody()
    {
        $Engine = QUI::getTemplateManager()->getEngine();

        $Engine->assign(array(
            'this'     => $this,
            'children' => $this->getChildren(),
            'Site'     => $this->getSite()
        ));

        return $Engine->fetch(dirname(__FILE__) . '/Icons.html');
    }
}
