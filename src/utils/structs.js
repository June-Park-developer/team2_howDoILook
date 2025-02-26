import * as s from "superstruct";

const pwPattern = s.pattern(s.string(), /([A-Za-z0-9]{8,16})\w+/);

export const CreateComment = s.object({
  content: s.size(s.string(), 1, 150),
  password: pwPattern,
});

export const Password = s.object({
  password: pwPattern,
});
