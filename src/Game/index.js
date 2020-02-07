import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from "gsap";
import QRCode from "qrcode.react";
// import { startGame } from './function';
import Counter from './counter';
import ParticlesAnim from './particles';

const min = 1;
const sec = 0;

const Game = props => {
    const gameStarted = useSelector(state => state.gameStarted);
    const counterStarted = useSelector(state => state.counterStarted);
    const dispatch = useDispatch();
    const [isPicked, setIsPicked] = useState(false);
    const [size, setSize] = useState(null);
    const [second, setSecond] = useState(sec);
    const [minute, setMinute] = useState(min);
    const gameElem = useRef(null);
    const shapesWrapElem = useRef(null);
    const startGameFunc = useRef(null);
    const startCounterFunc = useRef(null);
    const endCounterFunc = useRef(null);
    const closeGameFunc = useRef(null);

    // setMinute(timer.minutes);
    // setSecond(timer.seconds);

    useEffect(()=>{
        let started = false;
        let timer = null;
        let oldSeconds = -1;
        const particlesAnim = new ParticlesAnim(shapesWrapElem.current);

        const updateCounter = () => {
            if(timer.seconds !== oldSeconds){
                gsap.to('#pointer', .6, {rotation: (-timer.seconds * 6)+'_short', overwrite:true, ease:'elastic.out(1, 0.4)'});
                oldSeconds = timer.seconds;
            }

            setMinute(timer.minutes);
            setSecond(timer.seconds);
        }


        const endCounter = () => {
            if(timer){
                gsap.to('#pointer', .6, {rotation: (-timer.seconds * 6)+'_short', overwrite:true, ease:'elastic.out(1, 0.4)'});
                setSecond(timer.seconds);
                timer.stop();
            }
            animateToTimesup();
            dispatch({type:'END_COUNTER'});
        }
        endCounterFunc.current = {endCounter};


        const startCounter = () => {
            timer = new Counter(min, sec, updateCounter, endCounter);
            timer.start();
            updateCounter();
        }
        startCounterFunc.current = {startCounter}


        const startGame = () => {
            started = true;
            gsap.set('#game *',{clearProps:true});
            gameElem.current.className = 'active';
            
            setTimeout(()=>{
                limitedOfferOut();
            },1000 * 1); // 50s
        
            initSlider();
            initQuestion();
            initClock();
            initComplete();
            initNextOffer();
            initSeeyou();
        }
        startGameFunc.current = {startGame};
        

        const closeGame = () => {
            if(started){
                started = false;
                setIsPicked(false);
                gameElem.current.className = 'active out';
                setTimeout(()=>{
                    gameElem.current.className = '';
                },1000)

                
                // setTimeout(()=>{
                //     dispatch({type:'START_GAME'});
                // },3000)
            }
        }
        closeGameFunc.current = {closeGame};
        
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

        ////////////////////////
        ////////////////////////
        
        const initSlider = () => {
            gsap.set('#buttons',{force3D:true, y:'-12vh'});
            gsap.set('#texts',{force3D:true, y:'-28vh'});
            gsap.set('#cart',{force3D:true, y:'-300%'});
            gsap.set('#product',{force3D:true, autoAlpha:1, y:'-60vh'});
            gsap.set('#product #rader',{autoAlpha:0});
            gsap.set('#character1', {force3D:true, x:'-50vw', scale:1});
            gsap.set('#character1 .wrap', {force3D:true, scale:.56});
            gsap.set('#character2', {force3D:true, x:'50vw', scale:1});
            gsap.set('#character2 .wrap', {force3D:true, scale:.2});
            gsap.set('#character1 .eyes', {force3D:true, x:'-50%', y:0, overwrite:true});
            gsap.set('#character2 .eyes', {force3D:true, x:'-50%', y:0});
            gsap.set('#texts div span', {force3D:true, autoAlpha:0, y:'-100%'});
            gsap.set('#texts div:nth-child(1) span', {force3D:true, autoAlpha:1, y:'0%'});
        }
        
        let sliderInAnim = null;
        const sliderIn = () => {
            sliderInAnim = gsap.timeline();
            sliderInAnim.to('#cart', 1, {y:'-50%', ease: 'power4.out'});
            sliderInAnim.to('#buttons', 1, {y:0, ease: 'power4.out'},.4);
            sliderInAnim.to('#texts', 1, {y:0, ease: 'power4.out'},.2);
            sliderInAnim.to('#product', 1, {y:0, ease: 'power4.out'},.3);
            sliderInAnim.to('#product #rader', 2, {autoAlpha:1, ease: 'power1.inOut'},1);
            sliderInAnim.to('#character1', 1, {x:0, ease: 'power3.out'},.4);
            sliderInAnim.to('#character2', .6, {x:0, ease: 'power3.out'},.6);
            sliderInAnim.to('#character1 .eyes', .6, {x:'70%'},1);
            sliderInAnim.to('#character1 .eyes', 1, {y:'-100%', repeat:-1, repeatDelay:.3, yoyo:true, ease:'power3.inOut'},1);
            sliderInAnim.to('#character2 .eyes', .6, {x:'-100%'},1);
            sliderInAnim.to('#character2 .eyes', 1, {x:'-50%', y:'-100%', repeat:-1, repeatDelay:1, yoyo:true, ease:'power3.inOut'},1.6);
            sliderInAnim.to('#character2 .wrap', .3, {y:'-20%', repeat:-1, yoyo:true, ease:'power3.out'},1);

            // slide 2
            sliderInAnim.to('#buttons div', .3, {autoAlpha:.5, ease:'power1.inOut'},6.66-1);
            sliderInAnim.to('#buttons div:nth-child(2)', .3, {autoAlpha:1, ease:'power1.inOut'},6.66-1);
            sliderInAnim.to('#texts div span', .6, {autoAlpha:0, y:'-100%', stagger:.1, ease:'power3.in'},6.66-1);
            sliderInAnim.to('#texts div:nth-child(2) span', .6, {autoAlpha:1, y:'0%', stagger:.1, ease:'power3.out'},6.66);

            // slide 3
            sliderInAnim.to('#buttons div', .3, {autoAlpha:.5, ease:'power1.inOut'},6.66*2-1);
            sliderInAnim.to('#buttons div:nth-child(3)', .3, {autoAlpha:1, ease:'power1.inOut'},6.66*2-1);
            sliderInAnim.to('#texts div span', .6, {autoAlpha:0, y:'-100%', stagger:.1, ease:'power3.in'},6.66*2-1);
            sliderInAnim.to('#texts div:nth-child(3) span', .6, {autoAlpha:1, y:'0%', stagger:.1, ease:'power3.out'},6.66*2);


            sliderInAnim.call(sliderOut, null, 20);
        }
        
        const sliderOut = () => {
            sliderInAnim.kill();
            const tl = gsap.timeline();
            tl.to('#character2 .wrap', .6, {y:'0%', overwrite:true, ease:'power3.out'},'s');
            tl.to('#buttons', .6, {y:'-12vh', ease: 'power4.inOut'},'s');
            tl.to('#texts', .6, {y:'-28vh', ease: 'power4.inOut'},'s+=.2');
            tl.to('#cart', .6, {y:'-300%', ease: 'power4.inOut'},'s+=.4');
            tl.to('#product', 1, {autoAlpha:0, ease: 'power1.inOut'},'s');
            tl.call(questionIn, null);
        }
        
        ////////////////////////
        ////////////////////////
        
        const initQuestion = () => {
            gsap.set(['#question #symbol', '#question #title span', '#question #tips'], {force3D:true, autoAlpha:0, y:'-100%'});
        }
        
        const questionIn = () => {
            const tl = gsap.timeline();
            tl.to('#character1 .wrap', 1, {scale:.75, ease: 'power3.inOut'},'s');
            tl.to('#character2 .wrap', 1, {scale:.28, overwrite:true, ease: 'power3.inOut'},'s');
            tl.to('#character1 .wrap', 1, {left:'-20vw',top:'19vh', ease: 'power3.inOut'},'s');
            tl.to('#character2 .wrap', 1, {left:'-2.4vw',top:'26vh', className:'wrap stop', ease: 'power3.inOut'},'s');
            tl.to(['#question #symbol', '#question #title span', '#question #tips'], .6, {autoAlpha:1, y:'0%', stagger:.1, ease: 'power3.out'},.2);
            tl.call(questionOut, null, 10);
        }
        
        const questionOut = () => {
            const tl = gsap.timeline();
            tl.to(['#question #symbol', '#question #title span', '#question #tips'], .6, {autoAlpha:0, y:'-100%', stagger:.1, ease: 'power3.in'});
            tl.call(clockIn, null);
        }
        
        ////////////////////////
        ////////////////////////
        
        const initClock = () => {
            gsap.set('#question #smallTitle span', {force3D:true, autoAlpha:0, y:'-100%'});
            gsap.set('#clock .text', {force3D:true, autoAlpha:0, y:'-100%'});
            gsap.set('#pointer span', {force3D:true, scale:0, stagger:.1});
            gsap.set('#clock #timesup', {force3D:true, autoAlpha:0, y:'-50%'});
            gsap.set(['#timesupBg', '#timesupBg span'], {force3D:true, scale:0, autoAlpha:1});
        }
        
        const clockIn = () => {
            const tl = gsap.timeline();
            tl.to('#character2 .eyes', .3, {x:'-100%', y:'0%', ease: 'power1.inOut'},'s');
            tl.to('#character2 .wrap', 1, {scale:1, left:'50vw', top:'50vh', y:0, ease:'power2.inOut'},'s');
            tl.to('#character1 .wrap', 1, {left:0, top:'-6vh', boxShadow:'0px 0px 0px rgba(0,0,0,0)', ease: 'elastic.out(1, 0.75)'},'b-=.6');
            tl.to('#character1 .wrap', 1, {scale:1.55, ease: 'elastic.out(1, 0.3)'},'b-=.6');
            tl.to('#character1 .eyes', .3, {autoAlpha:0, ease: 'power1.inOut'},'b-=.6');
            tl.to('#question #smallTitle span', .6, {autoAlpha:1, y:'0%', stagger:.1, ease: 'power3.out'},'-=.6');
            tl.to('#clock .text', .6, {autoAlpha:1, y:'0%', stagger:.1, ease: 'power3.out'},.3);
            tl.to('#pointer span', .6, {scale:1, stagger:.1, ease: 'elastic.out(1, 0.75)'},.8);
            tl.set('#pointer span', {clearProps:true});
            tl.call(()=>{dispatch({type:'START_COUNTER'})}, null, '-=.8');
        }

        const animateToTimesup = () => {
            const tl = gsap.timeline();
            tl.to('#timesupBg', .8, {scale:25, ease: 'power3.out'},'s');
            tl.to('#question #smallTitle span', .3, {autoAlpha:0, y:'-100%', stagger:.1, overwrite:true, ease: 'power3.in'},'s');
            tl.to('#clock .text', .3, {autoAlpha:0, y:'50%', stagger:.1, overwrite:true, ease: 'power3.out'},'s+=.1');
            tl.to('#clock #timesup', .6, {autoAlpha:1, y:'0%', ease: 'power3.out'},'e-=.6');
            tl.to('#character2 .wrap', .6, {left:'75vw', top:'40vh', scale: .4, ease:'power2.in'},'e-=.8');
            tl.call(clockOut, null);
        }

        const clockOut = () => {
            const tl = gsap.timeline();
            tl.to('#pointer span', .6, {scale:0, stagger:.1, ease: 'back.in(1.7)'},'s');
            tl.to('#clock #timesup', .6, {autoAlpha:0, y:'100%', ease: 'power3.in'},'s');
            tl.to('#timesupBg span', .8, {scale:1, ease: 'power3.out'},'s+=.1');
            tl.set('#timesupBg', {autoAlpha:0});
            tl.call(completeIn, null);
        }

        const initComplete = () => {
            gsap.set('#complete #title span', {force3D:true, scale:0});
            gsap.set('#complete #tips span', {force3D:true, autoAlpha:0, y:'-100%'});
            gsap.set('#complete #lose span', {force3D:true, autoAlpha:0, y:'-100%'});
            gsap.set('#character2 #qrcode', {force3D:true, scale:0});
        }

        const completeIn = () => {
            const tl = gsap.timeline();
            tl.set('#character1 .wrap', {className:'wrap lookdown'});
            tl.to('#character2 .wrap', 1, {left:'23vw', top:'10vh', scale: .5, boxShadow:'0px 0px 0px rgba(0,0,0,0)', ease:'power3.inOut'},'s');
            tl.to('#character1 .eyes', .3, {autoAlpha:1, overwrite:true, ease: 'power1.inOut'},'s');
            tl.to('#character1 .eyes', .6, {y:'500%', ease: 'power3.inOut'},1);
            tl.to('#character1 .eyes', 1, {y:'550%', repeat:-1, repeatDelay:3, yoyo:true, ease:'power3.inOut'},1.6);

            // win
            tl.to('#complete #title span', .8, {scale:1, stagger:.08, ease: 'elastic.out(1, 0.3)'},'s');
            tl.to('#complete #tips span', .6, {autoAlpha:1, y:'0%', stagger:.1, ease: 'power3.out'},'s');
            tl.to('#character2 .eyes', .3, {autoAlpha:0, ease: 'power1.inOut'},1.8);
            tl.to('#character2 .wrap', .6, {scale: .8, ease:'elastic.out(1, 0.75)'},1.8);
            tl.to('#character2 #qrcode', .6, {scale:1, ease:'elastic.out(1, 0.75)'},2);

            //lose
            // tl.to('#complete #lose span', .6, {autoAlpha:1, y:'0%', stagger:.1, ease: 'power3.out'},'s');
            // tl.to('#character2 .eyes', .6, {y:'600%', overwrite:true, ease: 'power3.inOut'},1);

            tl.call(nextOfferIn, null, 30);

            particlesAnim.start();
            setTimeout(()=>{
                particlesAnim.stop();
            },1000 * 25);
        }

        const initNextOffer = () => {
            gsap.set('#nextOffer span', {force3D:true, autoAlpha:0, y:'-100%'});
        }

        let nextOfferInAnim = null;
        const nextOfferIn = () => {
            nextOfferInAnim = gsap.timeline();
            nextOfferInAnim.to('#character1 .eyes', .6, {x:'-100%', y:'0%', overwrite:true, ease: 'power3.inOut'},'s');
            nextOfferInAnim.to('#character1 .wrap', 1, {top: '0', boxShadow:'1vh 0.3vh 0 #333', ease: 'power3.inOut'},'s');
            nextOfferInAnim.to('#character2 .eyes', .6, {x:'-100%', y:'0%', ease: 'power3.inOut'},'s');
            nextOfferInAnim.to('#character2 .wrap', 1, {top: '18.5vh', boxShadow:'4vh 2.5vh 0 #333', scale: .3, ease: 'power3.inOut'},'s');
            nextOfferInAnim.to('#nextOffer span', .6, {autoAlpha:1, y:'0%', stagger:.1, ease: 'power3.out'},'s');

            //win
            nextOfferInAnim.to(['#complete #title span','#complete #tips span'], .3, {autoAlpha:0, y:'-100%', stagger:.1, ease: 'power3.in'},'s');
            nextOfferInAnim.to('#character2 .eyes', .3, {autoAlpha:1, ease: 'power1.inOut'},'s');
            nextOfferInAnim.to('#character2 #qrcode', .6, {scale:0, ease:'power3.out'},'s');

            //lose
            // tl.to('#complete #lose span', .3, {autoAlpha:0, y:'100%', stagger:.1, ease: 'power3.in'},'s');
            nextOfferInAnim.call(nextOfferOut, null, 15);
        }
        
        const nextOfferOut = () => {
            nextOfferInAnim.kill();
            const tl = gsap.timeline();
            tl.to('#nextOffer span', .3, {autoAlpha:0, y:'-100%', stagger:.1, ease: 'power3.in'},'s');
            tl.call(seeyouIn, null)
        }

        const initSeeyou = () => {
            gsap.set('#seeyou span', {force3D:true, autoAlpha:0, y:'-100%'});
            gsap.set('#seeyouBg', {force3D:true, scale:0});
        }

        const seeyouIn = () => {
            const tl = gsap.timeline();
            tl.to('#seeyou span', .6, {autoAlpha:1, y:'0%', stagger:.1, ease: 'power3.out'},'s');
            tl.to('#character1 .eyes', .6, {x:'100%', y:'800%', ease: 'power3.inOut'},'s');
            tl.to('#character1 .wrap', .3, {boxShadow:'0px 0px 0 rgba(0,0,0,0)', ease: 'power3.inOut'},'s');
            tl.to('#character2 .wrap', 1, {scale:1, left:'50vw', top:'50vh', ease:'power2.inOut'},'s');
            tl.to('#seeyouBg', .8, {scale:25, ease: 'power3.out'},'s');
            tl.call(()=>dispatch({type:'END_GAME'}), null, 15);
        }

        setTimeout(()=>{
            dispatch({type:'START_GAME'});
        },3000);




        const onResize = () => {
            if(window.innerWidth > window.innerHeight)
                setSize('horizontal');
            else
                setSize('vertical');
        }
        onResize();
        

        const keyDown = () => {
            setIsPicked(true);
        }

        window.addEventListener('resize',onResize);
        window.addEventListener("keydown", keyDown);
        return() => {
            window.removeEventListener('resize',onResize);
            window.removeEventListener("keydown", keyDown);
        }
    },[]);
    
    
    useEffect(()=>{
        if(gameStarted){
            startGameFunc.current.startGame();
        }
        else{
            closeGameFunc.current.closeGame();
        }
    },[gameStarted]);

    useEffect(()=>{
        if(counterStarted){
            startCounterFunc.current.startCounter();
        }
    },[counterStarted]);

    useEffect(()=>{
        if(isPicked && counterStarted){
            endCounterFunc.current.endCounter();
        }
    },[isPicked, counterStarted])

    
    return (
        <div ref={gameElem} id="game">
            <div id="container" className={size}>
                <div id="limitedOffer" className="fix">
                    <div id="warningBg"></div>
                    <div id="left" className="col">
                        <div className="wrap">
                            <div><span>Limited<br/>Offer</span></div>
                            <div><span>Limited<br/>Offer</span></div>
                            <div><span>Limited<br/>Offer</span></div>
                            <div><span>Limited<br/>Offer</span></div>
                            <div><span>Limited<br/>Offer</span></div>
                            <div><span>Limited<br/>Offer</span></div>
                            <div><span>Limited<br/>Offer</span></div>
                            <div><span>Limited<br/>Offer</span></div>
                            <div><span>Limited<br/>Offer</span></div>
                        </div>
                    </div>
                    <div id="right" className="col">
                        <div className="wrap">
                            <div><span>Limited<br/>Offer</span></div>
                            <div><span>Limited<br/>Offer</span></div>
                            <div><span>Limited<br/>Offer</span></div>
                            <div><span>Limited<br/>Offer</span></div>
                            <div><span>Limited<br/>Offer</span></div>
                            <div><span>Limited<br/>Offer</span></div>
                            <div><span>Limited<br/>Offer</span></div>
                            <div><span>Limited<br/>Offer</span></div>
                            <div><span>Limited<br/>Offer</span></div>
                        </div>
                    </div>
                </div>
                <div id="slider" className="fix">
                    <div id="buttons">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div id="texts">
                        <div><span>1You will have 1 mins</span> <span>to find it!</span></div>
                        <div><span>2You will have 1 mins</span> <span>to find it!</span></div>
                        <div><span>3You will have 1 mins</span> <span>to find it!</span></div>
                    </div>
                    <div className="center">
                        <svg id="cart" viewBox="0 0 1556 1308"><g fill="#F2F2F2" fillRule="evenodd"><path d="M1528.449 27.52l.116 52.547c.034 14.89-12.014 26.985-26.907 27.018l-90.43.237c-14.893.035-26.94 12.128-26.908 27.016l1.418 634.536c.033 14.888 12.133 26.93 27.026 26.896l115.6-.295c14.893-.031 26.992 12.01 27.026 26.898l.015 7.188c.033 14.888-12.012 26.983-26.906 27.016l-179.78.397c-14.893.034-26.993-12.008-27.026-26.895l-1.552-695.636c-.033-14.888-12.133-26.93-27.026-26.898L81.404 110.228c-14.893.033-26.94 12.128-26.908 27.016l1.554 700.865c.033 14.888-12.015 26.985-26.908 27.016-14.894.033-26.993-12.008-27.027-26.896L.638 171.02C.433 78.75 75.098 3.781 167.406 3.578L1501.422.623c14.894-.031 26.993 12.01 27.027 26.897m-173.717 1152.96c-22.085.047-40.028-17.81-40.077-39.886l-.132-59.77c-.05-22.076 17.814-40.012 39.899-40.06h.001c22.085-.051 40.026 17.808 40.077 39.884l.13 59.77c.051 22.076-17.813 40.013-39.898 40.062"/><path d="M1225.635 860.482l-668.09 1.48c-34.184.074-61.955-27.564-62.032-61.733-.075-34.172 27.574-61.934 61.757-62.009l668.092-1.478c34.182-.076 61.955 27.562 62.03 61.733.077 34.17-27.574 61.932-61.757 62.007m255.359 170.556l-911.03 2.017c-41.008.09-74.325-33.065-74.415-74.057-.09-40.992 33.079-74.295 74.085-74.386l911.03-2.016c41.008-.091 74.324 33.066 74.415 74.056.09 40.992-33.078 74.295-74.085 74.386M394.986 807.696l-213.971.474c-17.244.038-31.254-13.905-31.292-31.14l-1.202-542.505c-.038-17.238 13.91-31.241 31.153-31.28l213.97-.474c17.245-.037 31.254 13.905 31.292 31.14l1.202 542.507c.038 17.235-13.908 31.241-31.152 31.278zm91.45-646.02c-.022-10.842-8.835-19.611-19.68-19.587l-361.945.802c-10.846.023-19.62 8.832-19.597 19.674l1.514 682.85c.024 10.84 8.836 19.61 19.682 19.586l361.946-.802c10.846-.024 19.619-8.832 19.594-19.674l-1.513-682.849zm868.775 1145.035c-32.226.072-58.5-26.076-58.57-58.288-.072-32.214 26.086-58.477 58.312-58.548 32.225-.072 58.5 26.076 58.571 58.288.071 32.214-26.087 58.479-58.313 58.548M70.52 1227.107l50.936-.112c-13.608-23.495-21.467-50.715-21.532-79.758l-33.824.075c-.238-107.28 86.57-194.438 193.892-194.677 107.321-.237 194.514 86.538 194.753 193.818l-33.822.073c.065 29.043-7.674 56.298-21.178 79.852l52.45-.115c16.13-.036 29.177-13.136 29.142-29.26l-.615-277.26c-.028-12.409-10.112-22.446-22.526-22.418l-380.998.844c-20.22.043-36.576 16.465-36.53 36.676l.582 263.133c.037 16.124 13.141 29.165 29.27 29.129"/><path d="M387.099 1146.602c.066 30.23-10.538 58.032-28.239 79.868-23.183 28.596-58.548 46.95-98.155 47.038-39.608.086-75.053-18.11-98.364-46.604-17.797-21.756-28.526-49.51-28.592-79.743l-33.824.075c.065 29.043 7.924 56.265 21.532 79.758 27.84 48.07 79.874 80.455 139.322 80.325 59.449-.133 111.338-32.746 138.966-80.94 13.503-23.554 21.242-50.81 21.178-79.852l-33.824.075z"/><path d="M259.977 945.435c-101.778.224-186.382 73.231-204.625 169.63-3.874 20.484 11.835 39.443 32.687 39.398h.005l36.331-.08 272.13-.604 36.33-.08c20.854-.045 36.48-19.076 32.512-39.54-18.668-96.319-103.593-168.95-205.37-168.724M754.134 439.4H608.777c-8.332 0-15.086-6.75-15.086-15.077 0-8.328 6.754-15.08 15.086-15.08h145.357c8.33 0 15.084 6.752 15.084 15.08 0 8.327-6.754 15.078-15.084 15.078m280.745 118.529H889.52c-8.331 0-15.085-6.75-15.085-15.078s6.754-15.079 15.085-15.079h145.358c8.33 0 15.083 6.751 15.083 15.08 0 8.326-6.753 15.077-15.083 15.077m137.758-174.308h-145.358c-8.332 0-15.085-6.75-15.085-15.077 0-8.329 6.753-15.08 15.085-15.08h145.358c8.33 0 15.083 6.751 15.083 15.08 0 8.326-6.754 15.077-15.083 15.077"/></g></svg>
                        <div id="product">
                            <div id="rader">
                                <span></span>
                                <span></span>
                            </div>
                            <svg viewBox="0 0 108.9 91.8"><g fillRule="evenodd" clipRule="evenodd"><path d="M17 91.8h91.8V0H17v91.8z" fill="#ea7da4"/><path d="M0 91.8h91.8V0H0v91.8z" fill="#f7cd6f"/></g></svg>
                        </div>
                    </div>
                </div>
                <div id="question" className="fix">
                    <div id="symbol">“</div>
                    <div id="title">
                        <span>Find out the product</span>
                        <span>which give you</span>
                        <span>a better smile</span>
                    </div>
                    <div id="smallTitle">
                        <span>Find out the product which</span>
                        <span>give you a better smile !</span>
                    </div>
                    <div id="tips">You will have 1 min to find it!</div>
                </div>
                <div id="clock">
                    <div id="time">
                        <div className="text">{minute < 10 ? `0${minute}` : minute }:{second < 10 ? `0${second}` : second }</div>
                        <div id="timesup">Time's Up!</div>
                    </div>
                    <div className="text">left</div>
                </div>
                <div id="timesupBg"><span></span></div>
                <div id="complete" className="fix">
                    <div id="title">
                        <span>Mission</span>
                        <span>Completed!</span>
                    </div>
                    <div id="tips">
                        <span>Here is the promotion</span>
                        <span>code for the prize</span>
                    </div>
                    <div id="lose">
                        <span>Try again and</span>
                        <span>Good luck!</span>
                    </div>
                </div>
                <div id="nextOffer" className="fix">
                    <span>Our next limited offer </span>
                    <span>will be started at </span>
                    <span id="big">6:30pm</span>
                </div>
                <div id="seeyou" className="fix">
                    <span>See you</span>
                    <span>next time !</span>
                    <div id="seeyouBg"></div>
                </div>
                <div className="center">
                    <div ref={shapesWrapElem} id="shapesWrap"></div>
                    <div id="character1" className="character">
                        <div className="wrap">
                            <div className="eyes"><span></span><span></span></div>
                            <div id="pointer">
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                    <div id="character2" className="character">
                        <div className="wrap">
                            <div className="eyes"><span></span><span></span></div>
                            <div id="qrcode">
                                <QRCode value={'https://google.com'} renderAs="svg" includeMargin={true}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Game;