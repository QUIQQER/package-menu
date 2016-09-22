<?php

/**
 * This file contains QUI\Menu\Mega\Image
 */
namespace QUI\Menu\Mega;

use QUI;

/**
 * Class MegaMenu
 *
 * @package QUI\Menu
 */
class Image extends AbstractChild
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

        $this->addCSSClass('quiqqer-menu-megaMenu-children-image');
        $this->addCSSFile(dirname(__FILE__) . '/Image.css');
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

        return $Engine->fetch(dirname(__FILE__) . '/Image.html');
    }
}
