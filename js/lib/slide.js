function slider(){
var imgs = imgsider
var adv = {
    LIWIDTH: 497,
    DURATION: 100,      // 动画总时长4
    WAIT: 3000,         // 自动轮播之间等待的时长
    STEPS: 80,         // 动画移动的总步数
    timer: null,
    slideBox: document.getElementsByClassName("slidebox")[0],
    slideNum: document.getElementsByClassName("slide-num")[0],
    prev: document.getElementById("prev"),
    next: document.getElementById("next"),
    canAuto: true,
    init: function () {
        var that = this;
        that.updateView();
        document.getElementsByClassName("wrap")[0].addEventListener("mouseover", function () {
            that.canAuto = false;
        }, false);
        document.getElementsByClassName("wrap")[0].addEventListener("mouseout", function () {
            that.canAuto = true;
        }, false);
        that.autoMove();
        that.slideNum.onmouseover = function () {
            var e = window.event || arguments[0];
            var target = e.srcElement || e.target;
            var span = that.slideNum.querySelectorAll("span");
            if (target.nodeName == "SPAN" && target.getAttribute("data-i") - 1 != imgs[0].index) {
                that.slideNum.querySelector(".active").className = "";
                target.className = "active";
                var n = target.getAttribute("data-i") - 1 - imgs[0].index;
                that.move(n);
            }
        };
        that.prev.onclick = function () {      
            var e = window.event || arguments[0];
            e.preventDefault();
             if(imgs.length==1){
	            	return;
	         }
            that.move(-1);
        };
        that.next.onclick = function () {
	        	
            var e = window.event || arguments[0];
            e.preventDefault();
            if(imgs.length==1){
	            	return;
	         }
            that.move(1);
        };
    },
    updateView: function () {
        this.slideBox.style.width = this.LIWIDTH * imgs.length + "px";
        for (var i = 0, lis = [], idxs = []; i < imgs.length; i++) {
            lis[i] = "<li class='slide-item' data-i='" + imgs[i].index + "'><a href='"+imgs[i].url+"' ><img src='" + imgs[i].imageUrl + "'></a></li>";
            idxs[i] = "<span data-i='" + (i + 1) + "'></span>";
        }
        this.slideBox.innerHTML = lis.join("");
        this.slideNum.innerHTML = idxs.join("");
        this.slideNum.querySelectorAll(".active").className = "";
        this.slideNum.querySelectorAll("span")[imgs[0].index].className = "active";
    },
    move: function (n) {
        clearTimeout(this.timer);
        this.timer = null;
        if (n < 0) {
            imgs = imgs.splice(imgs.length + n, -n).concat(imgs);
            this.updateView();
            this.slideBox.style.left = n * this.LIWIDTH + "px";
        }
        this.moveStep(n);
    },
    moveStep: function (n) {
        var that = this;
        var step = that.LIWIDTH * n / that.STEPS;
        var style = getComputedStyle(that.slideBox);
        var left = parseFloat(style.left) - step;
        that.slideBox.style.left = left + "px";
        if (n > 0 && left > -that.LIWIDTH * n || n < 0 && left < 0) {
            that.timer = setTimeout(function () {
                that.moveStep(n);
            }, that.DURATION / that.STEPS);
        } else {
            that.slideBox.style.left = "0px";
            that.autoMove();
            if (n > 0) {
                imgs = imgs.concat(imgs.splice(0, n));
                that.updateView();
            }
        }
    },
    autoMove: function () {
    		if(imgs.length==1){
            	return;
         }
        var that = this;
        that.timer = setTimeout(function () {
            if (that.canAuto) {
            		if(imgs.length==1){
            			 that.moveStep(1);
            			 return;
            		}
               that.moveStep(1);
                // console.log(this);       this指向window
            } else {
                that.autoMove();
            }
        }, that.WAIT);
    }
};
adv.init();
}
//window.onload = function () {
//  adv.init();
//};
