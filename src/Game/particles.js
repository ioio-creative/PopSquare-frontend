import gsap from 'gsap';


const CreateParticles = function(targetElem, isBigShape){
    this.x = 0;
    this.y = 0;
    this.vx = Math.random() * 10 - 5;
    this.vy = Math.random() * 30 - (isBigShape ? 45 : 50);
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
    this.updateParticles = () => {
        this.play = requestAnimationFrame(this.updateParticles);

        if(!this.stopCreateParticles){
            for(let i=this.particles.length; i<30; i++){
                const p = new CreateParticles(this.shapesWrapElem, isBigShape);
                p.init();
                this.particles.push(p);
            }
        }
        else{
            if(!this.particles.length){
                cancelAnimationFrame(this.play);
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
    this.updateParticles();
}

ParticlesAnim.prototype.stop = function(){ 
    this.stopCreateParticles = true;
}


export default ParticlesAnim;