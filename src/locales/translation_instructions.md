# Steps for Non-Coders:

 - **Step 1:** <a href="https://github.com/OmarB97/trynano/files/6190791/en.txt">Click here</a> to download the template txt file. Change the filename to the appropriate language code (e.g. en.txt, pt-BR.txt).
 - **Step 2:** Open up a text editor such as Notepad, or whatever your preferred editor is that allows you to edit the file.
 - **Step 3:** Translate each sentence in the file. Only modify the sentences, do not touch any words to the left of the ':' or anything contained inside curly braces (e.g. '{faucetBalance}' ) or the translation might not work properly!
 - **Step 4:** When you are done, save the file.
 - **Step 5a:** If you already have a GitHub account, <a href="https://github.com/OmarB97/trynano/issues/new?assignees=OmarB97&labels=translation&template=translation-request.md&title=%5BTRANSLATION+REQUEST%5D+-+%3CPUT+LANGUAGE+NAME+AND+CODE+HERE%3En">Click here</a> to create a new translation request, and drag and drop the txt file you saved in Step 4 into the issue body to attach the file. Update the issue name with the appropriate details (i.e. Language name and code), and in the issue body, please also put the translated language name that you wish to show in the dropdown selector on the page itself (please see the existing language names on trynano.io to get an idea of what to do here), and click submit. That's it! 
 - **Step 5b:** If you don't have a GitHub account, you can upload the file to your preferred storage hosting site (e.g. Google Drive, Dropbox, Amazon Cloud, etc.) and send me a link to download the file in a direct message on my reddit account: u/Yolomar. Also, please provide me the translated language name that you wish to show in the dropdown selector on the page itself (please see existing language names on trynano.io to get an idea of what to do here).

# Steps for Coders:

To add a new language, you will need to create a new json file inside the ```src/locales``` folder. The filename should be: ```<locale_abbreviation>.json```.

You will need to follow the same structure inside en.json, which holds all the English translations for the site. For details on how the syntax works, please refer to the [Vue-I18n documentation](https://vue-i18n.intlify.dev/guide/).

Once you've created the json file, you'll need to add it inside ```src/translations.js```. See how "en.json" is imported + added as an example.
 -  NOTE: If your locale has a hyphen (e.g. 'pt-BR'), then just follow the same format as shown in the file / below:
   -  ```import * as ptBr from './locales/pt-br.json';```
   -  ```'pt-BR': ptBr.default, /* Brazilian Portuguese */```

Lastly, you'll need to add the language name mapping inside ```src/NanoApp.vue```:

![image](https://user-images.githubusercontent.com/21279036/111931342-413a9900-8a78-11eb-83a5-6787db59855a.png)

When adding your language name mapping here, It is encouraged to use the language name in its own language so users will be able to quickly identify it in the dropdown.

When you're done, submit a PR!

For any additional questions, please reach out to me and I can help out. Thanks!
