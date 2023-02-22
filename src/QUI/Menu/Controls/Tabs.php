<?php

/**
 * This file contains QUI\Menu\Controls\Tabs
 */

namespace QUI\Menu\Controls;

use QUI;

/**
 * Class NavTabs
 *
 * @author  Michael Danielczok
 * @package QUI\Menu
 */
class Tabs extends QUI\Control
{
    /**
     * constructor
     *
     * @param array $attributes
     */
    public function __construct($attributes = [])
    {
        // default options
        $this->setAttributes([
            'class'               => 'quiqqer-tabs',
            'qui-class'           => 'package/quiqqer/menu/bin/Controls/NavTabs',
            'tabImgHeight'        => 24,
            'contentImgMaxWidth'  => 300,
            'contentImgMaxHeight' => 500,
            'contentTextWidth'    => 700,
            'activeEntry'         => 1, // number
            'imageMaxHeight'      => false,
            'entries'             => [],
            'template'            => 'simple',
        ]);

        parent::__construct($attributes);

        $this->addCSSFile(dirname(__FILE__).'/Tabs.css');
    }

    /**
     * (non-PHPdoc)
     *
     * @see \QUI\Control::create()
     */
    public function getBody()
    {
        $Engine         = QUI::getTemplateManager()->getEngine();
        $entries        = $this->getAttribute('entries');
        $enabledEntries = [];

        if (is_string($entries)) {
            $entries = json_decode($entries, true);
        }

        foreach ($entries as $entry) {
            if (isset($entry['isDisabled']) && $entry['isDisabled'] === 1) {
                continue;
            }

            array_push($enabledEntries, $entry);
        }

        $active = 1;

        if ($this->getAttribute('activeEntry') && $this->getAttribute('activeEntry') > 0) {
            $active = $this->getAttribute('activeEntry');
        }

        $Engine->assign([
            'this'                => $this,
            'entries'             => $enabledEntries,
            'active'              => $active,
            'tabImgHeight'        => $this->getAttribute('tabImgHeight'),
            'contentTextWidth'    => $this->getAttribute('contentTextWidth'),
            'contentImgMaxWidth'  => $this->getAttribute('contentImgMaxWidth'),
            'contentImgMaxHeight' => $this->getAttribute('contentImgMaxHeight')
        ]);

        return $Engine->fetch(dirname(__FILE__).'/Tabs.html');
    }
}
