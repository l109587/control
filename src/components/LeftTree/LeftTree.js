import React, { useRef, useState, useEffect } from 'react';
import { Tree } from 'antd';
import { UnorderedListOutlined, FileOutlined } from '@ant-design/icons';
import { post, postAsync } from '@/services/https';
import '@/utils/box.less';
import './index.less';

let H = document.body.clientHeight - 195
var clientHeight = H > 150 ? H : 150;

export default (props) => {
  /**
   * buisUsgState 是否开启业务用途
   */
  const { getTree, onSelectLeft, buisUsgState } = props;
  const [treelist, setTreelist] = useState([]);
  const [selectedKey, setSelectedKey] = useState([])
  const [treelistKey, setTreelistKey] = useState([1]);//设置默认展开节点

  useEffect(() => {
    getTreeList();
    getBusinessPurpose();
  }, [props.treeInc])

  //区域管理处理
  const getTreeList = (id = 1) => {
    let data = {};
    data = props.leftTreeData;
    post(props.treeUrl, data).then((res) => {
      let list = [];
      list.push(iconTreeList(res));
      if(buisUsgState){
        getBusinessPurpose(list)
      }else{
        setTreelist(list);
      }
      let defaultPath = res.defaultPath?.split('.');
      let keys = [];
      keys.push()
      setSelectedKey(res.node.id);
      setTreelistKey(defaultPath)
      getTree(res)
    }).catch(() => {
      console.log('mistake')
    })
  }
  //业务用途 获取资源字段 id
  const getBusinessPurpose = (list) => {
    post('/cfg.php?controller=confResField&action=showResField', { id: 1 }).then((res) => {
      if(res.success && res.data.length >= 1){
        let infoList = {name:'业务用途',id:'业务用途', leaf: 'N', type:'buisUsgTitle'};
        let info = [];
        res.data.map((item) => {
          let confres = [];
          confres.name = item;
          confres.id = item;
          confres.type = 'buisUsg';
          info.push(confres)
        })
        infoList.children = info;
        list[1] = iconTreeList(infoList);
      }
      setTreelist(list);
    }).catch(() => {
      console.log('mistake')
    })
  }

  //区域管理侧边展开
  const onExpand = (expandedkeysValue) => {
    setTreelistKey(expandedkeysValue);
  }

  const iconTreeList = (list) => {
    if (list.name) {
      list.icon = <UnorderedListOutlined />;
    }
    list.children.map((item) => {
      if (item.leaf == 'N' && item.children) {
        item.icon = <UnorderedListOutlined />;
        item = iconTreeList(item);
      } else {
        item.icon = <FileOutlined />;
      }
    });
    return list;
  }

  // 区域管理侧边点击id处理
  const onSelect = (selectedKeys, info) => {
    setSelectedKey(selectedKeys)
    console.log(info)
    onSelectLeft(selectedKeys, info);
  };

  return (
    <>
      <Tree
        showIcon
        style={{height: clientHeight, overflow: 'auto'}}
        className='asslefttreebox'
        onExpand={onExpand}
        defaultExpandAll
        selectedKeys={selectedKey}
        expandedKeys={treelistKey}
        onSelect={onSelect}
        treeData={treelist}
        fieldNames={{
          title: 'name',
          key: 'id'
        }}
      />
    </>
  );
};
