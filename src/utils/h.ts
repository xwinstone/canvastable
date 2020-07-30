import {isNotEmpty} from "./utils";
import {obj} from "../typings/common";

const h = function (tag , props:obj = {}, ...children) {
  function childrenNodeGet(children) {
    if (!Array.isArray(children)) {
      return null
    }

    const realChildren = [];
    children.forEach(child => {
      if (Array.isArray(child)) {
        realChildren.push(...child)
      } else {
        realChildren.push(child)
      }
    });

    return realChildren
  }

  function domCreate(tag: string, props, ...children) {
    let element: HTMLElement = document.createElement(tag);
    if (props && typeof props === 'object') {
      for (let prop in props) {
        let val = props[prop];
        if (prop === 'style' && val && typeof val === 'object') {
          for (let name in val) {
            element.style[name] = val[name]
          }
        } else if (prop.indexOf('data-') === 0) {
          prop = prop.slice(5).split('-').map((name, i) => {
            if (i !== 0) {
              name = name[0].toUpperCase() + name.slice(1);
            }
            return name;
          }).join('');
          element.dataset[prop] = val;
        } else {
          element[prop] = val;
        }
      }
    }

    let nodes = childrenNodeGet(children)
      .filter(c => isNotEmpty(c))
      .map(child => {
        let node = null;
        if (['string', 'boolean', 'number'].includes(typeof child)) {
          node = document.createTextNode(child + '');
        } else if (child instanceof Node) {
          node = child;
        } else if (child.wrapper instanceof Node) {
          node = child.wrapper;
        }
        return node;
      });

    Array.isArray(nodes) && nodes.forEach(node => {
      if (element.appendChild) {
        element.appendChild(node)
      }
    });

    return element;
  }

  function comCreate(Constructor, props, ...children) {
    const realChildren = childrenNodeGet(children);
    const component = new Constructor({...props, children: realChildren});
    // let nodes = childrenNodeGet(component, children);
    //
    // Array.isArray(nodes) && nodes.forEach(node => {
    //     if(component.appendChild){
    //         component.appendChild(node)
    //     }
    // });

    return component;
  }

  let result = null;
  if (typeof tag === 'string') {
    result = domCreate(tag, props, ...children)
  } else {
    result = comCreate(tag, props, ...children)
  }

  if (props && props.ref) {
    if ('current' in props.ref) {
      props.ref.current = result
    } else if (typeof props.ref === 'function') {
      props.ref(result)
    }
  }
  return result
};
export default h

export interface IRefer<T> {
  current:T
}
export const createRef = <T>():IRefer<T> => {
  return {current: null}
};
