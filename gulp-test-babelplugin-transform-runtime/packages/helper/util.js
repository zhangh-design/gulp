/**
 * @desc 工具类
 */
// 开发环境可以输出日志信息
export const devConsole = function (message) {
  if (process.env.NODE_ENV === 'development') {
    console.info(message);
  }
};
