import { NewDiaryEntry, Visibility, Weather } from './types';

const emptyOrInvalid = (field: string, value: unknown): Error => {
  const message =
    value && typeof value === 'string'
      ? `'${value}' is not a valid ${field}`
      : `Received an empty value for '${field}'`;
  return new Error(message);
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseComment = (comment: unknown): string => {
  if (!comment || !isString(comment)) throw emptyOrInvalid('comment', comment);
  return comment;
};

const isDate = (date: string): boolean => {
  return !!Date.parse(date);
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date))
    throw emptyOrInvalid('date', date);
  return date;
};

const isWeather = (weather: string): weather is Weather => {
  return Object.values(Weather)
    .map((w) => w.toString())
    .includes(weather);
};

const parseWeather = (weather: unknown): Weather => {
  if (!weather || !isString(weather) || !isWeather(weather))
    throw emptyOrInvalid('weather', weather);
  return weather;
};

const isVisibility = (visibility: string): visibility is Visibility => {
  return Object.values(Visibility)
    .map((v) => v.toString())
    .includes(visibility);
};

const parseVisibility = (visibility: unknown): Visibility => {
  if (!visibility || !isString(visibility) || !isVisibility(visibility))
    throw emptyOrInvalid('visibility', visibility);
  return visibility;
};

export const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  if (!object || typeof object !== 'object')
    throw Error('Object body must be an object');

  const requiredFields = ['date', 'weather', 'visibility', 'comment'];
  if (
    !(
      'date' in object &&
      'weather' in object &&
      'visibility' in object &&
      'comment' in object
    )
  ) {
    const missingFields = requiredFields
      .filter((field) => !Object.keys(object).includes(field))
      .map((field) => `'${field}'`);
    const message =
      missingFields.length === 1
        ? `Request body is missing field ${missingFields[0]}`
        : `Request body is missing fields ${missingFields.join(', ')}`;
    throw new Error(message);
  }

  const { date, weather, visibility, comment } = object;
  const newDiaryEntry: NewDiaryEntry = {
    date: parseDate(date),
    weather: parseWeather(weather),
    visibility: parseVisibility(visibility),
    comment: parseComment(comment)
  };

  return newDiaryEntry;
};

export default { toNewDiaryEntry };
