# jQuery Cute Element
Ce plugin jQuery vous permettra de donner du style à vos élements select, radio et checkbox.  
Démo [ici](http://symcms.comstep.fr/backend/library/jQueryCuteElement/index.html)  

## Utilisation

### CSS
Importer le fichier dans votre page HTML
```html
<link href='jquery.cute-element.css' rel='stylesheet' type='text/css'>
```  

### JS
Importer le fichier dans votre page HTML après le script jQuery
```html
<script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
<script type="text/javascript" src="jquery.cute-element.min.js"></script>
```  

## Exemples
```html
<script type="text/javascript">
    $('input[type="radio"], input[type="checkbox"]').cuteElement({
        'theme': 'check-heavy'
    });

    $('select').cuteElement({
        'selectWidth': '100px'
    });
</script>
``` 

## Paramètres du plugin jQuery

#### labelPosition
Position du label rapport à l'élément, avant ou après  
Défaut: `next`

#### theme
Thèmes pour les éléments radio et checkbox, thèmes disponibles : checkbox, radio, check-heavy, bullet-outline, smiley-happy-face, vous pouvez créer de nouveaux thème grâce à la mixin Sass décrite ci-après ou en personnalisant le css  
Défaut: `checkbox`

#### selectWidth
Largeur de l'élément select  
Défaut: `auto`


## Utilisation avancée avec Sass
Plutôt que d'importer le fichier CSS vous pouvez inclure le fichier `jquery.cute-element.scss` dans votre projet, ainsi vous aurez accès à une mixin permettant de créer des thèmes pour vos élements radio et checkbox.

```scss
.my-custom-theme {
    @include cute-element-input (
        $border-radius: 20px,
        $character: "\25E6",
        $character-size: 50px,
        $character-vertical-align: 0.17,
        $character-horizontal-align: -4px,
        $checked-color: #89B11C
    );
}
``` 
### Paramètres de la mixin

#### $dimension
Largeur et hauteur de l'élement en pixels  
Défaut: `20px`

#### $color
Couleur de fond de de l'élément  
Défaut: `#eee`

#### $border-radius
Taille des bordures arrondies de l'élément  
Défaut: `0`

#### $checked-dimension
Largeur et hauteur du check  
Défaut: `10px`

#### $checked-color
Couleur du check  
Défaut: `#1290cc`

#### $checked-border-radius
Taille des bordures arrondies du check  
Défaut: `0`

#### $shadow
Ombre de l'élément  
Défaut: `0px 0px -3px -1px rgba(#000, 0.25)`

#### $shadow-hover
Ombre au survol  
Défaut: `0px 0px -3px -1px rgba(#1290cc, 1)`

#### $border
Bordure de l'élément  
Défaut: `1px solid #ddd`

#### $character
Si vous spécifiez ce paramètre vous utiliserez à la place du simple carré/rond un caractère HTML de votre choix  
Défaut: `none`

#### $character-size
Taille du caractère  
Défaut: `0`

#### $character-vertical-align
Ajustement vertical de la position du caractère en pixels ou en valeur décimal (line-height)  
Défaut: `0`

#### $character-horizontal-align
Ajustement horizontal de la position du caractère en pixels (text-indent)  
Défaut: `0`
