import React, {useEffect, useState, useRef} from 'react';
import gsap from 'gsap';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
import './style.scss';

import Game from '../Game';
import ParticlesAnim from '../Game/particles';
import introvideo from './images/intro.mp4';

const Introarea = (props) => {
    const [tagSize, setTagSize] = useState(null);

    const video = useRef(null);
    const whatisthetrend = useRef(null);
    const tag = useRef(null);
    const trendofbrand = useRef(null);
    const shapesWrapElem = useRef(null);
    const shapesWrap2Elem = useRef(null);

    useEffect(()=>{
        // if(video && tagSize){
            const particlesAnim = new ParticlesAnim(shapesWrapElem.current, true);
            const particlesAnim2 = new ParticlesAnim(shapesWrap2Elem.current, true);
            // trendAnim();
            gsap.registerPlugin(MotionPathPlugin);
            // brandAnim(particlesAnim, particlesAnim2);
            brandAnimPart2(particlesAnim2);
            video.current.onended = () => {
                whatisthetrend.current.className = 'active';
            };
        // }
    },[]);

    useEffect(()=>{
        
    }, [video, tagSize]);

    useEffect(()=>{
        setTagSize(1920/tag.current.offsetWidth);
    }, [tag])

    
    const trendAnim = () => {
        const tl = gsap.timeline({delay:1.3});
        tl.to('#whatisthetrend #frame1 p', .3, {autoAlpha:1, ease:'power1.inOut'},'s');
        tl.fromTo('#whatisthetrend #frame1 p:nth-child(1)', .8, {force3D:true, x:'-4%', y:'-10%'},{y:0, ease:'power3.out'},'s');
        tl.fromTo('#whatisthetrend #frame1 p:nth-child(2)', .8, {force3D:true, y:'10%'},{y:0, ease:'power3.out'},'s');
        tl.to('#whatisthetrend #a', .3, {autoAlpha:0, ease:'power1.inOut'},'+=.6');
        tl.to('#whatisthetrend #search', 1, {width: 700/1920*100+'vw', ease:'power3.inOut'},'b');
        tl.to('#whatisthetrend #bar', .3, {autoAlpha:1, ease:'power1.inOut'},'b+=.3');
        // tl.to('#whatisthetrend #bar .text', .6, {autoAlpha:.1, ease:'power1.inOut'},'-=.3');
        tl.to('#whatisthetrend #frame1 p', .6, {autoAlpha:0, ease:'power1.inOut'},'+=2');
        tl.fromTo('#whatisthetrend #tag span', .8, {force3D:true, y:'-87%'}, {y:0, stagger:.03, ease:'power3.out'},'+=.1');
    }

    const brandAnim = (particlesAnim, particlesAnim2) => {
        const tl = gsap.timeline({delay:1.3});
        tl.to('#trendofbrand #character', 1.3, {force3D:true, motionPath: {
            path:[
                {x:0, y:window.innerHeight*2}, {x:window.innerWidth*.2, y:-window.innerHeight*.5}, 
                {x:window.innerWidth/2, y:window.innerHeight/2}, {x:window.innerWidth/2, y:window.innerHeight/2}
            ], 
            type: "cubic"}, ease:'power4.out'
        },'_1');
        tl.fromTo('#trendofbrand #character', 1, {scale:0, rotation:30}, {scale:1, rotation:0, ease:'power2.out'},'_1');
        tl.to('#trendofbrand #character', 1, {motionPath: {
            path:[
                {x:window.innerWidth/2, y:window.innerHeight/2}, {x:window.innerWidth/2, y:window.innerHeight/2}, 
                {x:window.innerWidth*.6, y:0}, {x:window.innerWidth*.7, y:window.innerHeight*.22}
            ], 
            type: "cubic"}, ease:'power4.out'
        },'_2+=.3');

        tl.to('#trendofbrand #character', 1, {scale:.35, rotation:35, ease:'power3.out'},'_2+=.3');
        tl.to('#trendofbrand #frame1', .3, {autoAlpha:1, ease:'power1.inOut'},'_2+=.3');
        tl.fromTo('#trendofbrand #frame1 p:nth-child(1)', .8, {force3D:true, y:'-10%'},{y:0, ease:'power3.out'},'_2+=.3');
        tl.fromTo('#trendofbrand #frame1 p:nth-child(2)', .8, {force3D:true, y:'10%'},{y:0, ease:'power3.out'},'_2+=.3');
        tl.to('#trendofbrand #a', .3, {autoAlpha:0, ease:'power1.inOut'},'+=.6');
        tl.to('#trendofbrand #search', 1, {width: 800/1920*100+'vw', ease:'power3.inOut'},'_3');
        tl.to('#trendofbrand #frame1 p:nth-child(1)', 1, {x:'-16.5%', ease:'power3.inOut'},'_3');
        tl.to('#trendofbrand #bar', .3, {autoAlpha:1, ease:'power1.inOut'},'_3+=.3');

        // to bag
        tl.to('#trendofbrand #frame1', .3, {autoAlpha:0, ease:'power1.inOut'},'_4+=.6');
        tl.to('#trendofbrand #character', 1, {force3D:true, motionPath: {
            path:[
                {x:window.innerWidth*.7, y:window.innerHeight*.22}, {x:window.innerWidth*.5, y:window.innerHeight*.22},
                {x:window.innerWidth/2, y:window.innerHeight*1.1}, {x:window.innerWidth/2, y:window.innerHeight*1.1}
            ], 
            type: "cubic"}, ease:'power4.inOut'
        },'_4+=.6');
        tl.to('#trendofbrand #character', 1, {scale:1.3, rotation:12, ease:'power4.inOut'},'_4+=.6');
        tl.to('#trendofbrand #character #main', 1, {skewY:5, ease:'power4.inOut'},'_4+=.6');
        tl.to('#trendofbrand #character #handle1', .6, {scaleY:1.3, ease:'back.out(3)'},'_5');
        tl.to('#trendofbrand #character #handle2', .6, {scaleY:1.3, ease:'back.out(3)'},'_5-=.1');

        tl.set('#trendofbrand #character #eyes', {autoAlpha:0},'_6');
        tl.to('#trendofbrand #character', 1, {scaleX:1.5, scaleY:1.1, y:window.innerHeight*1.2, ease:'power3.out'},'_6');
        tl.to('#trendofbrand #character', 1, {scaleX:1.3, scaleY:1.3, y:window.innerHeight*1.1, ease:'elastic.out(1.5, 0.3)'},'_6+=.6');

        // pop shape
        tl.call(()=>particlesAnim.start(), null, '_6+=.45');
        tl.set('#trendofbrand #fixedShapes', {autoAlpha:1},'_7');
        tl.to('#trendofbrand #shape1', 1, {rotation:-360, motionPath: {
            path:[
                {x:window.innerWidth*.4, y:window.innerHeight*.8}, {x:window.innerWidth*.4, y:window.innerHeight*.5}, 
                {x:window.innerWidth*.2, y:window.innerHeight*.41}, {x:window.innerWidth*.2, y:window.innerHeight*.41}
            ], 
            type: "cubic"}, ease:'power3.out'
        },'_7');
        tl.to('#trendofbrand #line1 span', .6, {force3D:true, y:0, ease:'power4.out'},'_7+=.6');
        tl.to('#trendofbrand #shape2', 1, {rotation:360, motionPath: {
            path:[
                {x:window.innerWidth*.5, y:window.innerHeight*.8}, {x:window.innerWidth*.5, y:window.innerHeight*.5}, 
                {x:window.innerWidth*.54, y:window.innerHeight*.05}, {x:window.innerWidth*.54, y:window.innerHeight*.05}
            ], 
            type: "cubic"}, ease:'power3.out'
        },'_7+=.3');
        tl.to('#trendofbrand #line2 span', .6, {force3D:true, y:0, ease:'power4.out'},'_7+=.6');
        tl.to('#trendofbrand #shape3', 1, {rotation:360, motionPath: {
            path:[
                {x:window.innerWidth*.6, y:window.innerHeight*.8}, {x:window.innerWidth*.6, y:window.innerHeight*.5}, 
                {x:window.innerWidth*.81, y:-window.innerHeight*.4}, {x:window.innerWidth*.81, y:-window.innerHeight*.4}
            ], 
            type: "cubic"}, ease:'power3.out'
        },'_7+=.6');

        tl.set('#trendofbrand', {className:'active out'},'+=5');
        tl.set('#trendofbrand', {className:''},'+=1');
        tl.call(()=>particlesAnim.stop(), null);
        
        // part 2
        tl.set('#trendofbrandpart2', {className:'active'},'-=1');
        tl.call(()=>{particlesAnim.stop(); brandAnimPart2(particlesAnim2);}, null);
    }

    const brandAnimPart2 = (particlesAnim2) => {
        const tl = gsap.timeline({delay:1});

        tl.call(()=>particlesAnim2.start(), null);
        tl.set('#trendofbrandpart2 #character1', {force3D:true, scale:1},'_1');
        tl.to('#trendofbrandpart2 #frame1', .3, {autoAlpha:1, ease:'power1.inOut'},'_1');
        tl.to('#trendofbrandpart2 #image', 1, {force3D:true, rotation:4, scale:1, ease:'elastic.out(1, 0.5)'},'_1');
        tl.to('#trendofbrandpart2 #character1', 1, {force3D:true, x:0, y:0, ease:'power4.out'},'_1');
        tl.to('#trendofbrandpart2 #character2', .6, {force3D:true, x:0, y:0, ease:'power2.out'},'_1+=.3');

        tl.to('#trendofbrandpart2 #shapesWrap', .3, {autoAlpha:0, ease:'power1.inOut'},'_2');
        tl.to('#trendofbrandpart2 #frame1', .3, {autoAlpha:0, ease:'power1.inOut'},'_2');
        tl.set('#trendofbrandpart2 #frame2', {autoAlpha:1},'_2');
        tl.to('#trendofbrandpart2 #character1', .6, {x:'30%', y:'43%', scale:1.72, ease:'power4.out'},'_2');
        tl.to('#trendofbrandpart2 #character1 #eyes', 1, {x:'30%', y:'50%', ease:'power3.inOut'},'_2+=.3');

        tl.to('#trendofbrandpart2 #frame2 #rateline span', 1, {force3D:true, x:'0', ease:'none'},'_3');
        tl.to('#trendofbrandpart2 #frame2 #rateline .point', 1, {force3D:true, scale:1, stagger:.3, ease:'elastic.out(1, 0.3)'},'_3');
    }

    return(
        <div id="intro">
            <video ref={video} autoPlay muted>
                <source src={introvideo} type="video/mp4" />
            </video>
            <div ref={whatisthetrend} id="whatisthetrend" className="">
                <div id="container">
                    <div id="frame1" className="frame">
                        <p>
                            Wh
                            <span id="search">
                                <span id="a">a</span>
                                <span id="bar">
                                    {
                                        // [...Array(6)].map((v,i)=>{
                                        //     return <span key={i} id={`text${i}`} className="text">
                                        //     {
                                        //         '??'.split('').map((v,i)=>{
                                        //             return <span key={i}>{v}</span>
                                        //         })
                                        //     }
                                        //     </span>
                                        // })
                                    }
                                </span>
                            </span>
                            t
                        </p>
                        <p>is the trend</p>
                    </div>
                    <div id="frame2" className="frame">
                        <p ref={tag} id="tag">
                            {
                                '#Skincare'.split('').map((v,i)=>{
                                    return <span key={i} style={{fontSize:tagSize/11+'vw'}}>{v}</span>
                                })
                            }
                        </p>
                    </div>
                </div>
            </div>
            <div ref={trendofbrand} id="trendofbrand" className="">
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
                        <div id="shape2"><span>The Ordinary.</span></div>
                        <div id="shape3"><div id="eyes"><span></span><span></span></div></div>
                        <div id="line1"><span><span></span></span></div>
                        <div id="line2"><span><span></span></span></div>
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
            <div ref={trendofbrand} id="trendofbrandpart2" className="active">
                <div id="container">
                    <div ref={shapesWrap2Elem} id="shapesWrap">
                    </div>
                    <div id="name"><span>The Ordinary.</span></div>
                    <div id="character1">
                        <div id="eyes"><span></span><span></span></div>
                    </div>
                    <div id="character2">
                        <div id="eyes"><span></span><span></span></div>
                    </div>
                    <div id="frame1" className="frame">
                        <div id="image"><div></div></div>
                        <div id="des">
                            <p>The Ordinary is a brand that is specialised in materials chemistry and biochemistry with integrity.</p>
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
                            <li>
                                <div className="wrap">
                                    <div>No. of<br/>followers</div>
                                    <div className="value">10k</div>
                                </div>
                                <span></span>
                            </li>
                            <li>
                                <div className="wrap">
                                    <div>No. of<br/>likes</div>
                                    <div className="value">110k</div>
                                </div>
                                <span></span>
                            </li>
                            <li>
                                <div className="wrap">
                                    <div>No. of<br/>post</div>
                                    <div className="value up">31%</div>
                                </div>
                                <span></span>
                            </li>
                            <li>
                                <div className="wrap">
                                    <div>No. of<br/>comments</div>
                                    <div className="value up">31%</div>
                                </div>
                                <span></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <Game />
        </div>
    )
}

export default Introarea;