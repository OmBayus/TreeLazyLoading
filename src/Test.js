import React, { useState, useEffect } from "react";
import { Tree } from "primereact/tree";
import service from "./service";

const TreeLazyDemo = () => {
  const [nodes, setNodes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadedNode,setLoadedNode] = useState([])

  const loadOnExpand = (event) => {
    if (!event.node.children) {
      setLoading(true);

      service.getOne(event.node.key).then((res) => {
        console.log(res.data);
        setLoadedNode(prev=>([...prev,res.data.properties.key]))
        event.node.children = res.data.children.map((child) => ({...child.properties,leaf:child.leaf}));
        setLoading(false);
        setNodes([...nodes]);
      });

      return
    }
  };

  useEffect(() => {
    setLoadedNode([])
    service.getOne(process.env.REACT_APP_URL).then((res) => {
      setNodes([{...res.data.properties, leaf: res.data.children.length === 0}]);
      setLoading(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const Clear = () => {
    setLoading(true);
    service.getOne(process.env.REACT_APP_URL).then((res) => {
      setNodes([{...res.data.properties, leaf: res.data.children.length === 0}]);
      setLoading(false);
    });
  }

  const RollBack = async () => {
    setLoading(true);
    const temp = new Map()
    temp[loadedNode[0]] = nodes[0]
    for (let item of loadedNode){

      const res = await service.getOne(item)
      temp[item].children = res.data.children.map((child) => ({...child.properties,leaf:child.leaf}));
      for(let it of temp[item].children){
        temp[it.key] = it
      }
      
      

    } 
    setNodes([...nodes]);
    setLoading(false);
  }

  return (
    <div>
      <div className="card">
        <Tree
          value={nodes}
          onExpand={loadOnExpand}
          loading={loading}
          nodeTemplate={(data, options) => {
            return (
              <span className="flex align-items-center font-bold">
                {data.label}
                {data.name}
              </span>
            );
          }}
        />
      </div>
      <button onClick={Clear}>clear</button>
      <button onClick={RollBack}>rollback</button>
    </div>
  );
};

export default TreeLazyDemo;
