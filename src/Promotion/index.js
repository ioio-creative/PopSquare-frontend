import React, { useEffect } from 'react';
// import gsap from 'gsap';
// import { useSelector } from 'react-redux';

// export const promotionAnimStart = () => {
//     openingIn();
// }
// let tl = null;

const Promotion = () => {
    return (
        <div id="promotion" className="">
            <div id="name">
                <div id="icon"><div id="eyes"><span></span><span></span></div></div>
                <span>
                    {
                        'The Ordinary.'.split('').map((v,i)=>{
                            return <span key={i}>{v}</span>
                        })
                    }
                </span>
            </div>
            <div id="frame1" className="frame">
                <div id="discount">
                    <div>3</div>
                    <div>
                        0
                        <div id="centerWrap">
                            <div id="center">
                                {
                                    [...Array(10)].map((v,i)=>{
                                        return <span key={i}>
                                            <span>0</span>
                                            <span className="c">0<div id="eyes"><span></span><span></span></div></span>
                                        </span>
                                    })
                                }
                                <span>0</span>
                            </div>
                        </div>
                    </div>
                    <div>%</div>
                </div>
                <p>The Ordinary is a brand that is specialised in materials chemistry and biochemistry with integrity. The Ordinary is a brand that is specialised in materials chemistry and biochemistry with integrity.(Word Limit: 30)</p>
            </div>
            <div id="frame2" className="frame">
                <div id="image"></div>
                <p className="tc">這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。 (最多字數：80)</p>
            </div>
            <div id="frame3" className="frame">
                <p>The Ordinary is a brand that is specialised in materials chemistry and biochemistry with integrity. The Ordinary is a brand that is specialised in materials chemistry and biochemistry with integrity. <br/><br/> The Ordinary is a brand that is specialised in materials chemistry and biochemistry with integrity. (Word Limit: 60)</p>
            </div>
            <div id="frame4" className="frame">
                <p className="tc">這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。<br/><br/>這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。這是假字。(最多字數：150)</p>
            </div>
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