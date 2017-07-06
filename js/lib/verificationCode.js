


  /*
   *4位图形验证码
   * author by zafubobo
   * */
  var code;
  function randomNum(min,max){
        return Math.floor(Math.random()*(max-min)+min);
    }
    function randomColor(min,max){
        var _r = randomNum(min,max);
        var _g = randomNum(min,max);
        var _b = randomNum(min,max);
        return "rgb("+_r+","+_g+","+_b+")";
    }
    document.getElementById("canvas").onclick = function(e){
        e.preventDefault();
        code=drawPic().toLowerCase();
    };
     function drawPicRegister(s){
        var $canvas = document.getElementById("canvas");
//      var _str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//      var _str = "0123456789";
        var _picTxt = "";
        var _num = 4;
        var _width = $canvas.width;
        var _height = $canvas.height;
        var ctx = $canvas.getContext("2d");
        ctx.fillStyle="#D3D3D3"
        ctx.textBaseline = "bottom";
        ctx.fillRect(0,0,_width,_height);
        for(var i=0; i<_num; i++){
            var x = (_width-10)/_num*i+10;
            var y = randomNum(_height/1,_height);
            var deg = randomNum(-35,35);
            var txt = s[i];
            _picTxt += txt;
            ctx.fillStyle = randomColor(10,100);
            ctx.font = 130+"px SimHei";
            ctx.translate(x,y);
            ctx.fillText(txt, 0,0);
            ctx.translate(-x,-y);
        }
//      for(var i=0; i<_num; i++){
//          ctx.beginPath();
//          ctx.moveTo(randomNum(0,_width), randomNum(0,_height));
//          ctx.lineTo(randomNum(0,_width), randomNum(0,_height));
//          ctx.stroke();
//      }
//      for(var i=0; i<_num*10; i++){
//          ctx.beginPath();
//          ctx.arc(randomNum(0,_width),randomNum(0,_height), 1, 0, 2*Math.PI);
//          ctx.fill();
//      }
        return _picTxt;
    }
    
    function drawPic(){
        var $canvas = document.getElementById("canvas");
        var _str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//      var _str = "0123456789";
        var _picTxt = "";
        var _num = 4;
        var _width = $canvas.width;
        var _height = $canvas.height;
        var ctx = $canvas.getContext("2d");
        ctx.fillStyle="#D3D3D3"
        ctx.textBaseline = "bottom";
        ctx.fillRect(0,0,_width,_height);
        for(var i=0; i<_num; i++){
            var x = (_width-10)/_num*i+10;
            var y = randomNum(_height/1,_height);
            var deg = randomNum(-35,35);
            var txt = _str[randomNum(0,_str.length)];
            _picTxt += txt;
            ctx.fillStyle = randomColor(10,100);
            ctx.font = 30+"px SimHei";
            ctx.translate(x,y);
//          ctx.rotate(deg*Math.PI/180);
            ctx.fillText(txt, 0,0);
//          ctx.rotate(-deg*Math.PI/180);
            ctx.translate(-x,-y);
        }
//      for(var i=0; i<_num; i++){
//          ctx.beginPath();
//          ctx.moveTo(randomNum(0,_width), randomNum(0,_height));
//          ctx.lineTo(randomNum(0,_width), randomNum(0,_height));
//          ctx.stroke();
//      }
//      for(var i=0; i<_num*10; i++){
//          ctx.beginPath();
//          ctx.arc(randomNum(0,_width),randomNum(0,_height), 1, 0, 2*Math.PI);
//          ctx.fill();
//      }
        return _picTxt;
    }

