import * as s from "superstruct";

const pwPattern = s.pattern(s.string(), /(?=.*[a-zA-Z])(?=.*[0-9]).{8,16}/);

const isIntegerBetween1And10 = (value) =>
  Number.isInteger(value) && value >= 1 && value <= 10;
const IntegerBetween1And10 = s.define(
  "IntegerBetween1And10",
  isIntegerBetween1And10
);

export const CreateCuration = s.object({
  nickname: s.size(s.string(), 1, 20),
  content: s.size(s.string(), 1, 150),
  trendy: IntegerBetween1And10,
  personality: IntegerBetween1And10,
  practicality: IntegerBetween1And10,
  costEffectiveness: IntegerBetween1And10,
  password: pwPattern,
});

export const PatchCuration = s.partial(CreateCuration);

export const CreateComment = s.object({
  content: s.size(s.string(), 1, 150),
  password: pwPattern,
});

const PositiveInteger = s.refine(s.string(), "PositiveInteger", (value) => {
  const num = Number(value);
  return Number.isInteger(num) && num >= 1;
});

export const ValidQuery = s.object({
  page: PositiveInteger,
  pageSize: PositiveInteger,
});

export const Password = s.object({
  password: pwPattern,
});
