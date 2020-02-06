import gsap from "gsap";

let gameElem = null;

export const startGame = (_gameElem) => {
    gameElem = _gameElem;
    gameElem.current.className = 'active';
    
    setTimeout(()=>{
        limitedOfferOut();
    },1000)

    initSlider();
    initQuestion();
    initClock();
}

const closeGame = () => {
    gameElem.current.className = 'active out';
    setTimeout(()=>{
        gameElem.current.className = '';
    },1000)
}

const limitedOfferOut = () => {
    gsap.set('#game #limitedOffer', {autoAlpha:1, scale:1});

    const tl = gsap.timeline();
    tl.to('#game #limitedOffer', 3, {scale:5, ease:'power3.inOut'},'s');
    tl.to('#game #limitedOffer #left', 3, {x:'-100%', ease:'power2.inOut'},'s');
    tl.to('#game #limitedOffer #right', 3, {x:'100%', ease:'power2.inOut'},'s');
    tl.to('#game #warningBg', 1, {autoAlpha:0, ease:'power3.inOut'},'s');
    tl.set('#game #limitedOffer', {autoAlpha:0});
    tl.call(sliderIn, null, '-=1.3');
}

const initSlider = () => {
    gsap.set('#buttons',{force3D:true, y:'-12vh'});
    gsap.set('#texts',{force3D:true, y:'-28vh'});
    gsap.set('#cart',{force3D:true, y:'-300%'});
    gsap.set('#product',{force3D:true, autoAlpha:1, y:'-60vh'});
    gsap.set('#product #rader',{autoAlpha:0});
    gsap.set('#character1', {force3D:true, x:'-50vw', scale:1});
    gsap.set('#character2', {force3D:true, x:'50vw', scale:1});
}

const sliderIn = () => {
    const tl = gsap.timeline();
    tl.to('#cart', 1, {y:'-50%', ease: 'power4.out'});
    tl.to('#buttons', 1, {y:0, ease: 'power4.out'},.4);
    tl.to('#texts', 1, {y:0, ease: 'power4.out'},.2);
    tl.to('#product', 1, {y:0, ease: 'power4.out'},.3);
    tl.to('#product #rader', 2, {autoAlpha:1, ease: 'power1.inOut'},1);
    tl.to('#character1', 1, {x:0, ease: 'power3.out'},.4);
    tl.to('#character2', .6, {x:0, ease: 'power3.out'},.6);
    tl.call(sliderOut, null);
}

const sliderOut = () => {
    const tl = gsap.timeline();
    tl.to('#buttons', .6, {y:'-12vh', ease: 'power4.inOut'},'s');
    tl.to('#texts', .6, {y:'-28vh', ease: 'power4.inOut'},'s+=.2');
    tl.to('#cart', .6, {y:'-300%', ease: 'power4.inOut'},'s+=.4');
    tl.to('#product', 1, {autoAlpha:0, ease: 'power1.inOut'},'s');
    tl.call(questionIn, null);
}



const initQuestion = () => {
    gsap.set(['#question #symbol', '#question #title span', '#question #tips'], {force3D:true, autoAlpha:0, y:'-100%'});
}

const questionIn = () => {
    const tl = gsap.timeline();
    tl.to('#character1 .wrap', 1, {scale:1.3, ease: 'power3.inOut'},'s');
    tl.to('#character2 .wrap', 1, {scale:1.3, ease: 'power3.inOut'},'s');
    tl.to('#character1 .wrap', 1, {left:'-20vw',top:'19vh', ease: 'power3.inOut'},'s');
    tl.to('#character2 .wrap', 1, {left:'-2.4vw',top:'26vh', className:'wrap stop', ease: 'power3.inOut'},'s');
    tl.to(['#question #symbol', '#question #title span', '#question #tips'], .6, {autoAlpha:1, y:'0%', stagger:.1, ease: 'power3.out'},.2);
    tl.call(questionOut, null);
}

const questionOut = () => {
    const tl = gsap.timeline();
    tl.to(['#question #symbol', '#question #title span', '#question #tips'], .6, {autoAlpha:0, y:'-100%', stagger:.1, ease: 'power3.in'});
    tl.call(transformToClock, null);
}



const initClock = () => {
    gsap.set('#clock div', {force3D:true, autoAlpha:0, y:'-100%', stagger:.1});
    gsap.set('#pointer span', {force3D:true, scale:0, stagger:.1});
}

const transformToClock = () => {
    const tl = gsap.timeline();
    tl.to('#character2 .wrap', 1, {scale:4, left:'50vw', top:'50vh', y:0, ease:'power2.inOut'},'s');
    tl.to('#character1 .wrap', 1, {left:0, top:'-6vh', boxShadow:'0px 0px 0px #333', ease: 'elastic.out(1, 0.75)'},'b-=.6');
    tl.to('#character1 .wrap', 1, {scale:2.6, ease: 'elastic.out(1, 0.3)'},'b-=.6');
    tl.to('#character1 .eyes', .3, {autoAlpha:0, ease: 'power1.inOut'},'b-=.6');
    tl.to('#question #smallTitle', .3, {autoAlpha:1, ease: 'power1.inOut'});
    tl.to('#clock div', .6, {autoAlpha:1, y:'0%', stagger:.1, ease: 'power3.out'},.3);
    tl.to('#pointer span', .6, {scale:1, stagger:.1, ease: 'elastic.out(1, 0.75)'},.8);
}