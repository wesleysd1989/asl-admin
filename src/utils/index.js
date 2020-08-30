import { format, parse, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import XLSX from 'xlsx';

/**
 * `capitalize` aplica upercase na primeira letra da palavra enviada
 *
 * @param expression O texto que deseja alterar
 * @return Uma nova string com a primeira letra em upercase.
 */

export const capitalize = expression => {
  if (typeof expression !== 'string') return '';
  return expression.charAt(0).toUpperCase() + expression.slice(1);
};

/**
 * `parseDateISO` converte uma data no formato DD/MM/YYYY para o formato internacional (ISO).
 *
 * @param strDate A data no formato DD/MM/YYYY
 * @return Objeto Date se `strDate` atender o formato DD/MM/YYYY,
 * caso contrário `null`
 *
 */
export const parseDateISO = (strDate, formatMask = 'dd/MM/yyyy') =>
  parse(strDate, formatMask, 0, { locale: ptBR });

/**
 * `formatDate` converte uma data no formato internacional (ISO) para o formato DD/MM/YYYY.
 *
 * @param strDate A data no formato ISO - 2019-09-18T19:00:00
 * @return Objeto Date se `strDate` atender o formato yyyy-MM-ddTHH:mm:ss,
 * caso contrário `null`
 *
 */
export const formatDate = (strDate, formatMask = 'dd/MM/yyyy') =>
  format(strDate, formatMask, { locale: ptBR });

/**
 * `fullMonth` converte uma data no formato ISO retornando o mês por extenso.
 *
 * @param date A data no formato ISO - 2019-09-18T19:00:00
 * @return Objeto Date se `date` atender o formato yyyy-MM-ddTHH:mm:ss,
 * caso contrário `null`
 *
 */
export const fullMonth = date =>
  capitalize(format(parseISO(date), 'MMMM', { locale: ptBR }));

/**
 * `parseUTCDate` converte uma data no formato UTC (Universal Time Coordinated)
 * @param date A data a qual deseja converte, se nenhum valor for especificado
 * utiliza a data atual
 *
 * @return Uma nova data no formato UTC
 */
export const parseUTCDate = (date = new Date()) =>
  new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );

/**
 * `onlyLetter` remove todos os caracteres que não são letras.
 *z
 * @param str A string para a qual deseja remover os caracteres
 * @return Uma nova `string` com todos os caracteres diferente de letras removidos
 *
 */
export const onlyLetter = str => str.replace(/[^a-zA-Zà-úÀ-Ú ]/g, '');

/**
 * `singleSpace` Remove espaços extras da string especificada.
 *
 * @param text A string para a qual deseja remover os espaços extras
 * @return A string tratada sem espaços a mais
 *
 */
export const singleSpace = text => text.replace(/\s+/g, ' ');

/**
 * `toNumber` Converte a string especificada em número inteiro.
 *
 * @param strNumber A string para a qual deseja converte em números
 * @return O valor informado convertido para o objeto do tipo Int, em caso
 * de falha retornará `null`
 *
 */
export const toNumber = strNumber => {
  const parsed = parseInt(strNumber, 10);
  if (!Number.isNaN(parsed)) {
    return parsed;
  }
  return null;
};

/**
 * `emailIsValid` Verifica se o formato de um determinado email é vádlio.
 *
 * @param email O email ao qual deseja validar
 * @return `true` se o email informado atende os critédio de validação, em caso
 * de falha retornará `null`
 *
 */
export const emailIsValid = email => {
  const regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return regex.test(email.toString().trim());
};

/**
 * `isEmpty` Verifica se o texto ou objeto informado é está vazio.
 *
 * @param item O item ao qual deseja validar
 * @return `true` se a string possuir tamanho maior do que zero
 * ou o objeto tiver alguma propriedade. Caso contrário `false`
 *
 */
export const isEmpty = item => {
  if (typeof item === 'string') {
    return item.trim().length === 0;
  }

  if (item instanceof Object) {
    return Object.entries(item).length === 0;
  }

  return false;
};

/**
 * `cleanJson` Recebe um objeto (JSON) e elimina os dados que estejam somente "".
 *
 * @param json simples sem sub-objetos
 * @return clearedJson somente com chaves que possuam valores diferentes de string vazia ('')
 *
 */

export const cleanJson = json => {
  const clearedJson = {};
  Object.keys(json)
    .filter(item => json[item] !== '')
    .forEach(key => {
      clearedJson[key] = json[key];
    });
  return clearedJson;
};

/**
 * `parseSecondsAsTime` Recebe um valor em segundos para formatar como countdown.
 *
 * @param time O número de segundos
 * @return Uma nova `string` em formato countdown
 *
 */
export const parseSecondsAsTime = time =>
  format(new Date(time * 1000), 'mm:ss');

/**
 * `textNormalize` substitui caracteres acentuados e especiais por caracteres semelhantes
 *
 * exemplo:
 * ```javascript
 * textNormalize('Olá') // a saída será: Ola
 * textNormalize('calça') // a saída será: calca
 * textNormalize('Paraíba') // a saída será: Paraiba
 * ```
 *
 * @param text O texto que deseja normalizar
 * @return Uma nova string normalizada
 */
export const textNormalize = text =>
  text
    .replace(/[ÀÁÂÃÄÅ]/, 'A')
    .replace(/[àáâãäå]/, 'a')
    .replace(/[ÈÉÊË]/, 'E')
    .replace(/[èéêë]/, 'e')
    .replace(/[íìïî]/, 'i')
    .replace(/[ÍÌÏÎ]/, 'I')
    .replace(/[óòõôö]/, 'o')
    .replace(/[ÓÒÕÔÖ]/, 'O')
    .replace(/[úùüû]/, 'u')
    .replace(/[ÚÙÜÛ]/, 'U')
    .replace(/[Ç]/, 'C')
    .replace(/[ç]/, 'c');

/**
 * `replaceAll` substitui todas as ocorrências do texto informado
 *
 * @param expression O texto que deseja alterar
 * @param search Um String que deve ser substituído por replacement
 * @param replacement A String que substitui a substring recebida do parâmetro search
 * @return Uma nova string com todas as ocorrências substituído pelo substituidor.
 */
export const replaceAll = (expression, search, replacement) =>
  expression.split(search).join(replacement);

/**
 * `formatAsMoney` formata um valor com decimais de milhar
 *
 * @param amount O valor a ser formatado como moeda
 * @return Uma nova string com o formato numérico brasileiro.
 */
export const formatAsCurrency = amount =>
  amount
    .toFixed(2)
    .replace('.', ',')
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

/**
 * `formatName` define a primeira letra de cada palavra como maiúscula e as demais minusculas
 *
 * @param name O texto que deseja alterar
 * @return Uma nova string com todas as ocorrências substituídas.
 */
export const formatName = name => {
  const nameArray = [];
  name
    .toLowerCase()
    .split(' ')
    .forEach(element => {
      nameArray.push(capitalize(element));
    });
  return onlyLetter(singleSpace(replaceAll(nameArray.toString(), ',', ' ')));
};

/**
 * `validateName` define a primeira letra de cada palavra como maiúscula e as demais minusculas
 *
 * @param name O texto que deseja alterar
 * @return Uma nova string com todas as ocorrências substituídas.
 */
export const validateName = name => {
  // Não deverá permitir inserir menos de 2 palavras
  const words = name
    .toString()
    .trim()
    .split(/\s/);
  const lessThanTwoWord = words.length < 2;
  if (lessThanTwoWord) {
    return { isValid: false, errorMessage: 'Nome incompleto' };
  }

  // Não deverá permitir inserir menos de 2 letras em uma palavra
  // const lessThanTwoCharacters = !words.every(word => word.length >= 2);
  // if (!lessThanTwoWord && lessThanTwoCharacters) {
  //   return { isValid: false, errorMessage: 'Por favor, não utilizar abreviações' };
  // }

  return { isValid: true };
};

/**
 * `getFormValues` Converte o formulário para um objeto de contendo as chaves e
 * valores dos inputs
 *
 * @param form O formulário completo com seus inputs contendo no mínimo o
 * atributo value
 * @return Novo objeto com apenas chaves e valores `{ input1: value1, input2: value2 }`.
 */
export const getFormValues = form => {
  const formValues = {};

  Object.entries(form).forEach(input => {
    const [key, { value }] = input;

    formValues[key] = value;
  });

  return formValues;
};

/**
 * `formatAsThousands` formata um valor com decimais de milhar
 *
 * @param amount O valor a ser formatado como moeda
 */
export const formatAsThousands = amount =>
  amount
    .toFixed(2)
    .replace('.', ',')
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

/**
 * `yesOrNo` traduz booleana para SIM ou NAO
 *
 * @param data O valor deve ser uma booleana
 *
 * @return é uma das Strings SIM ou NAO, o primeiro para true e o segundo para false.
 */
export const yesOrNo = data => {
  if (data) {
    return 'SIM';
  }
  return 'NAO';
};

/* generate an array of column objects */
export const make_cols = refstr => {
  const o = [];
  const C = XLSX.utils.decode_range(refstr).e.c + 1;
  for (let i = 0; i < C; i += 1)
    o[i] = { name: XLSX.utils.encode_col(i), key: i };
  return o;
};
