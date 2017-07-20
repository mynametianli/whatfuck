<template>
    <div id="rewardrule">
          <div class="header">奖励规则设置</div>
          <div class="mysilder">
           <!-- {{value1}}-->
            <mu-table :showCheckbox="showcheck" ref="table" class="rewardtable">
              <mu-thead>
                <mu-tr>
                  <mu-th v-for="(head,index) in tablehead" :key="index">{{head}}</mu-th>
                </mu-tr>
              </mu-thead>
              <mu-tbody>
                <mu-tr v-for="(data,index) in tabledata" :key="index">
                  <mu-td v-for="(dt,inx) in data" :key="inx">{{dt}}</mu-td>
                  <mu-td>
                    <mu-raised-button label="修改比例" class="sizebt" primary @click="opendialog(data)"/>
                  </mu-td>
                </mu-tr>
              </mu-tbody>
            </mu-table>
          </div>
          <mu-dialog :open="dialog" :title="title" @close="close" dialogClass="dialogbox">
            <div class="dgcontent">
              <div>报单返还&ensp;&ensp;{{custormrestore+'%'}}</div>
              <div><mu-slider v-model="custormrestore" :step="1" :disabled = 'sliderban' class="demoslider"/></div>
              <div>现金奖励&ensp;&ensp;{{cashreward+'%'}}</div>
              <div><mu-slider v-model="cashreward" :step="1" :disabled = 'sliderban' class="demoslider"/></div>
            </div>
            <mu-flat-button slot="actions" @click="close" primary label="取消"/>
            <mu-flat-button slot="actions" primary @click="setreward" label="确定"/>
          </mu-dialog>
          <mu-dialog :open="show" title="温馨提示">
            {{msg}}
            <mu-flat-button label="确定" slot="actions" primary @click="closeshow"/>
          </mu-dialog>
    </div>
</template>
<script>
  export default{
    name:'rewardrule',
    data(){
      return {
        showcheck:false,
        tablehead:['等级','报单返还比例','现金奖励比例','操作'],
        tabledata:[],
        dialog:false,
        title:'',
        sliderban:false,
        cashreward:0,
        custormrestore:0,
        show:false,
        msg:'',
        lv:'',
        info:''

      }
    },
    methods:{
      closeshow(){
        this.show = false;
      },
      close(){
        this.dialog = false;
      },
      opendialog(data){
        this.cashreward = parseInt(data.cash);
        this.custormrestore = parseInt(data.restore);
        this.lv = data.lv;
        this.title = data.lv + '奖励规则设置';
        this.dialog = true;
      },
      setreward(){
        var back = this.custormrestore/100;
        var reward = this.cashreward/100;
        var args = [];
        switch(this.lv){
          case '工作室':
                if(this.info.asset_back.workshop != back && this.info.asset_reward.workshop == reward){
                  this.info.asset_back.workshop = back;
                  args = [{'location':'asset_back', content:this.info.asset_back}]
                }
                if(this.info.asset_reward.workshop != reward && this.info.asset_back.workshop == back ){
                  this.info.asset_reward.workshop = reward;
                  args = [{'location':'asset_reward', content:this.info.asset_reward}]
                }
                if(this.info.asset_reward.workshop != reward && this.info.asset_back.workshop != back){
                  this.info.asset_back.workshop = back;
                  this.info.asset_reward.workshop = reward;
                  args = [{'location':'asset_back', content:this.info.asset_back},{'location':'asset_reward', content:this.info.asset_reward}]
                }
                break;
          case '运营中心':
                if(this.info.asset_back.center != back && this.info.asset_reward.center == reward){
                  this.info.asset_back.center = back;
                  args = [{'location':'asset_back', content:this.info.asset_back}]
                }
                if(this.info.asset_reward.center != reward && this.info.asset_back.center == back ){
                  this.info.asset_reward.center = reward;
                  args = [{'location':'asset_reward', content:this.info.asset_reward}]
                }
                if(this.info.asset_reward.center != reward && this.info.asset_back.center != back){
                  this.info.asset_back.center = back;
                  this.info.asset_reward.center = reward;
                  args = [{'location':'asset_back', content:this.info.asset_back},{'location':'asset_reward', content:this.info.asset_reward}]
                }
                break;
          case '分公司':
                if(this.info.asset_back.branch != back && this.info.asset_reward.branch == reward){
                  this.info.asset_back.branch = back;
                  args = [{'location':'asset_back', content:this.info.asset_back}]
                }
                if(this.info.asset_reward.branch != reward && this.info.asset_back.branch == back ){
                  this.info.asset_reward.branch = reward;
                  args = [{'location':'asset_reward', content:this.info.asset_reward}]
                }
                if(this.info.asset_reward.branch != reward && this.info.asset_back.branch != back){
                  this.info.asset_back.branch = back;
                  this.info.asset_reward.branch = reward;
                  args = [{'location':'asset_back', content:this.info.asset_back},{'location':'asset_reward', content:this.info.asset_reward}]
                }
                break;
          default:
                break;
        }
        var data = {args:args}
        this.$http({
          method:'PUT',
          url:'http://120.76.137.157:8887/work_admin/workshop_args/',
          body:data,
          headers:{
            'Authorization':sessionStorage.getItem('token')
          }
        }).then( res => {
            this.msg = res.body.msg;
            this.close();
            this.show = true;
            if(res.body.status == '200'){
              this.getmsg();
            }
        }, err => {
            this.close();
            this.msg = '网络链接失败请稍后再试';
            this.show = true;
        })
      },
      getmsg(){
        this.$http({
          type:'GET',
          url:'http://120.76.137.157:8887/work_admin/workshop_args/',
          headers:{
            'Authorization':sessionStorage.getItem('token')
          }
        }).then(res => {
          if(res.body.status == '200'){
          this.tabledata = [{lv:'工作室',restore:this.accMul(res.body.info.asset_back.workshop,'100.0')+'%',cash:this.accMul(res.body.info.asset_reward.workshop,'100.0')+'%'},{lv:'运营中心',restore:this.accMul(res.body.info.asset_back.center,'100.0')+'%',cash:this.accMul(res.body.info.asset_reward.center,'100.0')+'%'},{lv:'分公司',restore:this.accMul(res.body.info.asset_back.branch,'100.0')+'%',cash:this.accMul(res.body.info.asset_reward.branch,'100.0')+'%'}];
          this.info = res.body.info;
        }else{
          this.msg = res.body.msg;
          this.show = true;
        }

      },err =>{
          this.msg = '网络链接失败请稍后再试';
          this.show = true;
        })
      },
      accMul(arg1, arg2){
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
          m += s1.split(".")[1].length;
          m += s2.split(".")[1].length;
          return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
      }
     /* accDiv(arg1, arg2) {
        var t1 = 0, t2 = 0, r1, r2;
          t1 = arg1.toString().split(".")[1].length;
          t2 = arg2.toString().split(".")[1].length;
          r1 = Number(arg1.toString().replace(".", ""));
          r2 = Number(arg2.toString().replace(".", ""));
          return (r1 / r2) * pow(10, t2 - t1);
      }*/
    },
    created(){
      this.getmsg();
    }
  }
</script>
<style scoped>
  #rewardrule{
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
  .mysilder{
    height:calc(100% - 2.2rem);
    width:100%;
    padding:.5rem;
  }
  .rewardtable{
    border:1px solid #ccc;
  }
  .sizebt{
    width:30px;
    height:30px;
    line-height:30px;
  }
  .dgcontent{
    padding:.5rem;
  }
  .demoslider{
    margin-top:16px;
  }
</style>
<style>
  .dialogbox{
    width:400px !important;
    height:500px !important;
  }
</style>
