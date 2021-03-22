import en from './locales/en.json';
import * as ptBr from './locales/pt-br.json';

/* To add a new translation: 
    1. create a new json file under ./locals/<language>.json
    2. Follow the same structure seen in the other translation files
    3. import it inside this file
    4. Add it to the list below
*/
const translations = {
    en, /* English */
    ptBr: ptBr.default, /* Brazilian Portuguese */
}

export default translations;