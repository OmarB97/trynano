To add a new language, you will need to create a new json file inside the ```src/locales``` folder. The filename should be: ```<locale_abbreviation>.json```.

You will need to follow the same structure inside en.json, which holds all the English translations for the site. For details on how the syntax works, please refer to the [Vue-I18n documentation](https://vue-i18n.intlify.dev/guide/).

Once you've created the json file, you'll need to add it inside translations.js. See how "en.json" is imported + added as an example.
 -  NOTE: If your locale has a hyphen (e.g. 'pt-BR'), then just follow the same format as shown in the file / below:
   -  ```import * as ptBr from './locales/pt-br.json';```
   -  ```'pt-BR': ptBr.default, /* Brazilian Portuguese */```

Lastly, you'll need to add the language name mapping inside ```NanoApp.vue```:

![image](https://user-images.githubusercontent.com/21279036/111931342-413a9900-8a78-11eb-83a5-6787db59855a.png)

When adding your language name mapping here, It is encouraged to use the language name in its own language so users will be able to quickly identify it in the dropdown.

For any additional questions, please reach out to me and I can help out. Thanks!
