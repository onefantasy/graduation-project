(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-47cefe25"],{"1f2f":function(e,t,n){},"25aa":function(e,t,n){"use strict";var o=n("ea8b"),a=n.n(o);a.a},"3d46":function(e,t,n){"use strict";var o=n("1f2f"),a=n.n(o);a.a},"5bc8":function(e,t,n){"use strict";t["a"]={data:function(){return{load:null}},beforeMount:function(){},beforeDestroy:function(){},mounted:function(){},methods:{computedIndex:function(e){return(this.page-1)*this.pageSize+e+1},formatTime:function(e){return this.$moment(e).format("YYYY-MM-DD HH:mm:ss")},openLoad:function(e){this.load=this.$loading({target:e})},closeLoad:function(){this.load&&this.load.close()}}}},"7d9e":function(e,t,n){"use strict";n.r(t);var o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"userList-box"},[n("div",{staticClass:"search-box"},[n("el-input",{attrs:{clearable:"",placeholder:"账号"},model:{value:e.searchKeys.account,callback:function(t){e.$set(e.searchKeys,"account",t)},expression:"searchKeys.account"}}),e._v(" "),n("el-input",{attrs:{clearable:"",placeholder:"姓名"},model:{value:e.searchKeys.name,callback:function(t){e.$set(e.searchKeys,"name",t)},expression:"searchKeys.name"}}),e._v(" "),n("el-input",{attrs:{clearable:"",placeholder:"编号"},model:{value:e.searchKeys.number,callback:function(t){e.$set(e.searchKeys,"number",t)},expression:"searchKeys.number"}}),e._v(" "),n("el-select",{attrs:{clearable:"",placeholder:"身份"},model:{value:e.searchKeys.role,callback:function(t){e.$set(e.searchKeys,"role",t)},expression:"searchKeys.role"}},e._l(e.rolesOptions,(function(e){return n("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})})),1),e._v(" "),n("el-button",{staticClass:"fr",attrs:{icon:"el-icon-search"},on:{click:function(t){return t.stopPropagation(),e.search(t)}}})],1),e._v(" "),n("div",[n("el-table",{attrs:{data:e.userList,border:"",stripe:""},on:{"expand-change":e.expandChange}},[n("el-table-column",{attrs:{type:"expand"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-form",[n("el-form-item",{attrs:{label:"新密码:"}},[n("el-input",{staticStyle:{width:"400px"},attrs:{type:"password","show-password":""},model:{value:e.password,callback:function(t){e.password=t},expression:"password"}}),e._v(" "),n("el-button",{attrs:{icon:"el-icon-edit-outline",type:"info"},on:{click:function(n){return e.changePassword(t.row)}}},[e._v("修改密码")])],1)],1)]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"序号",width:"50",align:"center","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n          "+e._s(e.computedIndex(t.$index))+"\n        ")]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"account",label:"账号",align:"center","show-overflow-tooltip":""}}),e._v(" "),n("el-table-column",{attrs:{prop:"headIcon",label:"头像",width:"110",align:"center","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-image",{attrs:{src:t.row.headIcon||e.defaultHeadIcon,"preview-src-list":[t.row.headIcon||e.defaultHeadIcon]}})]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"name",label:"姓名",align:"center","show-overflow-tooltip":""}}),e._v(" "),n("el-table-column",{attrs:{prop:"role",label:"身份",align:"center","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n          "+e._s(e.roles[t.row.role])+"\n        ")]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"school",label:"学校",align:"center","show-overflow-tooltip":""}}),e._v(" "),n("el-table-column",{attrs:{prop:"major",label:"专业",align:"center","show-overflow-tooltip":""}}),e._v(" "),n("el-table-column",{attrs:{prop:"class",label:"班级",align:"center","show-overflow-tooltip":""}}),e._v(" "),n("el-table-column",{attrs:{prop:"number",label:"学号",align:"center","show-overflow-tooltip":""}}),e._v(" "),n("el-table-column",{attrs:{prop:"createdAt",label:"注册时间",align:"center","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n          "+e._s(e.formatTime(t.row.createdAt))+"\n        ")]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"latestTime",label:"上次登陆",align:"center","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n          "+e._s(t.row.latestTime?e.formatTime(t.row.latestTime):"")+"\n        ")]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"操作",align:"center","show-overflow-tooltip":"",fixed:"right",width:"210"},scopedSlots:e._u([{key:"default",fn:function(t){return["admin"!==t.row.role?n("el-button",{attrs:{icon:"el-icon-sort",size:"mini",type:"success"},on:{click:function(n){return e.changeRole(t.row)}}},[e._v("变更身份")]):e._e(),e._v(" "),"admin"!==t.row.role?n("el-button",{attrs:{icon:"el-icon-remove-outline",size:"mini",type:"danger"},on:{click:function(n){return e.deleteAccount(t.row)}}},[e._v("删除")]):e._e()]}}])})],1),e._v(" "),n("el-pagination",{staticClass:"pagination",attrs:{background:"",layout:"total, sizes, prev, pager, next, jumper","page-size":e.pageSize,"page-sizes":e.pageSizes,"current-page":e.page,total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)])},a=[],r=(n("5ab2"),n("b449"),n("e980")),s=(n("cc57"),n("6d57"),n("e10e"),n("ac9f")),l=n("5bc8");function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){Object(s["a"])(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var u={mixins:[l["a"]],data:function(){return{searchKeys:{account:"",name:"",number:"",role:""},page:1,pageSize:10,pageSizes:[2,10,20,30],total:0,userList:[],roles:{},rolesOptions:[],defaultHeadIcon:null,password:""}},created:function(){this.roles=this.$store.getters.constant.roles;var e=[];for(var t in this.roles){var n={};n.label=this.roles[t],n.value=t,e.push(n)}this.rolesOptions=e,this.defaultHeadIcon=this.$store.getters.constant.defaultHeadIcon,this.getUserList()},methods:{getUserList:function(){var e=this,t=i({page:this.page,pageSize:this.pageSize},this.searchKeys);this.$store.dispatch("user/getUserList",t).then((function(t){e.total=t.total,e.userList=t.data}))},handleSizeChange:function(e){this.pageSize=e,this.getUserList()},handleCurrentChange:function(e){this.page=e,this.getUserList()},search:function(){this.page=1,this.getUserList()},changePassword:function(e){var t=this,n={password:this.password.trim(),account:e.account};this.$store.dispatch("user/adminChangePassword",n).then((function(e){t.$message.success("密码更新成功！")}))},changeRole:function(e){var t=this,n=Object.keys(this.roles).slice(0,2),o=e.role===n[0]?n[1]:n[0],a={account:e.account,role:o};this.$store.dispatch("user/adminChangeRole",a).then((function(n){t.$message.success("".concat(e.name,"已经变更为").concat(t.roles[o],"身份！")),t.getUserList()}))},deleteAccount:function(){var e=Object(r["a"])(regeneratorRuntime.mark((function e(t){var n,o,a=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=!0,e.next=3,this.$confirm("确定要删除用户".concat(t.name,"？"),"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){n=!1})).catch((function(){n=!0}));case 3:if(!n){e.next=5;break}return e.abrupt("return",!1);case 5:o={account:t.account},this.$store.dispatch("user/adminDeleteAccount",o).then((function(e){a.$message.success("删除角色成功！"),a.getUserList()}));case 7:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),expandChange:function(e,t){this.password=""}}},p=u,h=(n("25aa"),n("3d46"),n("e90a")),f=Object(h["a"])(p,o,a,!1,null,"47f1e994",null);t["default"]=f.exports},ea8b:function(e,t,n){}}]);