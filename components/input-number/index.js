const toNumberWhenUserInput = (num) => {
  if (/\.\d*0$/.test(num) || num.length > 16) {
    return num
  }
  if (isNaN(num)) {
    return num
  }
  return Number(num)
}

const getValidValue = (value, min, max) => {
  let val = parseFloat(value)
  if (isNaN(val)) {
    val = min
  }
  if (val < min) {
    wx.showToast({
      title: '数量不能小于1',
      icon: 'none',
      duration: 2000
    })
    val = min
  }
  if (val > max) {
    val = max
  }
  return val
}

Component({
  properties: {
    min: {
      type: Number,
      value: 1,
    },
    max: {
      type: Number,
      value: 10000,
    },
    step: {
      type: Number,
      value: 1,
    },
    defaultValue: {
      type: Number,
      value: 0,
    },
    value: {
      type: Number,
      value: 0,
      observer(newVal) {
        if (this.data.controlled) {
          this.updated(newVal)
        }
      },
    },
    disabled: {
      type: Boolean,
      value: true,
    },
    longpress: {
      type: Boolean,
      value: false,
    },
    controlled: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    inputValue: 0,
    disabledMin: false,
    disabledMax: false,
  },
  attached() {
    const { defaultValue, value, controlled } = this.data
    const inputValue = controlled ? value : defaultValue
    this.updated(inputValue)
  },
  detached() {
    this.clearTimer()
    this.clearInputTimer()
  },
  methods: {
    /* 更新值 */
    updated(value, condition = true, trigger = false,type) {
      const { min, max } = this.data
      const inputValue = getValidValue(value, min, max)
      const disabledMin = inputValue <= min
      const disabledMax = inputValue >= max
        // 更新数值，判断最小或最大值禁用 sub 或 add 按钮
      if (condition) {
        this.setData({
          inputValue,
          disabledMin,
          disabledMax,
        })
      }
      if (trigger) {
        if (type === 'add') {
          this.triggerEvent('change', { value: inputValue })
        }
        if (type === 'sub') {
          this.triggerEvent('pluschange', { value: inputValue })
        }
      }
    },
    /* 数字计算函数 */
    calculation(type, meta) {
      const { disabledMax, disabledMin, inputValue, step, longpress, controlled, disabled } = this.data
      if (type === 'add') {
        if (disabledMax || disabled) return false
        this.updated(inputValue + step, !controlled, true,type)
      }
      if (type === 'sub') {
        // if (disabledMin || disabled) return false
        this.updated(inputValue - step, !controlled, true,type)
      }
      if (longpress && meta) {
        this.timeout = setTimeout(() => this.calculation(type, meta), 100)
      }
    },

    /* 当键盘输入时，触发 input 事件 */
    onInput(e) {
      this.clearInputTimer()
      this.inputTime = setTimeout(() => {
        const value = toNumberWhenUserInput(e.detail.value)
        this.triggerEvent('changefind', { value })
      }, 300)
    },

    /* 输入框聚焦时触发 */
    onFocus(e) {
      this.triggerEvent('focus', e.detail)
    },

    /* 输入框失去焦点时触发*/
    onBlur(e) {
      const value = toNumberWhenUserInput(e.detail.value)
      this.updated(value, !this.data.controlled)
      this.triggerEvent('blur', { value })
    },

    /* 手指触摸后，超过350ms再离开*/
    onLongpress(e) {
      const { type } = e.currentTarget.dataset
      const { longpress } = this.data
      if (longpress) {
        this.calculation(type, true)
      }
    },

    /* 手指触摸后马上离开*/
    onTap(e) {
      const { type } = e.currentTarget.dataset
      const { longpress } = this.data
      if (!longpress || longpress && !this.timeout) {
        this.calculation(type, false)
      }
    },

    /* 	手指触摸动作结束*/
    onTouchEnd() {
      this.clearTimer()
    },

    /* 手指触摸动作被打断，如来电提醒，弹窗 */
    onTouchCancel() {
      this.clearTimer()
    },

    /* 清除长按的定时器 */
    clearTimer() {
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
    },

    /* 清除输入框的定时器 */
    clearInputTimer() {
      if (this.inputTime) {
        clearTimeout(this.inputTime)
        this.inputTime = null
      }
    },
  },
})