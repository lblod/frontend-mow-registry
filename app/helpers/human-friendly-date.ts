import formatRelative from 'date-fns/formatRelative';
import format from 'date-fns/format';
import * as locales from 'date-fns/locale';
import { helper } from '@ember/component/helper';

function getDateFnsLocale(locale: string) {
  return (
    locales[locale as keyof typeof locales] ??
    locales[locale.substring(0, 2) as keyof typeof locales]
  );
}

function humanFriendlyDate(
  [date]: Date[],
  { locale = 'nl-BE', alwaysShowTime = true } = {},
) {
  if (!(date instanceof Date)) return '';
  try {
    let relativeDate = formatRelative(date, new Date(), {
      locale: getDateFnsLocale(locale),
    });
    if (alwaysShowTime && !relativeDate.includes(':')) {
      relativeDate +=
        ' ' +
        format(date, 'p', {
          locale: getDateFnsLocale(locale),
        });
    }
    return relativeDate;
  } catch (e) {
    console.error(e);
    return '';
  }
}

export default helper(humanFriendlyDate);
