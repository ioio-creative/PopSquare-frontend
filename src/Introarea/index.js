import React, {useEffect, useState, useRef} from 'react';
import { useSelector } from 'react-redux';
import gsap from 'gsap';
import webSocket from 'socket.io-client';
import './style.scss';

import Promotion, { promoAnim, stopPromoAnim } from '../Promotion';
import Game from '../Game';
import ParticlesAnim from '../Game/particles';
import introvideo from './images/intro.mp4';
import sound_bgm from './sounds/popsq_BGM.mp3';

const Introarea = () => {
    const gameStarted = useSelector(state => state.gameStarted);

    const [socket,setSocket] = useState(null);
    const [trandData, setTrandData] = useState(null);
    const [promoData, setPromoData] = useState(null);

    const video = useRef(null);
    const whatisthetrend = useRef(null);
    const tag = useRef(null);
    // const trendofbrand = useRef(null);
    const shapesWrapElem = useRef(null);
    const shapesWrap2Elem = useRef(null);
    const killAnimFunc = useRef(null);
    const getTrendDataFunc = useRef(null);
    const getPromoDataFunc = useRef(null);
    const stopBgmFunc = useRef(null);
    const trendAnimFunc = useRef(null);

    useEffect(()=>{
        // let loaded = false;

        const getTrendData = () => {
            if(socket) socket.emit('getTrendData', initTrendData);
        }
        getTrendDataFunc.current = {getTrendData};

        const initTrendData = (data) => {
            setTrandData(data); console.log('trend data',data);
            trendAnimFunc.current.trendAnim();
        }
        
        const getPromoData = () => {
            if(socket) socket.emit('getPromotionData', initPromoData);
        }
        getPromoDataFunc.current = {getPromoData};

        const initPromoData = (data) => {
            setPromoData(data); console.log('promotion data',data);
        }

        if(socket){
            // getTrendData();
            // getPromoData();
        }else{
            setSocket(webSocket('http://10.0.1.40:8080/'));
        }

        return ()=>{
            if(socket){
                socket.off('getTrendData', initTrendData);
                socket.off('getPromotionData', getPromoData);
            }
        }
    },[socket])

    useEffect(()=>{
        let tl;
        const bgmSound = new Audio(sound_bgm);

        video.current.onplay = () => {
            bgmSound.volume = 1;
            bgmSound.currentTime = 0;
            bgmSound.play();
            bgmSound.loop = true;
        }
        video.current.onended = () => {
            stopBgm();
            getTrendDataFunc.current.getTrendData();
            getPromoDataFunc.current.getPromoData();
        };

        const trendAnim = () => {
            whatisthetrend.current.className = 'active';
            gsap.set('#intro *:not(.important)', {clearProps:true});
            
            tl = gsap.timeline();
            tl.set('#whatisthetrend #tag span', {force3D:true, y:'-200%'});
            tl.set('#whatisthetrend #character', {force3D:true, rotation:35});
            tl.set({}, {}, '+=1.3');
            tl.to('#whatisthetrend #character', 1, {scale:.3, ease:'elastic.out(1.5, 0.3)'},'s');
            tl.to('#whatisthetrend #frame1 p', .3, {autoAlpha:1, ease:'power1.inOut'},'s');
            tl.fromTo('#whatisthetrend #frame1 p:nth-child(1)', .8, {force3D:true, x:'-4%', y:'-10%'},{y:0, ease:'power3.out'},'s');
            tl.fromTo('#whatisthetrend #frame1 p:nth-child(2)', .8, {force3D:true, y:'10%'},{y:0, ease:'power3.out'},'s');
            tl.to('#whatisthetrend #a', .3, {autoAlpha:0, ease:'power1.inOut'},'+=.6');
            tl.to('#whatisthetrend #search', 1, {width: 700/1920*100+'vw', ease:'power3.inOut'},'b');
            tl.to('#whatisthetrend #bar', .3, {autoAlpha:1, ease:'power1.inOut'},'b+=.3');
            tl.to('#whatisthetrend #frame1 p', .6, {autoAlpha:0, ease:'power1.inOut'},'+=2');
            tl.to('#whatisthetrend #tag span', .8, {y:'0%', stagger:.03, ease:'power3.out'},'c+=.1');
            tl.to('#whatisthetrend #character', .6, {x:'13vw', y:'60vh', rotation:0, scale:0, ease:'power3.inOut'},'c+=.3');
            tl.to(['#whatisthetrend #frame2 #line', '#whatisthetrend #frame2 #linebg'], .8, {force3D:true, scaleX:1, stagger:.08, ease:'power3.inOut'},'c+=.7');
            
            tl.set('#whatisthetrend', {className:'active out'},'+=5');
            tl.set('#whatisthetrend', {className:''},'+=1');
            
            // part 1
            tl.set('#trendofbrand', {className:'active'},'-=1');
            tl.call(()=>brandAnim(), null);
        }
        trendAnimFunc.current = {trendAnim};
    
        const brandAnim = () => {
            const particlesAnim = new ParticlesAnim(shapesWrapElem.current, true);
            video.current.currentTime = 0;
    
            // tl.set({}, {}, '+=.6');
            tl.to('#trendofbrand #character', 1.3, {force3D:true, motionPath: {
                path:[
                    {x:0, y:window.innerHeight*2}, {x:window.innerWidth*.2, y:-window.innerHeight*.5}, 
                    {x:window.innerWidth/2, y:window.innerHeight/2}, {x:window.innerWidth/2, y:window.innerHeight/2}
                ], 
                type: "cubic"}, ease:'power4.out'
            },'_1.1');
            tl.fromTo('#trendofbrand #character', 1, {scale:0, rotation:30}, {scale:1, rotation:0, ease:'power2.out'},'_1.1');
            tl.to('#trendofbrand #character', 1, {motionPath: {
                path:[
                    {x:window.innerWidth/2, y:window.innerHeight/2}, {x:window.innerWidth/2, y:window.innerHeight/2}, 
                    {x:window.innerWidth*.6, y:0}, {x:window.innerWidth*.7, y:window.innerHeight*.22}
                ], 
                type: "cubic"}, ease:'power4.out'
            },'_1.2+=.3');
    
            tl.to('#trendofbrand #character', 1, {scale:.35, rotation:35, ease:'power3.out'},'_1.2+=.3');
            tl.to('#trendofbrand #frame1', .3, {autoAlpha:1, ease:'power1.inOut'},'_1.2+=.3');
            tl.fromTo('#trendofbrand #frame1 p:nth-child(1)', .8, {force3D:true, y:'-10%'},{y:0, ease:'power3.out'},'_1.2+=.3');
            tl.fromTo('#trendofbrand #frame1 p:nth-child(2)', .8, {force3D:true, y:'10%'},{y:0, ease:'power3.out'},'_1.2+=.3');
            tl.to('#trendofbrand #a', .3, {autoAlpha:0, ease:'power1.inOut'},'+=.6');
            tl.to('#trendofbrand #search', 1, {width: 800/1920*100+'vw', ease:'power3.inOut'},'_1.3');
            tl.to('#trendofbrand #frame1 p:nth-child(1)', 1, {x:'-16.5%', ease:'power3.inOut'},'_1.3');
            tl.to('#trendofbrand #bar', .3, {autoAlpha:1, ease:'power1.inOut'},'_1.3+=.3');
    
            // to bag
            tl.to('#trendofbrand #frame1', .3, {autoAlpha:0, ease:'power1.inOut'},'_1.4+=.6');
            tl.to('#trendofbrand #character', 1, {force3D:true, motionPath: {
                path:[
                    {x:window.innerWidth*.7, y:window.innerHeight*.22}, {x:window.innerWidth*.5, y:window.innerHeight*.22},
                    {x:window.innerWidth/2, y:window.innerHeight*1.2}, {x:window.innerWidth/2, y:window.innerHeight*1.2}
                ], 
                type: "cubic"}, ease:'power4.inOut'
            },'_1.4+=.6');
            tl.to('#trendofbrand #character', 1, {scale:1.3, rotation:12, ease:'power4.inOut'},'_1.4+=.6');
            tl.to('#trendofbrand #character #main', 1, {skewY:5, ease:'power4.inOut'},'_1.4+=.6');
            tl.to('#trendofbrand #character #handle1', .6, {scaleY:1.2, ease:'back.out(3)'},'_1.5');
            tl.to('#trendofbrand #character #handle2', .6, {scaleY:1.2, ease:'back.out(3)'},'_1.5-=.1');
    
            tl.set('#trendofbrand #character #eyes', {autoAlpha:0},'_6');
            tl.to('#trendofbrand #character', 1, {scaleX:1.5, scaleY:1.1, y:window.innerHeight*1.3, ease:'power3.out'},'_1.6');
            tl.to('#trendofbrand #character', 1, {scaleX:1.3, scaleY:1.3, y:window.innerHeight*1.2, ease:'elastic.out(1.5, 0.3)'},'_1.6+=.6');
    
            // pop shape
            tl.call(()=>particlesAnim.start(), null, '_1.6+=.45');
            tl.set('#trendofbrand #fixedShapes', {autoAlpha:1},'_1.7');
            tl.to('#trendofbrand #shape1', 1, {rotation:-360, motionPath: {
                path:[
                    {x:window.innerWidth*.4, y:window.innerHeight*.8}, {x:window.innerWidth*.4, y:window.innerHeight*.5}, 
                    {x:window.innerWidth*.2, y:window.innerHeight*.2}, {x:window.innerWidth*.2, y:window.innerHeight*.2}
                ], 
                type: "cubic"}, ease:'power3.out'
            },'_1.7');
            // tl.to('#trendofbrand #line1 span', .6, {force3D:true, y:0, ease:'power4.out'},'_1.7+=.6');
            // tl.to('#trendofbrand #line1 > span', .6, {y:'100%', ease:'power4.out'},'_1.7+=1');
            // tl.to('#trendofbrand #line1 > span span', .6, {y:'-100%', ease:'power4.out'},'_1.7+=1');
            tl.to('#trendofbrand #shape2', 1, {rotation:360, motionPath: {
                path:[
                    {x:window.innerWidth*.3, y:window.innerHeight*.8}, {x:window.innerWidth*.5, y:window.innerHeight*.5}, 
                    {x:window.innerWidth*.45, y:window.innerHeight*.05}, {x:window.innerWidth*.45, y:window.innerHeight*.05}
                ], 
                type: "cubic"}, ease:'power3.out'
            },'_1.7+=.3');
            // tl.to('#trendofbrand #line2 span', .6, {force3D:true, y:0, ease:'power4.out'},'_1.7+=.6');
            // tl.to('#trendofbrand #line2 > span', .6, {y:'100%', ease:'power4.out'},'_1.7+=1');
            // tl.to('#trendofbrand #line2 > span span', .6, {y:'-100%', ease:'power4.out'},'_1.7+=1');
            tl.to('#trendofbrand #shape3', 1, {rotation:360, motionPath: {
                path:[
                    {x:window.innerWidth*.6, y:window.innerHeight*.8}, {x:window.innerWidth*.6, y:window.innerHeight*.5}, 
                    {x:window.innerWidth*.75, y:-window.innerHeight*.3}, {x:window.innerWidth*.75, y:-window.innerHeight*.3}
                ], 
                type: "cubic"}, ease:'power3.out'
            },'_1.7+=.6');
            // tl.to('#trendofbrand #line3 span', .6, {force3D:true, y:0, ease:'power4.out'},'_1.7+=.9');
            // tl.to('#trendofbrand #line3 > span', .6, {y:'100%', ease:'power4.out'},'_1.7+=1.3');
            // tl.to('#trendofbrand #line3 > span span', .6, {y:'-100%', ease:'power4.out'},'_1.7+=1.3');
            // tl.to('#trendofbrand #shape4', 1, {rotation:-360, motionPath: {
            //     path:[
            //         {x:window.innerWidth*.5, y:window.innerHeight*.8}, {x:window.innerWidth*.5, y:window.innerHeight*.5}, 
            //         {x:window.innerWidth*.25, y:-window.innerHeight*.6}, {x:window.innerWidth*.25, y:-window.innerHeight*.6}
            //     ], 
            //     type: "cubic"}, ease:'power3.out'
            // },'_1.7+=.9');
    
            tl.set('#trendofbrand', {className:'active out'},'+=5');
            tl.set('#trendofbrand', {className:''},'+=1');
            tl.call(()=>particlesAnim.stop(), null);
            
            // part 2
            tl.set('#trendofbrandpart2', {className:'active'},'-=1');
            tl.call(()=>{particlesAnim.stop()}, null);
            tl.call(()=>{brandAnimPart2()}, null);
        }
    
        const brandAnimPart2 = () => {
            const particlesAnim2 = new ParticlesAnim(shapesWrap2Elem.current, true);
        
            tl.call(()=>particlesAnim2.start(), null);
            tl.to('#trendofbrandpart2 #name #icon', 1, {force3D:true, scale:.5, ease:'elastic.out(1, 0.5)'},'_2.1');
            tl.to('#trendofbrandpart2 #name span span', .6, {force3D:true, y:0, stagger:.03, ease:'power3.out'},'_2.1');
            tl.set('#trendofbrandpart2 #name #eyes', {autoAlpha:1},'_2.1+=.6');
            tl.set('#trendofbrandpart2 #character1', {force3D:true, scale:1},'_2.1');
            tl.to('#trendofbrandpart2 #frame1', .2, {autoAlpha:1, ease:'power1.inOut'},'_2.1');
            tl.to('#trendofbrandpart2 #image', 1, {force3D:true, rotation:4, scale:1, ease:'elastic.out(1, 0.5)'},'_2.1');
            tl.to('#trendofbrandpart2 #character1', 1, {force3D:true, x:0, y:0, ease:'power4.out'},'_2.1');
            tl.to('#trendofbrandpart2 #character2', .6, {force3D:true, x:0, y:0, ease:'power2.out'},'_2.1+=.3');
            tl.set({}, {}, '+=6');
            tl.to('#trendofbrandpart2 #des p', .3, {autoAlpha:0, ease:'power1.inOut'},'_2.11');
            tl.to('#trendofbrandpart2 #des .tc', .3, {autoAlpha:1, ease:'power1.inOut'},'_2.11+=.3');
    
            tl.set({}, {}, '+=6');
            tl.call(()=>particlesAnim2.stop(), null, '_2.2');
            tl.to('#trendofbrandpart2 #frame1', .3, {autoAlpha:0, ease:'power1.inOut'},'_2.2');
            tl.set('#trendofbrandpart2 #frame2', {autoAlpha:1},'_2.2');
            tl.to('#trendofbrandpart2 #character1', .6, {x:'80%', y:'10%', scale:1.72, ease:'power4.out'},'_2.2');
            tl.to('#trendofbrandpart2 #character1 #eyes', 1, {x:'30%', y:'50%', ease:'power3.inOut'},'_2.2+=.3');
            tl.to('#trendofbrandpart2 #character2', .6, {force3D:true, scale:0, ease:'back.in(2)'},'_2.2');
    
            tl.set('#trendofbrandpart2 #frame2 #rateline span', { x:'-100%'},'_2.3');
            tl.set('#trendofbrandpart2 #frame2 #rateline > span span', { x:'100%'},'_2.3');
            tl.to('#trendofbrandpart2 #frame2 #rateline span', 1, {force3D:true, x:'0', ease:'none'},'_2.3');
            tl.to('#trendofbrandpart2 #frame2 #rateline .point', 1, {force3D:true, scale:1, stagger:.3, ease:'elastic.out(1, 0.3)'},'_2.3');
            tl.fromTo('#trendofbrandpart2 #frame2 #list li > span', 1, {force3D:true, scaleX:0}, {scaleX:1, transformOrigin:'left', stagger:.1, ease:'power4.out'},'_2.3');
            tl.fromTo('#trendofbrandpart2 #frame2 #list li .wrap div', .8, {force3D:true, y:'-50%', autoAlpha:0}, {y:'0%', autoAlpha:1, stagger:.1, ease:'power4.out'},'_2.3');
            
            tl.set({}, {}, '+=6');
            tl.to('#trendofbrandpart2 #frame2 #list li > span', 1, {scaleX:0, transformOrigin:'right', stagger:.1, ease:'power4.out'},'_2.4');
            tl.to('#trendofbrandpart2 #frame2 #list li .wrap div', .3, {autoAlpha:0, stagger:.06, ease:'power1.out'},'_2.4');
    
            tl.to('#trendofbrandpart2 #character1', .6, {x:'0%', y:'0%', scale:1, ease:'power4.out'},'_2.5');
            tl.to('#trendofbrandpart2 #frame2 #rateline > span', 1, { x:'100%', ease:'none'},'_2.5');
            tl.to('#trendofbrandpart2 #frame2 #rateline > span span', 1, { x:'-100%', ease:'none'},'_2.5');
            tl.to('#trendofbrandpart2 #frame2 #rateline .point', .3, {scale:0, stagger:.3, ease:'back.in(2)'},'_2.5');
            
            if(trandData){
                if(trandData.description){
                    tl.set('#trendofbrandpart2 #shapesWrap', {y:'100vh'},'_2.5');
                    tl.call(()=>particlesAnim2.start(), null, '_2.5+=1');
                    tl.to('#trendofbrandpart2 #frame3', .3, {autoAlpha:1, ease:'power1.inOut'},'_2.6');
                    tl.to('#trendofbrandpart2 #character2', .6, {scale:1, ease:'elastic.out(1, 0.3)'},'_2.6');
                    tl.set({}, {}, '+=3');
                    tl.to('#trendofbrandpart2 #frame3 p', .3, {autoAlpha:0, ease:'power1.inOut'},'_2.7');
                    tl.to('#trendofbrandpart2 #frame3 .tc', .3, {autoAlpha:1, ease:'power1.inOut'},'_2.7+=.3');
                    tl.set({}, {}, '+=3');
                }
            }
    
            tl.call(()=>particlesAnim2.stop(), null);
            // if have promotion
            if(document.querySelector('#promotion')){
                tl.set('#promotion', {className:'active'});
                tl.call(()=>promoAnim(), null);
            }
            else{
                tl.call(()=>video.current.play());
                tl.set('#trendofbrandpart2', {className:'active out'});
            }
            tl.set('#trendofbrandpart2', {className:''},'+=1');
        }
        // promoAnim()
        const killAnim = () => {
            if(tl) tl.kill();
        }
        killAnimFunc.current = {killAnim}

        const stopBgm = () => {
            bgmSound.loop = false;
            gsap.to(bgmSound, 1, {volume:0, ease:'power1.inOut',
                onComplete:function(){
                    bgmSound.pause();
                }
            });
        }
        stopBgmFunc.current = {stopBgm}

        // setTimeout(()=>{
        //     gsap.set('#whatisthetrend', {className:'active'});
            // trendAnim();
        
            // gsap.set('#trendofbrand', {className:'active'});
            // tl = gsap.timeline();
            // brandAnim();
                // gsap.set('#trendofbrandpart2', {className:'active'});
                // brandAnimPart2();
        // },1000);
        
    },[]);
    
    

    useEffect(()=>{
        if(gameStarted){
            setTimeout(()=>{
                video.current.pause();
                killAnimFunc.current.killAnim();
                stopBgmFunc.current.stopBgm();
                stopPromoAnim();
            },1000);
        }
        else{
            gsap.set(['#whatisthetrend','#trendofbrand','#trendofbrandpart2','#promotion'],{className:''});
            gsap.set('#intro *:not(.important)',{clearProps:true});
            video.current.currentTime = 0;
            video.current.play();
        }
    },[gameStarted]);

    return(
        <>
            <div id="intro">
                <video ref={video} autoPlay muted>
                    <source src={introvideo} type="video/mp4" />
                </video>
                <div ref={whatisthetrend} id="whatisthetrend" className="">
                    <div id="container">
                        <div id="character">
                            <div id="main"></div>
                            <div id="eyes"><span></span><span></span></div>
                        </div>
                        <div id="frame1" className="frame">
                            <p>
                                Wh
                                <span id="search">
                                    <span id="a">a</span>
                                    <span id="bar"></span>
                                </span>
                                t
                            </p>
                            <p>is the trend</p>
                        </div>
                        <div id="frame2" className="frame">
                            <p ref={tag} id="tag">
                                {
                                    trandData && //${trandData.category}
                                    `#${trandData.category}`.split('').map((v,i)=>{
                                        const lth = `#${trandData.category}`.split('').length;
                                        const h = 1920*1.15/Math.max(6, lth)/window.innerWidth*100+'vw';
                                        const s = `calc((100vw + 16.5rem) / ${Math.max(6, lth)})`;
                                        return <span key={i} className="important" style={{fontSize:s, lineHeight:h}} dangerouslySetInnerHTML={{__html:v.replace(' ','&nbsp;')}}></span>
                                    })
                                }
                            </p>
                            <div id="line"></div>
                            <div id="linebg"></div>
                        </div>
                    </div>
                </div>
                <div id="trendofbrand" className="">
                    <div id="container">
                        <div id="character">
                            <div id="main"></div>
                            <div id="handle1" className="handle"></div>
                            <div id="handle2" className="handle"></div>
                            <div id="eyes"><span></span><span></span></div>
                        </div>
                        <div ref={shapesWrapElem} id="shapesWrap">
                        </div>
                        <div id="fixedShapes">
                            <div id="shape1"><div id="eyes"><span></span><span></span></div></div>
                            <div id="shape2"><span>{trandData && trandData.companyname}</span></div>
                            <div id="shape3"><div id="eyes"><span></span><span></span></div></div>
                            {/* <div id="shape4"></div> */}
                            <div id="line1"><span><span></span></span></div>
                            <div id="line2"><span><span></span></span></div>
                            <div id="line3"><span><span></span></span></div>
                        </div>
                        <div id="frame1" className="frame">
                            <p>Trend of</p>
                            <p>
                                Br
                                <span id="search">
                                    <span id="a">a</span>
                                    <span id="bar"></span>
                                </span>
                                nd
                            </p>
                        </div>
                    </div>
                </div>
                <div id="trendofbrandpart2" className="active">
                    <div id="container">
                        <div ref={shapesWrap2Elem} id="shapesWrap">
                        </div>
                        <div id="name">
                            <div id="icon"><div id="eyes"><span></span><span></span></div></div>
                            <span>
                                {
                                    trandData &&
                                    trandData.companyname.split('').map((v,i)=>{
                                        return <span key={i} dangerouslySetInnerHTML={{__html: v.replace(' ','&nbsp;')}}></span>
                                    })
                                }
                            </span>
                        </div>
                        <div id="character1">
                            <div id="eyes"><span></span><span></span></div>
                        </div>
                        <div id="character2">
                            <div id="eyes"><span></span><span></span></div>
                        </div>
                        <div id="frame1" className="frame">
                            {trandData && trandData.brief.image && <div id="image"><div className="important" style={{backgroundImage:`url(${trandData.brief.image})`}}></div></div>}
                            <div id="des">
                                <p dangerouslySetInnerHTML={{__html: trandData && trandData.brief.content.en}}></p>
                                <p className="tc" dangerouslySetInnerHTML={{__html: trandData && trandData.brief.content.zh}}></p>
                            </div>
                        </div>
                        <div id="frame2" className="frame">
                            <div id="rateline">
                                <div className="point"></div>
                                <div className="point"></div>
                                <div className="point"></div>
                                <div className="point"></div>
                                <span><span></span></span>
                            </div>
                            <ul id="list">
                                {
                                    trandData &&
                                    trandData.data.map((v,i)=>{
                                        return <li key={i}>
                                            <div className="wrap">
                                                <div>
                                                    <span dangerouslySetInnerHTML={{__html:v.label.en}}></span>
                                                    <span className="tc" dangerouslySetInnerHTML={{__html:v.label.zh}}></span>
                                                </div>
                                                <div className={`value ${v.value[0] === '-' ? 'down' : 'up'}`}>{v.value.replace('-','')}</div>
                                            </div>
                                            <span></span>
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                        {
                            trandData &&
                            trandData.description &&
                            <div id="frame3" className="frame">
                                <p dangerouslySetInnerHTML={{__html: trandData.description.en}}></p>
                                <p className="tc" dangerouslySetInnerHTML={{__html: trandData.description.zh}}></p>
                            </div>
                        }
                    </div>
                </div>
                {
                    promoData && <Promotion promoData={promoData} />
                }
            </div>
            <Game />
        </>
    )
}

export default Introarea;