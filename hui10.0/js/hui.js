$(function(){
// 变量
var n = 0;            //本页影片总数
var move = 0;         //起始ul位移量
var index = 0;
var plst = {};          //存入获取的数据
var albumList = $('.album-list');
var bodyCenter = $('.container')[0].getBoundingClientRect().width * 0.5; //视口中心
var  bstop = true;							   	   //可以进行下一个动画，没有动画进行中			
initialise(index);                             	   //初始化方法 


//Keydown 事件
$(document).keydown(function(event) {              //点击右键	
	if(bstop){
		if (event.keyCode == 39) {
			index++;
			console.log(n);
			index > n - 1 ? index = n - 1 : index; //index右边界
		}		
		if (event.keyCode == 37) {                 //单击左键
			index--;
			index < 0 ? index = 0 : index;         //index左边界
		}
		imgMove(index);							   //图片移动方法
		thisFilmInfo(index);					   //当前影片信息方法  
	} 	                            
}); 


//初始化方法
function initialise(index){  
	$.ajax({									//ajax获取线上数据
		type : "GET",
		url : "http://itv.video.ptqy.gitv.tv/jp/itv/plst/398131202/7/",
		dataType : "jsonp", 
		jsonp : "callback",
		data : {
			m : '136',
			isFree : '0',
			apkVersion : '5.1.50.35183',
			src : '76f90cbd92f94a2e925d83e8ccd22cb'
		}, 
        success : function(information){ 
        	plst = information.data.plst;  			//将数据存入全局变量
        	n = plst.length;    					//本页影片总数
			var list = "";      					//页面初始化，插入DOM元素获取数据                          
			for(i = 0; i < n; i++){
				var isVip = plst[i].payMark;       	//是VIP影片
				var isDubo = plst[i].isExclusive;	//是独播影片
				var albumVip = '';
				var albumDubo = '';
				var Url = '';
				isVip ?	albumVip = "album-vip" : albumVip = '';	           //添加VIP标签
				isDubo ? albumDubo = "album-dubo" : albumDubo = '';	       //添加独播标签
				plst[i].postImage == "" ? Url = plst[i].picUrl.replace('.jpg', '_260_360.jpg') : Url = plst[i].postImage.replace('.jpg','_354_490.jpg');		//优先使用海报图（354*490），如果海报图字段为空，就使用封面图（260 * 360）
				list += '<li class="album-item'+' '+ albumVip +' '+ albumDubo +'">' +      //添加标签类
				'<div class="film-img">' +
				'<img src='+ Url +' alt="">' +
				'</div>' +
				'<div class = "film-title">' + plst[i].contentName + '</div>' +
				'</li>'	                                      
			}
			albumList.html(list);                  		//一次性DOM注入
			albumList.css('width', (88+296*n)+'px');	//动态设置ul宽度,44两边的margin，每个li是296
			thisFilmInfo(0);                        	//起始默认焦点为第一个影片
    	}
	});   	
}
                           			
console.log(n);				
//图片移动方法
function imgMove(index){    				    //dir为方向   
	var aIMg = $('.film-img');
	var rect = aIMg[index].getBoundingClientRect()  
	var maxMove = albumList[0].offsetWidth - 1920;  //获取ul向左位移量最大值，1920为视口宽度
	var imgCenter = rect.left + rect.width * 0.5;   //图片中心
	var realMove = bodyCenter - imgCenter;	        //每次移动位移量
	move = move + realMove;  
	if(imgCenter < bodyCenter){  				    //焦点在中心左侧
		if(move < 0){							
			bstop = false;							//运动正在进行   
			move = move + realMove;
			albumList.css('transform', 'translateX('+ move +'px)');	
			setTimeout(function(){
			bstop = true;							//运动结束
			},500);
		}
		if(move > 0){								//位移左边界
			move = 0;
			albumList.css('transform', 'translateX('+ move +'px)');
		}
	}
	 if(imgCenter > bodyCenter){					//焦点在中心右侧
		if(move > -maxMove){					
			bstop = false;							//运动正在进行 
			move = move + realMove;             	//总位移量
			albumList.css('transform', 'translateX('+ move +'px)');
			setTimeout(function(){
			bstop = true;
			},500);
		}
		if(move < -maxMove){						//位移右边界
			move = -maxMove;
			albumList.css('transform', 'translateX('+ move +'px)');
		}
		
	}	
}


//当前影片信息方法 
function thisFilmInfo(index){
	$('.title').html(plst[index].contentName);      //影片标题
	$('.score').html(plst[index].score);            //影片评分
	$('.number').html(index + 1);          			//影片序号
	$('.tote').html("|" + n);                       //本页影片总数
	$('.info p').html(plst[index].tvDesc);          //影片介绍
	$('.album-item:eq('+ index +')').addClass("selected").siblings().removeClass('selected'); //选中影片获取焦点 	
}


});