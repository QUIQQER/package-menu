
Header
========

Das Menü Plugin stellt verschiedene Menü-Controls zur Verfügung.  


Paketname:

    quiqqer/menu


Features
--------

- Mega Menu (mobile-fähig & Wechsel auf SlideOut)
    - besitzt verschiedene Anzeigearten
        - Mega Menu - mit Unterseiten
        - Mega Menu - Unterseiten mit Icons
        - Mega Menu - Unterseiten mit Icons, Bilder und Beschreibung
        - Mega Menu - Grosse Seitenbilder
        - Mega Menu - Grosse Seitenbilder
- Elastic Menu (mobile-fähig)
- SlideOut Menu (mobile-fähig)

Installation
------------

Der Paketname ist: quiqqer/menu


Mitwirken
----------

- Issue Tracker: https://dev.quiqqer.com/quiqqer/package-menu/issues
- Source Code: https://dev.quiqqer.com/quiqqer/package-menu


Support
-------

Falls Sie Fehler gefunden, Wünsche oder Verbesserungsvorschläge haben, 
können Sie uns gern per Mail an support@pcsg.de darüber informieren.  
Wir werden versuchen auf Ihre Wünsche einzugehen bzw. diese an die zuständigen Entwickler 
des Projektes weiterleiten.


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