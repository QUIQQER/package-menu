
Header
========

Das Menü Plugin stellt verschiedenen Menü Controls zur Verfügung.  


Packetname:

    quiqqer/menu


Features
--------

- Mega Menu (mobile fähig - wechsel auf SlideOut)
    - besitzt verschiedenen Anzeigearten
        - MegaMenu - mit Unterseiten
        - MegaMenu - Unterseiten mit Icons
        - MegaMenu - Unterseiten mit Icons, Bilder und Beschreibung
        - MegaMenu - Grosse Seitenbilder
        - MegaMenu - Big page images
- Elastic Menu (mobile fähig)
- SlideOut Menu (mobile fähig)

Installation
------------

Der Paketname ist: quiqqer/menu


Mitwirken
----------

- Issue Tracker: https://dev.quiqqer.com/quiqqer/package-menu/issues
- Source Code: https://dev.quiqqer.com/quiqqer/package-menu


Support
-------

Falls Sie ein Fehler gefunden haben oder Verbesserungen wünschen,
Dann können Sie gerne an support@pcsg.de eine E-Mail schreiben.


License
-------

MIT


Entwickler
--------

**MegaMenu Beispiel**


```php
<?php

$Menu = new \QUI\Menu\MegaMenu(array(
    'showStart' => true,
    'Project'   => $Site->getProject()
));

// logo hinzufügen
$Menu->appendHTML(
    '<a href="{url id=1}" class="page-header-menu-logo" title="Zur Startseite">
        <img src="' . $Engine->getTemplateVariable('URL_TPL_DIR') . 'bin/images/logo.png"/>
    </a>'
);

```

```
    <div class="page-header-menu">
        <div class="grid-container">
            {$Menu->create()}
        </div>
    </div>
```

**Control Nutzung in Smarty**

```
{control control="\QUI\Menu\Elastic"}
{control control="\QUI\Menu\SlideOut"}
```

**Beispiel mit Einstellungen**

```
{control
    control="\QUI\Menu\DropDownMenu"
    Site=$Start
    icons=1
    showHomeIcon=1
}
```

```
{control control="\QUI\Menu\SlideOut"
    data-menu-right=10
    data-menu-top=15
    data-show-button-on-desktop=0
    data-qui-options-menu-width=400
    data-qui-options-menu-button=0
    data-qui-options-touch=0
    data-qui-options-buttonids=mobileMenu
}
```