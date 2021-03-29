import React, { useState } from 'react';

const BackToTop = () =>{
    const [showScroll, setShowScroll] = useState(false)

    const backToTop = () =>{
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const checkScroll = () => {
        if (!showScroll && window.pageYOffset > 300){
            setShowScroll(true)
        } else if (showScroll && window.pageYOffset <= 300){
            setShowScroll(false)
        }
    };

    window.addEventListener('scroll', checkScroll)

    return showScroll ? (
        <button className="scrollTop btn btn-secondary" onClick={backToTop}>
            <i className="fa fa-2x fa-arrow-up" />
        </button>
    ) : null;
}

export default BackToTop;
