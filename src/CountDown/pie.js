import * as PIXI from 'pixi.js';
import gsap from 'gsap';

const Pie = function(app,min,sec){
    this.progress = 0;
    this.raduis = 300;
    this.x = window.innerWidth/3;
    this.y = window.innerHeight/2;
    this.end = false;
    this.duration = min*60+sec;

    const rightMask = new PIXI.Graphics();
    rightMask.beginFill(0xffffff, 1);
    rightMask.moveTo(0,0);
    rightMask.lineTo(this.raduis, 0);
    rightMask.lineTo(this.raduis, this.raduis*2);
    rightMask.lineTo(0, this.raduis*2);
    rightMask.closePath();
    rightMask.endFill();
    rightMask.pivot.y = rightMask.height/2;
    rightMask.x = this.x;
    rightMask.y = this.y;

    const leftMask = new PIXI.Graphics();
    leftMask.beginFill(0xffffff, 1);
    leftMask.moveTo(0,0);
    leftMask.lineTo(this.raduis, 0);
    leftMask.lineTo(this.raduis, this.raduis*2);
    leftMask.lineTo(0, this.raduis*2);
    leftMask.closePath();
    leftMask.endFill();
    leftMask.pivot.x = leftMask.width;
    leftMask.pivot.y = leftMask.height/2;
    leftMask.x = this.x;
    leftMask.y = this.y;

    this.leftArc = new PIXI.Graphics();
    this.leftArc.beginFill(0xffffff, 1);
    this.leftArc.arc(0, 0, this.raduis, .5 * Math.PI, 1.5 * Math.PI);
    this.leftArc.endFill();
    this.leftArc.x = this.x;
    this.leftArc.y = this.y;
    this.leftArc.mask = leftMask;

    this.rightArc = new PIXI.Graphics();
    this.rightArc.beginFill(0xffffff, 1);
    this.rightArc.arc(0, 0, this.raduis, 1.5 * Math.PI, .5 * Math.PI);
    this.rightArc.endFill();
    this.rightArc.x = this.x;
    this.rightArc.y = this.y;
    this.rightArc.mask = rightMask;

    const bgCircle = new PIXI.Graphics();
    bgCircle.beginFill(0x999999, 1);
    bgCircle.drawCircle(0, 0, this.raduis*.9);
    bgCircle.x = this.x;
    bgCircle.y = this.y;


    app.stage.addChild(bgCircle);
    app.stage.addChild(this.leftArc);
    app.stage.addChild(this.rightArc);
    app.stage.addChild(rightMask);
    app.stage.addChild(leftMask);
}

Pie.prototype.start = function(){
    this.end = false;
    gsap.to(this, this.duration, {progress:1, ease:'power1.inOut'});
}

Pie.prototype.update = function(){
    if(this.progress <= 0.5)
        this.rightArc.rotation = this.progress * Math.PI * 2;
    else if(this.progress > 0.5)
        this.rightArc.rotation = .5 * Math.PI * 2;

    if(this.progress >= 0.5 && this.progress < 1){
        this.leftArc.rotation = (this.progress - 0.5) * Math.PI * 2;
    }
    else if(this.progress === 1 && !this.end){
        this.leftArc.rotation = 1.5 * Math.PI * 2;
        this.end = true;
    }
}


export default Pie;