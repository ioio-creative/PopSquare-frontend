
const Counter = function(m, s, onUpdate, callback){
    this.minutes = m;
    this.seconds = s;
    this.end = undefined;
    this.loop = undefined;
    this.callback = callback;
    
    this.init = function(){
        this.end = new Date();
        this.end.setMinutes(this.end.getMinutes() + this.minutes);
        this.end.setSeconds(this.end.getSeconds() + this.seconds + 1);
    }

    this.update = function(){
        const now = new Date().getTime();
        const distance =  this.end - now;
        this.minutes = Math.floor( distance % (1000 * 60 * 60) / (1000 * 60));
        this.seconds = Math.floor( distance % (1000 * 60) / 1000);

        onUpdate();

        if(this.minutes <= 0 && this.seconds <= 0){
            this.stop();
            this.callback();
        }
    }

    // this.stop = function(){
    //     this.loop &&
    //     clearInterval(this.loop);

    //     callback();
    // }

    this.init();
}

Counter.prototype.start = function(){
    this.loop = setInterval(()=>{
        this.update();
    },1000/60);
}

Counter.prototype.stop = function(){
    this.loop &&
    clearInterval(this.loop);
}

export default Counter;