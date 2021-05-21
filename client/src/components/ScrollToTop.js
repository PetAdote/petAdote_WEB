import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    // "HOC" que desabilita a persistência da posição da altura do rolamento (scroll) da navegação em navegadores que possuem essa implementação. 
    const { pathname } = useLocation();

    useEffect(() => {
        if (window.history.scrollRestoration){
            window.history.scrollRestoration = 'manual';
            // https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
        }

        // window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

export default ScrollToTop;