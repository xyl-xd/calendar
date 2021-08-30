function resolveTime(time) {
  const current = time ? new Date(time) : new Date()
  return {
    year: current.getFullYear(),
    month: current.getMonth() + 1,
    day: current.getDate(),
    hour: current.getHours(),
    minute: current.getMinutes(),
    sec: current.getSeconds(),
    dayOfWeek: current.getDay() === 0 ? 7 : current.getDay()
  }
}

function getFirstDayOfNextMonth(time) {
  const { year, month } = resolveTime(time)
  return month === 12 ? `${year + 1}-1-1` : `${year}-${month + 1}-1`
}

function getFirstDayOfPrevMonth(time) {
  const { year, month } = resolveTime(time)
  return month === 1 ? `${year - 1}-1-1` : `${year}-${month - 1}-1`
}

function getDays(time) {
  const { year, month } = resolveTime(time)
  const monthLastTime = new Date(getFirstDayOfNextMonth(time)).getTime() - 1
  let { day } = resolveTime(monthLastTime)

  const result = []
  for (; day > 0; day--) {
    result.splice(0, 0, `${year}-${month}-${day}`)
  }
  return result
}

function gen(today, lastDayOfWeek) {
  const days = getDays(today)
  
  const spLengthPrev = resolveTime(days[0]).dayOfWeek - (8 - lastDayOfWeek)
  if (spLengthPrev > 0) {
    const prevDays = getDays(getFirstDayOfPrevMonth(today))
    const sp = prevDays.reverse().slice(0, spLengthPrev).reverse()
    days.splice(0, 0, ...sp)
  }
  
  const spLengthNext = 7 - days.length % 7
  if (spLengthNext > 0) {
    const nextDays = getDays(getFirstDayOfNextMonth(today))
    const sp = nextDays.slice(0, spLengthNext)
    days.push(...sp)
  }

  return days
}

function h(tagName, classList) {
  const dom = document.createElement(tagName)
  if (classList) {
    dom.classList.add(...classList)
  }
  return dom
}

function init(today = new Date(), lastDayOfWeek = 7) {
  const controls = h('div', ['controls'])
  const prevBtn = h('button')
  prevBtn.textContent = '上月'
  prevBtn.addEventListener('click', prev)

  const thisMonthEl = h('div')
  function renderThisMonth() {
    const day = resolveTime(today)
    thisMonthEl.textContent = `${day.year}\\${day.month}` 
  }
  renderThisMonth()

  const nextBtn = h('button')
  nextBtn.textContent = '下月'
  nextBtn.addEventListener('click', next)

  controls.appendChild(prevBtn)
  controls.appendChild(thisMonthEl)
  controls.appendChild(nextBtn)

  document.querySelector('#app').appendChild(controls)

  const week = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  week.forEach(w => {
    const div = h('div')
    div.classList.add('item')
    div.textContent = w
    document.querySelector('#app').appendChild(div)
  })

  const days = gen(today, lastDayOfWeek)
  const eleList = []
  for(let i = 0; i < 42; i++) {
    const div = h('div')
    div.classList.add('item')
    div.textContent = resolveTime(days[i]).day
    document.querySelector('#app').appendChild(div)
    eleList.push(div)
  }

  function next() {
    today = getFirstDayOfNextMonth(today)
    eleList.forEach(el => el.textContent = '')
    gen(today, lastDayOfWeek).forEach((day, i) => {
      const d = resolveTime(day)
      eleList[i].textContent = d.day
    })
    renderThisMonth()
  }

  function prev() {
    today = getFirstDayOfPrevMonth(today)
    eleList.forEach(el => el.textContent = '')
    gen(today, lastDayOfWeek).forEach((day, i) => {
      const d = resolveTime(day)
      eleList[i].textContent = d.day
    })
    renderThisMonth()
  }
}

init()