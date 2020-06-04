import React from 'react';
import gsap from 'gsap';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
// import webSocket from 'socket.io-client';
// import { useSelector } from 'react-redux';

export const promoAnim = () => {
    promoOpeningIn();
}
let tl = null;
gsap.registerPlugin(MotionPathPlugin);
const promoOpeningIn = () => {
    tl = gsap.timeline();

    tl.to(['#promotion #leftbg span', '#promotion #rightbg span'], 1, {force3D:true, y:'0%', ease:'power4.inOut'},'_1');
    tl.set({}, {}, '+=.1');
    tl.to('#promotion #text1', 1.3, {motionPath: {
        path:[
            {x:-500, y:1000}, {x:-500, y:-100}, 
            {x:0, y:0}, {x:0, y:0}
        ],
        type: "cubic"}, ease:'power4.out'
    },'_2');
    tl.to('#promotion #text2', 1.3, {force3D:true, motionPath: {
        path:[
            {x:500, y:1000}, {x:500, y:-100}, 
            {x:0, y:0}, {x:0, y:0}
        ],
        type: "cubic"}, ease:'power4.out'
    },'_2+=.3');
    tl.to('#promotion #character1', 1, {force3D:true, motionPath: {
        path:[
            {x:-500, y:-500}, {x:100, y:-500}, 
            {x:0, y:0}, {x:0, y:0}
        ],
        type: "cubic"}, ease:'power4.out'
    },'_2+=.5');
    tl.to('#promotion #character2', 1, {force3D:true, motionPath: {
        path:[
            {x:500, y:-300}, {x:-100, y:-100}, 
            {x:0, y:0}, {x:0, y:0}
        ],
        type: "cubic"}, ease:'power4.out'
    },'_2+=.6');
    tl.to('#promotion #shape', 1, {force3D:true, motionPath: {
        path:[
            {x:-200, y:500}, {x:-100, y:0}, 
            {x:0, y:0}, {x:0, y:0}
        ],
        type: "cubic"}, ease:'power4.out'
    },'_2+=.8');
    tl.to('#promotion #cutline span', 3, {force3D:true, y:0, ease:'power4.inOut'},'_2');
    tl.to('#promotion #cutline #cutter', .3, {autoAlpha:1, ease:'power1.inOut'},1.3);
    tl.to('#promotion #cutline #cutter', .8, {force3D:true, y:'-=130%', ease:'power2.inOut'},1.3);
    tl.to('#promotion #cutline #cutter', .8, {y:'-=130%', ease:'power2.inOut'},2.1);
    tl.to('#promotion #cutline #cutter', .8, {y:'-=130%', ease:'power2.inOut'},2.9);
    tl.to('#promotion #cutline #cutter', .8, {y:'-=130%', ease:'power2.inOut'},3.7);
    tl.to('#promotion #cutline #cutter', .8, {y:'-=130%', ease:'power2.inOut'},4.5);
    tl.to('#promotion #cutline #cutter', .8, {y:'-=130%', ease:'power2.inOut'},5.3);
    tl.to('#promotion #cutline #cutter', .3, {autoAlpha:0, ease:'power1.inOut'},5.3);
    tl.call(()=>promoOpeningOut(), null);
}

const promoOpeningOut = () => {
    tl = gsap.timeline();
    tl.to('#promotion #cutline > span', 1, {y:'-100%', ease:'power4.inOut'},'_1');
    tl.to('#promotion #cutline span span', 1, {y:'100%', ease:'power4.inOut'},'_1');
    tl.to('#promotion #character1', 1, {x:-500, y:-500, ease:'power4.inOut'},'_1+=.1');
    tl.to('#promotion #character2', 1.3, {x:800, y:-200, ease:'power4.inOut'},'_1+=.4');
    tl.to('#promotion #shape', 1.3, {x:-200, y:600, ease:'power4.inOut'},'_1+=.5');
    tl.to('#promotion #text2', 1, {motionPath: {
        path:[
            {x:0, y:0}, {x:100, y:100}, 
            {x:500, y:200}, {x:1000, y:200}
        ],
        type: "cubic"}, ease:'power4.inOut'
    },'_1+=.2');
    tl.to('#promotion #text1', 1.3, {motionPath: {
        path:[
            {x:0, y:0}, {x:-100, y:-100}, 
            {x:-1000, y:-200}, {x:-1300, y:-200}
        ],
        type: "cubic"}, ease:'power4.inOut'
    },'_1+=.3');
    tl.call(()=>promoFrameIn(), null);
}

const promoFrameIn = () => {
    tl = gsap.timeline();
    tl.to('#promotion #name #icon', 1, {force3D:true, scale:.5, ease:'elastic.out(1, 0.5)'},'_1');
    tl.to('#promotion #name span span', .6, {force3D:true, y:0, stagger:.03, ease:'power3.out'},'_1');
    tl.set('#promotion #name #eyes', {autoAlpha:1},'_1+=.6');

    if(document.querySelector('#promotion #frame1')){
        tl.to('#promotion .frame', .3, {autoAlpha:0, ease:'power1.inOut'},'_2-=1');
        tl.to('#promotion #frame1', .3, {autoAlpha:1, ease:'power1.inOut'},'_2-=.7');
        tl.to('#promotion #discount #center', 3, {force3D:true, y:'-94.7%', ease:'power4.inOut'},'_2-=.4');
        tl.to('#promotion #frame1 p', .3, {autoAlpha:0, ease:'power1.inOut'},'_2+=3.3');
        tl.to('#promotion #frame1 .tc', .3, {autoAlpha:1, ease:'power1.inOut'},'_2+=3.6');
    }
    if(document.querySelector('#promotion #frame2')){
        if(document.querySelector('#promotion #frame1')) tl.set({}, {}, '+=5');
        tl.to('#promotion .frame', .3, {autoAlpha:0, ease:'power1.inOut'},'_3-=1');
        tl.to('#promotion #frame2', .3, {autoAlpha:1, ease:'power1.inOut'},'_3-=.7');
        tl.to('#promotion #frame2 p', .3, {autoAlpha:0, ease:'power1.inOut'},'_3+=3.3');
        tl.to('#promotion #frame2 .tc', .3, {autoAlpha:1, ease:'power1.inOut'},'_3+=3.6');
    }
    if(document.querySelector('#promotion #frame3')){
        if(document.querySelector('#promotion #frame1') || document.querySelector('#promotion #frame2')) tl.set({}, {}, '+=5');
        tl.to('#promotion .frame', .3, {autoAlpha:0, ease:'power1.inOut'},'_4-=1');
        tl.to('#promotion #frame3', .3, {autoAlpha:1, ease:'power1.inOut'},'_4-=.7');
        tl.to('#promotion #frame3 p', .3, {autoAlpha:0, ease:'power1.inOut'},'_4+=3.3');
        tl.to('#promotion #frame3 .tc', .3, {autoAlpha:1, ease:'power1.inOut'},'_4+=3.6');
    }
    tl.call(()=>promoFrameOut(), null, '+=5');
}

const promoFrameOut = () => {
    tl = gsap.timeline();
    tl.to('#promotion #name #icon', 1, {scale:0, ease:'back.out(2)'},'_1');
    tl.to('#promotion #name span span', .6, {y:'100%', stagger:.03, ease:'power3.in'},'_1');
    tl.to('#promotion .frame', .3, {autoAlpha:0, ease:'power1.inOut'},'_1');
    tl.to('#promotion #leftbg span', 1, {y:'100%', ease:'power4.inOut'},'_1');
    tl.to('#promotion #rightbg span', 1, {y:'-100%', ease:'power4.inOut'},'_1');
    document.querySelector('video') && tl.call(()=>document.querySelector('video').play(), null,'_1');
    tl.set('#promotion', {className:''});
}

export const stopPromoAnim = () => {
    if(tl) tl.kill();
}

const Promotion = props => {
    return (
        <div id="promotion" className="">
            <div id="name">
                <div id="icon"><div id="eyes"><span></span><span></span></div></div>
                <span>
                    {
                        props.promoData &&
                        props.promoData.title.split('').map((v,i)=>{
                            return <span key={i} dangerouslySetInnerHTML={{__html: v.replace(' ','&nbsp;')}}></span>
                        })
                    }
                </span>
            </div>
            {
                props.promoData &&
                props.promoData.type === 1 &&
                <div id="frame1" className="frame">
                <div id="discount">
                    <div>{props.promoData.discount.split('')[0]}</div>
                    <div>
                        {props.promoData.discount.split('')[1]}
                        <div id="centerWrap">
                            <div id="center">
                                {
                                    [...Array(10)].map((v,i)=>{
                                        const rand = Math.round(Math.random()*9);
                                        return <span key={i}>
                                            <span>{i === 9 ? props.promoData.discount.split('')[1] : rand}</span>
                                            <span className="c">{i === 9 ? props.promoData.discount.split('')[1] : rand}<div id="eyes"><span></span><span></span></div></span>
                                        </span>
                                    })
                                }
                                <span>{props.promoData.discount.split('')[1]}</span>
                            </div>
                        </div>
                    </div>
                    <div>%<span id="off">off</span></div>
                </div>
                <p dangerouslySetInnerHTML={{__html:props.promoData.description.en}}></p>
                <p className="tc" dangerouslySetInnerHTML={{__html:props.promoData.description.zh}}></p>
            </div>
            }
            {
                props.promoData &&
                props.promoData.type === 2 &&
                <div id="frame2" className="frame">
                    <div id="image" style={{backgroundImage:`url(${props.promoData.media})`}}></div>
                    <p dangerouslySetInnerHTML={{__html:props.promoData.description.en}}></p>
                    <p className="tc" dangerouslySetInnerHTML={{__html:props.promoData.description.zh}}></p>
                </div>
            }
            {
                props.promoData &&
                props.promoData.type === 3 &&
                <div id="frame3" className="frame">
                    <p dangerouslySetInnerHTML={{__html:props.promoData.description.en}}></p>
                    <p className="tc" dangerouslySetInnerHTML={{__html:props.promoData.description.zh}}></p>
                </div>
            }
            <div id="bg">
                <div id="outerWrap">
                    <div id="innerWrap">
                        <p id="text1">Special</p>
                        <p id="text2">Offer</p>
                        <div id="character1"><div id="eyes"><span></span><span></span></div></div>
                        <div id="character2"><div id="eyes"><span></span><span></span></div></div>
                        <div id="shape"></div>
                        <div id="cutline">
                            <div id="cutter">
                                <svg version="1.1" id="圖層_1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 162.4 179.7">
                                    <g id="leftcut">
                                        <path className="important" fill="#fff" d="M3028 3104.1c3.3 7.5 12 10.9 19.5 7.6 7.5-3.3 10.9-12 7.6-19.5-3.3-7.5-12-10.9-19.5-7.6-3.6 1.6-6.4 4.5-7.8 8.1-1.5 3.7-1.4 7.8.2 11.4zm17.2-15.3c5.2 2 7.7 7.9 5.7 13-2 5.2-7.9 7.7-13 5.7-5.2-2-7.7-7.9-5.7-13s7.8-7.7 13-5.7z" transform="translate(-2937.894 -2948.622)"/>
                                        <path className="important" fill="#fff" d="M3015.4 3056.2c-.1 1.7-1.9 38.3-2 40l-.1 1.6c-.1 10.1 5.2 19.5 14 24.6 1.2.7 2.5 1.4 3.9 1.9 14.5 5.7 30.8-1.4 36.5-15.9 6.2-15.8-4.2-31.5-15.9-36.5-6-2.6-11.7-2.1-15.1-1.5 2-39.8 4-79.6 6-119.3-.1-.2-.8-2.4-2.3-2.5h-.5l-5.3.8c-8.2 1.1-14.4 7.9-14.8 16.1-1.1 21.3-2.1 42.6-3.2 63.9.1.8-1.1 26-1.2 26.8zm19.4 19.6c5-1.5 10.4-1.3 15.2.6 12 4.7 17.9 18.3 13.2 30.3s-18.3 17.9-30.3 13.2c-9-3.5-14.9-12.3-14.8-22l1.5-30.7 12.5-.2-.3 6.3c0 .8.3 1.5.9 2 .6.6 1.4.7 2.1.5zm.5-121.7l2.5-.4-5.5 108.6-12.5.2 4.8-96.7c.3-6 4.8-10.9 10.7-11.7z" transform="translate(-2937.894 -2948.622)"/>
                                    </g>
                                    <g id="rightcut">
                                        <path className="important" fill="#fff" d="M2977.5 3063.3c2.5-3 3.7-6.9 3.3-10.8-.8-8.1-8-14.1-16.2-13.3-8.1.8-14.1 8-13.3 16.2.8 8.1 8 14.1 16.2 13.3 3.9-.4 7.5-2.3 10-5.4zm-5.1-17.1c4.3 3.5 4.9 9.8 1.4 14.1s-9.8 4.9-14.1 1.4-4.9-9.8-1.4-14.1c3.5-4.3 9.8-4.9 14.1-1.4z" transform="translate(-2937.894 -2948.622)"/>
                                        <path className="important" fill="#fff" d="M3038.1 3041.9c18.1-11.3 36.1-22.7 54.2-34 7-4.4 9.9-13.1 6.8-20.8l-1.9-5c-.1-.2-.1-.3-.2-.4-.8-1.2-3-.8-3.3-.7-33.7 21.2-67.5 42.4-101.2 63.6-1.1-3.2-3.6-8.5-8.7-12.4-10.1-7.8-28.9-9.2-39.6 4-9.8 12-8.1 29.8 4 39.6 1.1.9 2.3 1.7 3.6 2.5 8.7 5.1 19.5 5.2 28.3.1l1.4-.9c1.5-.9 32.5-20.4 34-21.3.6-.4 22-13.8 22.6-14.3zm-49.3 6.9c.2.8.7 1.4 1.4 1.7s1.5.2 2.2-.2l5.3-3.4 5.9 11-26.1 16.3c-8.4 4.8-18.9 3.9-26.4-2.2-10-8.2-11.5-22.9-3.3-32.9s22.9-11.5 32.9-3.3c4.2 3.4 7 7.9 8.1 13zm105.9-59.9c2.2 5.5.1 11.9-4.9 15l-82.1 51.5-5.9-11 92-57.8.9 2.3z" transform="translate(-2937.894 -2948.622)"/>
                                    </g>
                                    <path fill="#fff" d="M91.7 86.7c-.4-1.3-1.6-2-2.9-1.7-.6.2-1.1.6-1.4 1.1s-.4 1.2-.3 1.8c.3 1.3 1.6 2 2.9 1.7.1-.1.3-.1.4-.2s.3-.2.4-.3l.3-.3c.1-.1.2-.3.3-.4.4-.5.5-1.1.3-1.7z"/>
                                </svg>                                
                            </div>
                            <span><span></span></span>
                        </div>
                        <div id="leftbg"><span></span></div>
                        <div id="rightbg"><span></span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Promotion;