<template>
  <div id="assessment">
    <div class="acctb">
      <div class="header">工作室考核</div>
      <div class="workaccount-search">
        <div class="l h150">
          <mu-text-field label="关键字" hintText="工作室名称，交易宝账号" labelFloat v-model="search" labelClass="workaccount-sarch-label"/>
        </div>
        <mu-raised-button label="查询" class="l workaccount-button" :backgroundColor="bgcolor" @click = 'searchword'/>
        <mu-raised-button label="刷新" class="l workaccount-button" :backgroundColor="bgcolor" @click="reloadthis"/>
        <mu-raised-button label="导出为报表" class="l workaccount-button" :backgroundColor="bgcolor" @click="getexcel"/>
        <!--<div class="l income-status">
          <mu-select-field v-model="status" label="账号状态" labelClass="search-title"  labelFocusClass="search-focus" @change="searchstatus">
            <mu-menu-item v-for="text,index in list" :key="index" :value="String(index)" :title="text" />
          </mu-select-field>
        </div>-->
      </div>
      <div class="workaccount-tb" v-show="!showdetail">
        <mu-table :showCheckbox="isshow" class="workaccount-tbe">
          <mu-thead>
            <mu-tr>
              <mu-th class="workaccount-th" v-for='(title,index) in tbtitle' :key="index">{{title}}</mu-th>
            </mu-tr>
          </mu-thead>
          <mu-tbody>
            <mu-tr v-for="(tbm,index) in tbmsg" :key="index" :class="{redmark:!tbm.is_active}">
              <mu-td>{{tbm.work_name}}</mu-td>
              <mu-td>{{tbm.level == '1' ? '工作室' : tbm.level == '2' ? '运营中心' : '分公司'}}</mu-td>
              <mu-td>{{tbm.name}}</mu-td>
              <mu-td>{{tbm.wallet_mobile}}</mu-td>
              <mu-td>{{tbm.join_date}}</mu-td>
              <mu-td>{{tbm.score}}</mu-td>
              <mu-td>
                <button class="bt" @click="opendetail(tbm)" :class="{redmark:!tbm.is_active}">查看</button>
              </mu-td>
              <mu-td>
                <button class="bt" :class="{redmark:!tbm.is_active}" @click="operateopen('upgrade',tbm)">升级</button>
                <button class="bt" :class="{redmark:!tbm.is_active}" @click="operateopen('degrade',tbm)">降级</button>
                <button class="bt" :class="{redmark:!tbm.is_active}" @click="operateopen('dissolve',tbm)">解散</button>
              </mu-td>
              <mu-td>
                <!--<button class="bt" @click="thisdetail(tbm)">详情</button>
                <button v-if="tbm.is_active" class="bt" @click="forbidden(tbm)">禁用</button>
                <button v-if="!tbm.is_active" :class="{redmark:!tbm.is_active}" class="bt" @click="startuse(tbm)">启用</button>-->
                <button @click="manageropen(tbm)" class="bt" :class="{redmark:!tbm.is_active}">更改名称</button>
              </mu-td>
            </mu-tr>
          </mu-tbody>
        </mu-table>
        <div class="workaccount-paging1" v-if="total > 10">
          <div class="showlists">总共{{total}}条记录，当前为第{{current}}页，显示第{{(current - 1) * 10+ 1}}条到第{{current * 10 > total ? total : current * 10}}条记录</div>
          <mu-pagination :total="total" :current="current" @pageChange="pagechange" class="workaccount-paging-box">
          </mu-pagination>
        </div>
      </div>

    </div>
    <mu-dialog :open="show" title="温馨提示">
      {{msg}}
      <mu-flat-button label="确定" slot="actions" primary @click="close"/>
    </mu-dialog>
    <mu-dialog :open="gopass" title="温馨提示">
      {{passmsg}}
      <mu-flat-button label="取消" slot="actions" primary @click="closepass"/>
      <mu-flat-button label="确定" slot="actions" primary @click="passclose"/>
    </mu-dialog>
    <mu-dialog :open="operatebox" title="温馨提示">
      {{operatemsg}}
      <mu-flat-button label="取消" slot="actions" primary @click="operateclose"/>
      <mu-flat-button label="确定" slot="actions" primary @click="operateok"/>
    </mu-dialog>
    <div class="custormbox" v-if="custorm">
      <div class="vr9-title">
        <div class=" l">
          更改{{myworkname}}名称
        </div>
        <div class="r" @click.stop="goout">
          X
        </div>
      </div>
      <div class="vr9number">
        <div class="l">更改后名称：</div>
        <div class="l">
          <input type="text" class="l vr9input" v-model="accountid">
        </div>
      </div>
      <div class="custormbtn">
        <mu-raised-button label="确定更改" class="custorm-bt l loadmr" :backgroundColor="bgcolor" @click="setcustorm" :disabled="disb"/>
      </div>
    </div>
    <!--会员详情-->
    <div class="detail" v-if="showdetail">
      <div class="header">工作室业绩</div>
      <div class="dtback">
        <mu-date-picker mode="landscape" hintText="开始日期" icon=":iconfont icon-riqi" label="开始日期" :maxDate="enddate" labelClass="search-title" v-model="startdate" class="l wid150 btmar"/>
        <mu-date-picker mode="landscape" hintText="结束日期" icon=":iconfont icon-riqi" label="结束日期" :minDate="startdate"  labelClass="search-title" v-model="enddate" class="l wid150 btmar"/>
        <!--<mu-select-field v-model="month" label="月份选择" class="l wid150 btmar mm" @change="monthchange">
          <mu-menu-item value="2017-01" title="2017-01"/>
          <mu-menu-item value="2017-02" title="2017-02"/>
          <mu-menu-item value="2017-03" title="2017-03"/>
          <mu-menu-item value="2017-04" title="2017-04"/>
          <mu-menu-item value="2017-05" title="2017-05"/>
          <mu-menu-item value="2017-06" title="2017-06"/>
          <mu-menu-item value="2017-07" title="2017-07"/>
          <mu-menu-item value="2017-08" title="2017-08"/>
          <mu-menu-item value="2017-09" title="2017-09"/>
          <mu-menu-item value="2017-10" title="2017-10"/>
          <mu-menu-item value="2017-11" title="2017-11"/>
          <mu-menu-item value="2017-12" title="2017-12"/>
        </mu-select-field>-->
        <mu-raised-button label="查询" class="l workaccount-button" :backgroundColor="bgcolor" @click = 'searchmonth'/>
        <mu-raised-button label="返回" class="l workaccount-button" :backgroundColor="bgcolor" @click="getback"/>
        <div class="r detailall" >
          当月业绩：{{nowmonth}}<br/>
          <!--{{(startdate ? startdate + '到' : '')+ (enddate ? enddate : '') }}-->查询业绩：{{monthall}}
        </div>
      </div>
      <div class="addworkaccount_box l">
        <mu-table :showCheckbox="isshow" class="member-tbe">
          <mu-thead>
            <mu-tr>
              <mu-th class="member-th" v-for='(title,index) in otbtitle' :key="index">{{title}}</mu-th>
            </mu-tr>
          </mu-thead>
          <mu-tbody>
            <mu-tr v-for="(tbm,index) in otbmsg" :key="index">
              <mu-td class="dfhandle-td">{{openname}}</mu-td>
              <mu-td class="dfhandle-td">{{tbm.account}}</mu-td>
              <mu-td class="dfhandle-td">{{tbm.mobile}}</mu-td>
              <mu-td class="dfhandle-td">{{tbm.date+'  '+tbm.time}}</mu-td>
              <mu-td class="dfhandle-td">{{tbm.amount}}</mu-td>
            </mu-tr>
          </mu-tbody>
        </mu-table>
        <div class="workaccount-paging1" v-if="dtotal > 10">
          <div class="showlists">总共{{dtotal}}条记录，当前为第{{dcurrent}}页，显示第{{(dcurrent - 1) * 10+ 1}}条到第{{dcurrent * 10 > dtotal ? dtotal : dcurrent * 10}}条记录</div>
          <mu-pagination :total="dtotal" :current="dcurrent" @pageChange="dhandleClick" class="workaccount-paging-box">
          </mu-pagination>
        </div>
      </div>
    </div>
    <!--会员详情-->
  </div>
</template>
<script>
  export default{
    name:'hqassessment',
    data(){
      return {
        search:'',//搜索
        startdate:'',//开始时间
        enddate:'',//结束时间
        bgcolor:'#337ab7',//背景颜色
        status:'0',//select状态
        list:['全部','已禁用','已启用'],//select内容
        showdetail:false,//是否查看详情
        isshow:false,//table是否有checkbox
        tbtitle:['工作室名称','工作室等级','申请人姓名','交易宝账号','加入时间','当月业绩','业绩查看','操作','管理'],//table表头
        tbmsg:[],//table具体信息
        total:0,//信息的总数量
        current:1,//当前页数
        show:false,//弹出提示框
        msg:'',//提示框信息
        managerlabel:'更换管理员',//显示更换管理员按钮label
        custorm:false,//打开更换管理员弹框
        myworkname:'',//需要更换管理员的工作室名称
        accountid:'',//新工作室管理员账号
        disb:false,//是否禁用确定更换管理员按钮
        gopass:false,//打开禁用启用弹框
        passmsg:'',//禁用启用提示
        operatebox:false,//升级，降级，解散操作框
        operatemsg:'',//升级，降级，解散框内容
        operatenow:'',//当前等级
        operateid:'',//当前操作id
        workid:'',//要删除的工作室id
        type:'',//代表操作类型
        myid:'',//禁用启用id
        val:'0',//确定当前查询类型
        otbtitle:['工作室名称','智慧资产账号','绑定交易宝账号','交易时间','交易金额'],//详情页面的theader
        otbmsg:[],//详情页面table信息
        dtotal:0,//详情页翻页
        dcurrent:1,//详情页翻页当前页
        monthall:'9999.9元',
        page:'1',
        openname:'',
        nowmonth:'',
        month:'',
        dtid:'',
        mtyes:false,//有月份的搜索
        monthdtall:''//所有的信息
      }
    },
    methods:{
      searchword(){
        if(this.search === ''){
          this.show = true;
          this.msg = '请输入关键字';
          return;
        }
        this.val = 3;
        this.status = '0';
        this.total = 0;
        this.current = 1;
        this.getworld(this.search,'1');
      },//搜索
      reloadthis(){
        this.total = 0;
        this.current = 1;
        this.search = '';
        this.status = '0';
        this.getmsg('1','4');
      },//刷新
      getexcel(){
        this.$http({
          method:'GET',
          url:'http://120.76.137.157:8887/work_admin/export_works/',
          headers:{
            'Authorization':sessionStorage.getItem('token')
          }
        }).then( res => {
          if(res.body.status == '200'){
            window.open(res.body.path)
          }else{
            this.msg = res.body.msg;
            this.show = true;
          }

        }, res => {
          this.msg = '网络链接失败,请稍后再试';
          this.show = true;
        })
      },//导出报表
      searchstatus(val){
        if(this.search){
          this.search = '';
        }
        this.val = val;
        this.total = 0;
        this.current = 1;
        if(val == '0'){
          this.getmsg('1','4')
        }
        if(val == '1'){
          this.getmsg('1','5');
        }
        if(val == '2'){
          this.getmsg('1','6');
        }
      },//select变化
      pagechange(newinx){
        this.current = newinx;
        if(this.val == '0'){
          this.getmsg(newinx,'4');
        }
        if(this.val == '1'){
          this.getmsg(newinx,'5');
        }
        if(this.val == '2'){
          this.getmsg(newinx,'6');
        }
        if(this.val == '3'){
          this.getworld(this.search,newinx);
        }
      },//翻页
      close(){
        this.show = false;
      },//关闭当前的提示框
      opendetail(tbm){
        this.dtotal = 0;
        this.dcurrent = 1;
        this.startdate = '';
        this.enddate = '';
        var date = new Date();
        var start_date = date.toLocaleDateString().split('/');
        var end_date = date.toLocaleDateString().split('/');
        end_date[2] = '01';
        start_date[2] = '01';
        if(start_date[1] == 1){
          start_date[1] = 12;
          start_date[0] = parseInt(start_date[0]) - 1;
        }else{
          if(start_date[1] <= 10){
            start_date[1] = '0' + (parseInt(start_date[1]) - 1);
          }else{
            start_date[1] = parseInt(start_date[1]) - 1;
          }
        }
        if(end_date[1] <= 10){
          end_date[1] = "0" + end_date[1];
        }
        start_date = start_date.join('-');
        end_date = end_date.join('-');
        this.$http({
          type:'get',
          url:'http://120.76.137.157:47623/backend/workshop_score',//120.76.137.157:47623
          params:{
            work_id:tbm.id,
            start_date:start_date,
            end_date:end_date
          }
        }).then(res =>{
          if(res.body.status == '200'){
          /*if(res.body.identity[0].details.length < 1){
            this.msg = '该工作室没有历史业绩信息';
            this.show = true;
            return;
          }*/
          this.startdate = start_date;
          this.enddate = end_date;
          this.dtid = tbm.id;
          this.openname = tbm.work_name;
          this.monthall = res.body.identity[0].score+'元';
          this.nowmonth = tbm.score+'元';
          if(res.body.identity[0].details.length <= 10){
            this.otbmsg = res.body.identity[0].details;
          }else{
            this.monthdtall = res.body.identity[0].details;
            this.otbmsg = this.monthdtall.slice(0,10);
            this.dtotal = res.body.identity[0].details.length;
            this.dcurrent = 1;
          }
          this.showdetail = true;
        }else{
          this.msg = res.body.message;
          this.show = true;
        }
      },err =>{
          this.msg = '网络链接失败，请稍后再试';
          this.show = true;
        })
      },//打开详情页面
      monthchange(val){
        this.month = val;
      },
      searchmonth(){
        console.log(this.startdate);
        if(!this.startdate || !this.enddate){
          this.msg = '请选择查询时间段';
          this.show = true;
          return;
        }
        this.dtotal = 0;
        this.dcurrent = 0;
        this.otbmsg = [];
        this.mtyes = true;
        this.searchmot(this.startdate,this.enddate);
      },
      dhandleClick(val){
        this.dcurrent = val;
          if(val == 1){
            this.otbmsg = this.monthdtall.slice(0,10);
          }else if(val * 10 <= this.dtotal){
            this.otbmsg = this.monthdtall.slice((val-1)*10,val*10);
            console.log(this.obtmsg);
          }else{
            this.otbmsg = this.monthdtall.slice((val-1)*10);
          }
      },//详情页翻页
      searchmot(year,mt){
        this.$http({
          type:'get',
          url:'http://120.76.137.157:47623/backend/workshop_score',
          params:{
            work_id:this.dtid,
            start_date:year,
            end_date:mt
          }
        }).then(res =>{
          if(res.body.status == '200'){
          this.monthall = res.body.identity[0].score+'元';
          if(res.body.identity[0].details.length <= 10){
            this.otbmsg = res.body.identity[0].details;
          }else{
            this.monthdtall = res.body.identity[0].details;
            this.otbmsg = this.monthdtall.slice(0,10);
            this.dtotal = res.body.identity[0].details.length;
            this.dcurrent = 1;
          }
          if(this.otbmsg.length < 1){
            this.msg = '该时间段没有业绩，请重新选择查询';
            this.show = true;
          }
        }else{
          this.msg = res.body.message;
          this.show = true;
        }
      },err =>{

        })
      },
      getback(){
        this.showdetail = false;
      },//关闭详情页面
      forbidden(tbm){
        this.type = 'un_active';
        this.myid = tbm.id;
        this.passmsg = '确定禁止'+tbm.work_name+'工作室？';
        this.gopass = true;
      },//禁止当前工作室
      startuse(tbm){
        this.type = 'active';
        this.myid = tbm.id;
        this.passmsg = '确定启用'+tbm.work_name+'工作室？';
        this.gopass = true;
      },//启用当前工作室
      passclose(){
        let data = {
          user_id:this.myid,
          set_type:this.type
        }
        this.$http({
          method:'put',
          url:'http://120.76.137.157:8887/work_admin/set_work/',
          body:data,
          headers:{
            'Authorization':sessionStorage.getItem('token')
          }
        }).then(res => {
          this.msg = res.body.msg;
          this.show = true;
          if(res.body.status == '201'){
            this.type = '';
            this.myid = '';
            this.passmsg = '';
            this.gopass = false;
            this.total = 0;
            this.current = 1;
            if(this.val == '0'){
              this.getmsg('1','4');
            }
            if(this.val == '1'){
              this.getmsg('1','5');
            }
            if(this.val == '2'){
              this.getmsg('1','6');
            }
            if(this.val == '3'){
              this.getworld(this.search,'1');
            }
          }
        }, err => {
            this.msg = '网络链接失败,请稍后再试';
            this.show = true;
        })
      },//确定禁用或者启用
      closepass(){
        this.gopass = false;
      },//取消禁用或者启用
      manageropen(tbm){
        this.accountid = '';
        this.myworkname = tbm.work_name;
        this.myid = tbm.id;
        this.custorm = true;
      },//更换管理员弹框
      setcustorm(){
        let data = {
          name:this.accountid,
          work_id:this.myid
        }
        this.$http({
          method:'POST',
          url:'http://120.76.137.157:8887/work_admin/change_name/',
          body:data,
          headers:{
            'Authorization':sessionStorage.getItem('token')
          }
        }).then( res => {
          this.msg = res.body.msg;
          this.show = true;
          if(res.body.status == '201'){
            //成功逻辑'
            this.goout();
            this.getmsg(this.current,'4');
          }
        }, err => {
          this.msg = '网络链接失败,请稍后再试';
          this.show = true;
        })
      },//确定更换管理员
      goout(){
        this.accountid = '';
        this.custorm = false;
      },//关闭更换管理员弹框
      operateopen(type,tbm){
        this.type = type;
        this.operatenow = tbm.level;
        this.workid = tbm.id;
        switch(type){
          case 'upgrade':
                this.operatemsg = '确定升级'+tbm.work_name+'工作室？';
                break;
          case 'degrade':
                this.operatemsg = '确定降级'+tbm.work_name+'工作室？';
                break;
          case 'dissolve':
                this.operatemsg = '确定解散'+tbm.work_name+'工作室？';
                break;
          default:
                break;
        }
        this.operatebox = true;
      },//打开操作框
      operateclose(){
        this.operatebox = false;
        this.operatemsg = '';
        this.type = '';
      },//关闭操作框
      operateok(){
        if(this.type === 'dissolve'){
          this.$http({
            method:'DELETE',
            url:'http://120.76.137.157:8887/work_admin/del_studio/',
            body:{
              work_id:this.workid
            },
            headers:{
              'Authorization':sessionStorage.getItem('token')
            }
          }).then( res => {
            this.msg = res.body.msg;
            this.show = true;
            if(res.body.status == '204'){
              this.type = '';
              this.operatenow = '';
              this.workid = '';
              this.operatebox = false;
              this.total = 0;
              this.current = 1;
              if(this.val == '0'){
                this.getmsg('1','4');
              }
              if(this.val == '1'){
                this.getmsg('1','5');
              }
              if(this.val == '2'){
                this.getmsg('1','6');
              }
              if(this.val == '3'){
                this.getworld(this.search,'1');
              }
            }
          },err => {
              this.msg = '网络链接失败,请稍后再试';
              this.show = true;
          })
        }else if(this.type === 'upgrade'){
          if(this.operatenow == '3'){
            this.msg = '分公司为当前最高等级无法升级';
            this.operatebox = false;
            this.show = true;
            return;
          }
          this.$http({
            method:'PUT',
            url:'http://120.76.137.157:8887/work_admin/set_level/',
            body:{
              work_id:this.workid,
              level:this.operatenow+1
            },
            headers:{
              'Authorization':sessionStorage.getItem('token')
            }
          }).then( res => {
            this.msg = res.body.msg;
            this.show = true;
            if(res.body.status == '201'){
              this.type = '';
              this.operatenow = '';
              this.workid = '';
              this.operatebox = false;
              this.total = 0;
              this.current = 1;
              if(this.val == '0'){
                this.getmsg('1','4');
              }
              if(this.val == '1'){
                this.getmsg('1','5');
              }
              if(this.val == '2'){
                this.getmsg('1','6');
              }
              if(this.val == '3'){
                this.getworld(this.search,'1');
              }
            }
          }, err => {
              this.msg = '网络链接失败,请稍后再试';
              this.show = true;
          })


        }else{
          if(this.operatenow == '1'){
            this.msg = '工作室为当前最低等级无法降级';
            this.operatebox = false;
            this.show = true;
            return;
          }
          this.$http({
            method:'PUT',
            url:'http://120.76.137.157:8887/work_admin/set_level/',
            body:{
              work_id:this.workid,
              level:this.operatenow - 1
            },
            headers:{
              'Authorization':sessionStorage.getItem('token')
            }
          }).then(res => {
            this.msg = res.body.msg;
            this.show = true;
              if(res.body.status == '201'){
                this.type = '';
                this.operatenow = '';
                this.workid = '';
                this.operatebox = false;
                this.total = 0;
                this.current = 1;
                if(this.val == '0'){
                  this.getmsg('1','4');
                }
                if(this.val == '1'){
                  this.getmsg('1','5');
                }
                if(this.val == '2'){
                  this.getmsg('1','6');
                }
                if(this.val == '3'){
                  this.getworld(this.search,'1');
                }
              }
            }, err => {
                this.msg = '网络链接失败,请稍后再试';
                this.show = true;
            })
        }

      },//确定升级等
      getdtmsg(){
        this.$http({
          method:'GET',
          url:'',
          params:{

          }
        }).then(res => {

        }, err => {

        })
      },//获取业绩
      getworld:function(data,page){
        this.$http({
          method:'GET',
          url:'http://120.76.137.157:8887/work_admin/get_all_user/',
          params:{
            get_type:'search',
            search_type:'4',
            word:data,
            page:page
          },
          headers:{
            'Authorization':sessionStorage.getItem('token')
          }
        }).then( res => {
          if(res.body.status == '200'){
          this.tbmsg = res.body.user_list;
          this.total = res.body.page_info.count;
          var scoredata = res.body.score_list;
          if(scoredata.length > 0){
            for(var i in scoredata){
              for(var j in this.tbmsg){
                if(this.tbmsg[j].id == scoredata[i].id ){
                  this.tbmsg[j].score = scoredata[i].score
                }
              }
            }
          }
        }
      }, err => {
          this.msg = '网络链接失败请稍候再试';
          this.show = true;
        })
      },//关键字搜索的函数
      getmsg(page,type){
        this.$http({
          method:'GET',
          url:'http://120.76.137.157:8887/work_admin/get_all_user/',
          params:{
            page:page,
            get_type:type
          },
          headers:{
            'Authorization':sessionStorage.getItem('token')
          }
        }).then( res => {
          if(res.body.status == '200'){
            this.tbmsg = res.body.user_list;
            this.total = res.body.page_info.count;
            var scoredata = res.body.score_list;
            if(scoredata.length > 0){
              for(var i in scoredata){
                for(var j in this.tbmsg){
                  if(this.tbmsg[j].id == scoredata[i].id ){
                    this.tbmsg[j].score = scoredata[i].score
                  }
                }
              }
            }
          }
        }, res => {
          this.msg = '网络链接失败,请稍后再试';
          this.show = true;
        })
      }//获取当前页面的信息
    },
    watch:{
      '$route':'getmsg'
    },
    created(){
      this.getmsg('1','4');
    }

  }
</script>
<style scoped>

  .mm{
    text-align:left;
  }
  .detailall{
    height:72px;
    line-height:36px;
    font-size:20px;
    font-weight:bold;
    text-align:left;
  }
  .workaccount-paging1{
    margin-bottom:20px;
  }
  .h150{
    margin-top:10px;
  }
  .workaccount-button{
    margin-top:20px;
    margin-left:25px;
    margin-bottom:34px;
  }
  .workaccount-search .workaccount-button:nth-of-type(3){
    margin-right:5rem;
  }
  .wid150{
    width:150px !important;
  }
  .redmark{
    color:red !important;
  }
  .disla{
    white-space:nowrap !important;
  }
  .dtback{
    width:100%;
    overflow:hidden;
    padding:.5rem 2rem;
  }
  .custormbox{
    width:400px;
    height:200px;
    background:#fcfcfc;
    border:1px solid #ccc;
    position:absolute;
    top:50%;
    left:0;
    left:50%;
    bottom:0;
    margin-left:-200px;
    margin-top:-100px;
  }
  .custormbtn{
    width:100%;
    overflow:hidden;
    text-align:center;
    padding-left:160px;
  }
  .vr9-title{
    width:100%;
    height:40px;
    background:#333;
    margin-bottom:40px;
    text-align:center;
    color:#fff;
    line-height:40px;
    font-size:17px;
    position:relative;
  }
  .vr9-title .l{
    width:400px;
    text-align:center;
    position:absolute;
    left:50%;
    margin-left:-200px;
    height:100%;
  }
  .vr9-title .r{
    cursor:pointer;
    position:relative;
    right:0;
    z-index:1;
    height:100%;
    width:30px;
  }
  .vr9number{
    width:100%;
    height:30px;
    line-height:30px;
  }
  .vr9number div{
    height:100%;
  }
  .vr9number div:nth-child(1){
    width:150px;
    text-align:right;
  }
  .vr9number div:nth-child(2){
    width:170px;
    text-align:right;
    margin-right:8px;
    border:1px solid #ccc;
  }
  .vr9input{
    width:100%;
    height:100%;
    outline:none;
  }
  .bt{
    background:transparent;
    color:#06c;
    border:none;
    cursor:pointer;
  }

  .income-status{
    width:150px !important;
    display:inline-block;
  }
  .income-status .mu-select-field{
    top:11px;
  }
  #assessment{
    width:100%;
    height:100%;
    position:relative;
  }
  .header{
    width:100%;
    height:2.2rem;
    background:#cbcbcb;
    line-height:2.2rem;
    text-align:left;
    font-size:.85rem;
    padding-left:2rem;
  }
  .workaccount-search{
    width:100%;
    padding-left:2rem;
    text-align:left;
  }
  .workaccount-search div{
    width:256px;
    display:inline-block;
    padding-left:.2rem;
  }
  .workaccount-tb{
    width:100%;
    padding:0 44px;
    overflow:hidden;
  }
  .workaccount-tbe{
    width:100%;
    overflow:hidden;
  }
  .workaccount-th{
    font-size:16px;
  }
  .workaccount-td{
    font-size:14px;
  }
  .workaccount-paging{
    margin-top:12px;
    padding-right:44px;
  }
  .workaccount-paging-box{
    justify-content:flex-end;
  }
  .mr22{
    margin-bottom:22px;
  }
  .mr22 span{
    margin-left:22px;
  }
  .srtext{
    color:red;
  }
  .pd50{
    padding-left:100px;
  }
  .detail{
    position:absolute;
    width:100%;
    /*height:100%;*/
    overflow:hidden;
    background:#fcfcfc;
    left:0;
    top:0;
    z-index:3;
    padding-bottom:22px;
  }
  .detail .header{
  }

  /*注册页面的*/
  *{
    box-sizing:border-box;
  }
  img{
    display:block;
    border:0;
  }
  ul{
    float:right;
    list-style:none;
    width:93%;
    padding:0;
    margin:0;
  }
  .addworkaccount_box{
    overflow:hidden;
    padding:0 2rem 2rem 2rem;
  }
  .addworkaccount_demo{
    width:100%;
    overflow:hidden;
  }
  .line{
    height:1px;
    width:100%;
    background:#999999;
    box-shadow:0 0 1px rgba(0, 0, 0, .5);
    clear: both;
    margin-bottom:1rem;
  }
  .addworkaccount_left{
    text-align:right;
    min-width:13%;
    margin-right:1rem;
  }
  .addworkaccount_left,.addworkaccount_right{
    margin-bottom:1rem;
    height:1.3rem;
    line-height:1.3rem;
    overflow:auto;
    text-align:left;
  }
  .addworkaccount_right{
    width:50%;
    border:2px solid #888;
  }
  input{
    border:none;
    width:100%;
    height:100%;
    float:left;
    outline:none;
  }
  .addworkaccount_right:hover{
    border-color:deepskyblue;
  }
  .addworkaccount_img{
    width:80%;
    overflow:hidden;
    float:left;
    text-align:left;
    padding:.1rem;
  }
  .face_img_box{
    margin-top:.5rem;
    width:100%;
    overflow:hidden;
  }
  .face_img{
    width:45%;
    height:8rem;
    border:1px solid #ccc;
  }
  .face_img img{
    width:100%;
    height:100%;
  }
  .face_text{
    width:55%;
  }
  .face_text span{
    width:.4rem;
    height:.4rem;
    border-radius:50%;
    background:black;
    display:inline-block;
    margin-right:.2rem;
  }
  .filebutton{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    opacity: 0;
  }
  .regs_btn{
    margin-left:10%;
    margin-top:1rem;
    border-radius:.3rem;
    font-size:.8rem;
    transform:scale(1.1,.8);
  }
  .mar1{
    margin-top:.5rem;
  }
  .noborder{
    border:none !important;
    height:4rem;
    text-algin:left !important;
    margin-bottom:0 !important;
  }
  .choose{
    width:30% !important;
    margin:0 1%;
  }
  .marl0{
    margin-left:0 !important;
  }
  .col-text{
    font-size:.8rem;
    margin-left:1rem;
  }
  .rjst-btn{
    margin-top:2rem;
    width:12rem !important;
    border-radius:.5rem;
    display:block;
    margin-left:13%;
    transform:translateX(1rem);
  }
  .demobt{
    width:100%;
    overflow:hidden;
  }
  /*解决方案*/
</style>
<style>
  .btmar .mu-icon{
    margin-top:-3px;
  }
</style>

