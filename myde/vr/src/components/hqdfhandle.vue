<template>
  <div id="hqdfhandle">
    <div class="header">工作室报单处理</div>
    <div class="dfhandle-search">
      <div class="">
        <mu-date-picker mode="landscape" hintText="报单开始日期" icon="today" label="报单开始日期" :maxDate="enddate" labelClass="search-title" v-model="startdate" class="l btmar"/>
        <mu-date-picker mode="landscape" hintText="报单结束日期" icon="today" label="报单结束日期" :minDate="startdate"  labelClass="search-title" v-model="enddate" class="l btmar"/>
        <mu-raised-button label="查询" class="dfhandle-button l loadmr" :backgroundColor="bgcolor" @click.stop="searchdate"/>
        <mu-raised-button label="刷新" class="dfhandle-button l loadmr" :backgroundColor="bgcolor" @click.stop="reloadthis"/>
      </div>
    </div>
    <div class="dfhandle-tb">
      <mu-table :showCheckbox="isshow" class="dfhandle-tbe">
        <mu-thead>
          <mu-tr>
            <mu-th class="dfhandle-th" v-for='(title,index) in tbtitle' :key="index">{{title}}</mu-th>
          </mu-tr>
        </mu-thead>
        <mu-tbody>
          <mu-tr v-for="(tbm,index) in tbmsg" :key="index">
            <!--<mu-td class="dfhandle-td" v-for="(tb,index) in tbm" :key="index">{{tb}}</mu-td>-->
            <mu-td class="dfhandle-td">{{tbm.user_info.work_name}}</mu-td>
            <mu-td class="dfhandle-td">{{tbm.user_info.mobile}}</mu-td>
            <mu-td class="dfhandle-td">{{tbm.mobile}}</mu-td>
            <mu-td class="dfhandle-td">{{JSON.parse(tbm.user_info.work_address.replace(/'/g,'"')).province + JSON.parse(tbm.user_info.work_address.replace(/'/g,'"')).city + JSON.parse(tbm.user_info.work_address.replace(/'/g,'"')).area}}</mu-td>
            <mu-td class="dfhandle-td">{{tbm.status == 0 ? '未拨币' : '已拨币'}}</mu-td>
            <mu-td>{{tbm.date}}</mu-td>
            <mu-td class="dfhandle-td">{{tbm.vr9_count}}</mu-td>
            <mu-td v-if="tbm.status == 0">
              <mu-flat-button label="立即拨币" @click="open(tbm)" color="blue"/>
            </mu-td>
            <mu-td v-if="tbm.status != 0">
              <mu-flat-button label="查看详情" @click="open(tbm)" color="blue"/>
            </mu-td>
<!--            <mu-td v-if="tbm.status == 0">
              <mu-flat-button label="申请提现" @click="open(tbm)" color="blue"/>
            </mu-td>
            <mu-td v-if="tbm.status == 1">
              <mu-flat-button label="查看详情" @click="open(tbm)" color="blue"/>
            </mu-td>
            <mu-td v-if="tbm.status == 2">
              <mu-flat-button label="查看详情" @click="open(tbm)" color="blue"/>
            </mu-td>-->
          </mu-tr>
        </mu-tbody>
      </mu-table>
    </div>
    <div class="dfhandle-paging" v-if="total > 10">
      <div class="showlists">总共{{total}}条记录，当前为第{{crtpg}}页，显示第{{(crtpg - 1) * 10+ 1}}条到第{{crtpg * 10 > total ? total : crtpg * 10}}条记录</div>
      <mu-pagination :total="total" :current="current" @pageChange="handleClick" class="dfhandle-paging-box">
      </mu-pagination>
    </div>
    <mu-dialog :open="dialog" title="拨币" titleClass="dg-title" actionsContainerClass	="dg-w">
     <!-- <div class="mr22">
        矿机类型：<span class="srtext">{{kgstyle}}</span>
      </div>
      <div class="mr22">
        矿机数量：<span class="srtext">{{kgnumber+'个'}}</span>
      </div>-->
      <div class="mr22 mr33">
        即将往<span class="redc">{{workname}}</span>工作室的交易宝账号<span class="redc">{{workwallet}}</span>拨<span class="redc">{{vrnumber}}</span>个VR9
        <!--拨币数量：<span class="srtext">{{vrnumber+'个'}}</span>-->
      </div>
      <div v-if="isshowpsd">
        <div class="mr22">请输入系统管理密码：</div>
        <div class="pd50">
          <div class="psdenter l" v-for="(i,index) in 6">
            <input class="l mypsd" type="password" maxlength="1" v-model="psdclk[index]" @keyup="getfocus(index,$event)">
          </div>
        </div>
      </div>
      <mu-raised-button slot="actions" @click="canceldg()" primary :label="labeltext" />
      <mu-raised-button slot="actions" primary @click="close()" label="立即拨币"  class="mrl20" v-show='bbshow' :disabled="btdis"/>
    </mu-dialog>
    <div>
      <mu-dialog :open="showtt" title="温馨提示">
        {{msgtt}}
        <mu-flat-button label="确定" slot="actions" primary @click="closett"/>
      </mu-dialog>
    </div>
    <!--      <mu-dialog :open="dialog" title="申请提现">
            这是一个简单的弹出框
            <mu-flat-button slot="actions" @click="close(0)" primary label="取消"/>
            <mu-flat-button slot="actions" primary @click="close(0)" label="确定"/>
          </mu-dialog>-->
  </div>
</template>
<script>
  export default{
    name:'hqdfhandle',
    data(){
      return{
        status:'0',
        startdate:'',
        enddate:'',
        bgcolor:'#337ab7',
        isshow:false,
        dialog:false,
        dialog1:false,
        btdis:false,
        total:0,
        current:1,
        size:10,
        vrnumber:'',
        kgstyle:'',
        kgnumber:'',
        isshowpsd:false,
        labeltext:'',
        bbshow:false,
        myid:'',
        activebt:0,
        myindex:1,
        psdclk:['','','','','',''],
        tbtitle:['工作室名称','联系电话','交易宝号','工作室地址','状态','报单时间','拨币数量（个）','操作'],
        tbmsg:[
        ],
        workname:'',
        workwallet:'',
        showtt:false,
        msgtt:'',
        crtpg:'1'
      }
    },
    methods:{
      closett:function(){
        this.showtt = false;
        this.msgtt = '';
      },
      searchdate:function(){
        if(!this.startdate){
          alert('请输入开始日期');
          return;
        }
        if(!this.enddate){
          alert('请输入结束日期');
          return;
        }
        this.activebt = 4;
        this.total = 0;
        this.current = 1;
        this.getdate(this.startdate,this.enddate,1);
      },
      getdate:function(startdate,enddate,page){
        this.$http({
          method:'GET',
          url:'http://120.76.137.157:8887/work_admin/get_declaration/?page='+page,
          params:{
            get_type:'search',
            start_time:startdate,
            stop_time:enddate
          },
          headers:{
            'Authorization':sessionStorage.getItem('token')
          }
        }).then( res => {
          if(res.body.status == '200'){
          this.tbmsg = res.body.declaration_list;
          this.total = res.body.page_info.count;
        }
      }, res => {

        })
      },
      getfocus:function(index,event){
        var input =  document.getElementsByClassName("mypsd");
        if(index < 5 && event.keyCode != '8'){
          input[index+1].focus();
        }
        if(index > 0 && event.keyCode == '8'){
          input[index-1].focus();
        }
        /*if((event.keyCode >= 48 && event.keyCode <= 57) ||(event.keyCode >=96 && event.keyCode <=105)){


         }else{

         }*/
      },
      close:function(){
        this.btdis = true;
        let data = {
          password:this.psdclk.join(''),
          declaration_id:this.myid
        }
        this.$http({
          method:'post',
          body:data,
          url:'http://120.76.137.157:8887/work_admin/appropriation/',
          headers:{
            'Authorization':sessionStorage.getItem('token')
          }
        }).then( res => {
          this.btdis = false;
          if(res.body.status == '200'){
            if(this.activebt == '4'){
              this.getdate(this.startdate,this.enddate,'1');
            }else{
              this.getdetail('1');
            }
            this.canceldg();
          }
          this.msgtt = res.body.msg;
          this.showtt = true;
      }, res => {
          this.btdis = false;
          this.msgtt = '网络链接失败';
          this.showtt = true;
        })
      },
      canceldg:function(){
        this.getmoney = '';
        this.isshowpsd = false;
        this.statustext = '';
        this.psdclk = ['','','','','',''];
        this.dialog = false;

      },
      open:function(tbm){
        this.dialog = true;
        this.myid = tbm.id;
        this.workname = tbm.user_info.work_name;
        this.workwallet = tbm.mobile;
        this.kgnumber = tbm.gcb_count;
        this.vrnumber = tbm.vr9_count;
        if(tbm.status == '0'){
          this.labeltext = '取消';
          this.isshowpsd = true;
          this.bbshow = true;
          setTimeout(function(){
            document.getElementsByClassName("mypsd")[0].focus();
          },1000);


        }
        if(tbm.status != '0'){
          this.bbshow = false;
          this.labeltext = '确定';
          this.isshowpsd = false;
        }
      },
      handleClick:function(newIndex){
        if(this.activebt == '4'){
          this.getdate(this.startdate,this.enddate,newIndex);
        }else{
          this.getdetail(newIndex);
        }
        this.crtpg = newIndex;
        //this.myindex = newIndex;
      },
      reloadthis:function(){
        this.crtpg = '1';
        this.activebt = 0;
        this.startdate = '';
        this.enddate = '';
        //this.myindex = 1;
        this.getdetail(1);
      },
      getdetail:function(page){
        this.$http({
          method:'GET',
          url:'http://120.76.137.157:8887/work_admin/get_declaration/?page='+page,
          headers:{
            'Authorization':sessionStorage.getItem('token')
          }
        }).then( res => {
          if(res.body.status == '200'){
          this.tbmsg = res.body.declaration_list;
          this.total = res.body.page_info.count;
        }
      }, res => {

        })
      }
    },
    beforeCreate:function(){
      this.$http({
        method:'GET',
        url:'http://120.76.137.157:8887/work_admin/get_declaration/?page=1',
        headers:{
          'Authorization':sessionStorage.getItem('token')
        }
      }).then( res => {
        if(res.body.status == '200'){
          this.tbmsg = res.body.declaration_list;
          this.total = res.body.page_info.count;
        }
      }, res => {

      })
    },
    mounted:function(){

    }
  }
</script>
<style scoped>
  .redc{
    color:red;
    margin-left:0 !important;
  }
  #hqdfhandle{
    width:100%;
    height:100%;
  }
  .header{
    width:100%;
    height:2.2rem;
    background:#cbcbcb;
    line-height:2.2rem;
    text-align:left;
    font-size:.85rem;
    padding-left:2rem;
    margin-bottom:12px;
  }
  .dfhandle-search{
    width:100%;
    padding-left:2rem;
    text-align:left;
  }
  .dfhandle-status{
    width:150px;
    display:inline-block;
    margin-left:22px;
  }
  .dfhandle-status .mu-select-field{
    top:11px;
  }
  .dfhandle-tb{
    width:100%;
    padding:0 44px;
    overflow:hidden;
  }
  .dfhandle-th{
    font-size:16px;
  }
  .dfhandle-td{
    font-size:14px;
  }
  .dfhandle-paging{
    margin-top:12px;
    padding-right:44px;
  }
  .dfhandle-paging-box{
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
  .psdenter{
    width:33px;
    height:33px;
    margin:0 10px;
    border:1px solid #ccc;
  }
  .psdenter input{
    border:none;
    outline:none;
    width:100%;
    height:100%;
    text-align:center;
    font-size:20px;
  }
  .pd50{
    padding-left:100px;
  }
</style>
<style>
  .search-title{
    font-size:20px;
  }
  .search-focus{
    color:red;
  }
  .dfhandle-button{
    margin-left:3rem !important;
  }
  .mu-th,.mu-td{
    text-align:center !important;
  }
  .dg-title{
    background:#dfdfdf;
    height:30px;
    margin-bottom:22px !important;
  }
  .dg-w{
    justify-content:center !important;
    padding-bottom:33px !important;
  }
  .mrl20{
    margin-left:60px !important;
  }
</style>
