import gsap from 'gsap';


const CreateParticles = function(targetElem, isBigShape){
    this.x = 0;
    this.y = 0;
    this.vx = isBigShape ? (Math.random() * 30 - 15) : (Math.random() * 10 - 5);
    this.vy = Math.random() * 30 - 50;
    this.friction = Math.random() * .7 + .2;
    this.garvity = 1;
    this.deg = Math.random()*360;

    this.init = function(){
        this.elem = document.createElement('div');
        this.elem.className = `shape _${Math.round(Math.random()*(isBigShape ? 4 : 3)+1)}`;
        targetElem.appendChild(this.elem);

        gsap.set(this.elem, {scale:Math.random()*(isBigShape ? 3 : 1.5)+1, rotation: this.deg});
    }
}

CreateParticles.prototype.draw = function(){
    gsap.set(this.elem, {x:this.x, y:this.y, rotation:this.deg});
    this.x += this.vx;
    this.y += this.vy * this.friction;
    this.vy += this.garvity * this.friction;
    this.deg += this.vx + this.vy * .1;
}



const ParticlesAnim = function(elem, isBigShape){
    this.play = null;
    this.shapesWrapElem = elem;
    this.particles = [];
    this.stopCreateParticles = false;
    this.last = 0;
    this.updateParticles = (now) => {
        this.play = requestAnimationFrame(this.updateParticles);

        if(!this.stopCreateParticles){
            if(now - this.last >= 1*1000){
                this.last = now;

                for(let i=0; i<10; i++){
                    const p = new CreateParticles(this.shapesWrapElem, isBigShape);
                    p.init();
                    this.particles.push(p);
                }
            }
        }
        else{
            if(!this.particles.length){
                cancelAnimationFrame(this.play);
                this.play = null;
            }
        }

        for(let i=0; i<this.particles.length; i++){
            let particle = this.particles[i];
            particle.draw();

            if((particle.x < -100 && particle.x > window.innerWidth/2+100) || (particle.y > window.innerHeight/2 + 100)){
                particle.elem.remove();
                particle = null;
                this.particles.splice(i,1);
            }
        }
    }
}

ParticlesAnim.prototype.start = function(){
    this.stopCreateParticles = false;
    if(!this.play)
        this.updateParticles();
}

ParticlesAnim.prototype.stop = function(){ 
    this.stopCreateParticles = true;
}


export default ParticlesAnim;