import * as s from "superstruct";
import isEmail from "is-email";
import isUuid from "is-uuid";

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
