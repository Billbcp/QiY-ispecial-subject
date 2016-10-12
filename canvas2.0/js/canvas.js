$(function(){
// 变量
var n = 0;            //本页影片总数
var move = 0;         //起始ul位移量
var index = 0;
var urlArr = [];      //图片URL数组
var plst = {};        //存入获取的数据
var albumList = $('.album-list');
var bodyCenter = $('.container')[0].getBoundingClientRect().width * 0.5; //视口中心
var vipSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAkBAMAAAAnV0S3AAAAMFBMVEVJrh7///+t1qLZ69OIxnX2+vVbtDrj8N/s9eqh0ZTE4byVy4XO5si53K96wGRrulDxB4xEAAAA8klEQVQ4y+XQzVHCUBTF8eNHEFQw543xQcQJ7lyaDkwHZMM6dKAdiBXgyq10QDrADrAD6AA6gDcM795hkQLgv3hn8Zt5i4tTbh3tNh+kZIiMZDwWvuDUzQ1/PdOuPDc4c3PLN6QhkBngh5+ea/nAzbANz0gNfJOOe7+N4qUVLrvAlhLFQSQcsADu+Kq4TuEme8A5x4rP2sItvgNXUaG4jCF9JMCyC+HaKFH8bID/R8Uv7CkeWmDU3zO3dQB91sUl54q/Cs0Nzq+5UJ/r3Fn7gYXwYZP70lRw9vT3UMF1m88quElOK7jFqHBKhsL6rDEUH30bHBktf3O79YMAAAAASUVORK5CYII=";
var duboSrc = "http://static.ptqy.gitv.tv/tv/subject2/images/corner/dubo.png"
var bstop = true;							   	   //可以进行下一个动画，没有动画进行中			
initialise(index);                            	   //初始化方法 

//Keydown 事件
$(document).keydown(function(event) {              //点击右键	
	if(bstop){									   //没有动画进行中
		if (event.keyCode == 39) {
			index++;
			index > n - 1 ? index = n - 1 : index; //index右边界
		}		
		if (event.keyCode == 37) {                 //单击左键
			index--;
			index < 0 ? index = 0 : index;         //index左边界
		}
		imgMove(index);                            //图片移动方法
		thisFilmInfo(index);                               
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
			var list = "";
			var isVip = "";
			var isDubo = "";
			var albumVip = '';
			var albumDubo = '';
			var Url = '';      					//页面初始化，插入DOM元素获取数据                          
			for(i = 0; i < n; i++){
				isVip = plst[i].payMark;       	//是VIP影片
				isDubo = plst[i].isExclusive;	//是独播影片
				isVip ?	albumVip = "album-vip" : albumVip = '';	           //添加VIP标签
				isDubo ? albumDubo = "album-dubo" : albumDubo = '';	       //添加独播标签
				plst[i].postImage == "" ? Url = plst[i].picUrl.replace('.jpg', '_260_360.jpg') : Url = plst[i].postImage.replace('.jpg','_354_490.jpg');
				list += '<canvas class="img'+i+' album-item" width="266" height="421"></canvas>';	
				urlArr[i] = Url;                 //URL放入数组	                                    
			}
			thisFilmInfo(0);                        	//起始默认焦点为第一个影片
			albumList.css('width', (88+4+(266+16*2)*n)+'px');//album-list的margin左右各44，album-item的margin左右各16，album-item宽度266,border为2px
			albumList.html(list);
			drawImg(n);                           //绘图片
			thisFilmInfo(0); 					   
    	}
	});   	
}
                     			
//绘所有图片方法		
function drawImg(n){                             
	for(j = 0; j < n; j++){
		drawAlbum(j);
	}			
}
function drawAlbum(j) {
	var canvas=$(".img"+j+"")[0].getContext("2d");//jQuery()返回的是jQuery对象，而jQuery对象是没有getContext方法的,添加数值索引，转换为dom对象
	var img=new Image();
	img.src=urlArr[j];
	img.onload = function(){
		canvas.drawImage(img,1,0,264,361);      //绘图片
		canvas.fillStyle="#c6c8cb";
		canvas.font="30px Adobe";
		canvas.fillText(plst[j].contentName,0,400,264);//绘影片名称
		isVipFilm(canvas, j);   //绘VIP标志方法 
		isDuboFilm(canvas, j);  //绘独播标志方法
	};
}

//绘VIP标志方法
function isVipFilm(canvas, j){
	var isVip = plst[j].payMark;        	//是VIP影片
	var vipImg = new Image();
	var vipUrl = isVip ? vipSrc : '';	    //添加VIP标签
	vipImg.src=vipUrl;
	vipImg.onload = function(){
	canvas.drawImage(vipImg,1,0);			//绘VIP标志
	}
}

//绘独播标志方法
function isDuboFilm(canvas, j){
	var isDubo = plst[j].isExclusive;	    //是独播影片
	var duboImg = new Image();
	var duboUrl = isDubo ? duboSrc : '';	//添加独播标签
	duboImg.src=duboUrl;
	duboImg.onload = function(){
	canvas.drawImage(duboImg,172,0);		//绘独播标志
	}

}
//图片移动方法
function imgMove(index){    				    //dir为方向   
	var aIMg = $('.album-item');
	var rect = aIMg[index].getBoundingClientRect()  
	var maxMove = albumList[0].offsetWidth - 1920;  //获取ul向左位移量最大值，1920为视口宽度
	var imgCenter = rect.left + rect.width * 0.5;   //图片中心
	var realMove = bodyCenter - imgCenter;	        //每次移动位移量  
	console.log(bodyCenter);
	console.log(imgCenter);
	console.log(realMove);
	console.log(move);
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