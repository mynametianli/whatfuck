//jquery.noConflict()
var pageIn=0;
var hotData={};
var vipHadata;
$(document).on("pageInit", function(e, pageId, $page) {
    //获取cookie 方法
    function getCookie(c_name)
    {
        if (document.cookie.length>0)
        {
            c_start=document.cookie.indexOf(c_name + "=")
            if (c_start!=-1)
            {
                c_start=c_start + c_name.length+1
                c_end=document.cookie.indexOf(";",c_start)
                if (c_end==-1) c_end=document.cookie.length
                return unescape(document.cookie.substring(c_start,c_end))
            }
        }
        return ""
    }
    if(pageId == "qr") {
        debugger
        var code= getCookie("twoCode");
        $("#twocode").attr("src",code);
        function is_weixin(){
            var ua = navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i)=="micromessenger") {
                return true;
            } else {
                return false;
            }
        }
    };
    if(pageId=="ruIndex"){
        indexInit();
    };
    if(pageId=="con_index"){
        //debugger
    };
    //用户信息页
    if(pageId=="userInfo"){
        var code= getCookie("authCode");
        var sexdata={
            "M":"男",
            "F":"女",
            "N":"未知"
        }
        $.ajax({
            type:"get",
            url:"http://192.168.3.220:8082/conference/person_info/"+code+"/",
            success: function (res) {
                debugger
                var opt=$("#userInfo").find(".my_sex option")
                for(var i=0;i<opt.length;i++){
                    if(opt[i].value==res.sex){
                        $(opt[i]).attr("checked","true");
                    }
                }
                $("#userInfo").find(".my_company").val(res.company);
                $("#userInfo").find(".my_name").val(res.name);
                $("#userInfo").find(".my_phone").val(res.phone);
                //$("#userInfo").find(".my_name").val(res.name);
            },
            error:function(res){

            }
        })
    }
    //用户头像
    if(pageId=="myFace"){
        var code = getCookie("authCode");
        $("#selectImg").change(function(event){
            var file = event.target.files[0], url = null, name = file.name;
            if (window.createObjectURL != undefined) { // basic
                url = window.createObjectURL(file);
            } else if (window.URL != undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(file);
            } else if (window.webkitURL != undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(file);
            }
            $("#srcImg").attr("src", url);
            $(event.target).attr("filename", name);
            if ($("#selectImg")[0].files.length == 0) {
                $.alert("请上传图片");
                return;
            }
            var epInfo = new FormData();
            epInfo.append('file', $('#selectImg')[0].files[0], $('#selectImg').attr('filename'));

            $.ajax({
                type:"post",
                url:"http://192.168.3.220:8082/conference/upload_face_icon/"+code+"/",
                data:epInfo,
                processData: false,
                contentType: false,
                success:function(res){
                    debugger
                },
                error:function(res){
                    debugger
                    $.alert("请求失败");
                }
            })
        });
    }
    //用户卡片
    if(pageId=="my_card"){
        var code= getCookie("twoCode");
        $("#my_card").find("img.ewm").attr("src",code);
    }
    //会议安排
    if(pageId=="meetArrange") {
        // 百度地图API功能
        var map = new BMap.Map("placeMap");    // 创建Map实例
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
        map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
        var code = getCookie("authCode");
        $.ajax({
            type:"get",
            url:"http://192.168.3.220:8082/conference/info/"+code+"/",
            success: function (res) {
                console.log(res)
                //res.group= JSON.parse(res.group);
                map.centerAndZoom("成都",11);
                debugger
                template.helper('dateFormat',function(date){
                    return date.substr(0,10);
                });
                var html=template('scrCon',res);
                document.getElementById('arrCon').innerHTML=html;
            },
            error:function(res){
            }
        })
    }
    //会议日程
    if(pageId=="mSchedule"){
        var code = getCookie("authCode");
        $.ajax({
            type:"get",
            url:"http://192.168.3.220:8082/conference/time_table/"+code+"/",
            success: function (res) {
                debugger
                console.log(res);
                template.helper('dateF',function(date){
                    return date.substr(0,5);
                })
                template.helper('datefor',function(date){
                    var arr=date.split('-');
                    var arrs=[];
                    for(var i=0;i<arr.length;i++){
                        arrs.push(arr[i]);
                        if(i==0){
                            arrs.push("年")
                        }
                        if(i==1){
                            arrs.push("月");
                        }
                        if(i==2){
                            arr.push("日")
                        }
                    }
                    return arrs.join(" ");
                })
                var data={};
                data.title=res[0].title;
                data.content=[];
                var timeData={}
                res.forEach(function(val){
                    if(!timeData[val.date]){
                        timeData[val.date]=[];
                        timeData[val.date].push(val);
                    }else{
                        timeData[val.date].push(val);
                    }
                });
                for(var attr in timeData){
                    var odata={};
                    odata.time=attr;
                    odata.cons=timeData[attr];
                    data.content.push(odata);
                }
                var html=template('scrCon',data);
                document.getElementById('schCon').innerHTML=html;
            },
            error:function(res){
            }
        })
    }
    if(pageId=="fenPlace"){
        var code = getCookie("authCode");
        var data={};
        data.content=[];
        getfen();
        function getfen(){
            $.ajax({
                type:"get",
                url:"http://192.168.3.220:8082/conference/meetingplace/"+code+"/",
                success: function (res) {
                    var selId=res.select;
                    data.title=res.conference_title;
                    data.time=res.start_time.substr(0,16);
                    var fenRes=res.meeting_list;
                    for(var i=0;i<fenRes.length;i++){
                        getMeet(fenRes[i],fenRes.length,selId);
                    }
                    //console.log(fenRes);
                },
                error:function(res){
                    $.alert("获取失败");
                }
            });
        }
        function getMeet(tit,total,checkid){
            $.ajax({
                type:"get",
                url:"http://192.168.3.220:8082/conference/time_table/"+code+"/?meeting_id="+tit.id,
                success: function (res) {
                    var arr=data.content;
                    arr.push(tit);
                    arr[arr.length-1].Arrange=res;
                    if(arr.length==total){
                        data.content.sort(function(a,b){
                            if (a.id > b.id) {
                                return 1;
                            }
                            if (a.id < b.id) {
                                return -1;
                            }
                            return 0;
                        })
                        template.helper('dateF',function(date){
                            return date.substr(0,5);
                        })
                        var html=template('scrCon',data);
                        document.getElementById('fenCon').innerHTML=html;
                        $("#meet"+checkid).attr("checked",true);
                    }
                },
                error:function(res){
                    $.alert("获取失败");
                }
            })
        };
        $("#btnSubmit").click(function(){
            var id=$('input[name="my_radio"]:checked').attr("meetid")
            if(!id){
                $.alert("请选择会议");
                return;
            }
            $.ajax({
                type:"post",
                url:"http://192.168.3.220:8082/conference/meetingplacechoose/"+code+"/",
                data: JSON.stringify({"meetingplace":id}),
                success: function (res) {
                    if(res.result=="OK"){
                        $.alert("提交成功");
                        getfen();
                    }
                },
                error:function(res){
                    $.alert("提交失败");
                }
            })
        })
    }
    if(pageId=="mainSpeaker"){
        //var data = {
        //    content: [{name:"122",id:"10"},{name:"122",id:"10"},{name:"122",id:"10"},{name:"122",id:"10"},{name:"122",id:"10"}]
        //};
        //var html = template('realData',data);
        //document.getElementById('speakerCon').innerHTML = html;

        var code = getCookie("authCode");
        $.ajax({
            type:"get",
            url:"http://192.168.3.220:8082/conference/lecturer/"+code+"/",
            success: function (res) {
                var data={}
                data.content=res;
                var html = template('realData',data);
                document.getElementById('speakerCon').innerHTML = html;
                //console.log(res);
            },
            error:function(res){
            }
        })
    }
    if(pageId=="speakerInfo"){
        var code = getCookie("authCode");
        var Id = location.href.split("?")[1];
        $.ajax({
            type:"get",
            url:"http://192.168.3.220:8082/conference/lecturer/"+code+"/?id="+Id,
            success: function (res) {
                debugger
                var html = template('scrCon',res);
                document.getElementById('infoCon').innerHTML=html;
            },
            error:function(res){
            }
        })
    }
    if(pageId=="askContent"){
        var code = getCookie("authCode");
        $("#askBtn").click(function(){
            var cons=$("textarea").val().trim();
            debugger
            $.ajax({
                type:"post",
                url:"http://192.168.3.220:8082/conference/question/"+code+"/",
                data:'{"question":"'+cons+'"}',
                success:function(res){
                    if(res.result=="OK"){
                        $.alert("提交成功");
                        $("textarea").val("");
                    }
                },
                error:function(res){
                    $.alert("提交失败");
                }
            })
        });
    }
    //投票
    if(pageId=="voteCon"){
        var code = getCookie("authCode");
        $.ajax({
            type:"get",
            url:"http://192.168.3.220:8082/conference/lecturer/"+code+"/",
            success: function (res) {
                var data={}
                data.content=res;
                var html = template('scrvote',data);
                document.getElementById('vCon').innerHTML = html;
                getVote();
            },
            error:function(res){
            }
        })
        function getVote(){
            $.ajax({
                type:"get",
                url:"http://192.168.3.220:8082/conference/vote/"+code+"/",
                success:function(res){
                    if(!res.vote){
                        $("#voteSubmit").removeAttr("disabled");
                        $("#voteSubmit").addClass("button-success");
                        $("#voteSubmit").removeClass("disabled")
                    }else{
                        var arr=res.vote.split(",");
                        $("#checkBox"+arr[0]).attr("checked","true");
                        $("#checkBox"+arr[1]).attr("checked","true");
                        $("#voteSubmit").removeClass("button-success");
                        $("#voteSubmit").addClass("disabled")
                        $("#voteSubmit").attr("disabled","disabled");
                    }
                },
                error:function(res){
                    $.alert("获取失败")
                }
            });
        }

        $("#voteSubmit").click(function(){
            var votes=$("#vCon").find("input:checked");
            var arr=[];
            debugger
            if(votes.length!=2){
                $.alert("请选择两位投票");
                return;
            }else{
                arr.push($(votes[0]).val());
                arr.push($(votes[1]).val());
            }
            $.ajax({
                type:"post",
                url:"http://192.168.3.220:8082/conference/vote/"+code+"/",
                data:JSON.stringify(arr),
                success:function(res){
                    if(res.result=="OK"){
                        $.alert("提交成功");
                        location.reload();
                    }
                },
                error:function(res){
                    $.alert("ouou");
                }
            })
        })
    }
    if(pageId=="suggestCon"){
        var code = getCookie("authCode");
        //提交意见反馈
        $("#sugSubmit").click(function(){
            var datas={
                "cm1":$("input[name='traffic']:checked").val(),
                "cm2":$("input[name='resturant']:checked").val(),
                "cm3":$("input[name='sleep']:checked").val(),
                "cm4":$("input[name='lecture']:checked").val(),
                "cm5":$("input[name='content']:checked").val(),
                "cm6":$("#mainBody textarea").val().trim(),
                "cm7":$("#suggest7 textarea").val().trim()
            }
            $.ajax({
                type:"post",
                url:"http://192.168.3.220:8082/conference/comment/"+code+"/",
                data:JSON.stringify(datas),
                success:function(res){
                    if(res.result=="OK"){
                        $.alert("提交成功");
                        getback();
                    }
                },
                error:function(res){

                }
           })
        });
        getback();
        //获取意见反馈
        function getback(){
            $.ajax({
                type:"get",
                url:"http://192.168.3.220:8082/conference/comment/"+code+"/",
                success:function(res){
                    if(res.result=="None"){
                        $("#sugSubmit").removeAttr('disabled');
                        $("#sugSubmit").removeClass("disabled");
                        $("#sugSubmit").addClass("button-success");
                        return;
                    }else{
                        renderOk($("input[name='traffic']"),res.cm1);
                        renderOk($("input[name='resturant']"),res.cm2);
                        renderOk($("input[name='sleep']"),res.cm3);
                        renderOk($("input[name='lecture']"),res.cm4);
                        renderOk($("input[name='content']"),res.cm5);
                        $("#mainBody textarea").val(res.cm6);
                        $("#suggest7 textarea").val(res.cm7);
                        $.alert("已提交");
                        $("#sugSubmit").attr('disabled','disabled');
                        $("#sugSubmit").addClass("disabled");
                        $("#sugSubmit").removeClass("button-success");
                    }
                },
                error:function(res){
                    $.alert("获取失败")
                }
            })
        }
        function renderOk(obj,num){
            for(var i=0;i<obj.length;i++){
                if($(obj[i]).val()==num){
                    $(obj[i]).attr("checked","true");
                }
            }
        }
    }
    //获取是否有vip
    var inps=$("#tab1 input");
    var inps1=$("#tab2 input");
    if(pageId=="vipHad"){
        debugger
        if(pageIn){
            $("#pickOne").addClass("active");
            $("#tab1").addClass("active");
        }
        if(vipHadata.type==1){
            $(inps[0]).val(vipHadata.date);
            $(inps[1]).val(vipHadata.flight_number);
            $(inps[2]).val(vipHadata.telphone);
            $(inps[3]).val(vipHadata.remarks);
            $("#pickOne").addClass("active");
            $("#pickTwo").removeClass("active");
            $("#tab2").removeClass("active");
            $("#tab1").addClass("active");
        }else{
            $(inps1[0]).val(vipHadata.date);
            $(inps1[1]).val(vipHadata.train_number);
            $(inps1[2]).val(vipHadata.telphone);
            $(inps1[3]).val(vipHadata.remarks)
            $("#pickOne").removeClass("active");
            $("#pickTwo").addClass("active");
            $("#tab1").removeClass("active");
            $("#tab2").addClass("active");
        }
    }
    if(pageId=="vipNone"){
        var code = getCookie("authCode");
        if(!pageIn){
            $.ajax({
                type:"get",
                url:"http://192.168.3.220:8082/conference/vipappoint/"+code+"/",
                success:function(res){
                    if(res.result=="None"){
                        pageIn=1;
                    }else{
                        debugger
                        vipHadata=res;
                        $.router.load("#vipHad");
                    }
                },
                error:function(res){
                    $.alert("请求失败");
                }
            });
        }
        $("#toAddvip").click(function(){
            $.router.load("#vipHad");
        })
        $("#pickAir").click(function(){
            var data={};
            data.type=1;
            data.date=$(inps1[0]).val().trim();
            data.flight_number=$(inps1[1]).val().trim();
            data.telphone=$(inps1[2]).val().trim();
            data.remarks=$(inps1[3]).val().trim();
            $.ajax({
                type:'post',
                url:"http://192.168.3.220:8082/conference/vipappoint/"+code+"/",
                data:JSON.stringify(data),
                success:function(res){
                    if(res.result=="OK"){
                        $.router.load("#vipNone");
                    }
                },
                error:function(res){
                    $.alert("提交失败");
                }
            })
        });
        $("#pickCar").click(function(){
            var data={};
            data.type=2;
            debugger
            data.date=$(inps[0]).val().trim();
            data.train_number=$(inps[1]).val().trim();
            data.telphone=$(inps[2]).val().trim();
            data.remarks=$(inps[3]).val().trim();
            $.ajax({
                type:'post',
                url:"http://192.168.3.220:8082/conference/vipappoint/"+code+"/",
                data:JSON.stringify(data),
                success:function(res){
                    if(res.result=="OK"){
                        $.router.load("#vipNone");
                    }
                },
                error:function(res){
                    $.alert("提交失败");
                }
            })
        });
    }
    //酒店预订
    if(pageId=="orderRoom"){
        var code = getCookie("authCode");
        $.ajax({
            type:"get",
            url:"http://192.168.3.220:8082/conference/hotel/"+code+"/",
            success:function(res){
                console.log(res);
                debugger
                hotData.content=res;
                template.helper("showTrue",function(data){
                    return data?"show":"none";
                })
                var html = template('scrjdyd',hotData);
                document.getElementById('hotCon').innerHTML = html;
            },
            error:function(res){
            }
        })
    }
    //酒店详情
    if(pageId=="hotInfo"){
        var code = getCookie("authCode");
        var roomCode = location.href.split("?")[1];
        var roomL={
            "1":"经济间",
            "2":"商务标间",
            "3":"普通标准间",
            "4":"高级间",
            "5":"豪华间"
        }
        var badL={
            "1":"大床",
            "2":"双人床",
            "3":"单人床",
            "4":"大/双",
            "0":"/"
        }
        $.ajax({
            type:"get",
            url:"http://192.168.3.220:8082/conference/hotel/"+code+"/?hotel_id="+roomCode,
            success:function(res){
                debugger
                console.log(res);
                res.hotCode=roomCode;
                template.helper("forRoom",function(data){
                    return roomL[data];
                });
                template.helper("forBad",function(data){
                    return badL[data];
                });
                template.helper("forWindow",function(data){
                    return data?"有":"无";
                })
                var html = template('scrinfo',res);
                document.getElementById('infoCon').innerHTML = html;
            },
            error:function(res){
                $.alert("无数据");
            }
        })
    }
    //酒店地址
    if(pageId=="hotelPlace"){
        // 百度地图API功能
        var map = new BMap.Map("jdPlace");    // 创建Map实例
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
        map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
        var code = getCookie("authCode");
        var roomCode = location.href.split("?")[1];
        $.ajax({
            type:"get",
            url:"http://192.168.3.220:8082/conference/hotel/"+code+"/?hotel_id="+roomCode,
            success:function(res){
                debugger
                console.log(res);
                var Eo=parseFloat(res.map_dot.split(",")[0]);
                var No=parseFloat(res.map_dot.split(",")[1]);
                var cons=res.hotel_name+" "+res.hotel_address;
                $(".padtb").html(cons)
                map.enableScrollWheelZoom(true);
                var new_point = new BMap.Point(Eo,No);
                var marker = new BMap.Marker(new_point);  // 创建标注
                map.addOverlay(marker);              // 将标注添加到地图中
                map.panTo(new_point);

            },
            error:function(res){
                $.alert("无数据");
            }
        })
    }
    //填写订单
    if(pageId=="orderWrite"){
        var code = getCookie("authCode");
        var datas=location.href.split("?")[1];
        var arrDatas=datas.split("&");
        var room=decodeURI(arrDatas[0]);
        var fee=parseInt(arrDatas[1]);
        var maxNum=parseInt(arrDatas[2]);
        var roomId=arrDatas[3];
        var startTime=arrDatas[4];
        var endTime=arrDatas[5];
        var uName=getCookie("userName");
        var user_name= decodeURI(uName);
        var user_phone=getCookie("userPhone");
        $("#roomType").html(room);
        $("#roomMoeny").html(fee);
        $(".ordername").val(user_name);
        $(".ordertel").val(user_phone);
        debugger
        $("input.timestart").calendar({
            minDate:startTime,
            maxDate:endTime
        });
        $("input.timeend").calendar({
            minDate:startTime,
            maxDate:endTime
        })
        $("input.addrooms").click(function(){
            var num=$("#adultNum").val();
            if(num<maxNum){
                num++
            }else{
                return;
            }
            $("#adultNum").val(num);
            $("#roomMoeny").html(fee*num);
        });
        $("input.minrooms").click(function(){
            var num=$("#adultNum").val();
            if(num>1){
                num--
            }else{
                return;
            }
            $("#adultNum").val(num);
            $("#roomMoeny").html(fee*num);
        });
        $("#orderSubmit").click(function(){
            var orderDatas={
                "oder_date_start":$(".timestart").val(),
                "oder_date_end":$(".timeend").val(),
                "room_id":roomId,
                "room_amount":parseInt($("#adultNum").val()),
                "name":$(".ordername").val(),
                "telphone":$(".ordertel").val(),
            }
            $.ajax({
                type:"post",
                url:"http://192.168.3.220:8082/conference/hotel_order/"+code+"/",
                data:JSON.stringify(orderDatas),
                success:function(res){
                    debugger
                    if(res.result=="OK"){
                        $.router.load("tianxieddcg.html?"+res.order_id);
                    }
                },
                error:function(res){
                }
            })
        })
    }
    //订单列表
    if(pageId=="myOrder"){
        debugger
        var code = getCookie("authCode");
        $.ajax({
            type:"get",
            url:"http://192.168.3.220:8082/conference/hotel_order/"+code+"/",
            success:function(res){
                debugger
                var data={};
                data.content=res;
                var html = template('scrorders',data);
                document.getElementById('ordersCon').innerHTML = html;

            },
            error:function(res){
                $.alert("请求失败");
            }
        })
    }
    //订单详情
    if(pageId=="orderList"){
        var code = getCookie("authCode");
        var orderId=location.href.split("?")[1];
        var roomL={
            "1":"经济间",
            "2":"商务标间",
            "3":"普通标准间",
            "4":"高级间",
            "5":"豪华间"
        }
        debugger
        $.ajax({
            type:"get",
            url:"http://192.168.3.220:8082/conference/hotel_order/"+code+"/?order_id="+orderId,
            success:function(res){
                debugger
                template.helper("forRoom",function(data){
                    return roomL[data];
                });
                var html = template('scrlist',res[0]);
                document.getElementById('listCon').innerHTML = html;
            },
            error:function(res){
                $.alert("请求失败");
            }
        })
    }
});
$.init();