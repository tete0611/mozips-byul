const { format } = require('date-fns');
const { ko } = require('date-fns/locale/ko');

module.exports = {
  /**
   * 시간 포맷 함수
   * @param { Date } date iso 날짜
   * @param { string } dateFormat 포맷형식(선택)
   */
  formatToUtc: (date, dateFormat) => {
    return date
      ? format(new Date(date), dateFormat ?? 'yyyy-MM-dd HH:mm', {
          locale: ko,
        })
      : '-';
  },

  /**
   * 한국시간 -> 영국시간(-9시간) 변환함수
   * @param { Date } data 날짜(date time)
   *
   */
  calcGMTToUTC: date => {
    if (typeof date === 'object' && date instanceof Date) {
      return date.setHours(date.getHours() - 9);
    } else if (typeof date === 'number') {
      return date >= 9 ? date - 9 : date + 15;
    }
  },

  /**
   * Date -> 한국시간 포맷 함수
   * @param {Date} date 날짜 : Date 객체
   * @param {boolean} yyyyMMdd yyyyMMdd 출력여부
   * @returns {string} 변환된 날짜
   */
  formatToGmt: (date, yyyyMMdd) => {
    const tmp = date
      .toLocaleString('en-GB', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
      .replace(' ', '')
      .split(/,|\/|:/);
    return yyyyMMdd
      ? `${tmp[2]}${tmp[1]}${tmp[0]}`
      : `${tmp[2]}-${tmp[1]}-${tmp[0]} ${tmp[3]}:${tmp[4]}`;
  },

  /**
   * 랜덤매칭 2차원 멤버배열 제작함수
   * @param {import('discord.js').GuildMember[]} arr 랜덤매칭될 1차원 멤버배열
   * @returns {import('discord.js').GuildMember[][]} 2차원 멤버 배열
   */
  getTwoDimensions: arr => {
    const result = [];
    const loop = arr.length;
    for (let i = 2; i <= loop; i += 2) {
      result.push([arr.pop(i - 1), arr.pop(i)]);
      if (arr.length === 1) result.at(-1).push(arr.pop(i + 1));
    }
    return result;
  },

  /**
   * 멤버가 해당 역할이 있는지 판별해주는 함수
   * @param {import('discord.js').GuildMember} member 멤버변수
   * @param {string} roleName 역할명
   * @returns {boolean}
   */
  checkRole: (member, roleName) => member.roles.cache.some(v => v.name === roleName),

  /**
   * 배열에서 랜덤한 값 하나를 리턴하는 함수
   * @param {T[]} array 배열
   * @returns {T}
   */
  getRandomElement: array => array[~~(Math.random() * array.length)],

  /**
   * 요일별 image url 반환 함수
   * @param {Date} date 오늘날짜
   * @typedef {Object} Topic
   * @property {string} ko 한글토픽카드
   * @property {string} en 영어토픽카드
   * @returns {Topic}
   */
  getImageUrl: date => {
    switch (date.getDay()) {
      case 1:
        return {
          ko: 'https://i.esdrop.com/d/f/jXycTwE2IA/wgnSDsV87P.png',
          en: 'https://i.esdrop.com/d/f/jXycTwE2IA/JbQxHVQjDf.png',
        };
      case 2:
        return {
          ko: 'https://i.esdrop.com/d/f/jXycTwE2IA/3FraytNwMn.png',
          en: 'https://i.esdrop.com/d/f/jXycTwE2IA/gQNsPGTYUX.png',
        };
      case 3:
        return {
          ko: 'https://i.esdrop.com/d/f/jXycTwE2IA/f9VJ9AVsui.png',
          en: 'https://i.esdrop.com/d/f/jXycTwE2IA/3L4ga3QG8K.png',
        };
      case 4:
        return {
          ko: 'https://i.esdrop.com/d/f/jXycTwE2IA/R6k3ke57Hv.png',
          en: 'https://i.esdrop.com/d/f/jXycTwE2IA/AkdPJgLNE6.png',
        };
      case 5:
        return {
          ko: 'https://i.esdrop.com/d/f/jXycTwE2IA/lhsAQGpxWW.png',
          en: 'https://i.esdrop.com/d/f/jXycTwE2IA/p0O8YMvijL.png',
        };
      default:
        return {
          ko: 'https://i.esdrop.com/d/f/jXycTwE2IA/wgnSDsV87P.png',
          en: 'https://i.esdrop.com/d/f/jXycTwE2IA/JbQxHVQjDf.png',
        };
    }
  },
};
