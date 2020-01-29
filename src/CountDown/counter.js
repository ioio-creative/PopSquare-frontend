
const Counter = function(s){
    this.seconds = s;
    this.end = undefined;
    this.loop = undefined;
    
    this.init = function(){
        this.end = new Date();
        this.end.setSeconds(this.end.getSeconds() + this.seconds + 1);
    }

    this.update = function(){
        const now = new Date().getTime();
        const distance =  this.end - now;

        this.seconds = Math.floor( distance % (1000 * 60) / 1000);

        if(this.seconds <= 0)
            this.stop();
    }

    this.stop = function(){
        this.loop &&
        clearInterval(this.loop);
        // console.log('stop')
    }

    this.init();
}

Counter.prototype.start = function(){
    this.loop = setInterval(()=>{
        this.update();
    },1000/60);
}

export default Counter;