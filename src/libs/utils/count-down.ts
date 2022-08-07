let countdownTtimer: any = null
//后期可替换为npm包：js-timers 中的倒计时，因为js-timers中倒计时可以补偿和修正误差。
export function startCountDownTime(
  time: number,
  intervalCb?: Function,
  endCb?: Function
) {
  if (time <= 0) throw new Error('请设置倒计时总秒数')
  let remainingTime = time
  countdownTtimer = setInterval(() => {
    intervalCb && intervalCb(remainingTime)
    if (remainingTime === 1) {
      remainingTime = time
      endCb && endCb()
      clearInterval(countdownTtimer)
    } else {
      --remainingTime
    }
  }, 1000)
  return countdownTtimer
}
