export abstract class Component {
  destroy () {
    Object.getOwnPropertyNames(this).forEach(key => {
      this[key] = null
    })
  }
}