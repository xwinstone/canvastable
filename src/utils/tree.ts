import {isEmpty, isNotEmpty} from "./utils";

interface IBaseTree {
  [key: string]: any
  children?: IBaseTree[]
}

export const treeEach = <T extends IBaseTree>(
  tree: T | T[],
  handler: (tnode: T, deep?: number) => void,
  childrenKey = 'children'
) => {
  let deep = 1;
  const each = (tnode: IBaseTree, cb: (tnode: IBaseTree, deep?: number) => void) => {
    if (tnode) {
      cb(tnode, deep);

      const children = tnode[childrenKey];
      deep++;
      Array.isArray(children) && children.forEach(t => {
        each(t, cb);
      });
      deep--;
    }
  };

  if (Array.isArray(tree)) {
    tree.forEach((t) => {
      each(t, handler);
    })
  } else {
    each(tree, handler);
  }
};

export const treeBFEach = <T extends IBaseTree>(
  tree: T | T[],
  handler: (tnode: T, deep?: number) => void,
  childrenKey = 'children'
) => {
  const queue: T[] = Array.isArray(tree) ? [...tree] : [tree];
  while (queue[0]) {
    const curr = queue.shift();
    handler(curr);
    if (Array.isArray(curr[childrenKey])) {
      queue.push(...(<T[]>curr[childrenKey]));
    }
  }
};

export const treeGetLeaf = <T extends IBaseTree>(
  tree: T | T[],
  childrenKey = 'children'
) => {
  const leafs: T[] = [];
  treeEach(tree, (tnode) => {
    if (isEmpty(tnode[childrenKey])) {
      leafs.push(tnode)
    }
  }, childrenKey);

  return leafs;
};

export const treeGetDeep = <T extends IBaseTree>(
  tree: T | T[],
  childrenKey = 'children'
) => {
  let deep = 0;
  treeEach(tree, (tnode, currDeep) => {
      if (currDeep > deep) {
        deep = currDeep
      }
    },
    childrenKey
  );
  return deep;
};

/**
 * 从本身节点开始，向后查找（包含本身）
 */
export const treeBackFind = <T extends IBaseTree>(
  node: T,
  filterCb: (tnode: T) => boolean,
  parentKey = 'parent'
) => {
  let result = node,
    deep = 0;

  while (result) {
    deep ++;
    if (filterCb(result)) {
      return result
    } else {
      result = result[parentKey]
    }

    if (deep > 100) {
      return;
    }
  }
  return null;
};

export const treeInherit = <T extends IBaseTree>(node: T, key: string, defaultValue = null) => {
  const result = treeBackFind(node, tnode => {
    return isNotEmpty(tnode[key]);
  });
  return result ? result[key] : defaultValue;
};

export const treeGetPath = <T extends IBaseTree>(node: T) => {
  const path: T[] = [];
  treeBackFind(node, (tnode) => {
    path.push(tnode);
    return false
  });
  return path
};
