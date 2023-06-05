import { message, notification, Space } from 'antd'
// import { PATH } from './const/const'
// import { hashHistory } from 'react-router'
//表单布局(居中)
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
    },
    layout:"center"
};

const formhorizCard = {
    layout:"horizontal", 
    labelCol: {
        xs: { span: 8 },
        sm: { span: 6 },
    },
    wrapperCol: {
        flex:'640px'
    },
}

const centerthreeLayout = {
    labelCol:{
        xs: { span:8 },
        sm: { span:6 }
    },
    wrapperCol:{
        xs: { span:16 },
        sm: { span:14 }
    },
    // labelCol: {
    //     xs: { span: 8 },
    //     sm: { span: 12 },
    // },
    // wrapperCol: {
    //     xs: { span: 10 },
    //     sm: { span: 8 },
    // },
    layout:'inline'
}



const formleftLayout = {
    labelCol: {
        xs: { span: 8 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 12 },
        sm: { span: 10 },
    },
    layout:"horizontal",  
};

const formfieldTable = {
    labelCol: {
        xs: { span: 8 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 10 },
        sm: { span: 8 },
    },
}


const radformLayout = {
    labelCol: {
        xs: { span: 8 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 18 },
        sm: { span: 18 },
    },
}

const formdigitLayout = {
    wrapperCol: {
        xs: { span: 3 },
        sm: { span: 3 },
    }
}

const illegalformLayout = {
    labelCol: {
        xs: { span: 8 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 5 },
        sm: { span: 4 },
    },
    layout:"horizontal",  
}

const modalFormLayout = {
    labelCol:{
        xs: { span:7 },
    },
    wrapperCol:{
        xs: { span:12 },
    },
    width:"500px",
    layout:"horizontal",   
}

const defaultModalFormLayout = {
    labelCol:{
        xs: { span:6 },
    },
    wrapperCol:{
        xs: { span:16 },
    },
    layout:"horizontal",   
}

const defaultUserSync = {
    labelCol:{
        xs: { span:7 },
    },
    wrapperCol:{
        xs: { span:13 },
    },
    layout:"horizontal",   
}

const userSync = {
    labelCol:{
        xs: { span:7 },
    },
    wrapperCol:{
        xs: { span:14 },
    },
    layout:"horizontal",   
}

const drawFormLayout = {
    labelCol:{
        xs: { span:8 },
    },
    wrapperCol:{
        xs: { span:12 }
    },
    width:"450px",
    layout:"horizontal",   
}

const modalFormLayoutCard = {
    width:"500px",
    layout:"horizontal",   
}

const violationitem = {
    labelCol:{
        xs: { span: 8 },
        sm: { span: 6 },
    },
    wrapperCol:{
        xs: { span: 10},
        // sm: { span:8},
    },
}
const afterLayout ={
    labelCol: {
        xs: { span: 8 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 2 },
        sm: { span: 2 },
    },
}

const modalFormLayoutTypeOne = {
    labelCol:{
        xs: { span:9},
    },
    wrapperCol:{
        xs: { span:6}
    },
}
const modalFormLayoutTypeThree = {
    labelCol:{
        xs: { span:9},
    },
    wrapperCol:{
        xs: { span:6}
    },
}
const modalFormLayoutTypeTwo = {
    labelCol:{
        xs: { span:9},
    },
    wrapperCol:{
        xs: { span:10},
        // sm: { span:8},
    },
}

const vermodal = {
    layout:"center",   
    width:"510px",
    wrapperCol: { 
        // offset:1,
    },
    labelCol:{
        // offset:1,
        xs: { span:8},
    },

}


const verform = {
    layout:"vertical",   
    width:"300px",
    wrapperCol: { 
        // xs: { span:8},
        offset: 4
    },
    labelCol:{
        // offset:1,
        xs: { span:1},
        // offset: 4
    },

}


const procardgutter = {
     gutter:[0,14],
     direction:"column" 
}
//弹框
const formItemModal = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
}
// Drawer样式
const formItemLayoutDrawer = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
}
//表单靠左
const formItemLayoutL = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
    },
};
const formItemLayoutTan = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
    },
}
// 查询
const layout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};
// const tailLayout = {
//     wrapperCol: { offset: 8, span: 16 },
//   };
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 12,
            offset: 6,
        },
    },
};
//信息条
const success = (title = '修改') => {
    message.success(`${title}成功`);
};
const openNotificationWithIcon = (type, title, value) => {
    notification[type]({
        message: title,
        description: value,
    });
};
const p = (s) => {
    return s < 10 ? '0' + s : s
}
const getTm = (Tm) => {
    let a = Tm + '+0800'
    let d = new Date(a)
    let resDate = d.getFullYear() + '-' + p((d.getMonth() + 1)) + '-' + p(d.getDate())
    let resTime = p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds())
    return resDate + "  " + resTime
}
const rTime = () => {
    var myDate = new Date();
    return myDate.toLocaleDateString()
    // var json_date = new Date(date).toJSON();
    // return new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
}

/* 时间戳转换时间方法 */
const add0 = (m) => { return m < 10 ? '0' + m : m }
const timestampToTime = (shijianchuo) => {
    //shijianchuo是整数，否则要parseInt转换
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}

/* 时间转换为时间戳 */
const timeToTimestamp = (time) => {
    let timestamp = Date.parse(new Date(time).toString())
    return timestamp
}

export {
    tailFormItemLayout,
    formItemLayout,
    formItemLayoutL,
    tailLayout,
    procardgutter,
    formItemLayoutTan,
    drawFormLayout,
    modalFormLayout,
    defaultModalFormLayout,
    formleftLayout,
    illegalformLayout,
    violationitem,
    formfieldTable,
    verform,
    modalFormLayoutCard,
    modalFormLayoutTypeOne,
    modalFormLayoutTypeTwo,
    modalFormLayoutTypeThree,
    centerthreeLayout,
    layout,
    afterLayout,
    formhorizCard,
    formItemModal,
    radformLayout,
    vermodal,
    formdigitLayout,
    formItemLayoutDrawer,
    defaultUserSync,
    userSync,
    success,
    openNotificationWithIcon,
    getTm,
    rTime,
    timestampToTime,
    timeToTimestamp
}