import React, {useEffect, useState, useRef} from 'react';
import gsap from 'gsap';
import './style.scss';

import Game from '../Game';
import introvideo from './images/intro.mp4';

const Introarea = (props) => {
    const [tagSize, setTagSize] = useState(null);

    const video = useRef(null);
    const whatisthetrend = useRef(null);
    const tag = useRef(null);
    const trendofbrand = useRef(null);

    useEffect(()=>{
    },[]);

    useEffect(()=>{
        if(video && tagSize){
            // trendAnim();
            brandAnim();
            video.current.onended = () => {
                whatisthetrend.current.className = 'active';
            };
        }
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

    const brandAnim = () => {
        const tl = gsap.timeline({delay:1.3});
        tl.to('#trendofbrand #frame1 p', .3, {autoAlpha:1, ease:'power1.inOut'},'s');
        tl.fromTo('#trendofbrand #frame1 p:nth-child(1)', .8, {force3D:true, y:'-10%'},{y:0, ease:'power3.out'},'s');
        tl.fromTo('#trendofbrand #frame1 p:nth-child(2)', .8, {force3D:true, y:'10%'},{y:0, ease:'power3.out'},'s');
        tl.to('#trendofbrand #a', .3, {autoAlpha:0, ease:'power1.inOut'},'+=.6');
        tl.to('#trendofbrand #search', 1, {width: 800/1920*100+'vw', ease:'power3.inOut'},'b');
        tl.to('#trendofbrand #frame1 p:nth-child(1)', 1, {x:'-16.5%', ease:'power3.inOut'},'b');
        tl.to('#trendofbrand #bar', .3, {autoAlpha:1, ease:'power1.inOut'},'b+=.3');
        // tl.to('#trendofbrand #bar .text', .6, {autoAlpha:.1, ease:'power1.inOut'},'-=.3');
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
            <div ref={trendofbrand} id="trendofbrand" className="active">
                <div id="container">
                    <div id="character"></div>
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
            <Game />
        </div>
    )
}

export default Introarea;