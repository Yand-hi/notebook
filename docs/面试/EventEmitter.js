class EventEmitter {
  /**
   * @constructor
   */
  constructor() {
    this.eventList = [];
  }

  /**
   * 监听事件
   * @param {string} eventName
   * @param {callback} callback
   * @param {boolean | Object} [options = true]
   * @param {Element | Document} [target = document]
   */
  $on(eventName, callback, options = true, target = document) {
    target.addEventListener(eventName, callback, options);
    this.eventList.push({
      target,
      eventName,
      callback,
      target,
    })
  }

  /**
   * 监听事件,只监听一次，之后销毁
   * @param {string} eventName
   * @param {requestCallback} callback
   * @param {boolean|Object} [options = true]
   * @param {Document|Element} [target = document]
   */
  $once(eventName, callback, options = true, target = document) {
    const once_callback = (e) => {
      callback(e);
      target.removeEventListener(eventName, once_callback, options);
    };
    target.addEventListener(eventName, once_callback, options);
  }

  /**
   * 触发事件
   * @param {string} eventName
   * @param {any} detail
   * @param {Element | Document} [target = document]
   */
  $emit(eventName, data, target = document) {
    const customEvent = new CustomEvent(eventName, {
      detail,
      bubbles: true,
    });
    target.dispatchEvent(customEvent);
  }

  /**
   * 注销事件
   * @param {string} eventName
   * @param {callback} callback
   * @param {boolean | Object} [options = true]
   * @param {Element | Document} [target = document]
   */
  $off(eventName, callback, options = true, target = document) {
    let eventList = [];
    if (eventName && callback && options && target) {
      eventList = this.eventList.filter(
        e => e.eventName === eventName && e.callback === callback && e.options === options && e.target === target
      )
    } else if (eventName && callback && options) {
      eventList = this.eventList.filter(
        e => e.eventName === eventName && e.callback === callback && e.options === options
      )
    } else if (eventName && callback) {
      eventList = this.eventList.filter(
        e => e.eventName === eventName && e.callback === callback
      )
    } else if (eventName) {
      eventList = this.eventList.filter(
        e => e.eventName === eventName
      )
    } else {
      eventList = [...this.eventList];
    }
    eventList.forEach(e => {
      e.target.removeEventListener(e.eventName, e.callback, e.options)
      const index = this.eventList.findIndex(event => event === e);
      if (~index) this.eventList.splice(index, 1)
    })
  }
}
