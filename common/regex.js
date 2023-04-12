const REG_EXP = {
  korean: /.*[ㄱ-ㅎㅏ-ㅣ가-힣]+.*/,
  hello: /\b[H,h]ello\b/,
  hi: /\b[H,h]i\b/,
  mension: /<?@\S+/g,
  hashTag: /<?#\S+/g,
  hyperLink: /(http|https):\S+/g,
  emoji: /:\S+:/g,
};
module.exports = {
  REG_EXP,
};
