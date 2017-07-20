<template>
  <div id="rewardrules">
    <div class="header">智慧资产设置</div>
    <div class="mysilder">
      <!-- {{value1}}-->
      <mu-table :showCheckbox="showcheck" ref="table" class="rewardtable">
        <mu-thead>
          <mu-tr>
            <mu-th v-for="(head,index) in tablehead" :key="index">{{head}}</mu-th>
          </mu-tr>
        </mu-thead>
        <mu-tbody>
          <mu-tr v-for="(data,key,index) in tabledata" :key="index">
            <mu-td>{{key}}</mu-td>
            <mu-td>{{data}}</mu-td>
            <mu-td>
              <mu-raised-button label="修改金额" class="sizebt" primary @click="opendialog(key)"/>
            </mu-td>
          </mu-tr>
        </mu-tbody>
      </mu-table>
    </div>
    <mu-dialog :open="dialog" :title="title" @close="close" dialogClass="dialogbox">
      <div class="dgcontent">
        <mu-text-field hintText="请输入金额" labelFloat label="金额" v-model="cny" type="number"/>
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
    name:'rewardrules',
    data(){
      return {
        showcheck:false,
        tablehead:['智慧资产等级','CNY金额','操作'],
        tabledata:{},
        dialog:false,
        title:'',
        info:'',
        show:false,
        lv:'',
        msg:'',
        cny:''

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
        this.title = data + '智慧资产金额设置';
        this.lv = data;
        this.dialog = true;
      },
      setreward(){
        if(!this.cny){
          this.msg = '请输入金额';
          this.show = true;
          return;
        }
        switch(this.lv){
          case 'V1':
                if(this.cny){
                  this.info.V1 = parseInt(this.cny);
                }
                break;
          case 'V2':
            if(this.cny){
              this.info.V2 = parseInt(this.cny);
            }
            break;
          case 'V3':
            if(this.cny){
              this.info.V3 = parseInt(this.cny);
            }
            break;
        }
        var data = {args:[{'location':'asset_levels', content:this.info}]};
        this.$http({
          method:'PUT',
          url:'http://120.76.137.157:8887/work_admin/workshop_args/',
          body:data,
          headers:{
            'Authorization':sessionStorage.getItem('token')
          }
        }).then( res => {
            this.close();
            this.cny = '';
            this.msg = res.body.msg;
            this.show = true;
            if(res.body.status == '200'){
              this.getmsg();
            }
        }, err => {
            this.close();
            this.msg = '网络连接失败，请稍后再试';
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
          if(res.status == '200'){
          this.tabledata = {V1:res.body.info.asset_levels.V1,V2:res.body.info.asset_levels.V2,V3:res.body.info.asset_levels.V3,V4:res.body.info.asset_levels.V4};
          this.info = res.body.info.asset_levels;
        }else{
          this.msg = res.body.msg;
          this.show = true;
        }

      },err =>{
          this.msg = '网络链接失败请稍后再试';
          this.show = true;
        })
      }
    },
    created(){
      //return;
      this.getmsg();
    }
  }
</script>
<style scoped>
  #rewardrules{
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
