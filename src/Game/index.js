import React, { useState, useEffect } from 'react';

const Game = props => {
    const [size, setSize] = useState(null);

    useEffect(()=>{
        const onResize = () => {
            if(window.innerWidth > window.innerHeight)
                setSize('horizontal');
            else
                setSize('vertical');
        }
        onResize();
        window.addEventListener('resize',onResize);
        return() => {
            window.removeEventListener('resize',onResize);
        }
    },[]);
    

    return (
        <div ref={props.gameElem} id="game">
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
                        <div>You will have 1 mins to find it!</div>
                        <div></div>
                        <div></div>
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
                        Find out the product which give you a better smile !
                    </div>
                    <div id="tips">You will have 1 min to find it!</div>
                </div>
                <div id="clock">
                    <div id="time">00:00</div>
                    <div>left</div>
                </div>
                <div className="center">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Game;