(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-58934f3c"],{5741:function(e,t,s){"use strict";s.r(t);var r=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{ref:"markBox",staticClass:"mark-box backgroundGray"},[s("el-row",{attrs:{gutter:32}},[s("el-col",{staticClass:"paper",attrs:{span:16}},[s("el-scrollbar",{staticClass:"scrollbar-box"},e._l(e.paper,(function(t){return s("div",{key:t.index},[s("h4",[e._v(e._s(t.index)+"、"+e._s(t.name))]),e._v(" "),e._l(t.questions,(function(r,n){return s("div",{key:n},[0!==n?s("div",[s("div",{staticClass:"flex-box"},[s("span",{staticStyle:{"line-height":"50px"}},[e._v(e._s(n)+"、")]),e._v(" "),s("div",{domProps:{innerHTML:e._s(r.content)}})]),e._v(" "),r[e.selectOptions[0]]?s("div",e._l(e.selectOptions,(function(t){return s("div",{key:t},[r[t]?s("div",{staticClass:"flex-box"},[s("span",{staticStyle:{"line-height":"50px"}},[e._v(e._s(t)+"、")]),e._v(" "),s("span",{domProps:{innerHTML:e._s(r[t])}})]):e._e()])})),0):e._e(),e._v(" "),s("p",[e._v("参考答案："+e._s(r.rightKey))]),e._v(" "),s("p",[e._v("考生答案：\n                "),"essays"!==t.type?s("span",{class:{green:null!==r.isTrue&&r.isTrue,red:null!==r.isTrue&&!r.isTrue}},[e._v(e._s(r.mineAnswer))]):e._e(),e._v(" "),"essays"===t.type?s("span",{class:{green:null!==r.isTrue&&r.isTrue,red:null!==r.isTrue&&!r.isTrue},domProps:{innerHTML:e._s(r.mineAnswer)}}):e._e(),e._v(" "),null!=r.isTrue&&r.isTrue?s("i",{staticClass:"isTrue-tip green el-icon-check"}):e._e(),e._v(" "),null==r.isTrue||r.isTrue?e._e():s("i",{staticClass:"isTrue-tip red el-icon-close"})]),e._v(" "),s("p",[e._v("分值："+e._s(r.score))]),e._v(" "),s("div",{staticClass:"flex-box"},[s("div",{staticStyle:{width:"60px","line-height":"40px"}},[e._v("得分: ")]),e._v(" "),s("el-input",{staticStyle:{width:"200px"},attrs:{type:"number",min:0,max:r.score},model:{value:r.newScore,callback:function(t){e.$set(r,"newScore",t)},expression:"unit.newScore"}}),e._v(" "),s("el-button",{staticStyle:{"margin-left":"20px"},attrs:{type:"primary"},on:{click:function(s){return e.changeScore(r.oldScore,r.newScore,r,t.type,r.score)}}},[s("svg-icon",{attrs:{"icon-class":"save"}}),e._v("\n                  保存\n                ")],1)],1)]):e._e()])}))],2)})),0)],1),e._v(" "),s("el-col",{staticStyle:{position:"relative"},attrs:{span:8}},[s("el-card",{staticClass:"fix-card"},[s("h4",{staticStyle:{margin:"0"},attrs:{slot:"header"},slot:"header"},[e._v("考生列表")]),e._v(" "),s("el-scrollbar",{staticClass:"scrollbar-box-1"},[s("el-menu",{attrs:{"default-active":e.currentRecord}},e._l(e.overall,(function(t,r){return s("el-menu-item",{key:t.eid,attrs:{index:t.eid},on:{click:function(s){return e.setAnswer(t.eid,t)}}},[e._v("\n              "+e._s(r+1)+"、"+e._s(t.user.name)+"\n              "),s("div",{staticClass:"fr"},[e._v("\n                "+e._s(t.scoreExam)+" 分\n              ")])])})),1)],1)],1)],1)],1)],1)},n=[],i=(s("cc57"),s("5bc8")),a={mixins:[i["a"]],data:function(){return{config:{},questions:{},questionTypes:[],chineseOrderNumber:[],paper:[],selectOptions:[],overall:"",examNumber:0,currentRecord:"1"}},created:function(){this.questionTypes=this.$store.getters.constant.question.types,this.chineseOrderNumber=this.$store.getters.constant.chineseOrderNumber,this.selectOptions=this.$store.getters.constant.selectOptions,this.getPaperConfig()},methods:{getPaperConfig:function(){var e=this,t={paperId:this.$route.query.p};this.openLoad(),this.$store.dispatch("paper/getPaperDetail",t).then((function(t){e.config=t.data.config,e.getPaperQuestions()})).catch((function(){e.$message.error("试卷信息获取失败，请稍后重试"),e.$router.go(-1),e.closeLoad()}))},getPaperQuestions:function(){var e=this,t=this.$route.query.p;this.$store.dispatch("question/getPaperQuestions",{paperId:t}).then((function(t){var s=t.data,r=function(t){s[t].map((function(s){e.questions[t]||(e.questions[t]=[]),e.questions[t][s.orderNumber]=s}))};for(var n in s)r(n);e.initPaper(),e.getExamineeList()})).catch((function(){e.closeLoad()}))},initPaper:function(){var e=this,t=0;this.paper=this.questionTypes.filter((function(t,s){return e.config[t.type]})).map((function(s){var r={index:e.chineseOrderNumber[t],name:s.name,type:s.type,questions:e.questions[s.type]};return t++,r}))},getExamineeList:function(){var e=this,t={paperId:this.$route.query.p};this.$store.dispatch("exam/getExamOverallByPid",t).then((function(t){e.overall=t.data,e.examNumber=e.overall.length,e.overall[0].eid&&(e.currentRecord=e.overall[0].eid,e.setAnswer(e.overall[0].eid,e.overall[0]))})).finally((function(){e.closeLoad()}))},setAnswer:function(e,t){this.currentRecord=e;for(var s=t.answerRecords,r=0,n=this.paper.length;r<n;r++)for(var i=this.paper[r].questions,a=0,o=i.length;a<o;a++)if(i[a])for(var c=0,l=s.length;c<l;c++)if(i[a].qid===s[c].qid){this.$set(i[a],"isTrue",s[c].isTrue),this.$set(i[a],"mineAnswer",s[c].mineAnswer),this.$set(i[a],"oldScore",null==s[c].isTrue?"":s[c].score),this.$set(i[a],"newScore",i[a].oldScore);break}},changeScore:function(e,t,s,r,n){var i=this;if(t=+t,e=+e,t>n)return this.$message.warning("所给分值超过了本题的最大分值，无法保存！"),!1;var a=t-e;s.oldScore=t,s.isTrue=0!==t;for(var o=-1,c=0,l=this.overall.length;c<l;c++)if(this.overall[c].eid===this.currentRecord){this.overall[c].scoreExam+=a,o=this.overall[c].scoreExam;for(var u=this.overall[c].answerRecords,d=0,p=u.length;d<p;d++)if(u[d].qid===s.qid){u[d].score=t,u[d].isTrue=0!==t;break}break}if(-1===o)this.$message.warning("分数计算出错，无法进行保存！");else{var h={eid:this.currentRecord,qid:s.qid,type:r,totalScore:o,newScore:t,gap:a};this.$store.dispatch("exam/changeScore",h).then((function(e){i.$message.success("保存成功！")}))}}}},o=a,c=(s("9a0a"),s("d060"),s("e90a")),l=Object(c["a"])(o,r,n,!1,null,"557501a0",null);t["default"]=l.exports},"5bc8":function(e,t,s){"use strict";t["a"]={data:function(){return{load:null}},beforeMount:function(){},beforeDestroy:function(){},mounted:function(){},methods:{computedIndex:function(e){return(this.page-1)*this.pageSize+e+1},formatTime:function(e){return this.$moment(e).format("YYYY-MM-DD HH:mm:ss")},openLoad:function(e){this.load=this.$loading({target:e})},closeLoad:function(){this.load&&this.load.close()}}}},"8ff8":function(e,t,s){},"9a0a":function(e,t,s){"use strict";var r=s("8ff8"),n=s.n(r);n.a},aaf5:function(e,t,s){},d060:function(e,t,s){"use strict";var r=s("aaf5"),n=s.n(r);n.a}}]);