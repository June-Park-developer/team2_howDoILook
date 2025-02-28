import * as s from "superstruct";

const pwPattern = s.pattern(s.string(), /(?=.*[a-zA-Z])(?=.*[0-9]).{8,16}/);

const isIntegerInRange = (value) =>
  Number.isInteger(value) && value >= 1 && value <= 10;
const IntegerInRange = s.define("IntegerInRange", isIntegerInRange);

export const CreateCuration = s.object({
  nickname: s.size(s.string(), 1, 20),
  content: s.size(s.string(), 1, 150),
  trendy: IntegerInRange,
  personality: IntegerInRange,
  practicality: IntegerInRange,
  costEffectiveness: IntegerInRange,
  password: pwPattern,
});

export const PatchCuration = s.partial(CreateCuration);

export const CreateComment = s.object({
  content: s.size(s.string(), 1, 150),
  password: pwPattern,
});

export const Password = s.object({
  password: pwPattern,
});
