import en from './locales/en.json';
import * as ptBR from './locales/pt-BR.json';
import * as frFR from './locales/fr-FR.json';
import * as jaJP from "./locales/ja-JP.json";
import * as deDE from "./locales/de-DE.json";
import * as plPL from './locales/pl-PL.json';

/* To add a new translation: 
    1. create a new json file under ./locals/<language>.json
    2. Follow the same structure seen in the other translation files
    3. import it inside this file
    4. Add it to the list below
*/
const translations = {
    en, /* English */
    'pt-BR': ptBR.default, /* Brazilian Portuguese */
    'fr-FR': frFR.default, /* French */
    'ja-JP': jaJP.default, /* Japanese */
    'de-DE': deDE.default, /* German */
    'pl-PL': plPL.default, /* Polish */
}

export default translations;